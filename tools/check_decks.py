#!/usr/bin/env python3
"""Проверка презентаций каталога: скорость загрузки и телефон.

Запуск: python3 tools/check_decks.py [<id> ...]
Без аргументов проверяет все папки с index.html. Код выхода 1 — есть ошибки.
Исключения с причиной — tools/deck-exceptions.json (ошибка становится предупреждением).
"""
import json, os, re, struct, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP = {'instructions', 'i', 'components', '.git', '.github', 'tools'}
LIMITS = {
    'html_kb': 300,          # index.html без картинок и демо
    'inline_img_kb': 20,     # одна картинка base64 внутри страницы
    'srcdoc_kb': 30,         # демо в srcdoc — выносить в demo/*.html
    'image_kb': 400,         # один файл картинки рядом со страницей
    'cover_kb': 300,         # cover.png
}
PHONE_MQ = re.compile(r'@media[^{]*max-width:\s*(\d+)px')


def kb(n):
    return round(n / 1024)


def png_size(path):
    with open(path, 'rb') as f:
        head = f.read(24)
    if head[:8] != b'\x89PNG\r\n\x1a\n':
        return None
    return struct.unpack('>II', head[16:24])


def check(deck, catalog):
    errs, warns = [], []
    page = os.path.join(ROOT, deck, 'index.html')
    s = open(page, encoding='utf-8').read()
    size = len(s.encode('utf-8'))
    inline = [len(m.group(1)) * 3 // 4 for m in re.finditer(r'data:image/[a-z+]+;base64,([A-Za-z0-9+/=]+)', s)]
    big_inline = [x for x in inline if x > LIMITS['inline_img_kb'] * 1024]
    if big_inline:
        errs.append(f'{len(big_inline)} картинок вшито в страницу (base64, до {kb(max(big_inline))} КБ) — вынести в img/*.webp с loading="lazy"')
    srcdocs = [len(m.group(1)) for m in re.finditer(r'srcdoc="([^"]*)"', s)]
    if any(x > LIMITS['srcdoc_kb'] * 1024 for x in srcdocs):
        errs.append(f'демо вшито в srcdoc ({kb(max(srcdocs))} КБ) — вынести в demo/*.html и грузить через data-src')
    if size > LIMITS['html_kb'] * 1024:
        errs.append(f'index.html весит {kb(size)} КБ (лимит {LIMITS["html_kb"]})')

    # Телефон: стейдж 1280×720 не должен сжиматься, нужна лента в одну колонку.
    if re.search(r'#stage\s*\{[^}]*width:\s*1280px', s):
        if not re.search(r'#stage\s*\{[^}]*flex:\s*none', s):
            errs.append('#stage без flex: none — на телефоне стейдж сжимается до ширины экрана')
        if not any(int(w) >= 600 for w in PHONE_MQ.findall(s)):
            errs.append('нет режима телефона (@media max-width ≥ 600px со слайдами лентой)')
        if 'matchMedia' not in s:
            errs.append('JS не знает о телефоне (нет matchMedia) — масштаб и демо на телефоне')
    elif not PHONE_MQ.search(s):
        warns.append('нет @media max-width — проверьте телефон руками')

    # Дубли стилей: одно и то же правило целиком дважды — признак сборки «поверх прошлой сборки».
    css = ''.join(re.findall(r'<style[^>]*>(.*?)</style>', s, re.S))
    full = [re.sub(r'\s+', ' ', m.group(0)).strip() for m in re.finditer(r'[.#][^{}@]{2,120}\{[^{}]{12,}\}', css)]
    seen, dup = set(), set()
    for r in full:
        (dup if r in seen else seen).add(r)
    if len(dup) >= 3:
        errs.append(f'{len(dup)} CSS-правил продублированы целиком (напр. «{sorted(dup)[0][:60]}…») — сборка дописывает стили повторно')
    elif dup:
        warns.append(f'{len(dup)} CSS-правил продублированы целиком')

    # Картинки: ленивые, кроме обложки/фото первого слайда; без src у iframe.
    imgs = re.findall(r'<img\b[^>]*>', s)
    eager = [i for i in imgs if ' src=' in i and 'loading="lazy"' not in i and 'coverPhoto' not in i and 'cover-photo' not in i and 'data:' not in i]
    if len(eager) > 2:
        warns.append(f'{len(eager)} <img> без loading="lazy"')
    if re.search(r'<iframe\b(?![^>]*data-src)[^>]*\ssrc="(?!about:)', s):
        errs.append('iframe с src сразу — грузить демо по data-src, когда открыт слайд')
    for root, _, files in os.walk(os.path.join(ROOT, deck)):
        for f in files:
            p = os.path.join(root, f)
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.gif')) and f != 'cover.png':
                if os.path.getsize(p) > LIMITS['image_kb'] * 1024:
                    errs.append(f'{os.path.relpath(p, ROOT)} весит {kb(os.path.getsize(p))} КБ (лимит {LIMITS["image_kb"]})')

    # Превью ссылки и каталог.
    cover = os.path.join(ROOT, deck, 'cover.png')
    if not os.path.exists(cover):
        errs.append('нет cover.png')
    else:
        dim = png_size(cover)
        if dim != (1280, 720):
            errs.append(f'cover.png {dim}, нужен 1280×720')
        if os.path.getsize(cover) > LIMITS['cover_kb'] * 1024:
            errs.append(f'cover.png {kb(os.path.getsize(cover))} КБ (лимит {LIMITS["cover_kb"]})')
    for m in re.finditer(r'<meta property="og:(?:url|image)" content="([^"]+)"', s):
        if not m.group(1).startswith('https://slides.aleksishmanov.ru/'):
            errs.append(f'og-ссылка не абсолютная: {m.group(1)}')
    if f'id: "{deck}"' not in catalog:
        errs.append('нет записи в catalog.js')
    else:
        m = re.search(r'id: "' + re.escape(deck) + r'".*?slides: (\d+)', catalog, re.S)
        n = len(re.findall(r'<section class="slide', s))
        if m and n and int(m.group(1)) != n:
            warns.append(f'в catalog.js slides: {m.group(1)}, а слайдов {n}')
    return errs, warns, size


def main():
    catalog = open(os.path.join(ROOT, 'catalog.js'), encoding='utf-8').read()
    exc = {}
    ep = os.path.join(ROOT, 'tools', 'deck-exceptions.json')
    if os.path.exists(ep):
        exc = json.load(open(ep, encoding='utf-8'))
    decks = sys.argv[1:] or sorted(d for d in os.listdir(ROOT)
                                   if d not in SKIP and os.path.isfile(os.path.join(ROOT, d, 'index.html')))
    failed = False
    for d in decks:
        errs, warns, size = check(d, catalog)
        if d in exc:
            warns = [e + ' (исключение: ' + exc[d] + ')' for e in errs] + warns
            errs = []
        mark = '✗' if errs else ('!' if warns else '✓')
        print(f'{mark} {d}  ({kb(size)} КБ)')
        for e in errs:
            print('    ошибка:', e)
        for w in warns:
            print('    внимание:', w)
        failed |= bool(errs)
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()

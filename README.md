# slides-catalog

Каталог презентаций для `slides.aleksishmanov.ru`.

## Структура

- `/` — каталог доступных презентаций.
- `/<presentation-id>/` — отдельная презентация по стабильной прямой ссылке.
- `/<presentation-id>/presentation.pdf` — PDF-версия, если она есть.

Опубликованные презентации:

- `po-workspace-bft-plugin` — БФТ под управлением руководителя
- `sprint-under-manager` — Спринты под управлением руководителя

## Как добавить презентацию

1. Создать папку с уникальным ID: `mkdir <presentation-id>`.
2. Положить HTML-презентацию в `<presentation-id>/index.html`.
3. Добавить обложку `<presentation-id>/cover.png` — это первый слайд презентации.
   Она же уходит в превью ссылки, поэтому снимок должен быть актуальным.
4. Прописать в `<head>` презентации блок превью (см. ниже) — без него
   Threads и Telegram покажут ссылку без картинки.
5. Добавить запись в `catalog.js`.
6. Закоммитить изменения в `main` — GitHub Pages обновит сайт автоматически.

Файл `CNAME` привязывает Pages к `slides.aleksishmanov.ru`.

## Превью ссылок (Open Graph)

Threads, Telegram, Slack и другие клиенты не выполняют JavaScript: они читают
только статические `<meta>` в `<head>`. Поэтому каждая страница описывает себя
сама.

- `/` — превью о сайте, картинка `og-cover.png` (1200×630).
- `/<presentation-id>/` — превью презентации, картинка — её первый слайд
  `cover.png`.
- `404.html` — нейтральное превью, чтобы битая ссылка не разворачивалась в
  пустую карточку.

Правила, которые легко нарушить:

- **Все URL в `og:`-тегах абсолютные**, с `https://slides.aleksishmanov.ru`.
  Относительный путь краулеры не разрешают — картинка просто не появится.
- `og:image:width` и `og:image:height` должны совпадать с реальным файлом.
- Минимум 600×315, оптимально 1200×630; файл до 5 МБ, иначе Telegram его
  пропустит.
- Картинка должна открываться без редиректов и авторизации.

Блок для `<head>` новой презентации — подставить ID, заголовок, описание и
реальные размеры `cover.png`:

```html
<meta name="description" content="<описание>">
<link rel="canonical" href="https://slides.aleksishmanov.ru/<presentation-id>/">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Каталог презентаций · Алексей Ишманов">
<meta property="og:locale" content="ru_RU">
<meta property="og:url" content="https://slides.aleksishmanov.ru/<presentation-id>/">
<meta property="og:title" content="<заголовок>">
<meta property="og:description" content="<описание>">
<meta property="og:image" content="https://slides.aleksishmanov.ru/<presentation-id>/cover.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="<ширина cover.png>">
<meta property="og:image:height" content="<высота cover.png>">
<meta property="og:image:alt" content="Первый слайд презентации «<заголовок>»">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<заголовок>">
<meta name="twitter:description" content="<описание>">
<meta name="twitter:image" content="https://slides.aleksishmanov.ru/<presentation-id>/cover.png">
<meta name="twitter:image:alt" content="Первый слайд презентации «<заголовок>»">
```

Если презентация пересобирается генератором, блок нужно вернуть в `<head>`
после каждой пересборки.

### Как проверить

- Threads и Facebook: https://developers.facebook.com/tools/debug/ — там же
  кнопка «Scrape Again».
- Telegram: написать боту [@WebpageBot](https://t.me/WebpageBot) и отправить
  ссылку, чтобы сбросить кэш превью.
- Из терминала: `curl -s https://slides.aleksishmanov.ru/ | grep 'og:'` —
  видно ровно то, что читает краулер.

Мессенджеры кэшируют превью надолго. После правки `og:`-тегов старая карточка
может ещё какое-то время показываться — кэш сбрасывается ссылками выше.

## DNS

У регистратора домена нужна запись:

- тип: `CNAME`
- имя: `slides`
- значение: `kibarik.github.io`

После распространения DNS в настройках GitHub Pages можно включить принудительный HTTPS.

## Docker

Сайт не требует сборки: это обычные HTML, CSS, JavaScript и статические файлы.

Контейнер запускает Nginx на порту `8080`:

```bash
docker build -t slides-catalog .
docker run --rm -p 8080:8080 slides-catalog
```

Проверка после запуска:

- `http://localhost:8080/`
- `http://localhost:8080/po-workspace-bft-plugin/`
- `http://localhost:8080/sprint-under-manager/`

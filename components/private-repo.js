/* Ссылки на закрытые репозитории: по клику вместо 404 на GitHub — подсказка и запрос демо в Telegram.

   Подключение (после разметки, в любом месте страницы):
     <a href="https://github.com/po-helper-org/<репо>" data-private-repo>github.com/po-helper-org/<репо> 🔒</a>
     <script src="/components/private-repo.js" defer></script>

   Ссылка остаётся обычной: у кого есть доступ — откроет её из попапа («Открыть на GitHub»),
   средняя кнопка мыши и «Открыть в новой вкладке» работают как раньше. */
(function () {
  var TG_DEMO = 'aishmanov_mts';
  var TG_PERSONAL = 'kibarik';
  var EMAIL = 'cvyatoslavka@gmail.com';

  function pageUrl() { return location.origin + location.pathname + location.hash; }
  function message() {
    return 'Я с презентации ' + pageUrl() + ', хочу себе такую же, давай запланируем встречу и демку. ' +
      'Или просто скинь доступ к репозиторию — я сам подниму для себя без твоей помощи';
  }

  var css =
    '#prv{position:fixed;inset:0;z-index:100;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(8,8,8,.45)}' +
    '#prv.on{display:flex}' +
    '#prv .box{position:relative;width:100%;max-width:460px;background:var(--bg,#efeee8);color:var(--ink,#080808);border:1px solid var(--ink,#080808);box-shadow:8px 8px 0 var(--blue,#2437ed);padding:28px 26px 22px;font-family:inherit;text-align:left}' +
    '#prv .x{position:absolute;right:10px;top:8px;font:inherit;font-size:22px;line-height:1;background:none;border:none;color:inherit;cursor:pointer;padding:6px}' +
    '#prv .lab{font-family:"JetBrains Mono",ui-monospace,Menlo,monospace;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--blue,#2437ed);margin:0 0 10px}' +
    '#prv h3{font-size:26px;line-height:1.12;letter-spacing:-.03em;font-weight:800;margin:0 0 12px}' +
    '#prv p{font-size:16px;line-height:1.45;color:var(--muted,#51514b);margin:0 0 18px}' +
    '#prv .repo-name{font-family:"JetBrains Mono",ui-monospace,Menlo,monospace;font-size:14px;color:var(--ink,#080808);word-break:break-all}' +
    '#prv .go{display:block;text-align:center;font-size:17px;font-weight:700;text-decoration:none;color:#fff;background:var(--blue,#2437ed);padding:14px 16px;border:none}' +
    '#prv .go:hover{filter:brightness(1.1)}' +
    '#prv .hint{font-size:13px;color:var(--muted,#51514b);margin:10px 0 0;min-height:1em}' +
    '#prv .alt{border-top:1px solid var(--line,#c9c8c2);margin-top:16px;padding-top:14px;font-size:14px;line-height:1.7;color:var(--muted,#51514b)}' +
    '#prv .alt a{color:var(--ink,#080808);font-weight:600}' +
    '#prv .alt .gh{color:var(--muted,#51514b);font-weight:400}';

  var box, goLink, nameEl, ghLink, hint, lastFocus;

  function build() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    box = document.createElement('div');
    box.id = 'prv';
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'prvTitle');
    box.innerHTML =
      '<div class="box">' +
        '<button class="x" type="button" aria-label="Закрыть">✕</button>' +
        '<p class="lab">🔒 Закрытый репозиторий</p>' +
        '<h3 id="prvTitle">Код пока открыт не всем</h3>' +
        '<p>Репозиторий <span class="repo-name"></span> закрытый. Напишите в Telegram — покажу, как это работает у меня, ' +
          'и помогу поднять у вас. Или пришлю доступ к коду.</p>' +
        '<a class="go" target="_blank" rel="noopener">Отправить запрос на демо</a>' +
        '<p class="hint" aria-live="polite"></p>' +
        '<div class="alt">' +
          'Email: <a href="mailto:' + EMAIL + '" data-mail>' + EMAIL + '</a><br>' +
          'Личный Telegram: <a href="https://t.me/' + TG_PERSONAL + '" target="_blank" rel="noopener">t.me/' + TG_PERSONAL + '</a><br>' +
          '<a class="gh" target="_blank" rel="noopener">Есть доступ? Открыть на GitHub ↗</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(box);
    goLink = box.querySelector('.go'); nameEl = box.querySelector('.repo-name');
    ghLink = box.querySelector('.gh'); hint = box.querySelector('.hint');
    box.querySelector('.x').onclick = close;
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    goLink.addEventListener('click', function () {
      // Telegram Desktop и веб иногда не подставляют ?text= — кладём текст в буфер про запас.
      try { navigator.clipboard.writeText(message()).then(function () {
        hint.textContent = 'Текст запроса скопирован — если Telegram его не подставил, просто вставьте.';
      }, function () {}); } catch (e) {}
    });
  }

  function open(a) {
    if (!box) build();
    var href = a.getAttribute('href');
    nameEl.textContent = href.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '');
    ghLink.href = href;
    var text = encodeURIComponent(message());
    goLink.href = 'https://t.me/' + TG_DEMO + '?text=' + text;
    box.querySelector('[data-mail]').href = 'mailto:' + EMAIL + '?subject=' +
      encodeURIComponent('Демо: ' + (document.title || 'презентация')) + '&body=' + text;
    hint.textContent = '';
    lastFocus = document.activeElement;
    box.classList.add('on');
    goLink.focus();
  }

  function close() {
    box.classList.remove('on');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[data-private-repo]');
    if (!a) return;
    e.preventDefault();
    open(a);
  });
  // Пока попап открыт, стрелки и пробел не листают слайды, Esc закрывает только попап.
  document.addEventListener('keydown', function (e) {
    if (!box || !box.classList.contains('on')) return;
    if (e.key === 'Escape') close();
    if (e.key !== 'Tab' && e.key !== 'Enter') e.stopImmediatePropagation();
  }, true);
})();

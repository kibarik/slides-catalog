const presentations = [
  {
    id: "claude-desktop-zai-macos",
    title: "Claude Desktop с Китайскими моделями",
    description: "Практикум: Claude Code, GLM и пошаговый запуск в российских реалиях.",
    cover: "claude-desktop-zai-macos/cover.png",
    slides: 9,
    updated: "17 сентября 2026"
  },
  {
    id: "po-workspace-bft-plugin",
    title: "БФТ под управлением руководителя",
    description: "Как AI-агент собирает бизнес-контекст и превращает его в требования для согласования.",
    cover: "po-workspace-bft-plugin/cover.png",
    slides: 13,
    updated: "11 сентября 2026"
  },
  {
    id: "sprint-under-manager",
    title: "Спринты под управлением руководителя",
    description: "Как руководителю держать спринты четырёх команд без обхода: отчёт PO приходит сам каждое утро, «Факт спринта» — для комитета, а замечания техлидов ИИ-агент сам переносит в Jira после ✅.",
    cover: "sprint-under-manager/cover.png",
    slides: 20,
    updated: "15 октября 2026"
  },
  {
    id: "okr-quarter-planning",
    title: "Планирование квартала за час разговора с ИИ",
    description: "Квартал — огромный и ресурсоёмкий сбор и аналитика данных. Как пройти весь путь — итоги прошлого квартала, планы на следующий, декомпозиция с техлидами — за час голосового разговора с ИИ-помощником.",
    cover: "okr-quarter-planning/cover.png",
    slides: 14,
    updated: "7 октября 2026"
  },
  {
    id: "po-news-feed",
    title: "Лента вместо 100500 чатов",
    description: "Как PO наблюдать за всем вокруг и не терять внимание: чаты, почта и трекеры в одной ленте, упоминания сразу и ИИ-агент, который сверяет происходящее с целями.",
    cover: "po-news-feed/cover.png",
    slides: 11,
    updated: "13 октября 2026"
  },
  {
    id: "sprint-business-report",
    title: "Бизнес-отчёт спринта: ценность от целей квартала",
    description: "Какую бизнес-ценность команда создала за спринт в контексте целей квартала — и как чистота отчёта наводит порядок в JIRA разговором с ИИ-агентом.",
    cover: "sprint-business-report/cover.png",
    slides: 16,
    updated: "14 октября 2026"
  },
  {
    id: "po-morning-brief",
    title: "Утренняя планёрка с ИИ-агентом",
    description: "Как ИИ-агент держит фокус PO и весь контекст для решений: разовая настройка, одна команда — и полная утренняя сводка по задачам, встречам, договорённостям, рискам и командам. С живым примером моего отчёта.",
    cover: "po-morning-brief/cover.png",
    slides: 13,
    updated: "12 октября 2026"
  },
  {
    id: "sprint-blockers-report",
    title: "Где и почему команда разработки была заблокирована",
    description: "Отчёт по блокерам за квартал для руководителя: ИИ-агент разбирает историю JIRA, скрипт считает дни ожидания — видно, кого ждали, где стояли задачи и что держит сейчас.",
    cover: "sprint-blockers-report/cover.png",
    slides: 12,
    updated: "15 октября 2026"
  },
  {
    id: "cortex-second-brain",
    title: "Второй мозг руководителя",
    description: "ИИ-помощник, который помнит договорённости, отличает факт от мнения и знает цели квартала. Методология poh-cortex и инструкция, как завести такую память себе за вечер.",
    cover: "cortex-second-brain/cover.png",
    slides: 15,
    updated: "18 октября 2026"
  }
];

const grid = document.querySelector("#catalog-grid");
const count = document.querySelector("#deck-count");

const plural = (n) => {
  const d = n % 10, dd = n % 100;
  if (d === 1 && dd !== 11) return "презентация";
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return "презентации";
  return "презентаций";
};
count.textContent = `${presentations.length} ${plural(presentations.length)}`;

grid.innerHTML = presentations.map((deck) => `
  <a class="deck-card" href="${deck.id}/" aria-label="Открыть презентацию: ${deck.title}">
      <div class="deck-cover"><img src="${deck.cover}" alt="" width="1280" height="720" loading="lazy" decoding="async"></div>
    <div class="deck-copy">
      <p class="deck-id">/${deck.id}</p>
      <h2 class="deck-title">${deck.title}</h2>
      <p class="deck-description">${deck.description}</p>
      <div class="deck-meta">
        <span>${deck.slides} слайдов · ${deck.updated}</span>
        <span class="deck-open">Открыть ↗</span>
      </div>
    </div>
  </a>
`).join("");

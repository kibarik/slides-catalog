const presentations = [
  {
    id: "hermes-bridge-hq",
    title: "Штаб корпоративных агентов в кармане: Claude Code с телефона",
    description: "Поручаю задачу в Claude Code с телефона, а Hermes-агенты внутри корпоративного контура делают её в Jira, Confluence и мессенджерах. Данные и ключи остаются в контуре, два режима — A2A и MCP.",
    cover: "hermes-bridge-hq/cover.png",
    slides: 13,
    updated: "21 октября 2026"
  },
  {
    id: "po-news-gazette",
    title: "Новостная газета продакта: утренний выпуск по вашим целям",
    description: "Утром приходит газета: полная сводка изменений вокруг продакта с учётом целей квартала и специфики команды. Что уже работает в ленте — выпуск, ИИ-редакция, оценки — и следующий шаг: персональный профиль продакта.",
    cover: "po-news-gazette/cover.png",
    slides: 13,
    updated: "21 октября 2026"
  },
  {
    id: "service-blueprint-backlog",
    title: "Service Blueprint из БФТ: бэклог, который рисует карту",
    description: "ИИ-агент раскладывает БФТ в автономный проект Backlog.md — задачи команд, технические карточки с UserStory, JobStory и процессом в BPMN, требования к экранам, — а скрипт собирает из него карту: что видят люди, что делает каждая команда и как это работает.",
    cover: "service-blueprint-backlog/cover.png",
    slides: 17,
    updated: "19 октября 2026"
  },
  {
    id: "po-morning-brief",
    title: "Утренний бриф PO: лента, команды, спринт и обещания",
    description: "Четыре части утра PO: лента всех чатов и утренний выпуск, PDF-отчёт по командам и мини-приложение «Дейли», отчёт по спринту для техлида и бизнеса, персональный ИИ-агент — Инбокс как точка контроля обещаний.",
    cover: "po-morning-brief/cover.png",
    slides: 41,
    updated: "19 октября 2026"
  },
  {
    id: "sprint-daily-report",
    title: "Отчёт спринта: что техлиду сделать сегодня",
    description: "Две страницы PDF на команду каждое утро: успеваем ли к концу спринта, что держит команду и какие задачи сдвинуть сегодня — с номерами из Jira. Сам собирает данные, без ручной работы.",
    cover: "sprint-daily-report/cover.png",
    slides: 13,
    updated: "19 октября 2026"
  },
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
    updated: "19 октября 2026"
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
    updated: "19 октября 2026"
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
    slides: 11,
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

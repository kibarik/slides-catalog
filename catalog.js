const presentations = [
  {
    id: "po-workspace-bft-plugin",
    title: "БФТ под управлением руководителя",
    description: "Как AI-агент собирает бизнес-контекст и превращает его в требования для согласования.",
    cover: "po-workspace-bft-plugin/cover.png",
    slides: 12,
    updated: "11 сентября 2026"
  }
];

const grid = document.querySelector("#catalog-grid");
const count = document.querySelector("#deck-count");

count.textContent = `${presentations.length} ${presentations.length === 1 ? "презентация" : "презентации"}`;

grid.innerHTML = presentations.map((deck) => `
  <a class="deck-card" href="${deck.id}/" aria-label="Открыть презентацию: ${deck.title}">
    <div class="deck-cover"><img src="${deck.cover}" alt="" width="1280" height="720"></div>
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

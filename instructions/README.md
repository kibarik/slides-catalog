# Статичные инструкции практикума

Стабильный адрес каждой инструкции: `https://slides.aleksishmanov.ru/instructions/<slug>/`.

Чтобы добавить инструкцию:

1. Добавить объект в `guide-data.js`.
2. Создать `<slug>/index.html` по существующему шаблону и указать `data-guide="<slug>"`.
3. Сгенерировать QR в `qr/<slug>.svg` на тот же публичный URL.
4. На слайде использовать только стабильный URL и QR. Подробные шаги остаются на странице инструкции.

Компоненты `../components/workshop-timer.js` и `../components/workshop-poll.js` не зависят от конкретной презентации. Готовые независимые оболочки для слайдов находятся в `workshop-timer-sidebar.js` и `workshop-poll-sidebar.js`. Пример подключения описан в `../components/README.md`.

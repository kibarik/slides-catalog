# Компоненты практикума

Два независимых сайдбара можно подключить к любой HTML-презентации каталога.

```html
<script src="../components/workshop-timer.js"></script>
<script src="../components/workshop-poll.js"></script>
<script src="../components/workshop-timer-sidebar.js"></script>
<script src="../components/workshop-poll-sidebar.js"></script>

<workshop-timer-sidebar minutes="10"></workshop-timer-sidebar>
<workshop-poll-sidebar guide="unique-step-id"></workshop-poll-sidebar>
```

`minutes` задаёт начальное значение таймера: 5, 10 или 15 минут. Таймер продолжает работать после закрытия панели, а вкладка показывает оставшееся время и меняет цвет.

`guide` служит ключом локального состояния голосования. Вкладка показывает три счётчика: успех, вопрос, проблема. Раскрытая панель показывает крупные счётчики и локальный журнал событий.

Компоненты закрывают соседний сайдбар при открытии, но не зависят друг от друга. Для общего счётчика между устройствами нужен realtime backend из Issue №3.

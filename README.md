# slides-catalog

Каталог презентаций для `slides.aleksishmanov.ru`.

## Структура

- `/` — каталог доступных презентаций.
- `/<presentation-id>/` — отдельная презентация по стабильной прямой ссылке.
- `/<presentation-id>/presentation.pdf` — PDF-версия, если она есть.

Первая презентация опубликована под ID `po-workspace-bft-plugin`.

## Как добавить презентацию

1. Создать папку с уникальным ID: `mkdir <presentation-id>`.
2. Положить HTML-презентацию в `<presentation-id>/index.html`.
3. Добавить обложку `<presentation-id>/cover.png`.
4. Добавить запись в `catalog.js`.
5. Закоммитить изменения в `main` — GitHub Pages обновит сайт автоматически.

Файл `CNAME` привязывает Pages к `slides.aleksishmanov.ru`.

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

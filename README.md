# Century AI

Сайт публикуется из ветки `main` в GitHub Pages на домене [century-ai.by](https://century-ai.by). Workflow автоматически получает Git LFS-ассеты, собирает статический Next.js-export и публикует каталог `out/`.

## Локальная сборка

В репозитории используются Git LFS для видео. Перед сборкой нужно скачать LFS-объекты, иначе в сборку попадёт маленький pointer-файл вместо видео.

Git LFS должен быть установлен на сервере. Проверка:

```bash
git lfs version
```

Обычный порядок локальной проверки:

```bash
git pull --ff-only
git lfs pull
npm ci
npm run lint
node --test bot-sender/server.test.mjs test/*.test.mjs
npm run build
```

`git pull --ff-only` не создаёт случайных merge-коммитов.

Docker Compose и `bot-sender` сохранены для самостоятельного развёртывания, но GitHub Pages их не запускает. Для локального запуска бота скопируйте `bot-sender/.env.example` в `bot-sender/.env` и заполните значения.

После `git lfs pull` размер главного видео должен быть около 20 MB:

```bash
wc -c public/hero-video/century-main-visual.mp4
```

Ожидаемое значение: `21646405`. Если вывод около `133` байт или начинается с `version https://git-lfs.github.com/spec/v1`, это ещё LFS-pointer — повторите `git lfs pull` и не запускайте сборку до загрузки объекта.

Перед `next build` проект автоматически проверяет все медиафайлы в `public/`: pointer-файлы и повреждённые сигнатуры блокируют сборку.

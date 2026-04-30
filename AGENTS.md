# AGENTS.md

## Контекст
- Бизнес-контекст проекта зафиксирован в `./.prompt/prompt_step_1_main.txt`; опирайся на него, если меняешь контракт или поведение API.
- Репозиторий сейчас содержит минимальный FastAPI-сервис и отдельный TypeSpec-контракт для API календарного бронирования.

## Подход
- В проекте используется `API First`: сначала меняй `typespec/main.tsp`, потом синхронизируй `main.py`.

## Домен
- Роли: один заранее заданный владелец календаря и гости; регистрации и авторизации нет.
- Ключевые сущности: владелец, тип события, слот, бронирование.
- Сценарии владельца: профиль, создание типов событий, просмотр предстоящих бронирований.
- Сценарии гостя: просмотр публичных типов событий, просмотр доступных слотов, создание бронирования.
- На одно и то же время нельзя создать две записи даже для разных типов событий; контракт должен отражать конфликт бронирования.

## Стек и входы
- Python `3.12` из `.python-version`.
- Frontend `Node.js` зафиксирован в `.nvmrc`.
- Зависимости управляются через `uv` (`pyproject.toml`, `uv.lock`).
- Backend: `FastAPI` + `uvicorn`
- Frontend: `Vite` + `TypeScript` + `React` + `Mantine` в `frontend/`
- Основное приложение и текущие маршруты находятся в `main.py`.
- ASGI entrypoint: `main:app`.

## Команды
- Предпочитай `make`-цели для стандартных локальных операций.
- Установить зависимости: `make install`
- Запустить сервер локально: `make run`
- Быстрая проверка импорта приложения: `make check-import`
- Сгенерировать OpenAPI из TypeSpec: `make tsp-compile`
- Установить TypeSpec-зависимости: `make tsp-install`
- Установить frontend-зависимости: `make frontend-install`
- Запустить frontend локально: `make frontend-dev`
- Собрать frontend: `make frontend-build`
- Низкоуровневые команды под `make`: `uv sync`, `uv run uvicorn main:app --reload`, `uv run python -c "import main; print(main.app)"`, `npm --prefix typespec install`, `npm --prefix typespec run compile`, `npm --prefix frontend install`, `npm --prefix frontend run dev`, `npm --prefix frontend run build`

## TypeSpec
- Контракт API лежит в `typespec/` и описывает домен calendar booking отдельно от текущей FastAPI-реализации.
- Основной файл контракта: `typespec/main.tsp`; конфиг эмиттера: `typespec/tspconfig.yaml`.
- Итоговый файл по конфигу: `typespec/calendar-booking.openapi.yaml`.
- TypeSpec toolchain зафиксирован локально в `typespec/package.json`; перед первой компиляцией установи зависимости через `make tsp-install`.
- Проверяй, что спецификация покрывает owner- и public-сценарии из `./.prompt/prompt_step_1_main.txt`, включая правило занятости слота и 14-дневное окно записи.

## Проверки и CI
- В репозитории пока нет локально настроенных `pytest`, `ruff`, `mypy` или `pre-commit`; не придумывай команды `lint`, `test` или `typecheck`, если пользователь явно не попросил их добавить.
- `.github/workflows/hexlet-check.yml` не редактировать и не удалять: workflow автоматически сгенерирован и делегирует проверки внешнему Hexlet action.
- `.github/workflows/README.md` прямо говорит не переименовывать репозиторий.

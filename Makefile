.SHELLFLAGS := -lc
SHELL := /bin/zsh
.PHONY: help install run check-import tsp-install tsp-compile frontend-install frontend-dev frontend-build test-e2e-install test-e2e test-e2e-ui

NVM_INIT = export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && . "$$NVM_DIR/nvm.sh" && nvm use >/dev/null

help:
	@printf "Available targets:\n"
	@printf "  install       Install dependencies with uv\n"
	@printf "  run           Run FastAPI app locally\n"
	@printf "  check-import  Verify main:app import\n"
	@printf "  tsp-compile   Generate OpenAPI from TypeSpec\n"
	@printf "  tsp-install   Install TypeSpec npm dependencies\n"
	@printf "  frontend-install Install frontend npm dependencies\n"
	@printf "  frontend-dev  Run frontend Vite dev server\n"
	@printf "  frontend-build Build frontend bundle\n"
	@printf "  test-e2e-install Install Playwright e2e test dependencies\n"
	@printf "  test-e2e       Run Playwright e2e tests (headless)\n"
	@printf "  test-e2e-ui    Run Playwright e2e tests with UI\n"

install:
	uv sync

run:
	uv run uvicorn main:app --reload

check-import:
	uv run python -c "import main; print(main.app)"

tsp-install:
	$(NVM_INIT) && npm --prefix typespec install

tsp-compile:
	$(NVM_INIT) && npm --prefix typespec run compile

frontend-install:
	$(NVM_INIT) && npm --prefix frontend install

frontend-dev:
	$(NVM_INIT) && npm --prefix frontend run dev

frontend-build:
	$(NVM_INIT) && npm --prefix frontend run build

test-e2e-install:
	$(NVM_INIT) && npm --prefix tests install && npx --prefix tests playwright install --with-deps chromium

test-e2e:
	$(NVM_INIT) && npx --prefix tests playwright test

test-e2e-ui:
	$(NVM_INIT) && npx --prefix tests playwright test --ui

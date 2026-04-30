FROM node:24-alpine AS frontend

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
ENV VITE_API_URL=""
RUN npm run build

FROM python:3.12-slim AS backend

WORKDIR /app

ENV APP_STORAGE=memory
ENV APP_ENV=production

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

COPY main.py domain.py storage.py db.py models.py ./
COPY --from=frontend /app/frontend/dist ./frontend/dist

EXPOSE 8000

CMD uv run uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}


# Build the React frontend and generated preview bundle.
FROM node:20-bookworm-slim AS frontend-build

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci --no-audit --no-fund

COPY frontend/ ./frontend/
COPY backend/ ./backend/
COPY scripts/ ./scripts/

RUN cd frontend && npm run build
RUN node scripts/build_preview_bundle.mjs

# Run FastAPI in the production container.
FROM python:3.12-slim AS runtime

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PORT=10000
ENV PYTHONPATH=/app/backend

WORKDIR /app

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
COPY run.py ./run.py

EXPOSE 10000

CMD ["sh", "-c", "python run.py --host 0.0.0.0 --port ${PORT:-10000}"]

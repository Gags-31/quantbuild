# Build the React frontend and the generated live-preview bundle.
FROM node:20-bookworm-slim AS frontend-build

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && (npm ci --no-audit --no-fund || npm install --no-audit --no-fund)

COPY frontend/ ./frontend/
COPY backend/ ./backend/
COPY scripts/ ./scripts/

RUN cd frontend && npm run build
RUN node scripts/build_preview_bundle.mjs

# Run FastAPI in the production container.
FROM python:3.12-slim AS runtime

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PORT=8080
ENV PYTHONPATH=/app/backend

WORKDIR /app

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
# Freshly built preview bundle wins over any checked-in copy.
COPY --from=frontend-build /app/backend/app/static/preview ./backend/app/static/preview
COPY run.py ./run.py

RUN mkdir -p /app/workspace

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import os,urllib.request;urllib.request.urlopen(u'http://127.0.0.1:%s/api/health' % os.getenv('PORT','8080'))" || exit 1

# Honours whatever PORT the host platform injects (Render=10000, Cloudflare=8080).
CMD ["sh", "-c", "python run.py --host 0.0.0.0 --port ${PORT:-8080}"]

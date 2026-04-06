#!/bin/bash
set -e

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -U user -d zorvyn_finance -q; do
  sleep 1
done
echo "PostgreSQL is ready!"

echo "Running database migrations..."
alembic upgrade head || echo "Migration skipped (tables may already exist)"

echo "Seeding database (idempotent)..."
python seed.py

echo "Starting Zorvyn Finance API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

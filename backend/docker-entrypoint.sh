#!/bin/bash
set -e

echo "Waiting for PostgreSQL to be ready..."
max_attempts=30
attempt=0

until python -c "
import os
import psycopg2
try:
    psycopg2.connect(os.getenv('DATABASE_URL'))
    print('Connected!')
except Exception as e:
    print(f'Connection failed: {e}')
    exit(1)
" 2>/dev/null; do
  attempt=$((attempt + 1))
  if [ $attempt -eq $max_attempts ]; then
    echo "PostgreSQL connection failed after $max_attempts attempts. Exiting."
    exit 1
  fi
  echo "PostgreSQL is unavailable - sleeping (attempt $attempt/$max_attempts)"
  sleep 2
done

echo "PostgreSQL is up - executing migrations..."
alembic upgrade head || echo "Migrations already applied"

echo "Seeding database..."
python seed.py || echo "Database already seeded"

echo "Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}

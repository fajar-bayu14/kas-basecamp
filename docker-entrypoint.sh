#!/bin/sh
set -e
echo "[entrypoint] prisma migrate deploy..."
if ! ./node_modules/.bin/prisma migrate deploy; then
  echo "[entrypoint] baseline missing (P3005), marking existing migrations as applied..."
  for dir in ./prisma/migrations/*/; do
    [ -d "$dir" ] || continue
    name=$(basename "$dir")
    ./node_modules/.bin/prisma migrate resolve --applied "$name" || true
  done
  echo "[entrypoint] retry migrate deploy..."
  ./node_modules/.bin/prisma migrate deploy
fi
echo "[entrypoint] starting server..."
exec node server.js

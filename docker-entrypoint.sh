#!/bin/sh
set -e
echo "[entrypoint] prisma migrate deploy..."
if ! ./node_modules/.bin/prisma migrate deploy; then
  echo "[entrypoint] baseline missing (P3005), marking existing migrations as applied..."
  ./node_modules/.bin/prisma migrate resolve --applied "20261004090100_" || true
  ./node_modules/.bin/prisma migrate resolve --applied "20261006142448_add_cash_expense" || true
  echo "[entrypoint] retry migrate deploy..."
  ./node_modules/.bin/prisma migrate deploy
fi
echo "[entrypoint] starting server..."
exec node server.js

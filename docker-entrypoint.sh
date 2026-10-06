#!/bin/sh
set -e
echo "[entrypoint] prisma migrate deploy..."
./node_modules/.bin/prisma migrate deploy
echo "[entrypoint] starting server..."
exec node server.js

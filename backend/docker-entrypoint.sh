#!/bin/sh
set -e

mkdir -p "${LIBRARY_PATH:-/data/library}" "${DOWNLOAD_TMP_PATH:-/data/tmp}" /app/logs
chown musichub:musichub "${LIBRARY_PATH:-/data/library}" "${DOWNLOAD_TMP_PATH:-/data/tmp}" /app/logs

su-exec musichub npx prisma migrate deploy

exec su-exec musichub node dist/main.js

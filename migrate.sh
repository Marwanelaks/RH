#!/bin/sh
set -e

# Simple retry loop without pg_isready
counter=0
until npx prisma migrate deploy; do
  counter=$((counter+1))
  if [ $counter -gt 10 ]; then
    echo "Failed to connect to PostgreSQL after 10 attempts"
    exit 1
  fi
  echo "Waiting for PostgreSQL to be ready... Attempt $counter"
  sleep 2
done

# Start the application
exec "$@"
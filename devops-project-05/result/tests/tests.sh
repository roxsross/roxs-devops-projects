#!/bin/sh
set -eu

VOTE_URL="${VOTE_URL:-http://vote:8080}"
RESULT_URL="${RESULT_URL:-http://result:4000}"

echo "Esperando a $VOTE_URL ..."
until curl -sSf "$VOTE_URL/healthz" > /dev/null 2>&1; do
  sleep 1
done

curl -sS -X POST --data "vote=b" "$VOTE_URL" > /dev/null
sleep 10

if node render.js "$RESULT_URL" | grep -q '1 vote'; then
  printf '\033[92mTests passed\033[0m\n'
  exit 0
else
  printf '\033[91mTests failed\033[0m\n'
  exit 1
fi

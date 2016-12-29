#!/bin/bash
set -e

sysctl -w net.core.somaxconn=65535 || true

redis-server /opt/redis/redis.conf

exec "$@"

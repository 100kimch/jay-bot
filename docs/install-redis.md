# Install Redis

## Overview

This document describes how to run redis container on docker on Jetson Nano board.

## Steps

- Verifying OS, Docker version

```bash
sudo cat /etc/os-release
sudo docker version
```

- Update apt packages and install Docker 19.03 Binaries

```bash
sudo apt update
sudo apt install curl
curl -sSL https://get.docker.com/ | sh
```

- Check updated Docker version

```bash
sudo docker version
/use/bin/docker-compose version
```

- Run Redis server inside Docker

```bash
docker run --name redis-server -p 6379:6379 -d arm64v8/redis --requirepass hello123
docker ps
```

- Checking the Redis logs

```bash
docker logs -f 32d2f2
```

- Running the Redis CLI

```bash
docker ps
docker exec -it 32d2f2 sh
redis-cli
ping
```

- Verifying Redis command line interface

```bash
# redis-cli
127.0.0.1:6379> ping
PONG
127.0.0.1:6379> set name jaycol
OK
127.0.0.1:6379> get name
"jaycol"
```

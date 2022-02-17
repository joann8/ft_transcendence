#!/bin/sh

rm -rf /tmp/pg_db
docker system prune
docker volume prune
docker rmi $(docker images -a -q)

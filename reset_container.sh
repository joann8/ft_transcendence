#!/bin/sh

docker system prune
docker volume prune
docker rmi $(docker images -a -q)

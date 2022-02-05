#!/bin/bash

for dir in ../*/; do
  dirName=$(echo "$dir" | sed -e 's/[\.\/]//g')
  if [[ $dirName != "nats-test" && $dirName != "infra" && $dirName != "scripts" ]]; then
        echo "name: test-$dirName

on: pull_request

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v2
            - run: cd $dirName && npm i && npm run test:ci
" >> "../.github/workflows/$dirName.yml"
  fi
done
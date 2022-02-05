#!/bin/bash

for dir in */; do
  dirName=${dir::-1}
  if [[ $dirName != "nats-test" && $dirName != "infra" && $dirName != "scripts" ]]; then
        [[ -e ".github/workflows/$dirName.yml" ]] && rm ".github/workflows/$dirName.yml"
        echo "name: test-$dirName

on:
    pull_request:
        paths:
            - '$dirName/**'

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v2
            - run: cd $dirName && npm i && npm run test:ci
" >> ".github/workflows/$dirName.yml"
  fi
done

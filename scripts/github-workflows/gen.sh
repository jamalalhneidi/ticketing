#!/bin/bash

[[ -z $1 ]] && echo "Error: Provide a template" && exit

for dir in */; do
  dirName=${dir::-1}
  if [[ $dirName != "nats-test" && $dirName != "infra" && $dirName != "scripts" ]]; then
      filePath="./.github/workflows/$1-$dirName.yml"
      [[ -e "$filePath" ]] && rm "$filePath"
       sed -e 's/%name/'"$dirName"'/g' "./scripts/github-workflows/$1.yml" >> "$filePath"
  fi
done
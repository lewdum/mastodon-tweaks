#!/bin/sh
npx web-ext build \
  --ignore-files=tsconfig.json README.md src scripts

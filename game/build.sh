#!/bin/sh

mkdir -p dist && rm dist/*

tsc \
  --target es2015 \
  --module amd \
  --outFile dist/xsh.js \
  --removeComments \
  ./scripting/interpreter.ts

npm run minify

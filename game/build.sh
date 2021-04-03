#!/bin/sh

mkdir -p dist && rm dist/*

tsc \
  --target es2015 \
  --module amd \
  --outFile dist/xsh.js \
  --removeComments \
  ./scripting/interpreter.ts

jsmin --level 3 --overwrite 'dist/xsh.js'

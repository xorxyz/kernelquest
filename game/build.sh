#!/bin/sh

rm -r dist && mkdir -p dist

tsc \
  --target es6 \
  --module es2020 \
  --outDir dist \
  --removeComments \
  --isolatedModules \
  ./scripting/interpreter.ts

# ./node_modules/.bin/jsmin --level 3 --overwrite 'dist/interpreter.js'

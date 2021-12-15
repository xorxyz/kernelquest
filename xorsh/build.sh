#!/bin/sh

rm -r dist && mkdir -p dist

tsc \
  --target es6 \
  --module system \
  --outDir dist \
  --removeComments \
  --isolatedModules \
  ./interpreter.ts

# ./node_modules/.bin/jsmin --level 3 --overwrite 'dist/interpreter.js'

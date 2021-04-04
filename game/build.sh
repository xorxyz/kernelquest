#!/bin/sh

mkdir -p dist &&\
rm dist/* &&\
tsc \
  --target es6 \
  --module amd \
  --outFile dist/xsh.js \
  --removeComments \
  ./scripting/interpreter.ts &&\
./node_modules/.bin/jsmin --level 3 --overwrite 'dist/xsh.js'

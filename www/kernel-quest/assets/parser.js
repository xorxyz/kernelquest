// xor shell v0.1
// copyright (c) 2019, 2020, 2021 Jonathan Dupré <jonathan@diagonal.sh>

import { TokenType } from './scanner.js';

export class Parser {
  constructor(tokens) {
    this.current = 0;
    this.tokens = tokens;
  }
  parse() {
  }
  next() {
    if (!this.isAtEnd()) { this.current++; }
    return this.previous();
  }
  isAtEnd() {
    return typeof this.peek() === typeof TokenType.EOF;
  }
  peek() {
    return this.tokens[this.current];
  }
  previous() {
    return this.tokens[this.current - 1];
  }
  check(type) {
    if (this.isAtEnd()) { return false; }
    return typeof this.peek() === typeof type;
  }
}

import * as readline from 'readline';
import { Interpreter } from './interpreter';

class Repl {
  interpreter = new Interpreter()
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'xor> '
  })

  constructor () {
    this.rl
      .on('line', this.handleLine.bind(this))
      .on('close', this.close.bind(this))
      .prompt();
  }

  async handleLine (line: string) {
    await this.interpreter.interpret(line.trim());

    this.rl.prompt();
  }

  close () {
    console.log('thanks, bye!');
    process.exit(0);
  }
}

new Repl();

import * as readline from 'readline';
import { Stack } from '../../lib/stack';
import { Compiler } from './compiler';
import { Execution, Thing } from './interpreter';

class Repl {
  line: string = ''
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'xor> '
  })
  compiler = new Compiler()
  stack: Stack<Thing> = new Stack();

  constructor () {
    this.rl.on('line', async (line) => {
      await this.interpret(line.trim());

      this.rl.prompt();
    }).on('close', () => {
      console.log('Have a great day!');
      process.exit(0);
    });
    
    this.rl.prompt();
  }

  async interpret (line: string) {
    console.log('processing...');

    const program = this.compiler.compile(line);
    const execution = new Execution(program);

    execution.start(this.stack)

    console.log('ok. stack:', execution.stack);
  }
}

new Repl();

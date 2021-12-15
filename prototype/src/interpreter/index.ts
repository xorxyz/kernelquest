import { Stack } from "../../../lib/stack";
import { StandardLibrary } from "./stdlib";
import { Compiler, Word } from './compiler';
import { Interpretation } from "./interpretation";

export class Interpreter {
  stack: Stack<Word> = new Stack()
  compiler = new Compiler(StandardLibrary)

  interpret (line: string) {  
    const program = this.compiler.compile(line);
    const interpretation = new Interpretation(program);

    interpretation.start(this.stack);
  }
}

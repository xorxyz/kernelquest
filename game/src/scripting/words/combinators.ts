import { Atom } from "../atom";
import { createMeaning } from "../meaning";
import { Quotation } from "../types/quotation";
import { Word } from "../types/word";

// [A] -> A
export const i = createMeaning({
  args: {
    quotation: Quotation,
  },
  sig: ['quotation'],
  interpret(_, { quotation }, queue): null {
    quotation.atoms.forEach(atom => {
      queue.add(atom);
    });
  
    return null;
  },
});

// [A] B -> A B 
export const dip = createMeaning({
  args: {
    atom: Atom,
    program: Quotation,
  },
  sig: ['atom', 'program'],
  interpret(_, { atom, program }, queue): null {
    queue.add(program);
    queue.add(new Word('i'))
    queue.add(atom);
    queue.add(atom);

    return null;
  },
});

export const map = createMeaning({
  args: {
    list: Quotation,
    program: Quotation,
  },
  sig: ['list', 'program'],
  interpret(stack, { list, program }): null {
    // 

    return null;
  },
});

export const filter = createMeaning({
  args: {
    list: Quotation,
    program: Quotation,
  },
  sig: ['list', 'program'],
  interpret(stack, { list, program }): null {
    // 

    return null;
  },
});

export const reduce = createMeaning({
  args: {
    list: Quotation,
    program: Quotation,
  },
  sig: ['list', 'program'],
  interpret(stack, { list, program }): null {
    // 

    return null;
  },
});

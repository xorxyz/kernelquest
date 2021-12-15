import { Interpreter } from "../interpreter";

export class EditorTerminal {
  messagesEl
  interpreter: Interpreter
  constructor (textInputEl, messagesEl: HTMLDivElement) {
    this.messagesEl = messagesEl;
    this.interpreter = new Interpreter();

    textInputEl.addEventListener('change', async () => {
      this.say(textInputEl.value);

      try {
        this.interpreter.interpret(textInputEl.value);
      } catch (err) {
        if (err instanceof Error) this.say('err: ' + err.message);
      }
  
      this.say('stack> ' + this.interpreter.stack.join(' '));

      textInputEl.value = '';
    })
  }

  say (msg) {
    const lineEl = document.createElement('div');

    lineEl.innerText = msg;

    this.messagesEl.appendChild(lineEl);

    (this.messagesEl).scrollTo({
      // behavior: 'smooth',
      top: this.messagesEl.scrollHeight
    })

  }
}

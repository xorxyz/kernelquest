import Interpreter from './interpreter.js';
const prompt = '> '

document.addEventListener('DOMContentLoaded', () => {
  console.debug('game.js: DOMContentLoaded');
  const outputEl = document.getElementById('output');
  const inputEl = document.getElementById('prompt');

  if (!outputEl || !inputEl) {
    throw new Error('couldn\'t find required elements')
  };

  const sh = new Interpreter();

  inputEl.addEventListener('change', (e) => {
    e.preventDefault();
    const queryEl = document.createElement('pre');
    const resultEl = document.createElement('pre');

    let result;

    try {
      result = sh.exec(e.target.value);
    } catch (err) {
      console.error(err);
      result = (err.message || '');
    }

    queryEl.innerText = prompt + e.target.value
    resultEl.innerText = JSON.stringify(result);
    e.target.value = '';

    outputEl.appendChild(queryEl)
    outputEl.appendChild(resultEl);
  });
})

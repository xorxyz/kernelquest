import Interpreter from './interpreter.js';
const prompt = '> ';

document.addEventListener('DOMContentLoaded', () => {
  console.debug('editor.js: DOMContentLoaded');

  const inputEl = document.getElementById('prompt');
  const outputEl = document.getElementById('output');
  const vmStateEl = document.getElementById('vm-state');

  if (!outputEl || !inputEl || !vmStateEl) {
    throw new Error('couldn\'t find required elements')
  };

  const sh = new Interpreter();
  vmStateEl.innerText = renderVmState(sh);

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
    vmStateEl.innerText = renderVmState(sh);
    
    outputEl.appendChild(queryEl)
    outputEl.appendChild(resultEl);
  });
})

function renderVmState(vm) {
  return `stack: ${JSON.stringify(vm.stack)}`
}
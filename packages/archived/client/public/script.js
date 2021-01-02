const url = 'ws://localhost:3000/ws';
const webSocket = new WebSocket(url);

window.webSocket = webSocket

window.addEventListener('DOMContentLoaded', e => {
  twemoji.parse(document.body)

  webSocket.addEventListener('message', e => {
    console.log(e)
  })

  const formEl = document.getElementById('chat-form')
  const inputEl = document.getElementById('chat-input')
  const messagesEl = document.getElementById('chat-messages')

  formEl.addEventListener('submit', onSubmit)

  function onSubmit (e) {
    e.preventDefault()
    e.stopImmediatePropagation()

    const values = (inputEl.value || '').split(' ')
    const cmd = values[0]
    const args = values.slice(1)

    // give feedback
    const feedbackEl = createMessageEl(inputEl.value)
    messagesEl.appendChild(feedbackEl)

    // clear the input
    inputEl.value = ''

    sendCommand(cmd, args).then(response => {
      feedbackEl.textContent = (JSON.stringify(response))
      messagesEl.scrollTo({ top: messagesEl.scrollHeight })
    })
  }
})

function createMessageEl (message) {
  const el = document.createElement('div')

  el.textContent = message
  el.classList = 'white-50'

  return el
}

async function sendCommand (cmd, args = []) {
  const results = await fetch('http://localhost:3000/jsonrpc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    json: true,
    body: JSON.stringify({
      "jsonrpc": "2.0", 
      "id": 1,
      "method": cmd, 
      "params": args, 
    })
  }).then(r => r.json())

  return results
}

function getTime() {
  const now = new Date();
  const h = String(now.getHours());
  const m = String(now.getMinutes());

  return `${h}:${m}`;
}
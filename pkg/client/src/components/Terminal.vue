<template lang="pug">
  div.ph2(ref="term" style="height: 11rem;")
</template>

<script lang="ts">
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

import WebSocketClient from '../services/WebSocketClient'
import LineEditor from '../services/LineEditor'

const lineEditor = new LineEditor();
const ws = new WebSocketClient()

export default {
  mounted () {
    const fitAddon = new FitAddon()
    const term = new Terminal({ cursorBlink: true })

    term.loadAddon(fitAddon)
    term.open(this.$refs.term)
    term.focus()
    term.onKey(lineEditor.handleKey.bind(lineEditor))

    lineEditor.on('write', (str) => term.write(str))
    lineEditor.on('line', (line) => {
      term.writeln(line)
      ws.sendCommand(line)
    })

    ws.on('message', ({ action, payload }) => {
      if (action === 'event:log') {
        term.writeln(payload.message)
      }
    })

    fitAddon.fit()

    ws.init()
  }
}
</script>

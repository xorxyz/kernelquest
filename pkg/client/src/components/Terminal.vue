<template lang="pug">
  div.br2.pa2(style="background-color: #0A0310;")
    div(ref="term" style="height: 11rem;")
</template>

<script lang="ts">
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

import LineDiscipline from '../services/line-discipline'

const lineEditor = new LineDiscipline();

export default {
  mounted () {
    const fitAddon = new FitAddon()
    const term = new Terminal({ 
      cursorBlink: true, 
      allowTransparency: true,
      theme: {
        background: '#0A0310'
      }
    })

    term.loadAddon(fitAddon)
    term.open(this.$refs.term)
    term.focus()
    term.onKey(lineEditor.handleKey.bind(lineEditor))

    lineEditor.on('write', (str) => term.write(str))
    lineEditor.on('line', (line) => {
      term.writeln(line)

      this.$emit('line', line)
    })

    this.$ws.on('message', ({ action, payload }) => {
      if (action === 'event:log') {
        term.writeln(payload.message)
      }
    })

    fitAddon.fit()

    this.$ws.init()
  }
}
</script>

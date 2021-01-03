<template lang="pug">
  div.ph2(ref="term" style="height: 11rem;")
</template>

<script lang="ts">
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

import LineEditor from '../services/LineEditor'

const lineEditor = new LineEditor();

export default {
  mounted () {
    const fitAddon = new FitAddon()
    const term = new Terminal({ cursorBlink: true })

    term.loadAddon(fitAddon)
    term.open(this.$refs.term)
    term.focus()

    term.onKey(lineEditor.handleKey.bind(lineEditor))

    lineEditor.on('write', (str) => term.write(str))
    lineEditor.on('line', (line) => term.writeln(line))

    fitAddon.fit()
  }
}
</script>

<template lang="pug">
  div.bg-black.ph2(ref="term" style="height: 11rem;")
</template>

<script>
import { Terminal } from 'xterm'
import { AttachAddon } from 'xterm-addon-attach'
import { FitAddon } from 'xterm-addon-fit'

const endpoint = `ws://localhost:3000/sh`

export default {
  mounted () {
    var socket = new WebSocket(endpoint)
    var fitAddon = new FitAddon()
    var term = new Terminal({
      cursorBlink: true,
    })

    term.loadAddon(fitAddon)
    term.open(this.$refs.term)
    term.write('Loading...')
    term.focus()

    fitAddon.fit()

    socket.onopen = e => {
      socket.send('hi')
      term.loadAddon(new AttachAddon(socket))
    }
  }
}
</script>

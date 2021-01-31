<template>
  <pre class="bg-term w-100 h-100 ma0 pa3 bw05 ba b--border overflow-y-hidden">
    <div ref="term" class="flex items-center justify-center">
    </div>
  </pre>
</template>

<script>
import { Terminal } from 'xterm'
import { AttachAddon } from 'xterm-addon-attach'
import { FitAddon } from 'xterm-addon-fit'

const endpoint = `ws://${process.env.VUE_APP_API_URL}/ws`

export default {
  mounted () {
    var socket = new WebSocket(endpoint)
    var fitAddon = new FitAddon()
    var term = new Terminal({
      cursorBlink: true
    })

    term.loadAddon(fitAddon)
    term.open(this.$refs.term)
    // term.write('Loading...')
    term.focus()

    fitAddon.fit()

    socket.onopen = e => {
      socket.send('hi')
      // term.loadAddon(new AttachAddon(socket))
    }
  }
}
</script>

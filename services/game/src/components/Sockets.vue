<template lang="pug">
  form.w-100(@submit.prevent="handleMessage")
    input.code.w-100.bg-black-10.bw0.white-90.pv1.outline-0(ref="inputEl" :value="input")
</template>

<script lang="ts">
import Vue from 'vue'

const DELAY = 5000;

let ws = new WebSocket('ws://localhost:3000/');

export default Vue.extend({
  mounted () {
    ws.onopen = this.onOpen.bind(this);
    ws.onerror = this.onError.bind(this);
    ws.onmessage = this.onMessage.bind(this);
    ws.onclose = this.onClose.bind(this);
  },
  data () {
    return {
      input: '',
    }
  },
  methods: {
    handleMessage (e) {
      const el = this.$refs.inputEl

      el.blur()

      const txt: string = this.input 

      console.log('txt', txt)

      if (txt.startsWith('/')) {
        const tokens = txt.slice(1).split(' ')
        const cmd = tokens[0]
        const args = tokens.slice(1)
        this.send(cmd, ...args)
      } else {
        this.say(txt)
      }
    },
    focusInput () {
      const { inputEl } = this.$refs

      inputEl.focus()
    },
    onOpen() {
      console.log('ws open');
      this.lastConnectedOn = Date.now();
    },
    onClose(e) {
      console.log('ws close', e.code);
      setTimeout(() => {
        this.init();
      }, DELAY);
    },
    onError(e) {
      console.log(e);
      const duration = (Date.now() - this.lastConnectedOn) / 1000;
      console.error(`ws error, connection lasted ${duration}s`);
    },
    onMessage(e) {
      console.log('ws message:', e.data);
      try {
        const parsed = JSON.parse(e.data);
        this.bus.$emit('message', parsed);
      } catch (err) {
        console.error('oops, json error', err);
      }
    },
    say(message) {
      ws.send(JSON.stringify({
        cmd: 'say',
        args: [message],
      }));
    },
    move(direction) {
      ws.send(JSON.stringify({
        cmd: 'move',
        args: [direction],
      }));
    },
    send(cmd, ...args) {
      ws.send(JSON.stringify({
        cmd,
        args,
      }));
    }
  }
})
</script>

<!-- <template>
  <div class="bw05 flex flex-column pa1 w-100 h3 f4 items-end h-100 bg-black-80 br2">
    <div
      id="messages"
      class="h-100 flex flex-column w-100 white overflow-y-scroll"
      style="height: 12rem;">
      <div
        :key="message"
        v-for="message in messages">
        {{ message }}
      </div>
    </div>
    <div class="flex items-center w-100">
      <span class="ph2">$ </span>
      <input
        type="text"
        ref="input"
        @change="onChange"
        class="ma1 pa1 w-100 bg-black-10 br2 white bw0 b--solid monospace">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Interpreter } from 'xor4-interpreter';

export default defineComponent({
  data() {
    return {
      messages: [] as Array<string>,
      interpreter: new Interpreter(),
    };
  },
  methods: {
    onChange() {
      const inputEl = (this.$refs.input as HTMLInputElement);
      this.say(`$ ${inputEl.value}`);

      try {
        this.$data.interpreter.interpret(inputEl.value);
      } catch (err) {
        if (err instanceof Error) {
          this.say(`err: ${err.message}`);
          console.error(err);
        }
      }

      inputEl.value = '';
    },
    say(msg) {
      this.messages.push(msg);

      // (this.messagesEl).scrollTo({
      //   top: this.messagesEl.scrollHeight
      // })
    },
  },
});

</script> -->

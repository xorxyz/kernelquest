<template>
  <span>
    <slot v-if="false" />
    <span v-html="html" />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      html: '',
    };
  },
  mounted() {
    const vnode = this.$slots.default();
    const text = vnode.map((v) => v.children).join(' ');

    this.html = twemoji.parse(text);
  },
});
</script>

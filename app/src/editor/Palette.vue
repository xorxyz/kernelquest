<template>
  <div tabindex="1" 
    class="white f5 flex flex-wrap items-start justify-start pointer ma1 pa1 tl">
    <div 
      :v-for="emoji in StandardGlyphs"
      :key="emoji" 
      :class="{ 'bg-blue black': selected === emoji }"
      @click="select(emoji)">
      {{ emoji }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { StandardGlyphs } from "../constants";

export default defineComponent({
  methods: {
    select (selected) {
      this.selected = selected;
    }
  },
  data() {
    return {
      StandardGlyphs,
      selected: '##'
    }
  }
})
</script>
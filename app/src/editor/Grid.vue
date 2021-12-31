<template>
  <div id="grid" autofocus tabindex="0" class="bl b--gray f3 pointer mv2 bg-black">
    <div class="flex" v-for="row in rows">
      <div class="flex w2 h2 items-center justify-center" v-for="cell in row">
        {{ cell.glyph }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { Room } from "../../../game/engine/world";

export default defineComponent({
  props: {
    room: {
      required: true,
      type: Room
    }
  },
  data: () => {
    return {
      rows: new Array(10).fill(0).map((_, y) => new Array(16).fill(0).map((_, x) => {
        return { x, y, glyph: '..' }
      }))
    }
  },
  methods: {
    reset () {
    },
    load (obj) {
      // this.rows = obj.rows.map(row => Row.fromJSON(row, this.$props.room));
    },
    toJSON () {
      // return {
      //   rows: this.rows.map(row => {
      //     return row.toJSON();
      //   })
      // }
    }
  }
})
</script>
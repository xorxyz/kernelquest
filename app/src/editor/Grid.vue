<template>
  <div id="grid" autofocus tabindex="0" class="bl bt b--gray f3 pointer mv2 bg-black">
    <div :key="r.y" :v-for="r in rows">
      {{r.y}}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { Room } from "../../../game/engine/world";
import { GridExport } from "./grid";
import { Row } from "./grid/row";

export default defineComponent({
  props: {
    room: {
      required: true,
      type: Room
    }
  },
  data: () => {
    return {
      rows: [] as Array<Row>
    }
  },
  methods: {
    reset () {
      this.rows = Array(10).fill(0).map((_, y) => {
        const row = new Row(y, this.room);

        return row;
      });
    },
    load (obj: GridExport) {
      this.rows = obj.rows.map(row => Row.fromJSON(row, this.$props.room));
    },
    toJSON (): GridExport {
      return {
        rows: this.rows.map(row => {
          return row.toJSON();
        })
      }
    }
  }
})
</script>
<template>
  <div class="">
    <div class="card">
      <div class="flex tl w-100 mb1 bw05 br2">
        <FileMenu :engine="engine" />
        <select
          id="run_menu"
          class=""
          @change="selectRunMenuItem">
          <option value="run">-- Run --</option>
          <option value="play_level">▶️ Play level</option>
        </select>
      </div>

      <div class="flex flex-column mv1">
        <div
          id="top-half"
          class="flex w-100 mv1">
          <div class="bg-black-80 mr1 pa1 br2">
            <!--  -->
            <div
              id="tools"
              class="flex pa1 pb2">
              <button class="mr1 ph2 ba flex items-center pointer f6">🖐️Move</button>
              <button class="mr1 ph2 ba flex items-center pointer f6 bg-gray white">🖌️Paint</button>
              <button class="mr1 ph2 ba flex items-center pointer f6">✂️Select</button>
            </div>
            <!--  -->
            <div
              id="palette"
              tabindex="1"
              class="white pointer h-100">
              <div class="flex flex-wrap">
                <Emoji
                  v-for="emoji in StandardGlyphs"
                  :key="emoji"
                  :class="{ 'bg-blue black': selected === emoji }"
                  class="f6 emoji"
                  @click="select(emoji)">
                  {{ emoji }}
                </Emoji>
              </div>
            </div>
          </div>
          <div class="flex w-100 ml1 br2">
            <!--  -->
            <div
              id="grid"
              autofocus
              tabindex="0"
              class="f3 pointer bg-black-80 br2">
              <div
                class="flex"
                v-for="(row, rowIndex) in rows"
                :key="rowIndex">
                <div
                  class="flex w2 h2 items-center justify-center"
                  v-for="(cell, cellIndex) in row"
                  :key="cellIndex"
                  @click="click(cell)">
                  {{ cell.glyph }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="bottom-half"
          class="mv1">
          <GameTerminal />
        </div>
      </div>

      <AudioPlayer />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue';
import { Engine, World } from 'xor4-game';
import { StandardGlyphs } from '../constants';
import AudioPlayer from '../components/AudioPlayer.vue';
import FileMenu from '../components/FileMenu.vue';
import GameTerminal from '../components/GameTerminal.vue';

export default defineComponent({
  components: {
    FileMenu,
    GameTerminal,
    AudioPlayer,
  },
  methods: {
    select(selected) {
      this.selected = selected;
    },
    click(cell) {
      cell.glyph = cell.glyph === this.selected
        ? '..'
        : this.selected;
    },
    selectRunMenuItem(e) {
      if (e.target.value === 'play_level') {
        this.$router.push({ path: '/game' });
      }

      e.target.value = 'run';
    },
  },
  data() {
    return {
      StandardGlyphs,
      engine: markRaw(new Engine({
        world: new World([]),
      })),
      levelId: 'hello-world',
      selected: '##',
      rows: new Array(10).fill(0).map((_, y) => new Array(16).fill(0).map((__, x) => ({ x, y, glyph: '..' }))),
    };
  },
});
</script>

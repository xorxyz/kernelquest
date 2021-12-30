<template>
<div value="edit" class="hidden mv4 ba bw1 br1 b--white h-100 flex flex-column justify-start items-start">
  <header class="tl w-100 pa1 bb bw05 bg-white black">
    <FileManager/>
    <select id="run_menu">
      <option value="run">-- Run --</option>
      <option value="play_level">▶️ Play level</option>
    </select>
    
  </header>

  <div class="flex w-100 bg-black">
    <div class="flex br h-100 flex-column">
      <div class="ma1 flex">
        <button class="mr1 ph2 bl bt br flex items-center pointer f6">🖐️Move</button>
        <button class="mr1 ph2 bl bt br flex items-center pointer f6 bg-gray white">🖌️Paint</button>
        <button class="mr1 ph2 bl bt br flex items-center pointer f6">✂️Select</button>
      </div>
      <div id="palette" tabindex="1" class="white f5 flex flex-wrap items-start justify-start pointer ma1 pa1 tl"></div>
    </div>
    <div class="flex w-100 justify-center items-center">
      <Grid/>
    </div>
  </div>

  <GameTerminal/>

  <div class="mv1 flex justify-between items-center w-100">
    <div id="music_player">
      <button id="mute_button" class="mv1">🔇 Music is muted</button>
      <audio 
        preload="auto" autoplay loop hidden muted
        id="audio_player"
        class="ma2"
        src="https://www.kernel.quest/music/village.wav">
        <source src="https://www.kernel.quest/music/dungeon.wav" type="audio/wav">
        <source src="https://www.kernel.quest/music/village.wav" type="audio/wav">
      </audio>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import Grid from './Grid.vue';

export default {
  components: {
    Grid
  },
  data() {
    return {
    };
  },
};
</script>

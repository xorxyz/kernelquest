<template>
<div class="bw1 br1 b--white h-100 flex flex-column justify-start items-start">
  <div class="bg-dark br3 mv4 flex flex-column justify-start items-start br3 shadow ph4 pv3" style="box-shadow: 0px 0px 1rem 0px rgba(0,0,0,0.2);">
    <header class="flex tl w-100 pa1 bb bw05 ph2 pv2">
      <FileMenu :room="$engine.world.rooms[0]"/>
      <select id="run_menu" class="mh1">
        <option value="run">-- Run --</option>
        <option value="play_level">▶️ Play level</option>
      </select>
    </header>

    <div class="flex flex-column ba">
      <div class="flex w-100 bg-black">
        <div class="flex br h-100 flex-column">
          <div class="ma1 flex">
            <button class="mr1 ph2 bl bt br flex items-center pointer f6">🖐️Move</button>
            <button class="mr1 ph2 bl bt br flex items-center pointer f6 bg-gray white">🖌️Paint</button>
            <button class="mr1 ph2 bl bt br flex items-center pointer f6">✂️Select</button>
          </div>
          <Palette/>
        </div>
        <div class="flex w-100">
          <Grid :room="$engine.world.rooms[0]"/>
        </div>
      </div>
      <GameTerminal/>
    </div>

    <AudioPlayer/>

  </div>
</div>
</template>

<script lang="ts">
import Grid from './Grid.vue';
import Palette from './Palette.vue';
import FileMenu from './FileMenu.vue';
import GameTerminal from './GameTerminal.vue';
import AudioPlayer from '../shared/AudioPlayer.vue';

export default {
  components: {
    Grid,
    Palette,
    FileMenu,
    GameTerminal,
    AudioPlayer
  },
  data() {
    return {
      levelId: 'wip'
    };
  },
};
</script>

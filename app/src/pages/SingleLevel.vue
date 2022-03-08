<template>
  <div>
    <div class="card">
      <h1 class="mt0">{{ $route.params.levelId }}</h1>
      <div class="flex flex-row w-100 justify-between">
        <div class="flex flex-column">
          <small>Style</small>
          <div>
            <div class="tag">
              <emoji>🐉 </emoji><span>Quest </span>
            </div>
          </div>
        </div>
        <div class="flex flex-column">
          <small class="mb2">Stars</small>
          <div>
            <emoji>⭐️ </emoji><span>1</span>
          </div>
        </div>
        <div class="flex flex-column">
          <small class="mb2">Clear Rate</small>
          <div>50%</div>
        </div>
        <div class="flex flex-column">
          <small class="mb2">Published on</small>
          <div>01-06-19</div>
        </div>
        <div class="flex flex-column">
          <small class="mb2">Creator</small>
          <div>
            <router-link
              to="/users/kareniel"
              class="white">
              kareniel
            </router-link>
          </div>
        </div>
      </div>
      <p>The level description. </p><small>Tags</small>
      <div>
        <div class="tag">Unix</div>
        <div class="tag">Operations</div>
      </div><br>
      <div class="button-wrapper">
        <br>
        <router-link
          class="button f2 link pv2 ph4"
          :to="`/game?level=${$route.params.levelId}`">
          Play
        </router-link>
      </div>
    </div>
    <div class="pv2" />
    <div class="card mb4">
      <h2 class="mt0">Ranking</h2>
      <div class="flex flex-row pv3 justify-center">
        <div class="flex items-center mh3">
          <emoji class="f1">🎖️</emoji><span class="mh3 gray">No one yet</span>
        </div>
        <div class="flex items-center mh3">
          <emoji class="f1">🎗️</emoji><span class="mh3 gray">No one yet</span>
        </div>
        <div class="flex items-center mh3">
          <emoji class="f1">🏆</emoji><span class="mh3 gray">No one yet</span>
        </div>
      </div>
      <table class="table w-100">
        <thead>
          <tr class="tl">
            <th class="tc w3">Rank</th>
            <th>Handle</th>
            <th class="w3">Tries</th>
            <th class="w4">Total Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="tc">
              <emoji>🥇</emoji>
            </td>
            <td>
              <router-link
                to="/users/kareniel"
                class="white">
                kareniel
              </router-link>
            </td>
            <td>2</td>
            <td>0h23</td>
          </tr>
          <tr>
            <td class="tc">
              <emoji>🥈</emoji>
            </td>
            <td><span>Anonymous</span></td>
            <td>5</td>
            <td>0h25</td>
          </tr>
          <tr>
            <td class="tc">
              <emoji>🥉</emoji>
            </td>
            <td><span>Anonymous</span></td>
            <td>5</td>
            <td>0h29</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      name: 'Vue',
    };
  },
});
</script>

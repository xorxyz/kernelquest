<template>
  <div class="card">
    <table class="table lh-copy f4 is-striped w-100 mv1">
      <thead>
        <tr class="tl">
          <th>Title</th>
          <th class="w4">Style</th>
          <th class="w4">Difficulty</th>
          <th class="w4">Clear Rate</th>
          <th class="w4">Created On</th>
          <th class="w2">
            <Emoji>⭐️</Emoji>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="level in levels"
          :key="level.id">
          <td>
            <router-link
              :to="`/levels/${level.id}`"
              class="white">
              <span>{{ level.title }}</span>
            </router-link>
          </td>
          <td>{{ level.style }}</td>
          <td>{{ level.difficulty }}</td>
          <td>80%</td>
          <td>{{ level.published_on }}</td>
          <td class="tc">0</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import levels from 'xor4-levels';

export default defineComponent({
  data() {
    return {
      levels,
    };
  },
});
</script>

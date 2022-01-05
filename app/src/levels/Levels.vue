<template>
  <div class="card">
    <table class="table lh-copy f4 is-striped w-100 mv1">
      <thead>
        <tr class="tl">
          <th>Title</th>
          <th class="w4">Style</th>
          <th class="w4">Difficulty</th>
          <th class="w4">Clear Rate</th>
          <th>Tags</th>
          <th class="w4">Created On</th>
          <th class="w2"> 
            <Emoji>⭐️</Emoji>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="level in levels" :key="level.id">
          <td>
            <router-link to="/levels/unix-101" class="white"> <span>Unix 101</span></router-link>
          </td>
          <td>Quest </td>
          <td>Easy</td>
          <td>80%</td>
          <td>Unix</td>
          <td>01-06-19</td>
          <td class="tc">1</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
  export default {
    data() {
      return {
        levels: [{ id: 'unix-101' }],
      };
    },
  };
</script>


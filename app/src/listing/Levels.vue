<template>
  <div class="bg-dark br3 mv4 pa4" style="box-shadow: 0px 0px 1rem 0px rgba(0,0,0,0.2);">
    <div class="flex items-center justify-between mb1">
      <div></div>
      <div>
        <a class="button pv1 ph3 br3 pointer bg-purple link ph4 pv2 mb3 white">Create</a>
      </div>
    </div>

    <table class="table lh-copy f4 is-striped w-100 mt4 mb1">
      <thead>
        <tr class="tl">
          <th>Title</th>
          <th class="w4">Style</th>
          <th class="w4">Difficulty</th>
          <th class="w4">Clear Rate</th>
          <th>Tags</th>
          <th class="w4">Created On</th>
          <th class="w1"> 
            <span>⭐️</span>
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
          <td>1</td>
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


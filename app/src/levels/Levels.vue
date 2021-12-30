<template>
<div value="levels" class="hidden br1">
  <div class="bg-dark br3 mv4" style="padding: 2rem; box-shadow: 0px 0px 1rem 0px rgba(0,0,0,0.2);">
    <div class="flex items-center justify-between mb1">
      <h1 class="mv0">Levels</h1>
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
            <emoji>⭐️</emoji>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <a href="/levels/unix-101" class="white"> <span>Unix 101</span></a>
          </td>
          <td>Quest </td>
          <td>Easy</td>
          <td>80%</td>
          <td>Unix</td>
          <td>01-06-19</td>
          <td>1</td>
        </tr>
        <tr>
          <td> 
            <a href="/levels/unix-201" class="white">Unix 201</a>
          </td>
          <td>Quest</td>
          <td>Normal</td>
          <td>60%</td>
          <td>Unix</td>
          <td>01-06-19</td>
          <td>1</td>
        </tr>
        <tr>
          <td> 
            <a href="/levels/unix-301" class="white">Unix 301</a>
          </td>
          <td>Quest</td>
          <td>Normal</td>
          <td>60%</td>
          <td>Unix</td>
          <td>01-06-19</td>
          <td>1</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script lang="ts">
  export default {
    data() {
      return {
        name: "Vue",
      };
    },
  };
</script>


<template>
  <div class="bg-dark br3 mv4 pa4" style="box-shadow: 0px 0px 1rem 0px rgba(0,0,0,0.2);">

    <table class="table lh-copy f4 is-striped w-100 mt4 mb1">
      <thead>
        <tr class="tl">
          <th class="w2">#</th>
          <th class="w4">Name</th>
          <th class="w4"></th>
          <th></th>
          <th class="w4"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="person, i in people" :key="person.id">
          <td>{{ i + 1 }}</td>
          <td>{{ person.name }}</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script lang="ts">
  export default {
    data() {
      return {
        people: [
          { id: '0', name: 'John Doe' },
          { id: '1', name: 'Jane Doe' },
          { id: '2', name: 'Jean Doe' },
        ],
      };
    },
  };
</script>


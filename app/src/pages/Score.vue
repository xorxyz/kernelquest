<template>
  <div class="card">
    <table class="table lh-copy f4 is-striped w-100 mv1">
      <thead>
        <tr class="tl">
          <th class="w2">#</th>
          <th class="w5">Name</th>
          <th class="w3 tc">Score</th>
          <th />
          <th class="w4" />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="person, i in people"
          :key="person.id">
          <td>{{ i + 1 }}</td>
          <td>{{ person.name }}</td>
          <td class="tr">{{ person.score }}</td>
          <td />
          <td />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      people: [
        { id: '0', name: 'John Doe', score: 100 },
        { id: '1', name: 'Jane Doe', score: 50 },
        { id: '2', name: 'Jean Doe', score: 10 },
        { id: '3', name: 'Anon', score: 5 },
        { id: '4', name: 'Another anon', score: 1 },
      ],
    };
  },
});
</script>

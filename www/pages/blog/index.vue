<template>
  <main class="w-100 h-100 flex flex-column items-center justify-start ">
    <div class="bg-purple w-100 white bg-dark pv4 flex flex-column items-center">
      <div class="container tc">
        <h1 class="f1">Blog</h1>
      </div>
    </div>

    <div class="container ph6 pv4 black">
      <h2 class="f1">Most recent posts</h2>

      <ContentNavigation v-slot="{ navigation }" :query="blogQuery">
        <table class="">
          <tbody>
            <tr class="lh-copy" v-for="link of navigation[0].children" :key="link._path">
              <td class="w4" style="vertical-align:top;">{{ formatDate(link.date) }} &nbsp;</td>
              <td style="vertical-align:top;">
                <NuxtLink :to="link._path" class="link">{{ link.title }}</NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </ContentNavigation>
    </div>
  </main>
</template>

<script setup>
const blogQuery = queryContent('blog/');

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(new Date(date));
}

</script>

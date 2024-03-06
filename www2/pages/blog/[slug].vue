<template>
  <main class="w-100 h-100 flex flex-column items-center justify-start pv4 black">
    <ContentDoc class="container"  v-slot="{ doc }">
      <article>
        <h1>{{ doc.title }}</h1>
        <ContentRenderer :value="doc" />
      </article>
    </ContentDoc>
  </main>
</template>

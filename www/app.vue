<template>
  <div class="flex w-100 vh-100 flex-column overflow-y-scroll">
    <NavBar/>
    <NuxtPage class="" />
    <Footer/>
  </div>
</template>

<script setup>
const title = ref("Kernel Quest");

useHead({
  title: title,
  meta: [{
    name: "viewport",
    content: "width=device-width, initial-scale=1.0",
  }, {
    name: "description",
    content: "",
  }, {
    name: "keywords",
    content: "",
  }, {
    name: "author",
    content: "Jonathan Dupré",
  }],
  script: [{
    src: "https://www.googletagmanager.com/gtag/js?id=GTM-M9CZ2HQL",
    async: true
  }, {
    src: "https://f.convertkit.com/ckjs/ck.5.js",
    async: true
  }, {
    src: "/twemoji.min.js",
    integrity: "sha384-gPMUf7aEYa6qc3MgqTrigJqf4gzeO6v11iPCKv+AP2S4iWRWCoWyiR+Z7rWHM/hU"
  }],
  link: [{
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css?family=Nunito+Sans&amp;display=swap"
  }, {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css?family=Libre+Franklin:ital,wght@0,100..900;1,100..900&display=swap"
  }, {
    rel: "stylesheet",
    href: "https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css"
  }, {
    rel: "stylesheet",
    href: "/style.css"
  }]
});
</script>

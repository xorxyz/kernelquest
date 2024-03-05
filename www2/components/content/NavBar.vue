<template>
  <nav class="bg-darkest w-100 flex h3 justify-center items-center mb0 pv4">
    <div class="container h-100 flex items-center justify-between">
      <a
        href="/"
        class="link pv0 mr3 grow flex items-center h-100">
        <img src="/kernelquest-horizontal-white.svg" class="h2 pt2"/>
      </a>
      <div class="flex justify-end items-center w-100 h-100 pt1">
        <div class="h-100 flex items-center mh4 f6">
          <a
            href="/blog"
            class="tab link grow mh2 ph2 pv2 white pointer">
            Blog
          </a>
        </div>
      </div>
      <div class="flex items-center">
        <div class="mv0 pv0 flex-auto tr flex flex-row justify-end items-center h-100 ">
          <a
            href="https://play.kernel.quest"
            class="tab link grow mh2 ph3 pv2 white pointer button">
            Playtest
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<!-- <script lang="ts">
  import * as v from '@auth0/auth0-vue';

  console.log('v', v);

  export default {
    setup() {
      const { user, isAuthenticated } = v.useAuth0();

      return {
        user,
        isAuthenticated
      };
    }
  };
</script> -->

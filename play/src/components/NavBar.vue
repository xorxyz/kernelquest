<template>
  <nav class="bg-darkest w-100 flex h3 justify-center items-center mb0 pb2">
    <div class="container h-100 flex items-center justify-between">
      <router-link
        to="/"
        class="link pv0 mr3 grow flex items-center h-100">
        <!-- <Emoji class="icon f2">🏰</Emoji> -->
        <img src="/kernelquest-horizontal-white.svg" class="h2 pt2"/>
      </router-link>
      <div class="flex justify-between items-center w-100 h-100 pt1">
        <div class="h-100 flex items-center mh4 f6">
          <!-- <router-link
            to="/game"
            active-class="is-selected"
            class="tab link grow mh2 ph2 pv2 white pointer">
            <Emoji class="f5">🧙</Emoji> Game
          </router-link> -->
          <!-- <router-link
            to="/levels"
            active-class="is-selected"
            class="tab link grow mh2 ph2 pv2 white pointer">
            <Emoji class="f5">🚩</Emoji> Levels
          </router-link> -->
          <!-- <router-link
            to="/editor"
            active-class="is-selected"
            class="tab link grow mh2 ph2 pv2 white pointer">
            <Emoji class="f5">🗺️</Emoji> Editor
          </router-link> -->
        </div>
      </div>
      <div class="flex items-center ">
        <div class="flex mh3">
          <div class="flex w3 items-center justify-center">
            <!-- <Emoji>👑</Emoji> <span class="mh2">0</span> -->
          </div>
          <div class="flex w3 items-center justify-center">
            <!-- <Emoji>💀</Emoji> <span class="mh2">0</span> -->
          </div>
        </div>
        <div class="mv0 pv0 flex-auto tr flex flex-row justify-end items-center h-100 ">
          <div class="pv0 flex h-100 items-center">
            <input
              id="user-menu-toggle"
              type="checkbox"
              class="dn">
            <label
              for="user-menu-toggle"
              class="mv0 pv0 pointer link avatar is-empty grow w2 h2 dib br-pill ba bw1 b--border" />
            <!-- <div id="user-menu-dropdown" class="absolute right-0 top-2 mt4">
              <div class="mt2 ph2 absolute top-3 right-0 bg-white black br3 shadow flex flex-column w5 pv2 z-5">
                <div>
                  <div class="pointer br3 ma1 black hover-bg-purple pv2 ph2 flex flex-row items-center">
                    <span>⇥</span>
                    <span class="mh2">Log In</span>
                  </div>
                </div>
              </div>
              <div class="modal-bg z-4 fixed top-0 left-0 w-100 h-100 bg-black-40 mt0 pointer"></div>
            </div> -->
          </div>
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

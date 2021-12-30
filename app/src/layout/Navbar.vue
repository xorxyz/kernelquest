<template>
  <nav class="bg-darkest w-100 flex h3 justify-center mb0 pb2">
    <div class="container h-100 flex items-center justify-between">
      <a href="/" class="link pv0 mr3 grow router-link-exact-active router-link-active">
        <span class="icon f2">🏰</span>
      </a>
      <div class="flex justify-between w-100">
        <div id="tab_buttons" class="h-100 w5 flex pv0 mh5 f6">
          <button id="levels_tab_button" value="levels" class="tab grow mr3 w3 mr4 ph1 pv1 b--none button-reset bg-darkest white pointer">
            Levels
          </button>
          <button id="editor_tab_button" value="edit" class="tab grow mr3 w3 mr4 ph1 pv1 b--none button-reset bg-darkest white pointer">
            Editor
          </button>
          <button id="game_tab_button" value="play" class="tab grow mr3 w3 mr4 ph1 pv1 b--none button-reset bg-darkest white pointer">
            Game
          </button>
        </div>
        <div class="flex mh3">
          <div class="mr3 flex items-center justify-center">
            👑 0
          </div>
          <div class="mr3 flex items-center justify-center">
            💀 0
          </div>
        </div>
      </div>
      <div class="mv0 pv0 flex-auto tr flex flex-row justify-end items-center h-100">
        <div class="pv0 flex h-100 items-center">
          <input id="user-menu-toggle" type="checkbox" class="dn">
          <label for="user-menu-toggle" class="mv0 pv0 pointer link avatar grow w2 h2 dib br-pill ba bw1 b--border"></label>
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
  </nav>
</template>
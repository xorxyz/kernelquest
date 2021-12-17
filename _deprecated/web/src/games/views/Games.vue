<template lang="pug">
  div

    .card.mv3
      div.flex.items-center
        div.flex-auto
          h1.mt0 Active Games
        div
          router-link.button.is-primary.link.ph4.pv2.mb3(to="/game") Create

      div.mv3.tr

      table.table.w-100
        thead
          tr.tl
            th.w5 Scenario
            th.w4 Players
            th Style
            th.w1.tc
              emoji ⭐️
            th.w4 Difficulty
            th Tags
        tbody
          tr
            td
              router-link(to="/play/d34d-b33f-c4f3")
                span.button Unix 101
            td
              div.flex.items-center
                .avatar.w1.mr2.pointer
                span +2
            td
              .tag
                emoji 🐉
                span Quest
            td.tc 2
            td Easy
            td
              .tag Unix
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      twemoji: global.twemoji
    }
  },
  components: {
  }
}
</script>

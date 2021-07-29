<template lang="pug">
  div

    .card
      div.flex.items-center
        div.flex-auto
          h1.mt0 Levels
        div
          router-link.button.is-primary.link.ph4.pv2.mb3(to="/level") Create
      

      table.table.is-striped.w-100
        thead
          tr.tl
            th Title
            th.w4 Style
            th.w4 Difficulty
            th.w4 Clear Rate
            th Tags
            th.w4 Created On
            th.w1 
              emoji ⭐️
        tbody
          tr
            td
              router-link(to="/levels/unix-101") 
                span Unix 101
            td Quest 
            td Easy
            td 80%
            td Unix
            td 01-06-19
            td 1
          tr
            td  
              router-link(to="/levels/unix-201") Unix 201
            td Quest
            td Normal
            td 60%
            td Unix
            td 01-06-19
            td 1
          tr
            td  
              span Unix 301
            td Quest
            td Normal
            td 60%
            td Unix
            td 01-06-19
            td 1
</template>

<script>
export default {
  name: 'levels',
  components: {
  }
}
</script>


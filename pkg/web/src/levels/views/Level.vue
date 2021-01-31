<template lang="pug">
 
  div
    .card.mb4
      h1.mt0 Unix 101
      div.flex.flex-row.w-100.justify-between
        div.flex.flex-column
          small Style
          div
            .tag 
              emoji 🐉 
              span Quest 
          //- div 🏰 King of the Hill 
          //- div ⚔️ Attack/Defend
        div.flex.flex-column
          small.mb2 Stars
          div 
            emoji ⭐️  
            span 1
        div.flex.flex-column
          small.mb2 Clear Rate
          div 50%
        div.flex.flex-column
          small.mb2 Published on
          div 01-06-19
        div.flex.flex-column
          small.mb2 Creator
          div 
            router-link(to="/users/kareniel") kareniel
      p The level description. 
      small Tags
      div
        .tag Unix
        .tag Operations
      br
      .button-wrapper
        br
        router-link.button.f2.link.pv2.ph4(to="/game?level=unix-101") Play
        br
    .card.mb4
      h2.mt0 Ranking

      div.flex.flex-row.pv3.justify-center
        div.flex.items-center.mh3
          emoji.is-large 🎖
          span.mh3.gray No one yet
        div.flex.items-center.mh3
          emoji.is-large 🎗
          span.mh3.gray No one yet
        div.flex.items-center.mh3
          emoji.is-large 🏆
          span.mh3.gray No one yet
      
      table.table.w-100
        thead
          tr.tl
            th.tc.w3 Rank
            th Handle
            th.w3 Tries
            th.w4 Total Time
        tbody
          tr
            td.tc 
              emoji 🥇
            td
              router-link(to="/users/kareniel") kareniel
            td 2
            td 0h23
          tr
            td.tc
              emoji 🥈
            td
              span Anonymous
            td 5
            td 0h25
          tr
            td.tc
              emoji 🥉
            td
              span Anonymous
            td 5
            td 0h29
</template>

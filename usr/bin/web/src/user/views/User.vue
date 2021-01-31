<template lang="pug">
  div
    .card.mb4.flex.flex-row
      div.mb4.flex.flex-column.w-40
        div.mr3
          .w4.h4.bg-purple.ba.b--border.avatar
        div
          h1.ma0
            |kareniel
            small.f7.absolute.ma1 
              emoji ⭐
          small.mv1.tag 
            emoji 🔒 
            span Security Engineer
        div.w-40
          div.mb3
            small Team
            div Diagonal
          div.mb3
            small Team Role 
            div Lead
      div.flex.flex-column.w-60.justify-end
        div
          div.flex.flex-row.mv3.items-center
            .equip-box
              emoji.is-medium 👑
            span.mh3 netcat-openbsd
          div.flex.flex-row.mv3
            div.flex.flex-row.w-50.items-center
              .equip-box
                emoji.is-medium 🗡
              span.mh3 nmap 
            div.flex.flex-row.w-50.items-center
              .equip-box
                span.grayscale.o-20.flipped.rotate-45
                  emoji.is-medium ✋
              span.mh3.o-10 Nothing 
          div.flex.flex-row.mv3
            div.flex.flex-row.w-50.items-center
              .equip-box
                emoji.is-medium 💍
              span.mh3 SSH
            div.flex.flex-row.w-50.items-center
              .equip-box
                span.grayscale.o-20 
                  emoji.is-medium 👜
              span.mh3.o-10 Nothing 

    div.w-100.flex.mb4
      .card.mr2.w-60
        article.mb4
          h2.mt0 Skills
          div.flex.flex-row
            div.mr4.w-50
              ul.list.pl0.skilltree.mt0
                li Secure Coding 
                  ul
                    li 
                      span(style="font-family: monospace;") └─ 
                      span Node.js 
                li Crypto
            div.w-50
              ul.list.pl0.skilltree.mt0
                li &nbsp;
                  ul.list.pl0
                    li
                      span.mh3 3
                      progress(value="40" max="100")
                li 
                  span.mh3 1
                  progress(value="90" max="100")

        article.mb3
          h2.mt0 Role Badges
          ul.list.pl0.lh-copy
            li.mv3 
              emoji 🛡 
              span &nbsp; Secure Developer
            li.mv3 
              emoji 🏗 
              span &nbsp; DevOps/SRE
            li.mv3 
              emoji 🔒 
              span &nbsp; Security Engineer
      .card.w-50.ml2
        h2.mt0 Legend

        div
          .equip-row
            emoji.mr3 🐤
            span Born on Year 1, Spring
          .equip-row
            emoji.mr3 🦅
            span Attained totem mastery (Year 1, Spring)
          .equip-row
            emoji.mr3 🐇
            span Lesser alliance with the Rabbit (Year 1, Spring)

</template>


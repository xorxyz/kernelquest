<template lang="pug">
 
  div.flex.w-100.justify-center
    .card.mb4.w-50.tl
      div
        h1.mt0 Create a game
        
        div.mv3
          label 
            strong Game Name
          br
          div.flex.items-center
            div https://xor.xyz/games/  
            input.mh2.fw2.f4.w-100.br2.bw1.b--solid.b--black-30.mv2.pa1(type="text" value="d34d-b33f-c4f3")


        div.mv3
          label 
            strong Filter by game style
          .db
            select.h3.mv2.w-100.ph3.pv2.bw1.b--solid.br2.lh-copy.f3.fw3
              option 
                emoji  
                span All
              option 
                emoji 🐉 
                span Quest
              option 
                emoji 🍻 
                span Jeopardy
              option
                emoji 🏰 
                span King of the Hill
              option
                emoji ⚔️ 
                span Attack/Defend

        div.mv3
          label 
            strong Level
          br
          input.pv2.fw2.f4.w-100.br2.bw1.b--solid.b--black-30.mv2.pa1(type="text" value="" placeholder="Search by name, author or tag")

        router-link.mv3.button.f2.link.pv2.ph4(to="/play/c4f3-d34d-b33f-c4f3-00") Launch

</template>

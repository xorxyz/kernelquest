<template lang="pug">
  footer#footer.w-100.flex.justify-center.bg-black-30.ph3
    .container.mv4.pv3.w-100
      .w-50
        span
          router-link(to="/") xor
          |  by 
          router-link(to="/users/kareniel") @kareniel
          |  at 
          a(href="https://diagonal.sh" target="_new") 
            |  Diagonal Systems
        p Develop creative thinking by solving computer security puzzles with friends.
        span © 
        a(href="https://diagonal.sh" target="_new") 
          |Diagonal Systems
        |  · 
        router-link(to="/faq") FAQ
        |  · 
        router-link(to="/terms") Terms
        |  · 
        router-link(to="/privacy") Privacy
        |  · 
        a(href="/.well-known/security.txt") Security
      .w-50

</template>

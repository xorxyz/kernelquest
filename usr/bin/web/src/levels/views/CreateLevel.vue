<template lang="pug">
  div.flex.w-100.justify-center.flex-row
    div.w-50.ml4
      .card.w-100
        div.w-100
          div.flex.justify-between.w-100
            h1.mt0 Create a level
          
        div.w-100
          div.mv4
            label 
              strong Level Name
            br
            div.flex.items-center
              div https://xor.xyz/levels/  
              input.mh2.fw2.f4.w-100.br2.bw1.b--solid.b--black-30.mv2.pa1(type="text" value="d34d-b33f-c4f3")
          div.mv4
            label 
              strong Game Style
            .db
              select.h3.mv2.w-100.ph3.pv2.bw1.b--solid.br2.lh-copy.f3.fw3
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

          div.mv4

            label.button.mt3.ph4.pv3.is-primary(
              @click="create"
              :class="{ 'is-loading': loading }") Create

</template>

<script>

export default {
  data () {
    return {
      loading: false
    }
  },
  methods: {
    create () {
      this.loading = true
      setTimeout(() => {
        this.$router.push('/levels/d34d-b33f-c4f3/edit')
      }, 1700)
    }
  }
}
</script>

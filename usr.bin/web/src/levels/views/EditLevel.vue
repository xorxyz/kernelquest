<template lang="pug">
  div.flex.w-100.justify-center.items-start.flex-row.pl5
    div.w-25.pl3
      .card.mb4.w-25.tl.w-100
        ul.mv0.f4.list.pl0.w-100.ml0.b--purple
          li.pointer.ph3.pv2.hover-purple(
            v-for="section, index in sections"
            @click="selectItem(index)")
            span(:class="{ 'purple': index === selectedIndex}") 
              |{{ section }}
    div.w-75.ml4.pr3

      .card.w-100(v-if="selectedIndex === 0")
        div
          h1.mt0 Machines

          h2 Pods
          .equip-row
            .equip-box
              .w-100.h-100.bg-blue
            .equip-box
              .w-100.h-100.bg-red
            .equip-box
              .w-100.h-100.bg-purple
            .equip-box.pointer
              emoji +

          h2 Interfaces
          table.table.mv4
            thead
              tr
                th Machine
                th Interface
                th MAC
            tbody
              tr
                td 
                  select
                    option debian0
                    option kali0
                td 
                  input(type="text" placeholder="eth0")
                td
                  input(type="text" placeholder="52:54:00:ea:a5:4a")
              tr
                td
                  select
                    option kali0
                    option debian0
                td
                  input(type="text" placeholder="eth0")
                td 
                  input(type="text" placeholder="52:54:00:ea:a5:4a")
              tr
                td
                  label.mv2.button.f5.ph4.pv1 Add Interface

          div.mt4
            div.flex.items-center
              label.button.ph4.pv3.is-primary(@click="next") Next

      .card.w-100(v-if="selectedIndex === 1")
        div
          h1.mt0 Roles
          table.table.mv4
            thead
              tr
                th Team
                th Name
                th Description
            tbody
              tr
                td 
                  select.w5.mr3
                    option *
                    option Red
                    option Blue
                td 
                  input(type="text" placeholder="Role Name")
                td
                  input(type="text")
              tr
                td
                  select.w5.mr3
                    option Red
                    option *
                    option Blue
                td
                  input(type="text" placeholder="Description")
                td 
                  input(type="text")
              tr
                td
                  select.w5.mr3
                    option Blue
                    option *
                    option Red
                td
                  input(type="text" placeholder="Description")
                td
                  input(type="text")
              tr
                td
                  label.mv2.button.f5.ph4.pv1 Add Role

          div.mt4
            div.flex.items-center
              label.button.ph4.pv3.is-primary(@click="next") Next

      .card.w-100(v-if="selectedIndex === 2")
        div
          h1.mt0 Routes

          table.table.mv4
            thead
              tr
                th Destination
                th Netmask
                th Gateway
                th Interface
            tbody
              tr
                td 
                  input.w4(type="text" placeholder="0.0.0.0")
                td 
                  input.w4(type="text" placeholder="255.255.255.0")
                td 
                  input.w4(type="text" placeholder="10.0.0.1")
                td 
                  select
                    option 10.0.0.75
                    option 10.0.0.76
              tr
                td 
                  input.w4(type="text" placeholder="0.0.0.0")
                td 
                  input.w4(type="text" placeholder="255.255.255.0")
                td 
                  input.w4(type="text" placeholder="10.0.0.1")
                td 
                  select
                    option 10.0.0.76
                    option 10.0.0.75
              tr
                td
                  label.mv2.button.ph4.pv1 Add Route

          div.mt4
            div.flex.items-center
              label.button.ph4.pv3.is-primary(@click="next") Next

      .card.w-100(v-if="selectedIndex === 3")
        div.w-100
          div.flex.justify-between.w-100
            h1.mt0 Level Settings
          
        div.w-60
          div.mv4
            label 
              strong Level Name
            br
            div.flex.items-center
              div https://xor.xyz/levels/  
              input.mh2.fw2.f4.w-100.br2.bw1.b--solid.b--black-30.mv2.pa1(type="text" value="d34d-b33f-c4f3")
          //- div.mb4
          //-   label.f5.button.ph4.pv3.bg-dark Import from YAML
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
            div.flex.items-center
              label.button.ph4.pv3.is-primary(@click="next") Next

      .card.w-100(v-if="selectedIndex === 4")
        div
          h2.mt0 Publish

          p Some kind of warning here, maybe?

          label.button.mv3.ph4.pv3.is-primary(
            @click="publish"
            :class="{ 'is-loading': loading }") Publish
</template>

<script>
var sections = [  
  'Machines', 
  'Roles', 
  'Routes', 
  'Settings',
  'Publish' 
]

export default {
  data () {
    return {
      sections,
      selectedIndex: 0,
      loading: false
    }
  },
  methods: {
    selectItem (index) {
      this.selectedIndex = index
    },
    next () {
      this.selectedIndex++
    },
    publish () {
      this.loading = true
    }
  }
}
</script>

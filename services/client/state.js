const people = {
  'john': {
    n: 'john',
    e: '🧙',
    me: 1,
    map: 'intro',
    x: 0,
    y: 0,
  }
}

const rows = [
  [
    {b: 'green',e:'🌳'},
    {b: 'beige',e:'🏔'},
    {b:'green', e:''},
    {b: 'green', e:'🏰', p: { b: 1, n: 'spider', e: '🕷' }}
  ],
  [
    {b: 'green',e:'🍄', p: {l: 1, n: '', e: '💰'}},
    {b: 'green',e:''},
    {b: 'green',e:''},
    {b: 'green',e:'🌱', p: {n: 'anonymous', e: '🕵️'}}
  ],
  [
    {b: 'beige', e:'🏘️'},
    {b: 'beige',e:''},
    {b: 'green',e:'🌿'},
    {b: 'green',e:'🌼', p: {n: 'Eve', e: '🕵️'}}
  ],
  [
    {b: 'green',e:'', p: {n: 'bob', e: '🕵️'}},
    {b: 'beige',e:'🏘', p: {n: 'Alice_88', e: '🕵️'}},
    {b: 'green',e:'🌳'},
    {b: 'blue',e:'🌊'}
  ]
]

module.exports = {
  rows,
  people
}
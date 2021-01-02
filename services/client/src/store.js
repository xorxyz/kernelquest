import vuex from 'vuex';

export default new vuex.Store({
  state: {
    hero: {
      hp: 10,
      sp: 10,
    },
    entities: {

    },
    level: {
      tiles: [],
      entities: [],
    },
  },
});

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const SET_SYMBOL_DATA = 'SET_SYMBOL_DATA';
const SET_ACTIVE_SYMBOL = 'SET_ACTIVE_SYMBOL';

export default new Vuex.Store({
  state: {
    symbolsList: ['BTCUSDT', 'BNBBTC', 'ETHBTC'],
    activeSymbol: 'BTCUSDT',
    symbolData: null,
  },
  getters: {
    isSymbolDataInitialized: (state) => {
      return state.symbolData !== null;
    },

    getAsks: (state) => {
      if (state.symbolData) {
        return state.symbolData.asks;
      }
  
      return null;
    },

    getBids: (state) => {
      if (state.symbolData) {
        return state.symbolData.bids;
      }
  
      return null;
    },
  },
  mutations: {
    [SET_SYMBOL_DATA] (state, payload) {
      state.symbolData = payload;
    },
    [SET_ACTIVE_SYMBOL] (state, {symbol, core}) {
      state.activeSymbol = symbol;
      state.symbolData = null;
      core.observer.publish('active-symbol-changed', symbol);
    }
  },
  actions: {
    setSymbolData(context, payload) {
      context.commit(SET_SYMBOL_DATA, payload);
    },
    setActiveSymbol(context, payload) {
      context.commit(SET_ACTIVE_SYMBOL, payload);
    }
  },
});

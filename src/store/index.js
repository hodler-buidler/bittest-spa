import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const SET_SYMBOL_DATA = 'SET_SYMBOL_DATA';
const SET_ACTIVE_SYMBOL = 'SET_ACTIVE_SYMBOL';
const SET_DIFF_STREAM_CONNECTION = 'SET_DIFF_STREAM_CONNECTION';
const SET_PREV_PROCESSED_DIFF_DATA = 'SET_PREV_PROCESSED_DIFF_DATA';

const SET_LAST_UPDATED_ID = 'SET_LAST_UPDATED_ID';
const UPDATE_ASKS = 'UPDATE_ASKS';
const UPDATE_BIDS = 'UPDATE_BIDS';

export default new Vuex.Store({
  state: {
    symbolsList: ['BTCUSDT', 'BNBBTC', 'ETHBTC'],
    activeSymbol: 'BTCUSDT',
    symbolData: null,
    diffStreamConnection: null,
    prevProcessedDiffData: null,
  },
  getters: {
    isSymbolDataInitialized: (state) => {
      return state.symbolData !== null;
    },

    getLastUpdateId: (state) => {
      if (state.symbolData) {
        return state.symbolData.lastUpdateId;
      }
      
      return null;
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

    isDiffStreamActive: (state) => {
      return state.diffStreamConnection && (state.diffStreamConnection.readyState <= 1);
    },

    isFirstProcessedDiffEvent: (state) => {
      return state.prevProcessedDiffData === null;
    },
  },
  mutations: {
    [SET_SYMBOL_DATA] (state, payload) {
      state.symbolData = payload;
    },
    [SET_ACTIVE_SYMBOL] (state, symbol) {
      state.activeSymbol = symbol;
      state.symbolData = null;
    },

    [SET_DIFF_STREAM_CONNECTION] (state, websocketConnection) {
        state.diffStreamConnection = websocketConnection;
    },

    [SET_PREV_PROCESSED_DIFF_DATA] (state, data) {
      state.prevProcessedDiffData = data;
    },

    [SET_LAST_UPDATED_ID] (state, id) {
      state.symbolData.lastUpdateId = id;
    },

    // @todo bids and asks mutations DRY?
    [UPDATE_ASKS] (state, asks) {
      asks.forEach(diffAsk => {
        var [diffPrice, diffQuantity] = diffAsk;

        var matchedAskIndex = state.symbolData.asks.findIndex(([price]) => {
          return price === diffPrice;
        });

        if (matchedAskIndex >= 0) {
          if (+diffQuantity === 0) {
            state.symbolData.asks.splice(matchedAskIndex, 1);
          } else {
            state.symbolData.asks.splice(matchedAskIndex, 1, diffAsk);
          }
        } else if (+diffQuantity > 0) {
          state.symbolData.asks.unshift(diffAsk);
        }

      });
    },
    
    [UPDATE_BIDS] (state, bids) {
      bids.forEach(diffBid => {
        var [diffPrice, diffQuantity] = diffBid;

        var matchedBidIndex = state.symbolData.bids.findIndex(([price]) => {
          return price === diffPrice;
        });

        if (matchedBidIndex >= 0) {
          if (+diffQuantity === 0) {
            state.symbolData.bids.splice(matchedBidIndex, 1);
          } else {
            state.symbolData.bids.splice(matchedBidIndex, 1, diffBid);
          }
        } else if (+diffQuantity > 0) {
          state.symbolData.bids.unshift(diffBid);
        }

      });
    },
  },
  actions: {
    setSymbolData(context, payload) {
      context.commit(SET_SYMBOL_DATA, payload);
    },
    setActiveSymbol(context, {symbol, core}) {
      context.commit(SET_ACTIVE_SYMBOL, symbol);
      core.observer.publish('active-symbol-changed', symbol);
    },
    setDiffStream(context, websocketStream) {
      context.commit(SET_DIFF_STREAM_CONNECTION, websocketStream);
    },
    closeDiffStream(context, payload) {
      if (context.state.diffStreamConnection) {
        context.state.diffStreamConnection.close();
      }
      context.commit(SET_DIFF_STREAM_CONNECTION, null);
      context.commit(SET_PREV_PROCESSED_DIFF_DATA, null);
    },
    publishDiffUpdates({commit, state, getters, dispatch}, core) {
      if (getters.isDiffStreamActive && getters.isSymbolDataInitialized) {
        state.diffStreamConnection.onmessage = (messageEvent) => {
          var data = JSON.parse(messageEvent.data);

          // Drop any event where u is <= lastUpdateId in the snapshot.
          if (data.u <= getters.getLastUpdateId) return;

          // The first processed event should have U <= lastUpdateId+1 AND u >= lastUpdateId+1.
          if (getters.isFirstProcessedDiffEvent) {
            if (data.U > (getters.getLastUpdateId + 1) || data.u < (getters.getLastUpdateId + 1)) return;
          }

          // While listening to the stream, each new event's U should be equal to the previous event's u+1
          if (!getters.isFirstProcessedDiffEvent) {
            if (data.U !== (state.prevProcessedDiffData.u + 1)) return;
          }

          commit(SET_PREV_PROCESSED_DIFF_DATA, data);
          core.observer.publish('diff-change', data);

          dispatch('updateAsks', data.a);
          dispatch('updateBids', data.b);
          dispatch('updateLastUpdatedId', data.u);
        };
      }
    },
    updateAsks({ commit, getters }, asks) {
      if (asks.length && getters.isSymbolDataInitialized) {
        commit(UPDATE_ASKS, asks);
      }
    },
    updateBids({ commit, getters }, bids) {
      if (bids.length && getters.isSymbolDataInitialized) {
        commit(UPDATE_BIDS, bids);
      }
    },
    updateLastUpdatedId({ commit, getters }, id) {
      if (getters.isSymbolDataInitialized) {
        commit(SET_LAST_UPDATED_ID, id);
      }
    },
  },
});

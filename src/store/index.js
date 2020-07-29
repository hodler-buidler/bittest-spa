import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const SET_SYMBOL_DATA = 'SET_SYMBOL_DATA';
const SET_ACTIVE_SYMBOL = 'SET_ACTIVE_SYMBOL';
const SET_DIFF_STREAM_CONNECTION = 'SET_DIFF_STREAM_CONNECTION';
const SET_PREV_PROCESSED_DIFF_DATA = 'SET_PREV_PROCESSED_DIFF_DATA';

const SET_LAST_UPDATED_ID = 'SET_LAST_UPDATED_ID';
const UPDATE_ENTITIES = 'UPDATE_ENTITIES';

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

    // Update asks or bids with new record/record mutations
    [UPDATE_ENTITIES] (state, {entityName, entities}) {
      entities.forEach(diffEntity => {
        var [diffPrice, diffQuantity] = diffEntity;

        var matchedEntityIndex = state.symbolData[entityName].findIndex(([price]) => price === diffPrice);

        // If correlating entity found
        if (matchedEntityIndex >= 0) {
          if (+diffQuantity === 0) {
            // Remove entity if q == 0
            state.symbolData[entityName].splice(matchedEntityIndex, 1);
          } else {
            // Replace old entity with fresh one
            state.symbolData[entityName].splice(matchedEntityIndex, 1, diffEntity);
          }
        } else if (+diffQuantity > 0) { // If it's a unique entity
          state.symbolData[entityName].unshift(diffEntity); 
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
        commit(UPDATE_ENTITIES, {entityName: 'asks', entities: asks});
      }
    },
    updateBids({ commit, getters }, bids) {
      if (bids.length && getters.isSymbolDataInitialized) {
        commit(UPDATE_ENTITIES, {entityName: 'bids', entities: bids});
      }
    },
    updateLastUpdatedId({ commit, getters }, id) {
      if (getters.isSymbolDataInitialized) {
        commit(SET_LAST_UPDATED_ID, id);
      }
    },
  },
});

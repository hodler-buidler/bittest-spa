<template>
    <div>
        <div v-if="isDataLoaded" class="crypto-table-container">
            <div>
                <div class="crypto-table-container__title">
                    <h3>Symbol: {{ activeSymbol }}</h3>
                </div>

                <symbol-book-table class="crypto-table-container__table" />
            </div>
        </div>
        <div v-else>
            <div class="loading-sign">Loading ...</div>
        </div>
    </div>
</template>

<script>
    import SymbolBookTable from '@/components/SymbolBookTable/SymbolBookTable';
    import { mapGetters, mapActions, mapState } from 'vuex';

    export default {
        name: "CryptoInfoTable",
        components: {SymbolBookTable},
        data() {
            return {
                activeSymbol: null,
                isDataLoaded: false,
                activeSymbolSubscribeKey: Math.random(),
            }
        },
        computed: {
            ...mapState([
                'symbolData',
            ]),

            ...mapGetters([
                'isSymbolDataInitialized',
                'getLastUpdateId',
            ]),
        },
        methods: {
            ...mapActions([
                'setSymbolData',
                'setActiveSymbol',
                'setDiffStream',
                'publishDiffUpdates',
            ]),

            async loadSymbolData() {
                this.isDataLoaded = false;
                if (!this.isSymbolDataInitialized) {
                    let symbolData = await this.$core.sdk.getOrdersBook(this.activeSymbol);
                    if (symbolData) this.setSymbolData(symbolData);
                    else {
                        this.$toast.error("Symbol data hasn't loaded.");
                        return;
                    }

                    this.publishDiffUpdates(this.$core);
                }
                this.isDataLoaded = true;
            },

            updateActiveSymbol(symbol) {
                if (symbol) {
                    this.activeSymbol = symbol;
                    this.loadSymbolData();
                }
            },

            initSocketStream() {
                // To create only one connection corresponding to grabbed data
                if (!this.isSymbolDataInitialized) {
                    var ws = this.$core.sdk.getOrdersWebsocketInstance(this.$store.state.activeSymbol);

                    ws.onerror = (e) => {
                        this.$toast.error('Something wrong with Websocket connection');
                    };

                    this.setDiffStream(ws);
                }
            },
        },
        created() {
            this.initSocketStream();
            this.updateActiveSymbol(this.$store.state.activeSymbol);

            this.$core.observer.subscribe(
                'active-symbol-changed',
                this.updateActiveSymbol,
                this.activeSymbolSubscribeKey,
            );
        },
        destroyed() {
            this.$core.observer.unsubscribe(
                'active-symbol-changed',
                this.updateActiveSymbol,
                this.activeSymbolSubscribeKey,
            );
        }
    }
</script>

<style lang="scss" scoped>
    .crypto-table-container {
        display: flex;
        flex-direction: column;
        align-items: center;

        &__title {
            margin-bottom: 16px;
        }

        &__table {
            font-size: 0.8rem;
            max-width: 90vw;

            @media screen and (max-width: 1024px) {
                font-size: 0.6rem;
            }

            @media screen and (max-width: 768px) {
                font-size: 0.8rem;
            }

            @media screen and (max-width: 550px) {
                font-size: 0.6rem;
            }
        }
    }

    .loading-sign {
        font-size: 5rem;
        text-align: center;
        color: $primary;
        padding: 50px 0;
    }
</style>
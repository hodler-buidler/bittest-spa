<template>
    <div>
        <div class="crypto-table-container" v-if="tableRows.length > 0">
            <div>
                <div class="crypto-table-container__title">
                    <h3>Symbol: {{ activeSymbol }}</h3>
                </div>

                <base-table class="crypto-table-container__table" headersFixed :headers="tableHeaders" :rows="tableRows">
                    <template v-slot:fixed-header="slotProps">
                        <span>{{ slotProps.header }}</span>
                    </template>

                    <template v-slot:default="slotProps">
                        <span>{{ slotProps.cell }}</span>
                    </template>
                </base-table>
            </div>
        </div>
    </div>
</template>

<script>
    import BaseTable from '@/components/BaseTable/BaseTable';
    import { mapGetters, mapActions, mapState } from 'vuex';

    export default {
        name: "CryptoInfoTable",
        components: {BaseTable},
        data() {
            return {
                activeSymbol: null,
                activeSymbolSubscribeKey: Math.random(),
                showTotalMedia: null,
                showTotal: true,
            }
        },
        computed: {
            ...mapState([
                'symbolData',
            ]),

            ...mapGetters([
                'isSymbolDataInitialized',
                'getAsks',
                'getBids',
            ]),

            tableHeaders() {
                var headers = [];
                headers.push('Amount');
                headers.push('Price');

                if (this.showTotal) headers.push('Total');

                headers.push('Amount');
                headers.push('Price');

                if (this.showTotal) headers.push('Total');

                return headers;
            },

            tableRows() {
                var rows = [];

                if (this.isSymbolDataInitialized) {
                    let bids = this.getBids;
                    let asks = this.getAsks;

                    this.insertBidsAtTableRows(bids, rows);
                    this.insertAsksAtTableRows(asks, rows);
                }

                return rows;
            },
        },
        methods: {
            ...mapActions([
                'setSymbolData',
                'setActiveSymbol',
            ]),

            async loadSymbolData() {
                if (!this.isSymbolDataInitialized) {
                    let symbolData = await this.$core.sdk.getOrdersBook(this.activeSymbol);
                    if (symbolData) this.setSymbolData(symbolData);
                }
            },

            getTotal(price, amount) {
                return price * amount;
            },

            insertBidsAtTableRows(bids, rows) {
                bids.forEach(([price, amount]) => {
                    var row = [amount, price]
                    if (this.showTotal) row.push(this.getTotal(price, amount));
                    rows.push(row);
                });
            },

            insertAsksAtTableRows(asks, rows) {
                asks.forEach(([price, amount], index) => {
                    // If row contains ask cells before
                    if (rows[index]) {
                        rows[index].push(amount);
                        rows[index].push(price);
                        if (this.showTotal) rows[index].push(this.getTotal(price, amount));
                    } else {
                        /** @todo think about refactoring this solution */
                        let row = ['', '', '', amount, price]; // '' to compensate possible empty ask cells
                        if (this.showTotal) row.push(this.getTotal(price, amount));
                        rows.push(row);
                    }
                });
            },

            updateActiveSymbol(symbol) {
                if (symbol) {
                    this.activeSymbol = symbol;
                    this.loadSymbolData();
                }
            },

            toggleShowTotal(media) {
                this.showTotal = media.matches;
            },
        },
        created() {
            this.updateActiveSymbol(this.$store.state.activeSymbol);

            this.showTotalMedia = window.matchMedia('(min-width: 840px)');
            this.showTotalMedia.addListener(this.toggleShowTotal);
            this.toggleShowTotal(this.showTotalMedia);

            this.$core.observer.subscribe(
                'active-symbol-changed',
                this.updateActiveSymbol,
                this.activeSymbolSubscribeKey,
            );
        },
        destroyed() {
            this.showTotalMedia.removeListener(this.toggleShowTotal);

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
</style>
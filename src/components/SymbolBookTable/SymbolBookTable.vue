<template>
    <base-table headersFixed :headers="tableHeaders" :rows="tableRows">
        <template v-slot:fixed-header="slotProps">
            <span>{{ slotProps.header }}</span>
        </template>

        <template v-slot:default="slotProps">
            <span>{{ slotProps.cell }}</span>
        </template>
    </base-table>
</template>

<script>
    import BaseTable from '@/components/BaseTable/BaseTable';
    import { mapGetters } from 'vuex';

    export default {
        name: 'SymbolBookTable',
        components: {BaseTable},
        data() {
            return {
                showTotalMedia: null,
                showTotal: true,
            }
        },
        computed: {
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

            toggleShowTotal(media) {
                this.showTotal = media.matches;
            },
        },
        created() {
            this.showTotalMedia = window.matchMedia('(min-width: 840px)');
            this.showTotalMedia.addListener(this.toggleShowTotal);
            this.toggleShowTotal(this.showTotalMedia);
        },
        destroyed() {
            this.showTotalMedia.removeListener(this.toggleShowTotal);
        }
    }
</script>

<style lang="scss" scoped>

</style>
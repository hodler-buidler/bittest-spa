<template>
    <div class="diff-change">
        <h4 class="diff-change__time">{{ formatedDate }}</h4>

        <div class="diff-lists-container">
            <div v-if="isAsksExist" class="diff-lists-container__item">
                <h5 class="diff-change__type danger">Asks:</h5>

                <symbol-diff-changes-list
                    v-for="(ask, index) in asks"
                    :key="'ask'+index"
                    :entity="ask"
                />
            </div>

            <div v-if="isBidsExist" class="diff-lists-container__item">
                <h5 class="diff-change__type success">Bids:</h5>

                <symbol-diff-changes-list
                    v-for="(bid, index) in bids"
                    :key="'bid'+index"
                    :entity="bid"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import SymbolDiffChangesList from '@/components/SymbolDiffChanges/SymbolDiffChangesList';

    export default {
        name: 'SymbolDiffChangesItem',
        components: {SymbolDiffChangesList},
        props: {
            diff: {
                type: Object,
                required: true,
            },
        },
        computed: {
            formatedDate() {
                var date = new Date(this.diff.E);

                var year = date.getFullYear();
                var month = this.addZeroToDatePieceIfNecessary(date.getMonth() + 1);
                var day = this.addZeroToDatePieceIfNecessary(date.getDate());

                var hours = this.addZeroToDatePieceIfNecessary(date.getHours());
                var minutes = this.addZeroToDatePieceIfNecessary(date.getMinutes());
                var seconds = this.addZeroToDatePieceIfNecessary(date.getSeconds());

                return `${day}.${month}.${year} - ${hours}:${minutes}:${seconds}`;
            },

            asks() {
                return this.diff.a;
            },

            bids() {
                return this.diff.b;
            },

            isAsksExist() {
                return this.asks.length > 0;
            },

            isBidsExist() {
                return this.bids.length > 0;
            },
        },
        methods: {
            addZeroToDatePieceIfNecessary(datePiece) {
                datePiece = String(datePiece);
                const datePieceLendth = datePiece.length;
                
                if (datePieceLendth < 2) {
                    datePiece = "0"+datePiece;
                    return datePiece;
                }

                return datePiece;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .diff-change {
        &__time {
            margin-bottom: 20px;
        }

        &__type {
            margin-bottom: 12px;
        }
    }

    .diff-lists-container {
        display: flex;

        &__item {
            margin-right: 30px;

            &:last-child {
                margin-right: 0;
            }
        }

        @media screen and (max-width: 515px) {
            &__item {
                margin-right: 15px;
            }
        }

        @media screen and (max-width: 475px) {
            flex-direction: column;
            font-size: 1.2rem;

            &__item {
                margin-right: 0;
                margin-bottom: 24px;

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
</style>
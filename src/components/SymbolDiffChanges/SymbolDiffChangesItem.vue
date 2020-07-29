<template>
    <div class="diff-change">
        <h4 class="diff-change__time">29.07.2020 - 12:15:58</h4>

        <div class="diff-lists-container">
            <div class="diff-lists-container__item">
                <h5 class="diff-change__type danger">Asks:</h5>

                <symbol-diff-changes-list />
            </div>

            <div class="diff-lists-container__item">
                <h5 class="diff-change__type success">Bids:</h5>

                <symbol-diff-changes-list />
            </div>
        </div>
    </div>
</template>

<script>
    import SymbolDiffChangesList from '@/components/SymbolDiffChanges/SymbolDiffChangesList';

    export default {
        name: 'SymbolDiffChangesItem',
        components: {SymbolDiffChangesList},
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

        @media screen and (max-width: 1280px) {
            font-size: 0.8rem;
        }

        @media screen and (max-width: 1024px) {
            font-size: 1rem;
            flex-direction: column;

            &__item {
                margin-right: 0px;
                margin-bottom: 24px;

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
</style>
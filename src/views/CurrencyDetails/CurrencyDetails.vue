<template>
    <div class="currency-details">
        <div class="currency-type currency-details__symbol-type">
            <div class="currency-type__title">
                <h2>Current currency symbol:</h2>
            </div>

            <div>
                <currency-select class="simple-select currency-type__select" />
            </div>
        </div>

        <div class="symbol-diff">
            <div class="symbol-diff__title">
                <h2>Diff changes:</h2>
            </div>

            <div>
                <symbol-diff-changes @data-exists='handleDiffExistsEvent' />
            </div>

            <div v-if="!isDiffHistoryExists">
                <span>No symbol data loaded yet, so no differences appear.</span>
            </div>
        </div>
    </div>
</template>

<script>
    import CurrencySelect from '@/components/CurrencySelect/CurrencySelect';
    import SymbolDiffChanges from '@/components/SymbolDiffChanges/SymbolDiffChanges';

    export default {
        name: "CryptoInfoChoice",
        components: {CurrencySelect, SymbolDiffChanges},
        data() {
            return {
                isDiffHistoryExists: false,
            }
        },
        methods: {
            handleDiffExistsEvent(isDiffExists) {
                this.isDiffHistoryExists = isDiffExists;
            },
        },
    }
</script>

<style lang="scss" scoped>
    .currency-details {
        &__symbol-type {
            margin-bottom: 64px;
        }

        @media screen and  (max-width: 768px) {
            &__symbol-type {
                margin-bottom: 48px;
            }
        }
    }

    .currency-type {
        display: flex;
        align-items: center;

        &__title {
            margin-right: 24px;
        }

        &__select {
            font-size: 1.6rem;
        }

        @media screen and (max-width: 978px) {
            flex-direction: column;
            align-items: flex-start;

            &__title {
                margin-right: 0px;
                margin-bottom: 24px;
            }
        }
    }

    .symbol-diff {
        &__title {
            margin-bottom: 48px;
        }

        @media screen and  (max-width: 768px) {
            &__title {
                margin-bottom: 24px;
            }
        }
    }
</style>
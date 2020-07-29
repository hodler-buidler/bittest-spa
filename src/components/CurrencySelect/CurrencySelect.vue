<template>
    <select v-model="currentSelectedSymbol">
        <option
            v-for="(symbol, index) in symbolsList"
            :key="symbol+index"
            :value="symbol">
            {{ symbol }}
        </option>
    </select>
</template>

<script>
    import { mapState, mapActions } from 'vuex';

    export default {
        name: 'CurrencySelect',
        data() {
            return {
                currentSelectedSymbol: null,
            }
        },
        computed: {
            ...mapState([
                'symbolsList',
                'activeSymbol',
            ]),
        },
        watch: {
            currentSelectedSymbol(symbol, oldSymbol) {
                if (oldSymbol !== null) {
                    this.setActiveSymbol({ symbol, core: this.$core});
                }
            },
        },
        methods: {
            ...mapActions([
                'setActiveSymbol',
            ]),
        },
        created() {
            this.currentSelectedSymbol = this.activeSymbol;
        }
    }
</script>

<style lang="scss" scoped>

</style>
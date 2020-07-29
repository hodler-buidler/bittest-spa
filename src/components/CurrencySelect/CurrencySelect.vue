<template>
    <select>
        <option
            v-for="(symbol, index) in symbolsList"
            :key="symbol+index"
            :selected="symbol === activeSymbol">
            {{ symbol }}
        </option>
    </select>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'CurrencySelect',
        computed: {
            ...mapState([
                'symbolsList',
                'activeSymbol',
            ]),
        },
    }
</script>

<style lang="scss" scoped>

</style>
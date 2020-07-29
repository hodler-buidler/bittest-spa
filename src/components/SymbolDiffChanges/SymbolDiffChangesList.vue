<template>
    <ul class="changes-list">
        <li class="changes-list__item">
            <span class="field-name">Quantity:</span> {{ quantity }}
            <br />
            <span class="field-name">Price:</span> {{ price }}
        </li>
    </ul>
</template>

<script>
    export default {
        name: 'SymbolDiffChangesList',
        props: {
            entity: {
                type: Array,
                required: true,
            },
        },
        computed: {
            price() {
                return this.entity[0];
            },

            quantity() {
                return this.entity[1];
            },
        }
    }
</script>

<style lang="scss" scoped>
    .changes-list {
        display: table;
        
        &__item {
            border-top: 1px solid $dark;
            padding: 10px 0;
            line-height: 1.4;

            &:last-child {
                border-bottom: 1px solid $dark;
            }
        }
    }

    .field-name {
        font-family: $font-bold;
        color: $primary;
    }
</style>
<template>
    <ul class="changes-list">
        <li class="changes-list__item">
            <span class="field-name">Quantity</span> from&nbsp;0.0000230230 to&nbsp;0.034000324230423
            <br />
            <span class="field-name">Price</span> from&nbsp;0.0000230230 to&nbsp;0.034000324230423
        </li>
    </ul>
</template>

<script>
    export default {
        name: 'SymbolDiffChangesList',
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
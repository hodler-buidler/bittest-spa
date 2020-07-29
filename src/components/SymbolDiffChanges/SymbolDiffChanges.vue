<template>
   <div class="diff-changes-history">
       <symbol-diff-changes-item class="diff-changes-history__item" />
       <symbol-diff-changes-item class="diff-changes-history__item" />
   </div>
</template>

<script>
    import SymbolDiffChangesItem from '@/components/SymbolDiffChanges/SymbolDiffChangesItem';

    export default {
        name: 'SymbolDiffChanges',
        components: {SymbolDiffChangesItem},
    }
</script>

<style lang="scss" scoped>
    .diff-changes-history {
        &__item {
            margin-bottom: 48px;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
</style>
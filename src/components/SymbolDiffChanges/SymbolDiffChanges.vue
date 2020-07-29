<template>
   <div class="diff-changes-history">
        <symbol-diff-changes-item
            v-for="diff in diffStack"
            :key="diff.E"
            :diff="diff"
            class="diff-changes-history__item"
        />
   </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import SymbolDiffChangesItem from '@/components/SymbolDiffChanges/SymbolDiffChangesItem';

    export default {
        name: 'SymbolDiffChanges',
        components: {SymbolDiffChangesItem},
        data() {
            return {
                diffChangeSubscribeKey: Math.random(),
                symbolChangeSubscribeKey: Math.random(),
                diffStack: [],
            }
        },
        computed: {
            ...mapGetters([
                'isDiffStreamActive',
            ]),
        },
        methods: {
            ...mapActions([
                'closeDiffStream',
            ]),

            trackDiffChanges(data) {
                // First load
                if (!this.diffStack.length) {
                    this.emitDataExistsEvent(true);    
                }

                this.diffStack.unshift(data);
            },

            clearDiffHistory() {
                if (this.isDiffStreamActive) {
                    this.closeDiffStream();
                    this.diffStack = [];
                    this.emitDataExistsEvent(false); 
                }
            },

            emitDataExistsEvent(isDataExist) {
                this.$emit('data-exists', isDataExist);
            },
        },
        created() {
            this.$core.observer.subscribe(
                'diff-change',
                this.trackDiffChanges, 
                this.diffChangeSubscribeKey
            );

            this.$core.observer.subscribe(
                'active-symbol-changed',
                this.clearDiffHistory, 
                this.symbolChangeSubscribeKey
            );
        },
        destroyed() {
            this.$core.observer.unsubscribe(
                'diff-change',
                this.trackDiffChanges, 
                this.diffChangeSubscribeKey
            );

            this.$core.observer.unsubscribe(
                'active-symbol-changed',
                this.clearDiffHistory, 
                this.symbolChangeSubscribeKey
            );
        },
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
<template>
    <div ref="tableContainer" class="v-table-complex">
        <div v-if="headers && headersFixed" class="fixed-header">
            <div
                v-for="(header, index) in headers"
                :key="'fh_'+index"
                class="js-fixed-cell header-cell v-table-complex__cell">
                <slot name="fixed-header" :header="header"></slot>
            </div>
        </div>

        <vue-custom-scrollbar class="v-table-complex__scroll-area" :settings="scrollSettings">
            <div>
                <table ref="table">
                    <tr
                        v-if="headers && !headersFixed"
                        class="v-table-complex__row">
                        <th
                            class="js-fixed-cell header-cell v-table-complex__cell"
                            v-for="(header, index) in headers"
                            :key="'h_'+index">
                            <slot name="header" :header="header"></slot>
                        </th>
                    </tr>

                    <tr
                        class="v-table-complex__row v-table-complex__row_type_body-row"
                        v-for="(row, rowIndex) in rows"
                        :key="'r_'+rowIndex">
                        <td
                            class="v-table-complex__cell"
                            :class="{'js-body-cell': isFirstIteration(rowIndex)}"
                            v-for="(cell, cellIndex) in row"
                            :key="'c_'+cellIndex">
                            <slot :cell="cell"></slot>
                        </td>
                    </tr>
                </table>
            </div>
        </vue-custom-scrollbar>
    </div>
</template>

<script>
    import ResizeObserver from 'resize-observer-polyfill';  
    import VueCustomScrollbar from 'vue-custom-scrollbar';

    export default {
        name: 'BaseTable',
        components: { VueCustomScrollbar },
        props: {
            headers: { // expects [cell, cell, cell...]
                default: null 
            },
            rows: { // expects [[cell, cell, cell], [cell, cell, cell]...]
                type: Array,
                required: true,
            },
            headersFixed: {
                default: false,
                type: Boolean,
            },
        },
        data() {
            return {
                resizeObserver: null,
                scrollSettings: {
                    minScrollbarLength: 50,
                }
            }
        },
        watch: {
            headers: function updateHeaderWidthsIfTheyChanged(newValue) {
                if (this.headersFixed) {
                    this.$nextTick(function () {
                        this.equalizeWidthOfHeaderCellsWithBodyCells();
                    });
                }
            },
        },
        methods: {
            isFirstIteration(index) {
                return index === 0;
            },

            equalizeWidthOfHeaderCellsWithBodyCells() {
                if (this.$refs.tableContainer) {
                    var headerCells = this.$refs.tableContainer.querySelectorAll('.js-fixed-cell');
                    var bodyCells = this.$refs.tableContainer.querySelectorAll('.js-body-cell');

                    bodyCells.forEach(function equalize(cell, index) {
                        if (headerCells[index]) {
                            headerCells[index].style.width = bodyCells[index].offsetWidth+"px";
                        }
                    });
                }
            },

            adjustFixedHeadersWidthOnTableWidthChange() {
                if (this.headersFixed) {
                    this.resizeObserver = new ResizeObserver(this.equalizeWidthOfHeaderCellsWithBodyCells);
                    this.resizeObserver.observe(this.$refs.table);
                }
            }
        },
        mounted() {
            this.adjustFixedHeadersWidthOnTableWidthChange();
        },
        beforeDestroy() {
            // I use this hook because I need to interract with this.$refs
            this.resizeObserver.unobserve(this.$refs.table);
        }
    }
</script>

<style lang="scss" scoped>
    .v-table-complex {
        display: inline-flex;
        border: 1px solid $primary;
        flex-direction: column;
        max-width: 100%;

        &__scroll-area {
            position: relative;
            margin: auto;
            display: block;
            width: 100%;
            height: 400px;
        }

        &__row {
            border-bottom: 1px solid $primary;

            &_type {
                &_body-row {
                    &:nth-child(odd) {
                        background: $secondary;
                    }
                }
            }

            &:last-child {
                border-bottom: none;
            }

            &:hover {
                background: $alternative;
                color: $light;
            }
        }

        &__cell {
            padding: 10px 10px;
            box-sizing: border  -box;
            border-right: 1px solid $primary;
            border-left: 1px solid $primary;

            &:first-child {
                border-left: none;
            }

            &:last-child {
                border-right: none;
            }
        }

        .header-cell {
            font-family: $font-bold;
            background: $alternative;
            text-align: center;
            box-sizing: border-box;

            border-right: none;
        }

        .fixed-header {
            display: flex;
            border-bottom: 1px solid $primary;
        }
    }
</style>
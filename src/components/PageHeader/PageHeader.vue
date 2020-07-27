<template>
    <div class='page-header'>
        <div class="page-header__logo">
            <router-link :to="{name: 'info-table'}">
                <base-logo />
            </router-link>
        </div>

        <nav class="page-nav">
            <router-link :to="{name: 'info-table'}" class="link page-nav__item" exact-active-class="link_active">
                <span>Info table</span>
            </router-link>

            <router-link :to="{name: 'currencies'}" class="link page-nav__item" exact-active-class="link_active">
                <span>Currency select</span>
            </router-link>
        </nav>
    </div>
</template>

<script>
    import BaseLogo from '@/components/BaseLogo/BaseLogo.vue';
    
    export default {
        name: "PageHeader",
        components: {BaseLogo},
    }
</script>

<style lang="scss" scoped>
    .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        @media screen and (max-width: 550px) {
            flex-direction: column;

            &__logo {
                margin-bottom: 16px;
            }
        }
    }

    .page-nav {
        &__item {
            margin: 0 20px;
            white-space: nowrap;

            @media screen and (max-width: 768px) {
                margin: 0 10px;
            }
    
            &:first-child {
                margin-left: 0;
            }

            &:last-child {
                margin-right: 0;
            }
        }
    }
</style>
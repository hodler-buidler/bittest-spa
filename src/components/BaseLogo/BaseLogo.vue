<template>
    <div class="logo">
        <img class="logo__img" src="~assets/img/btc.svg" alt="" />
        <div class="logo__caption">Crypto</div> 
    </div>
</template>

<script>
    export default {
        name: "BaseLogo",
    }
</script>

<style lang="scss" scoped>
    .logo {
        display: flex;
        align-items: center;

        &__caption {
            font-family: $font-bold;
            text-transform: uppercase;
            font-size: 2rem;
        }

        &__img {
            width: 3rem;
            margin-right: 8px;
        }
    }
</style>
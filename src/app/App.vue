<template>
  <div id="app">
    <div class="page">
      <page-header />

      <div class="separator page__separator"></div>

      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader/PageHeader.vue";

export default {
  name: "App",
  components: {PageHeader}
}
</script>

<style lang="scss">
  @import "reset-css";
  @import "~assets/scss/fonts";

  body, html {
    font-size: 20px;
    font-family: $font-regular, sans-serif;
    color: $default;

    @media screen and (max-width: 768px) {
      font-size: 16px;
    }
  }

  a {
    text-decoration: none;
    color: $default;
  }

  h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6  {
    font-family: $font-bold, sans-serif;
  }

  h1, .h1 {
    font-size: 2.3rem;
  }

  h2, .h2 {
    font-size: 2rem;
    line-height: 1.1;
  }

  h3, .h3 {
    font-size: 1.5rem;
    line-height: 1.1;
  }

  h4, .h4 {
    font-size: 1.25rem;
    line-height: 1.2;
  }

  .link {
    color: $alternative;
    transition: 0.3s all;
    cursor: pointer;

    &:hover, &_active {
      color: darken($alternative, 15%);
    }

    &:active {
      opacity: 0.5;
    }
  }

  .separator {
    height: 2px;
    width: 100%;
    background: $secondary;
  }
</style>


<style lang="scss">
  .page {
    background: $light;
    min-height: 100vh;
    border: 20px solid $dark;
    box-sizing: border-box;
    padding: 50px;

    &__separator {
      margin: 30px 0;
    }

    @media screen and (max-width: 768px) {
      padding: 30px;
      border: 10px solid $dark;
    }

    @media screen and (max-width: 550px) {
      &__separator {
        margin: 20px 0;
      }
    }
  }
</style>
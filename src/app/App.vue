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
  @import "~assets/scss/core";

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
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'info-table',
    component: () => import(/* webpackChunkName: "crypto-table" */ '@/views/CryptoInfoTable/CryptoInfoTable.vue'),
  },
  {
    path: '/currencies',
    name: 'currencies',
    component: () => import(/* webpackChunkName: "currency-choice" */ '@/views/CurrencyChoice/CurrencyChoice.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router;

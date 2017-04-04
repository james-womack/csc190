import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';

Vue.use(Vuetify);
Vue.use(VueRouter);

const routes = [
    { path: '/', component: require('./components/home/home.vue') },
    { path: '/counter', component: require('./components/counter/counter.vue') },
    { path: '/fetchdata', component: require('./components/fetchdata/fetchdata.vue') }
];

new Vue({
    el: '#app-root',
    router: new VueRouter({ mode: 'history', routes: routes }),
    render: h => h(require('./components/app/app.vue'))
});

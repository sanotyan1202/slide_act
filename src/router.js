import Vue from 'vue'
import VueRouter from 'vue-router'
import Top from './components/Top.vue'
import Browser from './components/Browser.vue'

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', component: Top},
        {path: '/:slideId', component: Browser}      
    ]
  })
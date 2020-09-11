import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from './components/Main.vue'
import Browser from './components/Browser.vue'

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', component: Main},
        {path: '/:slideId', component: Browser}      
    ]
  })
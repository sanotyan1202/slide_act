import Vue from 'vue'
import VueRouter from 'vue-router'
import Top from './components/presenter/Top'
import Browser from './components/participant/Browser'

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', component: Top},
        {path: '/:slideId', component: Browser}      
    ]
  })
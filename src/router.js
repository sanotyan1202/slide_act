import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from './components/presenter/Main'
import Browser from './components/participant/Browser'

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', component: Main},
        {path: '/:slideId', component: Browser}      
    ]
  })
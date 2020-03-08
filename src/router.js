import Vue from 'vue'
import VueRouter from 'vue-router'
import Top from './components/Top.vue'
import SlideShow from './components/SlideShow.vue'

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', component: Top},
        {path: '/:slideId', component: SlideShow}      
    ]
  })
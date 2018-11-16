import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/bezier',
      name: 'bezier',
      component: () => import('./views/bezier.vue')
    },
    {
      path: '/blur',
      name: 'blur',
      component: () => import('./views/blur.vue')
    },
    {
      path: '/children',
      name: 'children',
      component: () => import('./views/children.vue')
    },
    {
      path: '/childrenNullChange',
      name: 'childrenNullChange',
      component: () => import('./views/childrenNullChange.vue')
    },
    {
      path: '/childrenUpdate',
      name: 'childrenUpdate',
      component: () => import('./views/childrenUpdate.vue')
    },
    {
      path: '/color',
      name: 'color',
      component: () => import('./views/color.vue')
    },
    {
      path: '/control',
      name: 'control',
      component: () => import('./views/control.vue')
    },
    {
      path: '/easingPath',
      name: 'easingPath',
      component: () => import('./views/easingPath.vue')
    },
    {
      path: '/followMouse',
      name: 'followMouse',
      component: () => import('./views/followMouse.vue')
    }
  ]
})

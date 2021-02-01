import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/app',
    component: () => import(/* webpackChunkName: 'test' */ '@/views/test'),
    children: [
      { name: 'test', path: 'test', component: () => import(/* webpackChunkName: 'test' */ '@/views/test') }
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router

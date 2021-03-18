import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'
import Call from '../views/Call.vue'
import Top from '../views/Top'
import Drag from '../views/DragTest'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Top',
    component: Top,
  },
  {
    path: '/call',
    name: 'Call',
    component: Call,
    meta: { requiresAuth: true }
  },
  {
    path: '/drag',
    name: 'Drag',
    component: Drag,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    // 認証状態を取得
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        next()
      } else {
        // 認証されていない場合、認証画面へ
        next({ name: 'Top' })
      }
    })
  } else {
    next()
  }
})

export default router

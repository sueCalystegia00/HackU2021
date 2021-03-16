import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'
import CallTest from '../views/CallTest.vue'
import Top from '../views/Top'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'CallTest',
    component: CallTest,
    meta: { requiresAuth: true }
  },
  {
    path: '/top',
    name: 'Top',
    component: Top
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // firebase.auth().signOut() // テスト用サインアウト
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

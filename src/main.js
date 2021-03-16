import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import firebase from 'firebase/app';
const firebaseConfig = {
  apiKey: "AIzaSyAnF1q6T1JX3trqe2LbGwpgSLs__7PG2lk",
  authDomain: "public-telephone.firebaseapp.com",
  projectId: "public-telephone",
  storageBucket: "public-telephone.appspot.com",
  messagingSenderId: "622574820298",
  appId: "1:622574820298:web:d16aec88a8391bd0164d33"
};
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

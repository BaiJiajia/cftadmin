// this is main.js
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/style/style.css'
import './assets/style/yhs.css'
import './assets/style/yhs-table.css'
import './assets/style/yhs-form.css'
import Vuex from 'vuex'
import store from './store/index'
import router from './routes'
import request from "@/utils/require"
Vue.prototype.request = request;

Vue.use(ElementUI)
Vue.use(Vuex)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    localStorage.removeItem('token');
  }
  let token = localStorage.getItem('token');
  if (!token && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})
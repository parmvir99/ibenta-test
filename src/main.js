import Vue from 'vue'
import App from './App.vue'
/* eslint-disable */
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VeeValidate from 'vee-validate'
import Notifications from 'vue-notification'
import router from './router'
import axios from 'axios'
import store from '@/store'

Vue.component('ValidationProvider', VeeValidate.ValidationProvider)
Vue.component('ValidationObserver', VeeValidate.ValidationObserver)

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(Notifications)
Vue.config.productionTip = false


let http = axios.create({
  baseURL: 'http://authentication-service.jx-ibenta-authentication-service-pr-15.ibenta.com/api',
  timeout: 1000 * 60 * 3
})


http.interceptors.request.use(config => {
  config.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (store.getters.getToken.token && store.getters.getToken.token !== '') {
    config.headers.Authorization = `Bearer ${store.getters.getToken.token}`
  }
  return config
})

Vue.http = http

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

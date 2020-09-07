// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueAsiox from 'vue-axios'
import Qs from 'qs'
import displayMenu from './assets/js/global'
import * as filters from './assets/js/filters'
import VueSession from 'vue-session'
import VulButton from './components/components/VulButton'
import echarts from 'echarts'

Vue.prototype.display = displayMenu
Vue.prototype.$echarts = echarts
Vue.prototype.qs = Qs

Vue.config.productionTip = false
axios.defaults.withCredentials = true

Vue.use(ElementUI)
Vue.use(VueAsiox, axios)
Vue.use(VueSession)
Vue.component('VulButton', VulButton)

// 设置浏览器标题
Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
  }
})

// 请求拦截
Vue.axios.interceptors.request.use(function (req) {
  return req
})
//  响应拦截
Vue.axios.interceptors.response.use(function (res) {
  return res
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

import { Encrypt, Decrypt } from "./assets/js/AES";

let a = '1236';
let b = Encrypt(a);
console.log(Encrypt(a)); 

// axios.post('/login/login', 'loginname=system&pwd=b123456').then((response) => {
//   console.log(response.data)
// }).catch((responese) => {
//   console.log(responese)
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

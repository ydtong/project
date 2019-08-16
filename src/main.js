// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from '@/router.js'
import Scanfile from "@/ScanFile"
import store from "@/store.js"
import axios from "@/assets/js/axios.js"
import "./assets/js/directive.js"
// 引入element
import elementUi from "element-ui"
// import 'element-ui/lib/theme-chalk/index.css';
// 引入icon
import "./font/iconfont.css"
//引入样式 
import "./style/index.scss"
//引入iview
import iView from 'iview';
import 'iview/dist/styles/iview.css';
//window挂载token属性和logout方法
import '@/assets/js/iframeProxy.js';
// 引入工具
import {message} from "@/assets/js/tool"
import CommonUtils from '@/assets/js/common_util.js'


Vue.prototype.$commonUtils = CommonUtils

Vue.use(elementUi)
Vue.use(Scanfile)
Vue.use(iView)



Vue.prototype.$http = axios
Vue.prototype.message = message
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})

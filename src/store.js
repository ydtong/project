import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let model = { modules: {} }
let name = []
// 扫描文件
const srcContext = require.context('@/store', true, /\.js$/)
srcContext.keys().forEach(item => {
  if (item !== './index.js' && srcContext(item).default !== undefined) {
    // 重新定义赋值model
    name = item.split('/').pop().replace(/\.js$/, '')
    model.modules[name] = srcContext(item).default
  }
})
// 注册导出
export default new Vuex.Store(model)
















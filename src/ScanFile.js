const components = []

const srcContext = require.context('@/components', true, /\.vue$/)
srcContext.keys().forEach(item => {
  let src = srcContext(item)
  if (!src.name) {
    src.name = item.split('/').pop().replace(/\.vue$/, '')
  }
  components.push(src)
})

const install = function (Vue) {
  components.map(component => {
    let name = component.name
    Vue.component(name, component.default)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

module.exports = {
  install
}

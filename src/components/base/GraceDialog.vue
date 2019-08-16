<script>
/**
 * 为了解决el-dialog不能自动销毁内容而写的弹窗组件，顺便附带一个对值进行深拷贝的功能，用来防止内容组件意外修改父组件传入的对象。
 * 除了带有dialog:前缀的属性其他会全部自动传入内容组件。
 * 内容组件发出的事件除dialog:hide和dialog:close以外会全部交给父组件处理。
 */
export default {

  render: function (createElement) {
    let dialogProps = {}
    for (let index in this.$attrs) {
      if (index.startsWith('dialog:')) {
        dialogProps[index.substr(7, index.length)] = this.$attrs[index]
      }
    }
    let dialog = createElement('el-dialog', {
      props: dialogProps,
      on: {
        'update:visible': (e) => {
          this.$emit('update:dialog:visible', e)
        }
      },
      scopedSlots: {
        default: () => {
          let componentProps = {}
          for (let index in this.$attrs) {
            if (!index.startsWith('dialog:')) {
              componentProps[index] = this.$attrs[index]
            }
          }
          if (this['dialog:deepCopy']) {
            componentProps = JSON.parse(JSON.stringify(componentProps))
          }
          let componentEvent = {
            'dialog:hide': this.hide,
            'dialog:close': this.close
          }
          for (let index in this._events) {
            if (index !== 'update:visible') {
              componentEvent[index] = (e) => {
                this.$emit(index, e)
              }
            }
          }
          let component = createElement(this.componentName, {
            props: componentProps,
            on: componentEvent
          })
          return component
        }
      }
    })
    return dialog
  },
  props: {
    // 内容组件名字
    'dialog:is': {
      type: String,
      require: true
    },
    // 是否对value进行深拷贝
    'dialog:deepCopy': {
      type: Boolean,
      default: true
    },
    'dialog:autoClose': {
      type: Boolean,
      default: true
    },
  },
  data: function () {
    return {
      closed: false
    }
  },
  methods: {
    // 关闭弹窗，并回收资源
    close: function () {
      this.$emit('update:dialog:visible', false)
      this.closed = true
    },
    // 隐藏弹窗，资源并不回收
    hide: function () {
      this.$emit('update:dialog:visible', false)
    }
  },
  watch: {
    dialogVisible: function (value) {
      if (value) {
        this.closed = false
      } else {
        if (this['dialog:autoClose']) {
          this.closed = true
        }
      }
    }
  },
  computed: {
    componentName: function () {
      return this.closed ? '' : this['dialog:is']
    },
    dialogVisible: function () {
      return this.$attrs['dialog:visible']
    }
  },
}
</script>

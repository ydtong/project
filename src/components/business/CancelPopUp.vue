<template>
    <div id="MessageDialog">
        <!-- 提示内容 -->
        <div class="content_wrapper">
          <!-- 提示图标 -->
          <img src="../../assets/img/warning.svg">
          <!-- 提示文字 -->
          <span>取消分配后将从该部门收回！</span>
        </div>
        <!-- 操作按钮 -->
        <div class="operation_button">
          <el-button size="small" type="primary" @click="cancelBranch">确定</el-button>
          <el-button size="small" class="no-border " @click="closePopup">放弃</el-button>
        </div>
    </div>
</template>

<script>
export default {
  methods: {
    /**
     * @author: 周靖松
     * @information: 确定停用
     * @Date: 2019-04-04 18:25:53
     */
    cancelBranch () {
      this.$emit('cancelBranch')
    },
    /**
     * @author: 周靖松
     * @information: 点击取消
     * @Date: 2019-04-04 18:26:08
     */
    closePopup () {
      this.$emit('closePopup')
    }  
  }
}
</script>


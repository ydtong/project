<template>
<!-- 虚拟号管理页批量操作组件 -->
  <div id="batchTable">
    <div class="left">
      <!-- <span>共{{totle}}条</span> -->
      <span class="selected-box">已选：{{selected}}</span>
      <!-- 按钮插槽 -->
      <slot></slot>
          <el-button  plain 
                      size="small"
                      :disabled="deleteDisabled"  
                      :type="deleteDisabled?'info':'danger'"  
                      @click="batchDelete">删除</el-button>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    //  总条数
    totle: { 
      type: Number,
      default: 0
    },
    //  已选条数
    selected: {     
      type: Number,
      default: 0
    },
    //  删除的状态
    deleteDisabled:{     
      type:[Boolean],
      default:true
    },
  },
  methods: {
    /**
     * @author: 周靖松
     * @information: 删除
     * @Date: 2019-03-15 17:30:06
     */
    batchDelete() {
      this.$emit("batchDelete");
    },
  }
};
</script>

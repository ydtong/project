<template>
<!-- 总机号查询组件 -->
  <div id="switchBoard-select" style="width: 360px;">
    <el-input clearable
              v-model="selectItem"
              size="mini"
              placeholder="请输入总机号搜索"
              prefix-icon="el-icon-erp-search"
              @change="subSelect">
    </el-input>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectItem: "" //搜索框内容
    };
  },
  methods: {
    /**
     * @author: 周靖松
     * @information: 回车提交搜索框查询
     * @Date: 2019-03-11 15:04:54
     */
    subSelect(){
      this.$emit("subSelect",this.selectItem)
    },
  }
};
</script>

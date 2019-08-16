<template>
  <!-- 人员隐号管理页高级搜索表单 -->
  <div class="advanced-search" id="DerailSearch">
    <el-form ref="form" label-width="70px" :model="form">
      <!-- 人员状态字典表下拉 -->
      <el-form-item prop="status" label="人员状态">
        <el-select clearable size="mini" v-model="form.status">
          <el-option  v-for="(item,index) in personState"
                      :key="index"
                      :label="item.label"
                      :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- 长号状态字典表下拉 -->
      <el-form-item prop="isHaveLongVirtual" label="长号状态">
        <el-select clearable size="mini" v-model="form.isHaveLongVirtual">
         <el-option v-for="(item,index) in detailLongCallBindState"
                    :key="index"
                    :label="item.label"
                    :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- 更新时间 -->
      <el-form-item prop="modifyTime" size="mini" label="更新时间">
        <el-date-picker clearable
                        value-format="yyyy-MM-dd"
                        class="picker"
                        v-model="form.modifyTime"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- 按钮插槽 -->
    <div class="advanced-search-btn">
      <slot :form="form"></slot>
      <el-button @click="resetForm('form')" type="text">重置</el-button>
    </div>
  </div>
</template>
<script>
// 引入混入
import { searchForm } from "@/mixins/search_form.js";
export default {
  // 高级搜索逻辑混入(表单的model要是form)
  mixins: [searchForm],
  props: {
    // 人员状态
    personState: {
      type: [Array, Object],
      default: []
    },
    detailLongCallBindState:{
      type: [Array, Object],
      default: []
    }
  },
  data() {
    return {
      form: {
        status: undefined, // 人员状态
        modifyTime: undefined, // 更新时间
        isHaveLongVirtual: undefined //长号状态
      },
      // 表单验证规则
      rules: {}
    };
  }
};
</script>

<style lang="scss">
#DerailSearch{
  .el-form{
    display: flex;
    justify-content: space-between;
    margin: 0px !important;
    .el-form-item{
      width: 200px;
      margin-bottom: 20px;
      // 日期图标
      .el-date-editor .el-range__icon{
        right: 22px;
        top: 2px;
      }
    }
  }
}
</style>
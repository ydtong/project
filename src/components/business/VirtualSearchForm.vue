<template>
  <!-- 虚拟号管理页高级搜索表单 -->
  <div class="advanced-search" id="VirtualSearch">
    <el-form :rules="rules" ref="form" label-position="left" size="small" label-width="60px" :model="form">
      <!-- 部门名称远程搜索 -->
      <el-form-item prop="department " label="部门名称">
        <el-select  clearable
                    v-model="form.department "
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="mentChange"
                    @change="selectChange"
                    @clear="clearInput">
          <el-option  v-for="(item,index) in  departMentArrItem"
                      :key="index"
                      :label="item.name"
                      :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- 隐号状态字典表 -->
      <el-form-item prop="bindingStatus" label="隐号状态">
        <el-select clearable v-model="form.bindingStatus " placeholder="全部">
          <el-option  v-for="(item,index) in hiddenCallBindState"
                      :key="index"
                      :label="item.describe"
                      :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <!-- 是否绑定了长号 -->
      <el-form-item size="mini" v-if="tableMark" prop="longVirtualStatus" label="长号状态">
        <el-select clearable v-model="form.longVirtualStatus">
          <el-option  v-for="(item,index) in virtualLongCallBindState"
                      :key="index"
                      :label="item.describe"
                      :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <!-- 总机号码 -->
      <el-form-item v-if="tableMark" prop="mainPhone " label="总机号码">
        <el-select clearable size="mini" v-model="form.mainPhone">
          <el-option  v-for="item in mainPhoneList"
                      :key="item.code"
                      :label="item.describe"
                      :value="item.describe"></el-option>
        </el-select>
      </el-form-item>
      <!-- 更新时间 -->
      <el-form-item prop="modifyTime" label="更新时间">
        <el-date-picker clearable
                        value-format="yyyy-MM-dd"
                        v-model="form.modifyTime"
                        type="daterange"
                        size="mini"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div style="text-align:right">
      <slot :form="form"></slot>
      <el-button type="cancel" @click="resetForm('form')">重置</el-button>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
// 引入混入
import { searchForm } from "@/mixins/search_form.js";
export default {
  // 高级搜索逻辑混入(表单的model要是form)
  mixins: [searchForm],
  props: {
    // 是否显示总机号选项
    tableMark: {
      type: Boolean,
      default: false
    },
    // 隐号的分配状态
    hiddenCallBranchState: {
      type: [Array, String]
    },
    // 隐号的绑定状态
    hiddenCallBindState: {
      type: [Array, String]
    },
    //模糊搜索的部门结果
    departMentArr: {
      type: [Array, Object],
      default: Array
    },
    //总机号字典
    boardDictionaries: {
      type: [Array, Object],
      default: Array
    },
    // 父组件传过来的重置表单
    refreshPoint: {
      type: Boolean,
      default: false
    },
    // 长号的绑定状态
    virtualLongCallBindState: {
      type: [Array, String]
    },
  },
  computed: {
    ...mapState('virtual_number',[
      // 总机号码字典表
      'mainPhoneList'
    ])
  },
  data() {
    return {
      form: {
        bindingStatus : undefined, //隐号状态
        department : undefined, //部门名称
        longVirtualStatus : undefined, //长号状态
        modifyTime : [],//查询时间
        // 总机号码字典表
        mainPhone: ''
      },
      rules: {}
    };
  }
};
</script>
<style lang="scss">
#VirtualSearch{
  .el-form{
    display: flex;
    justify-content: space-between;
    margin: 0px !important;
    .el-form-item{
      margin-bottom: 20px !important;
    }
  }
}
</style>

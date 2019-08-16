<template>
  <!-- 部门隐号管理页高级搜索表单 -->
  <div class="advanced-search" id="DeptSearch">
    <el-form ref="form" label-width="60px" label-position="left" :model="form">
      <!-- 部门类型 -->
      <el-form-item prop="deptType" size="mini" label="部门类型">
        <el-select clearable v-model="form.deptType" placeholder="请选择">
          <el-option  v-for="(item,index) in departMentType"
                      :key="index"
                      :label="item.name"
                      :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <!-- 部门名称 -->
      <!-- <el-form-item prop="mentSelect" label="部门名称">
        <el-select  size="mini"
                    clearable
                    v-model="form.mentSelect"
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
      </el-form-item> -->
      <!-- 更新时间 -->
      <el-form-item size="mini" label="更新时间">
        <el-date-picker value-format="yyyy-MM"
                        :clearable="false"
                        class="picker"
                        v-model="form.month"
                        type="month"></el-date-picker>
      </el-form-item>
      <!-- 是否加盟 -->
      <el-form-item prop="direct" size="mini" label="是否加盟">
        <el-select clearable v-model="form.direct" placeholder="是否加盟">
          <el-option  v-for="item in directList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- 是否共享 -->
      <el-form-item prop="isShared" size="mini" label="是否共享">
        <el-select clearable v-model="form.isShared" placeholder="是否共享">
          <el-option  v-for="item in shareAreaList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 按钮插槽 -->
    <div style="text-align:right">
      <slot :form="form"></slot>
      <el-button @click="resetForm('form')" type="cancel">重置</el-button>
    </div>
  </div>
</template>
<script>
// 引入混入
import { searchForm } from "@/mixins/search_form.js";
import { mapState } from "vuex";
export default {
  // 高级搜索逻辑混入(表单的model要是form)
  mixins: [searchForm],
  props: {
    // 部门类型字典表
    departMentType: {
      type: [Array, Object],
      default: Array
    },
    //模糊搜索的部门结果
    departMentArr: {
      type: [Array, Object],
      default: Array
    },
    //空闲占用长短号字典表
    numberWhere: {
      type: [Array, Object],
      default: []
    }
  },
  data() {
    return {
      rules: {}, //校验规则
      form: {      
        deptType: '',// 部门类型  
        month: '',// 更新时间
        // 是否加盟
        direct: '',
        // 是否共享
        isShared: ''
      },
    };
  },
  created(){
    // 自动获取当前时间(截取年月)
    let now = new Date()
    let year = now.getFullYear() 
    let month = now.getMonth()
    month = month + 1
    if (month < 10) month = "0" + month
    this.form.month = year + "-" + month
  },
  methods: {
    resetForm(formName){
      this.$refs[formName].resetFields()
      // 自动获取当前时间(截取年月)
      let now = new Date()
      let year = now.getFullYear() 
      let month = now.getMonth()
      month = month + 1
      if (month < 10) month = "0" + month
      this.form.month = year + "-" + month
      // 清空查询条件
      this.$emit('resetIndex', this.form)
    }
  },
  computed:{
    ...mapState("depart_ment", [
      // 加盟字典表
      'directList',
      // 共享字典表
      'shareAreaList'
    ]),
  }
};
</script>

<style lang="scss">
#DeptSearch{
  .el-form{
    display: flex;
    justify-content: space-between;
    .el-form-item{
      margin-bottom: 20px;
    }
  }
}
</style>
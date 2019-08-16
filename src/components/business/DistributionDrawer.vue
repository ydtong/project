<template>
  <!-- 部门管理页分配侧滑表单 -->
  <el-form id="distributionDrawer" label-position="left" :model="form" label-width="70px">
    <!-- 远程搜索姓名 -->
    <el-form-item size="mini" label="姓名">
      <el-select  size="mini"
                  clearable
                  v-model="form.name"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="querySearchAsync"
                  @visible-change="visibleChange"> 
        <el-option  clearable
                    v-for="(item,index) in  personMove"
                    :key="index"
                    :label="item.name"
                    :value="valueMark?item.basicId:item.name"></el-option>
      </el-select>
    </el-form-item>
    <!-- 远程搜索工作电话 -->
    <el-form-item size="mini" label="工作电话">
      <el-select clearable v-model="form.workCall" placeholder="请选择工作电话">
         <el-option clearable
                    v-for="(item,index) in  personWorkCall"
                    :key="index"
                    :label="item"
                    :value="item"></el-option>   
      </el-select>
    </el-form-item>
    <!-- 按钮插槽 -->
    <el-form-item>
      <slot></slot>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props:{
    // 远程搜索人员详情返回值
    personMove:Array,
    // 远程搜索人员工作电话
    personWorkCall:Array
  },
  data() {
    return {
      form: {
        name: null, //姓名
        workCall: null //工作电话
      },
      valueMark:false,// 传值是否是id
    };
  },
  methods: {
    /**
     * @author: 周靖松
     * @information: 下拉框被收回时
     * @Date: 2019-03-28 16:13:26
     */
    visibleChange(val){
      !val&&this.form.name.length 
         ?(this.$emit("postWorkName", this.form.name),this.valueMark=true)
         :this.valueMark=false 
    },
    /**
     * @author: 周靖松
     * @information: 远程搜索
     * @Date: 2019-03-17 17:01:06
     */
    querySearchAsync(val) {
      val.length &&this.$emit("postWorkName", val)  
    },
  },
  /**
   * @author: 周靖松
   * @information: 工作电话赋值
   * @Date: 2019-04-16 18:30:30
   */
  updated(){
    this.form.workCall=this.personWorkCall[0]
  },
};
</script>
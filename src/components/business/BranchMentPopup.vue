<template>
<!-- 分配部门弹窗 -->
  <div id="branchMent">
    <el-form label-position="left">
      <!-- 部门 -->
      <el-form-item label="部 门">
        <el-select  size="mini"
                    clearable
                    v-model="querySearch"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="branchMentChange"
                    @change="selectChange">
          <el-option  v-for="(item,index) in  departMentArrItem"
                      :key="index"
                      :label="item.name"
                      :value="item"></el-option>
        </el-select>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" class="first-btn" @click="branchMentSub">确定</el-button>
        <el-button class="assist-btn" @click="closePopup">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default { 
  props:{
    //模糊搜索的部门结果
    departMentArr:{
      type:[Array,Object],
      default:Array,
    }
  },
    data(){
        return {
            querySearch:null,//远程搜索的值
            mentArr:[],//部门名称arr
            selectMentItem:undefined,//下拉选中的值
        }
    },
    methods:{
    /**
     * @author: 周靖松
     * @information: 分配部门确定
     * @Date: 2019-03-17 17:32:39
     */    
    branchMentSub(){
        this.$emit("branchMentSub",this.selectMentItem)
        this.$store.commit("hidden_call/DEPART_MENT_ARR", null)
    },
    /**
     * @author: 周靖松
     * @information: 关闭弹窗
     * @Date: 2019-03-17 17:38:38
     */
    closePopup(){
        this.$emit("closePopup")
    },
    /**
     * @author: 周靖松
     * @information: 实时请求部门
     * @Date: 2019-03-20 11:24:16
     */
    branchMentChange(val){
      val.length&&this.$emit("branchMentChange",val)  
    },
        /**
     * @author: 周靖松
     * @information: 高级搜索被选中
     * @Date: 2019-03-31 19:46:49
     */
    selectChange(val){
      this.querySearch=val.name
      this.selectMentItem=val
    },
  },
  computed:{
    /**
     * @author: 周靖松
     * @information: 部门远程搜索下拉
     * @Date: 2019-04-16 18:34:29
     */
    departMentArrItem(){
      return this.departMentArr
    }
  },
};
</script>

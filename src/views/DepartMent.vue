<template>
  <div style="height: 100%;" id="departMent">
    <el-container type="whole">
      <!-- 主要内容 -->
      <el-main type="whole">
        <template slot="advanced-search">
          <!-- 高级搜索组件 -->
            <el-advanced-search @toggle-advance-search="toggleAdvanceSearch"  
                                @close-advance-search="closeAdvanceSearch"  
                                @remote-method="fuzzyChange"
                                @keyup-enter="downEnter"
                                @clear='clearInput'
                                ref="advancedSearch"
                                :list="fuzzySearchItem"
                                :visible="visible"
                                :flag="point"
                                placeholder="请输入部门名称搜索"
                                @change="selectChange"
                                value-key="inDept"
                                :sign-list="['inDept']"
                                joiner="-"
                                :jitter-tiem="500">
              <!-- 插槽插入表单 -->
              <depart-search-form :numberWhere="numberWhere"
                                  :departMentType="departMentType"     
                                  :departMentArr="departMentArr"
                                  @pointMark="pointMark"
                                  @resetIndex="resetSearch"
                                  @mentChange="getBranchMent">
                <!-- 表单插槽插入一个查询按钮 -->
                <template v-slot="scope">
                  <el-button @click="seniorSearch(scope.form)" size="small" type="primary">查询</el-button>
                </template>
              </depart-search-form>
            </el-advanced-search>
        </template>
        <template slot="table">
          <!-- 表格 -->
          <hidden-call-table  ref="table"
                              :updateHeight="808"
                              :updatewidth="180"
                              :tableHeadItem="tableHeadItem"
                              :tableData="tableData"    
                              :loadingMark="loadingMark"
                              :operation="true"
                              :pageInfo="searchModel.pageInfo"
                              @virtualDrawer="virtualDrawer">
          </hidden-call-table>
        </template>
      </el-main>
      <el-footer>
          <!-- 分页 -->
        <pagination :currentPage="searchModel.pageInfo.page"
                    :pageSize="searchModel.pageInfo.size"
                    :count="count"
                    :pages="pages"
                    @sizeChang="sizeChang"
                    @currentChang="currentChang"></pagination>
      </el-footer>
    </el-container>
    <!-- 空闲占用长短号侧滑4个侧滑 -->
    <el-drawer :visible.sync="drawerMark"
              :size="'700px'"
              :append-to-body="false"
              :title="virtualHistoryTitle"
            @on-close="drawerMark=false">
      <div v-if="drawerMark">
        <!-- 表格 -->
        <el-table border
                  height="759"
                  class="drawer_table"
                  v-loading="drawerTableLoading"
                  style="position: relative;"
                  :data="subHiddenCallBody.list">
          <el-table-column
                type="index"
                label="序号"
                align="center"
                width="55"
                :index="((virtualHistorySearch.pageInfo.page-1) * virtualHistorySearch.pageInfo.size)+1"
              ></el-table-column>
          <el-table-column v-for="(item,index) of subHiddenCallHead"
                          :key="index"
                          :prop="item.fieldName"
                          :label="item.describe"
                          show-overflow-tooltip></el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <pagination :currentPage="virtualHistorySearch.pageInfo.page"
                    :pageSize="virtualHistorySearch.pageInfo.size"
                    :count="subHiddenCallBody.totalElements"
                    @sizeChang="changeSize"
                    style="text-align:right;margin-top:20px;"
                    @currentChang="changePage"></pagination>
      </div>
    </el-drawer>
  </div>
</template>

<script>
// 引入混入
import { searchView } from "@/mixins/search_view.js";
import { publicClass } from "@/mixins/public_class.js";
import { departMentData } from "@/mixins/depart_ment_data.js";
import { mapState } from "vuex";

export default {
  mixins: [
    searchView,//路由视图高级搜索逻辑
    publicClass,//公共常用方法
    departMentData,//方法，属性声明
  ],
  data(){
    return{
      // 隐号占用历史
      virtualHistorySearch:{
        pageInfo:{
          page: 1,
          size: 20
        },
        query:{
          // 部门id
          inDeptId:'',
          // 隐号类型
          utype:''
        }
      },
      // 隐号历史title
      virtualHistoryTitle:'',
      // 查询条件
      searchModel:{
        pageInfo: {
          page: 1,//页
          size: 20//条
        },
        query: {
          month:''
        }
      },
      // 表格loading
      tableLoading: false,
      // 点击侧滑类型
      drawerType: '',
      // 隐号的title、类型、方法
      virtualModel:{
        // 占用短号
        occupyShortNumber:{
          utype: '0',
          title: '占用短隐号',
          tableHeaderFun: 'deptShortVirtualHeader',
          tableBodyFun: 'departmentVirtuals'
        },
        // 占用长号
        occupyLongNumber:{
          utype: '1',
          title: '占用长隐号',
          tableHeaderFun: 'deptLongVirtualHeader',
          tableBodyFun: 'departmentVirtuals'
        },
        // 短号历史
        historyShortNumber: {
          utype: '0',
          title: '短隐号历史',
          tableHeaderFun: 'deptShortVirtualHistoryHeader',
          tableBodyFun: 'departmentVirtualHistory'
        },
        // 长号历史
        historyLongNumber: {
          utype: '1',
          title: '长隐号历史',
          tableHeaderFun: 'deptLongVirtualHistoryHeader',
          tableBodyFun: 'departmentVirtualHistory'
        }
      },
      // 侧滑表格loading
      drawerTableLoading: false
    }
  },
  methods:{
    currentChang(page){
      this.searchModel.pageInfo.page = page;
      this.tableBody();
    },
    sizeChang(size){
      this.searchModel.pageInfo.size = size;
      this.tableBody();
    },
    clearInput() {
      this.fuzzyItem = undefined;
      // 虚拟号那边的请求值
      this.searchModel.query.vagueParameter = undefined;
      // 人员库那边的请求值
      this.searchModel.query.more=undefined
      this.searchModel.query.inDeptId=undefined
      // 刷新到第一页并请求
      this.tableBody()
    },
    /**
     * @author: 周靖松
     * @information: 高级搜索选中拉下选项
     * @Date: 2019-04-02 18:16:16
     */
    selectChange(val,context) {
      if (context) {
        this.searchModel.query.inDeptId = context.inDeptId
        // 请求表体
        this.tableBody()
      }
    },
    /**
     * 高级搜索查询
     * @author 阎田
     * @date 2019-8-4
     */
    seniorSearch(form){
      // 关闭下拉
      this.visible = false;
      // 整合查询条件
      Object.assign(this.searchModel.query, form)
      // 刷新表格数据
      this.tableBody()
    },
    /**
     * 高级搜索重置
     * @author 阎田
     * @date 2019-8-4
     */
    resetSearch(form){
      // 整合查询条件
      Object.assign(this.searchModel.query, form)
      // 刷新表格数据
      this.tableBody()
    },
    /**
     * @author: 周靖松
     * @information: 请求表体
     * @Date: 2019-03-11 10:31:18
     */
    tableBody() {
      this.loadingMark = true
      this.$store.dispatch('depart_ment/postTableBody', this.searchModel).then(() => {
        this.loadingMark = false
      })
    },
    /**
     * 隐号历史分页
     * @author 阎田
     * @date 2019-7-12
     */
    changePage(page){
      // 赋值页数
      this.virtualHistorySearch.pageInfo.page = page
      // 打开loading
      this.drawerTableLoading = true
      // 请求数据
      this.$store.dispatch(`depart_ment/${this.virtualModel[this.drawerType].tableBodyFun}`, this.virtualHistorySearch).then(() => {
        // 关闭loading
        this.drawerTableLoading = false
      })
    },
    changeSize(size){
      // 赋值条数
      this.virtualHistorySearch.pageInfo.size = size
      // 打开loading
      this.drawerTableLoading = true
      // 请求数据
      this.$store.dispatch(`depart_ment/${this.virtualModel[this.drawerType].tableBodyFun}`, this.virtualHistorySearch).then(() => {
        // 关闭loading
        this.drawerTableLoading = false
      })
    },
    /**
     * 点击空闲隐号查看历史
     * @author 阎田
     * @date 2019-7-12
     * @param item 行内数据
     */
    virtualDrawer(item) {
      // 存储改行数据
      this.drawerRow = item.val;
      // 赋值部门id
      this.virtualHistorySearch.query.inDeptId = item.val.inDeptId
      // 存储点击类型
      this.drawerType = item.name
      // 重置页码
      this.virtualHistorySearch.pageInfo.page = 1
      this.virtualHistorySearch.pageInfo.size = 20
      // 赋值隐号类型
      this.virtualHistorySearch.query.utype = this.virtualModel[item.name].utype
      // 赋值title
      this.virtualHistoryTitle = this.virtualModel[item.name].title
      // 请求表头
      this.$store.dispatch(`depart_ment/${this.virtualModel[item.name].tableHeaderFun}`).then(() => {
        // 请求数据
        return this.$store.dispatch(`depart_ment/${this.virtualModel[item.name].tableBodyFun}`, this.virtualHistorySearch)
      }).then(() => {
        // 展开侧滑
        this.drawerMark = true;
      })
    },
    /**
     * @author: 周靖松
     * @information: 短隐号分配侧滑确定被点击
     * @Date: 2019-03-19 17:56:45
     */
    showDrawerSub() {
      // 等接口
      this.drawerMark = false;
      this.drawerTableShow = true;
    },
    /**
     * @author: 周靖松
     * @information: 长隐号分配侧滑确定被点击
     * @Date: 2019-03-19 17:56:45
     */
    longDrawerSub() {
      // 等接口
      this.drawerMark = false;
      this.drawerTableShow = true;
    },
    /**
     * @author: 周靖松
     * @information: 点击分配虚拟号
     * @parma: val 选中行的数据
     * @Date: 2019-03-21 18:44:05
     */
    branchCall(val) {
      this.rowItem = val;
      // 打开弹窗
      this.distributionMark = true;
    },
    /**
     * @author: 周靖松
     * @information: 点击回收虚拟号
     * @parma: val 选中行的数据
     * @Date: 2019-03-21 18:47:36
     */
    recoveryCall(val) {
      this.rowItem = val;
      // 打开弹窗
      this.recoveryMark = true;
    },
    /**
     * @author: 周靖松
     * @information: 人员详情远程搜索
     * @parma: val   select的值
     * @Date: 2019-03-28 14:54:25
     */
    postPersonWorkName(val) {
      this.searchModel.query = {};
      this.searchModel.query.more = val;
      this.postWorkName(this.searchModel);
    },
  },
  computed:{
    ...mapState("depart_ment", [
      // 占用虚拟号历史表头
      "subHiddenCallHead",
      // 占用虚拟号历史数据
      "subHiddenCallBody",
    ]),
  },
  mounted(){
    // 自动获取当前时间(截取年月)
    let now = new Date()
    let year = now.getFullYear() 
    let month = now.getMonth()
    month = month + 1
    if (month < 10) month = "0" + month
    this.searchModel.query.month = year + "-" + month
    // 请求部门类型字典表
    this.getDepartMentType();
    //  空闲占用长短号状态字典表
    this.deptVirtualNumberWhere();
    // 请求虚拟号类型字典表
    this.getHiddenCallType();
    // 请求加盟店字典表
    this.$store.dispatch('depart_ment/getDirectList')
    // 共享字典表
    this.$store.dispatch('depart_ment/getShareArea')
    // 部门隐号数据权限 this.$commonUtils.getUrlkey(window.location.href).code
    this.$store.dispatch('depart_ment/departDataJurisdiction', {projectMark: this.$commonUtils.getUrlkey(window.location.href).code}).then(() => {
      this.getTableHead();
      this.tableBody();
      // 短隐号侧滑
      // this.$store.dispatch('depart_ment/deptShortVirtualHeader')
      // 长隐号侧滑
      // this.$store.dispatch('depart_ment/deptLongVirtualHeader')
    })
  }
};
</script>
<style lang="scss">
@import "../style/business/depart_ment.scss";
.dept_drawer_table{
  .el-table{
    width:545px !important;
  }
}
#departMent{
  .el-drawer__body{
    padding: 0 30px;
    .drawer_table{
      border-bottom: 1px solid #E2E2E2;
    }
  }
}
</style>

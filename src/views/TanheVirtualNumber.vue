<template>
  <div id="virtualnumber" style="height: 100%;">
    <el-container type="whole">
      <!-- 主要内容 -->
      <el-main type="whole">
        <template slot="advanced-search">
          <el-advanced-search @toggle-advance-search="toggleAdvanceSearch"  
                                @close-advance-search="closeAdvanceSearch"  
                                @remote-method="fuzzyChange"
                                @keyup-enter="downEnter"
                                @clear='clearInput'
                                ref="advancedSearch"
                                :list="fuzzySearchItem"
                                :visible="visible"
                                :flag="point"
                                :placeholder="'请输入虚拟号搜索'"
                                @change="selectChange"
                                value-key="virtualPhone"
                                :sign-list="['virtualPhone']"
                                joiner="-"
                                :jitter-tiem="500">
              <!-- 高级搜索的表单 -->
              <virtual-search-form
                :virtualLongCallBindState="virtualLongCallBindState"
                :tableMark="tableMark"
                :hiddenCallBindState="hiddenCallbBindArr"
                :hiddenCallBranchState="hiddenCallBranchArr"
                :departMentArr="departMentArr"
                :refreshPoint="refreshPoint"
                :boardDictionaries="boardDictionaries"
                @pointMark="pointMark"
                @resetIndex="resetIndex"
                @mentChange="getBranchMent">
                <!-- 表单插槽插入一个查询按钮 -->
                <template v-slot="scope">
                  <el-button @click="seniorSearch(scope.form)" size="small" type="primary">查询</el-button>
                </template>
              </virtual-search-form>
            </el-advanced-search>
        </template>
        <template slot="util">
          <!-- 表格批量操作 -->
            <batch-operation
              :totle="count"
              :branchDisabled="branchDisabled"
              :selected="rowLength"
              :batchDisabled="batchDisabled"
              :deleteDisabled="deleteDisabled"
              @batchDelete="deleteDrawerMark = true;">
              <template slot="right">
                <el-button
                  type="primary" size="small"
                  @click="tableMark
                    ?addLongCall=true
                    :addShowCall=true">新增短隐号</el-button>
                <el-button type="primary" size="small" @click="downLoad">下载模板</el-button>
                <!-- 上传excel -->
                <el-upload style="display:inline-block;margin-left:7px;" ref="upload" action multiple :http-request="templateImportExcel">
                  <el-button size="small" :loading="excelLoading" type="primary">{{excelLoading?'导入中':'导入Excel'}}</el-button>
                </el-upload>
              </template>
              </batch-operation>
        </template>
        <template slot="table">
          <!-- 表格（默认显示短隐号表） -->
        <hidden-call-table
          selected
          operation      
          :updateHeight="757"
          :updatewidth="240"
          :pageInfo="searchModel.pageInfo"
          :tableHeadItem="tableHeadItemArr"
          :tableData="tableData"
          :loadingMark="loadingMark"
          @checkRowChang="checkRowChang"></hidden-call-table>
        </template>
      </el-main>
      <el-footer>
              <!-- 分页 -->
          <pagination
            :currentPage="searchModel.pageInfo.page"
            :pageSize="searchModel.pageInfo.size"
            :count="count"
            :pages="pages"
            @sizeChang="sizeChang"
            @currentChang="currentChang"></pagination>
          </el-footer>
    </el-container>
    <!-- 新增短隐号侧滑 -->
    <el-drawer title="新增短隐号" :visible.sync="addLongCall" :size="'25%'" :append-to-body="false">
      <!-- 侧滑插入新增表单 -->
      <call-drawer-form
        v-if="addLongCall"
        :hiddenCallBranchArr="hiddenCallBranchArr"
        :boardDictionaries="boardDictionaries"
        :unicomHiddenBlur="unicomHiddenBlur"
        :tableMark="tableMark"
        :departMentArr="departMentArr"
        :hiddenBlur="hiddenBlur"
        @mentChange="getBranchMent"    
        @submitForm="addShowCallSave"
        @closeDrawer="addLongCall=false"
        @hiddenInputBlur="hiddenInputBlur"     
        @unicomInputBlur="unicomInputBlur"></call-drawer-form>
    </el-drawer>
    <!-- 删除弹窗 -->
    <grace-dialog class="deletePopup"
                  dialog:is="DeletePopUp"
                  dialog:title="确认删除"
                  :dialog:visible.sync="deleteDrawerMark"
                  @closepopup="deleteDrawerMark = false;"
                  @deleteBoard="deleteBoard"></grace-dialog>
  </div>
</template>
<script>
//引入mapState
import { mapState,mapActions } from "vuex";
// 引入混入
import { searchView } from "@/mixins/search_view.js";
import { virtualNumberData } from "@/mixins/virtual_number_data.js";
//引入工具
import { message } from "@/assets/js/tool";
import asyncWhile from "async-while";

export default {
  // 路由试图高级搜索逻辑
  mixins: [searchView,virtualNumberData],
  computed: {
    // 虚拟号管理页store的储存值
    ...mapState("virtual_number", [
      "tableHeadItem", //隐号表头
      "tableData", //隐号表体
      "count", //总条数
      "pages", //总共多少页
      "fuzzySearchItem", //模糊搜索返回值
      "hiddenBlur", //虚拟号是否重复
      "unicomHiddenBlur" //联通长号是否重复
    ]),
    // 父页面的store的储存值（字典表）
    ...mapState("hidden_call", [
      "hiddenCallBranchArr", //虚拟号类型字典表
      "hiddenCallbBindArr", //虚拟号绑定类型字典表
      "boardDictionaries", //总机号字典
      "departMentArr", //远程搜索返回值
      "virtualLongCallBindState", //长号绑定状态
      "departMentArr",//分配部门远程搜索
    ])
  },
  data() {
    return {
      deleteDrawerMark: false, //删除弹窗开关
      branchMent: false, //分配部门弹窗开关
      virtualNumberList: [], //选中的的虚拟号数组
      rowLength: 0, //选中的数量
      tableMark: true, //长短隐号表格切换
      stateArr: [], //状态数组
      deptName: true, //是否分配部门
      batchDisabled: true, //批量操作取消按钮是否置灰
      branchDisabled: true, //批量操作分配部门是否置灰
      deleteDisabled: true, //批量删除按钮是否置灰
      point: false, //高级搜索没有红点
      addShowCall: false, //短隐号新增侧滑开关
      addLongCall: false, //长隐号新增侧滑开关
      refreshPoint: false, //刷新关闭红点
      tableHeadItemArr: null, //隐藏后的表头
      loadingMark: false, //是否显示加载
      excelLoading: false, //excel按钮loading
      // 默认查询条件
      searchModel: {
        pageInfo: {
          page: 1,//页
          size: 20//条
        },
        query: {}
      },
    };
  },
  methods: {
    /**
     * @author: 周靖松
     * @information: 高级搜索选中拉下选项
     * @Date: 2019-04-02 18:16:16
     */
    selectChange(val,context) {
      if (context) {
        this.searchModel.query.id = context.id
        // 请求表体
        this.tableBody() 
      }
    },
    /**
     * @author: 周靖松
     * @information: 回车搜索收起下拉
     * @parma: val 输入框的值
     * @Date: 2019-04-02 20:09:14
     */
    downEnter(val){
      this.searchModel.query.more = val
      // 刷新到第一页并请求
      this.tableBody() 
    },
    /**
     * @author: 周靖松
     * @information: 高级搜索模糊搜索
     * @Date: 2019-03-30 20:13:03
     */
    fuzzyChange(val) {
      typeof val == "string"
         ? (()=>{this.fuzzyItem = val;
           this.searchModel.query.more = val})()
         : (()=>{this.fuzzyItem = val.data.virtualNumber;
           this.searchModel.query.more = val.data.virtualNumber})()
           this.searchModel.pageInfo.page=1
      // 请求表体但不刷新页面
      this.$store.dispatch("virtual_number/showFuzzyChange", this.searchModel);
    },
    /**
     * @author: 周靖松
     * @information: 下载模板
     * @Date: 2019-03-15 11:58:58
     */
    downLoad() {
      this.$store.dispatch("virtual_number/getShowDownLoad");
    },
    /**
     * @author: 周靖松
     * @information: 确定删除
     * @Date: 2019-03-14 17:07:41
     */
    deleteBoard() {
      let len = this.idArray.length;
      let myWhile = asyncWhile(() => {
        return this.idArray.length;
      }, async () => {
        let item = this.idArray.pop();
        try{
          let res = await this.putDeleteShowCall(item)
          return true;
        }
        catch(error){
          return false;
        }
      });
      myWhile().then(() => {
        this.delBtnLoading = false
        this.deleteDrawerMark = false
        this.tableBody() 
        this.$message({
          message: '虚拟号删除成功',
          type: 'success',
          showClose: true,
          duration: 5000
        });
      });
    },
    /**
     * @author: 周靖松
     * @information: 获取选中的行数据
     * @parma:val  表格被选中行的所有数据
     * @Date: 2019-03-15 18:30:14
     */
    checkRowChang(val) {
      // 初始化数组
      this.virtualNumberList = []; //虚拟号数组
      this.stateArr = []; //状态数组
      this.deptNameArr = []; //返回的值里边是否有部门的数组
      this.deptName = false; //是否显示分配部门
      //放入状态数组和删除id数组
      val.forEach(val => {
        this.virtualNumberList.push(val.virtualNumber);
        this.stateArr.push(val.isBinding);
        // 部门是否为空
        val.deptName == null
          ? this.deptNameArr.push(true)
          : this.deptNameArr.push(false);
      });
      this.rowLength = val.length;
      // 监听取消分配按钮是否置灰
      this.disabledChang(val);
      // 监听分配部门按钮是否置灰
      this.branchChang(val);
      // 监听批量删除按钮置灰
      this.deleteChang(val);
      this.idArray = val.map(el => {
        return el.id
      })
    },
    /**
     * @author: 周靖松
     * @information: 监听取消分配按钮是否置灰
     * @Date: 2019-03-17 16:08:34
     */
    disabledChang(val) {
      val.length &&!this.stateArr.includes(true) &&!this.deptNameArr.includes(true)
        ? this.batchDisabled = false
        : this.batchDisabled = true
    },
    /**
     * @author: 周靖松
     * @information: 监听分配部门按钮是否置灰
     * @Date: 2019-03-17 16:08:34
     */
    branchChang(val) {
      // 如果所有的选中数据都没有部门则可以点击
      val.length && !this.deptNameArr.includes(false)
        ? this.branchDisabled = false
        : this.branchDisabled = true
    },
    /**
     * @author: 周靖松
     * @information: 监听批量删除按钮置灰
     * @Date: 2019-03-17 18:29:21
     */
    deleteChang(val) {
      // 存在选中数据
      if(val.length !== 0){
        // 选中数据是否存在占用状态（存在删除按钮禁止点击）
        this.deleteDisabled = val.some((item, index, array) => {
          return item.bindingStatusCode === true
        })
      } else {
        // 不存在选中数据删除按钮置灰
        this.deleteDisabled = true
      }
    },
    /**
     * @author: 周靖松
     * @information: 请求短隐号表体
     * @parma:
     * @Date: 2019-03-11 10:31:18
     */
    tableBody() {
      this.loadingMark=true
      this.$store.dispatch("virtual_number/showTableBody", this.searchModel).then(res => {
        // 关闭loading
        this.loadingMark=false
      }).catch(error => {
      // 关闭loading
      this.loadingMark=false
      })
    },
    /**
     * @author: 周靖松
     * @information: 高级搜索点击查询
     * @parma:val 表单数据
     * @Date: 2019-03-20 10:19:45
     */
    seniorSearch(val) {
      // 关闭下拉
      this.visible = false;
      // 赋值model
      this.searchModelSave(val);
      this.searchModel.pageInfo.page=1
      // 请求表体
      this.tableBody();
    },
    /**
     * @author: 周靖松
     * @information: 远程搜索
     * @parma: val 搜索的值
     * @Date: 2019-03-28 11:28:28
     */
    branchMentChange(val) {
      this.$store.dispatch("virtual_number/getBranchMent", val);
    },
    /**
     * @author: 周靖松
     * @information: 高级搜索查询值赋值缓存
     * @Date: 2019-03-21 15:11:06
     */
    searchModelSave(val) {
      // 判断数组里的值不为空字符
      val.deptIds && val.deptIds.toString()
        ? val.deptIds = val.deptIds
        : val.deptIds = undefined
      // 去除空数据
      for (let key in val) {
        val[key]=="0"?val[key]=val[key]:val[key]?val[key]=val[key]:val[key]=undefined   
      }
      this.searchModel.query = { ...val, more: this.fuzzyItem };
    },
    /**
     * @author: 周靖松
     * @information: 当前页
     * @Date: 2019-03-11 16:00:22
     */
    currentChang(val) {
      this.searchModel.pageInfo.page = val;
      // 请求表体
      this.tableBody();
    },
    /**
     * @author: 周靖松
     * @information: 当前条
     * @Date: 2019-03-11 16:00:57
     */
    sizeChang(val) {
      this.searchModel.pageInfo.size = val;
      // 请求表体
      this.tableBody();
    },
    /**
     * @author: 周靖松
     * @information: 监听高级搜索下拉被销毁
     * @parma: val 被销毁前是否有值
     * @Date: 2019-03-22 14:30:45
     */
    pointMark(val) {
      // 取消红点
      this.point = val;
    },
    /**
     * @author: 周靖松
     * @information: 点击重置重置页面收起下拉
     * @Date: 2019-03-30 17:44:08
     */
    resetIndex() {
      // 关闭下拉
      this.$refs.advancedSearch.dropFlag = false;
      this.$refs.advancedSearch.soltFlag = false;
      // 重置列表
      this.searchModel.query = {};
      // 请求表体
      this.searchModel.pageInfo.page=1
      this.tableBody();
    },
    /**
     * @author: 周靖松
     * @information: 回车搜索收起下拉
     * @parma: val 输入框的值
     * @Date: 2019-04-02 20:09:14
     */
    downEnter(val) {
      this.searchModel.query.vagueParameter = val.value;
      // 请求表体
      this.searchModel.pageInfo.page=1
      this.tableBody();
    },
    /**
     * @author: 周靖松
     * @information: 新增短隐号保存
     * @Date: 2019-03-22 16:27:40
     */
    addShowCallSave(val) {
      this.$store.dispatch("virtual_number/postAddShowCall", val).then(res => {
        // 请求成功后的操作
        if (res && res.statusCode == 1000) {
          this.addLongCall = false;
          this.message.shoWmessage("虚拟号新增成功", "success")
        } else {
          this.message.shoWmessage(res ? res.message : "虚拟号新增失败", "error")
        } 
        this.searchModel.query = {};
        this.tableBody();
      });
    },
    /**
     * @author: 周靖松
     * @information: 导入excel
     * @Date: 2019-03-24 09:41:20
     */
    templateImportExcel(fileObj) {
      // 创建Formdata实例
      const formData = new FormData();
      formData.append("file", fileObj.file);
      formData.append("type", "text/html;charset=UTF-8");
      // excelLoading开关
      this.excelLoading=true
      this.$store.dispatch("virtual_number/putShowImportExcel", formData).then(res => {
          this.tableBody()
          this.message.shoWmessage("虚拟号导入成功", "success")
           // excelLoading开关
          this.excelLoading=false
          setTimeout(()=>{
             this.$refs.upload.clearFiles()
          },2000) 
      })
      .catch(error=>{
          this.message.shoWmessage(error.message, "error")
          // excelLoading开关
          this.excelLoading=false
          setTimeout(()=>{
             this.$refs.upload.clearFiles()
          },2000) 
      })
    },
    /**
     * @author: 周靖松
     * @information: 高级搜索清除数据刷新页面
     * @Date: 2019-03-31 21:44:58
     */
    clearInput() {
      this.fuzzyItem = undefined;
      this.searchModel.query.vagueParameter = undefined;
      this.searchModel.pageInfo.page=1
      this.tableBody();
    },
    /**
     * @author: 周靖松
     * @information: 高级搜索选中拉下选项
     * @Date: 2019-04-02 18:16:16
     */
    selectChange(val, context) {
      if(context){
        this.searchModel.query.more = context.virtualNumber;
        this.searchModel.pageInfo.page=1
        this.tableBody();
      }
    },
    /**
     * @author: 周靖松
     * @information: 新增表单的input失去焦点查询重复
     * @parma: val 失去焦点时的值
     * @Date: 2019-04-04 16:30:36
     */
    hiddenInputBlur(val) {
     (val && this.tableMark)&&this.$store.dispatch("virtual_number/showHiddenBlur", val)
    },
    /**
     * @author: 周靖松
     * @information: 新增表单联通长号失去焦点查询重复
     * @parma: val 联通长号
     * @Date: 2019-04-04 17:06:09
     */
    unicomInputBlur(val) {
      val && this.$store.dispatch("virtual_number/unicomHiddenBlur", val)
    }
  },
  mounted() {
    /**
     * @author: 周靖松
     * @information: 请求表头隐藏指定表头
     * @parma: 
     * @Date: 2019-04-14 17:00:07
     */
    this.$store.dispatch("virtual_number/tanheShowTableHead").then(res=>{
      // 表头隐藏字段
        Object.defineProperties(res.result, {
          "4": { enumerable: false },
          "6": { enumerable: false }
        });
        this.tableHeadItemArr = [ ...res.result ];
    })
    /**
     * @author: 周靖松
     * @information: 生命周期请求表格
     * @Date: 2019-03-11 10:31:26
     */
    this.tableBody()
    // 请求总机号字典表
    this.$store.dispatch("hidden_call/getBoardDictionaries");
    // 请求虚拟号绑定类型字典表
    this.getHiddenCallBind();
    // 请求虚拟号分配类型字典表
    this.getHiddenCallBranch();
    //  请求虚拟号管理长号状态字典表
    this.virtualLongCallState();
    //  请求查询总机号码字典表
    this.virtualMainPhones();
  },
};
</script>
<style lang="scss">
@import "../style/business/virtual_number.scss";
</style>


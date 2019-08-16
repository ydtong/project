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
              <virtual-search-form  ref="advancedSearchForm"
                                    :virtualLongCallBindState="virtualLongCallBindState"
                                    :tableMark="tableMark"
                                    :hiddenCallBindState="hiddenCallbBindArr"
                                    :hiddenCallBranchState="hiddenCallBranchArr"
                                    :departMentArr="departMentArr"
                                    :boardDictionaries="boardDictionaries"
                                    @pointMark="pointMark"
                                    @resetIndex="seniorSearch({})"
                                    @mentChange="getBranchMent">
                <!-- 表单插槽插入一个查询按钮 -->
                <template v-slot="scope">
                  <el-button @click="seniorSearch(scope.form)" size="small" type="primary">查询</el-button>
                </template>
              </virtual-search-form>
            </el-advanced-search>
          </template>
          <template slot="button-use">
            <el-radio v-model="tableMark" @change="showNumber" :label="true">虚拟短号</el-radio>
            <el-radio v-model="tableMark" @change="longNumber" :label="false">虚拟长号</el-radio>
          </template>
          <template slot="util">
            <!-- 表格批量操作 -->
            <batch-operation  :totle="count"
                              :branchDisabled="branchDisabled"
                              :selected="rowLength"
                              :batchDisabled="batchDisabled"
                              :deleteDisabled="deleteDisabled"
                              @batchDelete="deleteDrawerMark = true;">
              <template slot="right">
                <el-button  type="primary" size="small"
                    @click="addDrawerForm=true">新增</el-button>
                <el-button type="primary" @click="downLoad" size="small" :loading="downLoading">下载模板</el-button>
                <el-button type="primary" @click="getDownExcel" size="small" :loading="downExcelLoading" v-show="tableMark">导出excel</el-button>
                <!-- 上传excle clearFiles -->
                <el-upload style="display: inline-block;" class="upload_text" ref="upload" action multiple :http-request="templateImportExcel">
                  <el-button size="small" :loading="excelLoading" type="primary">{{excelLoading?'导入中':'导入Excel'}}</el-button>
                </el-upload>
              </template>
            </batch-operation>
          </template>
          <template slot="table">
            <!-- 表格（默认显示短隐号表） -->
            <hidden-call-table  ref="table"
                                selected
                                @checkRowChang="checkRowChang"
                                :pageInfo="searchModel.pageInfo"
                                :updateHeight="757"
                                :updatewidth="200"
                                :tableHeadItem="tableHeadItem"
                                :tableData="tableData"
                                :loadingMark="loadingMark">
              <!-- 表格插槽插入绑定历史按钮 -->
              <template v-slot="scope">
                <el-button  class="warning"
                            type="warning"
                            plain
                            round
                            @click.stop="updateClick(scope.scope.row)">修改</el-button>
                <el-button  class="warning"
                            type="warning"
                            plain
                            v-by:restricts="buttonJurisdictionList" limit="0601020101"
                            :disabled="!scope.scope.row.bindingStatusCode"
                            round
                            @click.stop="openUnBinding(scope.scope.row)">解绑</el-button>
                <el-button  class="warning"           
                            type="primary"
                            plain
                            round
                            :disabled="!scope.scope.row.isHistory"
                            @click.stop="bindHistory(scope.scope.row)">历史</el-button>
              </template>
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
      <!-- 绑定历史侧滑 -->
    <el-drawer :title="historyTitle" custom-class="history_drawer" :visible.sync="showDrawer" :size="'40%'" :append-to-body="false">
      <!-- 侧滑插入表格 -->
      <hidden-call-table  v-if="showDrawer"
                          operation
                          style="position: relative;height: 774px;"
                          :updateHeight="754"
                          :loadingMark="historyLoadingMark"
                          :pageInfo="searchCriteria.pageInfo"
                          :tableHeadItem="getHistoryHeadItem"
                          :tableData="getHistoryItem"></hidden-call-table>
      <!--  绑定历史分页 -->
      <pagination v-if="showDrawer"
                  style="text-align: right;"
                  :currentPage="searchCriteria.pageInfo.page"
                  :pageSize="searchCriteria.pageInfo.size"
                  :count="historyCount"
                  :pages="historyPages"
                  @sizeChang="historySizeChang"
                  @currentChang="historyCurrentChang"></pagination>
    </el-drawer>
    <!-- 新增侧滑 -->
    <el-drawer :title="tableMark?'新增短隐号':'新增长隐号'" :visible.sync="addDrawerForm" :size="'25%'" :append-to-body="false">
      <!-- 侧滑插入新增表单 -->
      <call-drawer-form   v-if="addDrawerForm"
                          :hiddenCallBranchArr="hiddenCallBranchArr"
                          :boardDictionaries="boardDictionaries"
                          :unicomHiddenBlur="unicomHiddenBlur"      
                          :tableMark="tableMark"
                          :departMentArr="departMentArr"       
                          :hiddenBlur="hiddenBlur"
                          @unicomInputBlur="unicomInputBlur"
                          @mentChange="getBranchMent"
                          @submitForm="isAddHiddenCall"
                          @closeDrawer="addDrawerForm=false"
                          @hiddenInputBlur="hiddenInputBlur"></call-drawer-form>
    </el-drawer>
    <!-- 修改侧滑 -->
    <el-drawer :title="tableMark?'修改短隐号':'修改长隐号'" :visible.sync="updateDrawerForm" :size="'25%'" :append-to-body="false">
      <!-- 侧滑插入修改表单 -->
      <call-drawer-form   v-if="updateDrawerForm"
                          :hiddenCallBranchArr="hiddenCallBranchArr"
                          :boardDictionaries="boardDictionaries"
                          :departMentArr="departMentArr"
                          :updateDrawerItem="updateDrawerItem"
                          :tableMark="tableMark"
                          @submitForm="modifyHiddenCall"
                          @closeDrawer="updateDrawerForm=false"       
                          @mentChange="getBranchMent"></call-drawer-form>
    </el-drawer>
    <!-- 删除弹窗 -->
    <grace-dialog class="deletePopup"
                  dialog:is="DeletePopUp"
                  dialog:title="确认删除"
                  :dialog:visible.sync="deleteDrawerMark"
                  :delBtnLoading="delBtnLoading"
                  @closepopup="deleteDrawerMark = false;"
                  @deleteBoard="deleteBoard"></grace-dialog>
    <!-- 解绑虚拟号 -->
    <el-dialog title="解锁虚拟号"
               :visible.sync="untieVirtualFlag"
               custom-class="untieDialog"
               width="25%">
      <span>解绑后，该人员将不可使用此虚拟号进行隐号拨打</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="unBinding" :loading="unBindingLoading">确定</el-button>
        <el-button type="cancel" @click="untieVirtualFlag = false">取消</el-button>
      </span>
    </el-dialog>
    </div>
</template>
<script>
// 引入混入
import { searchView } from "@/mixins/search_view.js";
import { publicClass } from "@/mixins/public_class.js";
import { virtualNumberData } from "@/mixins/virtual_number_data.js";
import asyncWhile from "async-while";

export default {
    mixins: [
    searchView,//路由视图高级搜索逻辑
    publicClass,//公共常用方法
    virtualNumberData,//方法，属性声明
  ],
  data(){
    return {
      // 解绑虚拟号
      untieVirtualFlag: false,
      // 虚拟号绑定历史title
      historyTitle: ''
    }
  },
  methods:{
    /**
     * @author: 周靖松
     * @information: 高级搜索选中拉下选项
     * @Date: 2019-04-02 18:16:16
     */
    selectChange(val,context) {
      if (context) {
        this.searchModel.query.id = context.id
        // 请求表体
        this.tableMark ? this.tableBody() : this.getLongTableBody()
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
      this.tableMark ? this.tableBody() : this.getLongTableBody()
    },
    /**
     * @author: 周靖松
     * @information: 绑定历史查询
     * @parma:val 选中的改行数据
     * @Date: 2019-03-13 17:20:27
     */
    bindHistory(data){
      // 绑定历史标题
      this.historyTitle = `虚拟号：${data.virtualPhone}${data.unicomVirtual ? ' / ' + data.unicomVirtual : ''} 绑定历史`
      // 初始化查询条件
      this.searchCriteria.pageInfo={ page: 1, size: 30},
      this.searchCriteria.query={ id : data.id }
      this.historyLoadingTable()
      //  开启侧滑
        this.showDrawer = true
    },
    /**
     * @author: 周靖松
     * @information: 绑定历史表格加loading
     * @Date: 2019-05-09 11:44:05
     */
    historyLoadingTable(){
      // 打开loading
      this.historyLoadingMark=true
      // 请求表头
      this.$store.dispatch('virtual_number/getVirtualHistoryHeader')
      // 请求表体 
      this.$store.dispatch('virtual_number/getVirtualHistoryBody', this.searchCriteria).then(res=>{
        // 关闭loading
        this.historyLoadingMark=false
      })
      .catch(error=>{
        // 关闭loading
        this.historyLoadingMark=false
      })
    },
    /**
     * @author: 周靖松downLoading
     * @information: 下载模板
     * @Date: 2019-03-15 11:58:58
     */
    downLoad() {
      this.downLoading = true
      if(this.tableMark){
        this.getShowDownLoad().then(() => {
          this.downLoading = false
        })
      } else {
        this.getLongDownLoad().then(() => {
          this.downLoading = false
        })
      }
    },
    /**
     * 导出excel
     * @author 阎田
     * @date 2019-7-3
     */
    getDownExcel(){
      this.downExcelLoading = true
      this.downExcel(this.searchModel.query).then(() => {
        this.downExcelLoading = false
      })
    },
    /**
     * @author: 周靖松 
     * @information: 确定删除按钮被点击
     * @Date: 2019-03-14 17:07:41
     */
    deleteBoard() {
      // 查询条件
      // let searchModel={virtualNumberList: this.virtualNumberList}
      //     this.tableMark
      //       // 短号被删除
      //       ? this.loadingShowOption('putDeleteShowCall','delBtnLoading','虚拟号删除成功','tableBody','deleteDrawerMark',searchModel)
      //       // 长号被删除
      //       : this.loadingShowOption('putDeleteLongCall','delBtnLoading','虚拟号删除成功','getLongTableBody','deleteDrawerMark',searchModel)
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
        this.tableMark ? this.tableBody() : this.getLongTableBody()
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
     * @information: 获取选中的表格行数据
     * @parma:val  表格被选中行的所有数据
     * @Date: 2019-03-15 18:30:14
     */
    checkRowChang(val) {
      // 初始化数组
      this.virtualNumberList = []; //虚拟号数组
      this.stateArr = []; //状态数组
      this.deptNameArr = []; //返回的值里边是否有部门的数组
      this.department  = false; //是否显示分配部门
      //放入状态数组和删除id数组
      val.forEach(val => {
        this.virtualNumberList.push(val.virtualPhone);
        this.stateArr.push(val.isBinding);
        // 部门是否为空(必须等于null才可以判断)
        val.department  == null? this.deptNameArr.push(true): this.deptNameArr.push(false);
      });
      this.idArray = val.map(el => {
        return el.id
      })
      this.rowLength = val.length;
      // 监听取消分配按钮是否置灰
      this.disabledChang(val);
      // 监听分配部门按钮是否置灰
      this.branchChang(val);
      // 监听批量删除按钮置灰
      this.deleteChang(val);
    },
    /**
     * @author: 周靖松
     * @information: 监听取消分配按钮是否置灰
     * @Date: 2019-03-17 16:08:34
     */
    disabledChang(val) {
      val.length && !this.stateArr.includes(true) &&!this.deptNameArr.includes(true)
         ?this.batchDisabled = false
         :this.batchDisabled = true     
    },
    /**
     * @author: 周靖松
     * @information: 监听分配部门按钮是否置灰
     * @Date: 2019-03-17 16:08:34
     */
    branchChang(val) {
      // 如果所有的选中数据都没有部门则可以点击
      val.length && !this.deptNameArr.includes(false)
         ?this.branchDisabled = false
         :this.branchDisabled = true
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
     * @Date: 2019-03-11 10:31:18
     */
    tableBody() {
      this.loadingShowTable('showTableBody','loadingMark')
    },
    /**
     * @author: 周靖松
     * @information: 请求长隐号表体
     * @Date: 2019-03-11 10:31:18
     */
    getLongTableBody() {
      this.loadingShowTable('longTableBody','loadingMark')
    },
    /**
     * @author: 周靖松
     * @information: 短隐号被点击
     * @Date: 2019-03-17 10:46:08
     */
    showNumber() {
      //清空高级搜索关闭红点清空数据
        this.switchTable();  
        //请求表格
        this.getTableHead();
        this.tableBody();
        //表格标记
        this.tableMark = true;
    },
    /**
     * @author: 周靖松
     * @information: 长隐号被点击
     * @Date: 2019-03-17 10:46:08
     */
    longNumber() {
      //清空高级搜索关闭红点清空数据
        this.switchTable();
        //请求表格
        this.longTableHead();
        this.getLongTableBody();
        //表格标记
        this.tableMark = false;
    },
    /**
     * @author: 周靖松
     * @information: 标签页被点击时触发的动作
     * @Date: 2019-04-06 19:30:49
     */
    switchTable() {
      //高级搜索收起下拉清空数据
      this.$refs.advancedSearch.modelVal = "";
      this.closeAdvanceSearch()
      // 清空表单
      this.$refs.advancedSearchForm.resetFormNot("form")
      this.searchModel.query.more = ''
    },

    /**
     * @author: 周靖松
     * @information: 新增短隐号保存
     * @Date: 2019-03-22 16:27:40
     */
    isAddHiddenCall(val) {
      // 请求值赋值
      let {idCard,idCardName,virtualPhone}=val
      let SearchModel=this.tableMark?val:{idCard,idCardName,virtualPhone}
      // 请求方法名
      let queryName=this.tableMark?'postAddShowCall':'postAddLongCall'
      this[queryName](SearchModel).then(res => {
        //  消息模板
        this.messageThen(res,"虚拟号新增成功",false,"虚拟号新增失败",false,this.addDrawerForm = false)
        // 清空查询
        this.searchModel.query = {};
        // 请求表体
        this.tableMark?this.tableBody():this.getLongTableBody()    
      });
    },
    /**
     * @author: 周靖松
     * @information: 导入excel
     * @Date: 2019-03-24 09:41:20
     */
    templateImportExcel(fileObj){
       // 创建FormData
      const formData = new FormData();
      formData.append("file", fileObj.file);
      formData.append("type", "text/html;charset=UTF-8");
      // 判断请求方法
      let queryName=this.tableMark?'putShowImportExcel':'putLongImportExcel'
      // 判断回调提示
      let callbackMsg=this.tableMark?'虚拟短号导入成功':'虚拟长号导入成功'
      // 判断回调方法
      let callbackFun=this.tableMark?'tableBody':'getLongTableBody'
      // excelLoading开关
      this.excelLoading=true
      this[queryName](formData).then(res => {
        // excelLoading开关
        this.excelLoading=false
        //  消息模板
        this.messageThen(res,callbackMsg,this[callbackFun](),`${res.result[0]&&res.result[0].virtualPhone}虚拟号已存在`,false,false,res.result.length)
        //  两秒后清空上传列表
        setTimeout(() => {
          this.$refs.upload.clearFiles()
        },2000)  
      }).catch(error=>{
        // excelLoading开关
        this.excelLoading=false
        //  两秒后清空上传列表
        setTimeout(()=>{
          this.$refs.upload.clearFiles()
        },2000)  
      })
    },
    /**
     * @author: 周靖松
     * @information: 判断长短号请求
     * @Date: 2019-03-30 20:23:57
     */
    isQuery() {
      this.tableMark? this.tableBody(): this.getLongTableBody()
    },
    /**
     * @author: 周靖松
     * @information: 新增表单的input失去焦点查询重复
     * @parma: val 失去焦点时的值
     * @Date: 2019-04-04 16:30:36
     */
    hiddenInputBlur(val) {
      val && this.tableMark? this.showHiddenBlur(val): this.longHiddenBlur(val)
    },
    /**
     * @author: 周靖松
     * @information: 新增表单联通长号失去焦点查询重复
     * @parma: val 联通长号
     * @Date: 2019-04-04 17:06:09
     */
    unicomInputBlur(val) {
      val && this.getunicomHiddenBlur(val)
    },
    /**
     * @author: 周靖松
     * @information: 修改侧滑被点击
     * @parma: val 被点击的该行数据
     * @Date: 2019-04-08 09:43:42
     */
    updateClick(val) {
      //存储该行数据
      this.$store.dispatch('virtual_number/getVirtualDetails', val.id).then(res => {
        this.updateDrawerItem = res.result
        //打开侧滑
        this.updateDrawerForm = true
      })
    },
    /**
     * 隐号的修改保存
     * @author 阎田
     * @date 2019-7-2
     */
    modifyHiddenCall(form){
      let {id, idCard, idCardName, unicomVirtual} = form
      if(this.tableMark){
        // 短隐号修改保存
        this.$store.dispatch('virtual_number/modifyShortVirtual', {id, idCardName, idCard, unicomVirtual}).then(() => {
          //关闭侧滑
          this.updateDrawerForm = false
          this.$message({
            message: '虚拟号修改成功',
            type: 'success',
            showClose: true,
            duration: 5000
          });
          this.tableBody()
        })
      } else {
        // 长隐号修改保存
        this.$store.dispatch('virtual_number/modifyLongVirtual', {id, idCardName, idCard}).then(() => {
          //关闭侧滑
          this.updateDrawerForm = false
          this.$message({
            message: '虚拟号修改成功',
            type: 'success',
            showClose: true,
            duration: 5000
          });
          this.getLongTableBody()
        })
      }
    },
    /**
     * 打开解绑虚拟号弹窗
     * @author 阎田
     * @date 2019-07-18
     */
    openUnBinding(data){
      // 打开解绑侧滑
      this.untieVirtualFlag = true
      // 赋值id
      this.unBindingId = data.id
    },
    /**
     * 解绑虚拟号
     * @author 阎田
     * @date 2019-7-2
     */
    unBinding(){
      this.unBindingLoading = true
      this.$store.dispatch('virtual_number/getVirtualUnBinding', this.unBindingId).then(() => {
        // 关闭解绑侧滑
        this.untieVirtualFlag = false
        this.$message({
          message: '虚拟号解绑成功',
          type: 'success',
          showClose: true,
          duration: 5000
        });
        this.unBindingLoading = false
       this.tableMark ? this.tableBody() : this.getLongTableBody()
      }).catch(() => {
        this.unBindingLoading = false
      })
    }
  },
  mounted() {
    // this.$commonUtils.getUrlkey(window.location.href).code
    // 虚拟号按钮权限
    this.$store.dispatch('virtual_number/virtualButtonJurisdiction', {projectMark: this.$commonUtils.getUrlkey(window.location.href).code}).then(() => {
      // 请求总机号字典表
      this.getBoardDictionaries();
      // 请求虚拟号绑定类型字典表
      this.getHiddenCallBind();
      // 请求虚拟号分配类型字典表
      this.getHiddenCallBranch();
      //  请求虚拟号管理长号状态字典表
      this.virtualLongCallState();
      //  请求查询总机号码字典表
      this.virtualMainPhones();
    })
  }
};
</script>
<style lang="scss">
@import "../style/business/virtual_number.scss";
.drawer_table{
  .el-table{
    position: relative;
  }
}
#virtualnumber{
  .upload_text{
    .el-upload-list{
      display: none;
    }
  }
  .untieDialog{
    height: 200px !important;
    text-align: left;
  }
  .history_drawer{
    .el-drawer__body{
      padding: 0 30px;
    }
  }
}
</style>

<template>
<div id="switchBoard" style="height: 100%;">
<!-- 头部 -->
<el-container type="whole">
  <!-- 主要内容 -->
  <el-main type="whole">
    <template slot="advanced-search">
    <general-search @subSelect="subSelect"></general-search>
    </template>
    <template slot="util">
      <el-toolbar hide-tool="left"
                  :select-show="false"
                  :danger-show ="false"
                  :warning-show="false">
        <template slot="auxiliaryBtn">
          <el-button size="small" type="primary" @click="addDrawer=true">新增总机号</el-button> 
        </template>
      </el-toolbar>
    </template>
    <template slot="table">
     <!-- 表格 -->
        <hidden-call-table  ref="table"
                            :loadingMark="loadingMark"
                            :pageInfo="searchModel.pageInfo"
                            :tableHeadItem="tableHeadItem"
                            :tableData="tableData"
                            :updateHeight="757">
          <template v-slot="scope">
            <el-button  class="warning"
                        type="warning"
                        plain
                        round
                        @click.stop="updateClick(scope.scope.row)">修改</el-button>
            <el-button  class="danger"
                        type="danger"
                        plain
                        round
                        @click.stop="deleteDrawer(scope.scope.row)">删除</el-button>
          </template>
        </hidden-call-table>
    </template>
  </el-main>
  <el-footer>
  <!-- 分页 -->
  <pagination @sizeChang="sizeChang"
              @currentChang="currentChang"
              :currentPage="searchModel.page"
              :pageSize="searchModel.size"
              :count="count"></pagination>
    </el-footer>
</el-container>
<!-- 新增侧滑 -->
    <el-drawer @on-close="addDrawer = false" title="新增总机号码" :visible.sync="addDrawer" :size="'480px'" :append-to-body="false">
      <!-- 插入表单 -->
      <board-drawer-form  v-if="addDrawer"
                          :boradBlur="boradBlur"
                          :btnLoading="btnLoading"
                          @boratInputBlur="boratInputBlur"
                          @resetForm="addDrawer=false"
                          @submitForm="addSubmit"></board-drawer-form>
    </el-drawer>
    <!-- 修改侧滑 -->
    <el-drawer @on-close="updateDrawer = false" title="修改总机号码" :visible.sync="updateDrawer" :size="'480px'" :append-to-body="false">
      <!-- 插入表单 -->
      <board-drawer-form  v-if="updateDrawer"
                          :boradBlur="boradBlur"
                          :btnLoading="btnLoading"
                          :updateDrawer="updateDrawer"
                          :formItem="boradCallMove"
                          @resetForm="updateDrawer=false"
                          @submitForm="updateSubmit"
                          @boratInputBlur="boratInputBlur"></board-drawer-form>
    </el-drawer>
    <!-- 删除弹窗 -->
    <grace-dialog class="deletePopup"
                  dialog:is="DeletePopUp"
                  dialog:title="确认删除"
                  :delBtnLoading="delBtnLoading"
                  :dialog:visible.sync="deleteDrawerMark"
                  @closepopup="deleteDrawerMark = false;"
                  @deleteBoard="deleteBoard"></grace-dialog>
</div>
</template>

<script>
//引入混入
import { publicClass } from "@/mixins/public_class.js";
import { switchBoardData } from "@/mixins/switch_board_data.js";

export default {
   mixins: [
    publicClass,//公共常用方法
    switchBoardData,//方法，属性声明
  ],
    methods:{
    /**
     * @author: 周靖松
     * @information: 删除总机号被点击
     * @Date: 2019-03-11 16:33:23
     */
    deleteDrawer(val) {
      this.rowItem = val.accountCode;
      this.deleteDrawerMark = true;
    },
    /**
     * @author: 周靖松
     * @information: 确定删除
     * @Date: 2019-03-14 17:07:41
     */
    deleteBoard() {
      // 开启loading
      this.delBtnLoading=true
      this.postBoardDelete({accountCode: this.rowItem}).then(res => {
        // 消息模板
        this.messageThen(res,"删除总机号成功",this.tableBody())
        // 关闭弹窗
        this.deleteDrawerMark = false;
        // 关闭loading
        this.delBtnLoading=false
      })
      .catch(error=>{
        // 关闭loading
        this.delBtnLoading=false
      })  
    },
    /**
     * @author: 周靖松
     * @information: 新增保存按钮
     * @parma: val form 表单
     * @Date: 2019-03-14 14:25:45
     */
    addSubmit(val) {
      // 开启loading
      this.btnLoading=true
      this.postAddBoard(val).then(res => {
        // 关闭loading
        this.btnLoading=false
        // 消息模板
        this.messageThen(res,"新增总机号成功",this.tableBody(),"总机号新增失败",false,[this.searchModel.query = {},this.addDrawer = false])
      })
      .catch(error=>{
        // 关闭loading
        this.btnLoading=false
      })
    },
    /**
     * @author: 周靖松
     * @information: 修改按钮被点击
     * @parma: val 被选中的该行的值
     * @Date: 2019-03-30 13:41:00
     */
    updateClick(val) {
      this.getBoardCode(val.accountCode);
      this.rowItem = val;
      this.updateDrawer = true;
    },
    /**
     * @author: 周靖松
     * @information: 修改保存按钮
     * @parma: val form 表单
     * @Date: 2019-03-14 14:25:45
     */
    updateSubmit(val) {
      // token
      val.accountCode = this.rowItem.accountCode;
      // 开启loading
      this.btnLoading=true
      // 修改给按钮加loading 并调用消息模板
      this.postUpdateBoard(val).then(res => {
        // 关闭loading
        this.btnLoading=false
        // 消息模板
        this.messageThen(res,"修改总机号成功",this.tableBody(),"虚拟号修改失败")
        // 关闭侧滑
        this.updateDrawer = false;
      })
      .catch(error=>{
        // 关闭loading
        this.btnLoading=false
      })
    },
    /**
     * @author: 周靖松
     * @information: 请求表体
     * @Date: 2019-03-11 10:31:18
     */
    tableBody() {
      this.loadingShowTable('postTableBody','loadingMark')
    },
    /**
     * @author: 周靖松
     * @information: 搜索总机号
     * @parma:  val 搜索的内容
     * @Date: 2019-03-30 14:07:10
     */
    subSelect(val) {
     val.length 
        ? (this.searchModel.query.mainPhone = val,this.tableBody())
        : (this.searchModel.query.mainPhone = undefined,this.tableBody())
    },
    /**
     * @author: 周靖松
     * @information: 总机号失去焦点判断是否重复
     * @parma: val  输入的总机号
     * @Date: 2019-04-04 16:04:17
     */
    boratInputBlur(val) {
      this.searchModel.query.mainPhone = val;
      this.postBoratInputBlur(this.searchModel);
    }
  },
};
</script>
<style lang="scss">
@import "../style/business/switch_board.scss";
</style>
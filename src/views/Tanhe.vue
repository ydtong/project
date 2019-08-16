<template>
  <div id='tanhe' style="height: 100%;">
    <el-container type="whole">
      <!-- 主要内容 -->
      <el-main type="whole">
        <template slot="advanced-search">
          <el-input type="text" style="width:300px;display:inline-block"
                      v-model="value"
                      @input="blurySearch"
                      prefix-icon="el-icon-erp-search"
                      placeholder="请输入手机号、姓名查找"
                      clearable
                      size="mini"></el-input>
            <el-date-picker v-model="queryModel.searchTime" style="width:300px;margin-left:10px; "
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"                           
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            @change="changeSearchTime"></el-date-picker>
        </template>
        <template slot="util">
          <el-toolbar :danger-show="false"
                      :warning-show="false"
                      :select-show="false"
                      hide-tool="left">
            <template slot="auxiliaryBtn">
              <el-button size="small" type="primary" @click="addNumber">新增工作电话</el-button>
              <el-button size="small" type="primary" @click="downExcelExample">下载模板</el-button>
              <el-button size="small" type="primary" @click="uploadNumber">上传号码库</el-button>
            </template>
          </el-toolbar>
        </template>
        <template slot="table">
          <!-- 表格 -->
        <el-table :data="tableDataList" highlight-current-row border height="calc(100% - 0.1px)" v-loading="tableLoading">
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
            :index="(((queryModel.page)-1) * queryModel.pageSize)+1"
          ></el-table-column>
          <el-table-column
            v-for="(item, index) in tableHeaderList"
            :key="index"
            :prop="item.data"
            :label="item.headerFirst"
          ></el-table-column>
          <el-table-column width='200' label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" plain round @click="modifyRowData(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" plain round @click="deleteRowData(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        </template>
      </el-main>
      <el-footer>
              <!-- 分页 -->
        <tanhe-pagination
          @pagination-change="handleCurrentChange"
          :page="queryModel.page"
          :total="pageInfo.count"
        ></tanhe-pagination>
          </el-footer>
    </el-container>
    <!-- 新增工作电话 -->
    <el-drawer @on-close="updateDrawer = false" title="新增工作电话" :visible.sync="showAddSkid" :size="'460px'" :append-to-body="false">
      <!-- 插入表单 -->
      <tanhe-add-virtual
        v-if="showAddSkid"
        :showAddSkid="showAddSkid"
        @close-skid="onCloseSkid"
        @submit-save="onAddSubmit"
        :tatalNumbers="tatalNumbers"
        :buttonLoading="buttonLoading"
      ></tanhe-add-virtual>
    </el-drawer>
    <!-- 修改工作电话 -->
    <el-drawer @on-close="updateDrawer = false" title="修改工作电话" :visible.sync="showEditSkid" :size="'460px'" :append-to-body="false">
      <!-- 插入表单 -->
      <tanhe-add-virtual
        v-if="showEditSkid"
        :showEditSkid="showEditSkid"
        :queryModifyData="queryModifyData"
        @close-skid="onCloseSkid"
        @submit-save="onModifySubmit"
        :tatalNumbers="tatalNumbers"
        :buttonLoading="buttonLoading"
      ></tanhe-add-virtual>
    </el-drawer>
    <!-- 删除 -->
    <grace-dialog
      class="deletePopup"
      dialog:is="DeletePopUp"
      dialog:title="确认删除"
      :dialog:visible.sync="deleteDrawerMark"
      @closepopup="deleteDrawerMark = false;"
      @deleteBoard="deleteBoard"
    ></grace-dialog>
    <!-- 上传 -->
    <grace-dialog
      dialog:is="tanhe-upload-excel"
      :dialog:visible.sync="uploadDialog"
      dialog:width="350px"
      :dialog:title="'上传号码库'"
      @close-dialog="onCloseDialog"
      :dialog:close-on-click-modal="false"
      :dialog:close-on-press-escape="false"
    ></grace-dialog>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
import { setTimeout } from "timers";
const { mapState } = createNamespacedHelpers("tanhe");
import utils from "@/assets/js/common_util.js";
export default {
  data() {
    return {
      dates: new Date(),
      // 查询条件
      queryModel: {
        page: 1,
        pageSize: 20,
        value: "",
        searchTime: []
      },
      // 控制新增侧滑
      showAddSkid: false,
      // 控制修改侧滑
      showEditSkid: false,
      value: "",
      // 控制删除消息框是否显示
      deleteDialog: false,
      // 删除id
      deleteid: "",
      // 控制是否显示上传弹窗
      uploadDialog: false,
      // tabel-width
      widthData: {
        accountInfo: "450px",
        modifytime: "150px",
        phone: "120px",
        name: "200px"
      },
      timer: null,
      // 按钮loading
      buttonLoading: false,
    //   删除弹窗
    deleteDrawerMark:false,
    };
  },
  computed: {
    ...mapState([
      "tableHeaderList", //虚拟号表格头部
      "tableDataList", // 虚拟号表格表体数据
      "tatalNumbers", //总机号码字典项
      "queryModifyData", //获取修改的数据
      "pageInfo", // 分页信息
      // 表格loading
      "tableLoading"
    ])
  },
  created() {
    // 获取虚拟号表格头部
    this.$store.dispatch("tanhe/queryTabelHeader");
    // 获取虚拟号表格表体
    this.$store.dispatch("tanhe/queryTableData", this.queryModel);
    // 获取总机号码字典项
    this.$store.dispatch("tanhe/queryTotalNumbers");
  },
  methods: {
    changeSearchTime() {
      let { queryModel } = this;
      queryModel.page = 1;
      this.$store.dispatch("tanhe/queryTableData", queryModel).then(() => {
        this.$set(queryModel, "page", 1);
      });
    },
    /**1
     * 新增长号码
     * @author 郭梦娜
     * @date 2019-1-11
     */
    addNumber() {
      this.showAddSkid = true;
    },
    /**1
     * 关闭侧滑
     * @author 郭梦娜
     * @date 2019-1-11
     */
    onCloseSkid(val) {
      this.showAddSkid = val;
      this.showEditSkid = val;
    },
    /**
     * 新增保存
     * @author 郭梦娜
     * @date 2019-1-11
     * @param 新增的form
     */
    onAddSubmit(model) {
      // 按钮loading
      // this.buttonLoading = true
      this.$store
        .dispatch("tanhe/addVirtualNumber", model)
        .then(res => {
          // 取消按钮loading
          // this.buttonLoading = false
          this.onCloseSkid(false);
          this.queryModel.page = 1;
          this.$store.dispatch("tanhe/queryTableData", this.queryModel);
        })
        .catch(error => {});
    },
    /**1
     * 模糊搜索
     * @author 郭梦娜
     * @date 2019-1-11
     */
    blurySearch(val) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.queryModel.value = val;
        this.queryModel.page = 1;
        this.$store.dispatch("tanhe/queryTableData", this.queryModel);
      }, 500);
    },
    /**1
     * 修改获取
     * @author 郭梦娜
     * @date 2019-1-11
     * @param 当前数据的phone,传给后台的
     */
    modifyRowData(data) {
      this.showEditSkid = true;
      this.$store.dispatch("tanhe/queryModifyNumber", data.id);
    },
    /**1
     * 修改的保存
     * @author 郭梦娜
     * @date 2019-1-11
     * @param form表单
     */
    onModifySubmit(model) {
      // 按钮loading
      // this.buttonLoading = true
      this.$store
        .dispatch("tanhe/modifyNumberSubmit", model)
        .then(res => {
          // 取消按钮loading
          // this.buttonLoading = false
          this.showEditSkid = false;
          this.queryModel.page = 1;
          this.$store.dispatch("tanhe/queryTableData", this.queryModel);
        })
        .catch(error => {});
    },
    /**1
     * 删除弹窗打开
     * @author 郭梦娜
     * @date 2019-1-11
     * @param 选中的phone,传给后台的参数
     */
    deleteRowData(phone) {
      this.deleteid = phone.id;
      this.deleteDrawerMark = true;
    },
    /**1
     * 删除消息弹框关闭
     * @author 郭梦娜
     * @date 2019-1-11
     */
    closeMessage() {
      this.deleteDialog = false;
    },
    /**1
     * 确认删除
     * @author 郭梦娜
     * @date 2019-1-11
     */
    deleteBoard() {
      this.$store
        .dispatch("tanhe/deleteRow", this.deleteid)
        .then(res => {
          this.deleteDrawerMark = false;
          this.$store.dispatch("tanhe/queryTableData", this.queryModel);
          utils.setMessage("success", res.message);
        })
        .catch(error => {
          utils.setMessage("warning", error.message);
        });
    },
    /**1
     * 点击蒙版关闭新增侧滑
     * @author 郭梦娜
     * @date 2019-1-12
     */
    closeAddSkid() {
      this.showAddSkid = false;
      this.buttonLoading = false;
    },
    /**1
     * 点击蒙版关闭修改侧滑
     * @author 郭梦娜
     * @date 2019-1-12
     */
    closeEditSkid() {
      this.showEditSkid = false;
    },
    /**
     * 分页
     * @author 阎田
     * @date 2019-2-22
     *
     */
    handleCurrentChange(page, size) {
      this.queryModel.page = page;
      this.queryModel.pageSize = size;
      this.$store.dispatch("tanhe/queryTablePages", this.queryModel);
      document.querySelector(".el-table__body-wrapper").scrollTo(0, 0);
    },
    /**1
     * 下载excel模板
     * @author 郭梦娜
     * @date 2019-1-12
     */
    downExcelExample() {
      this.$store.dispatch("tanhe/downExcelExample");
    },
    /**1
     * 上传号码库
     * @author 郭梦娜
     * @date 2019-1-13
     */
    uploadNumber() {
      this.uploadDialog = true;
    },
    /**1
     * 关闭上传弹窗
     * @author 郭梦娜
     * @date 2019-1-15
     */
    onCloseDialog() {
      this.uploadDialog = false;
    },

  }
};
</script>
<style lang="scss">
@import "@/style/business/tanhe.scss";
</style>


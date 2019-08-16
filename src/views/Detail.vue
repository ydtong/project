<template>
 <div style="height: 100%;" id="depart">
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
                                placeholder="请输入关键字搜索"
                                @change="selectChange"
                                value-key="name"
                                :sign-list="['name']"
                                joiner="-"
                                :jitter-tiem="500">
              <detail-search-form @resetIndex="seniorSearch({})" 
                                  @pointMark="pointMark"
                                  :personState="personState"
                                  :detailLongCallBindState="detailLongCallBindState">
                <template v-slot="scope">
                <el-button @click="seniorSearch(scope.form)" type="primary">查询</el-button>
              </template>
              </detail-search-form>
            </el-advanced-search>
        </template>
        <template slot="table">
          <!-- 表格 -->
        <hidden-call-table  ref="table"
                            extend
                            :updatewidth="180"
                            :updateHeight="808"
                            :tableHeadItem="tableHeadItem"
                            :pageInfo="searchModel.pageInfo"
                            :tableData="tableData"
                            :getWorkCallItem="getWorkCallItem"
                            :loadingMark="loadingMark"
                            @getWorkCall="getWorkCall">
          <template v-slot="scope">
            <el-button  disabled
                        class="warning"
                        type="primary"
                        plain
                        round
                        @click.stop="workBindCall(scope.scope.row)">绑定</el-button>
            <el-button  disabled
                        class="danger"
                        type="warning"
                        plain
                        round
                        @click.stop="workUnBindCall(scope.scope.row)">解绑</el-button>
          </template>
        </hidden-call-table>
        </template>
      </el-main>
      <el-footer>
              <!-- 分页 -->
        <pagination @sizeChang="sizeChang"
                    @currentChang="currentChang"
                    :currentPage="searchModel.pageInfo.page"
                    :pageSize="searchModel.pageInfo.size"
                    :count="count"></pagination>
          </el-footer>
    </el-container>
    <!-- 绑定弹窗 -->
    <grace-dialog dialog:is="BindPopUp"
                  dialog:title="绑定虚拟号"
                  :typeTitle="'绑定类型'"
                  :numberTitle="'绑定数量'"
                  :dialog:visible.sync="bindMark"
                  :hiddenCallTypeArr="hiddenCallTypeArr"
                  @closePopup="bindMark=false"
                  @subForm="bindSub"></grace-dialog>
    <!-- 解绑弹窗 -->
    <grace-dialog dialog:is="BindPopUp"
                  dialog:title="解绑虚拟号"
                  :typeTitle="'解绑类型'"
                  :numberTitle="'解绑数量'"
                  :dialog:visible.sync="unBindMark"
                  :hiddenCallTypeArr="hiddenCallTypeArr"
                  @closePopup="unBindMark=false"
                  @subForm="unBindSub"></grace-dialog>
  </div>
</template>
<script>
// 引入混入
import { searchView } from "@/mixins/search_view.js";
import { publicClass } from "@/mixins/public_class.js";
import { datailData } from "@/mixins/detail_data.js";

export default { 
  mixins: [
    searchView,//路由视图高级搜索逻辑
    publicClass,//公共常用方法
    datailData,//方法，属性声明
  ],
  methods:{
    /**
     * @author: 周靖松
     * @information: 绑定弹窗保存
     * @parma:val {工作电话 绑定类型  绑定数量}
     * @Date: 2019-03-13 14:57:37
     */
    bindSub(val) {
      // 等人员库接口
      this.postBindSub({
        phone: val.workCall,
        userName: "string",
        virtualNumber: val.number,
        virtualNumberType: val.hiddenCallType
      }).then(res => {
      // 消息模板
      this.messageThen(res,"虚拟号绑定成功")
      })
      // 关闭弹窗
      this.bindMark = false;
    },
    /**
     * @author: 周靖松
     * @information: 解绑弹窗保存
     * @parma:val {工作电话 绑定类型  绑定数量}
     * @Date: 2019-03-13 14:57:37
     */
    unBindSub(val) {
      // 等人员库接口
      this.postUnBindSub({
        phone: val.workCall,
        userName: "string",
        virtualNumber: val.number,
        virtualNumberType: val.hiddenCallType
      }).then(res => {
      // 消息模板
      this.messageThen(res,"虚拟号解绑成功")
      })
      // 关闭弹窗
      this.unBindMark = false;
    },
    /**
     * @author: 周靖松
     * @information: 工作电话绑定虚拟号
     * @parma: val 选中的改行数据
     * @Date: 2019-03-22 08:53:15
     */
    workBindCall(val) {
      this.rowItem = val;
      // 打开弹窗
      this.bindMark = true;
    },
    /**
     * @author: 周靖松
     * @information: 工作电话解绑虚拟号
     * @parma: val 选中的改行数据
     * @Date: 2019-03-22 08:54:43
     */
    workUnBindCall(val) {
      this.rowItem = val;
      // 打开弹窗
      this.unBindMark = true;
    },
    /**
     * @author: 周靖松
     * @information: 请求表体
     * @Date: 2019-04-14 15:57:49
     */  
    tableBody(){
      this.loadingShowTable('postTableBody','loadingMark')
    },
  },
  mounted(){
    //  请求人员状态字典表
    this.getPersonState();
    //  请求人员明细管理长号状态字典表
    this.detailLongCallState();
  }
};
</script>
<style lang="scss">
@import "../style/business/detail.scss";
</style>
<template>
  <!-- 表格页 -->
  <div  ref="hiddenCallTable" id="hiddenCallTable">
    <!-- 表格 -->
    <el-table border
              ref="table"
              v-loading="loadingMark"
              highlight-current-row
              :row-style="rowClass"
              :cell-style="cellStyle"
              empty-text="暂无数据"
              style="width:100%"
              height="calc(100% - 0.1px)"
              :data="tableData"
              :max-height="updateHeight"
              @selection-change="selectChange"
              @row-click="clickRow"
              @expand-change='expandChange'>
      <!-- 是否多选列 :height="token?updateHeight-106:updateHeight"-->
      <el-table-column type="selection" v-if="selected" width="50" align="center"></el-table-column>
      <!-- 是否展开列 -->
      <el-table-column class="extend-hover" v-if="extend" type="expand">
        <!-- 展开列的内容 -->
        <div v-for="(item,index) in getWorkCallItem" :key="index" class="extend-box">
          <div class="extend-item">
            <span>工作电话：</span>
            <p>{{item.workPhone}}</p>
          </div>
          <div class="extend-item">
            <span>短虚拟号：</span>
            <p>{{item.shortVirtual[0]}}</p>
          </div>
          <div class="extend-item">
            <span>长虚拟号：</span>
            <p v-for="(subitem,index) in item.longVirtual" :key="index">{{subitem}}</p>
          </div>
        </div>
      </el-table-column>
      <!-- 序号列 -->
      <el-table-column v-if="!serial" type="index" label="序号" align="center" width="50" :index="indexMethod"></el-table-column>
      <!-- 请求返回内容列 -->
      <el-table-column  v-for="(item,index) in tableHeadItem"
                        :fit="true"
                        :key="index"
                        :prop="item.fieldName"
                        :label="item.describe">
        <!-- 选择该行数据 -->
        <template slot-scope="scope">
          <div :style="bindclickArr.includes(scope.column.property)&&'color:#1fb19e;cursor:pointer;'"
               @click="virtualDrawer({name:scope.column.property,val:scope.row})">
            <span>{{scope.row[scope.column.property]}}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column v-if="!operation" label="操作" align="center" :width="updatewidth">
        <!-- 操作按钮slot盒子 -->
        <template slot-scope="scope">
          <div class="table-btn-slot">
            <slot :scope="scope"></slot>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    //表头数据
    tableHeadItem: Array,
    //表体数据
    tableData: Array,
    //是否添加多选框
    selected: {
      type: Boolean,
      default: false
    },
    //操作栏宽度
    updatewidth: {
      type: [String, Number],
      default: 180
    },
    //表体高度
    updateHeight: {
      type: [String, Number],
      default: 655
    },
    //是否展开
    extend: {
      type: Boolean,
      default: false
    },
    //工作电话绑定数据
    getWorkCallItem: Array,
    //是否隐藏操作列
    operation: {
      type: Boolean,
      default: false
    },
    // 是否隐藏序号列
    serial: {
      type: Boolean,
      default: false
    },
    // loading动画
    loadingMark: {
      type: Boolean,
      default: false
    },
    // 当前页与条数
    pageInfo:{
      type: Object
    }
  },
  data() {
    return {
      selectRow: [], //选中的行
      selectData: [], //选中的数据
      lastRow: null, //上一个展开行
      token: true, //是否在统一登陆环境
      expands:[],//展开的数组
      //需要绑定点击事件的列的字段名字
      bindclickArr: [
        // 占用短号
        "occupyShortNumber",
        // 占用长号
        "occupyLongNumber",
        // 短号历史
        "historyShortNumber",
        // 长号历史
        "historyLongNumber"
      ],
      rowMark: null //是是否被重复点击
    };
  },
  methods: {
    /**
     * 自定义索引
     * @author yt
     * @date 2018-12-17
     * @param {*} index element方法自带参数 当前行索引（从0开始）
     */
    indexMethod (index) {
      // 返回自定义序号索引（因接口定义的参数不同导致传过来的参数不同，所以写或者）
      return index + (this.pageInfo.page - 1) * this.pageInfo.size + 1
    },
    /**
     * @author: 周靖松
     * @information: 空闲和占用的列被点击
     * @parma:val 该列的名字和该行的值
     * @Date: 2019-03-19 14:34:42
     */
    virtualDrawer(val) {
      this.bindclickArr.includes(val.name)&&this.$emit("virtualDrawer", val);
    },
    /**
     * @author: 周靖松
     * @information: 表格行被选中
     * @parma:data 被选中行的所有数据
     * @Date: 2019-03-22 17:38:54
     */
    selectChange(data) {
      this.$emit("checkRowChang", data);
      this.selectRow = data.length?data.map(el=>{
        return this.tableData.indexOf(el)
      }):''
    },
    /**
     * @author: 周靖松
     * @information: 单机整行选中
     * @Date: 2019-03-23 09:26:07
     */
    clickRow(row, rowIndex) {
      // 判断是否有多选框
      this.selected
      // 多选高亮
      ?this.selectedHighlight(row)
      // 单选高亮
      :this.singleHighlight(row)      
    },
    /**
     * @author: 周靖松
     * @information: 表格多选的时候的高亮
     * @parma:  点击行
     * @Date: 2019-04-15 11:15:13
     */    
    selectedHighlight(row){
        this.$refs.table.toggleRowSelection(row);
        this.$refs.table.setCurrentRow();
    },
    /**
     * @author: 周靖松
     * @information: 表格单选的时候的高亮
     * @parma: 点击行
     * @Date: 2019-04-15 13:46:24
     */
    singleHighlight(row){
        // 判断是否被重复点击
        this.rowMark == row
        ?(
          //关闭列
          this.$refs.table.toggleRowExpansion(row, false),
          // 关闭高亮
          this.$refs.table.setCurrentRow(),
          this.rowMark = null)
        :(
          // 单选高亮
          this.$refs.table.setCurrentRow(row),
          //是否展开行
          this.extendOpen(row),
          this.rowMark = row)     
    },
    /**
     * @author: 周靖松
     * @information: 是否展开列
     * @parma: 点击行
     * @Date: 2019-04-15 15:55:56
     */
    extendOpen(row){
      this.extend&&(
          //展开当前行
          this.$refs.table.toggleRowExpansion(this.lastRow, false),
          this.lastRow = row,
          //关闭上一次的行
          this.$refs.table.toggleRowExpansion(row)
      )  
    },
    /**
     * @author: 周靖松
     * @information: 选中行如果存在则返回样式
     * @Date: 2019-03-22 18:55:13
     */
    rowClass({ row, rowIndex }) {
        return this.selectRow.includes(rowIndex)&&{ "background-color": "#fff7d3" };
    },
    /**
     * @author: 周靖松
     * @information: 选中行前边加边框
     * @Date: 2019-03-23 10:20:45
     */
    cellStyle({ row, column, rowIndex, columnIndex }) {
        return (this.selectRow.includes(rowIndex) && columnIndex === 0)&&"border-left:2px solid #ffc339;";
    },
    /**
     * @author: 周靖松
     * @information: 展开列三角被点击
     * @Date: 2019-05-08 19:22:25
     */  
    expandChange(row, expandedRows){
      // 请求接口
      this.$emit("getWorkCall", row.basicId)
      // 关闭其他行  
      if(expandedRows.length>1){
          expandedRows.shift()
      }
      // 判断是否被重复点击
        this.rowMark == row
        ?(
          // 关闭高亮
          this.$refs.table.setCurrentRow(),
          this.rowMark = null)
        :(
          // 单选高亮
          this.$refs.table.setCurrentRow(row),
          this.rowMark = row)   
    },
  },
};
</script>

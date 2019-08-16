<template>
  <!-- 分页 -->
  <div id="pagination">
    <el-pagination  prev-text="上一页"
                    next-text="下一页"
                    background
                    layout=" sizes, prev, pager, next ,total"         
                    :current-page="currentPage"
                    :page-sizes="[20, 40, 60]"
                    :page-size="20"        
                    :total="count"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    //当前页数
    currentPage: {
      type: Number,
      default: 1
    },
    //当前条数
    pageSize: {
      type: Number,
      default: 20
    },
    // 总条数
    count: {
      type: Number,
      default: 0
    },
  },
  methods: {
    /**
     * @author: 周靖松
     * @information: 页数被更改
     * @Date: 2019-04-15 10:55:13
     */
    handleSizeChange(val) {
      this.$emit("sizeChang", val);
    },
    /**
     * @author: 周靖松
     * @information: 条数被更改
     * @Date: 2019-04-15 10:56:45
     */
    handleCurrentChange(val) {
      this.$emit("currentChang", val);
      document.querySelector('.el-table__body-wrapper').scrollTo(0, 0)
    },
  },
};
</script>
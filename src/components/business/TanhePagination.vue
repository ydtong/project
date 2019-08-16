<template>
    <div id="pagination">
        <el-pagination @size-change="pageSizeChange"
        @current-change="currentPageChange"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        prev-text="上一页"
        next-text="下一页"
        layout="sizes, prev, pager, next, total"
        :total="total"
        background
        :pager-count="pageCount">
        </el-pagination>
    </div>
</template>

<script>
/**
 * 分页组件
 * @author yt
 * @param total 数据总条数
 * @param page 页数
 * @event pageSizeChange 每页展示条数发生改变时触发
 * @event currentPageChange 页数发生改变时触发
 * @event paginationChange 将发生改变的页数与条数返回父组件
 */
export default {
  props: {
    total: Number | String,
    // pageSize: Number | String,
    page: Number | String,
    pageCount: {
      type:Number,
      default:7
    }
  },
  data: function () {
    return {
      pageSizes: [20, 40, 60],
      currentPage: 1,
      pageSize: 20
    }
  },
  methods: {
    // 每页多少条
    pageSizeChange: function (val) {
      this.pageSize = val
      this.currentPage = 1
      this.paginationChange()
    },
    // 哪一页
    currentPageChange: function (val) {
      this.currentPage = val
      this.paginationChange()
    },
    // 分页数据发生变化向外传递
    paginationChange: function () {
      this.$emit('pagination-change', this.currentPage, this.pageSize)
      document.querySelector('.el-table__body-wrapper').scrollTo(0, 0)
    }
  }
}
</script>
<style>
#pagination {
  width: 100%;
  text-align: right;
}
</style>

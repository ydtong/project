/**
 * @author: 周靖松
 * @information: 路由视图高级搜索逻辑
 * @Date: 2019-03-29 16:08:03
 */
export const searchView = {
  data(){
    return {
      visible:false,//高级搜索下拉标记
    }
  },
  methods: {
    /**
     * @author: 周靖松
     * @information: 清除数据刷新页面
     * @Date: 2019-03-31 21:44:58
     */
    clearInput() {
      this.fuzzyItem = undefined;
      // 虚拟号那边的请求值
      this.searchModel.query.vagueParameter = undefined;
      // 人员库那边的请求值
      this.searchModel.query.more=undefined
      this.searchModel.query.inDeptId=undefined
      // 刷新到第一页并请求
      this.firstRefresh()
    },
    /**
     * @author: 周靖松
     * @information: 回车搜索收起下拉
     * @parma: val 输入框的值
     * @Date: 2019-04-02 20:09:14
     */
    downEnter(val){
      // 判断是虚拟号还是人员库
      if(this.$route.name=='VirtualNumber' || this.$route.name=='DepartMent'){
        this.searchModel.query.more = val.value
      } else {
        this.$route.name=='Detail'
         ?this.searchModel.query.more=val.value
         :this.searchModel.query.more = val.value;
      }
      // 刷新到第一页并请求
      this.firstRefresh() 
    },
    /** 
     * @author: 周靖松
     * @information: 高级搜索模糊搜索
     * @Date: 2019-03-30 20:13:03
     */
    fuzzyChange(val) {
      this.fuzzyItem = val;
      // 判断是虚拟号还是人员库
      if(this.$route.name=='VirtualNumber' || this.$route.name=='DepartMent'){
        this.searchModel.query.more = val
      } else {
        this.$route.name=='Detail'
        ?this.searchModel.query.more = val
        :this.searchModel.query.vagueParameter = val
      }
      this.searchModel.pageInfo.page=1
      // 判断是否为虚拟号页请求表体不刷新列表
      typeof this.tableMark=="boolean"
         ?this.tableMark?this.showFuzzyChange(this.searchModel):this.longFuzzyChange(this.searchModel)
         :this.postFuzzyChange(this.searchModel)
    },
    /**
     * @author: 周靖松
     * @information: 高级搜索选中拉下选项
     * @Date: 2019-04-02 18:16:16
     */
    selectChange(val,context) {
      if (context) {
        let querySearch = typeof this.tableMark=="boolean"?'virtualNumber':'deptName'
        // 判断是虚拟号还是人员库
        this.$route.name=='Detail'
          ?this.searchModel.query.more = context.name
          :this.searchModel.query.vagueParameter = context[querySearch]
        // 请求表体
        this.firstRefresh();
      }
    },
    /**
     * @author: 周靖松
     * @information: 刷新到第一页并请求
     * @Date: 2019-04-19 13:37:12
     */  
    firstRefresh(){
      this.searchModel.pageInfo.page=1
      // 判断是否为虚拟号页
      typeof this.tableMark=="boolean"?this.isQuery():this.tableBody()
    },
    /**
     * @author: 周靖松
     * @information: 关闭高级搜索下拉
     * @Date: 2019-04-19 14:50:09
     */
    closeAdvanceSearch(){
      // 关闭下拉
      this.visible = false;
    },
    /**
     * @author: 周靖松
     * @information: 高级搜索点击查询
     * @parma:val 表单数据
     * @Date: 2019-03-20 10:19:45
     */
    seniorSearch(val) {
      // 关闭下拉
      this.closeAdvanceSearch()
      // 赋值model
      this.searchModelSave(val)
      // 请求表体
      this.firstRefresh();
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
     * @information: 不可枚举和清空部门数组
     * @Date: 2019-04-19 15:31:30
     */
    objDefineProperty(val){
        // 不可枚举
        Object.defineProperty(val,"mentSelect",{
          enumerable:false
        })
        // 判断数组元素不为空字符串
        val.deptIds && val.deptIds.toString()
          ? val.deptIds = val.deptIds
          : val.deptIds = undefined
    },
    /**
     * @author: 周靖松
     * @information: 高级搜索查询值赋值缓存
     * @Date: 2019-03-21 15:11:06
     */
    searchModelSave(val) {
      // 判断是虚拟号还是人员库
      this.$route.name==('DepartMent'||'VirtualNumber')&&this.objDefineProperty(val)
      // 去除空数据
      for (let key in val) {
        val[key]=="0"||val[key]?val[key]=val[key]:val[key]=undefined   
      }
      // 判断是虚拟号还是人员库
      this.$route.name=='Detail'
         ?this.searchModel.query = { ...val, more: this.fuzzyItem }
         :this.searchModel.query = { ...val, vagueParameter: this.fuzzyItem };
      (this.$route.name=='VirtualNumber' || this.$route.name=='DepartMent') && (this.searchModel.query = { ...val, more : this.fuzzyItem })
      // 判断长短隐号 长隐号删除总机号字段
      typeof this.tableMark=="boolean"
         &&(!this.tableMark && this.searchModel.query.accountCode)
         &&delete this.searchModel.query.accountCode;
    },
    // 高级搜索点击下拉按钮回调
    toggleAdvanceSearch(){
      this.visible=!this.visible
    }
  }
}

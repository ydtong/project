  /**
   * @author: 周靖松
   * @information: 子组件高级搜索逻辑
   * @Date: 2019-03-29 14:15:35
   */
  export const searchForm = {
  data() {
    return {
      mentArr: [], //部门名称数组
    };
  },
  methods: {
    /**
     * @author: 周靖松
     * @information: 搜索部门名称
     * @Date: 2019-03-21 10:53:56
     */
    mentChange(val) { 
      // 判断输入了值且不为空
      if(val && !val.includes(" ")){
        this.$emit("mentChange", val)
        // 检测是否输入不为空或者输入的单个空格或多个空格
        this.form.deptIds = undefined;
        this.clearInput()
      }      
    },
    /**
     * @author: 周靖松
     * @information: 远程搜索
     * @Date: 2019-03-17 17:01:06
     */
    querySearchAsync(querySearch, callback) {
      //初始化数组
      this.mentArr = [];
      if(this.departMentArr && !querySearch == "" && querySearch.length){
        this.departMentArr.forEach(value => {
          this.mentArr.push({value: value.name})
        });
        callback(this.mentArr)    
      }else{
        callback([])
      }
    },
    /**
     * @author: 周靖松
     * @information: 清空数据不清空
     * @Date: 2019-04-16 21:18:13
     */
    resetFormNot(formName) {
      this.$refs[formName].resetFields();
      this.picker = [];
      this.form.bindingStatus = ''; 
      this.form.department = '';
      this.form.deptIds = [];
      this.form.longVirtualStatus = '';
      this.form.modifyTime = [];
      this.mentArr = [];
      this.form.mainPhone = ''
      //监听红点
      this.$emit("pointMark", this.pointMark());
      //重置高级搜索返回值
      this.mentChange(undefined)
    },
    /**
     * @author: 周靖松
     * @information: 清空表单并刷新页面
     * @Date: 2019-03-21 11:13:12
     */
    resetForm(formName) {
      this.resetFormNot(formName)
      //重置页面
      this.$emit("resetIndex", this.pointMark());
    },
    /**
     * @author: 周靖松
     * @information: 判断高级搜索是否有值
     * @Date: 2019-03-22 14:36:19 
     */
    pointMark() {
      let pointMark = [];
      // 判断高级搜索表单是否有值
      for (var key in this.form) {
          (this.form[key] == undefined ||this.form[key].toString() == "" ||this.form[key] == null)
             ?pointMark.push(true)
             :pointMark.push(false)  
      }
      return pointMark.includes(false);
    },
    /**
     * @author: 周靖松
     * @information: 高级搜索被选中
     * @Date: 2019-03-31 19:46:49
     */
    selectChange(val) {
      this.form.deptIds = []
      this.form.deptIds.push(val)
    },
    /**
     * @author: 周靖松
     * @information: 部门名称清除
     * @Date: 2019-04-16 15:26:01
     */  
    clearInput(){
      this.$store.commit("hidden_call/DEPART_MENT_ARR", null)
    },
  },
  computed:{
    departMentArrItem(){
        this.form.deptIds = [];
        this.departMentArr&&this.departMentArr.forEach(value => {
          this.form.deptIds.push(value.id);
        })
        return this.departMentArr
    },
  },
    /**
     * @author: 周靖松
     * @information: 监听数据更新
     * @Date: 2019-03-22 14:27:18
     */
  updated() {
    // 更新红点状态
    this.$emit("pointMark", this.pointMark());
  },
}

/**
 * @author: 周靖松
 * @information: 常用且公共的方法
 * @Date: 2019-04-19 11:01:56
 */
export const publicClass = {
    data() {
        return {
            // 默认查询条件
            searchModel: {
                pageInfo: {
                    page: 1,//页
                    size: 20//条
                },
                query: {}
            },
            // 子列表查询条件
            subSearchModel:{
                pageInfo: {
                    page: 1,//页
                    size: 50//条
                },
                query: {}
            },
        }
    },
    methods: {
        /**
         * @author: 周靖松
         * @information: 消息提示模板
             * @parma: 参数顺序  then的返回值 成功提示消息 成功回调函数 
             * 失败提示消息 自定义判断条件（传入后会覆盖第一个判断条件）嵌套判断条件
             * @Date: 2019-04-19 09:32:20
             */
        messageThen(res, resultMessage, resultCallback, errorMessage, isRes, modelSave, subIsRes) {
            // 消息模板
            if (isRes ? isRes : res) {
                this.message.shoWmessage(`${resultMessage}`, "success");
                modelSave && modelSave;
                resultCallback && resultCallback()
            } else {
                subIsRes
                   ?this.message.shoWmessage(res.message? res.message: `${errorMessage}`, "error")
                   :this.message.shoWmessage(errorMessage ? `${errorMessage}` : res.message, "error")           
            }
        },
        /**
         * @author: 周靖松
         * @information: 当前页
         * @Date: 2019-03-11 16:00:22
         */
        currentChang(val) {
            this.searchModel.pageInfo.page = val;
            typeof this.tableMark=="boolean"?this.isQuery():this.tableBody()
            this.scrollToTop()
        },
        /**
         * @author: 周靖松
         * @information: 当前条
         * @Date: 2019-03-11 16:00:57
         */
        sizeChang(val) {
            this.searchModel.pageInfo.size = val;
            typeof this.tableMark=="boolean"?this.isQuery():this.tableBody()
            this.scrollToTop()
        },
        /**
         * @author: 周靖松
         * @information: 历史纪录当前页
         * @Date: 2019-03-11 16:00:22
         */
        historyCurrentChang(val) {
            this.searchCriteria.pageInfo.page = val;
            this.historyLoadingTable()
            this.scrollToTop()
        },
        /**
         * @author: 周靖松
         * @information: 历史纪录当前条
         * @Date: 2019-03-11 16:00:57
         */
        historySizeChang(val) {
            this.searchCriteria.pageInfo.size = val;
            this.historyLoadingTable()
            this.scrollToTop()
        },   
        /**
         * @author: 周靖松
         * @information: 滚动条置顶
         * @Date: 2019-04-19 13:08:24
         */    
        scrollToTop(){
            this.$refs.table.$el.querySelector('.el-table__body-wrapper').scrollTo(0, 0)
        },
        /**
         * @author: 周靖松
         * @information: 弹窗侧滑loading处理函数
         * @parma:请求方法，loading名称，回调提示，回调方法，关闭的弹窗名称，查询参数（自定义）
         * @Date: 2019-05-06 09:48:51
         */
        loadingShowOption(queryName,loadingMark,callBackMsg,callBackFun,closeDrawerMark,searchModel,scrollOne){
            // 开启loading
            this[loadingMark]=true
            this[queryName](searchModel?searchModel:this.searchModel).then(res => {
                //  消息模板
                this.messageThen(res,callBackMsg,this[callBackFun]())
                //  关闭弹窗 
                this[closeDrawerMark] = false;
                // 关闭loading
                this[loadingMark]=false
                // 是否回到第一页
                scrollOne&&(this.searchModel.pageInfo.page=1)
                })
                .catch(error=>{
                // 关闭loading
                this[loadingMark]=false
            })
        },
        /**
         * @author: 周靖松
         * @information: 表体loading处理
         * @parma:请求方法，loading名称，查询参数（自定义）
         * @Date: 2019-05-06 10:58:24
         */    
        loadingShowTable(queryName,loadingMark,searchModel) {
            // 开启loading
            this[loadingMark]=true
            this[queryName](searchModel?searchModel:this.searchModel).then(res => {
              // 关闭loading
              this[loadingMark]=false
            })
            .catch(error => {
              // 关闭loading
              this[loadingMark]=false
            })
          },
    },
    mounted() {
        /**
         * @author: 周靖松
         * @information: 生命周期请求表格
         * @Date: 2019-03-11 10:31:26
         */
        if(this.$route.name !== 'DepartMent'){
            this.getTableHead();
            this.tableBody();
        }
    },
}
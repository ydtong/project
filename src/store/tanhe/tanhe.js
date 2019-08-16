import *  as type from '../Mutation/tanhe.js'
import request from '@/api/tanhe'
import utils from '@/assets/js/common_util.js'
import {downFile} from "@/assets/js/tool.js"
// 人员库扣下来的js
const modules = {
    state:{
        tableHeaderList: [], // 表格头部list
        tableDataList: [], //表格数据list
        tatalNumbers: [], //总机号码字典项
        queryModifyData: {}, //获取修改数据
        pageInfo: {},
        // 表格loading
        tableLoading: false
    },
    mutations: {
        // 表格头部数据的更改
        [type.VIRTUAL_TABLE_HEADER] (state, model) {
            state.tableHeaderList = model
        },
        // 表格表体数据
        [type.VIRTUAL_TABLE_DATA] (state, model) {
            state.tableDataList = model
        },
        // 获取总机号码字典项
        [type.VIRTUAL_TOTAL_NUMBERS] (state, model) {
            state.tatalNumbers = model
        },
        // 获取修改数据
        [type.VIRTUAL_QUERY_MODIFY] (state, model) {
            state.queryModifyData = model
        },
        // 获取分页的数据--总页数、总条数
        [type.VIRTUAL_PAGE_INFO] (state, model) {
            state.pageInfo = model
        },
        // 更改人员表格loading状态
        [type.TABLE_LOADING_STATUS](state, data) {
            state.tableLoading = data
        }
    },
    actions: {
        /**1
         * 获取表格头部
         * @author 郭梦娜
         * @date 2019-1-10
         */
        queryTabelHeader({commit}) {
            request.queryTableHeader()
            .then(res => {
                commit(type.VIRTUAL_TABLE_HEADER, res.result)
            })
            .catch(error => {
                utils.setMessage('warning', error.message)
            })

        },
        /**1
         * 获取表格表体数据
         * @author 郭梦娜
         * @date 2019-1-11
         */
        queryTableData({commit}, model) {
            // 拉取数据前开启loading加载
            commit(type.TABLE_LOADING_STATUS, true)
            request.queryTableData(model)
            .then(res => {
                let {count,  pages} = res.result
                commit(type.VIRTUAL_PAGE_INFO, {count, pages})
                commit(type.VIRTUAL_TABLE_DATA, res.result.content)
                // 数据加载成功后,关闭loading状态
                commit(type.TABLE_LOADING_STATUS, false)
            })
            .catch(error => {
                utils.setMessage('warning', error.message)
            })
        },
        /**
         *表格分页
         *@authr 阎田
         *@date 2019-2-11
         */
        queryTablePages({state, dispatch}, model){
          // 翻页后滚动条回到顶部
        //   state.tableDataList = []
          dispatch('queryTableData', model)
        },
        /**1
         * 新增长号码
         * @author 郭梦娜
         * @date 2019-1-11
         */
        addVirtualNumber({dispatch}, model) {
            return new Promise ((resolve, reject) => {
            request.addVirtualNumber(model)
                .then(res => {
                    resolve(res)
                    utils.setMessage('success', res.message)
                })
                .catch(error => {
                    reject(reject)
                    utils.setMessage('warning', error.message)
                })
            })
        },
        /**1
         * 获取总机号码字典项
         * @author 郭梦娜
         * @date 2019-1-11
         */
        queryTotalNumbers({commit}) {
            request.queryTotalNumbers()
            .then(res => {
                commit(type.VIRTUAL_TOTAL_NUMBERS, res.result)
            })
            .catch(error => {
                utils.setMessage('warning', error.message)
            })
        },
        /**1
         * 获取修改数据
         * @author 郭梦娜
         * @date 2019-1-11
         */
        queryModifyNumber({commit}, phone) {
            request.queryModifyNumber(phone)
            .then(res => {
                commit(type.VIRTUAL_QUERY_MODIFY, res.result)
            })
            .catch(error => {
                utils.setMessage('warning', error.message)
            })
        },
        /**1
         * 修改的提交
         * @author 郭梦娜
         * @date 2019-1-11
         * 
         */
        modifyNumberSubmit({dispatch}, model) {
            return new Promise((resolve, reject) => {
                request.modifyNumberSubmit(model)
                .then(res => {
                    resolve(res)
                    let pageModel = {
                        page:1,
                        pageSize: 20
                    }
                    dispatch('queryTableData', pageModel)
                    utils.setMessage('success', res.message)
                })
                .catch(error => {
                    reject(error)
                    utils.setMessage('warning', error.message)
                })
            })
        },
        /**1
         * 删除长号码
         * @author 郭梦娜
         * @date 2019-1-11
         */
        deleteRow({state}, phone) {
            return new Promise ((resolve, reject) => {
                request.deleteRow(phone)
                .then(res => {
                    resolve(res)
                })
                .catch(error => {
                    reject(error)
                })
            })
        },
        /**1
         * 下载excel模板
         * @author 郭梦娜
         * @date 2019-1-12
         * @update 周靖松
         */
        downExcelExample() {
                request.downExcelExample()
                .then(res => {
                    downFile.downFile(res,"模板")
                })
                .catch(error => {
                })
            }
    },
    namespaced: true
}
export default modules
import detail from "../../api/detail"
import * as type from "../Mutation/index.js"

const state = {
  tableHeadItem: [], //表头
  tableData: [], //表体
  getWorkCallItem: [], //工作电话关联数据存储
  count:0,//共有多少条数据
  fuzzySearchItem:[],//模糊搜索数据
}
const mutations = {
  /**
   * @author: 周靖松
   * @information: 存储人员隐号表头数据
   * @Date: 2019-03-11 10:33:44
   */
  [type.TABLE_HEAD](state, val) {
    state.tableHeadItem = val
  },
  /**
   * @author: 周靖松
   * @information: 存储人员隐号表体数据
   * @Date: 2019-03-11 10:33:56
   */
  [type.TABLE_BODY](state, val) {
    state.tableData = val.list
    state.count=val.totalCount
  },
  /**
   * @author: 周靖松
   * @information: 人员隐号页查询工作电话绑定数据
   * @Date: 2019-03-13 16:05:43
   */
  [type.GET_WORKCALL](state, val) {
    state.getWorkCallItem = val
  },
/**
 * @author: 周靖松
 * @information: 模糊搜索的值存储
 * @Date: 2019-03-31 13:38:00
 */  
[type.FUZZY_SEARCH_ITEM](state,val){
  state.fuzzySearchItem=val
},
}

const actions = {
  /**
 * @author: 周靖松
 * @information: 模糊搜索
 * @Date: 2019-03-31 13:29:41
 */  
postFuzzyChange({commit},val){
  detail.postTableBody(val).then(res => {
    commit(type.FUZZY_SEARCH_ITEM,res.result.list)
  })
},
  /**
   * @author: 周靖松
   * @information: get获取人员隐号管理页表头数据
   * @Date: 2019-03-10 16:30:57
   */
  getTableHead({commit}) {
    !state.tableHeadItem.length&&detail.getTableHead().then(res => {
      commit(type.TABLE_HEAD, res.result)
    })
  },
  /**
   * @author: 周靖松
   * @information: post获取人员隐号管理页表体
   * @parma: val 查询条件
   * @Date: 2019-03-11 09:00:37
   */
  postTableBody({commit},val) {
    return detail.postTableBody(val).then(res=>{
      commit(type.TABLE_BODY, res.result)
    })
  },
  /**
   * @author: 周靖松
   * @information: 人员隐号页get请求工作电话绑定
   * @parma: val  选中展开的人员ID
   * @Date: 2019-03-13 16:01:24
   */
  getWorkCall({commit}, val) {
    detail.getWorkCall(val).then(res => {
      commit(type.GET_WORKCALL, res.result)
    })
  },
  /**
   * @author: 周靖松
   * @information: post人员管理页绑定保存
   * @parma: val {工作电话 绑定类型  绑定数量 选中行的数据}
   * @Date: 2019-03-17 14:26:22
   */
  postBindSub(context,val) {
    return detail.postBindSub(val)
  },
  /**
   * @author: 周靖松
   * @information: put人员管理页解绑保存
   * @parma: val {工作电话 绑定类型  绑定数量 选中行的数据}
   * @Date: 2019-03-17 14:26:22
   */
  postUnBindSub(context,val) {
    return detail.postUnBindSub(val)
  },
}
export default ({
  namespaced: true,
  state,
  mutations,
  actions,
})

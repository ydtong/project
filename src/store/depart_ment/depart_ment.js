import departMent from "../../api/depart_ment"
import * as type from "../Mutation/index.js"

const state = {
  tableHeadItem: [], //表头
  tableData: [], //表体
  subHiddenCallHead: [], //子表格表头
  subHiddenCallBody: [], //子表格表体
  count: null, //总条数
  pages: null, //总共多少页
  fuzzySearchItem:[],//模糊搜索数据
  // 数据权限
  dataJurisdictionList: [],
  // 加盟字典表
  directList:[],
  // 是否共享字典表
  shareAreaList:[]
}
const getters = {
  // 对表格中负责人数组格式进行过滤
  tableData: state => {
    state.tableData.filter(el => {
      el.superiorList = el.superiorList.join('，')
    })
    return state.tableData
  }
}
const mutations = {
  /**
   * @author: 周靖松
   * @information: 存储部门隐号表头数据
   * @Date: 2019-03-11 10:33:44
   */
  [type.TABLE_HEAD](state, val) {
    state.tableHeadItem = val.result
  },
  /**
   * @author: 周靖松
   * @information: 存储部门隐号表体和分页数据
   * @Date: 2019-03-11 10:33:56
   */
  [type.TABLE_BODY](state, val) {
    state.tableData = val.list
    state.count = val.totalCount
    state.pages = val.pageNum
  },
  /**
   * @author: 周靖松
   * @information: 存储空闲短号的表头数据
   * @Date: 2019-03-19 16:03:35
   */
  [type.SUB_HIDDEN_CALL_HEAD](state, val) {
    state.subHiddenCallHead = val
  },
  /**
   * @author: 周靖松
   * @information: 存储空闲短号的表体数据
   * @Date: 2019-03-19 16:03:35
   */
  [type.SUB_HIDDEN_CALL_BODY](state, val) {
    state.subHiddenCallBody = val
  },
  /**
   * @author: 周靖松
   * @information: 模糊搜索的值存储
   * @Date: 2019-03-31 13:38:00
   */  
  [type.FUZZY_SEARCH_ITEM](state,val){
    state.fuzzySearchItem=val
  },
  /**
   * 数据权限
   * @author 阎田
   * @date 2019-7-8
   */
  [type.DEPART_DATA_JURISDICTION](state, data){
    state.dataJurisdictionList = data
  },
  // 是否加盟字典项
  [type.DEPART_DATA_DIRECT_LIST] (state, data) {
    state.directList = data;
  },
  // 是否共享区域字典项
  [type.SHARE_AREA_LIST] (state, data) {
    state.shareAreaList = data
  }
}
const actions = {
  /**
   * 部门隐号表头
   * @author 阎田
   * @date 2019-7-12
   */
  getTableHead({commit}) {
    !state.tableHeadItem.length&&departMent.getTableHead().then(res => {
      commit(type.TABLE_HEAD, res)
    })
  },
  /**
   * 部门隐号列表数据
   * @author 阎田
   * @date 2019-7-12
   */
  postTableBody({state, commit}, data) {
    state.dataJurisdictionList.forEach(el => {
      el.menuLink === '060102020101' && (data.query.projectMark = el.resourceId)
    });
    return departMent.postTableBody(data).then(res=>{
      commit(type.TABLE_BODY, res.result)
    })
  },
  /**
   * 短隐号占用表头
   * @author 阎田
   * @date 2019-7-12
   */
  deptShortVirtualHeader({commit}) {
    return departMent.deptShortVirtualHeader().then(res => {
      commit(type.SUB_HIDDEN_CALL_HEAD, res.result)
    })
  },
  /**
   * 短隐号历史表头
   * @author 阎田
   * @date 2019-7-12
   */
  deptShortVirtualHistoryHeader({commit}) {
    return departMent.deptShortVirtualHistoryHeader().then(res => {
      commit(type.SUB_HIDDEN_CALL_HEAD, res.result)
    })
  },
  /**
   * 长隐号占用表头
   * @author 阎田
   * @date 2019-7-12
   */
  deptLongVirtualHeader({commit}) {
    return departMent.deptLongVirtualHeader().then(res => {
      commit(type.SUB_HIDDEN_CALL_HEAD, res.result)
    })
  },
  /**
   * 长隐号历史表头
   * @author 阎田
   * @date 2019-7-12
   */
  deptLongVirtualHistoryHeader({commit}) {
    return departMent.deptLongVirtualHistoryHeader().then(res => {
      commit(type.SUB_HIDDEN_CALL_HEAD, res.result)
    })
  },
  /**
   * 隐号占用数据
   * @author 阎田
   * @date 2019-7-12
   */
  departmentVirtuals({commit}, data) {
    return departMent.departmentVirtuals(data).then(res=>{
      commit(type.SUB_HIDDEN_CALL_BODY, res.result)
    })
  },
  /**
   * 隐号历史数据
   * @author 阎田
   * @date 2019-7-12
   */
  departmentVirtualHistory({commit}, data) {
    return departMent.departmentVirtualHistory(data).then(res=>{
      commit(type.SUB_HIDDEN_CALL_BODY, res.result)
    })
  },
  /**
   * @author: 周靖松
   * @information: 模糊搜索
   * @Date: 2019-03-31 13:29:41
   */  
  postFuzzyChange({commit},val){
    departMent.postTableBody(val).then(res => {
      commit(type.FUZZY_SEARCH_ITEM,res.result.list)
    })
  },
  /**
   * 数据权限
   * @author 阎田
   * @date 2019-7-8
   */
  departDataJurisdiction({commit}, data){
    return new Promise((resolve, reject) => {
      departMent.departDataJurisdiction(data).then(res => {
        commit(type.DEPART_DATA_JURISDICTION, res.result)
        resolve()
      })
    })
  },
  /**
   * 是否加盟字典项
   * @author 阎田
   * @date 2019-7-14
   */
  getDirectList({commit}) {
    departMent.getDirectList().then((res) => {
      commit(type.DEPART_DATA_DIRECT_LIST, res.result)
    }).catch((error) => {
      utils.setMessage('error', error.message)
    })
  },
  /**
   * 是否共享区域字典项
   * @auhtor 阎田
   * @date 2019-7-14
   */
  getShareArea({commit}){
    departMent.getShareArea().then((res) => {
      commit(type.SHARE_AREA_LIST, res.result)
    }).catch((error) => {
      utils.setMessage('error', error.message)
    })
  },
}
export default ({
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
})

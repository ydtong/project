import request from "../../api/request"
import * as type from "../Mutation/index.js"

const state = {
  hiddenCallTypeArr:[],//虚拟号类型字典表
  hiddenCallbBindArr:[],//虚拟号绑定类型字典表
  hiddenCallBranchArr:[],//虚拟号分配类型字典表
  boardDictionaries:[],//总机号字典
  departMentType:[],//部门类型字典表
  departMentArr:[],//远程搜索返回值
  personMove:[],//远程搜索人员详情
  personWorkCall:[],//远程搜索人员工作电话
  personState:[],//人员状态字典表
  virtualLongCallBindState:[],//虚拟号管理长号字典表
  detailLongCallBindState:[],//人员管理长号字典表
  numberWhere:[],//空闲占用长短状态字典表
}
const mutations = {
/**
 * @author: 周靖松
 * @information: 虚拟号类型字典表存储
 * @Date: 2019-03-23 15:10:17
 */  
[type.HIDDEN_CALL_TYPE](state,val){
  state.hiddenCallTypeArr=val
},
/**
 * @author: 周靖松
 * @information: 虚拟号绑定状态字典表存储
 * @Date: 2019-03-24 17:20:35
 */
[type.HIDDEN_CALL_BIND](state,val){
  state.hiddenCallbBindArr=val
},
/**
 * @author: 周靖松
 * @information: 虚拟号绑定状态字典表存储
 * @Date: 2019-03-24 17:20:35
 */
[type.HIDDEN_CALL_BRANCH](state,val){
  state.hiddenCallBranchArr=val
},
/**
 * @author: 周靖松
 * @information: 总机号字典储存
 * @Date: 2019-03-27 09:28:42
 */
[type.BOARD_DICTIONARIES](state,val){
  state.boardDictionaries=val
},
/**
 * @author: 周靖松
 * @information: 部门类型字典表
 * @Date: 2019-03-28 11:16:37
 */
[type.DEPART_MENT_TYPE](state,val){
  state.departMentType=val
},
  /**
   * @author: 周靖松
   * @information: 部门名称远程搜索
   * @Date: 2019-03-20 11:58:10
   */
  [type.DEPART_MENT_ARR](state, val) {
    state.departMentArr = val
  },
/**
 * @author: 周靖松
 * @information: 人员详情远程搜索
 * @Date: 2019-03-28 15:44:20
 */
[type.WORK_NAME_AND_CALL](state,val){
  state.personMove = val
},
/**
 * @author: 周靖松
 * @information: 远程搜索人员工作电话
 * @Date: 2019-03-28 16:36:09
 */
[type.PERSON_WORK_CALL](state,val){
  state.personWorkCall=[]
  state.personWorkCall.unshift(val.result.peopleBasicInfoVo.workPhone)
},
/**
 * @author: 周靖松
 * @information: 人员状态字典表存储
 * @Date: 2019-03-30 16:45:00
 */
[type.PERSON_STATE](state,val){
  state.personState=val
},
/**
 * @author: 周靖松
 * @information: 虚拟号管理长号字典表
 * @Date: 2019-03-30 16:45:00
 */
[type.VIRTUAL_LONG_CALL_STATE](state,val){
  state.virtualLongCallBindState=val
},
/**
 * @author: 周靖松
 * @information: 虚拟号管理长号字典表
 * @Date: 2019-03-30 16:45:00
 */
[type.DETAIL_LONG_CALL_STATE](state,val){
  state.detailLongCallBindState=val
},
  /**
   * @author: 周靖松
   * @information: 空闲占用长短状态字典表
   * @Date: 2019-04-09 16:12:48
   */
  [type.NUMBER_WHERE](state,val){
    state.numberWhere=val
  },
}

const actions = {
/**
 * @author: 周靖松
 * @information: get请求虚拟号类型字典表
 * @Date: 2019-03-23 15:04:46
 */  
getHiddenCallType({commit}){
  request.getHiddenCallType().then(res=>{
   commit(type.HIDDEN_CALL_TYPE,res.result)
  })

},
/**
 * @author: 周靖松
 * @information: get请求虚拟号绑定状态字典表
 * @Date: 2019-03-24 17:17:32
 */
getHiddenCallBind({commit}){
   request.getHiddenCallBind().then(res=>{
    commit(type.HIDDEN_CALL_BIND,res.result)
   })

},
/**
 * @author: 周靖松
 * @information: get请求虚拟号分配状态字典表
 * @Date: 2019-03-24 17:17:32
 */
getHiddenCallBranch({commit}){
  request.getHiddenCallBranch().then(res=>{
    commit(type.HIDDEN_CALL_BRANCH,res.result)
   })
},
/**
 * @author: 周靖松
 * @information: 请求总机号字典表
 * @Date: 2019-03-27 09:27:07
 */
getBoardDictionaries({commit}){
  request.getBoardDictionaries().then(res=>{
    commit(type.BOARD_DICTIONARIES,res.result)
   })
},
/**
 * @author: 周靖松
 * @information: 请求部门类型字典表
 * @Date: 2019-03-28 11:11:30
 */
getDepartMentType({commit}){
  request.getDepartMentType().then(res=>{
    commit(type.DEPART_MENT_TYPE,res.result)
  })

},
  /**
   * @author: 周靖松
   * @information: 部门名称远程搜索
   * @parma: val 分配部门输入的值
   * @Date: 2019-03-20 11:15:24
   */
  getBranchMent({commit}, val) {
    request.getBranchMent(val).then(res => {
      commit(type.DEPART_MENT_ARR, res.result)
    })
  },
/**
 * @author: 周靖松
 * @information: 人员详情远程搜索
 * @parma: val select 搜索的值
 * @Date: 2019-03-28 14:57:30
 */  
postWorkName({commit},val){
 request.postWorkName(val).then(res=>{
    commit(type.WORK_NAME_AND_CALL,res.result.list)
    res.result.list.length==1&&actions.getWorkName({commit},res.result.list[0].basicId)
  })
},
/**
 * @author: 周靖松
 * @information: 按人员ID查询详情信息
 * @Date: 2019-03-28 15:56:45
 */
getWorkName({commit},val){
  request.getWorkName(val).then(res=>{
    commit(type.PERSON_WORK_CALL,res)
  })
},
/**
 * @author: 周靖松
 * @information: get请求人员状态
 * @Date: 2019-03-30 16:41:11
 */
getPersonState({commit}){
  request.getPersonState().then(res=>{
    commit(type.PERSON_STATE,res.result)
  })
},
/**
 * @author: 周靖松
 * @information: get请求虚拟号管理页长号字典表
 * @Date: 2019-03-30 16:41:11
 */
virtualLongCallState({commit}){
  request.virtualLongCallState().then(res=>{
    commit(type.VIRTUAL_LONG_CALL_STATE,res.result)
  })
},
/**
 * @author: 周靖松
 * @information: get请求人员隐号管理页长号字典表
 * @Date: 2019-03-30 16:41:11
 */
detailLongCallState({commit}){
  request.detailLongCallState().then(res=>{
    commit(type.DETAIL_LONG_CALL_STATE,res.result)
  })
},
  /**
   * @author: 周靖松
   * @information: 空闲占用长短号状态字典表
   * @Date: 2019-04-09 16:09:31
   */
  deptVirtualNumberWhere({commit}){
    request.deptVirtualNumberWhere().then(res => {
      commit(type.NUMBER_WHERE,res.result)
    })
  },

}

export default ({
  namespaced: true,
  state,
  mutations,
  actions,
})

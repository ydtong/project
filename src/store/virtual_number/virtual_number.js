import virtual from "../../api/virtual_number"
import * as type from "../Mutation/index.js"
// 引入工具
import { downFile } from "../../assets/js/tool"

const state = {
  tableHeadItem: [], //表头
  tableData: [], //表体
  getHistoryItem: [], //历史电话查询存储
  getHistoryHeadItem: [], //历史电话头部查询存储
  count: null, //总条数
  pages: null, //总共多少页
  historyCount: null, //绑定历史总条数
  historyPages: null, //绑定历史总共多少页
  fuzzySearchItem: [], //模糊搜索数据
  hiddenBlur: false,//虚拟号是否存在
  unicomHiddenBlur: false,//联通长号是否存在
  // 按钮权限
  buttonJurisdictionList: [],
  // 总机号码字典表
  mainPhoneList:[]
}
const mutations = {
  /**
   * @author: 周靖松
   * @information: 存储虚拟号表头数据
   * @Date: 2019-03-11 10:33:44
   */
  [type.TABLE_HEAD](state, val) {
    state.tableHeadItem = val
  },
  /**
   * @author: 周靖松
   * @information: 存储虚拟号表体数据
   * @Date: 2019-03-11 10:33:56
   */
  [type.TABLE_BODY](state, val) {
    state.tableData = val.list
    state.count = val.totalElements
    state.pages = val.totalPage
  },
  /**
   * @author: 周靖松
   * @information: 虚拟号页历史电话查询数据存储
   * @Date: 2019-03-13 18:34:19
   */
  [type.GET_HISTORY](state, val) {
    state.getHistoryItem = val.list
    state.historyCount = val.totalElements
    state.historyPages = val.totalPage
  },
  /**
   * @author: 周靖松
   * @information: 虚拟号页历史电话头部查询数据存储
   * @Date: 2019-03-13 18:34:19
   */
  [type.GET_HISTORY_HEAD](state, val) {
    state.getHistoryHeadItem = val
  },
  /**
   * @author: 周靖松
   * @information: 模糊搜索的值存储
   * @Date: 2019-03-31 13:38:00
   */
  [type.FUZZY_SEARCH_ITEM](state, val) {
    state.fuzzySearchItem = val
  },
  /**
   * @author: 周靖松
   * @information: 虚拟号失去焦点查询虚拟号
   * @Date: 2019-04-04 16:09:47
   */
  [type.INPUT_BLUR](state, val) {
    val? state.hiddenBlur = true
       : state.hiddenBlur = false
  },
  /**
   * @author: 周靖松
   * @information: 虚拟号失去焦点查询虚拟号
   * @Date: 2019-04-04 17:09:05
   */
  [type.UNICOM_INPUT_BLUR](state, val) {
    val? state.unicomHiddenBlur = true
       : state.unicomHiddenBlur = false
  },
  /**
   * 按钮权限
   * @author 阎田
   * @date 2019-7-5 
   */
  [type.VIRTUAL_BUTTON_JURISDICTION](state, data){
    state.buttonJurisdictionList = data
  },
  /**
   * 总机号码字典表
   * @author 阎田8-117-5 
   */
  [type.VIRTUAL_MAINPHONES_DICTIONARIES](state, data){
    state.mainPhoneList = data
  },
}
const getters = {
  // 提取路由数组
  buttonJurisdictionList: state => {
    let arr = state.buttonJurisdictionList.map(el => {
      return el.menuLink
    })
    return arr
  }
}
const actions = {
  /**
   * @author: 周靖松
   * @information: tanhe页get获取短虚拟号页表头数据
   * @Date: 2019-03-10 16:30:57
   */
  tanheShowTableHead(context) {
   return virtual.showTableHead()
  },
  /**
   * @author: 周靖松
   * @information: get获取短虚拟号页表头数据
   * @Date: 2019-03-10 16:30:57
   */
  getTableHead({commit}) {
    virtual.showTableHead().then(res => {
        commit(type.TABLE_HEAD, res.result)
      })
  },
  /**
   * @author: 周靖松
   * @information: post获取短虚拟号页表体
   * @parma: val  查询条件
   * @Date: 2019-03-11 09:00:37
   */
  showTableBody({commit}, val) {
    return virtual.showTableBody(val).then(res => {
        commit(type.TABLE_BODY, res.result)
    })
  },
  /**
   * @author: 周靖松
   * @information: get获取长虚拟号页表头数据
   * @Date: 2019-03-10 16:30:57
   */
  longTableHead({commit}) {
    virtual.longTableHead().then(res => {
        commit(type.TABLE_HEAD, res.result)
      })
  },
  /**
   * @author: 周靖松
   * @information: post获取长虚拟号页表体
   * @parma: val  查询条件
   * @Date: 2019-03-11 09:00:37
   */
  longTableBody({commit}, val) {
    return virtual.longTableBody(val).then(res => {
        commit(type.TABLE_BODY, res.result)
    })
  },
  /**
   * @author: 周靖松
   * @information: 虚拟短号页下载模板
   * @Date: 2019-03-17 08:49:14
   */
  getShowDownLoad() {
    return virtual.getShowDownLoad().then(res => {
      downFile.downFile(res, "短隐号导入模板")
    })
  },
  /**
   * @author: 周靖松
   * @information: 虚拟号长页下载模板
   * @Date: 2019-03-17 08:49:14
   */
  getLongDownLoad() {
    return virtual.getLongDownLoad().then(res => {
      downFile.downFile(res, "长隐号导入模板")
    })
  },
  /** 
   * @author: 周靖松
   * @information: 虚拟号页批量操作 取消分配
   * @parma:  val  {部门名称 部门id 部门类型 虚拟号 虚拟号类型}
   * @Date: 2019-03-17 09:09:29
   */
  putBatchCancel(context, val) {
    return virtual.putBatchCancel(val)
  },
  /**
   * @author: 周靖松
   * @information: 虚拟号页批量操作 分配部门
   * @parma: 选中的ID
   * @Date: 2019-03-17 09:09:29
   */
  batchDistribution(context, val) {
    return virtual.batchDistribution(val)
  },
  /**
   * @author: 周靖松
   * @information: put新增短隐号保存
   * @parma: val 新增数据
   * @Date: 2019-03-24 10:02:43
   */
  postAddShowCall(context, val) {
    return virtual.postAddShowCall(val)
  },
  /**
   * @author: 周靖松
   * @information: put新增长隐号保存
   * @parma: val 新增数据
   * @Date: 2019-03-24 10:02:43
   */
  postAddLongCall(context, val) {
    return virtual.postAddLongCall(val)
  },
  /**
   * @author: 周靖松
   * @information: put删除短隐号
   * @parma: val 删除的虚拟号码
   * @Date: 2019-03-26 11:09:17
   */
  putDeleteShowCall(context, val) {
    return virtual.putDeleteShowCall(val)
  },
  /**
   * @author: 周靖松
   * @information: 短隐号导入Excel
   * @parma: val   上传的文件formdata
   * @Date: 2019-03-26 16:00:15
   */
  putShowImportExcel(context, val) {
    return virtual.putShowImportExcel(val)
  },
  /**
   * @author: 周靖松
   * @information: 长隐号导入Excel
   * @parma: val   上传的文件formdata
   * @Date: 2019-03-26 16:00:15
   */
  putLongImportExcel(context, val) {
    return virtual.putLongImportExcel(val)
  },
  /**
   * @author: 周靖松
   * @information: 短隐号模糊搜索
   * @Date: 2019-03-31 13:29:41
   */
  showFuzzyChange({commit}, val) {
    virtual.showTableBody(val).then(res => {
      commit(type.FUZZY_SEARCH_ITEM, res.result.list)
    })
  },
  /**
   * @author: 周靖松
   * @information: 长隐号模糊搜索
   * @parma: 
   * @Date: 2019-03-31 13:29:41
   */
  longFuzzyChange({commit}, val) {
    virtual.longTableBody(val).then(res => {
      commit(type.FUZZY_SEARCH_ITEM, res.result.list)
    })
  },
  /**
 * @author: 周靖松
 * @information: 新增表单的input失去焦点查询重复（短号）
 * @parma: val  短虚拟号号码
 * @Date: 2019-03-11 09:00:37
 */
  showHiddenBlur({commit}, val) {
    virtual.showHiddenBlur(val).then(res => {
      commit(type.INPUT_BLUR, res.result)
    })
  },
  /**
   * @author: 周靖松
   * @information: 新增表单的input失去焦点查询重复（长号）
   * @parma: val  长虚拟号号码
   * @Date: 2019-03-10 16:30:57
   */
  longHiddenBlur({commit}, val) {
    virtual.longHiddenBlur(val).then(res => {
      commit(type.INPUT_BLUR, res.result)
    })
  },
  /**
 * @author: 周靖松
 * @information: 新增表单的input失去焦点查询重复（联通号）
 * @parma: val  联通长号号码
 * @Date: 2019-03-10 16:30:57
 */
  getunicomHiddenBlur({commit}, val) {
    virtual.unicomHiddenBlur(val).then(res => {
      commit(type.UNICOM_INPUT_BLUR, res.result)
    })
  },
  /**
   * 获取虚拟号详情
   * @author 阎田
   * @date 2019-7-2 
   */
  getVirtualDetails(context, id){
    return virtual.getVirtualDetails(id)
  },
  /**
   * 短隐号修改保存
   * @author 阎田
   * @date 2019-7-2
   */
  modifyShortVirtual(context, data){
    return virtual.modifyShortVirtual(data)
  },
  /**
   * 长隐号修改保存
   * @author 阎田
   * @date 2019-7-2
   */
  modifyLongVirtual(context, data){
    return virtual.modifyLongVirtual(data)
  },
  /**
   * 解绑虚拟号
   * @author 阎田
   * @date 2019-7-2
   */
  getVirtualUnBinding(context, data){
    return virtual.getVirtualUnBinding(data)
  },
  /**
   * 虚拟号历史表头
   * @author 阎田
   * @date 2019-7-2 
   */
  getVirtualHistoryHeader({commit}) {
    virtual.getVirtualHistoryHeader().then(res => {
      commit(type.GET_HISTORY_HEAD, res.result)
    })
  },
  /**
   * 虚拟号历史数据
   * @author 阎田
   * @date 2019-7-2
   */
  getVirtualHistoryBody({commit}, data) {
    virtual.getVirtualHistoryBody(data).then(res => {
      commit(type.GET_HISTORY, res.result)
    })
  },
  /**
   * 导出excel表
   * @author 阎田
   * @date 2019-7-3
   */
  downExcel({commit}, data) {
    return virtual.downExcel(data).then(res => {
      downFile.downFile(res, "短隐号excel")
    })
  },
  /**
   * 按钮权限
   * @author 阎田
   * @date 2019-7-5 
   */
  virtualButtonJurisdiction({commit}, data){
    return virtual.virtualButtonJurisdiction(data).then(res => {
      commit(type.VIRTUAL_BUTTON_JURISDICTION, res.result)
    })
  },
  /**
   * 总机号码字典表
   * @author 阎田
   * @date 2019-8-11
   */
  virtualMainPhones({commit}){
    return virtual.virtualMainPhones().then(res => {
      commit(type.VIRTUAL_MAINPHONES_DICTIONARIES, res.result)
    })
  },
}
export default ({
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
})

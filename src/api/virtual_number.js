import axios from "@/assets/js/axios.js"
import url from "@/assets/js/request_url.js"
import commonUtils from "@/assets/js/common_util.js"
// 人员隐号管理的API
const version ="v1"
// 虚拟号管理API
const virtual = {
  /** 
   * @author: 周靖松
   * @information: get请求虚拟号管理页短号表头
   * @Date: 2019-03-14 18:04:17
   */
  showTableHead() {
    // return axios.get(`/shortVirtualNumber/pageHeaders`)
    return axios.get(`${url.personPath}/${version}/organization/virtuals/shortVirtualListTable/shortVirtualListTable`)
  },
  /**
   * @author: 周靖松
   * @information: post请求虚拟号管理页短号表体
   * @parma: val  查询条件
   * @Date: 2019-03-14 18:04:25
   */
  showTableBody(val) {
    // return axios.post("/shortVirtualNumber/page", val)
    return axios.post(`${url.personPath}/${version}/organization/virtuals/shortHiddens/${val.pageInfo.page}/${val.pageInfo.size}`, val.query)
  },
  /**
   * @author: 周靖松
   * @information: get请求虚拟号管理页长号表头
   * @Date: 2019-03-14 18:04:17
   */
  longTableHead() {
    // return axios.get("/longVirtualNumber/pageHeaders")
    return axios.get(`${url.personPath}/${version}/organization/virtuals/shortVirtualListTable/longVirtualListTable`)
  },
  /**
   * @author: 周靖松
   * @information: post请求虚拟号管理页长号表体
   * @parma: val  查询条件
   * @Date: 2019-03-14 18:04:25
   */
  longTableBody(val) {
    // return axios.post("/longVirtualNumber/page", val)
    return axios.post(`${url.personPath}/${version}/organization/virtuals/longHiddens/${val.pageInfo.page}/${val.pageInfo.size}`, val.query)
  },
  /**
   * @author: 周靖松
   * @information: 虚拟短号页下载模板
   * @Date: 2019-03-17 08:55:04
   */
  getShowDownLoad() {
    return axios.get(`${url.personPath}/${version}/organization/shortTemplate`, {
      responseType: "arraybuffer"
    })
  },
  /**
   * @author: 周靖松
   * @information: 虚拟长号页下载模板
   * @Date: 2019-03-17 08:55:04
   */
  getLongDownLoad() {
    return axios.get(`${url.personPath}/${version}/organization/longTemplate`, {
      responseType: "arraybuffer"
    })
  },
  /**
   * @author: 周靖松
   * @information: post虚拟号页取消分配
   * @parma: val  {部门名称 部门id 部门类型 虚拟号 虚拟号类型}
   * @Date: 2019-03-17 08:56:39
   */
  putBatchCancel(val) {
    return axios.post("/assign/cancelAssignDept", val)
  },
  /**
   * @author: 周靖松
   * @information: post虚拟号页分配部门点击确定
   * @parma: val {部门名称 部门id 部门类型 虚拟号 虚拟号类型}
   * @Date: 2019-03-17 08:56:39
   */
  batchDistribution(val) {
    return axios.post(`/assign/assignDept`, val)
  },
  /**
   * @author: 周靖松
   * @information: put新增短隐号保存
   * @parma: val 新增数据
   * @Date: 2019-03-24 10:02:43
   */
  postAddShowCall(val) {
    // return axios.post(`/shortVirtualNumber/virtualNumber`, val)
    return axios.post(`${url.personPath}/${version}/organization/shortVirtual`, val)
  },
  /**
   * @author: 周靖松
   * @information: put新增长隐号保存
   * @parma: val 新增数据
   * @Date: 2019-03-24 10:02:43
   */
  postAddLongCall(val) {
    // return axios.post(`/longVirtualNumber/virtualNumber`, val)
    return axios.post(`${url.personPath}/${version}/organization/longVirtual`, val)
  },
  /**
   * @author: 周靖松
   * @information: 删除虚拟号（短号、长号）
   * @parma: val 删除的虚拟号码
   * @Date: 2019-03-26 11:09:17
   */
  putDeleteShowCall(val) {
    // return axios.put(`/shortVirtualNumber/virtualNumber`, val)
    return axios.delete(`${url.personPath}/${version}/organization/virtual/${val}`)
  },
  /**
   * @author: 周靖松
   * @information: 短隐号导入Excel
   * @parma:  val  上传的文件formdata
   * @Date: 2019-03-26 16:01:24
   */
  putShowImportExcel(val) {
    return axios.post(`${url.personPath}/${version}/organization/shortImportExcel`, val)
  },
  /**
   * @author: 周靖松
   * @information: 长隐号导入Excel
   * @parma:  val  上传的文件formdata
   * @Date: 2019-03-26 16:01:24
   */
  putLongImportExcel(val) {
    return axios.post(`${url.personPath}/${version}/organization/longImportExcel`, val)
  },
  /**
   * @author: 周靖松
   * @information: 短虚拟号校验重复
   * @parma:  val  短虚拟号号码
   * @Date: 2019-03-26 16:01:24
   */
  showHiddenBlur(val) {
    return axios.get(`/shortVirtualNumber/queryVirtualNumber/${val}`)
  },
  /**
   * @author: 周靖松
   * @information: 短虚拟号校验重复
   * @parma:  val  长虚拟号号码
   * @Date: 2019-03-26 16:01:24
   */
  longHiddenBlur(val) {
    return axios.get(`/longVirtualNumber/queryVirtualNumber/${val}`)
  },
  /**
   * @author: 周靖松
   * @information: 联通长号校验重复
   * @parma:  val  联通长号号码
   * @Date: 2019-03-26 16:01:24
   */
  unicomHiddenBlur(val) {
    return axios.get(`/shortVirtualNumber/querySonVirtualNumber/${val}`)
  },
  /**
   * 获取虚拟号详情
   * @author 阎田
   * @date 2019-7-2 
   */
  getVirtualDetails(id) {
    return axios.get(`${url.personPath}/${version}/organization/virtual/details/${id}`)
  },
  /**
   * 短隐号修改保存
   * @author 阎田
   * @date 2019-7-2 
   */
  modifyShortVirtual(data) {
    return axios.put(`${url.personPath}/${version}/organization/shortVirtual`, data)
  },
  /**
   * 长隐号修改保存
   * @author 阎田
   * @date 2019-7-2 
   */
  modifyLongVirtual(data) {
    return axios.put(`${url.personPath}/${version}/organization/longVirtual`, data)
  },
  /**
   * 解绑虚拟号
   * @author 阎田
   * @date 2019-7-2 
   */
  getVirtualUnBinding(id) {
    return axios.put(`${url.personPath}/${version}/organization/virtual/unBinding/${id}/${commonUtils.getUrlkey(window.location.href).code}`)
  },
  /**
   * 虚拟号历史表头
   * @author 阎田
   * @date 2019-7-2
   */
  getVirtualHistoryHeader() {
    return axios.get(`${url.personPath}/${version}/organization/virtuals/shortVirtualListTable/virtualHistory`)
  },
  /**
   * 虚拟号历史数据
   * @author 阎田
   * @date 2019-7-2
   */
  getVirtualHistoryBody(data) {
    return axios.get(`${url.personPath}/${version}/organization/VirtualHistory/${data.pageInfo.page}/${data.pageInfo.size}/${data.query.id}`)
  },
  /**
   * 导出excel
   * @author 阎田
   * @date 2019-7-3
   */
  downExcel(data) {
    return axios.post(`${url.personPath}/${version}/organization/shortExportExcel`, data, {responseType: 'arraybuffer'})
  },
  /**
   * 获取按钮权限
   * @author 阎田
   * @date 2019-7-5 
   */
  virtualButtonJurisdiction(data){
    return axios.post(`${url.personPath}/${version}/basic/queryButtonDate`, data)
  },
  /**
   * 总机号码字典表
   * @author 阎田
   * @date 2019-8-11
   */
  virtualMainPhones(){
    return axios.get(`${url.personPath}/${version}/organization/virtuals/MainPhones`)
  }
}

export default virtual

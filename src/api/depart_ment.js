import axios from "@/assets/js/axios.js"
import url from "@/assets/js/request_url.js"
import commonUtils from "@/assets/js/common_util.js"
// 人员隐号管理的API
const version ="v1"
// 部门管理页的API
const departMent ={
    /**
     * @author: 周靖松 
     * @information: get请求部门隐号页表头
     * @Date: 2019-03-14 18:04:17 
     */
    getTableHead() {
      return axios.get(`${url.personPath}/${version}/organization/virtuals/shortVirtualListTable/deptVirtualHeader`)
    },
    /**
     * @author: 周靖松
     * @information: post请求部门隐号页表体
     * @parma: val 查询条件
     * @Date: 2019-03-14 18:04:25
     */
    postTableBody(data) {
      return axios.post(`${url.personPath}/${version}/organization/virtual/virtualStatistics/${data.pageInfo.page}/${data.pageInfo.size}`, data.query)
    },
    /**
     * @author: 周靖松
     * @information: post部门隐号管理页分配虚拟号的保存请求
     * @parma: val {部门ID 部门类型 虚拟号数量 虚拟号类型}
     * @Date: 2019-03-14 18:05:00
     */
    distributionSub(val) {
      return axios.post("/assign/numberAssign", val)
    },
    /**
     * @author: 周靖松
     * @information: put部门隐号管理页回收虚拟号的保存请求
     * @parma: val {部门ID 部门类型 虚拟号数量 虚拟号类型}
     * @Date: 2019-03-14 18:05:09
     */
    recoverySub(val) {
      return axios.post("/assign/cancelNumberAssign", val)
    },
  /**
   * 短隐号占用表头
   * @author 阎田
   * @date 2019-7-12
   */
  deptShortVirtualHeader(){
    return axios.get(`${url.personPath}/${version}/organization/virtuals/shortVirtualListTable/deptShortVirtualHeader`)
  },
  /**
   * 短隐号历史表头
   * @author 阎田
   * @date 2019-7-12
   */
  deptShortVirtualHistoryHeader(){
    return axios.get(`${url.personPath}/${version}/organization/virtuals/shortVirtualListTable/deptShortVirtualHistoryHeader`)
  },
  /**
   * 长隐号占用表头
   * @author 阎田
   * @date 2019-7-12
   */  
  deptLongVirtualHeader(){
    return axios.get(`${url.personPath}/${version}/organization/virtuals/shortVirtualListTable/deptLongVirtualHeader`)
  },
  /**
   * 长隐号历史表头
   * @author 阎田
   * @date 2019-7-12
   */  
  deptLongVirtualHistoryHeader(){
    return axios.get(`${url.personPath}/${version}/organization/virtuals/shortVirtualListTable/deptLongVirtualHistoryHeader`)
  },
  /**
   * 隐号占用数据
   * @author 阎田
   * @date 2019-7-12
   */
  departmentVirtuals(data){
    return axios.post(`${url.personPath}/${version}/organization/virtual/departmentVirtuals/${data.pageInfo.page}/${data.pageInfo.size}`, data.query)
  },
  /**
   * 隐号历史数据
   * @author 阎田
   * @date 2019-7-12
   */
  departmentVirtualHistory(data){
    return axios.post(`${url.personPath}/${version}/organization/virtual/departmentVirtualHistory/${data.pageInfo.page}/${data.pageInfo.size}`, data.query)
  },
  /**
   * 获取数据权限
   * @author 阎田
   * @date 2019-7-8
   */
  departDataJurisdiction(data){
    return axios.post(`${url.personPath}/${version}/basic/queryButtonDate`, data)
  },
  /**
   * 是否加盟字典项
   * @author 阎田
   * @date 2019-7-14
   */
  getDirectList() {
    return axios.get(`${url.personPath}/${version}/organization/department/directStatus`)
  },
  /**
   * 是否共享区域字典项
   * @author 阎田
   * @date 2019-7-14
   */
  getShareArea() {
    return axios.get(`${url.personPath}/${version}/organization/department/sharedState`)
  },
}

export default departMent
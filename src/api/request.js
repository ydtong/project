import axios from "@/assets/js/axios.js"
import url from "@/assets/js/request_url.js"
// 父页面的API主要请求不存在更改的字典表
const version ="v1"
const request = {
  /**
   * @author: 周靖松
   * @information: get请求虚拟号类型字典表
   * @Date: 2019-03-23 15:06:51
   */  
  getHiddenCallType(){
    return axios.get("/dictionary/virtualNumberType")
  },
  /**
   * @author: 周靖松
   * @information: get请求虚拟号绑定状态字典表
   * @Date: 2019-03-24 17:19:18
   */
  getHiddenCallBind(){
    return axios.get("/dictionary/virtualNumberBindingState")
  },
  /**
   * @author: 周靖松
   * @information: get请求虚拟号绑定状态字典表
   * @Date: 2019-03-24 17:19:18
   */
  getHiddenCallBranch(){
    return axios.get("/dictionary/virtualNumberAssignState")
  },
  /**
   * @author: 周靖松
   * @information: 总机号字典查询
   * @Date: 2019-03-27 09:30:08
   */
  getBoardDictionaries(){
    return axios.get(`/mainPhone/dictionary`)
  },
  /**
   * @author: 周靖松
   * @information: 部门列表类型字典表
   * @Date: 2019-03-28 11:13:48
   */
  getDepartMentType(){
    return axios.get(`${url.personPath}/${version}/organization/departmentType/dictionaryList/0`)
  },
    /**
     * @author: 周靖松
     * @information: 部门名称远程搜索
     * @parma: val 分配部门输入的值
     * @Date: 2019-03-20 11:29:22
     */
    getBranchMent(val) {
      return axios.get(`${url.personPath}/${version}/department/listByKeyword?keyword=${val}`)
    },
  /**
   * @author: 周靖松
   * @information: 人员详情远程搜索
   * @parma: val  远程搜索输入的值
   * @Date: 2019-03-28 15:16:10
   */
  postWorkName(val){
    return axios.post(`${url.personPath}/${version}/query/peoples/all`,val)
  },
  /**
   * @author: 周靖松
   * @information: 根据人员ID查询详情信息
   * @parma: val 人员ID
   * @Date: 2019-03-28 15:59:38
   */
  getWorkName(val){
    return axios.get(`${url.personPath}/${version}/query/people/${val}`)
  },
  /**
   * @author: 周靖松
   * @information: 人员状态字典表
   * @Date: 2019-03-30 16:39:21
   */
  getPersonState(){
    return axios.get(`${url.personPath}/${version}/people/dictionary/status`)
  },
  /**
   * @author: 周靖松
   * @information: 虚拟号管理页长号字典表
   * @Date: 2019-03-30 16:39:21
   */
  virtualLongCallState(){
    return axios.get(`/dictionary/SonVirtualNumberState`)
  },
  /**
   * @author: 周靖松
   * @information: 人员管理页长号字典表
   * @Date: 2019-03-30 16:39:21
   */
  detailLongCallState(){
    return axios.get(`${url.personPath}/${version}/people/dictionary/isHaveLongVirtual`)
  },
    /**
   * @author: 周靖松
   * @information: 空闲占用长短号状态字典表
   * @Date: 2019-04-09 16:10:37
   */
  deptVirtualNumberWhere(){
    return axios.get('/dictionary/deptVirtualNumberWhere')
  }
}


export default request

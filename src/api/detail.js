import axios from "@/assets/js/axios.js"
import url from "@/assets/js/request_url.js"
// 人员隐号管理的API
const version ="v1"
const tableTypeCode ="virtualPeopleListHeader"
const detail = {
  /**
   * @author: 周靖松
   * @information: get请求人员隐号页表头
   * @Date: 2019-03-14 18:04:17
   */
  getTableHead() {
    return axios.get(`${url.personPath}/${version}/basic/query/virtualTableHeader/${tableTypeCode}`)
  },
  /**
   * @author: 周靖松
   * @information: post请求人员隐号页表体
   * @parma: val 查询条件
   * @Date: 2019-03-14 18:04:25
   */
  postTableBody(val) {
    return axios.post(`${url.personPath}/${version}/basic/virtual/query/peopleList`,val)
  },
  /**
   * @author: 周靖松
   * @information: get人员隐号页点击绑定查询工作电话
   * @parma: val 人员id
   * @Date: 2019-03-14 18:05:20
   */
  getWorkCall(val) {
    return axios.get(`${url.personPath}/${version}/basic/virtual/query/bindInfo/${val}`)
  },
  /**
   * @author: 周靖松
   * @information: post人员管理页绑定保存
   * @parma: val {工作电话 绑定类型  绑定数量 选中行的数据}
   * @Date: 2019-03-17 14:29:34
   */
  postBindSub(val) {
    return axios.post("/virtualNumberUse/binding",val)
  },
  /**
   * @author: 周靖松
   * @information: put人员管理页解绑保存
   * @parma: val {工作电话 绑定类型  绑定数量 选中行的数据}
   * @Date: 2019-03-17 14:32:02
   */
  postUnBindSub(val) {
    return axios.put("/virtualNumberUse/cancelBinding",val)
  },
}

export default detail

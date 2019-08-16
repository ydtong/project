import axios from "@/assets/js/axios.js"
// 总机号管理的API
const borad ={
  /**
   * @author: 周靖松
   * @information: get请求总机页表头 
   * @Date: 2019-03-14 18:04:17
   */
  getTableHead() {
    return axios.get(`/mainPhone/pageHeader`)
  },
  /**
   * @author: 周靖松
   * @information: post请求总机页表体
   * @parma: val 查询条件
   * @Date: 2019-03-14 18:04:25
   */
  postTableBody(val) {
    return axios.post(`/mainPhone/pageQuery`,val)
  },
  /**
   * @author: 周靖松
   * @information: 总机号页新增总机号
   * @parma: val 总机号
   * @Date: 2019-03-14 18:05:46
   */
  postAddBoard(val) {
    return axios.post(`/mainPhone/platformBaseHiddenCall/business/subAccount/add`, val)
  },
  /**
   * @author: 周靖松
   * @information: 总机号页修改总机号
   * @parma: val 总机号
   * @Date: 2019-03-14 18:05:53
   */
  postUpdateBoard(val) {
    return axios.post(`/mainPhone/modify`, val)
  },
  /**
   * @author: 周靖松
   * @information: 确定删除
   * @parma: val 删除的code
   * @Date: 2019-03-14 18:06:03
   */
  postBoardDelete(val) {
    return axios.put(`/mainPhone/delete`,val)
  },
  /**
   * @author: 周靖松
   * @information: 请求总机号code
   * @parma: val 总机号code
   * @Date: 2019-04-02 20:38:40
   */  
  getBoardCode(val){
    return axios.get(`/mainPhone/mainPhoneQuery/${val}`)
  },
}

export default borad
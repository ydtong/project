
import axios from '@/assets/js/axios.js'
// 人员库扣下来的登陆
export default {
  /**
   * 登录
   * @author 阎田
   * @date 2019-3-26 
   */
  personRegister(data){
    return axios.post(`https://dgateway.allhome.com.cn/organization/v1/basic/login/accountLogin`, data)
  }
}

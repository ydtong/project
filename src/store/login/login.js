// 人员库扣下来的
/**
 * 职级管理页面接口
 * @author 阎田
 * @date 2018-11-23 11:00
 */
import tanhe from '@/api/login.js'
import commonUtils from '@/assets/js/common_util.js'
const state = {
  
}

const getters = {
 
}

const mutations = {
 
}

const actions = {
  /**
   * 登录
   * @author 阎田
   * @date 2019-3-27 
   */
  personRegister({commit}, data){
    return new Promise((resolve, reject) => {
      tanhe.personRegister(data)
        .then(res => {
          resolve(res)
        }).catch(rej => {
          commonUtils.setMessage('error', rej.message)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

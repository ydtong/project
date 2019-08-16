import axios from 'axios'
// 引入工具
import { message } from "./tool"

axios.defaults.timeout = 60000


// path = `http://192.168.10.200:8299/`//200
// path = `http://192.168.10.62:8299/`//李钊
// path = `http://192.168.10.66:8009/virtualnumberadministrate`//孙靖武
// 虚拟号
let path ={
  development:`http://192.168.10.200:8299/`,
  // development:`http://192.168.10.200:8299/`,
  lan:`https://dgateway.allhome.com.cn/virtualnumberadministrate/`,
  pred:`https://dgateway.allhome.com.cn/virtualnumberadministrate/`,
  production:`https://gateway.allhome.com.cn/virtualnumberadministrate/`
}

// token
// TguHGNUoSIIB3wyzIswsqp+BTnV8VUj76g6Gg7Eg3g+erkGS6N8HhXGEjLqXcBO2V+OoW/p4HN2mtw4ZwiUWppLL1zoczV16DTfBaae5N6LgIZNaZd679pqW1qzo5a+Cp7EwMG4AMDbPBqlEM0ksIhZy89FWapWXM2IKnpFOUSUfWjzpdcsZAwkV4O8+8iECURjoBCH+/AJyLVokt55oK3ivK10jruxGT9FFOeKePBqBLbuanX61nErUhwbb7WxyC9kbnjFWc2JQUl2y+vHiC3GyDJT8f4HLzMSiDGN42xYgURKrCVjRaN0oOH5tjbmV2S3VPUjhIbkrhlM07v0BLw==

axios.defaults.baseURL = path[process.env.NODE_ENV];

/**
 * @author: 周靖松
 * @information: 请求拦截
 * @Date: 2019-04-02 15:44:30
 */ 
axios.interceptors.request.use((config) => {
  config.headers.token = window.token || "";
  return config;
}, (error) => {
  let data = error.response;
  message.shoWmessage("请求超时", "error")
  return Promise.reject(data);
});

/**
 * @author: 周靖松
 * @information: 响应拦截
 * @Date: 2019-04-02 15:45:22
 */
axios.interceptors.response.use((response) => {
  //   状态码，  消息
  let excel=response.data instanceof ArrayBuffer
  let { statusCode} = response.data;
  //  退出登录状态码
  let logoutCodes = new Set([435011]);
  if (logoutCodes.has(statusCode)) {
      window.logout();
  }
  // 200字符串不要删，有服务返的字符串
  if (new Set([1000, 200,"200"]).has(statusCode)||excel) {
    //  更新全局token;
    let {pragma} = response.headers;
    pragma? window.token = pragma:"";    
    //  返回数据
    return Promise.resolve(response.data);
  }else{
    //  1000之外状态码 抛出错误消息
    message.shoWmessage(response.data.message, "error")
    return Promise.reject(response.data);
  }
  
},(error) => {
  let {response, request} = error;
  if (response) {
      message.shoWmessage(response.data.message, "error")
      return Promise.reject(response.data);
  }
  if (request) {
      //  请求超时
      let timeoutCodes = new Set([4, 0]);
      let {readyState, status} = request;
      if (timeoutCodes.has(readyState) 
       && timeoutCodes.has(status)) {
          return Promise.reject({});
      }
  }
});

export default axios



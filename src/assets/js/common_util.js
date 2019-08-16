import Vue from 'vue'
// 人员库抠出来的工具
export default {
  /**
   * 消息提示框
   * 新增、修改、删除、审核、驳回等操作调用该提示框
   * @param type 只有success和warning
   **/
  setMessage: function (type, message) {
    Vue.prototype.$message({
      showClose: true,
      message: message,
      type: type,
      duration: 5000
    })
  },
  /** 
   * @author lgs
   * @date: 2018-12-4
   * @information  // 获取当前时间，并将其格式化
  */
  getNowDate: function (type) {
    let now = new Date();
    let year = now.getFullYear(); 
    let month = now.getMonth();
    let date = now.getDate();
    let hour = now.getHours();
    let minu = now.getMinutes();
    let sec = now.getSeconds();
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    let time = "";
    if(type === 'date'){
      time = year + "-" + month + "-" + date;
    } else {
      time = year + "-" + month + "-" + date+ " " + hour + ":" + minu + ":" + sec;
    }
    return time
  },
  /**
   * 获取cookie  by Nadia
   */
  getCookie: function (key) {
    if (document.cookie.length > 0) {
      let start = document.cookie.indexOf(key + '=')
      if (start !== -1) {
        start = start + key.length + 1
        let end = document.cookie.indexOf(';', start)
        if (end === -1) end = document.cookie.length
        return unescape(document.cookie.substring(start, end))
      }
    }
    return ''
  },
  /**
   * 保存Cookie by Nadia
   * @param c_name
   * @param value
   * @param expiredays
   */
  setCookie: function (cName, value, expiredays) {
    let exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = cName + '=' + decodeURIComponent(value) +
      ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
  },
  /**
   * 解析地址中的参数
   * @author 阎田
   * @date 2019-7-5
   */
  getUrlkey(url){
    var params = {},
        arr = url.split("?");
    if (arr.length <= 1)
        return params;
    arr = arr[1].split("&");
    for(var i=0, l=arr.length; i<l; i++){
        var a = arr[i].split("=");
        params[a[0]] = a[1];
    }
    return params;
  }
}

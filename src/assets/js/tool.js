import Vue from 'vue'
/**
 * @author: 周靖松
 * @information: 消息提示框
 * @Date: 2019-04-07 16:32:31
 */
export const message = {
    shoWmessage(message, type) {
      Vue.prototype.$message({
        showClose: true,
        message: message,
        type: type,
        duration:3000
      })
    }
}
/**
 * @author: 周靖松
 * @information: 下载模板
 * @Date: 2019-04-07 16:32:40
 */
export const downFile = {
  downFile(res,name){
    // 创建blob实例
    const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' })
    // 创建元素
    let downloadElement = document.createElement('a')
    // 创建下载的链接
    let href = window.URL.createObjectURL(blob)
    downloadElement.href = href
    // 添加元素
    document.body.appendChild(downloadElement)
    // 更换下载文件信息名称
    downloadElement.download = `${name}.xls`
    // 点击下载
    downloadElement.click()
    // 下载完成移除元素
    document.body.removeChild(downloadElement)
    // 释放掉blob对象
    window.URL.revokeObjectURL(href)
  }
}
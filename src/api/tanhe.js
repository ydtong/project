import axios from 'axios'
import url from "@/assets/js/request_url.js"
// 人员库抠出来的API
export default {
    // 查询虚拟号表头
    queryTableHeader() {
        return axios.get(`${url.showPath}/platformBaseHiddenCall/business/groupNet/pageHeader`)
    },
    // 查询虚拟号表格数据
    queryTableData(model) {
        return  axios.post(`${url.showPath}/platformBaseHiddenCall/business/groupNet/pageQuery`, model)
    },
    // 新增虚拟号
    addVirtualNumber(model) {
        return axios.post(`${url.showPath}/platformBaseHiddenCall/business/groupNet/add`, model)
    },
    // 获取总机号码池字典项
    queryTotalNumbers() {
        return axios.get(`${url.showPath}/platformBaseHiddenCall/business/subAccount/subAccountDictionary`)
    },
    // 新增长号
    addNumber(model) {
        return axios.post(`${url.showPath}/platformBaseHiddenCall/business/groupNet/add`, model)
    },
    // 修改长号获取
    queryModifyNumber(phone) {
        return axios.get(`${url.showPath}/platformBaseHiddenCall/business/groupNet/pageHeader/${phone}`)
    },
    // 修改长号的保存
    modifyNumberSubmit(model) {
        return axios.post(`${url.showPath}/platformBaseHiddenCall/business/groupNet/modify`, model)
    },
    // 删除
    deleteRow(phone) {
        return axios.post(`${url.showPath}/platformBaseHiddenCall/business/groupNet/delete/${phone}`)
    },
    // 下载excel模板
    downExcelExample() {
        return axios.get(`${url.showPath}/platformBaseHiddenCall/business/groupNet/downloadExcelTemplate`, {responseType: 'arraybuffer'})
    }
}
import borad from "../../api/switch_borad"
import * as type from "../Mutation/index.js"

const state = {
  tableHeadItem: [], //表头
  tableData: [], //表体
  count: 0, //共有多少条数据
  boradCallMove: {},//总机号详情
  boradBlur: false,//总机号是否重复
}
const mutations = {
  /**
   * @author: 周靖松
   * @information: 存储总机号表头数据
   * @Date: 2019-03-11 10:33:44
   */
  [type.TABLE_HEAD](state, val) {
    state.tableHeadItem = val
  },
  /**
   * @author: 周靖松
   * @information: 存储总机号表体数据
   * @Date: 2019-03-11 10:33:56
   */
  [type.TABLE_BODY](state, val) {
    state.tableData = val.content
    state.count = val.count
  },
  /**
   * @author: 周靖松
   * @information: 总机号查询结果储存
   * @Date: 2019-03-30 14:25:04
   */
  [type.SELECT_BORAD](state, val) {
    state.boradCallMove = val
  },
  /**
   * @author: 周靖松
   * @information: 总机号失去焦点查询总机号
   * @Date: 2019-04-04 16:09:47
   */
  [type.INPUT_BLUR](state, val) {
    val.count
      ? state.boradBlur = true
      : state.boradBlur = false
  },
}
const actions = {
  /**
   * @author: 周靖松
   * @information: get获取总机页表头数据
   * @Date: 2019-03-10 16:30:57
   */
  getTableHead({ state,commit }) {
    !state.tableHeadItem.length&&borad.getTableHead().then(res => {
      commit(type.TABLE_HEAD, res.result)
    })
  },
  /**
   * @author: 周靖松
   * @information: post获取总机页表体
   * @parma: val  查询条件（页数，条数）
   * @Date: 2019-03-11 09:00:37
   */
  postTableBody({ commit }, val) {
    return borad.postTableBody(val).then(res=>{
      commit(type.TABLE_BODY, res.result)
    })
  },
  /**
 * @author: 周靖松
 * @information: 总机号失去焦点查询总机号列表
 * @parma: val  查询条件
 * @Date: 2019-03-11 09:00:37
 */
  postBoratInputBlur({commit}, val) {
    borad.postTableBody(val).then(res => {
      commit(type.INPUT_BLUR, res.result)
    })
  },
  /**
   * @author: 周靖松
   * @information: 总机号码页新增总机号
   * @Date: 2019-03-14 14:31:47
   */
  postAddBoard(context, val) {
    return borad.postAddBoard(val)
  },
  /**
   * @author: 周靖松
   * @information: 总机号码页修改总机号
   * @Date: 2019-03-14 14:31:47
   */
  postUpdateBoard(context, val) {
    return borad.postUpdateBoard(val)
  },
  /**
   * @author: 周靖松
   * @information: 确定删除
   * @parma: val 要删除的总机号code
   * @Date: 2019-03-14 17:01:02
   */
  postBoardDelete(context, val) {
    return borad.postBoardDelete(val)
  },
  /**
   * @author: 周靖松
   * @information: 请求总机号code
   * @parma: val 总机号code
   * @Date: 2019-04-02 20:37:18
   */
  getBoardCode({ commit }, val) {
    borad.getBoardCode(val).then(res => {
      commit(type.SELECT_BORAD, res.result)
    })
  },

}
export default ({
  namespaced: true,
  state,
  mutations,
  actions,
})

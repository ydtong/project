/**
 * @author: 周靖松
 * @information: 总机号管理data
 * @Date: 2019-04-19 11:48:56
 */
import { mapState,mapActions } from "vuex";
export const switchBoardData={ 
    computed: {
        ...mapState("switch_borad", [ 
          "tableHeadItem",// 表头
          "tableData",// 表体 
          "count",// 总共有多少条数据    
          "boradCallMove",//总机号详情    
          "boradBlur",//总机号是否重复
        ]),
      },
      data() {
        return {
          addDrawer: false, //新增侧滑开关
          updateDrawer: false, //修改侧滑开关
          deleteDrawerMark: false, //删除弹窗开关
          rowItem: null, //选中行的数据
          loadingMark: false, //loading开关
          btnLoading: false, //按钮loading开关
          delBtnLoading: false, //删除按钮loading开关
        };
      },
      methods: {
        // 总机号action
        ...mapActions("switch_borad",[
          "postBoardDelete",//确定删除
          "postAddBoard",//新增保存按钮
          "getBoardCode",//修改按钮被点击
          "postUpdateBoard",//修改保存按钮
          "postTableBody",//请求表体
          "postBoratInputBlur",//总机号失去焦点判断是否重复
          "getTableHead",//生命周期请求表格
        ]),
    }
}
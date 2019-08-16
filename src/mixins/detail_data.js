/**
 * @author: 周靖松
 * @information: 人员明细页data
 * @Date: 2019-04-19 11:48:56
 */
import { mapState,mapActions } from "vuex";
export const datailData={ 
    computed: {
        // 人员隐号管理页store数据
        ...mapState("detail", [
          "tableHeadItem", //表头
          "tableData", //表体
          "getWorkCallItem", //工作电话关联数据
          "count",//共有多少条数据
          "fuzzySearchItem",//模糊搜索返回值
        ]),
        // 父页面store数据
        ...mapState("hidden_call", [
          "hiddenCallTypeArr", //虚拟号类型
          "personState",//人员状态字典表
          "detailLongCallBindState",//人员明细长号字典表
        ])
      },
      data() {
        return {
          bindMark: false, //分配虚拟号开关
          unBindMark: false, //回收虚拟号开关
          rowItem: null, //点击绑定解绑选中的改行的数据
          point: false,//高级搜索红点
          closeSearch:false,//是否展开下拉
          fuzzyItem:undefined,//高级搜索的值
          loadingMark:false,//加载loading开关
        };
      },
      methods: {
        // 人员隐号action
        ...mapActions("detail",[
          "postBindSub",//绑定弹窗保存
          "postUnBindSub",//解绑弹窗保存
          "getWorkCall",//请求工作电话绑定数据
          "postTableBody",//请求表体
          "getTableHead",//生命周期请求表格
          "postFuzzyChange",//高级搜索模糊搜索
        ]),
        // 父页面action
        ...mapActions("hidden_call",[
          "getPersonState",//请求人员状态字典表
          "detailLongCallState",//请求人员明细管理长号状态字典表
        ]),
    }
}
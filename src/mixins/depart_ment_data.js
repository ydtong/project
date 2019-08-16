/**
 * @author: 周靖松
 * @information: 部门隐号管理页data
 * @Date: 2019-04-19 11:48:56
 */
import { mapState,mapActions,mapGetters } from "vuex";
export const departMentData={ 
    computed: {
        ...mapState("depart_ment", [
          "tableHeadItem", // 表头
          "count", //总条数
          "pages", //总共多少页
          "fuzzySearchItem", //模糊搜索返回值
        ]),
        ...mapGetters("depart_ment", [
          "tableData", // 表体
        ]),
        ...mapState("hidden_call", [
          "hiddenCallTypeArr", // 虚拟号类型字典表
          "departMentType", //部门类型字典表
          "departMentArr", //远程搜索返回值
          "personMove", //远程搜索人员详情
          "personWorkCall", //远程搜索人员工作电话
          "numberWhere" //空闲占用长短状态字典表
        ]),
      },
      data() {
        return {
          distributionMark: false, //分配虚拟号开关
          recoveryMark: false, //回收虚拟号开关
          rowItem: null, //选中行的数据
          point: false, //高级搜索红点
          drawerMark: false, //侧滑开关
          drawerTableShow: true, //侧滑是否显示表格
          drawerBtnHidden: true, //侧滑是否隐藏操作按钮列
          showCallType: false, //侧滑是否显示短隐号
          drawerRow: {}, //点击空闲占用列的该行数据
          closeSearch: false, //是否展开下拉
          loadingMark:false,//loading开关
          btnLoadingMark:false,//按钮loading开关
          // 给部门列表传出来的四个事件定义标题和请求路径
          switchItem: {
            // 占用短号列表被点击
            bindingShortVirtualNumber: {
              title: "占用短号列表",
              headUrl: "depart_ment/getShowOccupyHead",//表头数据
              bodyUrl: "depart_ment/postShowOccupyBody",//表体数据
            },
            // 占用长号列表被点击
            bindingLongVirtualNumber: {
              title: "占用长号列表",
              headUrl: "depart_ment/getLongOccupyHead",//表头数据
              bodyUrl: "depart_ment/postLongOccupyBody",//表体数据
            },
            // 空闲短号列表被点击
            notBindingShortVirtualNumber: {
              title: "空闲短号列表",
              headUrl: "depart_ment/getShowFreeHead",//表头数据
              bodyUrl: "depart_ment/postShowFreeBody",//表体数据
            },
            // 空闲长号列表被点击
            notBindingLongVirtualNumber: {
              title: "空闲长号列表",
              headUrl: "depart_ment/getLongFreeHead",//表头数据
              bodyUrl: "depart_ment/postLongFreeBody",//表体数据
            }
          },
          // 侧滑展示数据
          drawerItem: {}
        };
      },
      methods: {
            // 人员隐号action
        ...mapActions("depart_ment",[
          "distributionSub",//分配弹窗的保存按钮
          "postFuzzyChange",//高级搜索模糊搜索
          "postTableBody",//请求表体
          "recoverySub",//回收弹窗的保存按钮
          "getTableHead",//生命周期请求表格
        ]),
           // 父页面action
        ...mapActions("hidden_call",[
          "postWorkName",//人员详情远程搜索  
          "getBranchMent",//远程搜索 
          "getDepartMentType",//请求部门类型字典表 
          "deptVirtualNumberWhere",//空闲占用长短号状态字典表 
          "getHiddenCallType",//请求虚拟号类型字典表 
        ]),
    }
}
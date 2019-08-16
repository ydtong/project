/**
 * @author: 周靖松
 * @information: 人员明细页data
 * @Date: 2019-04-19 11:48:56
 */
import { mapState,mapActions,mapGetters } from "vuex";
export const virtualNumberData={ 
    computed: {
        // 虚拟号管理页store的储存值
        ...mapState("virtual_number", [
          "tableHeadItem", //隐号表头
          "tableData", //隐号表体
          "getHistoryItem", //绑定历史表体
          "getHistoryHeadItem", //绑定历史表头
          "count", //总条数
          "pages", //总共多少页
          "historyCount", //绑定历史总条数
          "historyPages", //绑定历史总共多少页
          "fuzzySearchItem", //模糊搜索返回值
          "hiddenBlur", //虚拟号是否重复
          "unicomHiddenBlur", //联通长号是否重复
        ]),
        ...mapGetters('virtual_number', [
          // 按钮权限
          'buttonJurisdictionList'
        ]),
        // 父页面的store的储存值（字典表）
        ...mapState("hidden_call", [
          "hiddenCallBranchArr", //虚拟号类型字典表
          "hiddenCallbBindArr", //虚拟号绑定类型字典表
          "boardDictionaries", //总机号字典
          "departMentArr", //远程搜索返回值
          "virtualLongCallBindState",//长号绑定状态
        ])
      },
      data() {
        return {
          showDrawer: false, //侧滑状态
          deleteDrawerMark: false, //删除弹窗开关
          branchMent: false, //分配部门弹窗开关
          cancelBranchMent: false, //取消分配部门弹窗开关
          virtualNumberList: [], //选中的的虚拟号数组
          rowLength: 0, //选中的数量
          tableMark: true, //长短隐号表格切换
          stateArr: [], //状态数组
          deptName: true, //是否分配部门
          batchDisabled: true, //批量操作取消按钮是否置灰
          branchDisabled: true, //批量操作分配部门是否置灰
          deleteDisabled: true, //批量删除按钮是否置灰
          point: false, //高级搜索没有红点
          addDrawerForm: false, //新增侧滑开关
          updateDrawerForm: false, //修改侧滑开关
          refreshPoint: false, //刷新关闭红点
          loadingMark: false, //是否显示加载
          bindHistoryTitle: false, //绑定历史标题
          delBtnLoading: false, //删除按钮loading
          btnLoading: false, //按钮loading
          excelLoading: false, //excel按钮loading
          historyLoadingMark: false, //历史表格loading
          // 绑定历史查询条件
          searchCriteria:{
            pageInfo: {
                page: 1,//页
                size: 50//条
            },
          },
          // 选中数据的id数组
          idArray:[],
          // 解绑按钮得loading
          unBindingLoading: false,
          unBindingId: '',
          // 下载模板loading
          downLoading:false,
          // 导出excel
          downExcelLoading:false
        };
      },
      methods: {
        // 虚拟号管理页action
        ...mapActions("virtual_number",[
          "putDeleteShowCall",//删除短号
          "putDeleteLongCall",//删除长号
          "putLongImportExcel",//导入长隐号excel
          "putShowImportExcel",//导入短隐号excel
          "showFuzzyChange",//短号高级搜索
          "longFuzzyChange",//长号高级搜索
          "showHistoryHead",//短隐号历史表头
          "showHistoryBody",//短隐号历史表体
          "longHistoryHead",//长隐号历史表头
          "longHistoryBody",//长隐号历史表体
          "getShowDownLoad",//短隐号下载模板
          "getLongDownLoad",//长隐号下载模板
          "putBatchCancel",//取消分配
          "getTableHead",//短号表头
          "showTableBody",//短号表体
          "longTableHead",//长号表头
          "longTableBody",//长号表体
          "batchDistribution",//分配部门
          "postAddShowCall",//新增短隐号
          "postAddLongCall",//新增长隐号
          "showHiddenBlur",//短虚拟号判重
          "longHiddenBlur",//长虚拟号判重
          "getunicomHiddenBlur",//联通长号判重
          // 导出excel
          'downExcel',
          // 查询总机号码字典表
          'virtualMainPhones'
        ]),
        // 父页面action
        ...mapActions("hidden_call",[
          "getBoardDictionaries",//总机号字典
          "getBranchMent",//远程搜索
          "getHiddenCallBind",//请求虚拟号绑定类型字典表
          "getHiddenCallBranch",//请求虚拟号分配类型字典表
          "virtualLongCallState",//请求虚拟号管理长号状态字典表
        ]),
    }
}
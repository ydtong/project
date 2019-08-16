<template>
<!-- 人员库拆过来的页面 -->
  <div id="add-virtual">
    <el-form :model="form"
              label-width="80px"
              label-position="left"
              :rules="rules"
              size="mini"
              ref="form">
      <el-form-item label="工作电话" prop="phone">
        <el-input type="text" v-model="form.phone" maxlength="11" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="客户姓名" prop="name">
        <el-input type="text" v-model="form.name" placeholder="请输入">

        </el-input>
      </el-form-item>
      <el-form-item label="总机号码" prop="accountCode">
        <el-select v-model="form.accountCode" placeholder="请选择">
          <el-option v-for="(item, index) in tatalNumbers"
                    :key="index"
                    :label="item.accountInfo"
                    :value="item.accountCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="text-align: left">
        <el-button type="primary" @click="submit('form')" :loading="buttonLoading">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    // 控制新增侧滑
    showAddSkid: {
      type: Boolean,
      default: false
    },
    // 控制修改侧滑
    showEditSkid: {
      type: Boolean,
      default: false
    },
    // 总机号码字典项
    tatalNumbers: Array,
    // 获取修改长号的数据
    queryModifyData: Object,
    // 按钮loading
    buttonLoading:{
      type:Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        phone:'',
        name:'',
        accountCode: ''
      },
      // 总机号码名称
      accountInfo: '',
      options: [],
      rules:{
        phone: [{required: true, message: '请输入长号码', trigger: 'blur'},
                {pattern: /^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6])|(17[1-8])|(18[0-9])|(19[8-9]))\d{8}$/g, message: '请输入正确的长号码', trigger: 'blur'}],
        name: [{pattern: /^[\u4e00-\u9fa5]{2,10}$/, message: '请输入2到10位的汉字', trigger: 'blur'},
        {required: true, message: '请输入名称', trigger: 'blur'}],
        accountCode: [{required: true, message: '请输入总机号码', trigger: 'change'}]
      }
    }
  },
  mounted() {
    
    if(this.queryModifyData) {
      this.form = this.queryModifyData
    }
    // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
    this.$refs['form'].resetFields()
  },
  methods: {
    /**1
     * 关闭侧滑
     * @author 郭梦娜
     * @date 2019-1-11
     */
    closeDialog() {
      this.$emit('close-skid', false)
    },
    /**1
     * 保存
     * @author 郭梦娜
     * @date 2019-1-11
     */
    submit(form) {
      this.$refs[form].validate((valid) => {
        if(valid) {
          // 校验成功
          this.$emit('submit-save', this.form)

        } else {
          // 校验失败
          return false;
        }
      })
    },
    /**1
     * 取消
     * @author 郭梦娜
     * @date 2019-1-11
     */
    cancel() {
      this.$emit('close-skid', false)
    }
  },
  watch: {
    queryModifyData(val) {
      this.form = val
    }
  }
}
</script>
<style lang="scss">
 #add-virtual{
  // 小标题
  .header_title{
      display:flex;
      justify-content:space-between;
      width:400px;
      flex-wrap:wrap;
      font-size: 14px;
      font-weight: 900;
      margin-bottom: 30px;
      div:nth-of-type(2){
          border-top: 1px solid #e1e1e1;
          height: 0px;
          width: 330px;
          margin-top: 11px;
      }
  }
  form{
    .el-form-item__content{
      width: 100%;
    }
    // 验证'*'号
    .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before{
      content: ''
    }
    .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after{
      content: '*';
      position: relative;
      color: #f56c6c;
      left: 5px;
    }
    .el-input--mini .el-input__inner{
      width: 300px;
    }
  }
}
</style>


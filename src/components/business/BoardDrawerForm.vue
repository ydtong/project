<template>
  <!-- 总机管理页新增修改侧滑表单 -->
  <div id="addrawerForm">
    {{formItemMark}}
    <el-form :model="form" size="mini" :rules="rules" ref="ruleForm" label-position="left" label-width="90px">
     <!-- 总机号码 -->
      <el-form-item label="总机号码" :error="boradBlur&&form.mainPhone?'总机号已存在':''" prop="mainPhone">
        <el-input maxlength="11"        
                  clearable
                  :disabled="updateDrawer"
                  placeholder="请输入总机号"
                  size="mini"
                  v-model="form.mainPhone"
                  @input="boratInputChange"></el-input>
      </el-form-item>
      <!-- 描述 -->
      <el-form-item label="描述" prop="remark">
        <el-input maxlength="50"  clearable placeholder="请输入描述" size="mini" v-model="form.remark"></el-input>
      </el-form-item>
      <!-- 虚拟号上限 -->
      <el-form-item label="虚拟号上限" prop="totalCapacity">
        <el-input clearable
                  placeholder="请输入虚拟号上限"
                  maxlength="20"
                  size="mini"
                  v-model="form.totalCapacity"></el-input>
      </el-form-item>
      <!-- 子账号ID -->
      <el-form-item label="子账号ID" prop="accountid">
        <el-input clearable placeholder="请输入子账号ID" size="mini" v-model="form.accountid"></el-input>
      </el-form-item>
      <!-- token -->
      <el-form-item label="token" prop="token">
        <el-input clearable placeholder="请输入token" size="mini" v-model="form.token"></el-input>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item style="text-align: left">
        <el-button type="primary" :loading="btnLoading" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

export default {
  props: {
    //点击修改传进来的值
    formItem: {
      type: [Array, Object]
    },
    //总机号是否重复
    boradBlur: {
      type: Boolean,
      default: false
    },
    // 是否为修改弹窗
    updateDrawer:{
      type: Boolean,
      default: false
    },
    // 按钮loading开关
    btnLoading:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        mainPhone: null, //总机号
        remark: null, //描述
        totalCapacity: null, //虚拟号上限
        accountid: null, //子账号ID
        token: null //token
      },
      //验证规则
      rules: {
        // 总机号验证规则
        mainPhone: [
          { pattern: /^[0-9]+$/,required: true, message: "请填写总机号码",trigger: "blur"},
          { min: 11, max: 11, message: "长度为11位数字", trigger: "blur" }
        ],
        // 描述验证规则
        remark: [
          { required: true, message: "请填写描述", trigger: "blur" }
        ],
        // 虚拟号上限验证规则
        totalCapacity: [
          { pattern: /^[0-9]+$/, required: true,message: "请填写正确虚拟号上限",trigger: "blur"}
        ],
        // 子账号ID验证规则
        accountid: [
          { required: true,message: "请填写子账号ID",trigger: "blur"},
          { pattern: /^[^\u4e00-\u9fa5]+$/,required: true,message: "请不要输入汉字", trigger: "blur"}
        ],
        // token  验证规则
        token: [
          {required: true, message: "请填写token",trigger: "blur"},
          {pattern: /^[^\u4e00-\u9fa5]+$/, required: true,message: "请不要输入汉字",trigger: "blur"}
        ]
      }
    };
  },
  /**
   * @author: 周靖松
   * @information: 监听点击修改传进来的值
   * @Date: 2019-04-03 11:25:21
   */
  computed:{
    formItemMark(){
      this.formItem?this.form=this.formItem:''
      return null
    }
  },
  methods: {
    /**
     * @author: 周靖松
     * @information:表单验证
     * @Date: 2019-03-14 10:33:05
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        // 验证通过且不是修改弹窗
        valid&&!this.updateDrawer
           // 判断总机号没有重复
           ? !this.boradBlur
              ? this.$emit("submitForm", this.form)
              : this.message.shoWmessage("总机号重复", "error")
           // 验证通过且是修改弹窗
           : (valid&&this.updateDrawer) && this.$emit("submitForm", this.form)   
      });
    },
    /**
     * @author: 周靖松
     * @information: 重置表单关闭侧滑
     * @Date: 2019-03-14 10:34:20
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$emit("resetForm");
    },
    /**
     * @author: 周靖松
     * @information: 总机号验证总机号
     * @parma: val 输入的总机号
     * @Date: 2019-04-04 17:16:20
     */
    boratInputChange(val) {
      val.length>9&&!this.updateDrawer&&this.$emit("boratInputBlur", val);
    }
  },
};
</script>


<template>
  <!-- 虚拟号管理页侧滑表单 -->
  <div id="addrawerForm">
    <el-form :model="form" size="mini" :rules="rules" ref="ruleForm" label-position="left" label-width="80px">
      <!-- 短隐号 -->
      <template v-if="tableMark">
        <!-- 总机号码 -->
        <el-form-item label="总机号码" prop="mainPhone">
          <el-select  clearable
                      size="mini"
                      :disabled="updateDisabled"
                      maxlength="11"
                      v-model="form.mainPhone"
                      placeholder="请输入总机号码">
            <el-option  v-for="(item,index) in boardDictionaries"
                        :key="index"
                        :label="item.describe"
                        :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <!-- 虚拟短号 -->
        <el-form-item :error="hiddenBlur&&form.virtualPhone?'虚拟短号已存在':''" label="虚拟短号" prop="virtualPhone">
          <el-input clearable
                    placeholder="请输入虚拟短号"
                    maxlength="11"
                    size="mini"
                    :disabled="updateDisabled"
                    v-model="form.virtualPhone"
                    @input="hiddenInputChange"></el-input>
        </el-form-item>
        <!-- 虚拟长号 -->
        <el-form-item class="hidden-call-none" :error="unicomHiddenBlur&&form.unicomVirtual?'虚拟长号已存在':''" label="虚拟长号" >
          <el-input clearable
                    placeholder="请输入虚拟长号"
                    maxlength="11"
                    size="mini"
                    v-model="form.unicomVirtual"
                    @input="unicomInputChange"></el-input>
        </el-form-item>
        <!-- 开卡人姓名 -->
        <el-form-item label="开卡人姓名" class="hidden-call-none">
          <el-input clearable 
                    placeholder="请输入开卡人姓名"
                    maxlength="11"
                    size="mini" 
                    v-model="form.idCardName"></el-input>
        </el-form-item>
        <!-- 身份证号 -->
        <el-form-item label="身份证号" class="hidden-call-none">
          <el-input clearable
                    placeholder="请输入身份证号"
                    maxlength="18"
                    size="mini"
                    v-model="form.idCard"></el-input>
        </el-form-item>
      </template>
      <!-- 长隐号 -->
      <template v-else>
        <!-- 虚拟长号 -->
        <el-form-item label="虚拟长号"
                      prop="virtualPhone"
                      :error="hiddenBlur&&form.virtualPhone?'虚拟长号已存在':''">
          <el-input clearable
                    placeholder="请输入虚拟长号"
                    maxlength="11"
                    size="mini"
                    :disabled="updateDisabled"
                    v-model="form.virtualPhone"
                    @input="hiddenInputChange"></el-input>
        </el-form-item>
        <!-- 开卡人姓名 -->
      <el-form-item label="开卡人姓名" prop="idCardName">
        <el-input clearable
                  placeholder="请输入开卡人姓名"
                  maxlength="11"
                  size="mini" 
                  v-model="form.idCardName"></el-input>
      </el-form-item>
      <!-- 身份证号 -->
      <el-form-item label="身份证号" prop="idCard">
        <el-input clearable
                  placeholder="请输入身份证号"
                  maxlength="18"
                  size="mini"
                  v-model="form.idCard"></el-input>
      </el-form-item>
      </template>
      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="closeDrawer">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

export default {
  props: {
    //   长短隐号标识
    tableMark: {
      type: Boolean,
      default: true
    },
    // 总机号字典表
    boardDictionaries: Array,
    //虚拟号是否存在
    hiddenBlur: {
      type: Boolean,
      default: false
    },
    //虚拟长号是否存在
    unicomHiddenBlur: {
      type: Boolean,
      default: false
    },
    //点击修改传进来的数据
    updateDrawerItem: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 是否禁用
      updateDisabled:false,
      form: {
        //表单数据
        mainPhone: null, //总机号码
        virtualPhone: null, //虚拟号
        unicomVirtual: null, //虚拟长号
        idCard:null, //身份证号
        idCardName:''// 开卡人姓名
      },
      //验证规则
      rules: {
        // 总机号规则
        mainPhone: [
          {pattern: /^[0-9]+$/,required: true,message: "请填写总机号码",trigger: "blur"}
        ],
        // 虚拟号规则
        virtualPhone: [
          { pattern: /^[0-9]+$/, required: true,message: "请填写虚拟短号号码",trigger: "blur"},
          { min: 11, max: 11, message: "长度为11位数字", trigger: "blur" }
        ],
        idCardName:[
          {required: true,message: "请填写开卡人姓名",trigger: "blur"}
        ],
        idCard:[
          {required: true,message: "请填写身份证号",trigger: "blur"}
        ]
      }
    };
  },

  methods: {
    /**
     * @author: 周靖松
     * @information:表单验证
     * @Date: 2019-03-14 10:33:05
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        // 通过验证且联通长号和虚拟号在数据库没有重复（校验判断在前不能&&）
        if(valid){
          this.$emit("submitForm", this.form)
        }
      });
    },
    /**
     * @author: 周靖松
     * @information: 关闭弹窗
     * @Date: 2019-03-14 10:34:20
     */
    closeDrawer() {
      this.$emit("closeDrawer");
    },
    /**
     * @author: 周靖松
     * @information: 虚拟号监听重复
     * @parma: val 输入的总机号
     * @Date: 2019-04-04 17:16:20
     */
    hiddenInputChange(val) {
      val.length>9&&this.$emit("hiddenInputBlur", val);
    },
    /**
     * @author: 周靖松
     * @information: 虚拟号监听重复
     * @parma: val 输入的虚拟号
     * @Date: 2019-04-04 17:16:20
     */
    unicomInputChange(val) {
      val.length>9&&this.$emit("unicomInputBlur", val);
    }
  },
  mounted() {
    /**
     * @author: 周靖松
     * @information: 点击修改赋值
     * @Date: 2019-04-08 10:30:12
     */
    if(this.updateDrawerItem){
      this.form = this.updateDrawerItem
      this.updateDisabled = true
    }
  }
};
</script>

<style lang="scss">
#addrawerForm{
  form{
    .el-form-item{
      .el-form-item__content{
        .el-select{
          width: 320px;
        }
      }
    }
  }
}
</style>


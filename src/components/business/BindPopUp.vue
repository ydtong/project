<template>
  <!-- 人员隐号管理页绑定解绑弹窗页 -->
  <div id="bingDialog">
    <el-form v-model="form" label-position="left">
      <!-- 工作电话 -->
      <el-form-item label="工作电话">
        <el-select size="mini" v-model="form.workCall" clearable placeholder="请选择">
          <el-option  clearable
                      v-for="(item,index) in options"
                      :key="index"
                      :label="item.label"
                      :value="item.value"></el-option>
        </el-select> 
      </el-form-item>
      <!-- 虚拟号类型单选框 -->
      <el-form-item :label="typeTitle">
        <el-radio v-model="form.hiddenCallType"
                  v-for="(item,index) in hiddenCallTypeArr"
                  :key="index"
                  :label="item.code">{{item.describe}}</el-radio>
      </el-form-item>
      <!-- 数字选择器 -->
      <el-form-item :label="numberTitle">
        <el-input-number  clearable
                          v-model="form.number"
                          size="mini"
                          controls-position="right"
                          :min="1"
                          :max="form.hiddenCallType==0?1:5"></el-input-number>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item class="label">
        <el-button type="primary" @click="subForm(form)">确 定</el-button>
        <el-button class="cancelBtn assist-btn" @click="closePopup">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    //表单第一行的label
    typeTitle: {
      type: String,
      default: "解绑类型"
    },
    //表单第二行的label
    numberTitle: {
      type: String,
      default: "解绑数量"
    },
    // 虚拟号类型单选
    hiddenCallTypeArr: Array
  },
  data() {
    return {
      form: {//表单数据
        hiddenCallType: 0, //单选数据
        number: null, //绑定解绑数量
        workCall: null //下拉框数据
      },
      options: {//下拉选项，等数据
      }
    };
  },
  methods: {
    /**
     * @author: 周靖松
     * @information: 关闭弹窗
     * @Date: 2019-03-12 17:03:33
     */
    closePopup() {
      this.$emit("closePopup");
    },
    /**
     * @author: 周靖松
     * @information: 确定事件
     * @Date: 2019-03-12 17:08:39
     */
    subForm(form) {
      this.$emit("subForm", form);
    }
  }
};
</script>

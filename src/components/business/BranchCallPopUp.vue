<template>
  <!-- 部门隐号管理页分配虚拟号弹窗页 -->
  <div id="dialog">
    <el-form v-model="form" label-position="left">
      <!-- 虚拟号单选 -->
      <el-form-item :label="typeTitle">
        <el-radio v-model="form.virtualNumberType"
                  v-for="(item,index) in hiddenCallTypeArr"
                  :key="index"
                  :label="item.code">虚拟{{item.describe}}</el-radio>
      </el-form-item>
      <!-- 数量选择器 -->
      <el-form-item :label="numberTitle">
        <el-input-number clearable v-model="form.number" size="mini" controls-position="right" :min="1"></el-input-number>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item class="label">
        <template slot-scope="scope">
          <el-button :scope="scope" type="primary" :loading="btnLoadingMark" @click="subForm(form)">保 存</el-button>
          <el-button class="cancelBtn assist-btn" @click="closePopup">取 消</el-button>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    //表单第一行的label名称
    typeTitle: {
      type: String,
      default: "分配类型"
    },
    //表单第二行的label名称
    numberTitle: {
      type: String,
      default: "分配数量"
    },
    // 虚拟号类型数组
    hiddenCallTypeArr: {
      type: Array,
      default: Array
    },
    // 按钮loading开关
    btnLoadingMark: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        virtualNumberType: 0, //虚拟号类型
        number: 1 //分配回收数量
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

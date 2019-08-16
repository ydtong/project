<template>
  <!-- 删除弹窗页 -->
  <div id="deleteDialog">
    <!-- 标题 -->
    <div class="warning-text">正在进行删除操作，操作后数据无法恢复，确认继续？</div>
    <div class="warning-span">
      请输入
      <span>{{oneNumber}} + {{twoNumber}}=</span>确认删除操作
    </div>
    <!-- 回答框 -->
    <el-input @keyup.enter.native="prohibit?'':deleteBoard()" @input="inputChange" v-model="input"></el-input>
    <!-- 按钮 -->
    <div class="btn-box">
      <el-button class="confirm" :loading="delBtnLoading" @click="deleteBoard" :disabled="prohibit" :type="prohibit?'info':'danger'">确定删除</el-button>
      <el-button class="close no-border" @click="closepopup">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    //确定删除按钮loading
    delBtnLoading: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      oneNumber: null, //随机生成的第一个数字
      twoNumber: null, //随机生成的第二个数字
      correctResult: null, //正确的结果
      input: "", //计算结果  
      prohibit: true //是否禁用按钮
    };
  },
  methods: {
      /**
       * @author: 周靖松
       * @information: 关闭弹窗
       * @Date: 2019-03-14 15:21:10
       */
      closepopup() {
        this.$emit("closepopup");
      },
      /**
       * @author: 周靖松
       * @information: 监听计算结果
       * @Date: 2019-03-14 16:51:55
       */
      inputChange() {
        this.correctResult == this.input
          ?this.prohibit = false
          :this.prohibit = true   
      },
      /**
       * @author: 周靖松
       * @information: 确认删除
       * @Date: 2019-03-14 17:06:38
       */  
      deleteBoard(){
        this.$emit("deleteBoard")
      },
  },
  mounted() {
    /**
     * @author: 周靖松
     * @information: 随机生成计算
     * @Date: 2019-04-04 12:07:51
     */
    this.oneNumber = Math.ceil(Math.random() * 10);
    this.twoNumber = Math.ceil(Math.random() * 10);
    this.correctResult = this.oneNumber  + this.twoNumber;
  }
};
</script>

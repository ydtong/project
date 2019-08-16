<template>
<!-- 龙哥的大高级搜索。。。 -->
  <div class="box-warp" id="AdvancedSearch" @click.stop>
    <div class="input-warp">
      <div class="icon-warp">
        <transition name="fade">
          <Loadding class="loadding" v-if="loadFlag && loadShow && asyncFlag"/>
          <i class="search-icon iconfont icon-sousuo" v-else></i>
        </transition>
      </div>
      <div class="search-input-warp">
        <input
          type="text"
          ref="advancedInput"
          :placeholder="placeholder"
          :value="modelVal"
          @input="onInput"
          @focus="onFocus"
          @change="onChange"
          @blur="onBlur"
          @keyup.enter="onEnter"
        >
        <i @click="clearInput" v-if="modelVal" class="el-icon-error searchError"></i>
      </div>
      <button class="search-button" v-if="isSlot" :class="{point:point}" @click="onGoSenior">
        <span :class="{active:soltFlag}" class="iconfont icon-xiala"></span>
        <i v-if="showMark" class="mark"></i>
      </button>
    </div>
    <div class="all-warp">
      <transition name='slide-fade'>
        <div class="select-warp"  v-show="dropFlag">
          <div v-show="!soltFlag">
            <ul class="list-warp" v-if="listArr.length">
              <li
                v-for="(item,i) of listArr"
                :key="i"
                :class="{active:index===i}"
                v-html="clientListHtml(item)"
                @click="onSelectList(item,i)"
              ></li>
            </ul>
            <div v-else class="select-not-data">{{notMessage}}</div>
          </div>
          <div v-show="soltFlag">
            <slot></slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Loadding from "./Loadding.vue";

export default {
  name: "AdvancedSearch",
  components: {
    Loadding
  },
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    selectData: {
      type: Array,
      default() {
        return [];
      }
    },
    value: {
      type: String,
      default: ""
    },
    valueKey: {
      type: String,
      default: "name"
    },
    activeData: {
      type: Object,
      default() {
        return {};
      }
    },
    notMessage: {
      type: String,
      default: "无相关搜索项"
    },
    loadShow: {
      type: Boolean,
      default: true
    },
    jitterTiem: {
      type: Number,
      default: 0
    },
    asyncFlag: {
      type: Boolean,
      default: false
    },
    screen: {
      type: Boolean,
      default: false
    },
    focusShow: {
      type: Boolean,
      default: false
    },
    point: {
      type: Boolean,
      default: false
    },
    // 是否显示红点
    showMark: {
      type: Boolean,
      default: false
    },
    // 是否收起下拉
    closeSearch: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      hackHidden:false,
      dropFlag: false,
      index: 0,
      modelVal:
        this.value === undefined || this.value === null
          ? ""
          : this.activeData[this.valueKey] || this.value,
      soltFlag: false,
      loadFlag: false,
      timer: null,
      isSlot: false,
      listArr: this.selectData.length ? this.selectData : [],
    };
  },
  methods: {
    onFocus(event) {
      let { modelVal, screen, asyncFlag, focusShow, selectData } = this;
      let { value } = event.target;
      modelVal && focusShow && (this.dropFlag = true);
      selectData.length && (this.soltFlag = false);
      this.$emit("focus", value);
      !asyncFlag && screen && this.screenData();
    },
    onInput(event) {
      let { value } = event.target;
      let { jitterTiem, loadShow, asyncFlag, screen } = this;
      loadShow && asyncFlag && (this.loadFlag = true);
      this.dropFlag = true;
      this.soltFlag = false;
      this.setCurrentValue(value);
      if (jitterTiem) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.$emit("input", value);
        }, jitterTiem);
        return;
      }
      !asyncFlag && screen && this.screenData();
      this.$emit("input", value);
    },
    screenData() {
      let { selectData, modelVal, valueKey } = this;
      this.listArr = selectData.filter(el => {
        let _index = el[valueKey] ? el[valueKey].indexOf(modelVal) : "";
        if (_index !== -1) {
          return el;
        }
      });
      this.index = this.listArr.findIndex(el => {
        return el[valueKey] === modelVal;
      });
    },
    onChange(event) {
      let { value } = event.target;
      this.$emit("change", value);
      this.setCurrentValue(value);
    },
    onBlur(event) {
      let { value } = event.target;
      this.$emit("blur", value);
    },
    clientListHtml(item) {
      let { valueKey, modelVal } = this;
      let str = modelVal
        ? item[valueKey]
          ? item[valueKey]
              .toString()
              .replace(
                modelVal,
                `<b style="font-weight: bold;">${modelVal}</b>`
              )
          : item[valueKey]
        : item[valueKey];
        let str2 = modelVal
        ? item["mainPhone"]
          ? item["mainPhone"]
              .toString()
              .replace(
                modelVal,
                `<b style="font-weight: bold;">${modelVal}</b>/`
              )
          : ""
        :"" ;
        let str3 = modelVal
        ? item["deptName"]&&!item[valueKey]==item["deptName"]
          ? item["deptName"]
              .toString()
              .replace(
                modelVal,
                `/<b style="font-weight: bold;">${modelVal}</b>`
              )
          : ""
        : "";
      return `${str2}   ${str}   ${str3}`;
    },
    onSelectList(item, index) {
      let { valueKey } = this;
      let value = item[valueKey];
      this.setCurrentValue(value);
      this.index = index;
      this.$emit("select", { data: item, index });
      this.dropFlag = false;
    },
    onGoSenior() {
      this.soltFlag = !this.soltFlag;
      /**
       * @author: 周靖松
       * @information: 收起时一起收起
       * @Date: 2019-03-31 13:10:07
       */
      if (!this.soltFlag) {
        this.dropFlag = false;
        return;
      }
      this.dropFlag = true;
    },
    /**
     * @author: 周靖松
     * @information: 清空输入框
     * @Date: 2019-03-31 17:45:43
     */
    clearInput() {
      this.$emit("clearInput");
      this.modelVal = undefined;
    },
    setCurrentValue(value) {
      this.modelVal = value;
    },
    /**
     * @author: 周靖松
     * @information: 点击回车搜索
     * @Date: 2019-03-31 18:34:27
     */
      onEnter(event){
      // 关闭下拉
      this.dropFlag = false;
      this.soltFlag = false;
      this.advancedFlag = false;
      // 让输入框失去焦点
      this.$refs.advancedInput.blur()
      // 将输入框内容传出
      this.$emit('downEnter', event.target)
    },
  },
  watch: {
    selectData: {
      handler(newList, oldList) {
        this.loadFlag = false;
        this.listArr = newList;
      },
      immediate: true
    },
    /**
     * @author: 周靖松
     * @information:关闭下拉
     * @Date: 2019-03-31 13:10:38
     */
    closeSearch(val) {
      this.onGoSenior();
    },
    /**
     * @author: 周靖松
     * @information:换页清空高级搜索的值
     * @Date: 2019-03-31 13:10:38
     */
    clearSearch(){
       this.clearInput();
    }
  },
  created() {
    document.addEventListener("click", () => {
      this.dropFlag = false;
      this.soltFlag = false;
    });
    document.addEventListener("keyup", e => {
      let { dropFlag, listArr } = this;
      if (dropFlag && listArr.length) {
        let code = e.keyCode;
        code === 38 && this.index--;
        code === 40 && this.index++;
        this.index =
          this.index > listArr.length - 1 ? listArr.length - 1 : this.index;
        this.index = this.index < 0 ? 0 : this.index;
      }
    });
    this.isSlot = Boolean(this.$slots.default);
  }
};
</script>
<style lang="scss" scoped>
.box-warp {
  .icon-warp {
    width: 40px;
    height: 40px;
    overflow: hidden;
    margin-right: 10px;
  }
  .loadding {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.4);
  }
  .input-warp {
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    display: flex;
    background: #fff;
    border: {
      width: 1px;
      color: #cccccc;
      style: solid;
      radius: 5px;
    }
    .loadding-warp {
      position: relative;
    }
    .search-icon {
      display: block;
      width: 38px;
      height: 38px;
      color: #999999;
      text-align: center;
      line-height: 38px;
    }
    .search-input-warp {
      flex-grow: 1;
      height: 38px;
      line-height: 38px;
      input[type="text"] {
        padding: 0px;
        outline: none;
        border: none;
        font-size: 16px;
        // padding: 10px 0px;
        display: block;
        width: 100%;
      }
    }
    .search-button {
      width: 58px;
      outline: none;
      border: none;
      margin-left: 10px;
      color: #999999;
      font-size: 14px;
      cursor: pointer;
      position: relative;
      background: none;
      border-left: 1px solid #999;
      span {
        position: absolute;
        display: block;
        width: 38px;
        height: 38px;
        left: 50%;
        top: 50%;
        margin: {
          left: -19px;
          top: -19px;
        }
        line-height: 38px;
        text-align: center;
        transition: all 0.35s;
        transform-origin: center center;
        border-radius: 50%;
      }
      span.active {
        transform: rotate(180deg);
      }
      i {
        position: relative;
        display: block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        top: -10px;
        right: -40px;
        background-color: #eb4c44;
      }
    }
    .search-button.point:after {
      display: block;
      content: "";
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #eb4c44;
      position: absolute;
      top: 6px;
      right: 8px;
    }
    .search-button:hover span {
      background: #eeeeee;
    }
  }
  .all-warp {
    margin-top: -1px;
    position: relative;
    z-index: 11;
    .select-warp {
      left: 0px;
      top: 0px;
      box-sizing: border-box;
      z-index: 10;
      border: {
        width: 1px;
        color: #cccccc;
        style: solid;
        radius: 0px 0px 5px 5px;
      }
      right: 0px;
      min-height: 200px;
      overflow: hidden;
      position: absolute;
      background: #fff;
      transform-origin: top center;
    }
    .select-not-data {
      position: relative;
      height: 200px;
      text-align: center;
      line-height: 200px;
      color: #999;
      font-size: 12px;
    }
    .list-warp {
      padding-top: 21px;
      min-height: 200px;
      max-height: 300px;
      overflow-y: auto;
      li {
        text-align: left;
        line-height: 30px;
        height: 30px;
        padding-left: 42px;
        margin-bottom: 10px;
        font-size: 14px;
        color: #5b5b5b;
        cursor: pointer;
        transition: all 0.5s;
        b {
          font-weight: bold;
        }
      }
      li.active {
        background: {
          color: #d6f0ed;
        }
        color: #5b5b5b;
      }
    }
    .enter-search-btn {
      display: block;
      height: 50px;
      outline: none;
      border: none;
      border-top: 1px solid #e2e2e2;
      background: #fff;
      width: 100%;
      color: #1fb19e;
      span {
        cursor: pointer;
      }
    }
  }
}
.slide-fade-enter-active {
  transition: all 0.3s;
}
.slide-fade-leave-active {
  transition: all 0.3s;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: scaleY(0);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.searchError {
  position: relative;
  display: none;
  width: 15px;
  height: 15px;
  bottom: 28px;
  left: 480px;
}
.searchError::before {
  color: #999;
  width: 15px;
  height: 15px;
  zoom: 1.5;
  cursor: pointer;
}
.search-input-warp:hover .searchError {
  display: block;
}
</style>


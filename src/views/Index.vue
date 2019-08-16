<template>
  <div style="height: 100%;">
    <transition mode="out-in" name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
export default {

};
</script>
<style>
.nav-ul_paddleft {
  padding-left: 36px;
}
.el-menu-item {
  padding: 0 10px;
  margin: 0 10px !important;
}
</style>

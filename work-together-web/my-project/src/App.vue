<template>
  <div id="app">
    <vue-progress-bar></vue-progress-bar>
      <router-view></router-view>
    <public-view></public-view>
  </div>
</template>
<script>
  import PublicView from "./components/PublicView.vue"
  export default{
    components: {
      PublicView,
    },
    data(){
      return {
        dialogTableVisible: true
      }
    }
  }

</script>

<style>
  .el-message-box{
    border: 1px solid #b8b8b8;
  }
  #app{
    min-width: 1000px;
  }
</style>

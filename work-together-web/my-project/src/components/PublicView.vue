<template>
  <div>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" v-model="preview.visible">
      <img :src="preview.url" alt="">
    </el-dialog>
  </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
  img {
    max-width: 100%;
  }
</style>
<style lang="less" rel="stylesheet/less">
  /*共有样式*/
  .extend-hover {
    position: relative;
    overflow: hidden;
    &:hover {
      overflow: visible;
    }
    div {
      position: absolute;
      min-width: 100%;
      min-height: 100%;
      top: 0;
      left: 0;
      &:hover {
        background-color: #eee;
        z-index: 1;
      }
      padding: 8px;
    }
  }

  .td-opeation {
    span {
      cursor: pointer;
      display: inline-block;
      padding: 3px 5px;
    }
  }

  .box-footer > .el-pagination {
    margin-top: 0;
  }

  .txt-highlight{
    color: #3bb4ef;
  }
</style>
<script>
  export default{
    name: "public-view",
    data(){
      return {
        preview: {
          visible: false,
          url: "",
        }
      }
    },
    mounted(){
      eventBus.$on("preview", (url) => {
        this.preview.visible = true
        this.preview.url = url
      })
    }
  }

</script>

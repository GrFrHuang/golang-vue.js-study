<template>
  <div v-loading="isLoading" class="express-box">
    <iframe :src="iframe"></iframe>
  </div>

</template>
<script type="text/ecmascript-6">
  export default{
    name: 'express',
    props: [
      'num', // 单号
      'com', // 来源公司代码
      'rand', // 改变此值用于刷新数据
    ],
    computed: {},
    data(){
      return {
        iframe: '',
        isLoading: false,
      }
    },
    methods: {
      load(){
        this.isLoading = true
        let url = "/expressManage/logistics/?" + util.buildGetParams({
            num: this.num,
            com: this.com,
          })
        this.$http.get(url).then(({data}) => {
          this.iframe = data
          setTimeout(() => {
            this.isLoading = false
          }, 400)
        })
      }

    },
    watch: {
      rand(){
        this.load()
      }
    },
    mounted(){
      this.load()
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .express-box {
    height: 350px;
    iframe {
      border: 0;
      width: 100%;
      height: 100%;
    }
  }


</style>

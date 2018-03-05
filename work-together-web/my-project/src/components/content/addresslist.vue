<template>
  <div>
    <section class="content-header">
      <h1>
        通讯录管理
        <small>查看公司通讯录</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>其他功能</li>
        <li>
          <i>通讯录管理</i>
        </li>
      </ol>
    </section>
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="公司列表" name="first">
        <Companylist ref="chilCompanylist"></Companylist>
      </el-tab-pane>
      <el-tab-pane label="发行商" name="third">
        <publisher ref="chilpublisher"></publisher>
      </el-tab-pane>
      <el-tab-pane label="渠道商" name="fourth">
        <ChannelBusiness ref="chilChannelBusiness"></ChannelBusiness>
      </el-tab-pane>
      <el-tab-pane label="研发商" name="second">
        <research ref="chilresearch"></research>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style scoped>
  .content-header{
    margin-bottom: 20px;
  }
</style>
<script>
  import Companylist from './addresslist/Companylist'
  import research from './addresslist/research'
  import publisher from './addresslist/publisher'
  import ChannelBusiness from './addresslist/ChannelBusiness'
  export default {
    components: {
      research,
      publisher,
      ChannelBusiness,
      Companylist
    },
    data() {
      return {
        activeName2: 'third'
      };
    },
    methods: {
      handleClick(tab, event) {
        if (this.activeName2 === 'first') {
          this.$refs.chilCompanylist.chilFn(this.activeName2)
        } else if (this.activeName2 === 'third') {
          this.$refs.chilpublisher.chilFn(this.activeName2)
        } else if (this.activeName2 === 'fourth') {
          this.$refs.chilChannelBusiness.chilFn(this.activeName2)
        } else if (this.activeName2 === 'second') {
          this.$refs.chilresearch.chilFn(this.activeName2)
        }
      },
      load () {
        if (this.$route.query.cp) {
          this.activeName2 = 'fourth'
        }
        if (this.$route.query.cps) {
          this.activeName2 = 'third'
        }
      }
    },
    mounted() {
      this.load()
    }
  };
</script>

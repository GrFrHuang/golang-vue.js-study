<template>
  <div>
    <section class="content-header">
      <h1>
        CP对账 (NEW)
        <small>查看CP对账单</small>
      </h1>
      <ol class="breadcrumb">
        <li>
          <i class="fa fa-dashboard"></i>
          CP结算流
        </li>
        <li>
          <router-link to="/home/mgt/mgtb">对账管理</router-link>
        </li>
      </ol>
    </section>
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="基础功能" name="first">
        <basicfunction></basicfunction>
      </el-tab-pane>
      <!--<el-tab-pane label="电子对账单" name="second">-->
        <!--<electronic></electronic>-->
      <!--</el-tab-pane>-->
    </el-tabs>
  </div>
</template>
<style scoped>
  .content-header{
    padding-bottom: 15px;
  }
</style>
<script>
  import basicfunction from './mgtbv3'
  import electronic from './mgtbv4'

  export default {
    components: {
      basicfunction,
      electronic,
    },
    data() {
      return {
        activeName2: 'first'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>

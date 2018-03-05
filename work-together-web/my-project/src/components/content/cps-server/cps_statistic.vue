<template>
  <div>
    <section class="content-header">
      <div style="float: left">
        <h1>
          数据统计
        </h1>
      </div>
      <div style="float: right;margin-right: 20%;font-size: 20px;color: black">
        <a href="https://web.umeng.com/main.php?c=site&a=getcode&siteid=1264553450" target="_blank">手游管理数据统计</a>
      </div>
    <div style="clear:both;height: 1px"></div>
    </section>
    <div class="content">
      <el-tabs v-model="tabName" type="card">
        <el-tab-pane label="总汇图表" name="first"></el-tab-pane>
        <el-tab-pane label="分级图表" name="second"></el-tab-pane>
        <el-tab-pane label="筛选图表" name="third"></el-tab-pane>
      </el-tabs>
      <cps-statistic-first  v-if="tabName == 'first'" ></cps-statistic-first>
      <cps-statistic-second v-if="tabName == 'second'" ></cps-statistic-second>
      <cps-statistic-third v-if="tabName == 'third'" ></cps-statistic-third>
    </div>
  </div>
</template>
<script>
  import CpsStatisticFirst from "./cps_statistic_first"
  import CpsStatisticSecond from "./cps_statistic_second"
  import CpsStatisticThird from "./cps_statistic_third"
  export default {
    components: {
      CpsStatisticFirst,
      CpsStatisticSecond,
      CpsStatisticThird,
    },
    data: function () {
      return {
        tabName: "first",
      }
    },
    mounted: function() {
    },
  }
</script>
<style>
  a{
    color: #000;
  }
  a:hover{text-decoration:underline;color: #20a0ff;}
  a:visited {color: #000}
</style>

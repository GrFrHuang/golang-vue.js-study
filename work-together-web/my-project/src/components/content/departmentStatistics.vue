<template>
  <div>
    <section class="content-header">
      <h1>
        部门统计
        <small>查看各部门统计情况</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>数据中心</li>
        <li>
          <i>部门统计</i>
        </li>
      </ol>
    </section>
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="结算部" name="Settlement">
        <Settlement ref="Settlement"></Settlement>
      </el-tab-pane>
      <el-tab-pane label="财务部" name="Finance">
        <Finance ref="Finance"></Finance>
      </el-tab-pane>
      <el-tab-pane label="渠道商务" name="channel">
        <channel ref="channel"></channel>
      </el-tab-pane>
      <el-tab-pane label="CP商务" name="CpBusiness">
        <CpBusiness ref="CpBusiness"></CpBusiness>
      </el-tab-pane>
      <el-tab-pane label="运营部" name="Operation">
        <Operation ref="Operation"></Operation>
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
  import Settlement from './departmentStatistics/Settlement'
  import Finance from './departmentStatistics/Finance'
  import channel from './departmentStatistics/channel'
  import CpBusiness from './departmentStatistics/CpBusiness'
  import Operation from './departmentStatistics/Operation'
  export default {
    components: {
      Settlement,
      Finance,
      channel,
      CpBusiness,
      Operation
    },
    data() {
      return {
        activeName2: 'Settlement'
      };
    },
    methods: {
      handleClick() {
        if (this.activeName2 === 'Settlement') {
          this.$refs.Settlement.chilFn(this.activeName2)
        } else if (this.activeName2 === 'Finance') {
          this.$refs.Finance.chilFn(this.activeName2)
        } else if (this.activeName2 === 'channel') {
          this.$refs.channel.chilFn(this.activeName2)
        } else if (this.activeName2 === 'CpBusiness') {
          this.$refs.CpBusiness.chilFn(this.activeName2)
        } else if (this.activeName2 === 'Operation') {
          this.$refs.Operation.chilFn(this.activeName2)
        }
      }
    }
  };
</script>

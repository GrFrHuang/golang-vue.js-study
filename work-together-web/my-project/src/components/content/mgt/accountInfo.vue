<template>
  <div>
    <p>开户全称：  <el-input style="width: 70%" v-model="info.account_name" placeholder="请输入内容"></el-input></p>
    <p>纳税人税号: <el-input style="width: 70%" v-model="info.taxpayer" placeholder="请输入内容"></el-input></p>
    <p>开票地址：  <el-input style="width: 70%" v-model="info.billing_address" placeholder="请输入内容"></el-input></p>
    <p>开票电话：  <el-input style="width: 70%" v-model="info.telephone" placeholder="请输入内容"></el-input></p>
    <p>开户银行：  <el-input style="width: 70%" v-model="info.bank" placeholder="请输入内容"></el-input></p>
    <p>开户账号：  <el-input style="width: 70%" v-model="info.account_number" placeholder="请输入内容"></el-input></p>
    <p>邮寄地址：  <el-input style="width: 70%" v-model="info.mailing_address" placeholder="请输入内容"></el-input></p>
  </div>
</template>
<script type="text/ecmascript-6">
  import util from '../../../publicjs/utils'

  export default {
    components: {
    },
    props: ["info"],
    data: function () {
      return {
      }
    },
    mounted: function () {
    },
    methods: {
    }
  }
</script>

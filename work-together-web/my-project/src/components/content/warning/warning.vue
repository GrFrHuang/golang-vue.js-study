<template>
  <el-table
    :data="tableData3"
    border
    style="width: 100%">
    <el-table-column label="预警列表">
      <el-table-column
        prop="date"
        label="时间"
        width="200"
        background="red">
      </el-table-column>
      <el-table-column
        prop="name"
        label="详情"
        width="500">
      </el-table-column>
      <el-table-column
        prop="province"
        label="预警名称"
        width="250">
      </el-table-column>
      <el-table-column
        prop="city"
        label="预警等级"
        width="200">
      </el-table-column>
    </el-table-column>
  </el-table>
</template>
<style>
  thead tr:nth-child(2) th{
    background: #fff!important;
    color: #1f2d3d!important;
  }
  thead tr:nth-child(2) th div{
    background: #fff!important;
    color: #1f2d3d!important;
  }
</style>
<script>
  export default {
    data() {
      return {
        tableData3: [{
          date: '2017-03-01  11:15:52',
          name: '大话西游热血版于2017-02-27完成游戏接入，将于2017-03-03首发。',
          province: '游戏接入',
          city: '蓝色',
        },{
          date: '2017-03-01  11:15:52',
          name: '大话西游热血版于2017-02-27完成游戏接入，将于2017-03-03首发。',
          province: '未对账',
          city: '橙色',
        },{
          date: '2017-03-01  11:15:52',
          name: '大话西游热血版于2017-02-27完成游戏接入，将于2017-03-03首发。',
          province: '总流水',
          city: '红色',
        },{
          date: '2017-03-01  11:15:52',
          name: '大话西游热血版于2017-02-27完成游戏接入，将于2017-03-03首发。',
          province: '游戏接入',
          city: '蓝色',
        },{
          date: '2017-03-01  11:15:52',
          name: '大话西游热血版于2017-02-27完成游戏接入，将于2017-03-03首发。',
          province: '游戏接入',
          city: '蓝色',
        },{
          date: '2017-03-01  11:15:52',
          name: '大话西游热血版于2017-02-27完成游戏接入，将于2017-03-03首发。',
          province: '游戏接入',
          city: '蓝色',
        }]
      }
    }
  }
</script>

<template>
  <el-card>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="选择日期">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择开始日期" v-model="params.start_time"
                          style="width: 100%;"></el-date-picker>
        </el-col>
        <span style="display: block; float: left"> - </span>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择结束日期" v-model="params.end_time"
                          style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <!--<el-button type="primary" @click="onSubmit">查询</el-button>-->
        <el-button type="primary" style="float: right" @click="Export()">导出excel</el-button>
      </el-form-item>
    </el-form>
    <br>
    <el-row :gutter="20" style="font-size: 30px">
      <el-col :span="8">
        <div class="grid-content"> 昨日总新增:&emsp;{{this.total.YdNum}}</div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">今日总新增:&emsp;{{this.total.TdNum}}</div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">全部总新增:&emsp;{{this.total.TotalNum}}</div>
      </el-col>
    </el-row>
    <br>
    <table class="table-2" width="100%" border="1" align="center" cellpadding="0" cellspacing="0"
           bordercolor="#eee">
      <tr style="height: 50px">
        <th width="16.6%" align="center">用户名称</th>
        <th width="16.6%" align="center">用户昵称</th>
        <th width="16.6%" align="center">昨日新增</th>
        <th width="16.6%" align="center">今日新增</th>
        <th width="16.6%" align="center">总新增</th>
        <th width="16.6%" align="center">邀请码</th>
      </tr>
    </table>
    <div id="page" style="overflow: hidden; height: 600px;">
      <div id="pageone">
        <table class="table-2" width="100%" border="1" cellpadding="0" cellspacing="0" bordercolor="#eee">
          <tr style="height: 30px" v-for="item in userList.Us">
            <td width="16.6%" align="center">{{item.name}}</td>
            <td width="16.6%" align="center">{{item.NickName}}</td>
            <td width="16.6%" align="center">{{item.LastNum}}</td>
            <td width="16.6%" align="center">{{item.TodayNum}}</td>
            <td width="16.6%" align="center">{{item.InviteNum}}</td>
            <td width="16.6%" align="center">{{item.InvitationCode}}</td>
          </tr>
        </table>
      </div>
      <div id="pagetow">
        <table class="table-2" width="100%" border="1" cellpadding="0" cellspacing="0" bordercolor="#eee">
          <tr v-if="userList.Us.length > 15" style="height: 30px" v-for="item in userList.Us">
            <td width="16.6%" align="center">{{item.name}}</td>
            <td width="16.6%" align="center">{{item.NickName}}</td>
            <td width="16.6%" align="center">{{item.LastNum}}</td>
            <td width="16.6%" align="center">{{item.TodayNum}}</td>
            <td width="16.6%" align="center">{{item.InviteNum}}</td>
            <td width="16.6%" align="center">{{item.InvitationCode}}</td>
          </tr>
        </table>
      </div>
    </div>
  </el-card>
</template>
<style scoped>
  th {
    text-align: center;
  }

  /* Border styles */
  .table-2 thead, .table-2 tr {
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: rgb(230, 189, 189);
  }

  .table-2 {
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgb(230, 189, 189);
  }

  /* Padding and font style */
  .table-2 td, .table-2 th {
    font-family: Verdana;
    color: rgb(177, 106, 104);
  }

  /* Alternating background colors */
  .table-2 tr:nth-child(even) {
    background: rgb(238, 211, 210)
  }

  .table-2 tr:nth-child(odd) {
    background: #FFF
  }
</style>
<script>
  export default {
    data() {
      return {
        total: '',
        params: {
          start_time: '',
          end_time: '',
        },
        userList: [],
        NickName: '',
        YdNum: '',
        TdNum: '',
        TotalNum: null,
        InvitationCode: '',
      }
    },
    mounted() {
      // this.load()
      this.loading()
      this.scroll()
    },
    methods: {
      // handleClick(tab, event) {
      //   this.load()
      // },
      Export() {
        if (this.params.start_time != '' && this.params.end_time != '') {
          window.open(ENV.SMALL_SHEEP_HOST_URL + '/Search/export_statistic_excel?start_time=' + this.params.start_time / 1000 + '&end_time=' + parseInt(new Date(new Date(this.params.end_time).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000))
        } else {
          this.$message.error('请选择导出时间')
        }
      },
      onSubmit() {
        var url = ENV.SMALL_SHEEP_HOST_URL + 'Search/statistics_company_staff'
        this.$http.get(url)
          .then(response => {
            this.userList = response.data
            this.total = response.data
          });
      },
      load() {
        var url = ENV.SMALL_SHEEP_HOST_URL + 'Search/statistics_company_staff'
        this.$http.get(url)
          .then(response => {
            this.userList = response.data
            this.total = response.data
          });
      },
      scroll(status) {
        var demo = document.getElementById("page")
        var demo1 = document.getElementById("pageone")
        var demo2 = document.getElementById("pagetow")
        var speed = 20;

//                demo2.innerHTML = demo1.innerHTML
        function Marquee() {
          if (demo2.offsetTop - demo.scrollTop <= 0) {
            demo.scrollTop -= demo1.offsetHeight;
          } else {
            demo.scrollTop++;
          }
        }

        var MyMar = setInterval(Marquee, speed);
        if (status === true) {
          clearInterval(MyMar)
          return false
        }
        demo.onmouseover = function () {
          clearInterval(MyMar);
        }

        demo.onmouseout = function () {
          MyMar = setInterval(Marquee, speed);
        }
      },
      loading() {
        setInterval(this.load(), 120000)
      },
    },
    // destroyed() {
    //   this.scroll()
    // }
  }
</script>

<template>
  <el-card>
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
        <th width="20%" align="center">用户昵称</th>
        <th width="20%" align="center">昨日新增</th>
        <th width="20%" align="center">今日新增</th>
        <th width="20%" align="center">总新增</th>
        <th width="20%" align="center">邀请码</th>
      </tr>
    </table>
    <div id="demo" style="overflow: hidden; height: 600px;">
      <div id="demo1">
        <table class="table-2" width="100%" border="1" cellpadding="0" cellspacing="0" bordercolor="#eee">
          <tr style="height: 30px" v-for="item in userList.Us">
            <td width="20%" align="center">{{item.NickName}}</td>
            <td width="20%" align="center">{{item.LastNum}}</td>
            <td width="20%" align="center">{{item.TodayNum}}</td>
            <td width="20%" align="center">{{item.InviteNum}}</td>
            <td width="20%" align="center">{{item.InvitationCode}}</td>
          </tr>
        </table>
      </div>
      <div id="demo2">
        <table class="table-2" width="100%" border="1" cellpadding="0" cellspacing="0" bordercolor="#eee">
          <tr v-if="userList.Us.length > 15" style="height: 30px" v-for="item in userList.Us">
            <td width="20%" align="center">{{item.NickName}}</td>
            <td width="20%" align="center">{{item.LastNum}}</td>
            <td width="20%" align="center">{{item.TodayNum}}</td>
            <td width="20%" align="center">{{item.InviteNum}}</td>
            <td width="20%" align="center">{{item.InvitationCode}}</td>
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
      load() {
        var url = ENV.SMALL_SHEEP_HOST_URL + '/Search/SearchUser/'
        this.$http.get(url)
          .then(response => {
            this.userList = response.data
            this.total = response.data
          });
      },
      scroll(status) {
        var demo = document.getElementById("demo")
        var demo1 = document.getElementById("demo1")
        var demo2 = document.getElementById("demo2")
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

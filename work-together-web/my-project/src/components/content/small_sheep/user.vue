<template>
  <div>
    <section class="content-header">
      <h1>
        用户
        <small>查看用户完成任务情况</small>
      </h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="总数据" name="first">
              <external ref="external"></external>
            </el-tab-pane>
            <el-tab-pane label="公司内部数据" name="second">
              <internal ref="internals"></internal>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  th {
    text-align: center;
  }
</style>
<script>
  import external from './external'
  import internal from './internal'

  export default {
    components: {
      external,
      internal
    },
    data() {
      return {
        activeName: 'first',
        externalsetInt: null,
        internalsetInt: null
      }
    },
    mounted() {
      this.externalsetInt = setInterval(this.$refs.external.load(), 120000)
    },
    methods: {
      handleClick(tab, event) {
        if (tab.name === 'second') {
          clearInterval(this.externalsetInt)
          clearInterval(this.internalsetInt)
          this.$refs.external.scroll(true)
          this.internalsetInt = setInterval(this.$refs.internals.load(), 120000)
        } else {
          clearInterval(this.internalsetInt)
          clearInterval(this.externalsetInt)
          this.$refs.internals.scroll(true)
          this.externalsetInt = setInterval(this.$refs.external.load(), 120000)
        }
      },
//       load() {
//         let url
//         if (this.activeName === 'second') {
//           url = ENV.SMALL_SHEEP_HOST_URL + 'Search/statistics_company_staff'
//         } else if (this.activeName === 'first') {
//           url = ENV.SMALL_SHEEP_HOST_URL + '/Search/SearchUser/'
//         }
//         this.$http.get(url)
//           .then(response => {
//             this.userList = response.data
//             // let Info = response.data;
//             this.total = response.data
//             this.scroll(1)
//             // var baseInfo = Info.Us
//             // var user = [];
//             // for (var i = 0; i < baseInfo.length; i++) {
//             //   let info = {
//             //     NickName: baseInfo[i].NickName,
//             //     YdNum: baseInfo[i].LastNum,
//             //     TdNum: baseInfo[i].TodayNum,
//             //     TotalNum: baseInfo[i].InviteNum,
//             //     InvitationCode: baseInfo[i].InvitationCode,
//             //   }
//             //   user.push(info)
//             // }
//             // this.userList = user
//           });
//       },
//       scroll(status) {
//         var demo = document.getElementById("demo")
//         var demo1 = document.getElementById("demo1")
//         var demo2 = document.getElementById("demo2")
//         var speed = 20;
//         if (status === 1) {
//           console.log(demo.scrollTop)
//           // demo.scrollTop = 0
//         }
// //                demo2.innerHTML = demo1.innerHTML
//         function Marquee() {
//           if (demo2.offsetTop - demo.scrollTop <= 0) {
//             console.log(demo.scrollTop)
//             demo.scrollTop -= demo1.offsetHeight;
//           } else {
//             demo.scrollTop++;
//           }
//         }
//
//         var MyMar = setInterval(Marquee, speed);
//         if (status === true) {
//           clearInterval(MyMar)
//           return false
//         }
//         demo.onmouseover = function () {
//           clearInterval(MyMar);
//         }
//
//         demo.onmouseout = function () {
//           MyMar = setInterval(Marquee, speed);
//         }
//       },
//       loading() {
//         setInterval(this.load(), 120000)
//       },
    },
    destroyed() {
      // this.scroll(true)
    }
  }
</script>

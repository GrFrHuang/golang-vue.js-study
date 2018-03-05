<template>
  <div>
    <div v-if="ontimes===false" class="imgurl">
      <img style="vertical-align:middle;" width="100%"
           :src="'http://pan.baidu.com/share/qrcode?w=550&h=550&url=' + imgurl">
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <b>距离早会签到结束时间还有</b>
      </div>
      <div style="padding-top: 15px" v-if="ontimes === true">
        签到已结束
      </div>
      <div class="panel-body text-danger">
        <count-down :start-time="startTime" :end-time="endTime" v-on:start_callback="countDownS_cb(3)"
                    v-on:end_callback="countDownE_cb(1)"
                    :dayTxt="'天'" :hourTxt="'小时'" :minutesTxt="'分钟'" :secondsTxt="'秒'"
                    :tip-text="'自定义开始文字'" :tip-text-end="'自定义结束文字'" :end-text="'结束啦～'"></count-down>
      </div>
    </div>
    <div class="signs">
      <div class="panel-heading">
        <b style="font-size: 20px">早会签到名单</b>
      </div>
      <div>
        <el-tag v-for="item in names" type="success">{{ item.name }}</el-tag>
      </div>
    </div>
  </div>
</template>

<script>
  import util from '../../../publicjs/utils'
  import CountDown from 'vue2-countdown'

  export default {
    components: {
      CountDown
    },
    data: function () {
      return {
        imgurl: '',
        names: [],
        t1: null,
        ontimes: false,
        startTime: (new Date()).getTime(),
        endTime: (new Date()).getTime() + 600000
      }
    },

    methods: {
      load() {
        var url = '/face/qrcode?tag=1'
        this.$http.get(url)
          .then((res) => {
            this.imgurl = res.body.toString()
          })
      },
      signTo() {
        let that = this
        if (this.ontimes == false) {
          that.t1 = setInterval(function () {
            var date = new Date();
            var mon = date.getMonth() + 1;
            var day = date.getDate();
            var nowDay = date.getFullYear() + "-" + (mon < 10 ? "0" + mon : mon) + "-" + (day < 10 ? "0" + day : day);
            let que = {
              tag: 1,
              date: nowDay
            }
            let query = util.onBuildGetParams(que)
            var url = '/sign/?query=' + query
            that.$http.get(url)
              .then((res) => {
                that.names = res.body.data
              })
          }, 2000)
        } else {
          clearInterval(that.t1)
        }
      },
      countDownS_cb: function (x) {
      },
      countDownE_cb: function (x) {
        this.ontimes = true
        this.signTo()
      }
    },
    mounted: function () {
      this.load()
      this.signTo()
    },
    destroyed () {
      this.ontimes = true
      this.signTo()
    }
  }
</script>

<style scoped>
  .imgurl {
    width: 40vw;
    text-align: center;
    margin-left: 2vw;
    padding-top: 5vh;
  }

  .panel-default {
    position: absolute;
    top: 12vh;
    left: 50vw;
    width: 20vw;
    text-align: center;
  }

  .signs {
    border: 2px solid #adadad;
    position: absolute;
    top: 30vh;
    left: 50vw;
    padding: 1vh 0;
    margin-right: 4vw;
  }

  .el-tag--success {
    margin-top: 1vh;
  }
</style>

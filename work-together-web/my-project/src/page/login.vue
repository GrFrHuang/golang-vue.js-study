<template class="hold-transition login-page" lang="html">
  <div id="login-page" @keyup.enter="login" :class="{ 'login-hide' : hided }">
    <div class="body"></div>
    <div class="form-warp">
      <div class="login-form">
        <div class="mini" @click="mini"></div>

        <div class="title"><img src="../../static/dist/img/lg.png" alt=""></div>
        <div class="login_logo row">
          <img class="col-xs-offset-1 col-xs-5" src="../../static/dist/img/kf_logo.png" alt="">
          <img class="col-xs-5" src="../../static/dist/img/yl_logo.png" alt="">
        </div>
        <div v-if="userlogin === false" style="width: 100%;text-align: center">
          <img style="vertical-align:middle;" width="200vw"
             :src="'http://pan.baidu.com/share/qrcode?w=550&h=550&url=' + imgurl">
          <p><a style="cursor:pointer" @click="onlogins(2)">使用账号登录</a></p>
          <p>如还未下载APP请先下载APP</p>
          <div>
            <el-button style="width: 45%" @click.native="downloadApp(4)" id="el_btn" type="primary" :loading="isBtnLoading">IOS端下载</el-button>
            <el-button style="width: 45%" @click.native="downloadApp(3)" id="el_btn" type="primary" :loading="isBtnLoading">安卓下载</el-button>
          </div>

        </div>
        <div v-if="userlogin === true" style="width: 80%">
        <div class="input-group">
          <!--<div class="title">work together</div>-->
          <el-input
            :autofocus="true"
            placeholder="请输入用户名"
            icon="message"
            type="email"
            v-model="credentials.email">
          </el-input>
        </div>

        <div class="input-group">
          <el-input
            placeholder="请输入密码"
            type="password"
            icon="information"
            v-model="credentials.password">
          </el-input>
        </div>

        <div class="input-group">
          <label>记住账号？</label>
          <el-switch
            v-model="checkRember"
            on-color="#1D8CE0"
            off-color="#8492A6">
          </el-switch>
        </div>

        <div class="input-group">
          <el-button @click.native="login" id="el_btn" type="primary" :loading="isBtnLoading">{{btnText}}</el-button>
        </div>
          <p style="text-align: right;padding:15px 0 "><a style="cursor:pointer" @click="onlogins(1)">使用二维码登录</a></p>
        </div>
      </div>
    </div>
    <el-dialog
      title="下载APP二维码"
      :visible.sync="ondownloadApp"
      style="text-align: center"
      class="downloadApp"
      size="tiny">
      <img style="vertical-align:middle;" width="80%"
           :src="'http://pan.baidu.com/share/qrcode?w=550&h=550&url=' + downloadAppurl">
      <p style="text-align: center">请使用浏览器扫码下载APP</p>
      <span slot="footer" class="dialog-footer">
    <el-button @click="ondownloadApp = false">关 闭</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<style>
  .downloadApp>.el-dialog--tiny{
    min-width: 300px;
  }
</style>
<style rel="stylesheet/less" lang="less" scoped>
  #login-page {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #efeeee;
    &.login-hide {
      .form-warp {
        margin-left: 480px;
        margin-bottom: 380px;
        width: 30px;
        height: 30px;
        opacity: 0.9;
        transition: 0.5s cubic-bezier(.84, .11, 0, 1.1);
        border-radius: 15px;
      }
      .body {

        -webkit-filter: blur(0px);
      }
      .login-form {
        .mini {
          right: -4px;
          top: -2px;
          transition: 0.5s cubic-bezier(.63, .18, .14, .87);
          &:after {
            transition: 0.5s cubic-bezier(.63, .18, .14, .87);
            transform: rotate(90deg);
          }
        }
      }
    }

  }
  .login_logo{
      margin-bottom: 20px;
  }
  .form-warp {
    width: 32%;
    min-width: 300px;
    height: 570px;
    border-radius: 10px;
    background: white;
    border: 1px #eaeaea solid;
    position: relative;
    z-index: 1;
    transition: 0.5s cubic-bezier(.84, .11, 0, 1.2);
    overflow: hidden;
  }

  .login-form {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 570px;
    align-items: center;
    flex-direction: column;

    .mini {
      position: absolute;
      top: 0;
      right: 0;
      width: 30px;
      height: 30px;
      cursor: pointer;
      transition: 0.5s cubic-bezier(.63, .18, .14, .87);

      &:after {
        position: absolute;
        bottom: 12px;
        right: 12px;
        content: " ";
        display: inline-block;
        width: 12px;
        height: 3px;
        background-color: #20a0ff;
        transition: 0.5s cubic-bezier(.63, .18, .14, .87);
      }
      &:before {
        position: absolute;
        bottom: 12px;
        right: 12px;
        content: " ";
        display: inline-block;
        width: 12px;
        height: 3px;
        background-color: #20a0ff;
      }
    }
  }

  .title {
    margin-top: 40px;
  }

  .title img {
    width: 100%;
  }
  /*.title {*/
    /*color: #20a0ff;*/
    /*font-weight: bold;*/
    /*font-size: 60px;*/
    /*text-align: center;*/
    /*line-height: 1.2;*/
    /*font-family:"hyxxk";*/
  /*}*/
  /*@font-face {*/
    /*font-family: 'hyxxk';*/
    /*src: url('http://cdngame.kuaifazs.com/hyxxk.ttf');*/
  /*}*/
  .input-group {
    margin-top: 30px;
    width: 100%;
  }

  #el_btn {
    width: 100%;
  }

  .body {
    position: absolute;
    top: -20px;
    left: -20px;
    right: -40px;
    bottom: -40px;
    width: auto;
    height: auto;
    background: url("../../static/dist/img/banner.jpg");
    background-size: cover;
    -webkit-filter: blur(30px);
    z-index: 0;
  }

  .grad {
    position: absolute;
    top: -20px;
    left: -20px;
    right: -40px;
    bottom: -40px;
    width: auto;
    height: auto;
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(0, 0, 0, 0)), color-stop(100%, rgba(0, 0, 0, 0.35))); /* Chrome,Safari4+ */
    z-index: -1;
    opacity: 0.3;
  }
</style>
<script type="text/javascript">
  import {mapState} from 'vuex'
  import {Validator} from 'vee-validate'
  const validator = new Validator({
    email: 'required|email',
    password: 'alpha_dash|min:6|max:20',
  });
  export default {
    data() {
      return {
        value2: true
      }
    },
    data: function () {
      return {
        credentials: {
          email: '',
          password: ''
        },
        checkRember: false,
        userlogin: false,
        ontimes: false,
        isBtnLoading: false,
        error: '',
        hided: false,
        ondownloadApp: false,
        imgurl: '',
        downloadAppurl: ''
      }
    },
    computed: {
      btnText() {
        if (this.isBtnLoading) return '登 录 中...';
        return '登 录';
      }
    },
    methods: {
      downloadApp(v) {
        this.ondownloadApp = true
        if (v === 3) {
          this.downloadAppurl = 'http://kfzs.com/3'
        } else {
          this.downloadAppurl = 'http://kfzs.com/4'
        }
      },
      login () {
        if (!validator.validate('email', this.credentials.email) || !validator.validate('password', this.credentials.password)) {
          this.$message({
            message: "输入格式有误",
            type: 'warning'
          });
          return
        }
        var url = '/session/'
        var data = JSON.stringify(this.credentials)
        this.$http.post(url, data)
          .then((res) => {
            if (this.checkRember) {
              window.localStorage.setItem('worktoge-email', this.credentials.email)
            } else {
              window.localStorage.removeItem('worktoge-email')
            }
            sessionStorage.setItem('token', res.data.token)
            this.getUserinfo()
          })
      },
      getUserinfo(){
        var url = '/userown/'
        this.$http.get(url).then((res) => {
          this.$store.commit('SET_BASEINFO', res.data)
          window.localStorage.setItem('cnodeBaseInfo', JSON.stringify(res.data))
          this.$router.push({path: '/home/welcome'})
        })
      },
      mini(){
        this.hided = !this.hided
      },
      oninit () {
        var url = '/face/qrcode?tag=2'
        this.$http.get(url)
          .then((r) => {
          console.log(r.data)
          this.imgurl = r.data
          })
      },
      isJSON_test(str) {
        console.log(str.toString().substring(0,1))
          if(str.toString().substring(0,1) == "["){
            return true
          } else {
            return false
          }
      },
      signTo() {
        let that = this
        if (this.ontimes == false) {
          that.t1 = setInterval(function () {
            var url = '/session/code_login?code=' + that.imgurl
            that.$http.post(url)
              .then((res) => {
              // console.log(that.isJSON_test(res.data))
            if (that.isJSON_test(res.data) == true) {
                  if (this.checkRember) {
                      window.localStorage.setItem('worktoge-email', this.credentials.email)
                    } else {
                      window.localStorage.removeItem('worktoge-email')
                    }
                    sessionStorage.setItem('token', res.data.token)
                    that.getUserinfo()
                    that.ontimes = true
            }
              })
          }, 3000)
        } else {
          clearInterval(that.t1)
        }
      },
      onlogins (v) {
        if (v=== 2) {
          this.ontimes = true
          this.signTo()
          this.userlogin = true
        } else {
          this.ontimes = false
          this.oninit()
          this.signTo()
          this.userlogin = false
        }
      }
    },
    mounted: function () {
      sessionStorage.removeItem('token')
      window.localStorage.removeItem('cnodeBaseInfo')
      let eamil = window.localStorage.getItem('worktoge-email')
      if (eamil != null) {
        this.credentials.email = eamil
        this.checkRember = true
      }
      this.oninit()
      this.signTo()
    },
    destroyed () {
      this.ontimes = true
      this.signTo()
    }
  }
</script>

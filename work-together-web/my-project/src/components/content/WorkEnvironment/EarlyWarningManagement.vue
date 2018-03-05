<template>
  <div>
    <section class="content-header">
      <h1>
        预警管理
        <small>查看预警状态</small>
      </h1>
    </section>
    <div class="content">
      <div class="box" v-loading="isLoading">
        <div class="box-body">
          <el-row :gutter="20">
            <el-col :span="4" v-for="(o, index) in userList" :key="o.Id" style="margin-bottom: 15px">
              <el-card :body-style="{ padding: '5px' }">
                <img @click="Imageurls(o.Imageurl)" style="width: 90%;margin: auto;display: block;height: 100px"
                     :src="o.Imageurl">
                <div>
                  <p style="text-align: center;padding-top: 10px">{{ o.NickName }}</p>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <!-- /.box-body -->
        <audio style="visibility: hidden" @ended="myVoicePath()" ref="VoiceUrl" autoplay="autopiay" controls="controls"
               :src="VoicePath[0]">
        </audio>
      </div>
    </div>
    <el-dialog
      title="查看图片"
      :visible.sync="is_Imageurls"
      width="80%">
      <img width="100%" :src="on_Imageurls" alt="">
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">关  闭</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<style scoped>

</style>
<script type="text/ecmascript-6">
  export default {
    data: function () {
      return {
        isLoading: false,
        is_Imageurls: false,
        ontimes: false,
        userList: null,
        on_Imageurls: null,
        VoicePath: [],
        t1: null,
        total: ''
      }
    },
    mounted: function () {
      this.isLoading = true
      this.$http.get('/desktop_screen_log')
        .then(response => {
          this.userList = response.data
          for (let i in response.data) {
            this.VoicePath.push(response.data[i].VoicePath)
          }
          this.load()
          this.isLoading = false
        });
    },
    methods: {
      Imageurls(c) {
        this.is_Imageurls = true
        this.on_Imageurls = c
      },
      myVoicePath() {
        let s = 1
        for (let i in this.VoicePath) {
          if (this.$refs.VoiceUrl.src == encodeURI(this.VoicePath[i])) {
            s = parseInt(s) + parseInt(i)
          }
        }
        if (s > this.VoicePath.length) {
          this.$refs.VoiceUrl.src = ''
        } else {
          this.$refs.VoiceUrl.src = encodeURI(this.VoicePath[s])
          this.$refs.VoiceUrl.play()
        }
      },
      load() {
        this.isLoading = true
        if (this.ontimes == false) {
          this.t1 = setInterval(() => {
            this.$http.get('/desktop_screen_log')
              .then(response => {
                this.userList = response.data
                for (let i in response.data) {
                  this.VoicePath.push(response.data[i].VoicePath)
                }
                this.isLoading = false
              });
          }, 180000)
        } else {
          clearInterval(this.t1)
        }
      }
    },
    destroyed() {
      this.ontimes = true
      this.load()
    }
  }
</script>

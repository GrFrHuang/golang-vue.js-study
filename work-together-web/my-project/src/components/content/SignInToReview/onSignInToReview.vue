<template>
  <div>
    <div style="margin-left: 30px;padding-top: 15px">
      <label>早会签到日期选择：</label>
      <el-date-picker
      v-model="currentDate"
      type="date"
      placeholder="选择日期"
      @change="signTo()"
      :picker-options="currentDate0">
    </el-date-picker>
    </div>
    <el-row style="margin-right: 4vw">
      <el-col style="margin-top: 2vh" :span="3" v-for="(o, index) in names" :key="index" :offset="index > 0 ? 1 : 1">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="o.path" class="image">
          <div style="padding: 14px;">
            <span>{{ o.name }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ o.sign_time }}</time>
            </div>
            <div v-if="o.status !== 2">
              已审核
              <span v-if="o.status === 1">（通过）</span>
              <span v-if="o.status === 3">（不通过）</span>
            </div>
            <div v-if="o.status !== 1 && o.status !== 3" class="bottom clearfix">
              <el-button style="margin-left: 15px" type="text" @click="onsputSignTo(o)" class="button">不通过</el-button>
              <el-button type="text" @click="putSignTo(o, 2)" class="button">通过</el-button>
            </div>
            <div v-if="o.status === 3" class="bottom clearfix">
              <el-button type="text" @click="putSignTo(o, 2)" class="button">通过</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="请填写备注"
      size="tiny"
      :visible.sync="onputSignTo">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入备注内容"
        v-model="code.code">
      </el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="onputSignTo = false">取 消</el-button>
    <el-button type="primary" @click="putSignTo(code, 1)">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        currentDate: new Date(),
        names: [],
        code: '',
        picUrl: '',
        onputSignTo: false,
        PERSONNEL_HOST_URL: ENV.PERSONNEL_HOST_URL,
        currentDate0: {
        }
      };
    },
    methods: {
      onsputSignTo(v) {
        this.onputSignTo = true
        this.code = v
      },
      signTo() {
        var date = this.currentDate;
        var mon = date.getMonth() + 1;
        var day = date.getDate();
        var nowDay = date.getFullYear() + "-" + (mon < 10 ? "0" + mon : mon) + "-" + (day < 10 ? "0" + day : day);
        let que = {
          tag: 1,
          date: nowDay
        }
        let query = util.onBuildGetParams(que)
        console.log(query)
        var url = '/sign/?query=' + query
        this.$http.get(url)
          .then((res) => {
            this.names = res.body.data
            for (let i in this.names) {
              this.picUrl = util.buildFileUrl(this.names[i].path)
              this.names[i].path = this.picUrl
            }
          })
      },
      putSignTo(v, status) {
        let put = {}
        if (status == 1) {
          v.status = 3
          this.onputSignTo = false
          put = {
            'status': v.status,
            'remarks': v.code
          }
        } else if (status == 2) {
          v.status = 1
          put = {
            'status': v.status,
          }
        }
        let query = util.buildGetParams(put)
        var url = '/sign/' + v.uid + '?' + query
        this.$http.put(url)
          .then((res) => {
            this.signTo()
          })
      }
    },
    mounted: function () {
      this.signTo()
    }
  }
</script>

<style scoped>
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>

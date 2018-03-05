<template>
  <div>
    <div class="box-header with-border">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="QQ号">
          <el-input @change="filterChange" v-model="params.player_id" placeholder="请输入QQ号"></el-input>
        </el-form-item>
        <el-form-item label="充值时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择开始日期" @change="startTimeChange" v-model="start_time"
                            style="width: 100%;"></el-date-picker>
          </el-col>
          <span style="display: block; float: left"> - </span>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择结束日期" @change="endTimeChange" v-model="end_time"
                            style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="充值会长">
          <el-select @change="filterChange" v-model="params.user_id" clearable filterable remote
                     :remote-method="relatedSearch" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in relatedUser.data"
                       :key="item.UserId"
                       :label="item.UserName"
                       :value="item.UserId"></el-option>
            <el-pagination v-if="relatedUser.total > relatedUser.perPage "
                           small layout="prev, pager, next"
                           :page-size="relatedUser.perPage"
                           :total="relatedUser.total"
                           :current-page.sync="relatedUser.page"
                           @current-change="relatedPageChange">
            </el-pagination>
          </el-select>
        </el-form-item>
        <el-form-item label="充值状态">
          <el-select @change="filterChange" v-model="params.status" clearable filterable remote
                     :remote-method="relatedSearch" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in onstatus"
                       :key="item.uid"
                       :label="item.name"
                       :value="item.uid"></el-option>
          </el-select>
        </el-form-item>
        <button class="btn btn-primary" @click="getChannelLog(1)">导出</button>
        <p>汇总：总充值Q币：{{ sum }}</p>
      </el-form>
    </div>
    <div class="box-body">
      <table class="table table-bordered table-hover">
        <thead>
        <tr>
          <th>QQ</th>
          <th>充值Q币</th>
          <th>折扣</th>
          <th>实付云点</th>
          <th>订单号</th>
          <th>充值时间</th>
          <th>充值会长</th>
          <th>充值状态</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in channelLog.data">
          <td>{{ item.Qq }} </td>
          <td>{{ item.Amount }}</td>
          <td>{{ item.Discount }}折</td>
          <td>{{ item.RealAmount }}</td>
          <td>{{ item.OrderNo }}</td>
          <td>{{ item.CreateTime | stampToTimeFull}}</td>
          <td>{{ item.UserName}}</td>
          <td>
            <p v-if="item.Status === 0 ||item.Status === 1 || item.Status === 2 || item.Status === 3 || item.Status === 5">支付中</p>
            <p v-if="item.Status === 6">支付成功</p>
            <p v-if="item.Status === 4 || item.Status === 7">支付失败</p>
          </td>
        </tr>
        </tbody>
      </table>
      <el-pagination
        v-show="channelLog.total > channelLog.per_page"
        @current-change="onCurrentChange"
        :current-page.sync="channelLog.page"
        :page-size="channelLog.per_page"
        :total="channelLog.total"
        layout="prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        userList: {
          data: [],
          total: 0,
          page: 1,
          perPage: 20,
          game_name: '',
          query: ""
        },
        onstatus: [
          {
            id: [0,1,2,3,5],
            uid: 0,
            name: '支付中'
          }, {
            id: [6],
            uid: 1,
            name: '支付成功'
          }, {
            id: [4,7],
            uid: 2,
            name: '支付失败'
          },
        ],
        player: {
          key: "",
          searchUserList:[],
          total: 0,
          per_page: 20,
          page: 1,
        },
        relatedUser: {
          data: [],
          total: 0,
          page: 1,
          perPage: 20,
          query: ""
        },
        token: "",
        sum: "",
        channelLog: {
          data: [],
          per_page: 20,
          page: 1,
          total: 0,
        },
        start_time: "",
        end_time: "",
        params: {
          token: "",
          page: 1,
          per_page: 20,
          player_id: '',
          start_time: '',
          end_time: '',
          game_id: '',
          user_id: '',
          status: '',
        }
      }
    },
    methods: {
      filterChange() {
        this.channelLog.page = 1
        this.params.page = 1
        this.getChannelLog(0)
      },
      startTimeChange(time) {
          if (time != undefined) {
              this.params.start_time = Date.parse(new Date(time)) / 1000
          } else {
              this.params.start_time = ""
          }
          this.getChannelLog(0)
      },
      endTimeChange(time) {
          if (time != undefined) {
              this.params.end_time = Date.parse(new Date(time)) / 1000
          } else {
              this.params.end_time = ""
          }
        this.getChannelLog(0)
      },
      selectPlayer() {
        this.getChannelLog(0)
      },
      playerCurrentChange() {
        this.getSelectPlayerList()
      },
      getSelectPlayerList() {
        this.player.searchUserList = []
        this.player.total = 0
        this.$http.get(ENV.CPS_HOST_URL + '/player/search_for_work', {
          params:{token: this.token, key_word: this.player.key, page: this.player.page, per_page: this.player.per_page}
        }).then(response => {
          this.player.total = response.body.total
          let data = response.body.data
          if (this.player.total == 0 || data == null) {
            return
          }
          for (let i = 0; i < data.length; i++) {
            if (data[i].mobile != "") {
              data[i].game_id += " ("+ data[i].mobile +")"
            }
            this.player.searchUserList.push(data[i])
          }
        }, error => {
          this.$message.error(error.body)
        })
      },
      searchPlayer(key) {
        if (key == "") {
          return
        }
        this.player.key = key
        this.page = 1
        this.total = 0
        this.getSelectPlayerList()
      },
      userSearch(query) {
        this.userList.game_name = query
        this.userList.page = 1
        if (query == "全部") {
          this.userList.query = ""
        }
        this.getUserSelectList()
      },
      relatedSearch(query) {
        this.relatedUser.page = 1
        if (query == "全部") {
          this.relatedUser.query = ""
        }
        this.getRelatedUserList()
      },
      userPageChange() {
        this.getUserSelectList()
      },
      relatedPageChange() {
        this.getRelatedUserList()
      },
      onCurrentChange(page) {
        this.params.page = page
        this.getChannelLog(0)
      },
      getRelatedUserList() {
        this.relatedUser.data = []
        this.relatedUser.total = 0
        this.$http.get(ENV.CPS_HOST_URL + "/user/get_users_for_w_select", {
          params: {
            token: this.token,
            page: this.relatedUser.page,
            per_page: this.relatedUser.perPage,
            level: "1,2",
            key: this.relatedUser.query
          }
        }).then((response) => {
          if (response.body.total > 0) {
            this.relatedUser.data = response.body.data
          }
          this.relatedUser.total = response.body.total
        }, error => {
          this.$message.error(error.body)
        })
      },
      tabChange() {
        this.getChannelLog(0)
      },
      getChannelLog(active) {
        if (active == undefined) {
          active = 0
        }
        this.channelLog.data = []
        this.total = 0
        this.params.active = 1
        let gameIds = []
        if (this.params.status !== '') {
          for (let i in this.onstatus) {
            if (this.params.status === this.onstatus[i].uid) {
              gameIds.push(this.onstatus[i].id)
            }
          }
        }
        let onparams = []
        if (gameIds.length !== 0) {
          onparams.push("in" + gameIds.join(","))
        }

        let user_id = []
        if (this.params.user_id !== '') {
          user_id.push("=" + this.params.user_id)
        }
        let create_time = []
        if (this.params.start_time !== '') {
          create_time.push(">=" + this.params.start_time)
        }
        let que = {
          "qq": this.params.player_id,
          "create_time": create_time,
          "status": onparams,
          "user_id": user_id,
        }
        let query = util.onBuildGetParams(que)
        let end = {
          limit: this.params.per_page,
          offset: (this.params.page - 1) * this.params.per_page,
          token: this.token,
          end_time: this.params.end_time,
          order: '-create_time'
        }
        if (active === 1) {
          if (this.params.start_time !== '' && this.params.end_time !== '') {
            window.open(ENV.CPS_HOST_URL + '/qq_recharge/qq_recharge_log_excel?query=' + query +
              '&token=' + this.token + "&end_time=" + this.params.end_time + "&order=-create_time")
          } else {
            this.$message.error('导出数据请选择导出日期段')
          }
        } else {
          this.$http.get(ENV.CPS_HOST_URL + "/qq_recharge/qq_recharge_log?query=" + query, {params: end})
            .then(response => {
              this.channelLog.total = response.body.total
              this.sum = response.body.sum[0]['SUM(amount)']
              if (response.body.total != 0) {
                this.channelLog.data = response.body.data
              }
            }, (error) => {
              if (error.status === 403) {
                this.$router.push({path: '/login'})
              } else {
                this.$message.error(error.body)
              }
            })
        }
      }
    },
    mounted: function () {
      this.token = sessionStorage.getItem("token")
      this.params.token = this.token
      this.getChannelLog(0)
      this.getRelatedUserList()
    }
  }
</script>

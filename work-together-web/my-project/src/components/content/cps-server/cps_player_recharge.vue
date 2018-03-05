<template>
  <div>
    <div class="box-header with-border">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="用户名/手机">
          <el-select
            clearable
            filterable
            remote
            v-model="params.player_id"
            :remote-method="searchPlayer"
            placeholder="请输入用户名或手机号"
            @change="selectPlayer">
            <el-option
              v-for="userItem in player.searchUserList"
              :key="userItem.user_id"
              :label="userItem.user_name"
              :value="userItem.user_id.toString()">
            </el-option>
            <el-pagination v-if="player.total > player.per_page"
                           small layout="prev, pager, next"
                           :page-size="player.per_page"
                           :total="player.total"
                           :current-page.sync="player.page"
                           @current-change="playerCurrentChange">
            </el-pagination>
          </el-select>
        </el-form-item>
        <el-form-item label="游戏名称">
          <el-select @change="filterChange" v-model="params.game_id" clearable filterable remote
                     :remote-method="userSearch" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in userList.data"
                       :key="index"
                       :label="item.name"
                       :value="item.id"></el-option>
            <el-pagination v-if="userList.total > userList.perPage "
                           small layout="prev, pager, next"
                           :page-size="userList.perPage"
                           :total="userList.total"
                           :current-page.sync="userList.page"
                           @current-change="userPageChange">
            </el-pagination>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
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
        <el-form-item label="充值渠道">
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
        <button class="btn btn-primary" @click="exportLog">导出</button>
        <p>汇总：总充值金额：{{ sum }}</p>
      </el-form>
    </div>
    <div class="box-body">
      <el-tabs v-model="activeName" type="card" @tab-click="tabChange">
        <el-tab-pane label="CPSA" name="CPSA"></el-tab-pane>
        <el-tab-pane label="CPSG" name="CPSG"></el-tab-pane>
      </el-tabs>
      <table class="table table-bordered table-hover">
        <thead>
        <tr>
          <th>用户名/手机</th>
          <th>游戏名称</th>
          <th>游戏折扣</th>
          <th>充值虚拟币</th>
          <th>充值渠道（渠道名称）</th>
          <th>充值时间</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in channelLog.data">
          <td v-if="item.mobile !== ''">{{ item.user_name }} / {{ item.mobile }} </td>
          <td v-if="item.mobile === ''">{{ item.user_name }}</td>
          <td>{{ item.game_name }}</td>
          <td>{{ item.discount }}%</td>
          <td>{{ item.yaobi }}</td>
          <td>{{ item.channel_name }}</td>
          <td>{{ item.create_time | stampToTimeFull}}</td>
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
        activeName: "CPSA",
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
        }
      }
    },
    methods: {
      exportLog() {
        let from = this.activeName === "CPSA" ? 1 : 2
        if (this.params.start_time !== '' && this.params.end_time !== '') {
          window.open(ENV.CPS_HOST_URL + '/details/player_recharge_log_for_work' + '?token=' + this.token +
            '&start_time=' + this.params.start_time + '&end_time=' + this.params.end_time + "&game_id=" + this.params.game_id +
            '&user_id=' + this.params.user_id + '&player_id=' + this.params.player_id + '&cps_type=' + from + "&active=2")
        } else {
          this.$message.error('导出数据请选择导出日期段')
        }
      },
      filterChange() {
        this.channelLog.page = 1
        this.params.page = 1
        this.getChannelLog()
      },
      startTimeChange(time) {
          if (time != undefined) {
              this.params.start_time = Date.parse(new Date(time)) / 1000
          } else {
              this.params.start_time = ""
          }
          this.getChannelLog()
      },
      endTimeChange(time) {
          if (time != undefined) {
              this.params.end_time = parseInt(new Date(new Date(time).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000)
          } else {
              this.params.end_time = ""
          }
        this.getChannelLog()
      },
      selectPlayer() {
        this.getChannelLog()
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
        this.getChannelLog()
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
      getUserSelectList() {
        this.userList.data = []
        this.userList.total = 0
        this.$http.get(ENV.CPS_HOST_URL + "/game/game_select_list", {
        params: {
            token: this.token,
            start_time: this.token,
            page: this.userList.page,
            per_page: this.userList.perPage,
            game_name: this.userList.game_name
          }
        }).then((response) => {
          if (response.body.total > 0) {
            this.userList.data = response.body.data
          }
          this.userList.total = response.body.total
        }, error => {
          this.$message.error(error.body)
        })
      },
      tabChange() {
        this.getChannelLog()
      },
      getChannelLog() {
        let from = this.activeName === "CPSA" ? 1 : 2
        this.channelLog.data = []
        this.total = 0
        this.params.active = 1
        this.params.cps_type = from
        this.$http.get(ENV.CPS_HOST_URL + "/details/player_recharge_log_for_work", {params: this.params})
          .then(response => {
            this.channelLog.total = response.body.total
            this.sum = response.body.sum[0]['SUM(a.yaobi)']
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
    },
    mounted: function () {
      this.token = sessionStorage.getItem("token")
      this.params.token = this.token
      this.getChannelLog()
      this.getRelatedUserList()
      this.getUserSelectList()
    }
  }
</script>

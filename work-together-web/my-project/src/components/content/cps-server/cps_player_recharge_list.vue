<template>
  <div>
    <section class="content-header">
      <h1>玩家消费明细</h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-body">
          <el-form :inline="true" class="demo-form-inline" >
            <el-form-item label="游戏">
              <el-select @change="gameChange" v-model="selectedGame" clearable filterable remote :remote-method="gameSearch" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in gameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                <el-pagination v-if="gameTotal > 20 "
                               small layout="prev, pager, next"
                               :page-size="20"
                               :total="gameTotal"
                               :current-page.sync="gameCurrentPage"
                               @current-change="gameCurrentChange">
                </el-pagination>
              </el-select>
            </el-form-item>
            <el-form-item label="账号">
              <el-select @change="fUserChange" v-model="users[0].selected" clearable default-first-option filterable remote :remote-method="fUserSearch" placeholder="请选择">
                <el-option v-for="item in users[0].list" :key="item.UserId" :label="item.UserName" :value="item.UserId"></el-option>
                <el-pagination v-if="users[0].total > 20 "
                     small layout="prev, pager, next"
                     :page-size="20"
                     :total="users[0].total"
                     :current-page.sync="users[0].page"
                     @current-change="fUserCurrentChange">
                </el-pagination>
              </el-select>
            </el-form-item>
            <el-form-item v-show="users[1].total > 0 || (users[1].query != '' && users[1].query != '全部')" >
              <el-select @change="sUserChange" v-model="users[1].selected" clearable filterable remote :remote-method="sUserSearch" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in users[1].list" :key="item.UserId" :label="item.UserName" :value="item.UserId"></el-option>
                <el-pagination v-if="users[1].total > 20 "
                               small layout="prev, pager, next"
                               :page-size="20"
                               :total="users[1].total"
                               :current-page.sync="users[1].page"
                               @current-change="sUserCurrentChange">
                </el-pagination>
              </el-select>
            </el-form-item>
            <el-form-item v-show="users[2].total > 0 || (users[2].query != '' && users[2].query != '全部')">
              <el-select @change="tUserChange" v-model="users[2].selected" clearable filterable remote :remote-method="tUserSearch" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in users[2].list" :key="item.UserId" :label="item.UserName" :value="item.UserId"></el-option>
                <el-pagination v-if="users[2].total > 20 "
                               small layout="prev, pager, next"
                               :page-size="20"
                               :total="users[2].total"
                               :current-page.sync="users[2].page"
                               @current-change="tUserCurrentChange">
                </el-pagination>
              </el-select>
            </el-form-item>
            <el-form-item label="时间">
              <el-date-picker
                :clearable="false"
                clearable
                @change="setTimesdatas"
                style="width: 100%"
                v-model="searchTime"
                type="datetimerange"
                placeholder="选择时间范围">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="支付方式">
              <el-select @change="selectPayWay" v-model="pay_way" filterable>
                <el-option label="所有" value=""></el-option>
                <el-option
                        v-for="item in payWayList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单号">
              <el-input @change="getDetailInfo" v-model="order_number" placeholder="请输入订单号"></el-input>
            </el-form-item>
            <el-form-item label="玩家账号">
              <el-select
                  clearable
                  filterable
                  remote
                  v-model="player_id"
                  :remote-method="searchPlayer"
                  placeholder="请输入账号或手机号"
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
          </el-form>
          <el-tabs v-model="active" type="card" @tab-click="tabChange">
            <el-tab-pane label="CPSA" name="CPSA"></el-tab-pane>
            <el-tab-pane label="CPSG" name="CPSG"></el-tab-pane>
            <el-tab-pane label="CPSJ" name="CPSJ"></el-tab-pane>
          </el-tabs>
          <el-row>
            <el-col :span="4" :offset="1"  >
              <el-card :body-style="{ padding: '0px' }" >
                <div style="padding: 14px;text-align: center">
                  <span style="" >总流水</span>
                  <div class="bottom clearfix" style="padding-top: 5px;">
                    <span style="font-weight: bold;" >{{ consumeDetails.statistics.money }}</span>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="4" :offset="2" >
              <el-card :body-style="{ padding: '0px' }" >
                <div style="padding: 14px;text-align: center">
                  <span style="" >充值人数</span>
                  <div class="bottom clearfix" style="padding-top: 5px;">
                    <span style="font-weight: bold;" >{{ consumeDetails.statistics.userCount}}</span>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="4" :offset="2" >
              <el-card :body-style="{ padding: '0px' }" >
                <div style="padding: 14px;text-align: center">
                  <span style="" >充值次数</span>
                  <div class="bottom clearfix" style="padding-top: 5px;">
                    <span style="font-weight: bold;" >{{ consumeDetails.statistics.rechargeCount }}</span>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="4" :offset="2" >
              <el-card :body-style="{ padding: '0px' }" >
                <div style="padding: 14px;text-align: center">
                  <span style="" >当前页流水</span>
                  <div class="bottom clearfix" style="padding-top: 5px;">
                    <span style="font-weight: bold;" >{{ consumeDetails.statistics.currentPageMoney }}</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <div style="margin-top: 20px; margin-bottom: 10px;">
            <span style="font-weight: bold; font-size: 20px;">数据明细</span>
            <button @click="exportExcel" style="float: right" class="btn btn-primary">导出</button>
            </div>
          <el-table
            :data="consumeDetails.list.data"
            style="width: 100%">
            <el-table-column prop="GameName" label="充值游戏"></el-table-column>
            <el-table-column prop="Amount" label="充值金额"></el-table-column>
            <el-table-column prop="OrderNo" label="订单号"></el-table-column>
            <el-table-column label="充值时间">
              <template scope="scope">{{ scope.row.RechargeTime | stampToTimeFull }}</template>>
            </el-table-column>
            <el-table-column prop="PayWay" label="支付方式"></el-table-column>
            <el-table-column prop="UserCode" label="玩家账号"></el-table-column>
            <el-table-column prop="Channel.First" label="一级会长"></el-table-column>
            <el-table-column prop="Channel.Second" label="二级会长"></el-table-column>
            <el-table-column prop="Channel.Third" label="三级级会长"></el-table-column>
          </el-table>
          <el-pagination
              v-if="consumeDetails.list.total > consumeDetails.list.perPage "
              layout="total, prev, pager, next"
              :page-size="consumeDetails.list.perPage"
              :total="consumeDetails.list.total"
              :current-page.sync="consumeDetails.list.page"
              @current-change="detailsCurrentChange">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        active: 'CPSA',
        player: {
            key: "",
            searchUserList:[],
            total: 0,
            per_page: 20,
            page: 1,
        },
        payWayList: [],
        isSelf: 2, //1是自己 2不是自己
        player_id: "",
        order_number: "",
        pay_way: "",
        firstLevelUser: "",
        user: "",
        users: [
          {query: '', selected: '', list: [], total: 0, page: 1},
          {query: '', selected: '', list: [], total: 0, page: 1},
          {query: '', selected: '', list: [], total: 0, page: 1},
        ],
        gameTotal: 0,
        gameCurrentPage: 1,
        gameList: [],
        selectedGame: "",
        gameKey: "",
        searchTime: [],
        consumeDetails: {
          statistics : {
            money: 0,
            currentPageMoney: 0,
            userCount: 0,
            rechargeCount: 0,
          },
          list: {
            data: [],
            total: 0,
            page: 1,
            perPage: 20,
          }
        },
      }
    },
    mounted: function() {
      this.token = sessionStorage.getItem("token")
      this.getGameSelectList()
      this.getPayWayList()
      this.initTime()
      this.getUserSelectList(1)

    },
    methods: {
      selectPayWay() {
        this.getDetailInfo()
      },
      selectPlayer() {
        this.getDetailInfo()
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
                      data[i].user_name += " ("+ data[i].mobile +")"
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
      tabChange() {
        this.getDetailInfo()
      },
      initTime() {
        var now = new Date();
        this.searchTime = []
        this.searchTime[0] = new Date(now.getTime() - 15 * 24 * 3600 * 1000)
        this.searchTime[1] = new Date(now)
      },
      getUserSelectList(level) {
        let page
        let query
        let pid
        if (level === 1) {
          page = this.users[0].page
          query = this.users[0].query
          pid = 0
        } else if (level === 2) {
          page = this.users[1].page
          query = this.users[1].query
          pid = this.users[0].selected
        } else {
          page = this.users[2].page
          query = this.users[2].query
          pid = this.users[1].selected
        }
        this.$http.get(ENV.CPS_HOST_URL + "/user/get_users_for_cascader", {
          params:{token: this.token, page: page, user_name: query, pid: pid}
        }).then((response) => {
           if (response.body.total !== 0) {
             if (level === 1) {
               this.users[0].list = response.body.data
               this.users[0].total = response.body.total
             } else if (level === 2) {
               this.users[1].list = response.body.data
               this.users[1].list.unshift({UserName: "自己", UserId: pid})
               this.users[1].total = response.body.total
             } else {
               this.users[2].list = response.body.data
               this.users[2].list.unshift({UserName: "自己", UserId: pid})
               this.users[2].total = response.body.total
             }
           } else {
             if (level === 1) {
               this.users[0].list = []
               this.users[0].total = 0
             } else if (level === 2) {
               this.users[1].list = []
               this.users[1].total = 0
             } else {
               this.users[2].list = []
               this.users[2].total = 0
             }
           }
        }, error => {
          this.$message.error(error.body)
        })
      },
      fUserChange() {
        this.firstLevelUser = this.users[0].selected
        this.user = this.users[0].selected
        for (let i = 1; i <= 2; i++) {
          this.users[i].list = []
          this.users[i].page = []
          this.users[i].query = ''
          this.users[i].total = 0
          this.users[i].selected = ''
        }
        if (this.users[0].selected !== '') {
          this.getUserSelectList(2)
        }
        this.consumeDetails.list.page = 1
        this.getDetailInfo()
      },
      sUserChange() {
        this.users[2].list = []
        this.users[2].page = []
        this.users[2].query = ''
        this.users[2].total = 0
        this.users[2].selected = ''
        if (this.users[1].selected !== "" && this.users[1].selected !== this.users[0].selected) {
          this.user = this.users[1].selected
          this.isSelf = 2
          this.getUserSelectList(3)
        } else {
          this.user = this.users[0].selected
          if (this.users[1].selected === "")
            this.isSelf = 2
          else
            this.isSelf = 1
        }
        this.consumeDetails.list.page = 1
        this.getDetailInfo()
      },
      tUserChange() {
        if (this.users[2].selected !== '' && this.users[2].selected !== this.users[1].selected) {
          this.user = this.users[2].selected
          this.isSelf = 2
        } else {
          this.user = this.users[1].selected
          if (this.users[1].selected === "")
            this.isSelf = 2
          else
            this.isSelf = 1
        }
        this.consumeDetails.list.page = 1
        this.getDetailInfo()
      },
      fUserSearch(query) {
        this.users[0].query = query
        if (this.users[0].query === '全部') {
          this.users[0].query = ''
        }
        for(var i=0; i < this.users[0].list.length; i++){
          if (this.users[0].list[i].UserName === query) {
            return
          }
        }
        this.getUserSelectList(1)
      },
      sUserSearch(query) {
        if (query !== '全部') {
          this.users[1].query = query
          for(var i=0; i < this.users[1].list.length; i++) {
            if (this.users[1].list[i].UserName === query) {
              return
            }
          }
          this.getUserSelectList(2)
        } else if(this.users[0].selected != '') {
          this.users[1].query = ''
          this.getUserSelectList(2)
        }

      },
      tUserSearch(query) {
        if (query !== '全部') {
          this.users[2].query = query
          for(var i=0; i < this.users[2].list.length; i++) {
            if (this.users[2].list[i].UserName === query) {
              return
            }
          }
          this.getUserSelectList(3)
        } else if(this.users[1].selected != '') {
          this.users[2].query = ''
          this.getUserSelectList(3)
        }
      },
      fUserCurrentChange() {
        this.getUserSelectList(1)
      },
      sUserCurrentChange() {
        this.getUserSelectList(2)
      },
      tUserCurrentChange() {
        this.getUserSelectList(3)
      },
      getGameSelectList() {
        let page = this.gameCurrentPage
        let gameName = this.gameKey
        this.$http.get(ENV.CPS_HOST_URL + "/game/game_select_list", {
          params:{token: this.token, page: page, game_name: gameName}
        }).then((response) => {
          this.gameList = response.body.data
          this.gameTotal = response.body.total
        }, error => {
          this.$message.error(error)
        })
      },
      setTimesdatas() {
        this.getDetailInfo()
      },
      gameCurrentChange () {
        this.getGameSelectList()
      },
      gameSearch(query) {
        this.gameCurrentPage = 1
        this.gameKey = query
        this.getGameSelectList()
      },
      gameChange() {
        this.getDetailInfo()
      },
      getDetailInfo() {
        this.consumeDetails.statistics = {
          money: 0,
          currentPageMoney: 0,
          userCount: 0,
          rechargeCount: 0,
        }
        this.consumeDetails.list.data = []
        this.consumeDetails.list.total = 0
        if (this.user == "") {
          return
        }
        let startTime,endTime
        if (this.searchTime[0] != null) {
          startTime = Date.parse(this.searchTime[0]) / 1000
        } else {
          startTime = ''
        }
        if (this.searchTime[1] != null) {
          endTime = Date.parse(this.searchTime[1]) / 1000
        } else {
          endTime = ''
        }
        this.$http.get(ENV.CPS_HOST_URL + "/details/consume_detail_for_work", {
          params:{token: this.token, game_id: this.selectedGame, start_time:startTime, end_time:endTime,
            player_id: this.player_id, order_number: this.order_number, pay_way: this.pay_way,
            uid: this.user, pid: this.firstLevelUser, is_self: this.isSelf, active: this.active, export: 2}
        }).then( response => {
          let data = response.body.data
          this.consumeDetails.list.data = data.details
          this.consumeDetails.statistics.money = data.statistics.Amount
          this.consumeDetails.statistics.currentPageMoney = data.statistics.CurrentPageAmount
          this.consumeDetails.statistics.userCount = data.statistics.UserCount
          this.consumeDetails.statistics.rechargeCount = data.statistics.RechargeCount
          this.consumeDetails.list.total = data.total
        }, (error) => {
          if (error.status === 403) {
            this.$router.push({path: '/login'})
          } else {
            this.$message.error(error.body)
          }
        })
      },
      detailsCurrentChange() {
        this.getDetailInfo()
      },
      exportExcel() {
        if (this.user == "") {
          this.$message.error("请选择查询账号")
          return
        }
        let startTime = Date.parse(this.searchTime[0]) / 1000
        let endTime = Date.parse(this.searchTime[1]) / 1000
        let url = ENV.CPS_HOST_URL + '/details/consume_detail_for_work?token=' + this.token +
          "&game_id=" + this.selectedGame + "&start_time=" + startTime + "&end_time=" + endTime +
          "&player_id=" + this.player_id + "&order_number=" + this.order_number + "&pay_way=" + this.pay_way +
          "&uid=" + this.user + "&pid=" + this.firstLevelUser + "&is_self=" + this.isSelf + "&active=" + this.active + "&export=1"
        window.open(url)
      },
      getPayWayList() {
        this.$http.get(ENV.CPS_HOST_URL + '/details/pay_way_for_work', {params:{token: this.token}}).then( response => {
          this.payWayList = response.body
        }, error => {
          this.$message.error(error.body)
        })
      }
    }
  }
</script>
<style>
  /*#charts1 div:first-child{ width: 100% !important;}*/
  /*canvas{width:100% !important;}*/
</style>

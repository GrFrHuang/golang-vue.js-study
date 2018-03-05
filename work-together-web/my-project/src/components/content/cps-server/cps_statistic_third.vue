<template>
  <div class="box">
    <div class="box-body">
      <el-form :inline="true" class="demo-form-inline" >
        <el-form-item label="游戏">
          <el-select @change="gameChange" v-model="selectedGame" filterable remote :remote-method="gameSearch" placeholder="请选择">
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
          <el-select @change="fUserChange" v-model="users[0].selected" clearable filterable remote :remote-method="fUserSearch" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
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
            @change="setTimesdatas"
            style="width: 100%"
            v-model="searchTime"
            type="datetimerange"
            placeholder="选择时间范围">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="4" :offset="2"  >
          <el-card :body-style="{ padding: '0px' }" >
            <div style="padding: 14px;text-align: center">
              <span style="" >注册人数</span>
              <div class="bottom clearfix" style="padding-top: 5px;">
                <span style="font-weight: bold;" >{{ statistics.newUser }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4" :offset="4" >
          <el-card :body-style="{ padding: '0px' }" >
            <div style="padding: 14px;text-align: center">
              <span style="" >充值金额</span>
              <div class="bottom clearfix" style="padding-top: 5px;">
                <span style="font-weight: bold;" >{{ statistics.money}}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <!--<el-col :span="4" :offset="2" >-->
          <!--<el-card :body-style="{ padding: '0px' }" >-->
            <!--<div style="padding: 14px;text-align: center">-->
              <!--<span style="" >活跃人数</span>-->
              <!--<div class="bottom clearfix" style="padding-top: 5px;">-->
                <!--<span style="font-weight: bold;" >{{ statistics.loginUser }}</span>-->
              <!--</div>-->
            <!--</div>-->
          <!--</el-card>-->
        <!--</el-col>-->
        <el-col :span="4" :offset="4" >
          <el-card :body-style="{ padding: '0px' }" >
            <div style="padding: 14px;text-align: center">
              <span style="" >充值人数</span>
              <div class="bottom clearfix" style="padding-top: 5px;">
                <span style="font-weight: bold;" >{{ statistics.payUser }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div id="charts4thirds" style="width: 100%; height: 400px; margin-top: 10px;"></div>
      <div style="margin-top: 20px; margin-bottom: 10px;">
        <span style="font-weight: bold; font-size: 20px;">数据明细</span>
        <button @click="exportExcel" style="float: right" class="btn btn-primary">导出</button>
        </div>
      <el-table
        :data="statisticsList.data"
        style="width: 100%">
        <el-table-column
          prop="statis_day"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="game_name"
          label="游戏名">
        </el-table-column>
        <el-table-column
          prop="parent_user_name"
          label="上级账号">
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="当前账号">
        </el-table-column>
        <el-table-column
          prop="new_user"
          label="注册人数">
        </el-table-column>
        <el-table-column
          prop="pay_user"
          label="充值人数">
        </el-table-column>
        <el-table-column
          prop="login_user"
          label="活跃人数">
        </el-table-column>
        <el-table-column
          prop="imoney"
          label="充值金额">
        </el-table-column>
        <el-table-column
          prop="ARPU"
          label="付费ARPU">
        </el-table-column>
      </el-table>
      <el-pagination
          v-if="statisticsList.total > 10 "
          layout="total, prev, pager, next"
          :page-size="10"
          :total="statisticsList.total"
          :current-page.sync="statisticsList.page"
          @current-change="statisCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        level: 1,
        user: "",
        users: [
          {query: '', selected: "", list: [], total: 0, page: 1},
          {query: '', selected: '', list: [], total: 0, page: 1},
          {query: '', selected: '', list: [], total: 0, page: 1},
        ],
        gameTotal: 0,
        gameCurrentPage: 1,
        gameList: [],
        selectedGame: "",
        gameKey: "",
        searchTime: [],
        statistics: {
          money: 0,
          loginUser: 0,
          newUser: 0,
          payUser: 0,
        },
        statisticsList: {
          data: [],
          total: 0,
          page: 1,
        },
        charts: {
          times: [],
          NewUser: [],
          LoginUser: [],
          PayUser: [],
          Imoney: []
        },
        charts4thirds: null,
      }
    },
    mounted: function() {
      this.token = sessionStorage.getItem("token")
      this.charts4thirds = this.$echarts.init(document.getElementById('charts4thirds'))
      this.getGameSelectList()
      this.initTime()
      this.getUserSelectList(1)
      this.getStatisInfo(1)
      window.addEventListener('resize', this.loadmap)
    },

    methods: {
      initTime() {
        var now = new Date()
        now.setHours(0)
        now.setMinutes(0)
        now.setSeconds(0)
        now.setMilliseconds(0)
        this.searchTime = []
        this.searchTime[0] = new Date(now.getTime() - 15 * 24 * 3600 * 1000)
        this.searchTime[1] = now
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
               this.users[1].total = response.body.total
             } else {
               this.users[2].list = response.body.data
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
          if (error.status === 403) {
            this.$router.push({path: '/login'})
          } else {
            this.$message.error(error.body)
          }
        })
      },
      fUserChange() {
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
        this.level = 1
        this.getStatisInfo()
      },
      sUserChange() {
        this.users[2].list = []
        this.users[2].page = []
        this.users[2].query = ''
        this.users[2].total = 0
        this.users[2].selected = ''
        if (this.users[1].selected !== "") {
          this.user = this.users[1].selected
          this.level = 2
          this.getUserSelectList(3)
        } else {
          this.user = this.users[0].selected
          this.level = 1
        }

        this.getStatisInfo()
      },
      tUserChange() {
        if (this.users[2].selected !== '') {
          this.user = this.users[2].selected
          this.level = 3
        } else {
          this.user = this.users[1].selected
          this.level = 2
        }
        this.getStatisInfo()
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
          if (error.status === 403) {
            this.$router.push({path: '/login'})
          } else {
            this.$message.error(error.body)
          }
        })
      },
      setTimesdatas() {
        this.getStatisInfo()
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
        this.getStatisInfo()
      },
      loadmap () {
        if (this.charts4thirds !== null) {
          this.charts4thirds.resize()
        }
        this.charts4thirds.setOption({
          tooltip: {
            color: '#F66600',
            trigger: 'axis'
          },
          legend: {
            data: [{
              name: '新增注册',
              textStyle: {color: '#F66600'}
            }, {
              name: '活跃人数',
              textStyle: {color: '#F66600'}
            }, {
              name: '充值人数',
              textStyle: {color: '#F66600'}
            }, {
              name: '充值金额',
              textStyle: {color: '#F66600'}
            }],
            selected: {
              '新增注册': true,
              '活跃人数': true,
              '充值人数': true,
              '充值金额': false
            },
            left: '30px'
          },
          grid: {
            left: '2.2%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            right: '4%',
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#F66600',
                width: 2
              }
            },
            data: this.charts.times
          },
          yAxis: {
            axisLine: {
              show: false,
              lineStyle: {
                color: '#F66600',
                width: 2
              }
            },
            type: 'value'
          },
          series: [
            {
              name: '新增注册',
              type: 'line',
              stack: '总量1',
              symbolSize: 8,
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '#48ac5d',
                    width: 4
                  }
                }
              },
              data: this.charts.NewUser
            },
            {
              name: '活跃人数',
              type: 'line',
              stack: '总量2',
              symbolSize: 8,
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '#823062',
                    width: 4
                  }
                }
              },
              data: this.charts.LoginUser
            },
            {
              name: '充值人数',
              type: 'line',
              stack: '总量3',
              symbolSize: 8,
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '#f7ba2a',
                    width: 4
                  }
                }
              },
              data: this.charts.PayUser
            },
            {
              name: '充值金额',
              type: 'line',
              stack: '总量4',
              symbolSize: 8,
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '#20a0ff',
                    width: 4
                  }
                }
              },
              data: this.charts.Imoney
            }
          ]
        })
      },
      getStatisInfo() {
        this.charts.times     = []
        this.charts.NewUser   = []
        this.charts.LoginUser = []
        this.charts.PayUser   = []
        this.charts.Imoney    = []
        this.statistics.money = 0
        this.statistics.newUser = 0
        this.statistics.loginUser = 0
        this.statistics.payUser = 0
        let startTime = Date.parse(this.searchTime[0]) / 1000
        let endTime = Date.parse(this.searchTime[1]) / 1000
        this.$http.get(ENV.CPS_HOST_URL + "/statis/statis_data_for_w_to_third", {
          params:{token: this.token, game_id: this.selectedGame, start_time:startTime, end_time:endTime, uid: this.user, level: this.level, active: 1}
        }).then( response => {
          let data = response.body.data
          for (let i in data) {
            this.charts.times[i] = data[i].StatisDay
            this.charts.NewUser[i] = data[i].NewUser || 0
            this.charts.LoginUser[i] = data[i].LoginUser || 0
            this.charts.PayUser[i] = data[i].PayUser || 0
            this.charts.Imoney[i] = data[i].Imoney || 0
          }
          let statisData = response.body.statistics
          this.statistics.money = statisData.money
          this.statistics.newUser = statisData.newUser
          this.statistics.loginUser = statisData.loginUser
          this.statistics.payUser = statisData.payUser
          this.statisticsList.page = 1
          this.getStatisList()
          this.loadmap()
        })
      },
      getStatisList() {
        this.statisticsList.data = []
        this.statisticsList.total = 0
        let startTime = Date.parse(this.searchTime[0]) / 1000
        let endTime = Date.parse(this.searchTime[1]) / 1000
        this.$http.get(ENV.CPS_HOST_URL + "/statis/statis_data_for_w_to_third", {
          params:{token: this.token, game_id: this.selectedGame, start_time:startTime,
            end_time:endTime, uid: this.user, level: this.level, active: 2, page: this.statisticsList.page}
        }).then( response => {
          if (response.body.total > 0) {
            this.statisticsList.data = response.body.data
            this.statisticsList.total = response.body.total
          }
        })
      },
      statisCurrentChange() {
        this.getStatisList()
      },
      exportExcel() {
        let startTime = Date.parse(this.searchTime[0]) / 1000
        let endTime = Date.parse(this.searchTime[1]) / 1000
        let url = ENV.CPS_HOST_URL + '/statis/statis_data_for_w_to_third?token=' + this.token +
          "&game_id=" + this.selectedGame + "&start_time=" + startTime + "&end_time=" + endTime +
          "&uid=" + this.user + "&level=" + this.level + "&active=3"
        window.open(url)
      }
    }
  }
</script>
<style>
  /*#charts1 div:first-child{ width: 100% !important;}*/
  /*canvas{width:100% !important;}*/
</style>

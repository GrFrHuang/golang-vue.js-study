<template>
    <div class="box">
      <div class="box-body">
        <div>
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
          <div style="padding-left: 40px;padding-right: 40px;padding-bottom: 25px;margin-top: 20px">
            <div id="charts1" style="" :style="{width: '100%', height: '400px'}"></div>
          </div>
        </div>
        <div>
          <el-row style="height: 50px;">
            <span style="float: left;margin-top: 10px; line-height: 15px; margin-right: 10px;">账号名</span>
            <el-select style="float: left; width: 70%" @change="userChange" v-model="uidList" filterable multiple remote :remote-method="userSearch" placeholder="请选择">
              <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
              <el-pagination v-if="userTotal > 20 "
                 small layout="prev, pager, next"
                 :page-size="20"
                 :total="userTotal"
                 :current-page.sync="userCurrentPage"
                 @current-change="userCurrentChange">
              </el-pagination>
            </el-select>
          </el-row>
          <el-form :inline="true" class="demo-form-inline" >
            <el-form-item label="游戏">
              <el-select @change="gameChange2" v-model="selectedGame2" filterable remote :remote-method="gameSearch2" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in gameList2" :key="item.id" :label="item.name" :value="item.id"></el-option>
                <el-pagination v-if="gameTotal2 > 20 "
                               small layout="prev, pager, next"
                               :page-size="20"
                               :total="gameTotal2"
                               :current-page.sync="gameCurrentPage2"
                               @current-change="gameCurrentChange2">
                </el-pagination>
              </el-select>
            </el-form-item>
            <el-form-item label="时间">
              <el-date-picker
                :clearable="false"
                @change="setTimesdatas2"
                style="width: 100%"
                v-model="searchTime2"
                type="datetimerange"
                placeholder="选择时间范围">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div v-show="uids != '-' ">
            <div style="padding-left: 40px;padding-right: 40px;padding-bottom: 25px;">
              <div style="text-align: center; font-size: 16px">新增注册</div>
              <div id="charts2" :style="{width: '100%', height: '400px'}"></div>
            </div>
            <div style="padding-left: 40px;padding-right: 40px;">
              <div style="text-align: center; font-size: 16px; ">活跃人数</div>
              <div id="charts3" :style="{width: '100%', height: '400px'}"></div>
            </div>
            <div style="padding-left: 40px;padding-right: 40px;">
            <div style="text-align: center; font-size: 16px; ">充值人数</div>
            <div id="charts4" :style="{width: '100%', height: '400px'}"></div>
          </div>
          </div>
        </div>
      </div>
      </div>
</template>
<script>
  export default {
    data: function () {
      return {
        searchUser: "",
        userList: [],
        userTotal: 0,
        userCurrentPage: 1,
        gameTotal: 0,
        gameTotal2: 0,
        gameCurrentPage: 1,
        gameCurrentPage2: 1,
        gameList: [],
        gameList2: [],
        selectedGame: "",
        selectedGame2: "",
        gameKey: "",
        gameKey2: "",
        searchTime: [],
        searchTime2: [],
        uidList: [],
        uids: "-",
        times: [],
        NewUser: [],
        LoginUser: [],
        PayUser: [],
        Imoney: [],
        charts: [
          {
            times: [],
            NewUser: [],
            LoginUser: [],
            PayUser: [],
            Imoney: []
          },
          {
            times: [],
            ledend: [],
            series: [],
          },
          {
            times: [],
            ledend: [],
            series: [],
          },
          {
            times: [],
            ledend: [],
            series: [],
          }
        ],
      }
    },
    mounted: function() {
      this.token = sessionStorage.getItem("token")
      this.getGameSelectList(1)
      this.getGameSelectList(2)
      this.initTime()
      this.getStatisInfo()
      this.getStatisInfo2()
      this.getUserSelectList()
    },
    methods: {
      initTime() {
        var now = new Date();
        this.searchTime = []
        this.searchTime[0] = new Date(now.getTime() - 15 * 24 * 3600 * 1000)
        this.searchTime[1] = new Date(now)
        this.searchTime2 = []
        this.searchTime2[0] = this.searchTime[0]
        this.searchTime2[1] = this.searchTime[1]
      },
      getUserSelectList() {
        this.$http.get(ENV.CPS_HOST_URL + "/user/get_one_level_users", {
          params:{token: this.token, page: this.userCurrentPage, user_name: this.searchUser}
        }).then((response) => {
            this.userList = response.body.data
            this.userTotal = response.body.total
        }, error => {
          this.$message.error(error)
        })
      },
      userChange() {
        if (this.uidList.length == 0) {
          this.uids = "-"
        } else {
          this.uids = this.uidList.join(",")
        }
        this.getStatisInfo2()
      },
      userSearch(query) {
        this.userCurrentPage = 1
        this.searchUser = query
        this.getUserSelectList()
      },
      userCurrentChange() {
        this.getUserSelectList()
      },
      getGameSelectList(flag) {
        let page
        let gameName
        if (flag == 1) {
          page = this.gameCurrentPage
          gameName = this.gameKey
        } else {
          page = this.gameCurrentPage2
          gameName = this.gameKey2
        }
        this.$http.get(ENV.CPS_HOST_URL + "/game/game_select_list", {
          params:{token: this.token, page: page, game_name: gameName}
        }).then((response) => {
          if (flag == 1) {
            this.gameList = response.body.data
            this.gameTotal = response.body.total
          } else {
            this.gameList2 = response.body.data
            this.gameTotal2 = response.body.total
          }
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
      setTimesdatas2() {
        this.getStatisInfo2()
      },
      gameCurrentChange (currengPage) {
        this.getGameSelectList(1)
      },
      gameCurrentChange2 (currengPage) {
        this.getGameSelectList(2)
      },
      gameSearch(query) {
        this.gameCurrentPage = 1
        this.gameKey = query
        this.getGameSelectList(1)
      },
      gameSearch2(query) {
        this.gameCurrentPage2 = 1
        this.gameKey2 = query
        this.getGameSelectList(2)
      },
      gameChange() {
        this.getStatisInfo()
      },
      gameChange2() {
        this.getStatisInfo2()
      },
      loadmap () {
        let myChart = this.$echarts.init(document.getElementById('charts1'))
        myChart.setOption({
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
            data: this.charts[0].times
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
              data: this.charts[0].NewUser
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
              data: this.charts[0].LoginUser
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
              data: this.charts[0].PayUser
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
              data: this.charts[0].Imoney
            }
          ]
        })
      },
      loadmap2 (elementId, i) {
        let myChart = this.$echarts.init(document.getElementById(elementId))
        myChart.setOption({
          tooltip: {
            color: '#F66600',
            trigger: 'axis'
          },
          legend: {
            data: this.charts[i].ledend,
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
            data: this.charts[i].times
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
          series: this.charts[i].series
        })
      },
      getStatisInfo() {
        this.charts[0].times      = []
        this.charts[0].NewUser    = []
        this.charts[0].LoginUser  = []
        this.charts[0].PayUser    = []
        this.charts[0].Imoney     = []
        let startTime = Date.parse(this.searchTime[0]) / 1000
        let endTime = Date.parse(this.searchTime[1]) / 1000
        this.$http.get(ENV.CPS_HOST_URL + "/statis/statis_all_data_for_work", {
          params:{token: this.token, game_id: this.selectedGame, start_time:startTime, end_time:endTime, uids: ""}
        }).then( response => {
          let data = response.body
          if (data === null) {
            this.charts[0].times      = []
            this.charts[0].NewUser    = []
            this.charts[0].LoginUser  = []
            this.charts[0].PayUser    = []
            this.charts[0].Imoney     = []
          } else {
            for (let i in data) {
              this.charts[0].times[i] = data[i].StatisDay
              this.charts[0].NewUser[i] = data[i].NewUser || 0
              this.charts[0].LoginUser[i] = data[i].LoginUser || 0
              this.charts[0].PayUser[i] = data[i].PayUser || 0
              this.charts[0].Imoney[i] = data[i].Imoney || 0
            }
          }
          this.loadmap()
        })
      },
      getStatisInfo2() {
        if (this.uids == "-") {
          return
        }
        let startTime = Date.parse(this.searchTime2[0]) / 1000
        let endTime = Date.parse(this.searchTime2[1]) / 1000
        this.$http.get(ENV.CPS_HOST_URL + "/statis/statis_all_data_for_work", {
          params:{token: this.token, game_id: this.selectedGame2, start_time:startTime, end_time:endTime, uids: this.uids}
        }).then( response => {
          for (var i = 1; i <= 3; i++){
            this.charts[i].times = []
            this.charts[i].ledend = []
            this.charts[i].series = []
          }
          let data = response.body
          if (JSON.stringify(data) != "{}") {
              let flag = 1
              for (let i in data) {
                let NewUser = []
                let LoginUser = []
                let PayUser = []
                if (data[i] != null) {
                  for (let j = 0; j < data[i].length; j++) {
                    if (flag == 1) {
                      this.charts[1].times.push(data[i][j].StatisDay)
                      this.charts[2].times.push(data[i][j].StatisDay)
                      this.charts[3].times.push(data[i][j].StatisDay)
                    }
                    NewUser.push(data[i][j].NewUser)
                    LoginUser.push(data[i][j].LoginUser)
                    PayUser.push(data[i][j].PayUser)
                  }
                  flag++
                }

                this.charts[1].ledend.push(i)
                this.charts[2].ledend.push(i)
                this.charts[3].ledend.push(i)
                this.charts[1].series.push({name: i,type:"line",stack:i + "_总量", itemStyle: {normal:{}},data:NewUser})
                this.charts[2].series.push({name: i,type:"line",stack:i + "_总量", itemStyle: {normal:{}},data:LoginUser})
                this.charts[3].series.push({name: i,type:"line",stack:i + "_总量", itemStyle: {normal:{}},data:PayUser})
              }
          } else {
            this.charts[1].series = [{name: "",type:"line",stack:"总量", itemStyle: {normal:{}},data:[]}]
            this.charts[2].series = [{name: "",type:"line",stack:"总量", itemStyle: {normal:{}},data:[]}]
            this.charts[3].series = [{name: "",type:"line",stack:"总量", itemStyle: {normal:{}},data:[]}]
          }
          this.loadmap2("charts2", 1)
          this.loadmap2("charts3", 2)
          this.loadmap2("charts4", 3)
        })
      }
    }
  }
</script>
<style>
  /*#charts1 div:first-child{ width: 100% !important;}*/
  /*canvas{width:100% !important;}*/
</style>

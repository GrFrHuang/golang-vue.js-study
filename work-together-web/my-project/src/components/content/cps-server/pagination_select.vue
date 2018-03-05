<template>
    <div class="box">
      <div class="box-header with-border">
        <el-form :inline="true" class="demo-form-inline" >
          <el-form-item label="渠道名">
            <el-select @change="gamedatas" v-model="searchGame" filterable clearable placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in gamedata" :key="item.id" :label="item.game_name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="游戏">
            <el-select @change="gamedatas" v-model="searchGame" filterable clearable placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in gamedata" :key="item.id" :label="item.game_name" :value="item.id">

              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker
              @change="setTimesdatas"
              style="width: 100%"
              v-model="searchTime"
              type="datetimerange"
              placeholder="选择时间范围">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
        <div class="box-body">
          <div style="padding-left: 40px;padding-right: 40px;padding-bottom: 25px;margin-top: 20px">
            <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
          </div>
        </div>
      </div>
</template>
<script>
  export default {
    data: function () {
      return {

      }
    },
    mounted: function() {
      this.token = sessionStorage.getItem("token")
      this.getUserList(1)
    },
    methods: {
      setTimesdatas() {
        let startTime = Date.parse(this.searchTime[0]) / 1000
        let endTime = Date.parse(this.searchTime[1]) / 1000
        this.getStatisInfo(this.uid, startTime, endTime, "")
      },
      selectGame() {
        let startTime = Date.parse(this.searchTime[0]) / 1000
        let endTime = Date.parse(this.searchTime[1]) / 1000
        this.getStatisInfo(this.uid, startTime, endTime, this.searchGame)
      },
      loadmap () {
        let myChart = this.$echarts.init(document.getElementById('myChart'))
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
              '活跃人数': false,
              '充值人数': false,
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
            data: this.times
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
              data: this.NewUser
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
              data: this.LoginUser
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
              data: this.PayUser
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
              data: this.Imoney
            }
          ]
        })
      },
      getStatisInfo(uid, startTime, endTime, gameId) {
        this.$http.get(ENV.CPS_HOST_URL + "/statis/statis_data_for_work", {
          params:{token: this.token, uid: uid, game_id: gameId, start_time:startTime, end_time:endTime}
        }).then( response => {
          let data = response.body
          if (data.data.StatisData.length === 0) {
            this.times = []
            this.NewUser = []
            this.LoginUser = []
            this.PayUser = []
            this.Imoney = []
            this.game_name = []
          } else {
            for (let i in data.data.StatisData) {
              this.times[i] = data.data.StatisData[i].StatisDay
              this.game_name[i] = data.data.StatisData[i].GameName
              this.NewUser[i] = data.data.StatisData[i].NewUser || ''
              this.LoginUser[i] = data.data.StatisData[i].LoginUser || ''
              this.PayUser[i] = data.data.StatisData[i].PayUser || ''
              this.Imoney[i] = data.data.StatisData[i].Imoney || ''
            }
          }
          this.headerdata = data.data
          this.TotalStatis = data.data
          this.loadmap()
        }, error => {
          if (error.status === 403) {
            this.$router.push({path: '/login'})
          } else {
            this.$message.error(error.body)
          }
        })
      }
    }
  }
</script>

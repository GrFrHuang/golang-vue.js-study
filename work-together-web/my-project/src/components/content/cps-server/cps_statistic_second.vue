<template>
    <div class="box">
        <div class="box-header with-border">
          <el-form :inline="true" class="demo-form-inline" >
            <el-form-item label="账号/渠道名">
              <el-input  v-model="user_name" placeholder="账号/渠道名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="box-body">
          <el-collapse v-model="activeName" accordion @change="handleChange">
            <template v-for="(item, index) in items1">
              <el-collapse-item :name="item.UserId">
                <template slot="title">
                  {{ item.UserName }}<span style="margin-left: 10px; color: #c0c0c0">{{ item.channel_name }}</span>
                  <el-button style="float: right; margin: 3px 10px 0 0;" type="primary" @click="openDialog(item.UserId)">查看</el-button>
                </template>
                <el-collapse v-model="activeName2" accordion @change="handleChange2">
                  <template v-for="(item2, index) in items2">
                    <el-collapse-item :name="item2.UserId">
                      <template slot="title">
                        {{ item2.UserName }}<span style="margin-left: 10px; color: #c0c0c0">{{ item2.channel_name }}</span>
                        <el-button style="float: right; margin: 3px 10px 0 0;" type="primary" @click="openDialog(item2.UserId)">查看</el-button>
                      </template>
                      <table class="table table-bordered table-hover">
                        <thead style="color: #a0a0a0">
                        <tr>
                          <th>账号</th>
                          <th>渠道名</th>
                          <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item3 in items3">
                          <td>{{ item3.UserName }}</td>
                          <td>{{ item3.channel_name }}</td>
                          <td> <a @click="openDialog(item3.UserId)">查看</a></td>
                        </tr>
                        </tbody>
                      </table>
                      <el-pagination
                        v-show="total3 > per_page"
                        @current-change="onCurrentChange3"
                        :current-page="page3"
                        :page-size="per_page"
                        :total="total3"
                        layout="prev, pager, next, jumper">
                      </el-pagination>
                    </el-collapse-item>
                  </template>
                </el-collapse>
                <el-pagination
                  v-show="total2 > per_page"
                  @current-change="onCurrentChange2"
                  :current-page="page2"
                  :page-size="per_page"
                  :total="total2"
                  layout="prev, pager, next, jumper">
                </el-pagination>
              </el-collapse-item>
            </template>
          </el-collapse>
          <el-pagination
            v-show="total1 > per_page"
            @current-change="onCurrentChange1"
            :current-page="page1"
            :page-size="per_page"
            :total="total1"
            layout="prev, pager, next, jumper">
          </el-pagination>
        </div>
        <el-dialog title="统计数据" :visible.sync="dialogFormVisible">
          <div style="padding-left:40px;padding-right:40px;">
            <el-row type="flex" class="row-bg" style="width: 720px">
              <el-col style="margin-right: 20px;float: left;width: 140px">
                <p>游戏：</p>
                <el-select @change="gamedatas" v-model="searchGame" filterable clearable placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in gamedata" :key="item.id" :label="item.game_name" :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <p>筛选时间：</p>
                <el-date-picker
                  :clearable="false"
                  @change="setTimesdatas"
                  style="width: 100%"
                  v-model="searchTime"
                  type="datetimerange"
                  placeholder="选择时间范围">
                </el-date-picker>
              </el-col>
            </el-row>
          </div>
          <div style="padding-left:40px;padding-right: 40px; margin-top: 10px;">
            <el-row type="flex" class="row-bg" style="width: 720px">
              <el-col style="float: left;width: 160px">
                <p>新增注册
                </p>
                <h4>{{ TotalStatis.NewUser }}</h4>
              </el-col>
              <!--<el-col :span="4">-->
              <!--<p>设备激活</p>-->
              <!--<h4>&#45;&#45;</h4>-->
              <!--</el-col>-->
              <el-col style="float: left;width: 160px">
                <p>活跃人数</p>
                <h4>{{ TotalStatis.LoginUser }}</h4>
              </el-col>
              <el-col style="float: left;width: 160px">
                <p>充值人数</p>
                <h4>{{ TotalStatis.PayUser }}</h4>
              </el-col>
              <el-col style="float: left;width: 160px">
                <p>充值金额(元)
                </p>
                <h4>{{ TotalStatis.Imoney }}</h4>
              </el-col>
              <!--<el-col :span="4">-->
              <!--<p>付费ARPU-->
              <!--</p>-->
              <!--<h4>&#45;&#45;</h4>-->
              <!--</el-col>-->
            </el-row>
          </div>
          <div style="padding-left: 40px;padding-right: 40px;padding-bottom: 25px;margin-top: 20px">
            <div id="second_chart" :style="{width: '100%', height: '400px'}"></div>
          </div>
        </el-dialog>
      </div>
</template>
<script>
  export default {
    data: function () {
      return {
        uid: 0,
        p: 0,
        game_name: [],
        times: [],
        NewUser: [],
        LoginUser: [],
        PayUser: [],
        Imoney: [],
        headerdata: [],
        headerdatas: [],
        TotalStatis: {
          NewUser: '',
          LoginUser: '',
          PayUser: '',
          Imoney: '',
          ARPU: ''
        },
        token:'',
        user_name: "",
        dialogFormVisible: false,
        searchGame: '',
        gamedata: [],
        searchTime: [],
        per_page: 20,
        page1: 1,
        page2: 1,
        page3: 1,
        activeName: '0',
        activeName2: '0',
        total1:0,
        total2:0,
        total3:0,
        items1:[],
        items2:[],
        items3:[],
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
      gamedatas() {
        let startTime = Date.parse(this.searchTime[0]) / 1000
        let endTime = Date.parse(this.searchTime[1]) / 1000
        this.getStatisInfo(this.uid, startTime, endTime, this.searchGame)
      },
      openDialog(uid) {
        this.times = []
        this.NewUser = []
        this.LoginUser = []
        this.PayUser = []
        this.Imoney = []
        this.game_name = []

        this.searchGame = ''
        this.uid = uid
        this.$http.get(ENV.CPS_HOST_URL + "/game/statis_channel_game", {params:{token: this.token, uid: uid}}).then(response => {
          this.gamedata = response.body
        })
        this.searchTime = []
        var now = new Date();
        this.searchTime[0] = new Date(now.getTime() - 15 * 24 * 3600 * 1000)
        this.searchTime[1] = new Date(now)
        let startTime = Date.parse(this.searchTime[0]) / 1000
        let endTime = Date.parse(this.searchTime[1]) / 1000
        this.getStatisInfo(uid, startTime, endTime, this.searchGame)
        this.dialogFormVisible = true
        window.event.cancelBubble = true;
      },
      getUserList(index) {
        let page
        let pid
        if (index === 1) {
          page = this.page1
          pid = ""
        } else if (index === 2){
          page = this.page2
          pid = this.activeName
        } else {
          page = this.page3
          pid = this.activeName2
        }
        this.$http.get(ENV.CPS_HOST_URL + "/statis/user_list",
          {params: { token: this.token, page: page, per_page: this.per_page, pid: pid}}
        ).then(response => {
          if (index === 1) {
            this.items1 = response.body.data
            this.total1 = response.body.total
          } else if (index === 2) {
            this.items2 = response.body.data
            this.total2 = response.body.total
          } else {
            this.items3 = response.body.data
            this.total3 = response.body.total
          }
        }, (error) => {
          if (error.status === 403) {
            this.$router.push({path: '/login'})
          } else {
            this.$message.error(error.body)
          }
        })
      },
      onSubmit () {
        this.$http.get(ENV.CPS_HOST_URL + "/statis/user_list",
          {params: { token: this.token, page: this.page, per_page: this.per_page,
            user_name: this.user_name}}
        ).then(response => {
          this.items1 = response.body.data
          this.total1 = response.body.total
        }, (error) => {
          this.$message.error(error.body)
        })
      },
      onCurrentChange1 (currentPage) {
        this.page1 = currentPage
        this.getUserList(1)
      },
      onCurrentChange2 (currentPage) {
        this.page2 = currentPage
        this.getUserList(2)
      },
      onCurrentChange3 (currentPage) {
        this.page3 = currentPage
        this.getUserList(3)
      },
      handleChange () {
        if (this.activeName == "") {
          return
        }
        this.items2 = []
        this.total2 = 0
        this.page2 = 1
        this.$http.get(ENV.CPS_HOST_URL + "/statis/user_list",
          {params: { token: this.token, page: this.page2, per_page: this.per_page, pid: this.activeName}}
        ).then(response => {
          this.items2 = response.body.data
          this.total2 = response.body.total
        }, (error) => {
          this.$message.error(error.body)
        })
      },
      handleChange2 () {
        if (this.activeName2 == "") {
          return
        }
        this.items3 = []
        this.total3 = 0
        this.page3 = 1
        this.$http.get(ENV.CPS_HOST_URL + "/statis/user_list",
          {params: { token: this.token, page: this.page3, per_page: this.per_page, pid: this.activeName2}}
        ).then(response => {
          this.items3 = response.body.data
          this.total3 = response.body.total
        }, (error) => {
          this.$message.error(error.body)
        })
      },
      loadmap () {
        let myChart = this.$echarts.init(document.getElementById('second_chart'))
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
        this.times = []
        this.NewUser = []
        this.LoginUser = []
        this.PayUser = []
        this.Imoney = []
        this.game_name = []
        this.$http.get(ENV.CPS_HOST_URL + "/statis/statis_data_for_work", {
          params:{token: this.token, uid: uid, game_id: gameId, start_time:startTime, end_time:endTime}
        }).then( response => {
          let data = response.body
          for (let i in data.data.StatisData) {
            this.times[i] = data.data.StatisData[i].StatisDay
            this.game_name[i] = data.data.StatisData[i].GameName
            this.NewUser[i] = data.data.StatisData[i].NewUser || 0
            this.LoginUser[i] = data.data.StatisData[i].LoginUser || 0
            this.PayUser[i] = data.data.StatisData[i].PayUser || 0
            this.Imoney[i] = data.data.StatisData[i].Imoney || 0
          }
          this.headerdata = data.data
          this.TotalStatis = data.data
          this.loadmap()
        })
      }
    }
  }
</script>

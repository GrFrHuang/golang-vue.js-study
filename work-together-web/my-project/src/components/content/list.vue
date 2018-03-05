<template>
  <div>
    <section class="content-header">
      <h1>
        流水管理

        <small>查看游戏流水情况</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>流水</li>
        <li>
          <router-link to="/home/list">游戏流水管理</router-link>
        </li>
      </ol>
    </section>

    <div class="content">
      <div class="box">
        <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
          <el-tab-pane label="流水明细" name="first"></el-tab-pane>
          <el-tab-pane label="游戏汇总" name="second"></el-tab-pane>
          <el-tab-pane label="渠道汇总" name="third"></el-tab-pane>
        </el-tabs>
        <div class="box-header with-border">
          <div class="col-md-10 form-horizontal">
            <div class="form-group">
              <div class="col-lg-6 col-sm-12">
                <label v-show="(this.tabIndex !== 1)" class="col-sm-2 control-label">渠道名称:</label>
                <div v-show="(this.tabIndex !== 1)" class="col-sm-10 ipt_jianju">
                  <el-select v-model="selectedChannels" :clearable="true"
                             @change="doGetOrderList(1,sortData)" filterable multiple placeholder="请选择">
                    <el-option
                      v-for="(item,index) in channels"
                      :key="index"
                      :label="item.name"
                      :value="item.cp">
                    </el-option>
                  </el-select>
                </div>
                <label v-show="(this.tabIndex !== 2)" class="col-sm-2 control-label">游戏名称:</label>
                <div v-show="(this.tabIndex !== 2)" class="col-sm-10 ipt_jianju">
                  <el-select v-model="selectedGames" :clearable="true"
                             @change="doGetOrderList(1,sortData)" filterable multiple placeholder="请选择">
                    <el-option
                      v-for="(item,index) in games"
                      :key="index"
                      :label="item.game_name"
                      :value="item.game_id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">结算日期:</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-date-picker
                    v-model="time"
                    type="daterange"
                    :range="true"
                    :editable="false"
                    :clearable="false"
                    format="yyyy-MM-dd"
                    align="right"
                    :picker-options="pickerOptions2"
                    placeholder="选择日期范围" @change="doGetOrderList(1,sortData)">
                  </el-date-picker>
                </div>
                <label v-if="(this.tabIndex !== 1) && (this.tabIndex !== 2)"
                       class="col-sm-2 control-label">我方主体:</label>
                <div v-if="(this.tabIndex !== 1) && (this.tabIndex !== 2)" class="col-sm-10 ipt_jianju">
                  <el-select v-model="selectedMain" :clearable="true"
                             @change="doGetOrderList(1,sortData)" filterable placeholder="请选择">
                    <el-option
                      v-for="(item,index) in Mains"
                      :key="index"
                      :label="item.body_my"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="col-md-12" v-if="(this.tabIndex !== 1) && (this.tabIndex !== 2)">
              <div class="row form-group">
                <div class="col-md-3 post-btn">
                  <a class="btn btn-primary btn-block" :href='doDownloadOrderList()'>导出excel</a>
                </div>
              </div>
            </div>
            <div class="statistics">
              统计：流水总量【<b>{{ sumOrder }}</b>】元 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              利润【<b>{{ profit }}</b>】元

            </div>
          </div>
          <div class="box-body">
            <el-select v-model="selectedHeader" :clearable="true"
                       @change="showHeader" multiple placeholder="请选择">
              <el-option
                v-for="(item,index) in table_header"
                :key="index"
                :label="item.header_name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-table
              v-loading="isLoading"
              element-loading-text="拼命加载中"
              class="table table-bordered table-hover"
              :data="items"
              border
              stripe
              @sort-change="handleSort"
              style="width: 100%">
              <el-table-column
                fixed
                prop="start_time"
                label="日期"
                v-if="!table_header[0].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.start_time }} -- {{ scope.row.end_time}}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="game_name"
                label="游戏名称"
                v-if="!table_header[1].state && (this.tabIndex !== 2)"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.game_name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="cp_name"
                label="渠道名称"
                v-if="!table_header[2].state && (this.tabIndex !== 1)"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.cp_name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="cp_name"
                label="我方主体"
                v-if="!table_header[7].state && (this.tabIndex !== 1) && (this.tabIndex !== 2)"
                min-width="140">
                <template scope="scope">
                  <p v-if="scope.row.body_my === null" class="max_widths">----</p>
                  <p v-if="scope.row.body_my == 0" class="max_widths">无主体</p>
                  <p v-if="scope.row.body_my == 1" class="max_widths">云端</p>
                  <p v-if="scope.row.body_my == 2" class="max_widths">有量</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="total"
                label="总流水"
                v-if="!table_header[3].state"
                sortable='custom'
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ parseFloat(scope.row.total).toFixed(2) }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="profit"
                label="利润"
                v-if="!table_header[4].state"
                sortable='custom'
                min-width="140">
                <template scope="scope">
                  <p v-if="scope.row.profit === null" class="max_widths">----</p>
                  <p v-else="" class="max_widths">{{ parseFloat(scope.row.profit).toFixed(2) }}</p>
                </template>
              </el-table-column>
              <el-table-column
                label="订单下载"
                v-if="!table_header[5].state && (this.tabIndex !== 1) && (this.tabIndex !== 2)"
                min-width="100">
                <template scope="scope">
                  <el-button title="订单下载" class="fa fa-download table-hovers fa_hovers" type="text" size="small"
                             @click=getDownloadUrl(scope.row.start_time,scope.row.end_time,scope.row.game_id,scope.row.cp)>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="查看其他信息"
                v-if="!table_header[6].state && (this.tabIndex !== 1) && (this.tabIndex !== 2)"
                min-width="100">
                <template scope="scope">
                  <div class="result_report">
                    <a class="fa fa-eye" @click=detailItem(scope.row.cp,scope.row.game_id) title="查看"></a>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="box-footer">
            <Pagination
              v-show="pageInfo.total > pageInfo.limit"
              @current-change="handleCurrentChange"
              :current-page="pageInfo.currentPage"
              :page-size="pageInfo.limit"
              layout="prev, pager, next, jumper, total"
              :total="pageInfo.total">
            </Pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="查看流水详情"
      v-model="isShowEditForm"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <div>
        <div class="situation row">
          <label class="times_contracts">游戏名称:</label>
          <div class="col-sm-3 times_contract times_contracty">
            {{ detail.game_name }}

          </div>
        </div>
        <div class="situation row">
          <label class="times_contracts">渠道名称:</label>
          <div class="col-sm-3 times_contract times_contracty">
            {{ detail.channel_name }}

          </div>
        </div>
        <div class="situation row">
          <label class="times_contracts">首发时间:</label>
          <div class="col-sm-3 times_contract times_contracty">
            {{ detail.release_time }}

          </div>
        </div>
        <div class="situation row" style="color: red">
          <label class="times_contracts">首发日新增用户:</label>
          <div class="col-sm-3 times_contract times_contracty">
            {{ detail.first_day_user_count }}

          </div>
        </div>
        <div class="situation row" id="gname" style="color: red">
          <label class="times_contracts">首发日流水:</label>
          <div class="col-sm-3 times_contract times_contracty">
            {{ detail.first_day_order}}

          </div>
        </div>
        <div class="situation row">
          <label class="times_contracts">CP负责人:</label>
          <div class="col-sm-3 times_contract times_contracty">
            {{ detail.cp_resp_name }}

          </div>
        </div>
        <div class="situation row">
          <label class="times_contracts">渠道负责人:</label>
          <div class="col-sm-3 times_contract times_contracty">
            {{ detail.channel_resp_name }}

          </div>
        </div>
        <div class="situation row">
          <label class="times_contracts">运营负责人:</label>
          <div class="col-sm-3 times_contract times_contracty">
            {{ detail.operation_resp_name }}

          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="css">
  .sele {
    margin-left: 26px;
  }

  .list_select {
    min-width: 190px;
    max-width: 400px;
  }

  .btn_sunmit {
    margin-top: 20px;
  }

  .form-group_selection_time {
    width: 20%;
    min-width: 240px;
    margin-left: 15px;
  }

  .game_choose_list {
    margin-bottom: 20px;
  }

  .control-label_times {
    float: left;
    width: 12%;
    text-align: right;
  }

  .control-label_name {
    padding-right: 0px;
    padding-left: 0px;
  }
</style>
<style scoped>
  .el-date-editor--daterange.el-input {
    width: 100%;
  }

  .times_contracts {
    margin-top: 0;
  }

  .control-label {
    width: 94px;
  }

  .times_contracts {
    width: 50%;
  }

  .situation {
    font-size: 1.8rem;
  }
</style>
<script type="text/ecmascript-6">
  import Multiselect from 'vue-multiselect'
  import datepicker from 'vue-date'
  import utils from '../../publicjs/utils'
  import {Pagination} from 'element-ui'

  export default {
    components: {
      Multiselect,
      datepicker,
      Pagination,
    },
    data () {
      return {
        sumOrder: 0.0,
        profit: 0.0,
        tabIndex: 0,
        sortData: {},
        activeName2: 'first',
        time: [],
        selectedGames: [],
        selectedMain: '',
        games: [],
        Mains: [{id: 0, body_my: "无主体"},
          {id: 1, body_my: "云端"},
          {id: 2, body_my: "有量"},],
        selectedChannels: [],
        channels: [],
        items: [{
          game_id: '',
          game_name: '',
          cp: '',
          cp_name: '',
          is_channel_verified: '',
          is_cp_verified: '',
          start_time: '',
          total: ' ',
        }],
        isLoading: true,
        selectedHeader: [],
        table_header: [
          {
            id: 0,
            header_name: "日期",
            state: false
          }, {
            id: 1,
            header_name: "游戏名称",
            state: false
          }, {
            id: 2,
            header_name: "渠道名称",
            state: false
          }, {
            id: 3,
            header_name: "总流水",
            state: false
          }, {
            id: 4,
            header_name: "利润",
            state: false
          }, {
            id: 5,
            header_name: "订单下载",
            state: true
          }, {
            id: 6,
            header_name: "订单查看",
            state: true
          }, {
            id: 6,
            header_name: "我方主体",
            state: true
          }
        ],
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        pageInfo: {
          currentPage: 1,
          limit: ENV.PAGE_SHOW_COUNT,
          offset: 0,
          total: 0,
        },
        currentPage: 1,
        downloadUrl: "", // 下载链接
        isShowEditForm: false,
        detail: {
          game_name: "",
          channel_name: "",
          release_time: "",
          first_day_order: 0.0,
          first_day_user_count: 0,
          channel_resp_name: "",
          operation_resp_name: ""
        },
        form: null,
      }
    },
    methods: {
      showHeader: function () {
        for (let i in this.table_header) {
          if ((this.tabIndex !== 1) && (this.tabIndex !== 2)) {
            if (i === 5) {
              this.table_header[i].state = true
            }
          }
          this.table_header[i].state = false
        }
        for (let i in this.selectedHeader) {
          this.table_header[this.selectedHeader[i]].state = true
        }
      },
      detailItem(channelCode, gameId){
//        this.isShowEditForm = true
        this.readonly = true

        var url = '/order/detail?game_id=' + gameId + '&channel_code=' + channelCode
        this.$http.get(url)
          .then((res) => {
            this.detail = util.objectTransform(res.body, {})
            this.isShowEditForm = true
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: err.body
            })
          })

      },
      handleClick(tab, event) {
        if (tab.index == '0') {
          this.tabIndex = 0
          this.selectedHeader = [5]
        } else if (tab.index == '1') {
          this.tabIndex = 1
          this.selectedHeader = []
        } else {
          this.tabIndex = 2
          this.selectedHeader = []
        }
        let currentdate = this.parseCurrentDate()
        this.time = []
        this.selectedChannels = []
        this.selectedGames = []
        this.time.push(new Date(currentdate))
        this.time.push(new Date(currentdate))
      },
      handleCurrentChange(currentPage) {
        let offset = utils.buildOffsetByPage(currentPage, this.pageInfo.limit)
        this.pageInfo.offset = offset
        this.doGetOrderList(currentPage, this.sortData)
      },
      getGameSelectList: function () {
        var url = '/game/select' + '?flag=qdjr'
        this.$http.get(url)
          .then((res) => {
            this.games = res.body
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: err.body
            })
          })
      },
//      getMainSelectList: function () {
//        var url = '/order/body'
//        this.$http.get(url)
//          .then((res) => {
//            this.Mains = res.body
//          })
//          .catch((err) => {
//            this.$message({
//              type: "error",
//              message: err.body
//            })
//          })
//      },
      getChannelSelectList: function () {
        let url = '/order/channel/'
        this.$http.get(url)
          .then((res) => {
            this.channels = res.body
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: err.body
            })
          })
      },
      parseQuery: function () {
        let gameIds = []
        if (this.selectedGames.length !== 0) {
          for (let i in this.selectedGames) {
            gameIds.push(this.selectedGames[i])
          }
        }
//        let mainIds = []
//        if (this.selectedMain != '') {
//          for (let i in this.Mains) {
//            if (this.selectedMain == this.Mains[i].id) {
//              mainIds.push(this.Mains[i].game_id)
//            }
//          }
//        }
        let cps = []
        if (this.selectedChannels.length !== 0) {
          for (let i in this.selectedChannels) {
            cps.push(this.selectedChannels[i])
          }
        }
        let dates = []
        if (!_.isEmpty(this.time)) {
          if (this.time[0] !== null) {
            dates.push(">=" + this.time[0].format("yyyy-MM-dd"))
          }
          if (this.time[1] !== null) {
            dates.push("<=" + this.time[1].format("yyyy-MM-dd"))
          }
        } else {
          let currentdate = this.parseCurrentDate()
          dates.push(">=" + currentdate)
          dates.push("<=" + currentdate)
          this.time = []
          this.time.push(new Date(currentdate))
          this.time.push(new Date(currentdate))
        }

        let params = []
        if (gameIds.length !== 0) {
          params.push("game_id:in" + gameIds.join(","))
        }
        if (this.selectedMain.length !== 0 && this.tabIndex == 0) {
          params.push("body:in" + this.selectedMain)
        }
        if (cps.length !== 0) {
          params.push("cp:in" + cps.join(","))
        }
        if (dates.length !== 0) {
          params.push("date:" + dates.join("|"))
        }
        if (this.tabIndex === 0) {
          params.push("groupby:ingame_id, cp")
        } else if (this.tabIndex === 1) {
          params.push("groupby:ingame_id")
        } else {
          params.push("groupby:incp")
        }
        if (params.length > 0) {
          return "query=" + encodeURIComponent(params.join(";"))
        } else {
          return ""
        }
      },
      parseCurrentDate: function () {
        let date = new Date()
        // date.setDate(date.getDate() - 1)
        let seperator1 = "-"
        let month = date.getMonth() + 1
        let strDate = date.getDate()
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        return currentdate
      },
      doGetOrderList: function (page = 1, sortData) {
        console.log(sortData)
        this.pageInfo.currentPage = page
        let url = ENV.HOST_URL + "/order/data/"
        let query = this.parseQuery()
        if (query !== "") {
          url = url + "?" + query + "&offset=" + this.pageInfo.offset + "&limit=" + this.pageInfo.limit
        } else {
          url = url + "?offset=" + this.pageInfo.offset + "&limit=" + this.pageInfo.limit
        }

        if (sortData) {
          let order = sortData.order
          let prop = sortData.prop
          let isDescending = order === 'descending'
          url += order && !isDescending ? "&order=asc" : "&order=desc"
          url += prop ? "&sortby=" + prop : "&sortby=total"
          this.isLoading = true
          this.$http.get(url)
            .then((res) => {
              this.items = res.body.data
              this.pageInfo.total = res.body.total
              this.sumOrder = Number(res.body.sum)
              this.profit = Number(res.body.profit)
              this.isLoading = false
            })
            .catch((err) => {
              this.$message({
                type: "error",
                message: err.data
              })
            })
        }
      },
      doDownloadOrderList: function () {
        let xtoken = sessionStorage.getItem("token")
        let url = ENV.HOST_URL + "/order/download?"
        url = url + this.parseQuery() + "&_token=" + xtoken
        if (this.sortData) {
          let order = this.sortData.order
          let prop = this.sortData.prop
          let isDescending = order === 'descending'
          if (order) {
            url += isDescending ? "&order=desc" : "&order=asc"
          } else {
            url = url + "&order=desc"
          }

          url += prop ? "&sortby=" + prop : "&sortby=total"
        }
        return url
      },
      getDownloadUrl: function (start, end, game_id, cp) {
//        let dates = date_range.split('--')
//       var url = '/order/url/' + '?query=game_id:in' + game_id  + ';cp:in' + cp + ';date:>='+ dates[0] + '|<=' + dates[1]
        let url = '/order/url/' + '?game_id=' + game_id + '&cp=' + cp + '&start=' + start + '&end=' + end
        this.$http.get(url)
          .then((res) => {
            window.location.href = res.body.url
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: err.body
            })
          })
      },
      handleSort(obj) {
        if (!obj.prop) {
          return
        }
        console.log(obj)
        this.sortData = obj
        this.doGetOrderList(1, this.sortData)
      },
    },
    mounted: function () {
      this.getGameSelectList();
//      this.getMainSelectList();
      this.getChannelSelectList();
      this.doGetOrderList(1, this.sortData);
      this.selectedHeader = [5]
    }
  }
</script>


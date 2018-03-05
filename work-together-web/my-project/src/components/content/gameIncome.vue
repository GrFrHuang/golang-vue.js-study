<template>
  <div>
    <section class="content-header">
      <h1>
        游戏盈亏表
        <small>查看游戏盈亏情况</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>数据中心</li>
        <li>
          <router-link to="/home/gameIncome">游戏盈亏表</router-link>
        </li>
      </ol>
    </section>

    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="col-md-10 form-horizontal">
            <div class="form-group">
                  <div class="col-lg-6 col-sm-12">
                    <label class="col-sm-2 control-label">选择时间:</label>
                    <div class="col-sm-10 ipt_jianju">
                  <el-date-picker
                    v-model="timeRange"
                    type="daterange"
                    :range="true"
                    format="yyyy-MM-dd"
                    placeholder="选择日期范围" :picker-options="pickerOptions" @input="doGetDataList(1)">
                  </el-date-picker>
                </div>
                  <label class="col-sm-2 control-label">选择游戏:</label>
                  <div class="col-sm-10 ipt_jianju">
                  <!--<multiselect v-model="selectedGames" tag-placeholder="Add this as new tag" placeholder="请选择游戏"-->
                               <!--label="game_name" track-by="game_id" :options="games" :multiple="true" :taggable="false"-->
                               <!--@input="doGetDataList(1)"  :hide-selected="true" :close-on-select="false">-->
                  <!--</multiselect>-->
                    <el-select v-model="selectedGames" :clearable="true"
                               @change="doGetDataList(1)" filterable multiple placeholder="请选择">
                      <el-option
                        v-for="item in games"
                        :label="item.game_name"
                        :value="item">
                      </el-option>
                    </el-select>
                </div>
                </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">选择渠道:</label>
                <div class="col-sm-10 ipt_jianju">
                  <!--<multiselect v-model="selectedChannels" tag-placeholder="Add this as new tag" placeholder="搜索或添加渠道"-->
                               <!--label="name" track-by="cp" :options="channels" :multiple="true" :taggable="false"-->
                               <!--@input="doGetDataList(1)"  :hide-selected="true" :close-on-select="false">-->
                  <!--</multiselect>-->
                  <el-select v-model="selectedChannels" :clearable="true"
                             @change="doGetDataList(1)" filterable multiple placeholder="请选择">
                    <el-option
                      v-for="item in channels"
                      :label="item.name"
                      :value="item">
                    </el-option>
                  </el-select>
                </div>
              </div>
              </div>
          </div>
          <div class="box-body">
            <el-select v-model="selectedHeader" :clearable="true"
                       @change="showHeader" multiple placeholder="请选择">
              <el-option
                v-for="item in table_header"
                :key="item.id"
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
              style="width: 100%">
              <el-table-column
                fixed
                prop="game_name"
                label="游戏名称"
                v-if="!table_header[0].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.game_name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="cp_name"
                label="渠道名称"
                v-if="!table_header[1].state"
                min-width="160">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.cp_name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="yesterday"
                label="昨日盈亏"
                v-if="!table_header[2].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="today"
                label="今日盈亏"
                v-if="!table_header[3].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="accumulated"
                label="累计盈亏"
                v-if="!table_header[4].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ }}</p>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @current-change="onCurrentChange"
              :current-page="pageInfo.currPage"
              :page-size="pageInfo.limit"
              :total="pageInfo.total"
              layout="prev, pager, next, jumper">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
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
  .el-date-editor--daterange.el-input{
    width: 100%;
  }
  .control-label{
    width: 94px;
  }
</style>
<script type="text/ecmascript-6">
  import lista from './game_flow/lista'
  import Multiselect from 'vue-multiselect'
  import datepicker from 'vue-date'
  import utils from '../../publicjs/utils'
  import {Pagination} from 'element-ui'
  export default {
    components: {
      Multiselect,
      datepicker,
      Pagination
    },
    data () {
      return {
        timeRange: '',
        selectedGames: [],
        selectedChannels: [],
        selectedCps:[],
        games: [],
        channels:[],
        items: [],
        isLoading: true,
        pageInfo: {
          limit: ENV.PAGE_SHOW_COUNT,
          currPage: 1,
          total: 0,
          offset:0,
        },
        selectedHeader:[],
        table_header:[
          {
            id:0,
            header_name:"游戏名称",
            state:false
          },{
            id:1,
            header_name:"渠道名称",
            state:false
          },{
            id:2,
            header_name:"昨日盈亏",
            state:false
          },{
            id:3,
            header_name:"今日盈亏",
            state:false
          },{
            id:4,
            header_name:"累计盈亏",
            state:false
          }
        ],
        pickerOptions: {
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
      }
    },
    methods: {
      getGameSelectList: function () {
        var url = '/order/game/'
        this.$http.get(url)
          .then((res) => {
            this.games = res.body
          })
          .catch((err) => {
            context.error = err.data
            this.$message({
              type: "error",
              message: err.data
            })
          })
      },
      showHeader: function () {
        for(let i in this.table_header){
          this.table_header[i].state = false
        }
        for(let i in this.selectedHeader){
          console.log(this.table_header[this.selectedHeader[i]])
          console.log(this.table_header)
          this.table_header[this.selectedHeader[i]].state = true
          console.log(this.table_header[this.selectedHeader[i]])
        }
      },
      getChannelSelectList: function () {
        var url = '/order/channel/'
        this.$http.get(url)
          .then((res) => {
            this.channels = res.body
          })
          .catch((err) => {
            context.error = err.data
          })
      },
      reset(){
        this.selectedGamses = []
        this.selectedChannels = []
        this.timeRange = ""
        this.doGetDataList()
      },
      onCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.doGetDataList(currentPage)
      },
      doGetDataList(page=1) {
        this.pageInfo.currPage = page
        if (page == 1) {
          this.pageInfo.offset = 0
        }

        let gameIds = ""
        if (this.selectedGames && this.selectedGames.length != 0) {
          gameIds = _.map(this.selectedGames, 'game_id').join(",")
        }

        let channelCodes = ""
        if (this.selectedChannels && this.selectedChannels.length != 0) {
          channelCodes = _.map(this.selectedChannels, 'cp').join(",")
        }

        let startDate = ""
        let endDate = ""
        if (this.timeRange.length > 1) {
          if (this.timeRange[0] != null) {
            startDate = this.timeRange[0].format("yyyy-MM-dd")
          }
          if (this.timeRange[1] != null) {
            endDate = this.timeRange[1].format("yyyy-MM-dd")
          }
        }

        let query = util.buildGetParams({
          "start_time": startDate,
          "end_time": endDate,
          "games": gameIds,
          "channels": channelCodes,
          "limit": this.pageInfo.limit,
          "offset": util.buildOffsetByPage(page, this.pageInfo.limit),
        })
        console.log(query, this.timeStart)
        this.isLoading = true
        let url = '/order/gameIncome?' + query
        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data
            this.pageInfo.total = res.body.total
            this.isLoading = false
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    mounted: function () {
      this.getGameSelectList()
      this.getChannelSelectList()
      this.doGetDataList()
      let selected = []
      this.selectedHeader= selected
    },
  }
</script>


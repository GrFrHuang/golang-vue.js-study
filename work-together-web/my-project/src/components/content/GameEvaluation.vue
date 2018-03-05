<template>
  <div>
    <section class="content-header">
      <h1>
        游戏评测


        <small>查看游戏评测情况</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>游戏管理</li>
        <li><i class="fa fa-dashboard"></i>游戏评测</li>
        <li>
          <router-link to="/home/GameEvaluation">游戏评测</router-link>
        </li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="col-md-10 form-horizontal">
            <div class="form-group">
              <div class="col-sm-12 row">
                <div class="col-lg-6 col-sm-12">
                  <label class="col-sm-2 control-label">游戏选择:</label>
                  <div class="col-sm-10 ipt_jianju">
                    <el-select v-model="selectedGames" :multiple="true" :clearable="true" :filterable="true"
                               @change="doGetOrderList" filterable multiple placeholder="请选择">
                      <el-option
                        v-for="item in games"
                        :label="item.game_name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                  <label class="col-sm-2 control-label">评测人:</label>
                  <div class="col-sm-10 ipt_jianju">
                    <el-select v-model="selectedResultPersons" :clearable="true"
                               @change="doGetOrderList" filterable placeholder="请选择">
                      <el-option
                        v-for="item in resultPersons"
                        :label="item.nickname"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col-lg-6 col-sm-12">
                  <label class="col-sm-2 control-label">评测时间:</label>
                  <div class="col-sm-10 ipt_jianju">
                    <el-date-picker
                      v-model="time" @change="doGetOrderList"
                      type="daterange"
                      :range="true"
                      format="yyyy-MM-dd"
                      align="right"
                      :picker-options="pickerOptions2"
                      placeholder="选择日期范围">
                    </el-date-picker>
                  </div>
                  <label class="col-sm-2 control-label">游戏评级:</label>
                  <div class="col-sm-10 ipt_jianjus">
                    <el-select v-model="selectedResult" :clearable="true"
                               @change="doGetOrderList" filterable placeholder="请选择">
                      <el-option
                        v-for="item in results"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-12 form-group">
              <div class="col-md-2 post-btn">
                <a  style="margin-top: 10px" class="btn-block btn btn-primary" :href="downloadUrl" :disabled="downloadUrl==''">导出excel</a>
              </div>
              <el-tag
                class="ontags"
                v-for="tag in tags"
                :key="tag.user_id"
                :type="tag.type">
                {{tag.nick_name}}今日评测：{{tag.total}}款游戏
              </el-tag>
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
            @sort-change="handleSort"
            stripe
            style="width: 100%">
            <el-table-column
              prop="game_name"
              min-width="120"
              label="游戏名称"
              v-if="!table_header[0].state">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.game_name }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="result_time"
              label="评测时间"
              sortable='custom'
              min-width="140"
              v-if="!table_header[1].state">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.result_time | stampToTimeFull }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="peoples"
              label="评测人"
              min-width="140"
              v-if="!table_header[2].state">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.peoples == null ? "" : scope.row.peoples }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="ceping"
              label="游戏评级"
              min-width="100"
              v-if="!table_header[3].state">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.ceping == null ? "" : scope.row.ceping.name }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="grade"
              label="接入建议"
              min-width="120"
              v-if="!table_header[4].state">
              <template scope="scope">
                <p>
                  <span v-for="advise in scope.row.advises">
                    <span v-if="advise.adv!=undefined">
                      <span v-if="advise.adv=='接入'" class="fa fa-check" style="color: green"
                            :title="advise.nickname + '的建议：接入'"></span>&nbsp;
                      <span v-if="advise.adv=='不接入'" class="fa fa-close" style="color: red"
                            :title="advise.nickname + '的建议：不接入'"></span>&nbsp;
                    </span>
                  </span>
                </p>
              </template>
            </el-table-column>
            <el-table-column
              prop="updateinfo"
              label="更新人"
              min-width="120"
              v-if="!table_header[5].state">
              <template scope="scope">
                <p class="max_widths" v-if="scope.row.update_user">{{ scope.row.update_user.nickname
                  }} {{ scope.row.update_evaltime | stampToTimeFull }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="submitinfo"
              v-if="!table_header[6].state"
              label="提测人"
              min-width="140">
              <template scope="scope">
                <p class="max_widths" v-if="scope.row.user">{{ scope.row.user.nickname }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              v-if="!table_header[7].state">
              <template scope="scope">
                <div class="result_report">
                  <el-button title="查看" class="fa fa-eye" type="text" size="small"
                             @click=readDialog(scope.row)></el-button>
                  <el-button title="编辑" class="fa fa-edit" type="text" size="small"
                             @click=editDialog(scope.row)></el-button>
                  <a v-show="scope.row.result_report_word" class="fa fa-download table_hoverse" target="_blank"
                     :href="download(scope.row.result_report_word)" title="评测报告(word)下载"></a>&nbsp;&nbsp;
                  <a v-show="scope.row.result_report_excel" class="fa fa-download table_hoverse" target="_blank"
                     :href="download(scope.row.result_report_excel)" title="评测报告(excel)下载"></a>
                </div>
              </template>
            </el-table-column>

          </el-table>
        </div>
        <Pagination v-show="pageInfo.total > pageInfo.limit"
                    @current-change="handleCurrentChange"
                    :current-page="pageInfo.currentPage"
                    :page-size="pageInfo.limit"
                    layout="prev, pager, next, jumper, total"
                    :total="pageInfo.total">
        </Pagination>
      </div>
    </div>
    <el-dialog
      :title="readonly?'查看游戏评测':'编辑游戏评测'"
      v-model="isShowDialog"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <edit_evalgame :rand="rand" :readonly="readonly" :editId="editId" @close="onEditClose"></edit_evalgame>
    </el-dialog>
  </div>
</template>
<style>
  .ipt_jianju {
    margin-bottom: 20px;
    /*min-width: 251px;*/
  }

  .el-select {
    width: 100%;
  }

  /*.ipt_jianjus {*/
  /*min-width: 251px;*/
  /*}*/
  .max_widths {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
  }

  .max_widths:hover {
    text-overflow: inherit;
    overflow: visible;
    white-space: pre-line;
  }
</style>
<style scoped>
  .form-group{
    margin-bottom: 0;
  }
  .ontags {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    margin-top: 10px;
  }
  .control-label {
    width: 94px;
  }

  .el-date-editor--daterange.el-input {
    width: 100%;
  }

  .el-button + .el-button {
    margin: 0 5px;
  }
</style>
<script>
  import {Pagination} from 'element-ui'
  import util from '../../publicjs/utils'
  import edit_evalgame from './editGameEvaluation.vue'

  export default {
    components: {
      Pagination,
      util,
      edit_evalgame,
    },
    data: function () {
      return {
        tags: [],
        editId: 0,//编辑id
        isShowDialog: false,
        sortData: {},
        pageInfo: {
          currentPage: 1,
          limit: ENV.PAGE_SHOW_COUNT,
          offset: 0,
          total: 0,
        },
        selectedHeader: [],
        table_header: [
          {
            id: 0,
            header_name: "游戏名称",
            state: false
          }, {
            id: 1,
            header_name: "评测时间",
            state: false
          }, {
            id: 2,
            header_name: "评测人",
            state: false
          }, {
            id: 3,
            header_name: "游戏评级",
            state: false
          }, {
            id: 4,
            header_name: "接入建议",
            state: false
          }, {
            id: 5,
            header_name: "更新人",
            state: false
          }, {
            id: 6,
            header_name: "提测人",
            state: false
          }, {
            id: 7,
            header_name: "操作",
            state: false
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
        selectedGames: [],
        games: [],
        selectedResultPersons: null, //评测人
        resultPersons: [],
        time: '',
        selectedResult: null, //评测结果集
        results: [],
        items: [],
        isLoading: true,
        downloadUrl: "", // 下载链接
        rand: 0,
        readonly: false,
      }
    },
    methods: {
      download(fileId){
        return util.downloadFileUrl(fileId)
      },
      showHeader: function () {
        for (let i in this.table_header) {
          this.table_header[i].state = false
        }
        for (let i in this.selectedHeader) {
          this.table_header[this.selectedHeader[i]].state = true
        }
      },
      getGame: function () {
        var url = '/gameplan/'
        this.$http.get(url)
          .then((res) => {
            this.items = res.body
          })
      },
      handleCurrentChange(currentPage) {
        let offset = util.buildOffsetByPage(currentPage, this.pageInfo.limit)
        this.pageInfo.offset = offset
        this.doGetOrderList(currentPage, this.sortData)
      },
      getGameSelectList: function () {
        var url = '/game/select' + '?flag=pc'
        this.$http.get(url)
          .then((res) => {
            this.games = res.body
          })
      },
      doGetOrderList (page = 0, sortData) {
        this.isLoading = true
        if (page == 0) {
          this.pageInfo.offset = 0
        }
        let Ids = []
        if (this.selectedGames.length != 0) {
          for (let i in this.selectedGames) {
            Ids.push(this.selectedGames[i])
          }
        }
        let dates = []
        if (this.time.length > 1) {
          if (this.time[0] != null) {
            dates.push(this.time[0] / 1000)
          }
          if (this.time[1] != null) {
            dates.push(this.time[1] / 1000)
          }
        }
        let que = {
          "ids": Ids.join(","),
          "peoples": this.selectedResultPersons == null ? "" : this.selectedResultPersons == undefined ? "" : this.selectedResultPersons,
          "result": this.selectedResult == null ? "" : this.selectedResult == undefined ? "" : this.selectedResult,
          "time": dates.join(","),
          "limit": this.pageInfo.limit,
          "offset": this.pageInfo.offset,
          "flag": 'pc',
        }
        if (sortData) {
          let order = sortData.order
          let prop = sortData.prop
          let isDescending = order === 'descending'
          if (order) {
            if (isDescending) {
              que.order = "desc"
            } else {
              que.order = "asc"
            }
          } else {
            que.order = "desc"
          }

          if (prop) {
            que.sortby = prop
          } else {
            que.sortby = "create_time"
          }
        }

        let query = util.buildGetParams(que)
        var url = '/game/result?' + query
        let xtoken = sessionStorage.getItem("token")
        this.downloadUrl = ENV.HOST_URL + '/game/download?' + query + "&_token=" + xtoken
        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data
            for (let i in this.items) {
              let cepings = []
              if (this.items[i].cepingpeoples != null) {
                for (let j in this.items[i].cepingpeoples) {
                  cepings.push(this.items[i].cepingpeoples[j].nickname)
                }
              }
              let peoples = cepings.join("、")
              this.items[i].peoples = peoples
            }
            this.gettagsList();
            this.pageInfo.total = res.body.total
            this.isLoading = false
          })
      },
      getAccessPersonlist: function () {
        var url = '/user/devment/10'
        this.$http.get(url)
          .then((res) => {
            this.resultPersons = res.body
          })
      },
      gettagsList: function () {
        var url = '/game/PCStatistics'
        this.$http.get(url)
          .then((res) => {
            for (let i in res.body) {
              if (res.body[i].total > 0) {
                res.body[i].type = 'success'
              } else {
                res.body[i].type = 'danger'
              }
            }
            this.tags = res.body
          })
      },
      getResultslist: function () {
        var url = '/types/?query=type%3A6'
        this.$http.get(url)
          .then((res) => {
            this.results = res.body
          })
      },
      handleSort(obj) {
        if (!obj.prop) {
          return
        }
        this.sortData = obj
        this.doGetOrderList(0, this.sortData)
      },
      //弹出框
      editDialog(row){
        this.editId = row.id
        this.isShowDialog = true
        this.readonly = false
        this.rand = Math.random()
      },
      //查看框
      readDialog(row){
        this.editId = row.id
        this.isShowDialog = true
        this.readonly = true

        this.rand = Math.random()
      },
      //编辑弹出框
      onEditClose(needRefresh){
        this.isShowDialog = false
        if (needRefresh) {
          this.doGetOrderList(this.pageInfo.currentPage, this.sortData);
        }
      }
    },
    mounted: function () {
      this.isLoading = true
      this.getGameSelectList();
      this.doGetOrderList(0, this.sortData);
      this.getAccessPersonlist();
      this.gettagsList();
      this.getResultslist();
      let selected = []
      this.selectedHeader = selected
    }
  }
</script>

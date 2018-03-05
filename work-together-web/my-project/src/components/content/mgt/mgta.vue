<template>
  <div class="tab-pane active" id="tab_1">
    <section class="content-header">
      <h1>
        CP合同





        <small>查看CP合同</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>CP结算流</li>
        <li>
          <router-link to="/home/mgt/mgta">合同管理</router-link>
        </li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="col-md-10 form-horizontal">
            <div class="form-group">
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">游戏选择:</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-select v-model="selectedGames" :clearable="true"
                             @change="doGetOrderList" filterable multiple placeholder="请选择">
                    <el-option
                      v-for="item in games"
                      :label="item.game_name"
                      :value="item.game_id">
                    </el-option>
                  </el-select>
                </div>
                <label class="col-sm-2 control-label">合同状态:</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-select v-model="selectContractStatus" :clearable="true"
                             @change="doGetOrderList" filterable multiple placeholder="请选择">
                    <el-option
                      v-for="item in contractStatus"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">我方主体:</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-select v-model="selectedBody" :clearable="true"
                             @change="doGetOrderList" filterable placeholder="请选择">
                    <el-option
                      v-for="item in body"
                      :label="item.body"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
                <label class="col-sm-2 control-label">公司名称:</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-select v-model="selectedCompanies" :clearable="true"
                             @change="doGetOrderList" filterable multiple placeholder="请选择">
                    <el-option
                      v-for="item in companies"
                      :label="item.company_name"
                      :value="item.company_id">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="row form-group">
                <div class="col-md-4 post-btn">
                  <a class="btn btn-block btn-primary" :href="downloadUrl" :disabled="downloadUrl==''">导出excel</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="_list_tab">
          <div class="box-body">
            <el-dialog title="阶梯分成" v-model="dialogVisible" size="small">
              <el-table
                v-loading="isLoading"
                element-loading-text="拼命加载中"
                :data="ladders"
                border
                style="width: 100%">
                <el-table-column
                  prop="time"
                  label="生效时间"
                  width="195">
                  <template scope="scope">
                    <p>{{ scope.row.start_time }} ~ {{ scope.row.end_time}}</p>
                  </template>
                </el-table-column>
                <el-table-column label="规则">
                  <el-table-column
                    prop="money"
                    label="金额"
                    width="">
                    <template scope="scope">
                      <p v-for="rule in scope.row.rules">
                        <span v-if="rule.type=='money'">{{rule.begin}} ~ {{rule.end}}</span>
                      </p>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="time"
                    label="时间"
                    width="">
                    <template scope="scope">
                      <p v-for="rule in scope.row.rules">
                        <span v-if="rule.type=='time'">{{rule.begin}} ~ {{rule.end}}</span>
                      </p>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="user"
                    label="用户"
                    width="">
                    <template scope="scope">
                      <p v-for="rule in scope.row.rules">
                        <span v-if="rule.type=='user'">{{rule.begin}} ~ {{rule.end}}</span>
                      </p>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  label="我方比例">
                  <template scope="scope">
                    <p>{{ parseFloat(parseFloat(scope.row.ratio * 100).toFixed(2)) }}%</p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="通道费">
                  <template scope="scope">
                    <p>{{ parseFloat(parseFloat(scope.row.slotting_fee * 100).toFixed(2)) }}%</p>
                  </template>
                </el-table-column>
              </el-table>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
              </span>
            </el-dialog>
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
                prop="body_my"
                label="我方主体"
                v-if="!table_header[0].state"
                min-width="100">
                <template scope="scope">
                  <p class="max_widths">{{ bodyMy[scope.row.body_my] }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="issue"
                label="发行商"
                v-if="!table_header[1].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.channel_company_name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="game"
                label="游戏名称"
                v-if="!table_header[2].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.game ? scope.row.game.game_name : '' }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="begin_time"
                label="签订/终止时间"
                v-if="!table_header[3].state"
                min-width="160">
                <template scope="scope">
                  <p class="max_widths">
                    <span v-if="scope.row.begin_time>0">{{ scope.row.begin_time | stampToTime
                      }} ~ {{ scope.row.end_time | stampToTime }}</span>
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="合同状态"
                v-if="!table_header[4].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">
                    {{ scope.row.status ? scope.row.status.name : '' }}<span v-show="scope.row.file_id>0"></span>
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="ladder_front"
                label="阶梯分成"
                v-if="!table_header[5].state"
                min-width="120">
                <template scope="scope">
                  <p>
                     <span v-if="scope.row.ladder_front!=null && scope.row.ladder_front.length==1">
                    {{ parseFloat(parseFloat(scope.row.ladder_front[0].ratio * 100).toFixed(2)) }}% :
                    {{ parseFloat(parseFloat(scope.row.ladder_front[0].slotting_fee * 100).toFixed(2)) }}%
                  </span>
                    <span v-if="scope.row.ladder_front!=null && scope.row.ladder_front.length>1">
                    <el-button type="primary" @click="opendialog(scope.row.ladder_new)">查看</el-button>
                  </span>
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="create_time"
                label="创建时间"
                v-if="!table_header[6].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.create_time | stampToTime }}</p>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                prop="update_user"
                label="更新人"
                v-if="!table_header[7].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths"><span v-if="scope.row.update_user!=undefined">{{ scope.row.update_user.nickname
                    }} {{ scope.row.update_time | stampToTime }}</span></p>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                v-if="!table_header[8].state"
                min-width="100">
                <template scope="scope">
                  <div class="result_report">
                    <a class="fa fa-eye" @click=detailItem(scope.row.id) title="查看"></a>
                    <el-button title="编辑" class="fa fa-edit" type="text" size="small"
                               @click=editItem(scope.row.id)></el-button>
                    <span v-if="scope.row.file_id">
                      <span v-for="(file,index) in JSON.parse(scope.row.file_id)">
                        <a class="fa fa-download" target="_blank" :href="download(file)"
                           title="合同下载"></a>
                      </span>
                    </span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <Pagination v-show="pageInfo.total > pageInfo.limit"
                        @current-change="handleCurrentChange"
                        :current-page="pageInfo.currentPage"
                        :page-size="pageInfo.limit"
                        layout="prev, pager, next, jumper, total"
                        :total="pageInfo.total">
            </Pagination>
            <div>
              <el-button type="text" @click="showStatistics">合同寄出&归档情况</el-button>
              <!--<el-button type="text" @click="showLog">操作日志</el-button>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="readonly?'查看CP合同':'编辑CP合同'"
      v-model="isShowEditForm"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <edit :rand="rand" :editId="editId" :readonly="readonly" :flag="flag" @close="onEditClose"></edit>
    </el-dialog>
    <el-dialog title="合同寄出&归档情况" v-model="View_details">
      <el-table :data="gridData" style="width: 100%" @expand="getDayDetail">
        <el-table-column type="expand">
          <template scope="scope">
            <table style="width: 91%;margin-left: 9%">
              <tr v-for="item in scope.row.details">
                <td style="width:33.33%;background:rgb(234, 234, 234)">{{ item.people.nickname }}</td>
                <td style="width:33.33%;background:rgb(234, 234, 234)">{{ item.send }}</td>
                <td style="width:33.33%;background:rgb(234, 234, 234)">{{ item.complete }}</td>
              </tr>
            </table>
          </template>
        </el-table-column>
        <el-table-column label="日期" prop="time">
        </el-table-column>
        <el-table-column label="已寄出合同" prop="send">
        </el-table-column>
        <el-table-column label="已归档合同" prop="complete">
        </el-table-column>
      </el-table>
      <Pagination v-show="pageInfo2.total > pageInfo2.limit"
                  @current-change="handleCurrentChange2"
                  :current-page="pageInfo2.currentPage"
                  :page-size="pageInfo2.limit"
                  layout="prev, pager, next, jumper, total"
                  :total="pageInfo2.total">
      </Pagination>
    </el-dialog>
  </div>
</template>
<style scoped>
  .control-label {
    width: 94px;
  }

  .el-date-editor--daterange.el-input {
    width: 100%;
  }

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
<style>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-form-item__label {
    float: left !important;
  }

  .margin_item {
    margin-right: 0 !important;
  }

  .margin_item .el-form-item__content {
    width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
  }

  .margin_item .el-form-item__content:hover {
    text-overflow: inherit;
    overflow: visible;
    white-space: pre-line;
  }

  .el-table__expanded-cell {
    padding: 0 !important;
  }
</style>
<script>
  import {Pagination} from 'element-ui'
  import util from '../../../publicjs/utils'
  import editContract from '../edit_contractv2.vue'
  export default {
    components: {
      Pagination,
      edit: editContract
    },
    data: function () {
      return {
        pageInfo: {
          currentPage: 1,
          limit: ENV.PAGE_SHOW_COUNT,
          offset: 0,
          total: 0,
        },
        pageInfo2: {
          currentPage: 1,
          limit: ENV.PAGE_SHOW_COUNT,
          offset: 0,
          total: 0,
        },
        isLoading: true,
        selectedGames: [],
        games: [],
        selectedHeader: [],
        downloadUrl: "", // 下载链接
        table_header: [
          {
            id: 0,
            header_name: "我方主体",
            state: false
          }, {
            id: 1,
            header_name: "发行商",
            state: false
          }, {
            id: 2,
            header_name: "游戏名称",
            state: false
          }, {
            id: 3,
            header_name: "签订/终止时间",
            state: false
          }, {
            id: 4,
            header_name: "合同状态",
            state: false
          }, {
            id: 5,
            header_name: "阶梯分成",
            state: false
          }, {
            id: 6,
            header_name: "创建时间",
            state: false
          }, {
            id: 7,
            header_name: "更新人",
            state: false
          }, {
            id: 8,
            header_name: "操作",
            state: false
          }
        ],
        parentMessage: 'Parent',
        items: [],
        selectContractStatus: '',
        contractStatus: [],
        bodyMy: ["无主体", "云端", "有量"],
        selectedBody: '',
        body: [
          {id: 0, body: "无主体"},
          {id: 1, body: "云端"},
          {id: 2, body: "有量"}],
        dialogVisible: false,
        ladders: [],
        gridData: [],
        operateLog: [],
        View_details: false,
        isShowEditForm: false,
        editId: 0,
        readonly: false,
        flag: 'cp',
        rand: 0,

        selectedCompanies: [],
        companies: [],
      }
    },
    mounted: function () {
      this.getGameSelectList();
      this.getCompanySelectList();
      this.getContract();
      this.getContractStatusList();
      let selected = []
      this.selectedHeader = selected
    },
    methods: {
      getDayDetail(row, expanded){
        if (row.details || !expanded) {
          return
        }
        let query = util.buildGetParams({
          "flag": "cp",
          "time": row.time,
        })
        var url = '/contractStatistics/getDayDetail/?' + query
        this.$http.get(url)
          .then(({data}) => {
            this.$set(row, "details", data)
          })
      },
      //显示合同寄出统计详情
      showStatistics: function (page = 0) {
        if (page == 0) {
          this.pageInfo2.offset = 0
        }
        let query = util.buildGetParams({
          "flag": "cp",
          "limit": this.pageInfo2.limit,
          "offset": this.pageInfo2.offset,
        })
        var url = '/contractStatistics/?' + query
        this.$http.get(url)
          .then((res) => {
            this.gridData = res.body.data
            this.pageInfo2.total = res.body.total
          })
        this.View_details = true
      },
      handleCurrentChange2(currentPage) {
        let offset = util.buildOffsetByPage(currentPage, this.pageInfo2.limit)
        this.pageInfo2.offset = offset
        this.showStatistics(currentPage)
      },
      //获取合同状态列表
      getContractStatusList: function () {
        var url = '/types/?query=type%3A10'
        this.$http.get(url)
          .then((res) => {
            this.contractStatus = res.body
          })
      },
      reset: function () {
        this.selectedGames = []
        this.selectContractStatus = ''
        this.selectedBody = ''
        this.doGetOrderList()
      },
      showHeader: function () {
        for (let i in this.table_header) {
          this.table_header[i].state = false
        }
        for (let i in this.selectedHeader) {
          this.table_header[this.selectedHeader[i]].state = true
        }
      },
      //查看
      detailItem(id){
        this.isShowEditForm = true
        this.editId = id
        this.readonly = true

        this.rand = Math.random()
      },
      //编辑
      editItem(id){
        let url = '/distributionCompany/companyname/'
        this.$http.get(url)
          .then((res) => {
            this.companies = res.body
          })
        this.isShowEditForm = true
        this.editId = id
        this.readonly = false
        this.rand = Math.random()
      },
      // 编辑对话框关闭
      onEditClose(needRefresh){
        this.isShowEditForm = false
        this.readonly = false
        if (needRefresh) {
          this.doGetOrderList(this.pageInfo.currentPage)
        }
      },
      opendialog: function (ladders) {
        this.ladders = []
        if (ladders != null) {
          let ladder = JSON.parse(ladders)
          for (let i in ladder) {
//            this.ladders.push({username:ladder[i].split(":")[0],password:ladder[i].split(":")[1]})

            if (ladder[i].rule) {
              let rules = []
              let rulesString = ladder[i].rule.split("&")
              for (let j in rulesString) {
                let ru = rulesString[j]
                let begin, type, end
                [begin, type, end] = ru.split("<")
                rules.push({
                  begin, type, end
                })
              }
              ladder[i].rules = rules
            }
            this.ladders.push(ladder[i])
          }
        }
        this.dialogVisible = true
      },
      handleCurrentChange(currentPage) {
        let offset = util.buildOffsetByPage(currentPage, this.pageInfo.limit)
        this.pageInfo.offset = offset
        this.doGetOrderList(currentPage)
      },
      download(fileId){
        return util.downloadFileUrl(fileId)
      },
      editContract: function (id) {
        this.readonly = false
        this.editId = id
        this.isShowEditForm = true
      },
      getGameSelectList: function () {
        var url = '/game/select' + '?flag=cpht'
        this.$http.get(url)
          .then((res) => {
            this.games = res.body
          })
      },
      getCompanySelectList: function () {
        let url = '/distributionCompany/companyname/'
        this.$http.get(url)
          .then((res) => {
            this.companies = res.body
          })
      },
      getContract: function () {
        this.doGetOrderList(0)
      },
      doGetOrderList: function (page = 0) {
        if (page == 0) {
          this.pageInfo.offset = 0
        }
        let gameIds = []
        if (this.selectedGames.length != 0) {
          for (let i in this.companies) {
            gameIds.push(this.selectedGames[i])
          }
        }
        if (this.selectedCompanies.length > 0) {
          for (var i = 0; i < this.companies.length; i++) {
            for (var j = 0; j < this.selectedCompanies.length; j++) {
              if (this.companies[i].company_id === this.selectedCompanies[j]) {
                gameIds.push(this.companies[i].gameids)
                break
              }
            }
          }
          gameIds.push(-1)
        }
        let query = util.buildGetParams({
          "gameids": gameIds.join(","),
          "status": this.selectContractStatus.join(","),
          "body": this.selectedBody,
          "flag": "cp",
          "limit": this.pageInfo.limit,
          "offset": this.pageInfo.offset,
        })
        this.isLoading = true
        let url = '/contract/?' + query

        let xtoken = sessionStorage.getItem("token")
        this.downloadUrl = ENV.HOST_URL + '/contract/cpDownload?' + query + "&_token=" + xtoken

        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data
            this.pageInfo.total = res.body.total
            this.isLoading = false
          })
      },
    }
  }
</script>

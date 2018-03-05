<template>
  <div class="tab-pane active" id="tab_1">
    <section class="content-header">
      <h1>
        渠道详情
        <small>查看渠道详情</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>数据中心</li>
        <li>
          <router-link to="/home/mgt/mgta">渠道详情</router-link>
        </li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="col-md-10 form-horizontal">
            <div class="form-group">
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">渠道名称:</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-select v-model="selectedChannels" :clearable="true"
                             @change="getChannelData" filterable multiple placeholder="请选择">
                    <el-option
                      v-for="item in channels"
                      :label="item.name"
                      :value="item.cp">
                    </el-option>
                  </el-select>
                </div>
                </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">渠道负责人:</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-select v-model="selectedPersons" :clearable="true"
                             @change="getChannelData" filterable multiple placeholder="请选择">
                    <el-option
                      v-for="item in persons"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="_list_tab">
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
                prop="body_my"
                label="渠道名称"
                v-if="!table_header[0].state"
                min-width="100">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.channel_name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="issue"
                label="游戏数量"
                v-if="!table_header[1].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.game_count }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="game"
                label="已签合同"
                v-if="!table_header[2].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.signed }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="begin_time"
                label="未签合同"
                v-if="!table_header[3].state"
                min-width="160">
                <template scope="scope">
                  <p style="color: red">{{ scope.row.not_sign }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="未对账数"
                v-if="!table_header[4].state"
                min-width="120">
                <template scope="scope">
                  <p style="color: red">{{ scope.row.not_verify }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="ladder_front"
                label="应付金额"
                v-if="!table_header[5].state"
                min-width="120">
                <template scope="scope">
                  <p>{{ scope.row.should_pay }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="create_time"
                label="回款金额"
                v-if="!table_header[6].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.paid }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="update_user"
                label="未回款金额"
                v-if="!table_header[7].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths"  style="color: red">{{ scope.row.not_pay }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="update_user"
                label="渠道负责人"
                v-if="!table_header[8].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.resps }}</p>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                v-if="!table_header[9].state"
                min-width="100">
                <template scope="scope">

                  <div class="result_report">
                    <a class="fa fa-eye" @click=detailItem(scope.row.channel_code,scope.row.channel_name,scope.row.resps) title="查看"></a>
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
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="查看渠道详情"
      v-model="isShowEditForm"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <div>
        <div class="content">
          <div class="box">
            <div class="box-body form-horizontal">
              <div class="form-group ">
                <label class="col-md-2 control-labels">渠道名称：</label>
                <div class="col-md-6">
                  {{ channel_name }}
                </div>
              </div>

              <div class="form-group ">
                <label class="col-md-2 control-labels">渠道负责人：</label>
                <div class="col-md-6">
                  {{ resps }}
                </div>
              </div>

              <div class="form-group ">
                <label class="col-md-2 control-labels">游戏合同：</label>
                <div class="col-md-6">
                  <p class="control-label_ps"><span style="color: red">{{ not_sign_games }}</span>{{ signed_games }}</p>
                  <p class="control_p_color">共{{ Total }}款游戏，其中有{{ Totals }}款合同未签订<router-link to="/home/channelContract/channelContractA">查看详情</router-link></p>
                </div>
              </div>

              <div class="form-group ">
                <label class="col-md-2 control-labels">未对账月份：</label>
                <div class="col-md-6">
                  <p>{{ not_verify_months }}</p>
                  <p class="control_p_color">共{{ reconciled }}个月未对账</p>
                </div>
              </div>

              <!--<div class="form-group ">-->
                <!--<label class="col-md-2 control-labels">最近回款：</label>-->
                <!--<div class="col-md-6">-->
                  <!--<el-table-->
                    <!--class="table table-bordered table-hover"-->
                    <!--:data="items"-->
                    <!--border-->
                    <!--stripe-->
                    <!--style="width: 100%">-->
                    <!--<el-table-column-->
                      <!--prop="body_my"-->
                      <!--label="回款日期"-->
                      <!--min-width="100">-->
                      <!--<template scope="scope">-->
                        <!--<p class="max_widths">2017-04-01</p>-->
                      <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column-->
                      <!--prop="issue"-->
                      <!--label="金额"-->
                      <!--min-width="120">-->
                      <!--<template scope="scope">-->
                        <!--<p class="max_widths">600</p>-->
                      <!--</template>-->
                    <!--</el-table-column>-->
                  <!--</el-table>-->
                  <!--<p class="control_p_color">仅显示最近5次回款</p>-->
                <!--</div>-->
              <!--</div>-->
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped>
  .control-label{
    width: 107px;
  }
  .control-labels{
    width: 117px;
    text-align: right;
  }
  .control-label_ps{
    margin: 0;
  }
  .el-date-editor--daterange.el-input{
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
  .control_p_color{
    color: #a3a3a3;
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
  .el-form-item__label{
    float: left!important;
  }
  .margin_item{
    margin-right: 0!important;
  }
  .margin_item .el-form-item__content{
    width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
  }
  .margin_item .el-form-item__content:hover{
    text-overflow: inherit;
    overflow: visible;
    white-space: pre-line;
  }
  .el-table__expanded-cell{
    padding: 0!important;
  }
</style>
<script>
  import Multiselect from 'vue-multiselect'
  import {Pagination} from 'element-ui'
  import util from '../../publicjs/utils'
//  import editContract from './editChanneldetails.vue'
  export default {
    components: {
      Pagination,
      Multiselect,
//      edit: editContract
    },
    data: function () {
      return {
        pageInfo: {
          currentPage: 1,
          limit: ENV.PAGE_SHOW_COUNT,
          offset: 0,
          total: 0,
        },
        isLoading: true,
        selectedChannels: [],
        games: [],
        channel_name:null,
        resps:null,
        Total:null,
        not_sign_games:null,
        signed_games:null,
        Totals:null,
        not_verify_months:null,
        reconciled:null,
        selectedHeader:[],
        table_header:[
          {
            id:0,
            header_name:"渠道名称",
            state:false
          },{
            id:1,
            header_name:"游戏数量",
            state:false
          },{
            id:2,
            header_name:"已签合同",
            state:false
          },{
            id:3,
            header_name:"未签合同",
            state:false
          },{
            id:4,
            header_name:"未对账数",
            state:false
          },{
            id:5,
            header_name:"应付金额",
            state:false
          },{
            id:6,
            header_name:"回款金额",
            state:false
          },{
            id:7,
            header_name:"未回款金额",
            state:false
          },{
            id:8,
            header_name:"渠道负责人",
            state:false
          },{
            id:9,
            header_name:"操作",
            state:false
          }
        ],
        parentMessage: 'Parent',
        items: [],
        selectContractStatus: [],
        contractStatus: [],
        bodyMy: ["无主体", "云端", "有量"],
        selectedBody: [],
        body: [
          {id: 0, body: "无主体"},
          {id: 1, body: "云端"},
          {id: 2, body: "有量"}],
        dialogVisible: false,
        ladders: [],
        gridData: [],
        View_details: false,
        isShowEditForm: false,
        readonly: false,
        flag: 'cp',
        channels:[],
        details: {
          channel_code: "",
          channel_name: "",
          channel_resp: "",
          not_sign_games: [],
          signed_games: [],
          not_verify_months: [],
          latest_paid_dates: []
        },
        persons: [],
        selectedPersons:[],
      }
    },
    mounted: function () {
      this.getChannelSelectList()
      this.getPersonSelectList()
      this.selectedHeader = []
      this.getChannelData()
    },
    methods: {
      getChannelSelectList: function () {
        let url = '/channelCompany/channels/'
        this.$http.get(url)
          .then((res) => {
            this.channels = res.body
          })
      },
      getPersonSelectList: function () {
        let url = '/order/responsepersons/'
        this.$http.get(url)
          .then((res) => {
            this.persons = res.body
          })
      },

      getChannelData: function () {
        let query = util.buildGetParams({
          "offset|page": this.pageInfo,
          "channel_code": this.selectedChannels.join(","),
          "resp_person": this.selectedPersons.join(",")
        })
        let url = "/order/channeldata/?" + query
        this.isLoading = true
        this.$http.get(url)
          .then(({data}) => {
            this.items = data.data;
            this.pageInfo.total = data.total
            this.isLoading = false
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: err.body
            })
            this.isLoading = false
          })
      },
      showHeader: function () {
        for(let i in this.table_header){
          this.table_header[i].state = false
        }
        for(let i in this.selectedHeader){
          this.table_header[this.selectedHeader[i]].state = true
        }
      },
      //查看
      detailItem(channelCode,channel_name,resps){
        this.isShowEditForm = true
        this.readonly = true
        this.channel_name = channel_name
        this.resps = resps
        var url = '/order/channeldetail?channel_code=' + channelCode
        this.$http.get(url)
          .then((res) => {
            this.detail = util.objectTransform(res.body, {
            })
            this.Total = this.detail.not_sign_games.length+this.detail.signed_games.length
            this.Totals = this.detail.not_sign_games.length
            let sign_games = this.detail.not_sign_games
            this.not_sign_games = sign_games.join("，")
            let ned_games = this.detail.signed_games
            this.signed_games = ned_games.join("，")
            let verify_months = this.detail.not_verify_months
            this.not_verify_months = verify_months.join("，")
            this.reconciled = this.detail.not_verify_months.length
            console.log(this.not_verify_months)
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: err.body
            })
          })
      },
      // 编辑对话框关闭
      onEditClose(needRefresh){
        this.isShowEditForm = false
        this.readonly = false
        if (needRefresh) {
          this.getChannelData(this.pageInfo.currentPage)
        }
      },
      handleCurrentChange(currentPage) {
        let offset = util.buildOffsetByPage(currentPage, this.pageInfo.limit)
        this.pageInfo.offset = offset
        this.pageInfo.currPage = currentPage
        this.getChannelData()
      },

    }
  }
</script>

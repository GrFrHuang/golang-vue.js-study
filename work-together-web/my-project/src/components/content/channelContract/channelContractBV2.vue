<template>
  <div>
    <section class="content-header">
      <h1>
        渠道对账
        <small>查看渠道对账单</small>
      </h1>
      <ol class="breadcrumb">
        <li>
          <i class="fa fa-dashboard"></i>渠道回款流
        </li>
        <li>
          <router-link to="/home/channelContract/channelContractB">对账管理</router-link>
        </li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="form-horizontal">
            <div class="form-group">
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">渠道</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-select
                    style="width:100%"
                    v-model="selectedChannels"
                    :multiple="true" :clearable="true" :filterable="true"
                    @change="getChanVList"
                    placeholder="渠道">
                    <el-option
                      v-for="item in channels"
                      :label="item.name"
                      :value="item.cp">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">状态</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-select
                    style="width:100%"
                    v-model="selectedStatus"
                    :clearable="true"
                    @change="getChanVList"
                    placeholder="状态">
                    <el-option
                      v-for="item in status"
                      :label="item.desc"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">账单日期</label>
                <!--<div class="col-sm-10 ipt_jianju">-->
                <!--<el-date-picker-->
                <!--v-model="timeRange"-->
                <!--type="daterange"-->
                <!--:range="true"-->
                <!--format="yyyy-MM"-->
                <!--align="right"-->
                <!--:picker-options="pickerOptions2"-->
                <!--placeholder="选择日期范围" @input="getChanVList">-->
                <!--</el-date-picker>-->
                <!--</div>-->
                <div class="col-sm-9 ipt_jianju">
                  <el-date-picker
                    v-model="timeStart"
                    type="month"
                    placeholder="选择开始月" @input="getChanVList(1)">
                  </el-date-picker>
                  <el-date-picker
                    v-model="timeEnd"
                    type="month"
                    placeholder="选择结束月" @input="getChanVList(1)">
                  </el-date-picker>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">对账人</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-select
                    style="width:100%"
                    v-model="selectedUser"
                    :clearable="true"
                    @change="getChanVList"
                    placeholder="对账人">
                    <el-option
                      v-for="item in users"
                      :label="item.nickname"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">主体</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-select
                    style="width:100%"
                    v-model="bodyMy"
                    :clearable="true"
                    @change="getChanVList"
                    placeholder="主体">
                    <el-option label="云端" :value="1"></el-option>
                    <el-option label="有量" :value="2"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label"></label>
                <div class="col-sm-10 ipt_jianju">
                  <button class="btn btn-primary" @click="editOrAddItem(0)">添加对账</button>
                  <el-badge :value="pageInfoNotVerify.total" class="item">
                    <button class="btn btn-primary" @click="showNotVerify">查看未对账 </button>
                  </el-badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- /.box-header -->
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
              fixed
              prop="date"
              label="账单日期"
              v-if="!table_header[0].state"
              min-width="120">
              <template scope="scope">
                <p>{{ scope.row.date }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="body_my"
              label="我方主体"
              v-if="!table_header[1].state"
              sortable='custom'
              min-width="120">
              <template scope="scope">
                <p>
                  <span v-if="scope.row.body_my===1">云端</span>
                  <span v-else>有量</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column
              prop="company"
              label="渠道"
              v-if="!table_header[2].state"
              min-width="140">
              <template scope="scope">
                <p class="max_widths"><span v-if="scope.row.channel">{{ scope.row.channel.name }}</span></p>
              </template>
            </el-table-column>
            <el-table-column
              prop="pre_verify"
              label="游戏"
              v-if="!table_header[3].state"
              min-width="160">
              <template scope="scope">
                <p class="max_widths">{{previewGame(scope.row.pre_verify)}}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              v-if="!table_header[4].state"
              min-width="120">
              <template scope="scope">
                <p class="max_widths">{{ previewStatus(scope.row.status) }}</p>
              </template>
              <!---->
            </el-table-column>
            <el-table-column
              prop="status"
              label="开票日期"
              v-if="!table_header[11].state"
              min-width="120">
              <template scope="scope">
                <p class="max_widths" v-if="scope.row.billing_date">{{ scope.row.billing_date }}</p>
                <p class="max_widths" v-else>——</p>
              </template>
              <!---->
            </el-table-column>
            <el-table-column
              prop="amount_my"
              label="我方流水"
              v-if="!table_header[5].state"
              min-width="120">
              <template scope="scope">
                <p>{{ scope.row.amount_my }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="amount_payable"
              label="应收金额"
              v-if="!table_header[6].state"
              min-width="120">
              <template scope="scope">
                <p>{{ scope.row.amount_payable }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="amount_settle"
              label="回款金额"
              v-if="!table_header[7].state"
              min-width="120">
              <template scope="scope">
                <p>{{ scope.row.amount_remit }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="nickname"
              label="对账人"
              v-if="!table_header[8].state"
              class="text-center"
              min-width="140">
              <template scope="scope">
                <p>
                 <span v-if="scope.row.verify_user">
                  {{ scope.row.verify_user.nickname }} ({{ scope.row.verify_time | stampToTime}})
                </span>
                </p>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              prop="updated_time"
              label="更新人"
              v-if="!table_header[9].state"
              min-width="140">
              <template scope="scope">
                <p class="max_widths">
                 <span v-if="scope.row.updated_user">
                  {{ scope.row.updated_user.nickname }} ({{ scope.row.updated_time | stampToTimeFull}})
                </span>
                </p>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              v-if="!table_header[10].state"
              min-width="100">
              <template scope="scope">
                <!--<el-button-->
                <!--title="对账单预览"-->
                <!--type="text" size="small"-->
                <!--class="fa fa-file-text-o "-->
                <!--v-if="scope.row.file_preview_id"-->
                <!--@click="preview(scope.row.file_preview_id)"></el-button>-->
                <a v-if="scope.row.file_id" :href="download(scope.row.file_id)" target="_blank" title="对账单下载">
                  <span class="fa fa-download "></span>
                </a>
                <el-button type="text" size="small" title="查看" class="fa fa-eye"
                           @click=detailItem(scope.row.id)></el-button>
                <el-button type="text" size="small" class="fa fa-edit " @click="editOrAddItem(scope.row.id)"
                           title="对账单编辑"></el-button>
                <el-button type="text" size="small" class="fa fa-trash " @click="deleteItem(scope.row.id)"
                           title="删除对账单"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="onCurrentChange"
            :current-page="pageInfo.currPage"
            :page-size="pageInfo.limit"
            :total="pageInfo.total"
            layout="prev, pager, next, jumper, total">
          </el-pagination>
          <div class="statistics">
            统计：今日新增账单 <b>{{statistics.today}}</b> 条 , 昨日新增账单 <b>{{statistics.yesterday}}</b> 条

          </div>
        </div>
      </div>
    </div>

    <el-dialog
      :title="editId?'编辑对账单':'添加对账单'"
      v-model="isShowItemForm"
      top="5%" size="large"
      :close-on-click-modal="false">
      <editor :rand="rand" :editId="editId" :readonly="readonly" :defaultValue="formDefaultItem"
              @emptyDefault="formDefaultItem=null" @close="onEditClose"></editor>
    </el-dialog>

    <el-dialog
      :title="'未对账 ( ' +pageInfoNotVerify.total+' )'"
      v-model="isShowNotVerify"
      top="5%"
      size="large">
      <el-table
        v-loading="isLoadingNotVerify"
        element-loading-text="拼命加载中"
        class="table table-bordered table-hover"
        :data="notVerifyItems"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          min-width="120">
          <template scope="scope">
            <p>{{ scope.row.date }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="渠道"
          min-width="120">
          <template scope="scope">
            <p>{{ scope.row.channel.name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="主体"
          min-width="120">
          <template scope="scope">
            <span v-if="scope.row.body_my===1">快发</span>
            <span v-else-if="scope.row.body_my===2">有量</span>
            <span v-else>未找到合同</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="金额"
          min-width="120">
        </el-table-column>

        <el-table-column
          prop=""
          label="操作"
          min-width="120">
          <template scope="scope">
            <el-button type="text" @click="addVerifyFromNotVerify(scope.row)">添加对账</el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-pagination
        @current-change="onNotVerifyCurrentChange"
        :current-page="pageInfoNotVerify.currPage"
        :page-size="pageInfoNotVerify.limit"
        :total="pageInfoNotVerify.total"
        layout="prev, pager, next, jumper, total">
      </el-pagination>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
  import util from '../../../publicjs/utils'
  import addChannel from '../channelOfReconciliationv2.vue'

  export default {
    components: {
      'editor': addChannel,
    },
    data: function () {
      return {
        isShowItemForm: false,
        editId: 0,
        formDefaultItem: null,
        readonly: false,

        isLoadingNotVerify: false,
        isShowNotVerify: false,
        notVerifyItems: [], // 未对账的数据

        selectedGames: [],
        selectedUser: null,
        selectedStatus: null,
        bodyMy: null,
        timeRange: "",
        timeStart: "", // 日期选择
        timeEnd: "", // 日期选择
        selectedHeader: [],
        table_header: [{id: 0, header_name: "账单日期", state: false}, {id: 1, header_name: "我方主体", state: false},
          {id: 2, header_name: "渠道", state: false}, {id: 3, header_name: "游戏", state: false},
          {id: 4, header_name: "状态", state: false}, {id: 5, header_name: "我方流水", state: false},
          {id: 6, header_name: "应收金额", state: false}, {id: 7, header_name: "回款金额", state: true},
          {id: 8, header_name: "对账人", state: false}, {id: 9, header_name: "更新人", state: false},
          {id: 10, header_name: "操作", state: false}, {id: 11, header_name: "开票日期", state: true}
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
        games: [],
        users: [],
        invoker: [],

        statistics: {}, // 统计

        selectedChannels: [],
        preItem: {},

        items: [],
        isLoading: true,
        channels: [],
        selectedIds: [],
        time: [],
        status: [
          {value: 1, desc: "移交法务"},
          {value: 5, desc: "金额太小,作测试费处理"},
          {value: 10, desc: "对账中"},
          {value: 20, desc: "已对账,未开发票"},
          {value: 30, desc: "已开发票"},
          {value: 100, desc: "已回款"}],
        pageInfo: {limit: ENV.PAGE_SHOW_COUNT, currPage: 1, total: 0},
        pageInfoNotVerify: {limit: ENV.PAGE_SHOW_COUNT, currPage: 1, total: 0},
        downloadUrl: "", // 下载链接

        rand: 0,
      }
    },
    mounted: function () {
//      this.getNoChannelVerify("")
      this.getSelectChannels()
      this.getUser()
      this.getChanVList(1)
      this.selectedHeader = [7, 11]
      this.getStatistics()
      this.getNotVerifyItems()
    },
    methods: {
      onEditClose(needRefresh){
        this.isShowItemForm = false
        if (needRefresh) {
          this.getChanVList(this.pageInfo.currPage)
          this.getNotVerifyItems()
        }
      },
      showHeader: function () {
        for (let i in this.table_header) {
          if (i === 7) {
            this.table_header[i].state = true
          }
          this.table_header[i].state = false
        }
        for (let i in this.selectedHeader) {
          this.table_header[this.selectedHeader[i]].state = true
        }
      },
      showNotVerify(){
        this.isShowNotVerify = true
      },
      addVerifyFromNotVerify(notVerify){
        let date = notVerify.date
        let body_my = notVerify.body_my
        let channel_code = notVerify.channel ? notVerify.channel.cp : null

        if (!body_my || !channel_code) {
          this.$message({
            type: 'error',
            message: '数据有误,不能自动填入'
          })
          return
        }
        let defaultItem = {date, body_my, channel_code}
        this.editOrAddItem(0, defaultItem)
      },
      getNotVerifyItems(){
        let url = '/verify_channel/not_verify_info/'
        let param = {
          'offset|page': this.pageInfoNotVerify,
        }

        this.isLoadingNotVerify = true
        let query = util.buildGetParams(param)
        this.$http.get(url + "?" + query)
          .then(({data}) => {
            this.notVerifyItems = data.data
            this.pageInfoNotVerify.total = data.total
            this.isLoadingNotVerify = false
          })
      },
      // 弹出编辑框
      editOrAddItem(id, defaultItem){
        this.readonly = false
        this.isShowItemForm = true
        this.editId = id
        this.formDefaultItem = defaultItem

        this.rand = Math.random()
      },
      detailItem(id){
        this.isShowItemForm = true
        this.editId = id
        this.readonly = true

        this.rand = Math.random()
      },
      reset() {
        this.selectedChannels = []
        this.timeRange = ""
        this.selectedStatus = null
        this.bodyMy = null
        this.selectedUser = null
        this.getChanVList()
        this.timeStart = []
        this.timeEnd = []
      },
      onCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.getChanVList(currentPage)
      },
      onNotVerifyCurrentChange(currentPage) {
        this.pageInfoNotVerify.currPage = currentPage
        this.getNotVerifyItems()
      },
      previewStatus(i){
        if (i) {
          return _.find(this.status, {'value': i}).desc
        }
        return ""
      },
      previewGame(i){
        return _.map(i, "game_name").join(' ')
      },
      goaddCpReconciliation: function (id) {
        this.$router.push({
          path: '/home/channelOfReconciliation?id=' + id
        })
      },
      channelOfReconciliation: function (id) {
        this.$router.push({
          path: '/home/channelOfReconciliation'
        })
      },
      getChannelVerify: function () {
        let url = '/verify_channel/'
        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      // 获取对账人拉框选项
      getUser(){
        let url = "/user/devment/6"
        this.$http.get(url)
          .then(({data}) => {
            this.users = data
          })
      },
      getSelectChannels(){
        let url = '/verify_channel/channels';
        this.$http.get(url)
          .then((res) => {
            this.channels = res.body;
          })
          .catch((err) => {
            console.log(err);
            context.error = err.data;
          })
      },
      getChanVList(){
        let cps = []
        if (this.selectedChannels.length !== 0) {
          cps = this.selectedChannels.join(",")
        }
        let start = ""
        let end = ""
        if (this.timeEnd) {
          end = this.timeEnd.format('yyyy-MM-dd').substring(0, 7)
        }
        if (this.timeStart) {
          start = new Date(this.timeStart).format('yyyy-MM-dd').substring(0, 7)
        }
        let param = {
          channels: cps,
          user_id: this.selectedUser,
          body_my: this.bodyMy,
          end: end,
          start: start,
          status: this.selectedStatus,
          'offset|page': this.pageInfo,
        };
        let query = util.buildGetParams(param)
        let url = "/verify_channel?" + query;
        let xtoken = sessionStorage.getItem("token")
        this.downloadUrl = ENV.HOST_URL + '/verify_channel/download?' + query + "&_token=" + xtoken
        this.isLoading = true
        this.$http.get(url)
          .then(({data}) => {
            this.items = data.data
            this.pageInfo.total = data.total
            this.isLoading = false
          })
//        this.getNoChannelVerify(query)
      },
      download(fileId){
        return util.downloadFileUrl(fileId)
      },
      preview(fileId){
        util.previewFile(fileId)
      },
      handleSort(obj) {
        if (!obj.prop) {
          return
        }
        this.sortData = obj
        this.doGetOrderList(0, this.sortData)
      },
      deleteItem(id){
        this.$confirm('此操作将永久删除该对账单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let url = "/verify_channel/" + id;
            this.$http.delete(url)
              .then((res) => {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })

                this.getChanVList(1)
              })
          });
      },
      getStatistics(){
        let url = "/verify_channel/simple_statistics/"
        this.$http.get(url).then(({data}) => {
          this.statistics = data
        })
      },
    }
  }
</script>


<style scoped>
  th {
    text-align: center;
    background: #367fa9 !important;
    color: white !important;
  }

  td {
    text-align: center;
  }

  .el-button + .el-button {
    margin-left: 0;
  }

  .el-date-editor--daterange.el-input {
    width: 100%;
  }
</style>

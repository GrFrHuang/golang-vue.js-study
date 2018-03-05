<template>
  <div>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="form-horizontal">
            <div class="form-group">
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">发行商</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-select
                    style="width:100%"
                    v-model="selectedCompanies"
                    :multiple="true" :clearable="true" :filterable="true"
                    @change="doGetCpVerifyList"
                    placeholder="选择发行商">
                    <el-option
                      v-for="item in companies"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">账单日期</label>
                <div class="col-sm-9 ipt_jianju">
                  <el-date-picker
                    v-model="timeStart"
                    type="month"
                    placeholder="选择开始月" @input="doGetCpVerifyList(1)">
                  </el-date-picker>
                  <el-date-picker
                    v-model="timeEnd"
                    type="month"
                    placeholder="选择结束月" @input="doGetCpVerifyList(1)">
                  </el-date-picker>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">状态</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-select
                    style="width:100%"
                    v-model="selectedStatus"
                    :clearable="true"
                    @change="doGetCpVerifyList"
                    placeholder="搜索或搜索状态">
                    <el-option
                      v-for="item in status"
                      :label="item.desc"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">对账人</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-select
                    style="width:100%"
                    v-model="selectedUser"
                    :clearable="true"
                    @change="doGetCpVerifyList"
                    placeholder="对账人">
                    <el-option
                      v-for="item in user"
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
                    @change="doGetCpVerifyList"
                    placeholder="主体">
                    <el-option label="云端" :value="1"></el-option>
                    <el-option label="有量" :value="2"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label"></label>
                <div class="col-sm-10">
                  <!--<button class=" btn btn-primary" @click="reset">重置条件</button>-->
                  <button class="btn btn-primary" @click="addItem">添加对账</button>
                  <el-badge :value="pageInfoNotVerify.total" class="item">
                    <button class="btn btn-primary" @click="showNotVerify">查看未对账 </button>
                  </el-badge>
                </div>
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
            v-loading="isLoadList"
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
                <p class="max_widths">{{ scope.row.date }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="body_my"
              label="我方主体"
              v-if="!table_header[1].state"
              sortable='custom'
              min-width="120">
              <template scope="scope">
                <p class="max_widths">
                  <span v-if="scope.row.body_my===1">云端</span>
                  <span v-else>有量</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column
              prop="company"
              label="发行商"
              v-if="!table_header[2].state"
              min-width="160">
              <template scope="scope">
                <p class="max_widths"><span v-if="scope.row.company">{{ scope.row.company.name }}</span></p>
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
              label="对账状态"
              v-if="!table_header[4].state"
              min-width="100">
              <template scope="scope">
                <p class="max_widths">{{ previewStatus(scope.row.status) }}</p>
              </template>
              <!---->
            </el-table-column>
            <el-table-column
              prop="status"
              label="收票日期"
              v-if="!table_header[11].state"
              min-width="120">
              <template scope="scope">
                <p class="max_widths" v-if="scope.row.status === 10 || scope.row.status === 20">——</p>
                <p class="max_widths" v-else>{{ scope.row.billing_date }}</p>
              </template>
              <!---->
            </el-table-column>
            <el-table-column
              prop="amount_my"
              label="我方流水"
              v-if="!table_header[5].state"
              min-width="120">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.amount_my }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="amount_payable"
              label="应付金额"
              v-if="!table_header[6].state"
              min-width="120">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.amount_payable }}</p>
              </template>
            </el-table-column>

            <el-table-column
              prop="nickname"
              label="对账人"
              v-if="!table_header[8].state"
              class="text-center"
              min-width="140">
              <template scope="scope">
                <p class="max_widths">
                  <span v-if="scope.row.verify_user">{{ scope.row.verify_user.nickname }}({{ scope.row.verify_time | stampToTime }})</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column
              prop="updated_time"
              label="更新时间"
              v-if="!table_header[9].state"
              min-width="120">
              <template scope="scope">
                <p class="max_widths">
                  <span>{{scope.row.updated_user?scope.row.updated_user.nickname:''}}({{ scope.row.updated_time | stampToTimeFull}})</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              v-if="!table_header[10].state"
              min-width="100">
              <template scope="scope">
                <a v-if="scope.row.file_id" :href="download(scope.row.file_id)" target="_blank">
                  <span class="fa fa-download" title="下载"></span>
                </a>
                <!--<el-button class="fa fa-image" type="text" size="small" title="预览" v-if="scope.row.file_preview_id" @click="preview(scope.row.file_preview_id) "></el-button>-->
                <el-button title="查看" type="text" size="small" class="fa fa-eye" @click=detailItem(scope.row.id)></el-button>
                <el-button title="编辑" type="text" size="small" class="fa fa-edit" @click=editItem(scope.row.id)></el-button>
                <el-button title="删除" type="text" size="small" class="fa fa-trash" @click=deleteItem(scope.row.id)></el-button>
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
      :title="readonly?'查看':(editId?'编辑对账单':'添加对账单')"
      v-model="isShowItemForm"
      top="5%"
      size="large"
      :close-on-click-modal="false">
      <editor :rand="rand" :editId="editId" :readonly="readonly" :defaultValue="formDefaultItem" @emptyDefault="formDefaultItem=null" @close="onEditClose"></editor>
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
          label="发行商"
          min-width="120">
          <template scope="scope">
            <p v-if="scope.row.company">{{ scope.row.company.name }}</p>
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
          <template scope="scope">
            {{scope.row.amount|fixed2}}
          </template>
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
<style scoped>
  .control-label{
    width: 94px;
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
</style>
<script type="text/ecmascript-6">
  import util from '../../../publicjs/utils'
  import addCpReconciliationv2 from '../addCpReconciliationv2.vue'

  export default {
    components: {
      'editor': addCpReconciliationv2,
    },
    data: function () {
      return {
        companies: [], // 发行商选项
        user: [], // 对账人选项

        isLoadList: false,

        isShowItemForm: false,
        editId: 0,
        formDefaultItem:null,
        readonly: false,

        isLoadingNotVerify:false,
        isShowNotVerify: false,
        notVerifyItems: [], // 未对账的数据

        doGetSettleList: [],
        status: [
          {value: 1, desc: "移交法务"},
          {value: 5, desc: "金额太小,作测试费处理"},
          {value: 10, desc: "对账中"},
          {value: 20, desc: "对账完毕,未开发票"},
          {value: 30, desc: "已收票"},
          {value: 100, desc: "已打款"}],

        preItem: {},
        items: [],
        pageInfo: {limit: ENV.PAGE_SHOW_COUNT, currPage: 1, total: 0,},
        pageInfoNotVerify: {limit: ENV.PAGE_SHOW_COUNT, currPage: 1, total: 0},
        downloadUrl: "", // 下载链接
        timeStart: "", // 日期选择
        timeEnd: "", // 日期选择
        statistics: {}, // 统计
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
        // form
        selectedUser: null,
        selectedCompanies: [],
        selectedStatus: null,
        bodyMy: null,
        timeRange: "",
        // end
        selectedHeader:[],
        table_header:[
          { id: 0, header_name:"账单日期", state: false}, { id: 1, header_name:"我方主体", state: false},
          { id: 2, header_name:"发行商", state: false}, { id: 3, header_name:"游戏", state: false},
          { id: 4, header_name:"对账状态", state: false}, { id: 5, header_name:"我方流水", state: false},
          { id: 6, header_name:"应付金额", state: false}, { id: 7, header_name:"已结算金额", state: true},
          { id: 8, header_name:"对账人", state: false}, { id: 9, header_name:"更新时间", state: false},
          { id: 10, header_name:"操作", state: false},{id: 11, header_name: "收票日期", state: true}],
        deLoad: _.debounce((url) => {
          this.isLoadList = true
          this.$http.get(url)
            .then((res) => {
              this.items = res.body.data;
              this.pageInfo.total = res.body.total
              this.isLoadList = false
            })
        }),

        rand:0,
      }
    },
    mounted: function () {
      this.getCompanies()
      this.doGetCpVerifyList()
      this.getUser()
      this.getStatistics()
      this.getNotVerifyItems()
      this.selectedHeader= [7,11]
    },
    methods: {
      // 编辑对话框关闭
      onEditClose(needRefresh){
        this.isShowItemForm = false
        if (needRefresh) {
          this.doGetCpVerifyList()
        }
      },
      showHeader: function () {
        for(let i in this.table_header){
          if(i===7){
            this.table_header[i].state = true
          }
          this.table_header[i].state = false
        }
        for(let i in this.selectedHeader){
          this.table_header[this.selectedHeader[i]].state = true
        }
      },
      onNotVerifyCurrentChange(currentPage) {
        this.pageInfoNotVerify.currPage = currentPage
        this.getNotVerifyItems()
      },
      showNotVerify(){
        this.isShowNotVerify = true
      },
      getNotVerifyItems(){
        let url = '/verify_cp/not_verify_info/'
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
      reset() {
        this.selectedCompanies = []
        this.selectedStatus = null
        this.timeRange = ""
        this.bodyMy = null
        this.selectedUser = null
        this.doGetCpVerifyList()
        this.timeStart = []
        this.timeEnd = []
      },
      // 弹出编辑框
      editItem(id,defaultItem){
        this.readonly = false
        this.isShowItemForm = true
        this.editId = id
        this.formDefaultItem = defaultItem

        this.rand=  Math.random()
      },
      detailItem(id){
        this.isShowItemForm = true
        this.editId = id
        this.readonly = true

        this.rand=  Math.random()
      },
      // 弹出添加框
      addItem(){
        this.readonly = false
        this.isShowItemForm = true
        this.editId = 0
      },
      addVerifyFromNotVerify(notVerify){
        let date = notVerify.date
        let body_my= notVerify.body_my
        let company_id = notVerify.company ?notVerify.company.id:null

        if (!body_my||!company_id){
          this.$message({
            type: 'error',
            message: '数据有误,不能自动填入'
          })
          return
        }
        let defaultItem = {date,body_my,company_id}
        this.editItem(0,defaultItem)
      },
      onCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.doGetCpVerifyList()
      },
      previewStatus(i){
        if (i) {
          let v = _.find(this.status, {'value': i})
          if (!v) {
            return i
          }
          return v.desc
        }
        return ""
      },
      previewGame(i){
        if (!i) {
          return ""
        }
        return _.map(i, "game_name").join(' ')
      },
      goaddCpReconciliation: function (id) {
        this.$router.push({
          path: '/home/editCpReconciliation'
        })
      },
      //获取开发商下拉框选项
      getCompanies(){
        let url = '/verify_cp/companies';
        this.$http.get(url)
          .then(({data}) => {
            this.companies = data
          })
      },
      // 获取对账人拉框选项
      getUser(){
        let url = "/user/devment/6"
        this.$http.get(url)
          .then(({data}) => {
            this.user = data
          })
      },
      //查询
      doGetCpVerifyList(){
        let ids = []
        if (this.selectedCompanies.length !== 0) {
          ids = this.selectedCompanies
        }
        let start = ""
        let end = ""

//        if (this.timeEnd) {
//          end = new Date(this.timeEnd).format('yyyy-MM-dd')
//        }
//        if (this.timeStart) {
//          start = new Date(this.timeStart).format('yyyy-MM-dd')
//        }

        if (this.timeEnd) {
          end =this.timeEnd.format('yyyy-MM-dd').substring(0,7)
        }
        if (this.timeStart) {
          start = new Date(this.timeStart).format('yyyy-MM-dd').substring(0,7)
        }
        let query = util.buildGetParams({
          company_ids: ids.join(","),
          user_id: this.selectedUser,
          body_my: this.bodyMy,
          start: start,
          end: end,
          "status|number": this.selectedStatus,
          "offset|page": this.pageInfo,
        });

        let token = sessionStorage.getItem("token")
        this.downloadUrl = ENV.HOST_URL + '/verify_cp/download?' + query + "&_token=" + token

        let url = "/verify_cp?" + query;
        this.deLoad(url)
      },
      download(fileId){
        return util.downloadFileUrl(fileId)
      },
      handleSort(obj) {
        if (!obj.prop) {
          return
        }
        this.sortData = obj
        this.doGetOrderList(0, this.sortData)
      },
      preview(fileId){
        util.previewFile(fileId)
      },
      deleteItem(id){
        this.$confirm('此操作将永久删除该对账单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let url = "/verify_cp/" + id
            this.$http.delete(url)
              .then((res) => {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })

                this.doGetCpVerifyList()
              })
          });
      },
      getStatistics(){
        let url = "/verify_cp/simple_statistics/"
        this.$http.get(url).then(({data}) => {
          this.statistics = data
        })
      },
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .extend-hover {
    div {
      white-space: nowrap;
    }
  }
</style>

<style>
  .statistics {
    margin: 7px 0 0 0;
  }
</style>
<style scoped>
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

  .control-label {
    /*width: 94px;*/
  }

  .el-date-editor--daterange.el-input {
    width: 100%;
  }

  th {
    text-align: center;
    background: #367fa9 !important;
    color: white !important;
  }

  td {
    text-align: center;
  }
</style>

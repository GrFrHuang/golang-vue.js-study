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
                    @change="doGetCpVerifyElecList"
                    placeholder="选择发行商">
                    <el-option
                      v-for="item in companies"
                      :label="item.name"
                      :value="item">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">账单日期</label>
                <div class="col-sm-9 ipt_jianju">
                  <el-date-picker
                    v-model="cp_pre_verify"
                    type="month"
                    placeholder="选择开始月" @input="doGetCpVerifyElecList(1)">
                  </el-date-picker>
                  <el-date-picker
                    v-model="timeEnd"
                    type="month"
                    placeholder="选择结束月" @input="doGetCpVerifyElecList(1)">
                  </el-date-picker>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">主体</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-select
                    style="width:100%"
                    v-model="bodyMy"
                    :clearable="true"
                    @change="doGetCpVerifyElecList"
                    placeholder="主体">
                    <el-option label="云端" :value="1"></el-option>
                    <el-option label="有量" :value="2"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label"></label>
                <div class="col-sm-10">
                  <button class="btn btn-primary" @click="addElectic">生成电子对账单</button>
                  <button class="btn btn-primary" @click="showAccountInfo">我方账户信息 </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="box-body">
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
              label="发行商"
              min-width="120">
              <template scope="scope">
                <p class="max_widths"><span v-if="scope.row.company">{{ scope.row.company.name }}</span></p>
              </template>
            </el-table-column>
            <el-table-column
              prop="body_my"
              label="我方主体"
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
              label="对账日期"
              min-width="160">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.dates }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="pre_verify"
              label="更新时间"
              min-width="160">
              <template scope="scope">
                <p class="max_widths">
                  <span>{{scope.row.updated_user?scope.row.updated_user.nickname:''}}({{ scope.row.update_time | stampToTimeFull}})</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              min-width="100">
              <template scope="scope">
                <el-button title="查看" type="text" size="small" class="fa fa-eye" @click=detailItem(scope.row.id)></el-button>
                <el-button title="编辑" type="text" size="small" class="fa fa-edit" @click=editItem(scope.row.id)></el-button>
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
        </div>
      </div>

    </div>
    <el-dialog
      :title="editId?'编辑电子对账单':'添加电子对账单'"
      v-model="isShowElectrc"
      top="5%"
      size="large"
      :close-on-click-modal="false">
      <editor :rand="rand" :editId="editId" :readonly="readonly" :defaultValue="formDefaultItem" @emptyDefault="formDefaultItem=null" @close="onEditClose"></editor>
    </el-dialog>

    <el-dialog title="我方账户信息" v-model="isShowAccountInformation" top="5%" size="tiny" :close-on-click-modal="false"
      :close-on-press-escape="false" @close="">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="云端" name="first">
          <accountInfo :info="info"></accountInfo>
        </el-tab-pane>
        <el-tab-pane label="有量" name="second">
          <accountInfo :info="info"></accountInfo>
        </el-tab-pane>
      </el-tabs>
      <div>
        <button class="btn btn-primary" @click="saveAccountInfo()">保存</button>
        <button class="btn btn-default" @click="closeAccountInfo(false)">关闭</button>
      </div>
    </el-dialog>

  </div>
</template>
<style scoped>
  .control-label{
    width: 94px;
  }
  .max_widths:hover {
    text-overflow: inherit;
    overflow: visible;
    white-space: pre-line;
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
<script type="text/ecmascript-6">
  import util from '../../../publicjs/utils'
  import addCpReconciliationv2 from '../addCpReconciliationv3.vue'
  import accountInfo from './accountInfo.vue'

  export default {
    components: {
      'editor': addCpReconciliationv2,
      'accountInfo': accountInfo
    },
    data: function () {
      return {
        activeName: 'first',
        companies: [], // 发行商选项

        isLoadList: false,

        isShowElectrc: false,
        editId: 0,
        formDefaultItem:null,
        readonly: false,

        isLoadingNotVerify:false,
        isShowAccountInformation: false,

        doGetSettleList: [],
        preItem: {},
        items: [],
        pageInfo: {limit: ENV.PAGE_SHOW_COUNT, currPage: 1, total: 0,},
        pageInfoNotVerify: {limit: ENV.PAGE_SHOW_COUNT, currPage: 1, total: 0},
        cp_pre_verify: "", // 日期选择
        timeEnd: "", // 日期选择
        // form
        selectedUser: null,
        selectedCompanies: [],
        selectedStatus: null,
        bodyMy: null,
        timeRange: "",
        // end
        selectedHeader:[],
        info: {},
        rand:0,
      }
    },
    mounted: function () {
      this.getCompanies()
      this.doGetCpVerifyElecList()
    },
    methods: {
      //根据主体获取账户信息,默认主体问题云端
      getAccountInfo(body=1) {
        let url = '/accountInformation/?body_my=' + body

        this.$http.get(url)
          .then((res) => {
            this.info = res.body
          })
      },
      showAccountInfo(){
        this.activeName = "first"
        this.getAccountInfo()
        this.isShowAccountInformation = true
      },
      closeAccountInfo() {
        this.isShowAccountInformation = false
      },
      handleClick(tab, event) {
        let body = tab.label == "云端" ? 1 : 2
        this.getAccountInfo(body)
      },
      saveAccountInfo() {
        let post = util.buildPostParams({
          body_my: this.info.body_my,
          account_name: this.info.account_name,
          taxpayer: this.info.taxpayer,
          billing_address: this.info.billing_address,
          telephone: this.info.telephone,
          bank: this.info.bank,
          account_number: this.info.account_number,
          mailing_address: this.info.mailing_address
        })
        let url = "/accountInformation/"
        this.$http.put(url + this.info.id, post)
          .then((r) => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.isShowAccountInformation = false
          })
      },
      // 编辑对话框关闭
      onEditClose(needRefresh){
        this.isShowElectrc = false
        if (needRefresh) {
          this.doGetCpVerifyElecList()
        }
      },
      reset() {
        this.selectedCompanies = []
        this.selectedStatus = null
        this.timeRange = ""
        this.bodyMy = null
        this.selectedUser = null
        this.doGetCpVerifyElecList()
        this.cp_pre_verify = []
        this.timeEnd = []
      },
      // 弹出编辑框
      editItem(id,defaultItem){
        this.readonly = false
        this.isShowElectrc = true
        this.editId = id
        this.formDefaultItem = defaultItem

        this.rand=  Math.random()
      },
      detailItem(id){
        this.isShowElectrc = true
        this.editId = id
        this.readonly = true

        this.rand=  Math.random()
      },
      // 弹出添加框
      addElectic(){
        this.readonly = false
        this.isShowElectrc = true
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
        this.doGetCpVerifyElecList()
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
      //获取发行商下拉框选项
      getCompanies(){
        let url = '/verify_cp/companies';
        this.$http.get(url)
          .then(({data}) => {
            this.companies = data
          })
      },
      //查询
      doGetCpVerifyElecList(){
        let ids = []
        if (this.selectedCompanies.length !== 0) {
          ids = _.map(this.selectedCompanies, 'id')
        }

        let start = ""
        let end = ""
        if (this.timeEnd) {
          console.log(this.timeEnd)
          end = new Date(this.timeEnd).format('yyyy-MM')
        }
        if (this.cp_pre_verify) {
          start = new Date(this.cp_pre_verify).format('yyyy-MM')
        }

        let query = util.buildGetParams({
          company_ids: ids.join(","),
          body_my: this.bodyMy,
          start: start,
          end: end,
          "offset|page": this.pageInfo,
        });

        let token = sessionStorage.getItem("token")

        let url = "/verify_cp_elec?" + query;
        this.isLoadList = true
        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data;
            this.pageInfo.total = res.body.total
            this.isLoadList = false
          })
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

                this.doGetCpVerifyElecList()
              })
          });
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

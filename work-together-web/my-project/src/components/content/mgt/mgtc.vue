<template>
  <div>
    <section class="content-header">
      <h1>
        付款管理
        <small>查看历史付款账单</small>
      </h1>
      <ol class="breadcrumb">
        <li>
          <i class="fa fa-dashboard"></i> CP结算流
        </li>
        <li>
          <router-link to="/home/mgt/mgtc">付款管理</router-link>
        </li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header form-horizontal">
          <div class="col-lg-6 col-sm-12">
            <div class="form-group ">
              <label class="col-sm-2 control-label">发行商</label>
              <div class="col-sm-10">
                <el-select v-model="selectedCompanies" :clearable="true"
                           @change="doGetSettleList" filterable multiple placeholder="请选择">
                  <el-option
                    v-for="item in companies"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-sm-12">
            <div class="form-group ">
              <label class="col-sm-2 control-label">我方主体:</label>
              <div class="col-sm-10 ">
                <el-select v-model="selectedBodyMy" :clearable="true"
                           @change="doGetSettleList" filterable placeholder="请选择">
                  <el-option
                    v-for="item in bodyMys"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-sm-12">
            <div class="form-group ">
              <label class="col-sm-2 control-label">结算日期</label>
              <div class="col-sm-10">
                <el-date-picker
                  v-model="time"
                  type="daterange"
                  placeholder="选择日期范围"
                  @input="doGetSettleList">
                </el-date-picker>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-sm-12">
            <div class="form-group ">
              <label class="col-sm-2 control-label"> </label>
              <div class="col-sm-10">
                <!--<button class="btn btn-primary" @click="reset">重置</button>-->
                <button class="btn btn-primary" @click="editOrAddItem(0)">添加付款单</button>
              </div>
            </div>
          </div>
        </div>
        <div class="box-body table-responsive">
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
              label="结算日期"
              v-if="!table_header[0].state"
              min-width="120">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.settle_time | stampToTime }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="body_my"
              label="我方主体"
              v-if="!table_header[1].state"
              sortable='custom'
              min-width="100">
              <template scope="scope">
                <p class="max_widths">{{ bodyMy[scope.row.body_my] }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="company"
              label="发行商"
              v-if="!table_header[2].state"
              min-width="160">
              <template scope="scope">
                <p class="max_widths"><span v-if=" scope.row.company">{{ scope.row.company.name }}</span></p>
              </template>
            </el-table-column>
            <el-table-column
              prop="pre_verify"
              label="结算金额"
              v-if="!table_header[3].state"
              min-width="120">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.amount }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="结算人"
              v-if="!table_header[4].state"
              min-width="100">
              <template scope="scope">
                <p class="max_widths"><span v-if=" scope.row.user">{{ scope.row.user.nickname }}</span></p>
              </template>
              <!---->
            </el-table-column>
            <el-table-column
              prop="amount_my"
              label="更新时间"
              v-if="!table_header[5].state"
              min-width="120">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.created_time | stampToTime }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="amount_payable"
              label="更新人"
              v-if="!table_header[6].state"
              min-width="120">
              <template scope="scope">
                <p class="max_widths">
                  {{ scope.row != null && scope.row.update_user != null ? scope.row.update_user.nickname : ""
                  }} {{ scope.row.update_settletime | stampToTime }}</p>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              v-if="!table_header[7].state"
              min-width="100">
              <template scope="scope">
                <el-button
                  class="fa fa-edit" title="编辑" type="text" size="small"
                  @click="editOrAddItem( scope.row.id)">
                </el-button>
                <el-button
                  class="fa fa-trash" title="删除" type="text" size="small"
                  @click="deleteItem(scope.row.id)">
                </el-button>
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
      :title="editId?'编辑结算单':'添加结算单'"
      v-model="isShowForm"
      top="5%"
      size="large"
      :close-on-click-modal="false">
      <editor :rand="rand" :editId="editId" :isShowForm="isShowForm" @close="onEditClose"></editor>
    </el-dialog>

  </div>

</template>

<script type="text/ecmascript-6">
  import Table from '../../public/Table.vue'
  import editor from '../addCpBilling.vue'

  export default {
    components: {
      'v-table': Table,
      editor
    },
    data: function () {
      return {
        pageInfo: {limit: ENV.PAGE_SHOW_COUNT, currPage: 1, total: 0},
        companies: [],
        bodyMys: [{value: 1, name: "云端"}, {value: 2, name: "有量"}],
        isLoading: true,
        items: [], // 结算单
        notDown: {}, // 未结算的

        downloadUrl: "", // 下载链接

        selectedCompanies: [],
        time: [],
        selectedBodyMy: null,

        isShowForm: false,
        editId: 0,
        selectedHeader: [],
        table_header: [
          {id: 0, header_name: "结算日期", state: false},
          {id: 1, header_name: "我方主体", state: false},
          {id: 2, header_name: "发行商", state: false},
          {id: 3, header_name: "结算金额", state: false},
          {id: 4, header_name: "结算人", state: false},
          {id: 5, header_name: "更新时间", state: false},
          {id: 6, header_name: "更新人", state: false},
          {id: 7, header_name: "操作", state: false}
        ],
        bodyMy: {1: '云端', 2: '有量'},
        rand:0,
      }
    },
    computed: {},
    mounted: function () {
      // 加载游戏
      let url = '/settleaccount/companies/'
      this.$http.get(url)
        .then(({data}) => {
          this.companies = data
        })
      this.doGetSettleList(1)
      let selected = []
      this.selectedHeader = selected
    },

    methods: {
      // 编辑对话框关闭
      onEditClose(needRefresh){
        this.isShowForm = false
        if (needRefresh) {
          this.doGetSettleList()
        }
      },
      showHeader: function () {
        for (let i in this.table_header) {
          this.table_header[i].state = false
        }
        for (let i in this.selectedHeader) {
          this.table_header[this.selectedHeader[i]].state = true
        }
      },
      handleSort(obj) {
        if (!obj.prop) {
          return
        }
        this.sortData = obj
        this.doGetOrderList(0, this.sortData)
      },
      reset(){
        this.selectedCompanies = []
        this.selectedBodyMy = null
        this.time = []
        this.doGetSettleList()
      },
      onCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.doGetSettleList(currentPage)
      },
      editOrAddItem(id) {
        this.isShowForm = true
        this.editId = id

        this.rand = Math.random()
      },
      deleteItem(id){
        this.$confirm('此操作将永久删除该结算单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let url = "/settleaccount/" + id
            this.$http.delete(url)
              .then((res) => {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })

                this.doGetSettleList()
              })
          });
      },
      download(fileId){
        return util.downloadFileUrl(fileId)
      },
      preview(fileId){
        util.previewFile(fileId)
      },
      previewGame(i){
        if (!i) {
          return ""
        }
        i = JSON.parse(i)
        if (!i) {
          return ""
        }
        return _.map(i, "game_name").join(' ')
      },
      doGetSettleList(){ // 获取结算列表
        let companyIds = ""
        if (this.selectedCompanies && this.selectedCompanies.length !== 0) {
          companyIds = this.selectedCompanies.join(",")
        }
        let data = {
          "body_my": this.selectedBodyMy,
          "company_ids": companyIds,
          "offset|page": this.pageInfo,
        }
        if (this.time && this.time.length === 2) {
          data["start_time|timeToStamp"] = this.time[0]
          data["end_time|timeToStamp"] = this.time[1]
        }
        let query = util.buildGetParams(data)

        let xtoken = sessionStorage.getItem("token")
        this.downloadUrl = ENV.HOST_URL + '/settleaccount/download?' + query + "&_token=" + xtoken

        let url = '/settleaccount?' + query
        this.isLoading = true
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

<style lang="less" rel="stylesheet/less" scoped>
  .extend-hover {
    div {
      white-space: nowrap;
    }
  }
</style>

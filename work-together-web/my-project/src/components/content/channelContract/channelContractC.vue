<template>
  <div class="tab-pane  active" id="tab_3">
    <section class="content-header">
      <h1>
        渠道回款

        <small>查看渠道回款情况</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>渠道回款流</li>
        <li>
          <router-link to="/home/channelContract/channelContractC">合同管理</router-link>
        </li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class=" form-horizontal">
            <div class="form-group">
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">回款公司:</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-select v-model="selectedCompanies" :clearable="true"
                             @change="doGetSettleList(1)" filterable multiple placeholder="请选择">
                    <el-option
                      v-for="item in companies"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>

              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">我方主体:</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-select v-model="selectedBodyMys" :clearable="true"
                             @change="doGetSettleList" filterable placeholder="请选择">
                    <el-option
                      v-for="item in bodyMys"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">回款日期:</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-date-picker
                    v-model="time"
                    type="daterange"
                    placeholder="选择日期范围"
                    @input="doGetSettleList">
                  </el-date-picker>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label"></label>
                <div class="col-sm-9 ipt_jianju">
                  <a class="btn btn-primary " target="_blank" :href="downloadUrl"
                     :disabled="downloadUrl==''">导出excel</a>
                  <button class="btn btn-primary " @click="editItem(0)">添加回款</button>
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
                prop="remit_time"
                label="回款日期"
                v-if="!table_header[0].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.remit_time | stampToTime }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="remit_company"
                label="回款公司(渠道)"
                v-if="!table_header[1].state"
                min-width="160">
                <template scope="scope">
                  <p class="max_widths"><span v-if="scope.row.remit_company">{{ scope.row.remit_company.name }}</span>
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="body_my"
                label="我方主体"
                v-if="!table_header[2].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">
                    <span v-if="scope.row.body_my===1">云端</span>
                    <span v-else>有量</span>
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="amount"
                label="回款金额"
                v-if="!table_header[3].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.amount }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="user"
                label="回款人"
                v-if="!table_header[4].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths"><span v-if="scope.row.user">{{ scope.row.user.nickname }}</span></p>
                </template>
              </el-table-column>
              <el-table-column
                prop="created_time"
                label="创建时间"
                v-if="!table_header[5].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.created_time | stampToTime }}</p>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                prop="updateinfo"
                label="更新人"
                v-if="!table_header[6].state"
                min-width="120">
                <template scope="scope">
                  <p
                    class="max_widths">{{ scope.row.update_user == null ? "" : scope.row.update_user.nickname }} {{ scope.row.update_remittime | stampToTime }}</p>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                v-if="!table_header[7].state"
                min-width="100">
                <template scope="scope">
                  <a :href="download(scope.row.file_id)" target="_blank" v-if="scope.row.file_id">
                    <span class="fa fa-download "></span>
                  </a>
                  <el-button
                    type="text" size="small"
                    class="fa fa-file-text-o"
                    v-if="scope.row.file_preview_id"
                    @click="preview(scope.row.file_preview_id)">
                  </el-button>
                  <el-button
                    type="text" size="small"
                    class="fa fa-file-text-o" title="编辑"
                    @click="editItem(scope.row.id)">
                  </el-button>
                  <el-button
                    type="text" size="small"
                    class="fa fa-trash" title="删除"
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
          <!-- /.box-body -->
        </div>
      </div>
      <!-- /.box -->
    </div>

    <el-dialog
      :title="editId?'编辑对账单':'添加对账单'"
      v-model="isShowForm"
      top="5%"
      size="large"
      :close-on-click-modal="false">
      <editor :rand="rand" :editId="editId" :isShowForm="isShowForm" @close="onEditClose"></editor>
    </el-dialog>

  </div>


</template>

<script type="text/ecmascript-6">
  import editor from '../paymentChannels.vue'

  export default {
    components: {
      'editor': editor,
    },
    data: function () {
      return {
        pageInfo: {
          limit: ENV.PAGE_SHOW_COUNT,
          currPage: 1,
          total: 0,
        },

        companies: [], // 所有回款主体
        bodyMys: [{value: 1, name: "云端"}, {value: 2, name: "有量"}],

        items: [], // 回款列表
        isLoading: true,
        notDown: {}, // 没有回款的

        selectedCompanies: [], // 已选回款主体
        selectedBodyMys: null,
        time: [], // 日期选择
        selectedHeader: [],
        table_header: [
          {
            id: 0,
            header_name: "回款日期",
            state: false
          }, {
            id: 1,
            header_name: "回款公司(渠道)",
            state: false
          }, {
            id: 2,
            header_name: "我方主体",
            state: false
          }, {
            id: 3,
            header_name: "回款金额",
            state: false
          }, {
            id: 4,
            header_name: "回款人",
            state: false
          }, {
            id: 5,
            header_name: "创建时间",
            state: false
          }, {
            id: 6,
            header_name: "更新人",
            state: false
          }, {
            id: 7,
            header_name: "操作",
            state: false
          }
        ],
        downloadUrl: "", // 下载链接

        isShowForm: false,
        editId: 0,
        rand:0,
      }
    },
    mounted: function () {
      // 加载所有回款主体
      let url = '/remitaccount/remitcompanies/'
      this.$http.get(url)
        .then((res) => {
//        console.log(res)
          this.companies = res.body
        })
      this.selectedHeader = []
      this.doGetSettleList()
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
      reset() {
        this.selectedCompanies = []
        this.selectedBodyMys = null
        this.time = []
        this.doGetSettleList()
      },
      editItem(id){
        this.editId = id
        this.isShowForm = true

        this.rand = Math.random()
      },
      deleteItem(id){
        this.$confirm('此操作将永久删除该回款单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$http.delete('/remitaccount/' + id)
              .then(() => {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.doGetSettleList()
              })
          })
      },
      onCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.doGetSettleList()
      },
      post(){
        this.doGetSettleList()
      },
      doGetSettleList(){ // 获取回款列表
        let ids = ""
        if (this.selectedCompanies && this.selectedCompanies.length != 0) {
          ids = this.selectedCompanies.join(",")
        }

        let data = {
          "body_my": this.selectedBodyMys,
          "company_ids": ids,
          "limit": this.pageInfo.limit,
          "offset|page": this.pageInfo,
        }

        if (this.time && this.time.length === 2) {
          console.log(this.time)
          data["start_time|timeToStamp"] = this.time[0]
          data["end_time"] = parseInt(new Date(new Date(this.time[1]).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000)
        }
        if (this.time[0] == null){
          data['end_time'] = 0
        }
        let query = util.buildGetParams(data)
        let xtoken = sessionStorage.getItem("token")
        this.downloadUrl = ENV.HOST_URL + '/remitaccount/download?' + query + "&_token=" + xtoken
        this.isLoading = true
        let url = '/remitaccount?' + query
        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data
            this.pageInfo.total = res.body.total
            this.isLoading = false
          })
//        url = '/remitaccount/pre?' + query
//        this.$http.get(url)
//          .then((res) => {
//            this.notDown = res.body
//          })
      },
      download(fileId){
        return util.downloadFileUrl(fileId)
      },
      preview(fileId){
        util.previewFile(fileId)
      },
      goaddCpBilling: function (id) {
        this.$router.push({
          path: '/home/paymentChannels'
        })
      },
      paymentChannels: function () {
        this.$router.push({
          path: '/home/paymentChannels'
        })
      }
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
    width: 94px;
  }

  .el-date-editor--daterange.el-input {
    width: 100%;
  }
</style>

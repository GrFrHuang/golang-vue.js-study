<template>
  <div class="tab-pane active" id="tab_1">
    <section class="content-header">
      <h1>
        快递管理
        <small>查看快递详情</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>其他功能</li>
        <li>
          <router-link to="/home/mgt/mgta">快递管理</router-link>
        </li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="row">
            <div class="col-lg-10 form-horizontal">
              <div class="form-group">
                <div class="col-lg-6 col-sm-12">
                  <label class="col-sm-2 control-label">收件公司:</label>
                  <div class="col-sm-10 ipt_jianju">
                    <el-select v-model="selectedCompany" :clearable="true"
                               @change="doGetOrderList" filterable multiple placeholder="请选择">
                      <el-option
                        v-for="item in companies"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                  <label class="col-sm-2 control-label">发件部门:</label>
                  <div class="col-sm-10 ipt_jianju">
                    <el-select v-model="selectedDepartment" :clearable="true"
                               @change="doGetOrderList" filterable multiple placeholder="请选择">
                      <el-option
                        v-for="item in departments"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                  <label class="col-sm-2 control-label">快递单号:</label>
                  <div class="col-sm-10 ipt_jianju">
                    <el-select v-model="selectedNumber" :clearable="true"
                               @change="doGetOrderList" filterable placeholder="请选择">
                      <el-option
                        v-for="item in numbers"
                        :label="item.number"
                        :value="item.number">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col-lg-6 col-sm-12">
                  <label class="col-sm-2 control-label">发件人:</label>
                  <div class="col-sm-10 ipt_jianju">
                    <el-select v-model="selectUser" :clearable="true"
                               @change="doGetOrderList" filterable multiple placeholder="请选择">
                      <el-option
                        v-for="item in users"
                        :label="item.nickname"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
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
                  <label class="col-sm-2 control-label">邮寄内容:</label>
                  <div class="col-sm-10 ipt_jianju">
                    <el-select v-model="selectedContent" :clearable="true"
                               @change="doGetOrderList" filterable placeholder="请选择">
                      <el-option
                        v-for="item in contentType"
                        :label="item.contentType"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="row form-group">
                  <div class="col-md-3 post-btn">
                    <a class="btn btn-primary btn-block" @click="goaddExpress(0)">添加快递</a>
                  </div>
                  <div class="col-md-4 post-btn">
                    <a class="btn btn-block btn-primary" :href="downloadUrl" :disabled="downloadUrl==''">导出excel</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="_list_tab">
            <!-- /.box-header -->
            <div class="box-body">
              <!--<el-button type="button" @click="showExpress()">物流详情</el-button>-->
              <!--<el-dialog title="物流详情" v-model="dialogVisible" size="small">-->
              <!--<span v-if="expressInfo.status === 0">-->
              <!--<div>-->
              <!--<p>物流暂无结果</p>-->
              <!--</div>-->
              <!--</span>-->
              <!--<span v-else-if="expressInfo.status === 1">-->
              <!--<div>-->
              <!--<p>快递公司：{{ expressInfo.com }}</p>-->
              <!--<p>快递单号：{{ expressInfo.nu }}</p>-->
              <!--</div>-->
              <!--<template v-for="item in expressInfo.data">-->
              <!--<div>-->
              <!--<p>{{ item.time }}</p>-->
              <!--<p>{{ item.content }}</p>-->
              <!--</div>-->
              <!--</template>-->
              <!--</span>-->
              <!--<span v-else>-->
              <!--<div>-->
              <!--<p>接口出现异常</p>-->
              <!--</div>-->
              <!--</span>-->

              <!--<span slot="footer" class="dialog-footer">-->
              <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
              <!--</span>-->
              <!--</el-dialog>-->
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
                  label="快递单号"
                  v-if="!table_header[0].state"
                  min-width="120">
                  <template scope="scope">
                    <p class="max_widths">{{ scope.row.number }}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="channel"
                  label="收件公司"
                  v-if="!table_header[1].state"
                  min-width="140">
                  <template scope="scope">
                    <p class="max_widths" v-if="scope.row.company">{{scope.row.company.name }} </p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="channel"
                  label="收件人"
                  v-if="!table_header[2].state"
                  min-width="140">
                  <template scope="scope">
                    <p class="max_widths"><span v-if="scope.row.receive_user">{{ scope.row.receive_user.name }}</span>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="company_name"
                  label="我方主体"
                  v-if="!table_header[3].state"
                  min-width="140">
                  <template scope="scope">
                    <p
                      class="max_widths">{{ scope.row.body_my === 1 ? "云端" : scope.row.body_my === 2 ? "有量" : "无主体"}}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="game_name"
                  label="发件人"
                  v-if="!table_header[4].state"
                  min-width="140">
                  <template scope="scope">
                    <p class="max_widths"><span v-if="scope.row.department">{{scope.row.department.name}}</span>
                      <span v-if="scope.row.send_user">{{scope.row.send_user.nickname}}</span></p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="game_name"
                  label="邮寄方式"
                  v-if="!table_header[5].state"
                  min-width="140">
                  <template scope="scope">
                    <p class="max_widths"><span v-if="scope.row.type">{{scope.row.type.name}}</span>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="begin_time"
                  label="邮寄内容"
                  v-if="!table_header[6].state"
                  min-width="160">
                  <template scope="scope">
                    <p>
                      {{ scope.row.content_id === 1 ? "合同" : scope.row.content_id === 2 ? "发票" : "其他"}}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="status"
                  label="物流详情"
                  v-if="!table_header[7].state"
                  min-width="120">
                  <template scope="scope">
                    <p>
                      <a type="primary" @click="opendialog(scope.row)">查看详情</a>
                    </p>
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
                                 @click=goaddExpress(scope.row.id)></el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- /.box-body -->

            <div class="box-footer">
              <Pagination
                @current-change="handleCurrentChange"
                :current-page="pageInfo.currPage"
                :page-size="pageInfo.limit"
                layout="prev, pager, next, jumper, total"
                :total="pageInfo.total">
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="editId?readonly?'查看快递':'编辑快递':'添加快递'"
      v-model="isShowEditForm"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <edit :editId="editId" :readonly="readonly" @close="onEditClose" :rand="rand"></edit>
    </el-dialog>

    <el-dialog :title="iconExpressName + ' 物流详情'" v-model="iconDialogTableVisible" size="small">
      <!--<el-carousel height="39vh">-->
      <!--<el-carousel-item v-for="item in icons">-->
      <!--<img :src="item"/>-->
      <!--</el-carousel-item>-->
      <!--</el-carousel>-->
      <express :num="expressNum" :com="expressCom" :rand="rand"></express>

    </el-dialog>

  </div>
</template>
<style scoped>
  .max_widths {
    max-width: 180px;
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

  .el-carousel__item {
    overflow: visible;
  }

  .el-carousel__item img {
    width: 100% !important;
  }

  .control-label {
    width: 94px;
  }
</style>
<script type="text/ecmascript-6">
  import {Pagination} from 'element-ui'
  import utils from '../../publicjs/utils'
  import editExpressmanagement from './editExpressmanagement.vue'
  import Express from "../public/Express";

  export default {
    components: {
      Express,
      Pagination,
      edit: editExpressmanagement,
      utils
    },
    data: function () {
      return {
        pageInfo: {
          currPage: 1,
          limit: ENV.PAGE_SHOW_COUNT,
          offset: 0,
          total: 0,
        },
        selectedCompany: [],
        companies: [],
        selectedDepartment: [],
        departments: [],
        selectedNumber: [],
        numbers: [],
        //快递信息
        expressInfo: {},

        selectedHeader: [],
        table_header: [
          {
            id: 0,
            header_name: "快递单号",
            state: false
          }, {
            id: 1,
            header_name: "收件公司",
            state: false
          }, {
            id: 2,
            header_name: "收件人",
            state: false
          }, {
            id: 3,
            header_name: "我方主体",
            state: false
          }, {
            id: 4,
            header_name: "发件人",
            state: true
          }, {
            id: 5,
            header_name: "邮寄方式",
            state: false
          }, {
            id: 6,
            header_name: "邮寄内容",
            state: false
          }, {
            id: 7,
            header_name: "物流详情",
            state: false
          }, {
            id: 8,
            header_name: "操作",
            state: false
          }
        ],
        selectUser: [],
        users: [],
        items: [],
        isLoading: true,
        selectedBody: '',
        body: [
          {id: 0, body: "无主体"},
          {id: 1, body: "云端"},
          {id: 2, body: "有量"}],
        selectedContent: '',
        contentType: [
          {id: 1, contentType: "合同"},
          {id: 2, contentType: "发票"},
          {id: 3, contentType: "其他"}
        ],
        selectedCompanies: {},
        dialogVisible: false,
        gridData: [],
        isShowEditForm: false,
        editId: 0,
        readonly: false,
        icons: [],
        iconExpressName: "",
        iconDialogTableVisible: false,

        rand: 0,
        expressNum: null,
        expressCom: null,
        downloadUrl: "", // 下载链接
      }
    },
    mounted: function () {
      let selected = [2, 4, 5]
      this.selectedHeader = selected;
      this.getCompanySelectList();
      this.getExpressNumber();
      this.getUserList();
      this.getDepartmentList();
      this.getAll();
    },
    methods: {
      goaddExpress(id){
        this.readonly = false
        this.isShowEditForm = true
        this.editId = id
        if (id === 0) {
          this.reset()
        } else {
        }
        this.rand = Math.random()
      },
      //查看
      detailItem(id){
        this.isShowEditForm = true
        this.editId = id
        this.readonly = true

        this.rand = Math.random()
      },
      // 编辑对话框关闭
      onEditClose(needRefresh){
        this.isShowEditForm = false
        this.readonly = false
        if (needRefresh) {
          this.doGetOrderList()
        }
      },
      reset: function () {
//        this.selectedCompany = []
//        this.selectedBody = ''
        this.doGetOrderList()
      },
      showHeader: function () {
        for (let i in this.table_header) {
          this.table_header[i].state = false
        }
//        this.table_header[2].state = true
//        this.table_header[5].state = true

        for (let i in this.selectedHeader) {
          this.table_header[this.selectedHeader[i]].state = true
        }
      },
      opendialog(item) {
        let expressCom = 'shunfeng'
        switch (item.send_type) {
          case 147:
            expressCom = 'ems'
            break
        }

        this.expressNum = item.number
        this.expressCom = expressCom

        this.rand = Math.random()
        this.iconDialogTableVisible = true
      },
      handleCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.doGetOrderList()
      },

      getCompanySelectList: function () {
        let url = '/companytype/list'
        this.$http.get(url)
          .then((res) => {
            this.companies = res.body
          })
      },
      getUserList: function () {
        let url = '/user/userList'
        this.$http.get(url)
          .then((res) => {
            this.users = res.body
          })
      },
      getDepartmentList(){
        let url = '/department'
        this.$http.get(url)
          .then((res) => {
            this.departments = res.body
          })
      },
      getExpressNumber(){
        let url = '/expressManage/expressList'
        this.$http.get(url)
          .then((res) => {
            this.numbers = res.body
          })
      },
      doGetOrderList() {
        let idStrCompany = []
        if (this.selectedCompany.length != 0) {
          for (let i in this.selectedCompany) {
            idStrCompany.push(this.selectedCompany[i])
          }
        }

        let departments = []
        if (this.selectedDepartment.length !== 0) {
          for (let i in this.selectedDepartment) {
            departments.push(this.selectedDepartment[i])
          }
        }

        let sendUsers = []
        if (this.selectUser !== null) {
          for (let i in this.selectUser) {
            sendUsers.push(this.selectUser[i])
          }
        }

        let contentType = []
        if (this.selectedContent !== null) {
          contentType.push(this.selectedContent)
        }

        let body = []
        if (this.selectedBody !== null) {
          body.push(this.selectedBody)
        }

        let query = util.buildGetParams({
          "idStrCompany": idStrCompany.join(","),
          "sendUsers": sendUsers.join(","),
          "body": body,
          "departments": departments.join(","),
          "contentid": contentType,
          "offset|page": this.pageInfo,
          "number": this.selectedNumber
        })

        let url = '/expressManage?' + query

        let xtoken = sessionStorage.getItem("token")
        this.downloadUrl = ENV.HOST_URL + '/expressManage/download?' + query + "&_token=" + xtoken

        this.isLoading = true
        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data
            this.pageInfo.total = res.body.total
            this.isLoading = false
          })
      },
      getAll(){
        this.doGetOrderList(0)
      },
    }
  };
</script>


<template>
  <div>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="col-md-10 form-horizontal">
            <div class="form-group">
              <div class="col-md-4 col-sm-12">
                <label class="col-sm-2 control-label">公司名称:</label>
                <div class="col-sm-9 ipt_jianju">
                  <el-select
                    @change="getList"
                    v-model="selectedCompanies" :clearable="true"
                    filterable placeholder="请选择">
                    <el-option
                      v-for="item in companies"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-md-4 col-sm-12">
                <label class="col-sm-2 control-label">合同状态:</label>
                <div class="col-sm-9 ipt_jianju">
                  <el-select
                    @change="getList"
                    v-model="contractStatus" :clearable="true"
                    filterable placeholder="请选择">
                    <el-option
                      v-for="item in oncontractStatus"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-md-4 col-sm-12">
                <label class="col-sm-2 control-label">商务负责人:</label>
                <div class="col-sm-9 ipt_jianju">
                  <el-select
                    @change="getList"
                    v-model="selectedPeople" :clearable="true"
                    filterable placeholder="请选择">
                    <el-option
                      v-for="item in Peoples"
                      :label="item.nickname"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="row form-group">
                <div class="col-md-4 post-btn">
                  <button class="btn btn-primary btn-block" @click="addOrEditItem(0)">添加发行商</button>
                </div>
              </div>
            </div>

          </div>
          <div class="box-body">
            <el-dialog title="联系人" v-model="dialogTableVisible">
              <el-table :data="gridData" id="table_ids">
                <el-table-column property="name" label="联系人"></el-table-column>
                <el-table-column property="position" label="职位"></el-table-column>
                <el-table-column property="email" label="邮箱"></el-table-column>
                <el-table-column property="phone" label="电话" width="180"></el-table-column>
                <el-table-column property="qq" label="QQ"></el-table-column>
                <el-table-column property="wechart" label="微信"></el-table-column>
              </el-table>
            </el-dialog>
            <el-select
              v-model="selectedHeader" :clearable="true"
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
                prop="name"
                label="公司名称"
                v-if="!table_header[0].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.company_name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="main_contract_state"
                label="合同状态"
                min-width="100">
              </el-table-column>
              <el-table-column
                prop="platform_name"
                label="平台名称"
                v-if="!table_header[2].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.platform_name }}
                  </p>
                </template>
              </el-table-column>

              <el-table-column
                prop="region"
                label="区域"
                v-if="!table_header[3].state"
                min-width="120">
                <template scope="scope">
                  <p>
                    {{ scope.row.region }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="website"
                label="公司网站"
                v-if="!table_header[4].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.website }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="contacts"
                label="公司联系人"
                v-if="!table_header[5].state"
                min-width="120">
                <template scope="scope">
                  <!--<p class="max_widths" v-if="scope.row.company">-->
                  <el-tag @click.native=showContactList(scope.row.contacts) class="role-tag"
                          v-for="perm in scope.row.contacts">
                    {{ perm.name}}


                  </el-tag>
                  <!--</p> -->
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="公司地址"
                v-if="!table_header[1].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.address }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="账户信息"
                v-if="!table_header[9].state"
                min-width="140">
                <template scope="scope">
                  <div class="result_report">
                    <el-button title="查看详情" type="text" size="large"
                               @click=informations(scope.row)>查看详情


                    </el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="desc"
                label="备注"
                v-if="!table_header[6].state"
                min-width="160">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.desc }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="responsible_person"
                label="商务负责人"
                v-if="!table_header[10].state"
                min-width="140">
                <template scope="scope">
                  <span type="primary" title="云端" class="max_widths">{{ scope.row.yunduan_res_per_name }}</span>
                  <span type="primary" title="有量" class="max_widths">{{ scope.row.youliang_res_per_name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="update_info"
                label="更新人"
                v-if="!table_header[7].state"
                min-width="140">
                <template scope="scope">
                  <p
                    class="max_widths">{{ scope.row.update_user_name}} {{ scope.row.update_time | stampToTime }}</p>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                v-if="!table_header[8].state"
                width="100">
                <template scope="scope">
                  <div class="result_report">
                    <el-button title="编辑" class="fa fa-edit" type="text" size="small"
                               @click=addOrEditItem(scope.row.id)></el-button>
                    <el-button title="添加编辑主合同" class="fa fa-folder-open" type="text" size="small"
                               @click=onaddOrEditItem(scope.row,1)></el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <Pagination
              v-show="pageInfo.total > pageInfo.limit"
              @current-change="handleCurrentChange"
              :current-page="pageInfo.currPage"
              :page-size="pageInfo.limit"
              layout="prev, pager, next, jumper"
              :total="pageInfo.total">
            </Pagination>
          </div>

        </div>
      </div>
    </div>

    <el-dialog :title="(editId?'编辑':'添加')+'发行商'"
               v-model="isShowForm" top="5%" size="large"
               :close-on-click-modal="false">
      <editor :editId="editId" @close="onEditClose" :rand="rand"></editor>
    </el-dialog>
    <el-dialog title="账户信息"
               v-model="information" top="5%" size="tiny"
               :close-on-click-modal="false">
      <div class="row">
        <div class="box-body form-horizontal">
          <div class="form-group">
            <label class="col-sm-2 control-label">开户全称：</label>
            <div class="col-sm-8 compa">
              <el-input v-model="AccountName" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">开户银行：</label>
            <div class="col-sm-8 compa">
              <el-input v-model="Bank" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">开户账号：</label>
            <div class="col-sm-8 compa">
              <el-input v-model="AccountNumber" type="number" placeholder="请输入内容"></el-input>
            </div>
          </div>
        </div>
        <div class="box-footer">
          <el-button type="primary" @click=postInfo>保存</el-button>
          <el-button type="button" @click="information = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog :title="(editId.main_contract_id === 0?'添加':'编辑')+'主合同'"
               v-model="Contract" top="5%" size="large"
               :close-on-click-modal="false">
      <oneditor :editIdss="editIds" :oneditId="oneditIds" :rand="rand" @close="onEditClose"></oneditor>
    </el-dialog>
  </div>
</template>
<style scoped>
  .control-label {
    width: 110px;
  }

  .compa {
    padding-left: 0;
  }
</style>
<script>
  import util from '../../../publicjs/utils'
  import {Pagination} from 'element-ui'
  import editor from '../editpublisher.vue'
  import oneditor from '../CPcontract.vue'

  export default {
    components: {
      Pagination,
      editor,
      oneditor,
    },
    data: function () {
      return {
        pageInfo: {currPage: 1, limit: ENV.PAGE_SHOW_COUNT, offset: 0, total: 0,},
        selectedCompanies: '',
        contractStatus: '',
        companies: [],
        oncontractStatus: [],
        items: [],
        isLoading: true,
        downloadUrl: "", // 下载链接
        AccountName: "",
        Bank: "",
        AccountNumber: "",

        editIds: {},
        oneditIds: null,
        Contract: false,
        selectedHeader: [],
        table_header: [
          {id: 0, header_name: "公司名称", state: false},
          {id: 2, header_name: "平台名称", state: true},
          {id: 3, header_name: "区域", state: false},
          {id: 4, header_name: "公司网站", state: true},
          {id: 5, header_name: "公司联系人", state: false},
          {id: 1, header_name: "公司地址", state: false},
          {id: 6, header_name: "备注", state: false},
          {id: 7, header_name: "更新人", state: false},
          {id: 8, header_name: "操作", state: false},
          {id: 9, header_name: "账户信息", state: true},
          {id: 10, header_name: "商务负责人", state: false}
        ],
        gridData: [],
        dialogTableVisible: false,

        editId: 0,
        isShowForm: false,
        information: false,
        rand: 0,
        selectedPeople: null,
        Peoples: [],
      }
    },
    methods: {
      getPeoples: function () {
        let url = "/user/devment/245"
        this.$http.get(url)
          .then((res) => {
            this.Peoples = res.body
          })
      },
      handleCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.getList()
      },
      getCompanySelectList: function () {
        let cps = this.$route.query.cps ? this.$route.query.cps : ''
        var url = ENV.HOST_URL + '/companytype/?limit=1000'
        this.$http.get(url)
          .then((res) => {
            this.companies = res.body.data
            for (let i in this.companies) {
              if (this.companies[i].id == cps) {
                this.selectedCompanies = this.companies[i].id
              }
            }
          })
      },
      getoncontractStatusList: function () {
        var url = ENV.HOST_URL + '/distributionCompany/state/?limit=1000'
        this.$http.get(url)
          .then((res) => {
            this.oncontractStatus = res.body
          })
      },
      onaddOrEditItem(v, type) {
        this.editIds = v
        this.oneditIds = type
        this.Contract = true
        this.rand = Math.random()
      },
      getList() {
        this.getoncontractStatusList();
        let query = util.buildGetParams({
          "offset|page": this.pageInfo,
          "sortby": "create_time"
        })
        let url = "/distributionCompany/?" + query
        if (this.selectedCompanies && this.selectedCompanies) {
          url += "&company_id=" + this.selectedCompanies
        }
        if (this.selectedPeople) {
          url += "&people=" + this.selectedPeople
        }
        if (this.contractStatus && this.contractStatus) {
          let contract = []
          for (let i in this.oncontractStatus) {
            if (this.oncontractStatus[i].id === this.contractStatus) {
              contract = this.oncontractStatus[i].company_ids
            }
          }
          if (contract != '' && this.selectedCompanies != '') {
            url += "&company_id=" + this.selectedCompanies + "," + contract
          } else if (contract != '' && this.selectedCompanies == '') {
            url += "&company_id=" + contract
          } else if (contract == '' && this.selectedCompanies != '') {
            url += "&company_id=" + this.selectedCompanies
          } else {
            url
          }
        }
        this.isLoading = true
        this.$http.get(url)
          .then(({data}) => {
            this.items = data.data
            this.pageInfo.total = data.total
            this.isLoading = false
          })
      },
      addOrEditItem(id) {
        this.editId = id
        this.isShowForm = true

        this.rand = Math.random()
      },
      informations(info) {
        this.AccountName = info.account_name ? info.account_name : info.company_name
        this.Bank = info.bank
        this.AccountNumber = info.account_number
        this.editId = info.id

        this.information = true
      },
      postInfo() {
        if (!this.Bank) {
          this.$message({
            type: 'error',
            message: '请输入开户银行'
          })
          return
        }
        if (!this.AccountNumber) {
          this.$message({
            type: 'error',
            message: '请输入开户账号'
          })
          return
        }
        let post = util.buildPostParams({
          account_name: this.AccountName,
          bank: this.Bank,
          account_number: this.AccountNumber.toString(),
        })
        let url = "/distributionCompany/"
        this.$http.put(url + this.editId, post)
          .then((r) => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.getList()
          })

        this.information = false
      },
      onEditClose(needRefresh) {
        this.isShowForm = false
        this.Contract = false
        if (needRefresh) {
          this.getCompanySelectList();
          this.getList()
        }
      },

      showHeader: function () {
        for (let i in this.table_header) {
          if (i === 4 || i === 2 || i === 9) {
            this.table_header[i].state = true
          }
          this.table_header[i].state = false
        }
        for (let i in this.selectedHeader) {
          this.table_header[this.selectedHeader[i]].state = true
        }
      },
      showContactList: function (data) {
        this.gridData = data
        this.dialogTableVisible = true
      },
      chilFn(activeName2) {
        console.log('发行商=' + activeName2)
        this.getCompanySelectList();
        this.getList()
      },
    },
    mounted: function () {
      this.getPeoples();
      this.getCompanySelectList();
      this.getoncontractStatusList();
      this.getList(0)
      this.selectedHeader = [4, 2, 9]
    },
  }
</script>

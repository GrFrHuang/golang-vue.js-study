<template>
  <div>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="col-md-10 form-horizontal">
            <div class="form-group">
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">公司名称:</label>
                <div class="col-sm-9 ipt_jianju">
                  <el-select
                    v-model="selectedCompanies" :clearable="true"
                    @change="getList"
                    filterable placeholder="请选择">
                    <el-option
                      v-for="item in companies"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">渠道名称:</label>
                <div class="col-sm-9 ipt_jianju">
                  <el-select
                    v-model="selectedChannels" :clearable="true"
                    @change="getList"
                    filterable placeholder="请选择">
                    <el-option
                      v-for="item in channels"
                      :label="item.name"
                      :value="item.cp">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">合作状态:</label>
                <div class="col-sm-9 ipt_jianju">
                  <el-select
                    v-model="selectedCooperateState" :clearable="true"
                    @change="getList"
                    filterable placeholder="请选择">
                    <el-option
                      v-for="item in cooperateState"
                      :label="item.state"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">合同状态:</label>
                <div class="col-sm-9 ipt_jianju">
                  <el-select
                    v-model="contractStatus" :clearable="true"
                    @change="getList"
                    filterable placeholder="请选择">
                    <el-option
                      v-for="item in oncontractStatus"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">商务负责人:</label>
                <div class="col-sm-9 ipt_jianju">
                  <el-select
                    v-model="selectedPeople" :clearable="true"
                    @change="getList"
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
                <div class="col-md-3 post-btn">
                  <button class="btn btn-primary btn-block" @click="addOrEditItem(0)">添加渠道商</button>
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
                <el-table-column property="phone" label="电话"></el-table-column>
                <el-table-column property="qq" label="QQ"></el-table-column>
                <el-table-column property="wechart" label="微信"></el-table-column>
              </el-table>
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
                prop="channel_name"
                label="渠道名称"
                v-if="!table_header[0].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widthv">{{ scope.row.channel_name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="公司名称"
                v-if="!table_header[1].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.company_name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="platform_name"
                label="平台名称"
                v-if="!table_header[2].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widthv">{{ scope.row.platform_name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="region"
                label="区域"
                v-if="!table_header[3].state"
                min-width="100">
                <template scope="scope">
                  <p>{{ scope.row.region }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="website"
                label="公司网站"
                v-if="!table_header[4].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widthv">{{ scope.row.website }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="properties"
                label="渠道属性"
                v-if="!table_header[5].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widthv">{{ scope.row.properties }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="main_contract_state"
                label="合同状态"
                min-width="100">
              </el-table-column>
              <el-table-column
                prop="cooperateState"
                label="合作状态"
                v-if="!table_header[6].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widthv" style="color: green" v-if="scope.row.cooperate_state == 1">合作中</p>
                  <p class="max_widthv" style="color: red" v-if="scope.row.cooperate_state == 2">谈判中</p>
                  <p class="max_widthv" style="color: gray" v-if="scope.row.cooperate_state == 3">终止合作</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="remits"
                label="回款主体"
                v-if="!table_header[7].state"
                min-width="240">
                <template scope="scope">
                  <p class="max_widths">
                    <el-tag class="role-tag" v-for="perm in scope.row.remits">
                      {{perm.name}}
                    </el-tag>
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="contacts"
                label="公司联系人"
                v-if="!table_header[8].state"
                min-width="160">
                <template scope="scope">
                  <!--<p class="max_widths" v-if="scope.row.company">-->
                  <el-tag @click.native=showContactList(scope.row.contacts) class="role-tag"
                          v-for="perm in scope.row.contacts">
                    {{perm.name}}
                  </el-tag>
                  <!--</p>-->
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="公司地址"
                v-if="!table_header[9].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.address }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="desc"
                label="备注"
                v-if="!table_header[10].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.desc }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="responsible_person"
                label="商务负责人"
                v-if="!table_header[11].state"
                min-width="140">
                <template scope="scope">
                  <span type="primary" title="云端" class="max_widths">{{ scope.row.yunduan_res_per_name }}</span>
                  <span type="primary" title="有量" class="max_widths">{{ scope.row.youliang_res_per_name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="update_info"
                label="更新人"
                v-if="!table_header[12].state"
                min-width="140">
                <template scope="scope">
                  <p
                    class="max_widths">{{ scope.row.update_user_name }} {{ scope.row.update_time | stampToTime }}</p>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                v-if="!table_header[13].state"
                min-width="100">
                <template scope="scope">
                  <el-button title="编辑" class="fa fa-edit" type="text" size="small"
                             @click=addOrEditItem(scope.row.id,scope.row.channel_code)></el-button>
                  <el-button title="添加编辑主合同" class="fa fa-folder-open" type="text" size="small"
                             @click=onaddOrEditItem(scope.row,2)></el-button>
                </template>
              </el-table-column>
            </el-table>
            <Pagination
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

    <el-dialog :title="(editId?'编辑':'添加')+'渠道商'"
               v-model="isShowForm" top="5%" size="large"
               :close-on-click-modal="false">
      <editor :editId="editId" :rand="rand" :channel_code="channel_code" @close="onEditClose"></editor>
    </el-dialog>
    <el-dialog :title="(row.main_contract_id === 0?'添加':'编辑')+'主合同'"
               v-model="Contract" top="5%" size="large"
               :close-on-click-modal="false">
      <oneditor :row="row" :oneditId="oneditIds" :rand="rand" @close="onEditClose"></oneditor>
    </el-dialog>
  </div>
</template>
<style scoped>
  .control-label {
    width: 94px;
  }
</style>
<script>
  import util from '../../../publicjs/utils'
  import ChannelBusiness from '../ChannelBusiness/ChannelBusiness'
  import {Pagination} from 'element-ui'
  import editor from '../editChannelBusiness.vue'
  import oneditor from '../contract.vue'

  export default {
    components: {
      Pagination,
      editor,
      oneditor,
    },
    data: function () {
      return {
        pageInfo: {currPage: 1, limit: ENV.PAGE_SHOW_COUNT, total: 0,},
        selectedCompanies: '',
        companies: [],
        selectedChannels: '',
        channels: [],
        items: [],
        isLoading: true,
        downloadUrl: "", // 下载链接
        channel_code: "",
        editId: 0,
        row: {},
        oneditIds: null,
        isShowForm: false,
        Contract: false,

        selectedHeader: [],
        table_header: [
          {id: 0, header_name: "渠道名称", state: false},
          {id: 1, header_name: "公司名称", state: false},
          {id: 2, header_name: "平台名称", state: false},
          {id: 3, header_name: "区域", state: false},
          {id: 4, header_name: "公司网站", state: true},
          {id: 5, header_name: "渠道属性", state: false},
          {id: 6, header_name: "合作状态", state: false},
          {id: 7, header_name: "回款主体", state: true},
          {id: 8, header_name: "公司联系人", state: true},
          {id: 9, header_name: "公司地址", state: false},
          {id: 10, header_name: "备注", state: false},
          {id: 11, header_name: "商务负责人", state: false},
          {id: 12, header_name: "更新人", state: false},
          {id: 13, header_name: "操作", state: false}],
        gridData: [],
        dialogTableVisible: false,
        rand: 0,
        selectedCooperateState: null,
        contractStatus: null,
        cooperateState: [
          {id: 1, state: "合作中"},
          {id: 2, state: "谈判中"},
          {id: 3, state: "终止合作"}],
        selectedPeople: null,
        Peoples: [],
        oncontractStatus: []
      }
    },
    methods: {
      addOrEditItem(id, channel_code){
        this.editId = id
        this.channel_code= channel_code
        this.isShowForm = true
        this.rand = Math.random()
      },
      onEditClose(needRefresh){
        this.isShowForm = false
        this.Contract = false
        if (needRefresh) {
          this.getList()
        }
      },
      handleCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.getList()
      },
      onaddOrEditItem(row, type){
        this.row = row
        this.oneditIds = type
        this.Contract = true
        this.rand = Math.random()
      },
      getCompanySelectList: function () {
        let url = '/companytype/?limit=1000'
        this.$http.get(url)
          .then((res) => {
            this.companies = res.body.data
          })
      },
      getChannelSelectList: function () {
        let url = '/channelCompany/channels/?limit=1000'
        this.$http.get(url)
          .then((res) => {
          console.log(this.items)
            this.channels = res.body
          })
        this.selectedChannels = this.$route.query.cp ? this.$route.query.cp : ''
      },
      getoncontractStatusList: function () {
        var url = ENV.HOST_URL + '/channelCompany/state/'
        this.$http.get(url)
          .then((res) => {
            this.oncontractStatus = res.body
          })
      },
      getPeoples: function () {
        let url = "/user/devment/237"
        this.$http.get(url)
          .then((res) => {
            this.Peoples = res.body
          })
      },
      getList() {
        this.getoncontractStatusList();

//        let cond = []
//        if (this.selectedCompanies && this.selectedCompanies) {
//          cond.push("company_id:in" + this.selectedCompanies)
//        }
//        if (this.selectedChannels && this.selectedChannels) {
//          cond.push("channel_code:in" + this.selectedChannels)
//        }
//        if (this.selectedCooperateState) {
//          cond.push("cooperate_state:" + this.selectedCooperateState)
//        }
//        if (this.selectedPeople) {
//          cond.push("youliang_responsible_person or yunduan_responsible_person:in" + this.selectedPeople)
////          cond.push("yunduan_responsible_person:in" + this.selectedPeople)
//        }
        let contract = []
        for (let i in this.oncontractStatus) {
          if (this.oncontractStatus[i].id === this.contractStatus) {
            contract = this.oncontractStatus[i].company_ids
          }
        }
        var query
        if (contract != '' && this.selectedCompanies != '') {
          query = util.buildGetParams({
            "offset|page": this.pageInfo,
            "sortby": "create_time",
            "company_id": this.selectedCompanies + ',' + contract,
            "channel_code": this.selectedChannels,
            "cooperate_state": this.selectedCooperateState,
            "person": this.selectedPeople
          })
        } else if (contract != '' && this.selectedCompanies == '') {
          query = util.buildGetParams({
            "offset|page": this.pageInfo,
            "sortby": "create_time",
            "company_id": contract,
            "channel_code": this.selectedChannels,
            "cooperate_state": this.selectedCooperateState,
            "person": this.selectedPeople
          })
        } else if (contract == '' && this.selectedCompanies != '') {
         query = util.buildGetParams({
            "offset|page": this.pageInfo,
           "sortby": "create_time",
           "company_id": this.selectedCompanies,
            "channel_code": this.selectedChannels,
            "cooperate_state": this.selectedCooperateState,
            "person": this.selectedPeople
          })
        } else {
          query = util.buildGetParams({
            "offset|page": this.pageInfo,
            "sortby": "create_time",
            "company_id": this.selectedCompanies,
            "channel_code": this.selectedChannels,
            "cooperate_state": this.selectedCooperateState,
            "person": this.selectedPeople
          })
        }


        let url = "/channelCompany/?" + query
        this.isLoading = true
        this.$http.get(url)
          .then(({data}) => {
            for (let i in data.data) {
              if (data.data[i].remit_company == null) {
                data.data[i].remit_company = []
              } else {
                data.data[i].remit_company = data.data[i].remit_company
              }
            }
            this.items = data.data;
            this.pageInfo.total = data.total
            this.isLoading = false
          })
      },
      showHeader: function () {
        for (let i in this.table_header) {
          if (i == 7 || i == 4 || i == 8 || i == 9) {
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
      chilFn (activeName2){
        this.getCompanySelectList();
        this.getChannelSelectList();
        this.getoncontractStatusList();
        this.getList(0);
      },
    },
    mounted: function () {
      this.getPeoples();
      this.getCompanySelectList();
      this.getChannelSelectList();
      this.getoncontractStatusList();
      this.getList(0);
      let selected = [7, 4, 8, 9]
      this.selectedHeader = selected
    },
  }
</script>

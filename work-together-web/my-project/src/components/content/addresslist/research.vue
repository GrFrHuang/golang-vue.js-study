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
                    v-model="selectedCompanies"
                    :clearable="true"
                    filterable
                    @change="getList"
                    placeholder="请选择">
                    <el-option v-for="item in companies"
                               :label="item.name"
                               :value="item.id"></el-option>
                  </el-select>
                </div>
              </div>
            </div>

            <div class="col-md-12">
              <div class="row form-group">
                <div class="col-md-3 post-btn">
                  <button class="btn btn-primary btn-block" @click="editOrAddItem(0)">添加研发商</button>
                </div>
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
              <el-table-column property="phone" label="电话" width="155"></el-table-column>
              <el-table-column property="qq" label="QQ"></el-table-column>
              <el-table-column property="wechart" label="微信"></el-table-column>
            </el-table>
          </el-dialog>
          <el-select v-model="selectedHeader" :clearable="true" @change="showHeader" multiple placeholder="请选择">
            <el-option v-for="item in table_header" :key="item.id" :label="item.header_name"
                       :value="item.id"></el-option>
          </el-select>
          <el-table v-loading="isLoading" element-loading-text="拼命加载中" class="table table-bordered table-hover" :data="items" border stripe style="width: 100%">
            <el-table-column fixed prop="name" label="公司名称" v-if="!table_header[0].state" min-width="140">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.company_name }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="region" label="区域" v-if="!table_header[1].state" min-width="140">
              <template scope="scope">
                <p>
                  {{ scope.row.region }}
            </p>
              </template>
            </el-table-column>
            <el-table-column prop="website" label="公司网站" v-if="!table_header[2].state" min-width="140">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.website }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="contacts" label="公司联系人" v-if="!table_header[3].state" min-width="140">
              <template scope="scope">
                  <el-tag @click.native="showContactList(scope.row.contacts)" class="role-tag"
                          v-for="perm in scope.row.contacts">
                    {{ perm.name }}
                  </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="website" label="公司地址" v-if="!table_header[4].state" min-width="140">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.address }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="desc" label="备注" v-if="!table_header[5].state" min-width="140">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.desc }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="update_info" label="更新人" v-if="!table_header[6].state" min-width="140">
              <template scope="scope">
                <p class="max_widths">
                  {{ scope.row.update_user_name }} {{scope.row.update_time | stampToTime}}</p>
              </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" v-if="!table_header[7].state" min-width="100">
              <template scope="scope">
                <el-button title="编辑" class="fa fa-edit" type="text" size="small" @click=editOrAddItem(scope.row.id)></el-button>
                <!--<div class="result_report" @click="editOrAddItem(scope.row.id)">-->
                  <!--<span class="fa fa-edit table-hovers"></span>-->
                <!--</div>-->
              </template>
            </el-table-column>
          </el-table>
          <Pagination
            v-show="pageInfo.total > pageInfo.limit" @current-change="handleCurrentChange"
            :current-page="pageInfo.currentPage" :page-size="pageInfo.limit"
            layout="prev, pager, next, jumper, total" :total="pageInfo.total"></Pagination>
        </div>
      </div>
    </div>

    <el-dialog :title="(editId?'编辑':'添加')+'研发商'"
               v-model="isShowForm" top="5%" size="large"
               :close-on-click-modal="false">
      <editor :editId="editId" :rand="rand" @close="onEditClose"></editor>
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
  import {Pagination} from 'element-ui'
  import editor from '../editresearch.vue'

  export default {
    components: {
      Pagination,
      editor,
    },
    data: function () {
      return {
        pageInfo: { currPage: 1, limit: ENV.PAGE_SHOW_COUNT, offset: 0, total: 0,},
        selectedCompanies: '',
        companies: [],
        items: [],
        isLoading: true,
        downloadUrl: "", // 下载链接
        selectedHeader: [],
        table_header: [
          {id: 0, header_name: "公司名称", state: false},
          {id: 1, header_name: "区域", state: false},
          {id: 2, header_name: "公司网站", state: true},
          {id: 3, header_name: "公司联系人", state: true},
          {id: 4, header_name: "公司地址", state: true},
          {id: 5, header_name: "备注", state: false},
          {id: 6, header_name: "更新人", state: false},
          {id: 7, header_name: "操作", state: false}],
        parentMessage: 'Parent',
        gridData: [],
        dialogTableVisible: false,

        rand: 0,
        editId: 0,
        isShowForm: false,
      }
    },
    methods: {
      editOrAddItem(id){
        this.getCompanySelectList();
        this.getList(0);
        this.editId = id
        this.isShowForm = true

        this.rand = Math.random()
      },
      onEditClose(needRefresh){
        this.isShowForm = false
        if (needRefresh) {
          this.getList()
        }
      },
      handleCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.getList()
      },
      showHeader: function () {
        for (let i in this.table_header) {
          if (i === 2 || i === 3|| i === 4) {
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
      getCompanySelectList: function () {
        var url = ENV.HOST_URL + '/companytype/?limit=1000'
        this.isLoading = true
        this.$http.get(url)
          .then((res) => {
            this.companies = res.body.data
            this.isLoading = false
          })
      },

      getList() {
        let query = util.buildGetParams({
          'offset|page': this.pageInfo,
          "create_time": "create_time"
        })
        let url = "/developCompany/?" + query
        if (this.selectedCompanies && this.selectedCompanies) {
          url += "&query=company_id:in" + this.selectedCompanies
        }
        this.$http.get(url)
          .then(({data}) => {
            this.items = data.data
            this.pageInfo.total = data.total
          })
      },
      chilFn (activeName2){
        this.getCompanySelectList();
        this.getList(0);
      },
    },
    mounted: function () {
      this.getCompanySelectList();
      this.getList(0);
      this.selectedHeader = [2, 3, 4]
    },
  }
</script>

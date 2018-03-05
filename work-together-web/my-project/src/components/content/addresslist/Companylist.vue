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
                  <button class="btn btn-primary btn-block" @click="addCompanyType">添加公司</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box-body">
          <el-table v-loading="isLoading" element-loading-text="拼命加载中" class="table table-bordered table-hover" :data="items" border stripe style="width: 100%">
            <el-table-column fixed prop="name" label="序号" v-if="!table_header[0].state" min-width="140">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.id }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="region" label="公司名称" v-if="!table_header[1].state" min-width="140">
              <template scope="scope">
                <p class="max_widths">
                  {{ scope.row.name }}
            </p>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" v-if="!table_header[6].state" min-width="100">
              <template scope="scope">
                <el-button title="编辑" class="fa fa-edit" type="text" size="small" @click="editCompanyType(scope.row.id,scope.row.name)"></el-button>
                <el-button type="text" size="small" class="fa fa-trash " @click="deleteItem(scope.row.id)" title="删除"></el-button>
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

    <el-dialog :title="(editId?'编辑':'添加')+'公司'"
               v-model="isShowForm" top="5%">
        <div>
          <div id="resear_h3">
            <div id="resear">
              <div class="situation row contact_div">
                <label class="times_contracts">公司名称:</label>
                <div class="col-lg-10 col-sm-9 times_contract">
                  <el-input v-model="form.name" placeholder="请输入内容"></el-input>
                </div>
              </div>
              <div class="form-group " v-if="editId">
                <label class="col-sm-2 control-label">操作日志</label>
                <div class="col-sm-10">
                  <operate-log :keyLabel="operateLabel" :page="34" :dataId="editId" :rand="rand"></operate-log>
                </div>
              </div>
              <div class="row contact_div contact_div_btn">
                <div class="dowebok form-control_statesd">
                  <p id="test">
                    <button class="btn btn-default btn_B col-sm-5" :disabled= disabl @click="submit">保存</button>
                    <button class="btn btn-default btn_F col-sm-5 col-md-offset-1" @click="isShowForm=false">返回</button>
                  </p>
                </div>
            </div>

          </div>
        </div>
      </div>
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
  import OperateLog from "../../public/OperateLog";

  export default {
    components: {
      Pagination,
      'operate-log': OperateLog,
    },
    data: function () {
      return {
        disabl: false,
        pageInfo: {currPage: 1, limit: ENV.PAGE_SHOW_COUNT, offset: 0, total: 0,},
        selectedCompanies: '',
        companies: [],
        items: [],
        isLoading: true,
        downloadUrl: "", // 下载链接
        form: {
          id: 0,
          name:""
        },
        emptyForm: {
          id: 0,
          name:""
        },
        selectedHeader: [],
        table_header: [
          {id: 0, header_name: "公司名称", state: false},
          {id: 1, header_name: "区域", state: false},
          {id: 2, header_name: "公司网站", state: true},
          {id: 3, header_name: "公司联系人", state: true},
          {id: 4, header_name: "备注", state: false},
          {id: 5, header_name: "更新人", state: false},
          {id: 6, header_name: "操作", state: false}],

        editId: 0,
        isShowForm: false,
        rand: 0,
        operateLabel: {
          Name: '公司名称',
        }
      }
    },
    methods: {
      submit() {
        if (this.disabl === false) {
          this.disabl = true
          setTimeout( () => {
            this.disabl = false
          }, 1500);
        }
        let post = util.buildPostParams(this.form)

        if (this.form.id) {
          // update
          let url = "/companytype/" + this.form.id
          this.$http.put(url, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '操作成功',
              })
              this.isShowForm = false
              this.resetForm()
              this.getCompanySelectList()
              this.getList()
            })
            .catch((err) => {
              this.$message({
                type: "error",
                message: err.data
              })
            })

        } else {
          // insert
          let url = "/companytype/"
          this.$http.post(url, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '操作成功',
            })
              this.isShowForm = false
              this.resetForm()
              this.getCompanySelectList()
              this.getList()
            })
            .catch((err) => {
              this.$message({
                type: "error",
                message: err.data
              })
            })
        }

      },
      resetForm(){
        this.form = _.cloneDeep(this.emptyForm)
      },
      close(needRefresh = false){
        this.$emit('close', needRefresh)
      },
      deleteItem(id){
        this.$confirm('此操作将永久删除该公司, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let url = "/companytype/" + id;
            this.$http.delete(url)
              .then((res) => {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.resetForm()
                this.getCompanySelectList()
                this.getList()
              })
          });
      },
      editCompanyType(id, name){
        this.editId = id
        this.form.id = id
        this.form.name = name
        this.isShowForm = true
        this.rand = Math.random()
      },
      addCompanyType() {
        this.isShowForm = true
        this.resetForm()
        this.editId = 0
      },
      handleCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.getList()
      },
      getCompanySelectList: function () {
        var url = ENV.HOST_URL + '/companytype/?limit=1000'
        this.$http.get(url)
          .then((res) => {
            this.companies = res.body.data

          })
      },
      chilFn (activeName2){
        this.getCompanySelectList();
        this.getList();
      },
      getList() {
        let query = util.buildGetParams({
          'offset|page': this.pageInfo
        })
        let url = "/companytype/?" + query
        if (this.selectedCompanies && this.selectedCompanies ) {
          url += "&query=id:in" + this.selectedCompanies
        }
        isLoading: true,
        this.$http.get(url)
          .then(({data}) => {
            this.items = data.data
            this.pageInfo.total = data.total
            this.isLoading = false
          })
      },
    },
    created() {
      this.resetForm()
    },
    mounted: function () {
      this.getCompanySelectList();
      this.getList();
      this.selectedHeader = [2,3]
    },
  }
</script>

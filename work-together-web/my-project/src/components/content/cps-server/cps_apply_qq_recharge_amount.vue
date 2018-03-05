<template>
  <div>
    <section class="content-header">
      <h1>
        QQ额度申请
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>申请额度</li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <span>每天的最大充值额度: <span style="color: red">{{ max_amount }}</span></span>
          <button class="btn btn-primary" @click="openDialog">设置</button>
        </div>
        <div class="_list_tab">
          <div class="box-body">
            <el-table
              v-loading="isLoading"
              element-loading-text="拼命加载中"
              class="table table-bordered table-hover"
              :data="applyList"
              border
              stripe
              style="width: 100%">
              <el-table-column
                fixed
                prop="WtUserName"
                label="用户名"
                min-width="120">
              </el-table-column>
              <el-table-column
                prop="Amount"
                label="申请额度"
                min-width="120">
              </el-table-column>
              <el-table-column
                prop="CreateTime"
                label="创建时间"
                sortable='custom'
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.CreateTime | stampToTimeFull }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="Status"
                label="状态"
                min-width="120">
                <template scope="scope">
                  <p v-if="scope.row.Status === 0">未审核</p>
                  <p v-else-if="scope.row.Status === 1">同意</p>
                  <p v-else>拒绝</p>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                min-width="100">
                <template scope="scope">
                  <div class="result_report" v-if="scope.row.Status === 0">
                    <button class="btn btn-primary"  @click="changeStatus(scope.row.Id, 1)">通过</button>
                    <button class="btn btn-danger"  @click="changeStatus(scope.row.Id, 2)">不通过</button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="box-footer">
            <!--<gameAccess :items="items" :downloadUrl="downloadUrl"></gameAccess>-->
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="page.curr"
              :page-size="page.size"
              :total="page.total"
              layout="prev, pager, next, jumper">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
            title="设置最大充值额度"
            v-model="dialogShow"
            top="5%"
            size="small"
            :close-on-click-modal="false">
      <div @close="closeDialog" class="box">
        <div class="box-header with-border">
          <div class="col-md-8 form-horizontal">
            <div class="form-group">
              <div>
                <el-input  type="input"  v-model="form_max_amount" placeholder="最大值"></el-input>
              </div>
            </div>
            <div >
              <el-button type="primary" @click="changeMaxAmount()">确定</el-button>
              <el-button @click="closeDialog" type="primary">取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    components: {},
    data: function () {
      return {
        form_max_amount: 0,
        dialogShow: false,
        max_amount: 0,
        token: "",
        page: {curr: 1, size: 15, total: 0},
        applyList: [],
        pageInfo: {
          currentPage: 1,
          limit: ENV.PAGE_SHOW_COUNT,
          offset: 0,
          total: 0,
        },
        code: '',
        isLoading: false,
        dialogVisible: false,
        PERSONNEL_HOST_URL: ENV.PERSONNEL_HOST_URL,
        pagination: {
          per_page: 15,
          current_page: 1
        },
      }
    },
    methods: {
        openDialog() {
            this.form_max_amount = this.max_amount
            this.dialogShow = true
        },
        closeDialog() {
            this.dialogShow = false
        },
        changeStatus(id, status) {
            var form = new FormData()
            form.append("token", this.token)
            form.append("status", status)
            this.$http.put(ENV.CPS_HOST_URL + "/qq_recharge_agency/change_apply_status/" + id, form).then(data=> {
                this.$message.success("修改成功")
                this.page.page = 1
                this.load(1)
            }, error => {
                this.$message.error(error.body)
            })
        },
        changeMaxAmount() {
            var form = new FormData()
            form.append("token", this.token)
            form.append("amount", this.form_max_amount)
            this.$http.put(ENV.CPS_HOST_URL + "/qq_recharge_agency/set_max_amount", form).then(data=> {
                this.$message.success("修改成功")
            }, error => {
                this.$message.error(error.body)
            })
        },
      // arrayToJson (data) {
      //   let search = []
      //   for (var index in data) {
      //     if (this.filters[index] !== '') {
      //       if (index === 'start_time' || index === 'end_time') {
      //         search.push('"' + index + '": "' + (this.filters[index]).getTime() / 1000 + '"')
      //       } else {
      //         search.push('"' + index + '": "' + this.filters[index] + '"')
      //       }
      //     }
      //   }
      //   let jsonStr = '{' + search.join(',') + '}'
      //   jsonStr = JSON.parse(jsonStr)
      //   return jsonStr
      // },
      handleCurrentChange(currentPage) {
        this.load(currentPage)
      },

      onchangeInvoiceStatus(v) {
        this.onputSignTo = true
        this.code = v
      },
      load(p) {
        this.loading = true
        // let jsonStr = this.arrayToJson(this.filters)
        if (p === undefined) {
          p = this.pagination.current_page
        }
        this.$http.get(ENV.CPS_HOST_URL + '/qq_recharge_agency/apply_amount_list/?page=' + p + '&per_page=' + this.pagination.per_page + "&token=" + this.token).then((data) => {
          if (data.status === 200) {
            this.loading = false
            this.applyList = data.body.data
            this.page.total = data.body.total
          }
        },(error) => {
          if (error.status === 403) {
            this.$router.push({path: '/login'})
          } else {
            this.$message.error(error.body)
          }
        })
      },
      getMaxAmount() {
          this.$http.get(ENV.CPS_HOST_URL + '/qq_recharge_agency/get_max_amount?token=' + this.token).then(data => {
              this.max_amount = data.body
          }, error => {
              this.$message.error(error.body)
          })
      }
    },
    mounted: function () {
      this.token = sessionStorage.getItem("token")
      this.load()
      this.getMaxAmount()
    },
  }
</script>

<style scoped>

</style>

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
                prop="CreateTime"
                label="创建时间"
                sortable='custom'
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.create_time | stampToTimeFull }}</p>
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
                  <div class="result_report" v-if="scope.row.status === 0">
                    <button  @click="changeInvoiceStatus(scope.row.Id, 1)">通过
                    </button>
                    <button class="btn btn-error"  @click="onchangeInvoiceStatus(scope.row.Id, 2)">不通过
                    </button>
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
  </div>
</template>

<script>
  export default {
    components: {},
    data: function () {
      return {
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
          console.log(data)
          if (data.status === 200) {
            this.loading = false
            // this.applyList = this.body.data
            // this.pagination.total = this.body.total
          }
        },(error) => {
          this.$message.error(error.body)
        })
      },
    },
    mounted: function () {
      this.token = sessionStorage.getItem("token")
      this.load()
    },
  }
</script>

<style scoped>

</style>

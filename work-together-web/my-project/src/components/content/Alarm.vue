<template>
  <div>
    <section class="content-header">
      <h1>
        报警日志
        <small>查看报警情况</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>操作日志</li>
      </ol>
    </section>
    <div class="content">
      <div class="box" v-loading="isLoading">
        <div class="box-body">
          <table class="table table-bordered table-hover">
            <thead>
            <tr>
              <th>编号</th>
              <th>类型</th>
              <th>报警内容</th>
              <th>报警时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
              <td>{{ item.id }}</td>
              <td>{{ status[item.type] }}</td>
              <td v-html="item.context"></td>
              <td>{{ item.created_time|stampToTimeFull }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="box-footer">
          <el-pagination
            @current-change="onCurrentChange"
            :current-page="pageInfo.currPage"
            :page-size="pageInfo.limit"
            :total="pageInfo.total"
            layout="prev, pager, next, jumper">
          </el-pagination>
        </div>
        <!-- /.box-body -->
      </div>
    </div>
  </div>
</template>
<style scoped>
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
  export default {
    data: function () {
      return {
        pageInfo: {
          limit: ENV.PAGE_SHOW_COUNT,
          currPage: 1,
          total: 0,
        },
        items: [],

        isLoading: true,
        status: {
          'verify_account_context': '对账',
          'remit_account_context': '回款',
          'contract_timeout_context': '合同到期',
          'contract_sign_context': '合同未签',
        },
      }
    },
    mounted: function () {
      this.getAll(1)
    },
    methods: {
      onCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.getAll(currentPage)
      },
      getAll(page){
        this.isLoading = true
        let query = util.buildGetParams({
          limit: this.pageInfo.limit,
          offset: util.buildOffsetByPage(page, this.pageInfo.limit)
        });
        this.$http.get('/alarmlog?' + query)
          .then(({data}) => {
            this.items = data.data;
            for (let i in this.items) {
              let context = this.items[i].context
              this.items[i].context = context.replace(/\[(.*?)\]/g, "<b class='txt-highlight' style='margin:0 3px'>$1</b>")
            }
            this.pageInfo.total = data.total

            this.isLoading = false
          })
      }
    }
  }
</script>

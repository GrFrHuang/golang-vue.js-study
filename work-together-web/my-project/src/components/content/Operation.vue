<template>
  <div>
    <section class="content-header">
      <h1>
        操作日志
        <small>查看成员操作情况</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>操作日志</li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-body">
          <table id="examplebf" class="table table-bordered table-hover">
            <thead>
            <tr>
              <th v-for="todo in todos">
                {{ todo.text }}
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
              <td>{{ item.id }}</td>
              <td>{{ item.action }} {{'('+item.status_code+')'}}</td>
              <td><span v-if="item.user">{{item.user.nickname}}</span></td>
              <td>{{ item.created_time | stampToTime }}</td>
            </tr>
            </tbody>
          </table>

          <el-pagination v-show="pageInfo.total > pageInfo.limit"
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
<script>
  export default {
    data: function () {
      return {
        pageInfo: {
          limit: ENV.PAGE_SHOW_COUNT,
          currPage: 1,
          total: 0,
        },
        todos: [{
          text: '编号'
        }, {
          text: '日志内容'
        }, {
          text: '操作人'
        }, {
          text: '操作时间'
        },],
        parentMessage: 'Parent',
        items: [
          {
            kk: '修改xxxx内容',
            ll: 'admin',
            ww: '2016-12-30',
          },]
      }
    },
    mounted: function () {
      this.doGetList(1)
    },
    methods: {
      onCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.doGetList(currentPage)
      },
      doGetList(page = 1){
        this.pageInfo.currPage = page
        let query = util.buildGetParams({
//          query: ["name:like" + this.searchKey],
          "limit": this.pageInfo.limit,
          "offset": util.buildOffsetByPage(page, this.pageInfo.limit),
        })
        console.log(query)

        let url = '/logs?' + query
        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data
            this.pageInfo.total = res.body.total
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }
</script>

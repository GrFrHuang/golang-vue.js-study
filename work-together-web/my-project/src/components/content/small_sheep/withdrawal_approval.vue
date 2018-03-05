<template>
  <div>
    <section class="content-header">
      <h1>
        提现审核
        <small>查看提现审核情况</small>
      </h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div>
            <el-table
              :data="TaskPublish"
              border
              style="width: 100%">
              <el-table-column
                prop="User.NickName"
                align="center"
                width="100"
                label="用户名称">
              </el-table-column>
              <el-table-column
                prop="WxId"
                label="微信账号"
                align="center">
              </el-table-column>
              <el-table-column
                align="center"
                prop="Money"
                label="提现金额">
              </el-table-column>
              <el-table-column
                align="center"
                prop=""
                label="申请提现时间">
                <template scope="scope">
                  <p class="max_widthsd">{{ scope.row.RequestTime | stampToTimeFull }}</p>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop=""
                label="申请完成时间">
                <template scope="scope">
                  <p v-if="scope.row.Status == 2" class="max_widthsd">{{ scope.row.do_time | stampToTimeFull }}</p>
                  <p v-else>未完成</p>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop=""
                label="审核状态">
                <template scope="scope">
                  <p v-if="scope.row.Status == 1" class="max_widthsd">人工审核成功发款未处理</p>
                  <p v-else-if="scope.row.Status == 2" class="max_widthsd">已付款</p>
                  <p v-else-if="scope.row.Status == 3" class="max_widthsd">异常</p>
                  <p v-else>等待人工审核</p>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="Action"
                label="账号备注">
              </el-table-column>
              <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="checkCommit(scope.row, 1)" :disabled="scope.row.Status !== 4">通过
                  </el-button>
                  <el-button size="small" @click="checkCommit(scope.row, 2)" :disabled="scope.row.Status !== 4">不通过
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination v-show="pageInfo.total > pageInfo.limit"
                           @current-change="handleCurrentChange"
                           :current-page="pageInfo.currentPage"
                           :page-size="pageInfo.limit"
                           layout="prev, pager, next, jumper, total"
                           :total="pageInfo.total">
            </el-pagination>
            <el-dialog title="请填写不通过备注" :visible.sync="addDesc">
              <div>
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请填写备注"
                  v-model="desc.desc">
                </el-input>
              </div>
              <span slot="footer" class="dialog-footer">
                    <el-button @click="addDesc = false">取 消</el-button>
                 <el-button type="primary" @click="offline(desc)">确 定</el-button>
                 </span>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        TaskPublish: [],
        addDesc: false,
        desc: {
          Id: '',
          desc: ''
        },
        pageInfo: {
          currentPage: 1,
          limit: 10000,
          offset: 0,
          total: 0,
        },
      }
    },
    mounted() {
      this.load()
    },
    methods: {
      load(page = 0) {
        if (page == 0) {
          this.pageInfo.offset = 0
        }
        this.$http.get(ENV.SMALL_SHEEP_HOST_URL + '/withdraw/?limit=' + this.pageInfo.limit + '&offset=' + this.pageInfo.offset + "&sortby=request_time&order=desc")
          .then(response => {
            console.log(response.data.data)
            this.TaskPublish = response.data.data
            this.pageInfo.total = response.data.total
          });
      },
      handleCurrentChange(currentPage) {
        let offset
        if (!currentPage) {
          offset = 0
        } else {
          offset = (currentPage - 1) * this.pageInfo.limit
        }
        this.pageInfo.offset = offset
        this.load(currentPage)
      },
      checkCommit(row, status) {
        if (status === 1) {
          this.$http.put(ENV.SMALL_SHEEP_HOST_URL + '/withdraw/' + row.Id + '?status=1')
            .then(response => {
              this.$message.success('操作成功')
              this.load()
            })
            .catch(err => {
              this.$message.warning(err.response.data)
            })
        } else {
          this.desc.desc = ''
          this.desc.Id = row.Id
          this.addDesc = true
        }
      },
      offline(row) {
        this.$http.put(ENV.SMALL_SHEEP_HOST_URL + '/withdraw/' + row.Id + '?status=3&remarks=' + row.desc)
          .then(response => {
            this.$message.success('操作成功')
            this.addDesc = false
            this.load()
          })
          .catch(err => {
            this.$message.warning(err.response.data)
            this.addDesc = false
          })
      },
    }
  }
</script>

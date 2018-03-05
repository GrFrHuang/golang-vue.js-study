<template>
  <div>
    <section class="content-header">
      <h1>
        微信账号
        <small>查看微信账号情况</small>
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
                prop="Uid"
                align="center"
                width="80"
                label="用户ID">
              </el-table-column>
              <el-table-column
                prop="WxId"
                label="微信账号"
                align="center">
              </el-table-column>
              <el-table-column
                align="center"
                prop="Password"
                label="微信密码">
              </el-table-column>
              <el-table-column
                align="center"
                prop=""
                label="账号状态">
                <template scope="scope">
                  <p v-if="scope.row.Status === 0">未审核</p>
                  <p v-if="scope.row.Status === 1">正常</p>
                  <p v-if="scope.row.Status === 2">异常</p>
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
                  <el-button size="small" @click="checkCommit(scope.row, 1)" :disabled="scope.row.Status !== 0">通过
                  </el-button>
                  <el-button size="small" @click="checkCommit(scope.row, 2)" :disabled="scope.row.Status !== 0">不通过
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
        this.$http.get(ENV.SMALL_SHEEP_HOST_URL + '/sheep_child_wx/?limit=' + this.pageInfo.limit + '&offset=' + this.pageInfo.offset + "&sortby=create_time&order=desc")
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
          this.$http.put(ENV.SMALL_SHEEP_HOST_URL + '/sheep_child_wx/' + row.Id + '?static=1&uid=' + row.Uid)
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
        this.$http.put(ENV.SMALL_SHEEP_HOST_URL + '/sheep_child_wx/' + row.Id + '?static=2&action=' + row.desc + '&uid=' + row.Uid)
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

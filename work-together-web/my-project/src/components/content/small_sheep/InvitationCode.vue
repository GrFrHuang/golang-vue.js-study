<template>
  <div>
    <section class="content-header">
      <h1>
        员工邀请码
        <small>查看员工邀请码情况</small>
      </h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <el-button type="primary" style="margin-bottom: 10px" @click="checkCommit('', 3)">新 增</el-button>
          <div>
            <el-table
              :data="TaskPublish"
              border
              style="width: 100%">
              <el-table-column
                prop="RealName"
                align="center"
                label="用户名称">
              </el-table-column>
              <el-table-column
                prop="InvitationCode"
                label="邀请码"
                align="center">
              </el-table-column>
              <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="checkCommit(scope.row, 1)">编辑
                  </el-button>
                  <el-button size="small" @click="checkCommit(scope.row, 2)">删除
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
            <el-dialog :title="endeId === 1? '编辑用户信息': '新增用户信息'" :visible.sync="addDesc">
              <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
                <el-form-item label="用户名称">
                  <el-input v-model="formLabelAlign.name"></el-input>
                </el-form-item>
                <el-form-item label="邀请码">
                  <el-input v-model="formLabelAlign.code"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                    <el-button @click="addDesc = false">取 消</el-button>
                 <el-button type="primary" @click="offline(formLabelAlign)">确 定</el-button>
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
        labelPosition: 'right',
        formLabelAlign: {
          name: '',
          Id: '',
          code: ''
        },
        endeId: 2,
        pageInfo: {
          currentPage: 1,
          limit: 20,
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
        // this.$http.get(ENV.SMALL_SHEEP_HOST_URL + '/company/?limit=' + this.pageInfo.limit + '&offset=' + this.pageInfo.offset + "&sortby=create_time&order=desc")
        this.$http.get(ENV.SMALL_SHEEP_HOST_URL + '/company/?limit=' + this.pageInfo.limit + '&offset=' + this.pageInfo.offset)
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
          this.endeId = 1
          this.addDesc = true
          this.formLabelAlign.name = row.RealName
          this.formLabelAlign.Id = row.Id
          this.formLabelAlign.code = row.InvitationCode
        } else if (status === 2) {
          this.$confirm('确定删除用户' + row.RealName + '?', '删除用户', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.delete(ENV.SMALL_SHEEP_HOST_URL + '/company/' + row.Id)
              .then(response => {
                this.$message.success('删除成功')
                this.pageInfo = {
                  currentPage: 1,
                  limit: 20,
                  offset: 0,
                  total: 0,
                }
                this.load()
              })
              .catch(err => {
                this.$message.warning(err.response.data)
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          })
        } else if (status === 3) {
          this.endeId = 2
          this.addDesc = true
          this.formLabelAlign = {
            name: '',
            code: ''
          }
        }
      },
      offline(row) {
        let post = {
          'RealName': row.name,
          'InvitationCode': row.code
        }
        if (this.endeId === 1) {
          this.$http.put(ENV.SMALL_SHEEP_HOST_URL + '/company/' + row.Id, post)
            .then(response => {
              this.$message.success('操作成功')
              this.addDesc = false
              this.pageInfo = {
                currentPage: 1,
                limit: 20,
                offset: 0,
                total: 0,
              }
              this.load()
            })
            .catch(err => {
              this.$message.warning(err.response.data)
              this.addDesc = false
            })
        } else if (this.endeId === 2) {
          this.$http.post(ENV.SMALL_SHEEP_HOST_URL + '/company/', post)
            .then(response => {
              this.$message.success('操作成功')
              this.addDesc = false
              this.pageInfo = {
                currentPage: 1,
                limit: 20,
                offset: 0,
                total: 0,
              }
              this.load()
            })
            .catch(err => {
              this.$message.warning(err.response.data)
              this.addDesc = false
            })
        }
      }
      ,
    }
  }
</script>

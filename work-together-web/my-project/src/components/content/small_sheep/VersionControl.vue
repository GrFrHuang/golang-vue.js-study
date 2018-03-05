<template>
  <div>
    <section class="content-header">
      <h1>
        版本控制
        <small>查看小绵羊版本情况</small>
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
                prop="name"
                align="center"
                label="APP名称">
              </el-table-column>
              <el-table-column
                prop="channel"
                label="渠道"
                align="center">
              </el-table-column>
              <el-table-column
                prop="update_information"
                label="更新信息"
                align="center">
              </el-table-column>
              <el-table-column
                prop="version_code"
                label="版本号"
                align="center">
              </el-table-column>
              <el-table-column
                prop="version_name"
                label="版本名"
                align="center">
              </el-table-column>
              <el-table-column
                prop=""
                label="更新方式"
                align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.mandatory === 1">强 更</p>
                  <p v-if="scope.row.mandatory === 2">热 更</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="download_link"
                label="下载地址"
                align="center">
              </el-table-column>
              <el-table-column
                prop=""
                label="创建时间"
                align="center">
                <template slot-scope="scope">
                  {{ scope.row.create_time | stampToTimeFull}}
                </template>
              </el-table-column>
              <el-table-column
                prop="remarks"
                label="备注"
                align="center">
              </el-table-column>
              <el-table-column
                prop=""
                label="更新时间"
                align="center">
                <template slot-scope="scope">
                  {{ scope.row.update_time | stampToTimeFull}}
                </template>
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
                <el-form-item label="APP名称">
                  <el-input v-model="formLabelAlign.name"></el-input>
                </el-form-item>
                <el-form-item label="渠道">
                  <el-input v-model="formLabelAlign.channel"></el-input>
                </el-form-item>
                <el-form-item label="更新信息">
                  <el-input v-model="formLabelAlign.update_information"></el-input>
                </el-form-item>
                <el-form-item label="版本号">
                  <el-input v-model="formLabelAlign.version_code"></el-input>
                </el-form-item>
                <el-form-item label="版本名">
                  <el-input v-model="formLabelAlign.version_name"></el-input>
                </el-form-item>
                <el-form-item label="更新方式">
                  <el-radio-group v-model="formLabelAlign.mandatory">
                    <el-radio :label="1">强 更</el-radio>
                    <el-radio :label="2">热 更</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="下载地址">
                  <el-input v-model="formLabelAlign.download_link"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="formLabelAlign.remarks"></el-input>
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
          channel: '',
          update_information: '',
          version_code: '',
          version_name: '',
          mandatory: '',
          download_link: '',
          remarks: '',
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
        // this.$http.get(ENV.SMALL_SHEEP_HOST_URL + '/version/?limit=' + this.pageInfo.limit + '&offset=' + this.pageInfo.offset + "&sortby=create_time&order=desc")
        this.$http.get(ENV.SMALL_SHEEP_HOST_URL + '/version/?limit=' + this.pageInfo.limit + '&offset=' + this.pageInfo.offset)
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
          this.formLabelAlign.name = row.name
          this.formLabelAlign.Id = row.Id
          this.formLabelAlign.channel = row.channel
          this.formLabelAlign.update_information = row.update_information
          this.formLabelAlign.version_code = row.version_code
          this.formLabelAlign.version_name = row.version_name
          this.formLabelAlign.download_link = row.download_link
          this.formLabelAlign.mandatory = row.mandatory
          this.formLabelAlign.remarks = row.remarks
        } else if (status === 2) {
          this.$confirm('确定删除APP《' + row.name + '》?', '删除APP', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.delete(ENV.SMALL_SHEEP_HOST_URL + '/version/' + row.Id)
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
          this.addDesc = true
          this.endeId = 2
          this.formLabelAlign = {
            name: '',
            channel: '',
            update_information: '',
            version_code: '',
            version_name: '',
            download_link: '',
            mandatory: '',
            remarks: '',
          }
        }
      },
      offline(row) {
        let post = {
          'name': row.name,
          'channel': row.channel,
          'update_information': row.update_information,
          'version_code': parseInt(row.version_code),
          'version_name': row.version_name,
          'download_link': row.download_link,
          'mandatory': row.mandatory,
          'remarks': row.remarks,
        }
        if (this.endeId === 1) {
          this.$http.put(ENV.SMALL_SHEEP_HOST_URL + '/version/' + row.Id, post)
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
          this.$http.post(ENV.SMALL_SHEEP_HOST_URL + '/version/', post)
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

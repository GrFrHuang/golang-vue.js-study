<template>
  <div class="box">
    <section class="content-header">
      <h1>
        kpi管理
      </h1>
    </section>
    <div class="box-body">
      <div style="margin-top: 20px; margin-bottom: 10px;">
        <span style="font-weight: bold; font-size: 20px;">任务列表</span>
        <span>&nbsp;&nbsp;&nbsp;累计任务:&nbsp;{{totalTask}}</span>
        <button @click="addTask" style="float: right; margin: 0px 20px 20px 0px" class="btn btn-primary">发布任务</button>
      </div>
      <el-table
        :data="taskList"
        border
        style="width: 100%">
        <el-table-column
          prop="task_complete_date"
          label="任务完成时间">
          <template scope="scope">
            <p>{{ scope.row.task_complete_date | stampToTimeFull}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="assesseser_name"
          label=考核人>
        </el-table-column>
        <el-table-column
          prop="task_publish_date"
          label="发布时间">
          <template scope="scope">
            <p>{{ scope.row.task_publish_date | stampToTimeFull}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="publisher_name"
          label="发布人">
        </el-table-column>
        <el-table-column
          prop="publish_state"
          label="发布状态">
          <template scope="scope">
            <p v-if="scope.row.publish_state===1">已发布</p>
            <p v-else>未发布</p>
          </template>
        </el-table-column>
        <el-table-column
          label="考核项目">
          <template scope="scope">
            <el-button type="primary" size="mini" @click="">查看项目</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template scope="scope">
            <el-button type="text" @click="editTask(scope.row)">编辑 |</el-button>
            <el-button type="text" @click="deleteTask(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="page.total > 10 "
        layout="total, prev, pager, next"
        :page-size="10"
        :total="page.total"
        :current-page.sync="page.page"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>

    <!--publish task dialog-->
    <el-dialog :title="(taskId?'编辑':'发布')+'任务'" :visible.sync="showAddTask">
      <el-form v-model="task">
        <el-form-item label="任务完成时间">
          <div class="block">
            <el-date-picker
              v-model="task.task_complete_date"
              type="datetime"
              placeholder="选择日期时间"
              :picker-options="pickerOptions1">
            </el-date-picker>
          </div>
        </el-form-item>

        <div style="margin-top: 20px">
          <el-form-item label="考核人">
            <el-select style="float: left; max-width: 50%;" v-model="task.assesseser_id">
              <el-option v-for="v in userList" :key="v.id" :label="v.nickname" :value="v.id"
                         placeholder="请选择考核人"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <!--add program item-->
        <div>
          <el-row :gutter="20">
            <el-form-item>
              <el-col :xs="36" :sm="36" :md="24" :lg="24" v-for="(isShow,index) in itemList.newItem" :key="index"
                      class="white-space:nowrap;">
                <strong>任务{{index + 1}}</strong>
                <el-col :xs="18" :sm="18" :md="8" :lg="8">
                  <div>
                    <el-input v-model="childTask[index]" placeholder="请输入内容"></el-input>
                  </div>
                </el-col>
                <el-col :xs="6" :sm="6" :md="3" :lg="3">
                  <el-button v-if="index === 0" type="primary" size="small" icon="plus" style="margin-left: 20px"
                             @click="addTaskItem"></el-button>
                  <el-button v-else type="primary" size="small" icon="minus" style="margin-left: 20px"
                             @click="removeItem(index)"></el-button>
                </el-col>
              </el-col>
            </el-form-item>
          </el-row>
        </div>

        <el-form-item label="发布时间">
          <el-radio v-model="task.publish_type" label="1" style="padding-left: 20px"
                    @click.native="showDateTicker(false)">马上发布
          </el-radio>
          <el-radio v-model="task.publish_type" label="2" @click.native="showDateTicker(true)">定时发布</el-radio>
        </el-form-item>

        <el-form-item v-show="visibleDateTicker">
          <div class="block">
            <el-date-picker
              v-model="task.task_publish_date"
              type="datetime"
              placeholder="选择日期时间"
              :picker-options="pickerOptions1">
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addKpiTask(task)">确认发布</el-button>
          <el-button @click="cancelTask(task)">取消发布</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import utils from '../../../publicjs/utils'

  export default {
    data: function () {
      return {
        pickerOptions1: {
          shortcuts: [{
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        },
        taskDetail: {},
        taskId: 0,
        user: {},
        totalTask: 0,
        itemList: {
          newItem: [{
            isShow: false
          }]
        },
        visibleDateTicker: false,
        showAddTask: false,
        childTask: [],
        task: {
          publish_type: 0,
          task_publish_date: '',
          task_complete_date: '',
          assesseser_id: '',
        },
        userList: [],
        taskList: [],
        page: {
          total: 0,
          page: 0,
        },
        uid: 0,// 如果是编辑则uid不为0
        permissions: [], // 所有权限
        selectedPermissionIds: [], // 选择的权限
        name: '', // 角色名称
        title: '',
      }
    },
    methods: {
      getUserPermission () {
        this.user = JSON.parse(localStorage.getItem('cnodeBaseInfo'))
      },

      showDateTicker (show) {
        this.visibleDateTicker = show
      },
//todo change page
      handleCurrentChange () {

      },

      removeItem (index) {
        this.itemList.newItem.splice(index, 1)
        this.$emit('input', this.itemList.newItem)
      },

      addTaskItem () {
        let arr = {
          column_name: '',
          column_param_key: '',
          column_type: '',
          column_extra_info: [],
          inputVisible: false,
          inputValue: '',
          isShow: false
        }
        this.itemList.newItem.push(arr)
      },

      addTask () {
//   Reset the taskId for judge the dialog title again
        this.taskId = 0
        this.showAddTask = true
      },

      cancelTask (task) {
        if (typeof task.id !== 'undefined') {
          this.task.publish_type = 0
          this.task.task_publish_date = 0
          this.task.task_complete_date = ''
          this.task.assesseser_id = ''
        }
        this.showAddTask = false
      },

      // Get task assessesers list
      getAssesseserList () {
        this.$http.get('/user/devment/' + this.user.info.department_id)
          .then((res) => {
            this.userList = res.body
          })
          .catch((err) => {
            console.log(err)
          })
      },

      editTask (item) {
//        todo wait callback
        this.$http.get('/kpi/' + item.id).then((res) => {
//            this.taskDetail = res.data
          this.childTask = res.data
          this.task.task_publish_date = item.task_publish_date
          this.task.publish_type = item.publish_type
          this.task.task_complete_date = item.task_complete_date * 1000
          this.task.assesseser_id = item.assesseser_id
          this.showAddTask = true
          this.taskId = item.id
        }).catch((err) => {
          console.log(err)
        })
      },

      deleteTask (id) {
        let that = this
        this.$confirm('此操作将删除该kpi任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = '/kpi/'
          this.$http.delete(url + id).then((res) => {
            that.$message({
              type: 'success',
              message: res.data
            })
            that.getTaskList()
          }).catch((err) => {
            this.$alert(err.data, '删除失败', {
              confirmButtonText: '确定'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },

      getTaskList () {
        let url = '/kpi'
        this.$http.get(url)
          .then((res) => {
            this.taskList = res.data.data
            this.totalTask = res.data.total
          })
          .catch((err) => {
            console.log(err)
          })
      },

      addKpiTask (task) {
        let body = {
          name: this.name,
          'permission_ids|json': this.selectedPermissionIds
        }
        let post = utils.buildPostParams(body)

        if (this.uid) {
          // 更新
          this.$http.put('/role/' + this.uid, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          // 新增
          this.$http.post('/kpi/', post)
            .then((res) => {
              this.$message({
                type: 'success',
                message: res.data
              })
            })
            .catch((err) => {
              this.$alert(err.data, '添加kpi任务失败', {
                confirmButtonText: '确定'
              })
            })
        }
      }
    },

    mounted () {
      //   Get current user permission
      this.getUserPermission()
      //   Get task assessesers list
      this.getAssesseserList()

      this.getTaskList()
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  .bottom-5 {
    margin-bottom: 5px;
  }

  .permission-box {
    border: 1px #d2d6de solid;
    padding: 10px;
    line-height: 2;
    .group {
      font-size: 16px;
      border-bottom: 1px solid #eee;
      padding: 0 5px 5px 0px;
      margin-bottom: 5px;
      color: #333;
    }
    .ps-lable {
      font-weight: 800;
    }
  }
</style>

<style rel="stylesheet/less" lang="less">

  .permission-box {
    .el-checkbox__label {
      display: none;
    }
  }
</style>

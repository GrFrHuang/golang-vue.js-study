<template>
  <div>
    <section class="content-header">
      <h1>
        新手任务
        <small>查看新手任务情况</small>
      </h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div>
            <el-button type="text" style="margin-left: 10px" @click="createTask=true;newTaskId==''">创建任务</el-button>
            <el-dialog
              title="新手任务"
              :visible.sync="createTask"
            >
              <div>
                <el-form :model="newTask" style="margin-right: 20px" :label-position="'left'"
                         :label-width="formLabelWidth">
                  <el-form-item label="业务类型">
                    <el-select v-model="value" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <!-- <el-form-item v-if="value!==1" label="标题" :label-width="formLabelWidth">
                       <el-input v-model="newTask.title" auto-complete="off"
                                 placeholder="请输入标题"></el-input>
                   </el-form-item>-->
                  <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input v-model="newTask.desc" auto-complete="off"
                              placeholder="请输入简述"></el-input>
                  </el-form-item>
                  <el-form-item label="佣金" :label-width="formLabelWidth">
                    <el-input v-model="newTask.price" auto-complete="off"
                              placeholder="请输入佣金"></el-input>
                  </el-form-item>
                  <el-form-item label="奖金" :label-width="formLabelWidth">
                    <el-input v-model="newTask.bonus" auto-complete="off"
                              placeholder="请输入奖金"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                    <el-button @click="createTask = false">取 消</el-button>
                 <el-button type="primary" @click="submitForm(newTask)">确 定</el-button>
                 </span>
            </el-dialog>
            <el-table
              :data="TaskList"
              border
              stripe
              style="width: 100%">
              <el-table-column
                prop="Id"
                align="center"
                width="80"
                label="任务ID">
              </el-table-column>
              <el-table-column
                align="center"
                width="100"
                prop="Title"
                label="标题">
              </el-table-column>
              <el-table-column
                prop="TaskDesc"
                label="描述"
                align="center">
              </el-table-column>
              <el-table-column
                align="center"
                width="100"
                prop="Price"
                label="佣金">
              </el-table-column>
              <el-table-column
                align="center"
                width="100"
                prop="Bonus"
                label="奖金">
              </el-table-column>
              <el-table-column
                align="center"
                width="100"
                prop="Status"
                label="状态">
              </el-table-column>
              <el-table-column
                align="center"
                width="300"
                label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="changeStatus(scope.row,`1`)">发布</el-button>
                  <el-button size="small" @click="changeStatus(scope.row,`0`)">撤回</el-button>
                  <el-button size="small" @click="changeUserTask(scope.row)">修改</el-button>
                </template>
              </el-table-column>
            </el-table>
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
        content: {
          content: '请输入任务引导',
          Id: ''
        },
        taskId: '',
        newPublish: {},
        addBoots: false,
        pickerOptions1: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }],
          disabledDate(date) {
            return date < new Date()
          },
        },
        TaskList: [],
        value: '',
        newTaskId: '',
        options: [{
          value: '1',
          label: '微信任务'
        }],
        newTask: {},
        createTask: false,
        pubilshTask: false,
        formLabelWidth: '120px'
      }
    },
    mounted() {
      this.getAllTask()
      String.prototype.format = function () {
        if (arguments.length == 0) return this;
        for (var s = this, i = 0; i < arguments.length; i++)
          s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        return s;
      };
    },
    methods: {
      changeUserTask(str) {
        this.createTask = true
        this.value = '1'
        this.newTaskId = str.Id + ''
      },
      getStatus(status) {
        if (status === "1") {
          return '已发布'
        } else if (status === "0") {
          return '未发布'
        } else {
          return '未知状态'
        }
      },
      changeStatus(v, status) {
        this.$http.put(ENV.SMALL_SHEEP_HOST_URL + "new_user_task/?id=" + v.Id + "&status=" + status)
          .then(response => {
            this.$message.success(response.data)
            this.getAllTask()
          })
          .catch(err => {
            this.$message.warning(err.response.data)
          })
      },
      getAllTask() {
        this.TaskList = []
        this.$http.get(ENV.SMALL_SHEEP_HOST_URL + '/new_user_task')
          .then(response => {
            let baseInfo = response.data.data;
            if (baseInfo === null) {
              return
            }
            for (let i = 0; i < baseInfo.length; i++) {
              let info = {
                Id: baseInfo[i].Id === null ? '' : baseInfo[i].Id,
                TaskDesc: baseInfo[i].TaskDesc === null ? '' : baseInfo[i].TaskDesc,
                Title: baseInfo[i].Title === null ? '' : baseInfo[i].Title,
                Price: baseInfo[i].Price === null ? '' : baseInfo[i].Price,
                Bonus: baseInfo[i].Icon === null ? '' : baseInfo[i].Bonus,
                Status: this.getStatus(baseInfo[i].Status),
              }
              this.TaskList.push(info)
            }

          });
      },
      submitcontent(v) {
        let oMyForm = new FormData();
        oMyForm.append("content", v.content);
        oMyForm.append("id", v.Id);
        this.$http.post(ENV.SMALL_SHEEP_HOST_URL + '/mission_guidance/', oMyForm)
          .then(response => {
            this.$message.success('添加/编辑成功')
            this.addBoots = false
          })
          .catch(err => {
            this.$message.warning(err.response.data)
            this.addBoots = false
          })
      },
      submitForm(task) {
        if (task.desc === undefined) {
          this.$message.warning('请输入完整参数');
          return
        }
        if (task.price === undefined) {
          this.$message.warning('请输入完整参数');
          return
        }
        if (this.value === '') {
          this.$message.warning('请输入完整参数');
          return
        }
        if (task.bonus === undefined) {
          this.$message.warning('请输入完整参数');
          return
        }
        if (this.newTaskId === '' || this.newTaskId === undefined) {
          let formData = new FormData()
          //formData.append("task_desc", task.desc)
          formData.append("task_desc", task.desc)
          formData.append("price", task.price)
          formData.append("title", '微信任务')
          formData.append("bonus", task.bonus)
          this.$http.post(ENV.SMALL_SHEEP_HOST_URL + 'new_user_task', formData)
            .then(response => {
              this.getAllTask()
              this.$message.success(response.data)
              this.createTask = false
            })
            .catch(err => {
              console.log(err)
              this.$message.warning(err.response.data)
            })
        } else {
          let formData = new FormData()
          formData.append("id", this.newTaskId)
          formData.append("task_desc", task.desc)
          formData.append("price", task.price)
          formData.append("bonus", task.bonus)
          this.$http.post(ENV.SMALL_SHEEP_HOST_URL + 'new_user_task/update', formData)
            .then(response => {
              this.getAllTask()
              this.$message.success(response.data)
              this.newTaskId = ''
              this.createTask = false
            })
            .catch(err => {
              console.log(err)
              this.$message.warning(err.response.data)
            })
        }

      },
    }
  }
</script>

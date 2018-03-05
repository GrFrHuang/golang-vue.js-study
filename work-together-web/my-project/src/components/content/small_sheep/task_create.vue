<template>
  <div>
    <section class="content-header">
      <h1>
        任务发布
        <small>查看任务发布情况</small>
      </h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div>
            <el-button type="primary" style="margin-bottom: 10px" @click="createTask=true">创建任务</el-button>
            <el-dialog
              title="新建任务"
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
                  <el-form-item v-if="value === '3'" label="H5链接" :label-width="formLabelWidth">
                    <el-checkbox v-model="newTask.checked">H5页面</el-checkbox>
                    <el-input v-if="newTask.checked === true" v-model="newTask.h5url" auto-complete="off"
                              placeholder="请输入h5链接"></el-input>
                  </el-form-item>
                  <el-form-item v-if="value === '1'" label="图标" :label-width="formLabelWidth">
                    <el-input v-model="newTask.icon" auto-complete="off"
                              placeholder="请输入图标地址"></el-input>
                  </el-form-item>
                  <el-form-item v-if="value === '1'" label="上传截图" :label-width="formLabelWidth">
                    <el-upload
                      class="on_avatar-uploader"
                      action="http://static.kuaifazs.com/sdkkitfile.php"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      name="uploadfile">
                      <img v-if="newTask.screenshots" :src="newTask.screenshots" class="avatar">
                      <i v-else class="el-icon-plus on_avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="value === '1'" label="下载地址" :label-width="formLabelWidth">
                    <el-input v-model="newTask.url" auto-complete="off"
                              placeholder="请输入游戏下载地址"></el-input>
                  </el-form-item>
                  <el-form-item v-if="value === '1'" label="攻略地址" :label-width="formLabelWidth">
                    <el-input v-model="newTask.guide" auto-complete="off"
                              placeholder="请输入任务攻略地址"></el-input>
                  </el-form-item>
                  <el-form-item label="标题" :label-width="formLabelWidth">
                    <el-input v-model="newTask.title" auto-complete="off"
                              placeholder="请输入标题"></el-input>
                  </el-form-item>
                  <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input v-model="newTask.desc" auto-complete="off"
                              placeholder="请输入简述"></el-input>
                  </el-form-item>
                  <el-form-item v-if="value === '1'" label="佣金" :label-width="formLabelWidth">
                    <el-input v-model="newTask.price" auto-complete="off"
                              placeholder="请输入佣金"></el-input>
                  </el-form-item>
                  <el-form-item label="奖金" :label-width="formLabelWidth">
                    <el-input v-model="newTask.bonus" auto-complete="off"
                              placeholder="请输入奖金"></el-input>
                  </el-form-item>
                  <el-form-item v-if="value === '2'" label="条件" :label-width="formLabelWidth">
                    <el-input v-model="newTask.count" auto-complete="off"
                              placeholder="请输入完成任务条件"></el-input>
                  </el-form-item>
                  <el-form-item v-if="value === '1'" label="包名" :label-width="formLabelWidth">
                    <el-input v-model="newTask.pkg" auto-complete="off"
                              placeholder="请输入游戏包名"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                 <el-button type="primary" @click="submitForm(newTask)">确 定</el-button>
                 </span>
            </el-dialog>
            <el-dialog
              title="发布任务"
              :visible.sync="pubilshTask"
            >
              <div>
                <el-form :model="newPublish" style="margin-right: 20px" :label-position="'left'"
                         :label-width="formLabelWidth">
                  <el-form-item label="发布数量" :label-width="formLabelWidth">
                    <el-input v-model="newPublish.count" auto-complete="off"
                              placeholder="请输入发布数量"></el-input>
                  </el-form-item>
                  <el-form-item label="请选择截止时间" :label-width="formLabelWidth">
                    <el-date-picker
                      v-model="newPublish.time"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="选择日期时间"
                      align="right"
                      :picker-options="pickerOptions1">
                    </el-date-picker>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                    <el-button @click="pubilshTask = false">取 消</el-button>
                 <el-button type="primary" @click="publish(newPublish)">确 定</el-button>
                 </span>
            </el-dialog>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="游戏试玩" name="first">
                <el-table
                  :data="TaskList"
                  border
                  stripe
                  style="width: 100%">
                  <el-table-column
                    prop="Id"
                    align="center"
                    label="任务ID">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="图标">
                    <template slot-scope="scope">
                      <img :src="scope.row.Icon" style="width: 40px;height: 40px">
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="Title"
                    label="标题">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="任务截图">
                    <template slot-scope="scope">
                      <img v-if="scope.row.Screenshots !== ''" :src="scope.row.Screenshots"
                           style="width: 40px;height: 40px">
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="Desc"
                    label="描述"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="DownLoadUrl"
                    label="下载地址"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="Guide"
                    label="攻略地址"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="Price"
                    label="佣金">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="Bonus"
                    label="奖金">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                      <el-button size="small" @click="Commit(scope.row)">发 布</el-button>
                      <el-button size="small" @click="isoneditor(scope.row)">编 辑</el-button>
                      <el-button size="small" @click="AddBoot(scope.row)">添加引导</el-button>
                      <el-button size="small" @click="isondelete(scope.row.Id)">删 除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="新手引导任务" name="second">
                <el-table
                  :data="newTaskList"
                  border
                  stripe
                  style="width: 100%">
                  <el-table-column
                    align="center"
                    prop="Taskname"
                    label="标题">
                  </el-table-column>
                  <el-table-column
                    prop="Desc"
                    label="描述"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="url"
                    label="h5链接">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="Money"
                    label="奖金">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                      <el-button size="small" @click="onsdelete(scope.row.Id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="首轮任务" name="third">
                <el-table
                  :data="FirstTaskList"
                  border
                  stripe
                  style="width: 100%">
                  <el-table-column
                    align="center"
                    prop="Taskname"
                    label="标题">
                  </el-table-column>
                  <el-table-column
                    prop="Desc"
                    label="描述"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="Count"
                    label="任务条件">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="Money"
                    label="奖金">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                      <el-button size="small" @click="onsdelete(scope.row.Id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
            <el-dialog title="添加引导" :visible.sync="addBoots">
              <div>
                <vue-editor id="editor"
                            useCustomImageHandler
                            @imageAdded="handleImageAdded" v-model="content.content">
                </vue-editor>
              </div>
              <span slot="footer" class="dialog-footer">
                    <el-button @click="addBoots = false">取 消</el-button>
                 <el-button type="primary" @click="submitcontent(content)">确 定</el-button>
                 </span>
            </el-dialog>
            <el-dialog title="编辑佣金/奖金" :visible.sync="edittask">
              <div>
                <el-form :model="onedittask" :label-position="'right'"
                         label-width="85px">
                  <el-form-item label="标 题：">
                    <p>{{ onedittask.Title }}</p>
                  </el-form-item>
                  <el-form-item label="佣 金：">
                    <el-input
                      placeholder="请输入内容"
                      v-model="onedittask.Price"
                      clearable>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="奖 金：">
                    <el-input
                      placeholder="请输入内容"
                      v-model="onedittask.Bonus"
                      clearable>
                    </el-input>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                    <el-button @click="edittask = false">取 消</el-button>
                 <el-button type="primary" @click="editsubmit(onedittask)">确 定</el-button>
                 </span>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .on_avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .on_avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .on_avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .el-upload__input {
    display: none !important;
  }

  .on_avatar-uploader-icon {
    line-height: 178px !important;
  }
</style>
<style scoped>
  p {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
</style>
<script>
  import { VueEditor } from 'vue2-editor'

  export default {
    components: {
      VueEditor
    },
    data () {
      return {
        content: {
          content: '请输入任务引导',
          Id: ''
        },
        taskId: '',
        newPublish: {},
        onedittask: {},
        addBoots: false,
        edittask: false,
        pickerOptions1: {
          shortcuts: [{
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '明天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }],
          disabledDate (date) {
            return date < new Date()
          },
        },
        TaskList: [],
        newTaskList: [],
        FirstTaskList: [],
        PublishedTaskList: [],
        value: '',
        activeName: 'first',
        options: [{
          value: '1',
          label: '游戏试玩'
        }, {
          value: '3',
          label: '新手引导任务'
        }, {
          value: '2',
          label: '首轮任务'
        }],
        newTask: {
          icon: '',
          screenshots: '',
          url: '',
          guide: '',
          title: '',
          desc: '',
          price: '',
          bonus: '',
          pkg: '',
          count: '',
          checked: false,
          h5url: '',
        },
        createTask: false,
        pubilshTask: false,
        formLabelWidth: '120px'
      }
    },
    mounted () {
      this.load()
    },
    methods: {
      isoneditor(v) {
        let ondata = v
        this.edittask = true
        this.onedittask = ondata
      },
      editsubmit(v){
        let url = ENV.SMALL_SHEEP_HOST_URL + '/task/change_task/' + v.Id + '?price=' + v.Price + '&bonus=' + v.Bonus
        this.$http.put(url)
          .then(reponse => {
            this.$message.success('操作成功')
            this.edittask = false
            this.load()
          })
          .catch(err => {
            this.edittask = false
            this.load()
            this.$message.warning(err.message)
          })
      },
      handleImageAdded: function (file, Editor, cursorLocation) {
        var formData = new FormData()
        formData.append('uploadfile', file)
        $.ajax({
          url: 'http://static.kuaifazs.com/sdkkitfile.php',
          type: 'POST',
          dataType: 'json',
          cache: false,
          data: formData,
          processData: false,
          contentType: false,
          success: (res) => {
            if (res.status === 0) {
              let url = res.data.url // Get url from response
              Editor.insertEmbed(cursorLocation, 'image', url)
            } else {
              this.$message.warning(res.error_message)
            }
          }, error: function (err) {
            this.$message.warning('添加图片错误')
          }
        })
      },
      handleClick (tab, event) {
      },
      onsdelete (v) {
        this.$http.delete(ENV.SMALL_SHEEP_HOST_URL + 'new_user_task/delete_task/' + v)
          .then(response => {
            this.$message.success('删除成功')
            this.load()
          })
      },
      isondelete (v) {
        this.$http.delete(ENV.SMALL_SHEEP_HOST_URL + 'task/delete_task/' + v)
          .then(response => {
            this.$message.success('删除成功')
            this.load()
          })
      },
      load () {
        this.$http.get(ENV.SMALL_SHEEP_HOST_URL + '/task/getTaskList/')
          .then(response => {
            this.TaskList = response.data
          })
        String.prototype.format = function () {
          if (arguments.length == 0) return this
          for (var s = this, i = 0; i < arguments.length; i++)
            s = s.replace(new RegExp('\\{' + i + '\\}', 'g'), arguments[i]);
          return s
        }
        this.$http.get(ENV.SMALL_SHEEP_HOST_URL + 'new_user_task/get_all/?type=1')
          .then(response => {
            this.newTaskList = response.data
          })
        this.$http.get(ENV.SMALL_SHEEP_HOST_URL + 'new_user_task/get_all/?type=2')
          .then(response => {
            this.FirstTaskList = response.data
          })
        this.$http.get(ENV.SMALL_SHEEP_HOST_URL + 'task_publish/')
          .then(response => {
            this.PublishedTaskList = response.data
          })
      },
      cancel () {
        this.createTask = false
        this.value = ''
        this.set()
      },
      handleAvatarSuccess (res, file) {
        this.newTask.screenshots = res.data.url
      },
      Commit (row) {
        this.pubilshTask = true
        this.taskId = row.Id
      },
      AddBoot (v) {
        this.content.Id = v.Id
        this.content.content = ''
        this.$http.get(ENV.SMALL_SHEEP_HOST_URL + '/mission_guidance/task?id=' + v.Id)
          .then(response => {
            this.content.content = response.data
          })
          .catch(err => {
            this.$message.warning(err.response.data)
          })
        this.addBoots = true
      },
      submitcontent (v) {
        let oMyForm = new FormData()
        oMyForm.append('content', v.content)
        oMyForm.append('id', v.Id)
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
      submitForm (task) {
        console.log(task)
        if (this.value === '') {
          this.$message.warning('请选择业务类型')
          return
        }
        if (this.value === '1') {
          if (task.icon === '') {
            this.$message.warning('请输入图表地址')
            return
          }
          if (task.screenshots === '') {
            this.$message.warning('请上传截图')
            return
          }
          if (task.url === '') {
            this.$message.warning('请输入下载地址')
            return
          }
          if (task.price === '') {
            this.$message.warning('请输入佣金')
            return
          }
          if (task.pkg === '') {
            this.$message.warning('请输入包名')
            return
          }
        }
        if (task.title === '') {
          this.$message.warning('请输入标题')
          return
        }
        if (task.desc === '') {
          this.$message.warning('请输入描述')
          return
        }
        if (task.bonus === '') {
          this.$message.warning('请输入奖金')
          return
        }
        let post = {
          'type': '',
          'taskname': task.title,
          'desc': task.desc,
          'money': parseFloat(task.bonus),
        }
        if (this.value === '1') {
          let url = ENV.SMALL_SHEEP_HOST_URL + '/task/createTask/?desc={0}&type={1}&url={2}&guide={3}&pkg={4}&icon={5}&title={6}&price={7}&bonus={8}&screenshots={9}'
            .format(task.desc, this.value, task.url, task.guide, task.pkg, task.icon, task.title, task.price, task.bonus, task.screenshots)
          this.$http.get(url)
            .then(response => {
              this.$message.success('添加成功')
              this.createTask = false
              this.load()
              this.value = ''
              this.set()
            })
            .catch(err => {
              this.value = ''
              this.set()
              this.load()
              this.createTask = false
              this.$message.warning(err.message)
            })
        } else if (this.value === '3') {
          if (task.h5url != '') {
            post.url = task.h5url
          }
          post.type = 1
          this.$http.post(ENV.SMALL_SHEEP_HOST_URL + 'new_user_task/set_newbie/', post)
            .then(response => {
              this.$message.success('添加成功')
              this.createTask = false
              this.load()
              this.value = ''
              this.set()
            })
            .catch(err => {
              this.value = ''
              this.set()
              this.load()
              this.createTask = false
              this.$message.warning(err.message)
            })
        } else if (this.value === '2') {
          post.count = parseInt(task.count)
          post.type = 2
          this.$http.post(ENV.SMALL_SHEEP_HOST_URL + 'new_user_task/set_newbie/', post)
            .then(response => {
              this.$message.success('添加成功')
              this.createTask = false
              this.load()
              this.value = ''
              this.set()
            })
            .catch(err => {
              this.value = ''
              this.set()
              this.load()
              this.createTask = false
              this.$message.warning(err.message)
            })
        }

      },
      publish (data) {
        if (data.count === '') {
          this.$message.warning('请输入完整参数')
          return
        }
        if (data.time === '') {
          this.$message.warning('请输入完整参数')
          return
        }
        let url = ENV.SMALL_SHEEP_HOST_URL + '/task_publish/publishTask/?task_id={0}&count={1}&time={2}'
          .format(this.taskId, data.count, parseInt(data.time / 1000))
        this.$http.get(url)
          .then(response => {
            this.$message.success(response.data)
            this.pubilshTask = false
          })
          .catch(err => {
            this.$message.warning(err.message)
          })
      },
      set () {
        this.newTask = {
          icon: '',
          screenshots: '',
          url: '',
          guide: '',
          title: '',
          desc: '',
          price: '',
          bonus: '',
          pkg: '',
          count: '',
          checked: false,
          h5url: '',
        }
      }
    }
  }
</script>

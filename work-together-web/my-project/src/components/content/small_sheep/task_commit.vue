<template>
  <div>
    <el-button type="text" @click="goback()">返回任务列表</el-button>
    <el-dialog
      title="审核结果"
      :visible.sync="checkResult"
    >
      <div>
        <el-form :model="FailedInfo" style="margin-right: 20px" :label-position="'left'"
                 :label-width="formLabelWidth">
          <el-form-item label="否决原因" :label-width="formLabelWidth">
            <el-input v-model="FailedInfo.action" auto-complete="off"
                      placeholder="请输入不合格原因"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
                 <el-button @click="checkResult=false">取 消</el-button>
                 <el-button type="primary" @click="noPass(FailedInfo.action)">确 定</el-button>
                 </span>
    </el-dialog>
    <el-row>
      <el-col :span="3" v-for="(commitTask, index) in TaskCommit" :key="index">
        <div style="margin: 5px">
          <el-card :body-style="{ padding: '0px'}">
            <img width="100%" :src="commitTask.TaskImg" @click="taskimg(commitTask.TaskImgs)" class="image">
            <div style="padding: 10px;">
              <div class="bottom clearfix">
                <time class="time">{{ commitTask.CreateTime }}</time>
                <el-button type="success" class="button" @click="pass(commitTask)">通过</el-button>
                <el-button type="danger" class="button" @click="noPassDialog(commitTask)">不合格
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="查看截图"
      size="tiny"
      :visible.sync="taskimgs"
    >
        <img style="width: 100%;" :src="imgsistask" alt="">
      <span slot="footer" class="dialog-footer">
                 <el-button @click="taskimgs=false">关 闭</el-button>
                 </span>
    </el-dialog>
  </div>
</template>
<script>
  var taskId
  export default {
    data() {
      return {
        currentDate: new Date(),
        TaskCommit: [],
        CommitTask: {},
        checkResult: false,
        taskimgs: false,
        imgsistask: '',
        FailedInfo: {action: ''},
        formLabelWidth: '120px'
      };
    },
    mounted() {
      taskId = this.$route.query.TaskId;
      this.$http.get(ENV.SMALL_SHEEP_HOST_URL + "/task_commit/getUnCheckTask/?task_id=" + taskId)
        .then(response => {
          this.TaskCommit = []
          if (response.data === null) {
            this.$message.warning('TaskId为' + taskId + '没有任务记录')
            return
          }
          let baseInfo = response.data
          for (let i = 0; i < baseInfo.length; i++) {
            let info = {
              Id: baseInfo[i].Id === null ? '' : baseInfo[i].Id,
              TaskImg: baseInfo[i].CompressionImg === '' || null || undefined ? baseInfo[i].TaskImg : baseInfo[i].CompressionImg,
              CreateTime: baseInfo[i].CreateTime === null ? '' : baseInfo[i].CreateTime,
              TaskImgs: baseInfo[i].TaskImg === null ? '' : baseInfo[i].TaskImg,
            }
            console.warn(info.TaskImg)
            this.TaskCommit.push(info)
          }
        }).catch(err => {
        this.$message.warning(err.message)
      })
    },
    methods: {
      taskimg(v) {
        console.log(v)
        this.taskimgs = true
        this.imgsistask = v
      },
      pass(o) {
        let url = ENV.SMALL_SHEEP_HOST_URL + "task_commit/updateCommitTask/?id="
        this.$http.get(url + o.Id + "&state=" + 2)
          .then(response => {
            this.$message.success(response.data)
          })
          .catch(err => {
            this.$message.warning(err.message)
          })
      },
      noPass(info) {
        this.checkResult = false;
        let url = ENV.SMALL_SHEEP_HOST_URL + "task_commit/updateCommitTask/?id="
        this.$http.get(url + this.CommitTask.Id + "&state=" + 3 + "&failed_action=" + info)
          .then(response => {
            this.$message.success(response.data)
          })
          .catch(err => {
            this.$message.warning(err.message)
          })
      },
      noPassDialog(o) {
        this.CommitTask = o;
        this.checkResult = true
      },
      goback() {
        this.$router.back()
      }
    }
  }
</script>

<style>
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 8px;
    float: right;
    margin-right: 5px;
  }

  .image {
    height: 200px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>

<template>
  <div>
    <section class="content-header">
      <h1>
        任务审核
        <small>查看任务审核情况</small>
      </h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div>
            <el-table
              :data="TaskPublish"
              border
              :row-style="Background"
              style="width: 100%">
              <el-table-column
                prop="Id"
                align="center"
                width="80"
                label="任务ID">
              </el-table-column>
              <el-table-column
                prop="Task.Title"
                label="游戏名称"
                align="center">
              </el-table-column>
              <el-table-column
                align="center"
                prop="TotalCouont"
                label="发布数量">
              </el-table-column>
              <el-table-column
                align="center"
                prop="CommitCount"
                label="提交数量">
              </el-table-column>
              <el-table-column
                align="center"
                prop="UncheckedCount"
                label="未审核数量">
              </el-table-column>
              <el-table-column
                align="center"
                prop=""
                label="结束时间">
                <template slot-scope="scope">
                  {{ scope.row.over_time | stampToTimeFull }}
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="checkCommit(scope.row.Id)">审核</el-button>
                  <el-button size="small" @click="onView(scope.row.Task)">查看任务</el-button>
                  <el-button size="small" @click="editView(scope.row)">编 辑</el-button>
                  <el-button size="small" @click="assembly(scope.row.Id, 1)" :disabled="scope.row.Status === 1">上 线
                  </el-button>
                  <el-button size="small" @click="assembly(scope.row.Id, 2)" :disabled="scope.row.Status === 2">下 线
                  </el-button>
                  <!--<el-button size="small" @click="offline(scope.row.Id)" :disabled="scope.row.Status === 2">下线-->
                  <!--</el-button>-->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
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
    <el-dialog title="编辑已发布数量" :visible.sync="editViews">
      <div>
        <el-form :model="oneditView" :label-position="'right'"
                 label-width="85px">
          <el-form-item label="ID：">
            <p>{{ oneditView.Id }}</p>
          </el-form-item>
          <el-form-item label="发布数量：">
            <el-input
              placeholder="请输入内容"
              v-model="oneditView.TotalCouont"
              clearable>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
                    <el-button @click="editViews = false">取 消</el-button>
                 <el-button type="primary" @click="Viewsubmit(oneditView)">确 定</el-button>
                 </span>
    </el-dialog>
    <el-dialog title="查看已发布任务" :visible.sync="onview_task">
      <div>
        <el-form :model="viewtask" :label-position="'right'"
                 label-width="85px">
          <el-form-item label="任务ID：">
            <p style="width: 100%;">{{ viewtask.Id }}</p>
          </el-form-item>
          <el-form-item label="标题：">
            <p style="width: 100%">{{ viewtask.Title }}</p>
          </el-form-item>
          <el-form-item label="图标：">
            <img width="80px" height="80px" :src="viewtask.Icon">
          </el-form-item>
          <el-form-item label="描述：">
            <p style="width: 100%">{{ viewtask.Desc }}</p>
          </el-form-item>
          <el-form-item label="下载地址：">
            <p style="width: 100%">{{ viewtask.DownLoadUrl }}</p>
          </el-form-item>
          <el-form-item label="攻略地址：">
            <p style="width: 100%">{{ viewtask.Guide }}</p>
          </el-form-item>
          <el-form-item label="佣金：">
            <p style="width: 100%">{{ viewtask.Price }}</p>
          </el-form-item>
          <el-form-item label="奖金：">
            <p style="width: 100%">{{ viewtask.Bonus }}</p>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
                    <el-button @click="onview_task = false">关  闭</el-button>
                 </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        TaskPublish: [],
        edittask: false,
        editViews: false,
        onedittask: {},
        oneditView: {},
        onview_task: false,
        viewtask: {
          Id: '',
          DownLoadUrl: '',
          Guide: '',
          Desc: '',
          Icon: '',
          Title: '',
          Price: 0,
          Bonus: 0,
        },
      }
    },
    mounted() {
      this.load()
    },
    methods: {
      Viewsubmit(v){
        console.log(v)
        let url = ENV.SMALL_SHEEP_HOST_URL + '/task_publish/change_task_count/?id=' + v.Id + '&count=' + v.TotalCouont
        this.$http.get(url)
          .then(reponse => {
            this.$message.success('操作成功')
            this.editViews = false
            this.load()
          })
          .catch(err => {
            this.editViews = false
            this.load()
            this.$message.warning(err.message)
          })
      },
      onView (v) {
        this.viewtask = v
        this.onview_task = true
      },
      editView(v){
        let datas = v
        this.editViews = true
        this.oneditView = datas
      },
      assembly (v, status) {
        let url = ENV.SMALL_SHEEP_HOST_URL + '/task_publish/UpdateTaskStatus/?status=' + status + '&id=' + v
        this.$http.get(url)
          .then(reponse => {
            this.$message.success('操作成功')
            this.load()
          })
          .catch(err => {
            this.$message.warning(err.message)
          })
      },
      load () {
        this.$http.get(ENV.SMALL_SHEEP_HOST_URL + '/task_publish/getAllTasks/')
          .then(response => {
            this.TaskPublish = response.data;
            // if (baseInfo === null) {
            //   return
            // }
            // for (let i in baseInfo) {
            //   let info = {
            //     Id: baseInfo[i].Id === null ? '' : baseInfo[i].Id,
            //     OverTime: baseInfo[i].OverTime === null ? '' : baseInfo[i].OverTime,
            //     TaskId: baseInfo[i].Task.Id === null ? '' : baseInfo[i].Task.Id,
            //     Title: baseInfo[i].Title === null ? '未知' : baseInfo[i].Task.Title,
            //     TotalCouont: baseInfo[i].TotalCouont === null ? '' : baseInfo[i].TotalCouont,
            //     Status: baseInfo[i].Status === null ? '' : baseInfo[i].Status,
            //     Commit: baseInfo[i].Status === null ? '' : baseInfo[i].CommitCount,
            //     UnCheck: baseInfo[i].Status === null ? '' : baseInfo[i].UncheckedCount,
            //   }
            //   this.TaskPublish.push(info)
            // }
          });
        String.prototype.format = () => {
          if (arguments.length == 0) return this;
          for (var s = this, i = 0; i < arguments.length; i++)
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
          return s;
        };
      },
      Background(row, rowIndex) {
        //任务状态,1，上线，2，下线
        if (row.Status === 1) {
          if (row.UnCheck > 0) {
            return {background: "#d0e6ff"};
          }
          return {background: '#fffdf8'};
        } else if (row.Status === 2) {
          return {background: "#f9afad"};
        }
        return '';
      },
      checkCommit(row) {
        this.$router.push({
          path: '/home/task_commit',
          query: {TaskId: row}
        })
      },
    }
  }
</script>

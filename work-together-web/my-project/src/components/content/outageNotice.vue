<template>
  <div>
    <section class="content-header">
      <h1>
        游戏管理
        <small>停运公告</small>
      </h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="col-sm-10 col-md-6 ipt_jianju">
            <label>游戏名称:</label>
            <el-select v-model="params.game_id" :clearable="true"
                       @change="getList(0)" filterable multiple placeholder="请选择" style="width: 400px">
              <el-option
                v-for="item in gameAll"
                :label="item.game_name"
                :value="item.game_id">
              </el-option>
            </el-select>
          </div>
          <div class="col-sm-10 col-md-6 ipt_jianju">
            <label>（服务器）状态:</label>
            <el-select v-model="params.state"
                       @change="getList(0)" placeholder="请选择" clearable style="width: 400px">
              <el-option
                v-for="item in onitem"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <el-button style="float: right" type="primary" @click="official">新增公告</el-button>
        </div>
        <div class="box-body">
          <table v-loading="isLoading"
                 element-loading-text="拼命加载中" class="table table-bordered table-hover">
            <thead>
            <tr>
              <th>游戏名称</th>
              <th>关闭新增时间</th>
              <th>关闭充值时间</th>
              <th>关闭服务器时间</th>
              <th>提交时间</th>
              <th>提交人</th>
              <th>（服务器）状态</th>
              <th>备注</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
              <td>{{ item.game.game_name }}</td>
              <td>{{ item.incr_time | stampToTimeFull}}</td>
              <td>{{ item.recharge_time | stampToTimeFull }}</td>
              <td>{{ item.server_time | stampToTimeFull }}</td>
              <td>{{ item.create_time | stampToTimeFull}}</td>
              <td>{{ item.create_user.nickname }}</td>
              <td>
                <p v-if="item.server_time < new Date()/1000 ">已关闭</p>
                <p v-if="item.server_time >= new Date()/1000 ">未关闭</p>
              </td>
              <td>
                <p class="ondesc">
                  {{ item.desc }}
                </p>
              </td>
              <td>
                <el-button title="编辑" class="fa fa-edit" type="text" size="small"
                           @click=editReference(item)></el-button>
              </td>
            </tr>
            </tbody>
          </table>
          <el-pagination
            v-show="total > per_page"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="per_page"
            :total="total"
            layout="prev, pager, next, jumper">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      title="编辑公告备注"
      :visible.sync="announcement"
      width="30%">
      <el-form :model="forms">
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="forms.desc" placeholder="描述" :rows="4" :maxlength="1000"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="announcement = false">取 消</el-button>
    <el-button type="primary" @click="enidannouncement(forms)">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="新增公告" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-form :model="form">
        <div v-for="(ladder,index) in form.domains" :key="index">
          <div style="border: 1px solid #000000;padding:0 22px;padding-top: 22px;margin-bottom: 22px">
            <el-form-item label="游戏" :label-width="formLabelWidth">
              <el-select v-model="ladder.game_id" filterable placeholder="请选择">
                <el-option
                  v-for="item in gameAllAdd"
                  :key="item.game_id"
                  :label="item.game_name"
                  :value="item.game_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关闭新增时间" :label-width="formLabelWidth">
              <el-date-picker type="datetime" placeholder="关闭新增时间" format="yyyy-MM-dd HH:mm:ss"
                              v-model="ladder.incr_time"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="关闭充值时间" :label-width="formLabelWidth">
              <el-date-picker type="datetime" placeholder="关闭充值时间" format="yyyy-MM-dd HH:mm:ss"
                              v-model="ladder.recharge_time"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="关闭服务器时间" :label-width="formLabelWidth">
              <el-date-picker type="datetime" placeholder="关闭服务器时间" format="yyyy-MM-dd HH:mm:ss"
                              v-model="ladder.server_time"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="描述" :label-width="formLabelWidth">
              <el-input type="textarea" @change="ontextarea(ladder)" v-model="ladder.desc" placeholder="描述" :rows="4" :maxlength="1000"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click.prevent="removeDomain(ladder)">删除</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDomain">新增公告</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addregion(form.domains)" :disabled="this.disabled">确 定</el-button>
      </div>
    </el-dialog>
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

  .ondesc {
    width: 20vw;
    margin-right: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .ondesc:hover {
    overflow: auto;
    white-space: inherit;
  }
</style>
<script>
  import {VueEditor} from 'vue2-editor'

  export default {
    components: {
      VueEditor
    },
    data: function () {
      return {
        page: 0,
        per_page: 15,
        total: 0,
        disabled: false,
        announcement: false,
        isLoading: true,
        currentPage: 0,
        items: [],
        gameAll: [],
        gameAllAdd: [],
        formLabelWidth: '70px',
        dialogFormVisible: false,
        disableds: false,
        token: '',
        params: {
          game_id: [],
          state: ''
        },
        onitem: [
          {id: 0, name: '所有'},
          {id: 1, name: '已关闭'},
          {id: 2, name: '未关闭'}],
        form: {
          domains: [{
            game_id: '',
            incr_time: '',
            recharge_time: '',
            server_time: '',
            desc: '',
          }],
        },

        forms: {
          desc: "",
        },
      }
    },
    mounted: function () {
      this.isLoading = true
      this.getList()
      this.getGameAllList()
      this.selectgameAdd()
      this.updateValue()
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {
          })
      },
      ontextarea (v) {
        if (v.desc.length > 999) {
          this.$message.error("公告输入不可超过1000字")
          this.ladder.desc = v.substring(0, 1000);
        }
      },
      removeDomain(item) {
        var index = this.form.domains.indexOf(item)
        if (index !== -1) {
          this.form.domains.splice(index, 1)
        }
      },
      addDomain() {
        this.form.domains.push({
          game_id: '',
          incr_time: '',
          recharge_time: '',
          server_time: '',
          desc: '',
        });
      },
      updateValue() {
        this.$emit('input', this.reBuildLadders2Back(this.form.game_id))
      },
      editReference(v) {
        this.announcement = true
        this.forms = v
      },
      reBuildLadders2Back(ladders) {
        let temp = []
        for (let i in ladders) {
          let ladder = ladders[i]
          let start, end, ends
          start = ladder.incr_time.format("yyyy-MM-dd HH:mm:ss")
          end = ladder.recharge_time.format("yyyy-MM-dd HH:mm:ss")
          ends = ladder.server_time.format("yyyy-MM-dd HH:mm:ss")

          temp.push({
            desc: ladder.desc,
            incr_time: start,
            recharge_time: end,
            server_time: ends,
          })
        }
        return temp
      },
      getList(page = 0) {
        this.isLoading = true
        // if (this.params.state == undefined) {
        //   this.params.state = ''
        // } else {
        //   this.params.state = this.params.state
        // }
        this.$http.get('/game_outage/?offset=' + page + '&limit=' + this.per_page + '&gameids=' + this.params.game_id + '&state=' + this.params.state).then(response => {
          this.items = response.body.data
          for (let i in this.items) {
            if (!this.items[i].game) {
              this.items[i].game = {
                game_name: ''
              }
            } else {
              this.items[i].game = this.items[i].game
            }
          }
          this.total = response.body.total
          this.isLoading = false
        }, (error) => {
          this.$message.error(error.body)
          this.isLoading = false
        })
      },
      enidannouncement(v) {
        console.log(v)
        let post = {
          'desc': v.desc
        }
        this.$http.put('/game_outage/' + v.id, post).then(response => {
          this.$message.success('修改成功')
          this.announcement = false
          this.page = 0
          this.getList()
        }, (error) => {
          this.$message.error(error.body)
          this.announcement = false
          this.page = 0
          this.getList()
        })
      },
      official() {
        this.dialogFormVisible = true
        this.form.domains = [{
          game_id: '',
          incr_time: '',
          recharge_time: '',
          server_time: '',
          desc: '',
        }];
      },
      handleCurrentChange(currentPage) {
        let offset = util.buildOffsetByPage(currentPage, this.per_page)
        var pa = offset
        this.page = currentPage
        this.getList(pa)
      },
      getGameAllList() {
        var url = '/game_outage/getGameName?type=1'
        this.$http.get(url)
          .then((res) => {
            this.gameAll = res.body
          })
      },
      selectgameAdd() {
        var url = '/game_outage/getGameName?type=2'
        this.$http.get(url)
          .then((res) => {
            this.gameAllAdd = res.body
          })
      },
      addregion(v) {
        console.log(v)
        this.disabled = true
        for (let i in v) {
          v[i].incr_time = Date.parse(v[i].incr_time) / 1000
          v[i].recharge_time = Date.parse(v[i].recharge_time) / 1000
          v[i].server_time = Date.parse(v[i].server_time) / 1000
        }
        let post = v
        this.$http.post('/game_outage', post).then((response) => {
          this.$message.success('添加成功')
          this.getList()
          this.postToken = ""
          this.disabled = false
        }, (error) => {
          this.postToken = ""
          this.$message.error(error.body)
          this.disabled = false
        })
        this.dialogFormVisible = false
      }

    }
  }
</script>

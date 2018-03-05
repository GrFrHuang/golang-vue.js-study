<template>
  <div>
    <section class="content-header">
      <h1>退币申请管理</h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-body">
          <el-form :inline="true" class="demo-form-inline" >
            <el-form-item label="游戏">
              <el-select v-model="params.game_id" clearable filterable remote :remote-method="gameSearch" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in gameList.data" :key="item.id" :label="item.name" :value="item.id"></el-option>
                <el-pagination v-if="gameList.total > gameList.perPage "
                               small layout="prev, pager, next"
                               :page-size="gameList.perPage"
                               :total="gameList.total"
                               :current-page.sync="gameList.page"
                               @current-change="gamePageChange">
                </el-pagination>
              </el-select>
            </el-form-item>
            <el-form-item label="会长账号">
              <el-select v-model="params.user_id" clearable  filterable remote :remote-method="userSearch" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in userList.data"
                           :key="item.UserId"
                           :label="item.UserName"
                           :value="item.UserId"></el-option>
                <el-pagination v-if="userList.total > userList.perPage "
                     small layout="prev, pager, next"
                     :page-size="userList.perPage"
                     :total="userList.total"
                     :current-page.sync="userList.page"
                     @current-change="userPageChange">
                </el-pagination>
              </el-select>
            </el-form-item>
            <el-form-item label="玩家账号">
              <el-input type="text" v-model="params.player_name" ></el-input>
            </el-form-item>
            <el-form-item label="审核状态">
              <el-select v-model="params.status" clearable placeholder="请选择">
                <el-option selected label="全部" value="-1"></el-option>
                <el-option label="未处理" value="0"></el-option>
                <el-option label="已同意" value="1"></el-option>
                <el-option label="已拒绝" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getApplyInfo">查询</el-button>
            </el-form-item>
          </el-form>
          <el-tabs v-model="params.active" type="card" @tab-click="activeChange">
            <el-tab-pane label="CPSA" name="CPSA"></el-tab-pane>
            <el-tab-pane label="CSPG" name="CPSG"></el-tab-pane>
          </el-tabs>
          <el-table
            :data="applyInfo.data"
            style="width: 100%">
            <el-table-column prop="game_name" label="游戏名成"></el-table-column>
            <el-table-column prop="player_name" label="玩家账号"></el-table-column>
            <el-table-column prop="amount" label="退避数量"></el-table-column>
            <el-table-column  label="会长得币数量">
              <template scope="scope" v-if="scope.row.status == 1"> {{ scope.row.user_amount }} </template>
            </el-table-column>
            <el-table-column prop="user_name" label="申请会长"></el-table-column>
            <el-table-column label="申请时间">
              <template scope="scope">{{ scope.row.create_time | stampToTimeFull }}</template>>
            </el-table-column>
            <el-table-column label="退币时间">
              <template scope="scope">{{ scope.row.return_time | stampToTimeFull }}</template>>
            </el-table-column>
            <el-table-column prop="desc" label="备注"></el-table-column>
            <el-table-column label="操作">
              <template scope="scope" >
                  <span v-if="scope.row.status == 0">
                    <button class="btn btn-primary" @click="changeStatus(scope.row.id, 1)">同意</button>
                    <button class="btn" @click="changeStatus(scope.row.id, 2)">不同意</button>
                  </span>
                  <span v-else-if="scope.row.status == 1">已同意</span>
                  <span v-else >已拒绝</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              v-if="applyInfo.total > applyInfo.perPage "
              layout="total, prev, pager, next"
              :page-size="applyInfo.perPage"
              :total="applyInfo.total"
              :current-page.sync="applyInfo.page"
              @current-change="applyInfoPageChange">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="拒绝理由" :visible.sync="refuseDialogShow"  :before-close="closeRefuseDialog">
      <el-form :rules="refuseForm" :model="refuseForm" refuseForm >
        <el-form-item
            prop="reason"
            label="拒绝理由"
            :rules="{required: true, message: '请输入拒绝理由', trigger: 'blur' }">
          <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入理由"
                  v-model="refuseForm.reason">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="requestChangeApi(refuseForm.id, 2)">提交</el-button>
          <el-button @click="closeRefuseDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        refuseDialogShow: false,
        refuseForm: {
          id: 0,
          reason: "玩家剩余游戏币不足，不满足退币数量"
        },
        applyInfo: {
            data: [],
            perPage: 20,
            page: 1,
            total: 0
        },
        userList: {
            data: [],
            perPage: 20,
            page: 1,
            total: 0,
            query:'',
        },
        gameList: {
            data: [],
            perPage: 20,
            page: 1,
            total: 0,
            query: '',
        },
        params: {
            active: "CPSA",
            game_id: "",
            user_id: "",
            status: "-1",
            player_name: "",
        },
        gameKey: "",
        token: "",
      }
    },
    mounted: function() {
      this.token = sessionStorage.getItem("token")
      this.getGameSelectList()
      this.getUserSelectList()
      this.getApplyInfo()
    },

    methods: {
      closeRefuseDialog() {
          this.refuseForm.id = 0
          this.refuseForm.reason = "玩家剩余游戏币不足，不满足退币数量"
          this.refuseDialogShow = false
      },
      changeStatus(id, status) {
        if (status == 1) {
          this.$confirm('确认同意退币吗？')
            .then(_ => {
                this.requestChangeApi(id, status)
                done();
            })
            .catch(_ => {
            })
        } else {
            this.refuseForm.id = id
            this.refuseDialogShow = true
        }
      },
      requestChangeApi (id, status) {
          let form = new FormData()
          form.append("status", status)
          form.append("token", this.token)
          if (status == 2) {
              form.append("refuse_reason", this.refuseForm.reason)
          }
          this.$http.put(ENV.CPS_HOST_URL + "/return_gold/"+id, form).then((response) => {
              this.getApplyInfo()
              if (status == 2) {
                  form.append("reason", this.refuseForm.reason)
                  this.closeRefuseDialog()
              }
              this.$message.success("操作成功")
          }, error => {
              this.$message.error(error.body)
          })
      },
      userSearch(query) {
        this.userList.page = 1
        if (query != "全部") {
          this.userList.query = query
        }
        this.getUserSelectList()
      },
      userPageChange() {
          this.getUserSelectList()
      },
      getUserSelectList() {
          this.$http.get(ENV.CPS_HOST_URL + "/user/get_users_for_w_select", {
              params:{token: this.token, page: this.userList.page, per_page: this.userList.perPage, key: this.userList.query}
          }).then((response) => {
              if (response.body.total > 0) {
                  this.userList.data = response.body.data
                  for (let i = 0; i < response.body.data.length; i++) {
                      if (this.userList.data[i].RealName != '') {
                          this.userList.data[i].UserName += '(' + this.userList.data[i].RealName + ')'
                      }
                  }
              }
              this.userList.total = response.body.total
          }, error => {
              this.$message.error(error.body)
          })
      },
      gamePageChange() {
          this.getGameSelectList()
      },
      getGameSelectList() {
        this.$http.get(ENV.CPS_HOST_URL + "/game/game_select_list", {
          params:{token: this.token, page: this.gameList.page, game_name: this.gameList.query}
        }).then((response) => {
          this.gameList.data = response.body.data
          this.gameList.total = response.body.total
        }, error => {
          this.$message.error(error.body)
        })
      },
      gameSearch(query) {
        this.gameList.page = 1
        this.gameList.query = query
        this.getGameSelectList()
      },
      getApplyInfo(){
          let form = this.params
          form.token = this.token
          form.page = this.applyInfo.page
          form.per_page = this.applyInfo.perPage
          this.$http.get(ENV.CPS_HOST_URL + "/return_gold/", { params:form })
            .then((response) => {
                this.applyInfo.data = response.body.data
                this.applyInfo.total = response.body.total
            }, error => {
              if (error.status === 403) {
                this.$router.push({path: '/login'})
              } else {
                this.$message.error(error.body)
              }
            })
      },
      applyInfoPageChange() {
        this.getApplyInfo()
      },
      activeChange() {
          this.applyInfo.page = 1
          this.getApplyInfo()
      }
    }
  }
</script>

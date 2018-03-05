<template>
  <div>
    <div>
      <section class="content-header">
        <h1>
          申领腾讯游戏列表<small>申领游戏审核</small>
        </h1>
        <!--<ol class="breadcrumb">-->
          <!--<li><i class="fa fa-dashboard"></i></li>-->
          <!--<li>-->
            <!--<router-link to="/home/user">用户审核</router-link>-->
          <!--</li>-->
        <!--</ol>-->
      </section>
      <div class="content">
        <div class="box">
          <div class="box-header with-border">
            <el-form :inline="true" class="demo-form-inline" >
              <el-form-item label="账号">
                <el-input  v-model="params.user_name" placeholder="账号"></el-input>
              </el-form-item>
              <el-form-item label="游戏名">
                <el-input  v-model="params.game_name" placeholder="游戏名"></el-input>
              </el-form-item>
              <el-form-item label="日期">
                  <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择开始日期" v-model="params.start_time" style="width: 100%;"></el-date-picker>
                  </el-col>
                  <span style="display: block; float: left"> - </span>
                  <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择结束日期" v-model="params.end_time" style="width: 100%;"></el-date-picker>
                  </el-col>
              </el-form-item>
              <el-form-item label="审核状态">
                <el-select v-model="params.status" clearable placeholder="请选择">
                  <el-option
                    v-for="item in message_type_select"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
              </el-form-item>
              <p>共{{ total }}款游戏</p>
            </el-form>
          </div>
          <div class="box-body">
            <el-tabs v-model="activeName" type="card" @tab-click="tabChange">
              <el-tab-pane label="CPST" name="CPST"></el-tab-pane>
              <el-tab-pane label="CPSO" name="CPSO"></el-tab-pane>
              <el-tab-pane label="CPSD" name="CPSD"></el-tab-pane>
            </el-tabs>
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>账号</th>
                  <th>游戏名</th>
                  <th>申领时间</th>
                  <th>审核状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
              <tr v-for="item in items">
                <td>{{ item.user_name }}</td>
                <td>{{ item.game_name }}</td>
                <td>{{ item.create_time }}</td>
                <td>{{ item.status_name }}</td>
                <td>
                  <template v-if="item.status == 0 ">
                    <a title="通过" style="cursor:pointer" @click = "openDialog(item.user_id, item.game_id)" >通过</a>
                    <span > | </span>
                    <a title="不通过" style="cursor:pointer" @click = "auditFault(item.user_id, item.user_name, item.game_id, item.game_name)" >不通过</a>
                    <span > | </span>
                    <a title="不再合作" style="cursor:pointer" @click = "auditBanned(item.user_id, item.user_name, item.game_id, item.game_name, item.deposit_status)" >不再合作</a>
                  </template>
                  <template v-if="item.status == 1 ">
                    <a v-if="item.deposit_status == 0" title="" style="cursor:pointer" @click = "returnDeposit(item.user_id, item.user_name, item.game_id, item.game_name)"  >退还押金</a>
                    <span v-if="item.deposit_status == 0" > | </span>
                    <a title="终止合作" style="cursor:pointer" @click = "auditBanned(item.user_id, item.user_name, item.game_id, item.game_name, item.deposit_status)"  >终止合作</a>
                  </template>
                  <template v-if="item.status == 3">
                    <a title="再次合作" style="cursor:pointer;" @click = "auditFault(item.user_id, item.user_name, item.game_id, item.game_name)" >再次合作</a>
                  </template>
                </td>
              </tr>
              </tbody>
            </table>
            <el-pagination
              v-show="total > per_page"
              @current-change="onCurrentChange"
              :current-page="page"
              :page-size="per_page"
              :total="total"
              layout="prev, pager, next, jumper">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="编辑信息"
      v-model="successShow"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <div @close="closeDialog" class="box">
        <div class="box-header with-border">
          <div class="col-md-8 form-horizontal">
            <div class="form-group">
              <div>
                <p >腾讯渠道ID：
                  <!--<span   v-model="tencent_id" placeholder="请输入腾讯应用ID"></span>-->
                  <el-select v-if="activeName == 'CPST'" v-model="tencent_id" placeholder="请选择" @change="tenCidChange" >
                    <template v-for="item in ten_cids">
                      <el-option :key="item.ChannelId" :value="item.ChannelId" :label="item.ChannelName" ></el-option>
                    </template>
                  </el-select>
                  <span v-else > {{tencent_id}} </span>
                </p>
                <p>打包地址：
                  <span v-if="ten_down_url_flag" > {{ tencent_download_url }} </span>
                  <el-input v-else v-model="tencent_download_url" placeholder="请输入打包地址"></el-input>
                </p>
              </div>
            </div>
            <div class="col-sm-10">
              <el-button type="primary" @click="auditSuccess">保存</el-button>
              <el-button @click="closeDialog" type="primary">取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped>
  a {
    text-decoration: none !important;
  }
  th {
    text-align: center;
    background: #367fa9 !important;
    color: white !important;
  }

  td {
    text-align: center;
  }
</style>
<script>
  export default {
    data: function () {
      return {
        ten_down_url_flag: false,
        ten_cids: [],
        activeName: "CPST",
        successShow: false,
        page: 1,
        per_page: 15,
        total: 0,
        items: [],
        token: '',
        message_type_select: [{
          id: 0,
          name: '正在审核'
        },{
          id: 1,
          name: '审核通过'
        },{
          id: 2,
          name: '审核不通过'
        },{
          id: 3,
          name: '终止合作'
        }],
        params: {
          start_time: '',
          end_time: '',
          user_name: '',
          game_name: '',
        },
        tencent_id: '',
        tencent_download_url: '',
        game_id: 0,
        user_id: 0,
      }
    },
    mounted: function () {
      this.token = sessionStorage.getItem("token")
      this.getList()
    },
    methods: {
      tabChange() {
        this.getList()
      },
      tenCidChange() {
          if (this.tencent_id == "") {
              return
          }
        this.$http.get(ENV.CPS_HOST_URL + "/auth/get_ten_download_url", {
          params: {token: this.token, active: this.activeName, game_id: this.game_id, channel_id: this.tencent_id}
        }).then(response => {
          this.tencent_download_url = response.body
          if (this.tencent_download_url != "") {
            this.ten_down_url_flag = true
          } else {
            this.ten_down_url_flag = false
          }
        }, (error) => {
          this.$message.error(error.body)
        })
      },
      openDialog(user_id, game_id) {
        this.tencent_download_url = ''
        this.game_id = game_id
        this.user_id = user_id
        this.ten_cids = []
        this.ten_down_url_flag = false
        this.getAuditParams()
        this.successShow = true
      },
      getAuditParams() {
        this.$http.get(ENV.CPS_HOST_URL + "/auth/get_ten_audit_params", {
          params: {token: this.token, active: this.activeName, game_id: this.game_id}
        }).then(response => {
          this.tencent_download_url = response.body.download_url
          if (this.tencent_download_url != "") {
            this.ten_down_url_flag = true
          } else {
            this.ten_down_url_flag = false
          }
          this.ten_cids = response.body.ten_cids
          if (response.body.oem_cid != "") {
            this.tencent_id = response.body.oem_cid
          } else if (eval(this.ten_cids).length > 0) {
            this.tencent_id = this.ten_cids[0].ChannelId
          }
        }, (error) => {
          this.$message.error(error.body)
        })
      },
      closeDialog() {
        this.successShow = false
        this.tencent_id = ""
        this.tencent_download_url = ''
        this.game_id = 0
        this.user_id = 0
        this.ten_cids = []
        this.ten_down_url_flag = false
      },
      getList() {
        let from
          if (this.activeName == "CPST") {
            from = 1
          } else if (this.activeName == "CPSO") {
            from = 3
          } else if (this.activeName == "CPSD") {
            from = 4
          }
        this.$http.get(ENV.CPS_HOST_URL + "/auth/work_apply_game_list",
          {
            params: {
              token: this.token, page: this.page, per_page: this.per_page, from: from,
              start_time: this.params.start_time / 1000, end_time: this.params.end_time / 1000,
              user_name: this.params.user_name, game_name: this.params.game_name, active: this.activeName, status: this.params.status,
            }
          }
        ).then(response => {
          this.items = response.body.data
          this.total = response.body.total
        }, (error) => {
          if (error.status === 403) {
            this.$router.push({path: '/login'})
          } else {
            this.$message.error(error.body)
          }
        })
      },
      onSubmit() {
        this.getList()
      },
      onCurrentChange(currentPage) {
        this.page = currentPage
        this.getList()
      },

      auditSuccess() {
        this.$http.post(ENV.CPS_HOST_URL + "/auth/change_tencent_status", {
          token: this.token,
          user_id: +this.user_id,
          game_id: +this.game_id,
          status: 1,
          tencent_id: this.tencent_id,
          tencent_download_url: this.tencent_download_url
        }).then((response) => {
          this.$message.success('通过成功')
          this.getList()
          this.closeDialog()
        }, (error) => {
          this.$message.error(error.body)
        })

      },
      auditFault(userId, userName, gameId, gameName) {
        this.$confirm('确认不通过【' + userName + '】【' + gameName + '】吗？').then(_ => {
          this.$http.post(ENV.CPS_HOST_URL + "/auth/change_tencent_status", {
            token: this.token,
            user_id: +userId,
            game_id: +gameId,
            status: 2
          }).then((response) => {
            this.$message.success('不通过成功')
            this.getList()
          }, (error) => {
            this.$message.error(error.body)
          })
        })
      },
      auditReset(userId, userName, gameId, gameName) {
        this.$confirm('确认重新审核【' + userName + '】【' + gameName + '】吗？').then(_ => {
          this.$http.post(ENV.CPS_HOST_URL + "/auth/change_tencent_status", {
            token: this.token,
            user_id: +userId,
            game_id: +gameId
          }).then((response) => {
            this.$message.success('重置成功')
            this.getList()
          }, (error) => {
            this.$message.error(error.body)
          })
        })
      },
      auditBanned(userId, userName, gameId, gameName, depositStatus) {
        this.$confirm('确认终止【' + userName + '】【' + gameName + '】吗？').then(_ => {
          this.$http.post(ENV.CPS_HOST_URL + "/auth/change_tencent_status", {
            token: this.token,
            user_id: +userId,
            game_id: +gameId,
            status: 3
          }).then((response) => {
            this.$message.success('终止成功')
            if (depositStatus == 0) {
              this.returnDeposit(userId, userName, gameId, gameName)
            }
            this.getList()
          }, (error) => {
            this.$message.error(error.body)
          })
        })
      },
      returnDeposit(userId, userName, gameId, gameName) {
        this.$confirm('确认退还【' + userName + '】【' + gameName + '】的押金吗？').then(_ => {
          this.$http.post(ENV.CPS_HOST_URL + "/auth/return_deposit", {
            token: this.token,
            user_id: +userId,
            game_id: +gameId
          }).then((response) => {
            this.$message.success('退款成功')
            this.getList()
          }, (error) => {
            this.$message.error(error.body)
          })
        })
      },
    }
  }
</script>

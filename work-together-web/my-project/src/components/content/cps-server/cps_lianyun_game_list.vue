<template>
  <div>
    <section class="content-header">
      <h1>
        申领联运游戏列表<small>申领游戏审核</small>
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
          <table class="table table-bordered table-hover">
            <thead>
              <tr>
                <th>账号</th>
                <th>游戏名</th>
                <th>渠道名</th>
                <th>申领时间</th>
                <th>打包状态</th>
                <th>审核状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
              <td>{{ item.user_name }}</td>
              <td>{{ item.game_name }}</td>
              <td>{{ item.platform_name }}</td>
              <td>{{ item.create_time }}</td>
              <td>{{ item.pkg_status_name }}</td>
              <td>{{ item.status_name }}</td>
              <td>
                <template v-if="(item.package_status == -1 || item.package_status == 0) && item.status === '2'">
                  <a title="打包" style="cursor:pointer" @click = "packGame(item.platform_id, item.game_id, item.user_id, item.channel_platform)" >打包</a>
                  <span > | </span>
                </template>
                <template v-else-if="item.status !== '1' && item.status !== '3'">
                  <a title="更新打包" style="cursor:pointer" @click = "packGame(item.platform_id, item.game_id, item.user_id, item.channel_platform)" >更新打包</a>
                  <span > | </span>
                </template>
                <template v-if="item.package_status == 2">
                  <a title="修改地址" style="cursor:pointer" @click = "openChangeUrldialog(item.download_url, item.user_id, item.game_id, item.channel_platform)" >修改地址</a>
                  <span v-if="item.status != 3 && item.status != 1"> | </span>
                </template>
                <template v-if="item.status == 2 ">
                  <a title="通过" style="cursor:pointer" @click = "auditSuccess(item.user_id, item.user_name, item.game_id, item.game_name, item.channel_platform)" >通过</a>
                  <span > | </span>
                  <a title="不通过" style="cursor:pointer" @click = "openDialog(item.user_id, item.game_id,  item.game_name, item.user_name, item.channel_platform)" >不通过</a>
                  <span > | </span>
                  <a title="不通过" style="cursor:pointer" @click = "auditBanned(item.user_id, item.user_name, item.game_id,  item.game_name, item.channel_platform)" >不再合作</a>
                </template>
                <template v-if="item.status == 4 ">
                  <a title="终止" style="cursor:pointer" @click = "auditBanned(item.user_id, item.user_name, item.game_id, item.game_name, item.channel_platform)" >终止</a>
                  <span v-if="item.deposit_status == 0"> | </span>
                  <a v-if="item.deposit_status == 0" title="退押金" style="cursor:pointer" @click = "returnDeposit(item.user_id, item.user_name, item.game_id, item.game_name, item.channel_platform)" >退押金</a>
                </template>
                <template v-if="item.status == 3 ">
                  <a title="再次合作" style="cursor:pointer" @click = "cooperateAgain(item.user_id, item.user_name, item.game_id,  item.game_name, item.channel_platform)" >再次合作</a>
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
    <el-dialog
      title="原因"
      v-model="reasonShow"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <div @close="closeDialog" class="box">
        <div class="box-header with-border">
          <div class="col-md-8 form-horizontal">
            <div class="form-group">
              <div>
                  <el-input  type="textarea"  v-model="reason" placeholder="请输入不通过的原因"></el-input>
              </div>
            </div>
            <div >
              <el-button type="primary" @click="auditFault()">确定</el-button>
              <el-button @click="closeDialog" type="primary">取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="修改下载地址"
      v-model="changeUrlShow"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <div @close="closeChangeUrlDialog" class="box">
        <div class="box-header with-border">
          <div class="col-md-8 form-horizontal">
            <div class="form-group">
              <div>
                <el-input  type="input"  v-model="changeUrlForm.download_url" placeholder="下载地址"></el-input>
              </div>
            </div>
            <div >
              <el-button type="primary" @click="changeUrl()">确定</el-button>
              <el-button @click="closeChangeUrlDialog" type="primary">取消</el-button>
            </div>
          </div>
        </div>
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
</style>
<script>
  export default {
    data: function () {
      return {
        changeUrlShow: false,
        reasonShow: false,
        reason: "",
        user_name: "",
        game_name: "",
        game_id: 0,
        user_id: 0,
        channel_platform: "",
        page: 1,
        per_page: 15,
        total: 0,
        items: [],
        token: '',
        message_type_select: [{
          id: 1,
          name: '审核不通过'
        },{
          id: 2,
          name: '正在审核'
        },{
          id: 3,
          name: '终止合作'
        },{
          id: 4,
          name: '审核通过'
        }],
        params: {
          start_time: '',
          end_time: '',
          user_name: '',
          game_name: ''
        },
        changeUrlForm: {
          download_url: "",
          game_id: 0,
          user_id: 0,
          channel_platform: "",
        },
      }
    },
    mounted: function () {
      this.token = sessionStorage.getItem("token")
      this.getList()
    },
    methods: {
      openChangeUrldialog(url, userId, gameId, channnelPlatform) {
        this.changeUrlForm.download_url = url
        this.changeUrlForm.game_id = gameId
        this.changeUrlForm.user_id = userId
        this.changeUrlForm.channel_platform = channnelPlatform
        this.changeUrlShow = true
      },
      closeChangeUrlDialog() {
        this.changeUrlForm.download_url = ""
        this.changeUrlForm.game_id = ""
        this.changeUrlForm.user_id = ""
        this.changeUrlForm.channel_platform = ""
        this.changeUrlShow = false
      },
      changeUrl() {
        this.$http.post(ENV.CPS_HOST_URL + "/auth/change_lianyun_url", {
          token: this.token,
          download_url: this.changeUrlForm.download_url,
          game_id: +this.changeUrlForm.game_id,
          user_id: +this.changeUrlForm.user_id,
          channel_platform: this.changeUrlForm.channel_platform
        }).then((response) => {
          this.$message.success('设置成功')
          this.getList()
          this.closeChangeUrlDialog()
        }, (error) => {
          this.$message.error(error.body)
        })
      },
      openDialog(user_id, game_id, game_name, user_name, channel_platform) {
        this.reasonShow = true
        this.reason = ""
        this.game_id = game_id
        this.user_id = user_id
        this.game_name = game_name
        this.user_name = user_name
        this.channel_platform = channel_platform

      },
      closeDialog() {
        this.reasonShow = false
      },
      packGame(platform_id, game_id, user_id, channel_platform) {
        this.$http.post(ENV.CPS_HOST_URL + "/auth/lianyun_pack", {
          token: this.token,
          platform_id: +platform_id,
          game_id: +game_id,
          user_id: +user_id,
          channel_platform: channel_platform
        }).then((response) => {
          this.$message.success('打包中')
          this.getList()
        }, (error) => {
          this.$message.error(error.body)
        })
      },
      getList() {
        this.$http.get(ENV.CPS_HOST_URL + "/auth/work_lianyun_game_list",
          {
            params: {
              token: this.token, page: this.page, per_page: this.per_page,
              start_time: this.params.start_time / 1000, end_time: this.params.end_time / 1000,
              user_name: this.params.user_name, game_name: this.params.game_name, state: this.params.status,
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
      auditSuccess(userId, userName, gameId, gameName, channelPlatform) {
        this.$confirm('确认通过【' + userName + '】【' + gameName + '】吗？').then(_ => {
          this.$http.post(ENV.CPS_HOST_URL + "/auth/change_Lianyun_status", {
            token: this.token,
            user_id: +userId,
            game_id: +gameId,
            state: 4,
            Platform: channelPlatform
          }).then((response) => {
            this.$message.success('通过成功')
            this.getList()
          }, (error) => {
            this.$message.error(error.body)
          })
        })
      },
      cooperateAgain(userId, userName, gameId, gameName, channelPlatform) {
          this.$confirm('确认再次和【' + userName + '】合作游戏【' + gameName + '】吗？').then(_ => {
              this.$http.post(ENV.CPS_HOST_URL + "/auth/change_Lianyun_status", {
                  token: this.token,
                  user_id: +userId,
                  game_id: +gameId,
                  state: 1,
                  Platform: channelPlatform,
              }).then(_ => {
                  this.$message.success('再次合作成功')
                  this.getList()
              }, (error) => {
                  this.$message.error(error.body)
              })
          })
      },
      auditFault() {
        this.$confirm('确认不通过【' + this.user_name + '】【' + this.game_name + '】吗？').then(_ => {
          this.$http.post(ENV.CPS_HOST_URL + "/auth/change_Lianyun_status", {
            token: this.token,
            user_id: +this.user_id,
            game_id: +this.game_id,
            state: 1,
            Platform: this.channel_platform,
            StateInfo: this.reason
          }).then((response) => {
            this.$message.success('不通过成功')
            this.getList()
          }, (error) => {
            this.$message.error(error.body)
          })
        })
      },
//      auditReset (userId, userName, gameId, gameName) {
//        this.$confirm('确认重新审核【'+userName+'】【'+gameName+'】吗？').then(_ => {
//          this.$http.post(ENV.CPS_HOST_URL + "/auth/change_Lianyun_status", {token:this.token, user_id: +userId, game_id: +gameId, status:0}).then((response) => {
//            this.$message.success('重置成功')
//            this.getList()
//          }).then((error) => {
//            this.$message.error(error)
//          })
//        })
//      },
      returnDeposit(userId, userName, gameId, gameName, platform) {
        this.$confirm('确认退还【' + userName + '】【' + gameName + '】的押金吗？').then(_ => {
          this.$http.post(ENV.CPS_HOST_URL + "/auth/return_deposit", {
            token: this.token,
            user_id: +userId,
            game_id: +gameId,
            platform: platform,
          }).then((response) => {
            this.$message.success('退款成功')
            this.getList()
          }, (error) => {
            this.$message.error(error.body)
          })
        })
      },
      auditBanned(userId, userName, gameId, gameName, channelPlatform) {
        this.$confirm('确认终止【' + userName + '】【' + gameName + '】吗？').then(_ => {
          this.$http.post(ENV.CPS_HOST_URL + "/auth/change_Lianyun_status", {
            token: this.token,
            user_id: +userId,
            game_id: +gameId,
            state: 3,
            Platform: channelPlatform
          }).then((response) => {
            this.$message.success('终止成功')
            this.$confirm('是否退还【' + userName + '】【' + gameName + '】的押金？').then(_ => {
              this.$http.post(ENV.CPS_HOST_URL + "/auth/return_deposit", {
                token: this.token,
                user_id: +userId,
                game_id: +gameId,
                platform: channelPlatform,
              }).then((response) => {
                this.$message.success('退款成功')
              }, (error) => {
                this.$message.error(error.body)
              })
              this.getList()
            })
          })
        })
      },
    }
  }
</script>




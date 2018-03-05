<template>
  <div>
    <section class="content-header">
      <h1>
        申领CPS游戏列表<small>申领游戏审核</small>
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
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="一级会长申领" name="first"></el-tab-pane>
            <el-tab-pane label="子会长申领" name="second"></el-tab-pane>
          </el-tabs>
          <table class="table table-bordered table-hover">
            <thead>
              <tr>
                <th>账号</th>
                <th>游戏名</th>
                <th>申领时间</th>
                <th>特殊折扣</th>
                <th>特殊服务费</th>
                <th>审核状态</th>
                <th>审核操作</th>
                <th>修改操作</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
              <td>{{ item.user_name }}</td>
              <td>{{ item.game_name }}</td>
              <td>{{ item.create_time }}</td>
              <td><template v-if="item.discount_status != 0">{{ item.discount }}</template></td>
              <td><template v-if="item.discount_status != 0">{{ item.servicecharge_rate }}</template></td>
              <td>{{ item.status_name }}</td>
              <td>
                <template v-if="item.status == 0 ">
                  <a title="通过" style="cursor:pointer" @click = "auditSuccess(item.user_id, item.user_name, item.game_id, item.game_name)" >通过</a>
                  <span > | </span>
                  <a title="不通过" style="cursor:pointer" @click = "auditFault(item.user_id, item.user_name, item.game_id, item.game_name)" >不通过</a>
                  <a title="不再合作" style="cursor:pointer" @click = "auditBanned(item.user_id, item.user_name, item.game_id, item.game_name)" >不再合作</a>
                </template>
                <template v-if="item.status == 1 ">
                  <a title="终止" style="cursor:pointer" @click = "auditBanned(item.user_id, item.user_name, item.game_id, item.game_name)" >终止</a>
                  <span v-if="item.deposit_status == 0"> | </span>
                  <a v-if="item.deposit_status == 0" title="退押金" style="cursor:pointer" @click = "returnDeposit(item.user_id, item.user_name, item.game_id, item.game_name)" >退押金</a>
                </template>
                <template v-if="item.status == 3 ">
                  <a title="再次合作" style="cursor:pointer" @click = "auditFault(item.user_id, item.user_name, item.game_id, item.game_name)" >再次合作</a>
                </template>
              </td>
              <td>
                <button title="查看" class="btn" @click="openChangeDialog(false, item.game_id, item.user_id)">查看</button>
                <button title="修改" class="btn btn-primary" @click="openChangeDialog(true, item.game_id, item.user_id)">修改</button>
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
    <el-dialog :title="(changeDialog.changeable )? '编辑':'查看'" :visible.sync="changeDialog.visible" >
      <el-form ref="changeDialog.form" :model="changeDialog.form" label-width="125px">
        <el-form-item  label="登录开关"  >
            <el-select v-model="changeDialog.form.loginStatus" :disabled="changeDialog.changeable ? false : true">
              <el-option key="0" label="不限制" value="0" ></el-option>
              <el-option key="1" label="关闭登录" value="1" ></el-option>
              <el-option key="2" label="关闭新增" value="2" ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="充值开关" >
          <el-select v-model="changeDialog.form.rechargeStatus" :disabled="changeDialog.changeable ? false : true">
            <el-option key="0" label="开启" value="0" ></el-option>
            <el-option key="1" label="关闭" value="1" ></el-option>
          </el-select>
        </el-form-item>
        <template v-if="activeName == 'first'">
          <el-form-item label="游戏折扣">
            <span>{{ changeDialog.form.gameDiscount }}</span>
          </el-form-item>
          <el-form-item label="是否开启特殊折扣">
            <el-switch v-model="changeDialog.form.discountStatus" :disabled="changeDialog.changeable ? false : true" style="width:50px;" ></el-switch>
          </el-form-item>
          <el-form-item label="特殊折扣" v-show="changeDialog.form.discountStatus">
            <el-input v-model="changeDialog.form.discount" type="number" :disabled="changeDialog.changeable ? false : true" ></el-input>
          </el-form-item>
          <el-form-item label="特殊服务费" v-show="changeDialog.form.discountStatus">
            <el-input v-model="changeDialog.form.serviceChargeRate" type="number" :disabled="changeDialog.changeable ? false : true" ></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div v-show="changeDialog.changeable" slot="footer" class="dialog-footer">
        <el-button @click="closeChangeDialog">取 消</el-button>
        <el-button type="primary" @click="changeSummit">确 定</el-button>
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
        changeDialog: {
          visible: false,
          changeable: false,
          form: {
            gameId: 0,
            userId: 0,
            loginStatus: '0', //0无限制，1关闭新增，2关闭登录
            discount: 0,    //特殊折扣
            serviceChargeRate: 0, //特殊服务费
            discountStatus: false,    //特殊折扣开关 0/false关闭 1/true开启
            gameDiscount: 0,    //游戏折扣
            gameServiceChargeRate: 0, //游戏服务费
            rechargeStatus: '0',    //充值状态 0不限制 1开启
          }
        },
        activeName: 'first',
        page: 1,
        per_page: 15,
        total:0,
        items:[],
        token:'',
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
        params:{
          start_time: '',
          status: '',
          end_time: '',
          user_name: '',
          game_name: ''
        }
      }
    },
    mounted: function() {
      this.token = sessionStorage.getItem("token")
      this.getList()
    },
    methods: {
      changeSummit () {
        let active = (this.activeName == "first") ? 1 : 2
        let formData = new FormData()
        formData.append("token", this.token)
        formData.append("game_id", this.changeDialog.form.gameId)
        formData.append("user_id", this.changeDialog.form.userId)
        formData.append("login_status", this.changeDialog.form.loginStatus)
        formData.append("discount", this.changeDialog.form.discount)
        formData.append("service_charge_rate", this.changeDialog.form.serviceChargeRate)
        formData.append("discount_status", this.changeDialog.form.discountStatus? 1 : 0)
        formData.append("recharge_status", this.changeDialog.form.rechargeStatus)
        formData.append("active", active)
        this.$http.put(ENV.CPS_HOST_URL + "/channel_game/change_channel_game",formData).then(response => {
          this.closeChangeDialog()
          this.$message.success("修改成功")
        }, (error) => {
          this.$message.error(error.body)
        })
      },
      openChangeDialog(changeable, gameId, userId) {
        this.changeDialog.form.gameId = gameId
        this.changeDialog.form.userId = userId
        this.getGameChangeInfo()
        this.changeDialog.changeable = changeable
        this.changeDialog.visible = true
      },
      closeChangeDialog() {
        this.changeDialog.form.gameId = 0
        this.changeDialog.form.userId = 0
        this.changeDialog.form.loginStatus = '0'
        this.changeDialog.form.discount = 0
        this.changeDialog.form.discountStatus = false
        this.changeDialog.form.gameDiscount = 0
        this.changeDialog.form.rechargeStatus = '0'
        this.changeDialog.form.serviceChargeRate = 0
        this.changeDialog.form.gameServiceChargeRate = 0
        this.changeDialog.changeable = false
        this.changeDialog.visible = false
      },
      getGameChangeInfo () {
        let active = (this.activeName == "first") ? 1 : 2
        this.$http.get(ENV.CPS_HOST_URL + "/channel_game/channel_game_info",
          {params: { token: this.token, game_id: this.changeDialog.form.gameId,
            user_id: this.changeDialog.form.userId, active: active}}
        ).then(response => {
          let data = response.body
          this.changeDialog.form.discount = data.discount
          this.changeDialog.form.gameDiscount = data.gameDiscount
          this.changeDialog.form.loginStatus = data.loginStatus + ""
          this.changeDialog.form.discountStatus = (data.discountStatus === 1) ? true : false
          this.changeDialog.form.rechargeStatus = data.rechargeStatus + ""
          this.changeDialog.form.serviceChargeRate = data.serviceChargeRate
          this.changeDialog.form.gameServiceChargeRate = data.gameServiceChargeRate
        }, (error) => {
          this.$message.error(error.body)
        })
      },
      handleClick() {
        this.getList()
      },
      getList() {
        this.$http.get(ENV.CPS_HOST_URL + "/auth/work_apply_game_list",
          {params: { token: this.token, page: this.page, per_page: this.per_page,
            start_time: this.params.start_time / 1000, end_time: this.params.end_time / 1000,
            user_name: this.params.user_name, game_name: this.params.game_name, status: this.params.status,
            active_name: this.activeName}
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
      onSubmit () {
        this.getList()
      },
      onCurrentChange (currentPage) {
        this.page = currentPage
        this.getList()
      },
      auditSuccess (userId, userName, gameId, gameName) {
        this.$confirm('确认通过【'+userName+'】【'+gameName+'】吗？').then(_ => {
          this.$http.post(ENV.CPS_HOST_URL + "/auth/change_game_status?active="+this.activeName, {token:this.token, user_id: +userId, game_id: +gameId, status:1}).then((response) => {
            this.$message.success('通过成功')
            this.getList()
          }, (error) => {
            this.$message.error(error.body)
          })
        })
      },
      auditFault (userId, userName, gameId, gameName) {
        this.$confirm('确认不通过【'+userName+'】【'+gameName+'】吗？').then(_ => {
          this.$http.post(ENV.CPS_HOST_URL + "/auth/change_game_status?active="+this.activeName, {token:this.token, user_id: +userId, game_id: +gameId, status:2}).then((response) => {
            this.$message.success('不通过成功')
            this.getList()
          }, (error) => {
            this.$message.error(error.body)
          })
        })
      },
      auditReset (userId, userName, gameId, gameName) {
        this.$confirm('确认重新审核【'+userName+'】【'+gameName+'】吗？').then(_ => {
          this.$http.post(ENV.CPS_HOST_URL + "/auth/change_game_status?active="+this.activeName, {token:this.token, user_id: +userId, game_id: +gameId, status:0}).then((response) => {
            this.$message.success('重置成功')
            this.getList()
          }, (error) => {
            this.$message.error(error.body)
          })
        })
      },
      returnDeposit(userId, userName, gameId, gameName) {
        this.$confirm('确认退还【'+userName+'】【'+gameName+'】的押金吗？').then(_ => {
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
      auditBanned (userId, userName, gameId, gameName) {
        this.$confirm('确认终止【'+userName+'】【'+gameName+'】吗？').then(_ => {
          this.$http.post(ENV.CPS_HOST_URL + "/auth/change_game_status?active="+this.activeName, {token:this.token, user_id: +userId, game_id: +gameId, status: 3}).then((response) => {
            this.$message.success('终止成功')
            this.$confirm('是否退还【'+userName+'】【'+gameName+'】的押金？').then(_ => {
              this.$http.post(ENV.CPS_HOST_URL + "/auth/return_deposit", {
                token: this.token,
                user_id: +userId,
                game_id: +gameId
              }).then((response) => {
                this.$message.success('退款成功')
              }, (error) => {
                this.$message.error(error.body)
              })
            })
            this.getList()
          })
        })
      }
    }
  }
</script>

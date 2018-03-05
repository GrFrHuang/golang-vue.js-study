<template>
  <div>
    <div>
      <section class="content-header">
        <h1>
          QQ信息记录<small>QQ信息记录查看</small>
        </h1>
      </section>
      <div class="content">
        <div class="box">
          <div class="box-header with-border">
            <el-form :inline="true" class="demo-form-inline" >
              <el-form-item label="QQ号">
                <el-input  v-model="params.Qq" placeholder="请输入QQ号"></el-input>
              </el-form-item>
              <el-form-item label="确认状态">
                <el-select v-model="params.game_name" clearable placeholder="请选择">
                  <el-option
                    v-for="item in onStatus"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="提交时间">
                  <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择开始日期" v-model="params.CreateTime" style="width: 100%;"></el-date-picker>
                  </el-col>
                  <span style="display: block; float: left"> - </span>
                  <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择结束日期" v-model="params.end_time_1" style="width: 100%;"></el-date-picker>
                  </el-col>
              </el-form-item>
              <el-form-item label="确认时间">
                  <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择开始日期" v-model="params.ConfirmTime" style="width: 100%;"></el-date-picker>
                  </el-col>
                  <span style="display: block; float: left"> - </span>
                  <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择结束日期" v-model="params.end_time_2" style="width: 100%;"></el-date-picker>
                  </el-col>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
              </el-form-item>
              <el-form-item v-if="this.activeName === 'RechargeConfirmation'">
                <el-button type="primary" @click="onSubmits">提高Q币充值额度申请</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="box-body">
            <el-tabs v-model="activeName" type="card" @tab-click="tabChange">
              <template v-if="QQConfirmedShow">
                <el-tab-pane label="QQ确认" name="QQConfirmed">
                  <QQConfirmed :editId="editId" ref="editUser"></QQConfirmed>
                </el-tab-pane>
              </template>
              <template v-if="RechargeConfirmationShow">
              <el-tab-pane label="充值确认" name="RechargeConfirmation">
                <RechargeConfirmation :editId="editId"  ref="oneditUser"></RechargeConfirmation>
              </el-tab-pane>
              </template>
              <template v-if="GameRechargeShow">
              <el-tab-pane label="游戏充值" name="GameRecharge">
                <GameRecharge :editId="editId"  ref="editUsers"></GameRecharge>
              </el-tab-pane>
              </template>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="提高Q币充值额度申请"
      :visible.sync="onSubmitsa"
      size="tiny">
      <el-input type="number" v-model="QBQuota" placeholder="请输入Q币数量"></el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="onSubmitsa = false">取 消</el-button>
    <el-button type="primary" @click="onSub(QBQuota)">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
  import QQConfirmed from '../SignInToReview/QQConfirmed.vue'
  import RechargeConfirmation from '../SignInToReview/RechargeConfirmation.vue'
  import GameRecharge from '../SignInToReview/GameRecharge.vue'
  import {mapState} from 'vuex'

  export default {
    computed: {
        ...mapState({
            mapIsAdmin: ({userInfo}) => userInfo.isAdmin,
        }),
    },
    components: {
      QQConfirmed,
      RechargeConfirmation,
      GameRecharge,
    },
    data: function () {
      return {
        activeName: "QQConfirmed",
        onStatus: [{
          id: '1',
          name: '成功'
        }, {
          id: '2',
          name: '失败'
        }, {
          id: '0',
          name: '未审核'
        }],
        params: {
          CreateTime: '',
          ConfirmTime: '',
          end_time_2: '',
          end_time_1: '',
          Qq: '',
          game_name: '',
        },
        editId: {},
        onSubmitsa: false,
        token: '',
        QBQuota: '',
        QQConfirmedShow: false,
        RechargeConfirmationShow: false,
        GameRechargeShow: false,
      }
    },
    methods: {
      tabChange() {
        this.params.game_name = ''
        if (this.activeName === 'QQConfirmed') {
          this.onStatus = [{
            id: '1',
            name: '通过'
          }, {
            id: '2',
            name: '拒绝通过'
          }, {
            id: '0',
            name: '未审核'
          }]
          this.$refs.editUser.getList()
        } else if (this.activeName === 'RechargeConfirmation') {
          this.onStatus = [{
            id: '1',
            name: '已充值'
          }, {
            id: '2',
            name: '充值失败'
          }, {
            id: '0',
            name: '未充值'
          }, {
            id: '3',
            name: '充值中'
          }]
          this.$refs.oneditUser.getList()
        } else if (this.activeName === 'GameRecharge') {
          this.onStatus = [{
            id: '1',
            name: '已确认'
          }, {
            id: '0',
            name: '未确认'
          }]
          this.$refs.editUsers.getList()
        }
      },
      onSubmit() {
        this.editId = {}
        this.editId = this.params
        if (this.activeName === 'QQConfirmed') {
          this.$refs.editUser.getList()
        } else if (this.activeName === 'RechargeConfirmation') {
          this.$refs.oneditUser.getList()
        } else if (this.activeName === 'GameRecharge') {
          this.$refs.editUsers.getList()
        }
      },
      onSubmits() {
        this.onSubmitsa = true
      },
      onSub(v) {
        if(!v||isNaN(v)){
          this.$message.error('请输入数字！')
          return false
        } else if(v<0){
          this.$message.error('请输入一个大于0的数字！')
          return false
        } else if(String(v).indexOf(".")>-1) {
          this.$message.error('请输入整数！')
          return false
        } else {
          this.$http.post(ENV.CPS_HOST_URL + "/qq_recharge_agency/apply_amount", {
            token: this.token,
            Amount: parseInt(v)
          }).then((response) => {
            this.$message.success('操作成功')
            this.onSubmitsa = false
          }, (error) => {
            this.$message.error(error.body)
            this.onSubmitsa = false
          })
        }
      },
      getRole() {
          if (this.mapIsAdmin) {
              this.QQConfirmedShow = true
              this.RechargeConfirmationShow = true
              this.GameRechargeShow = true
          } else {
              var cnodeBaseInfo = window.localStorage.getItem('cnodeBaseInfo')
              if (cnodeBaseInfo != "") {
                  var data = JSON.parse(cnodeBaseInfo)
                  var roles = data.info.role_ids
                  if (roles.indexOf("63") != -1) {
                      this.QQConfirmedShow = true
                  }
                  if (roles.indexOf("64") != -1) {
                      if (!this.QQConfirmedShow) {
                          this.activeName = "RechargeConfirmation"
                      }
                      this.RechargeConfirmationShow = true
                  }
                  if (roles.indexOf("65") != -1) {
                      if (!this.RechargeConfirmationShow && !this.QQConfirmedShow) {
                          this.activeName = "GameRecharge"
                      }
                      this.GameRechargeShow = true
                  }
              }
          }
      }
    },
    mounted: function () {
      this.token = sessionStorage.getItem("token")
      this.getRole()
      this.editId = this.params
      // this.$refs.editUser.getList()
    },
  }
</script>

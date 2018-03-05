<template>
  <div>
    <section class="content-header">
      <h1>
        充值记录管理
      </h1>
    </section>
    <div class="content">
      <div class="box">
        <el-tabs v-model="activeName">
          <el-tab-pane label="会长自充数据" name="first">
            <div class="box-header with-border">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="账号">
                  <el-input v-model="params.user_name" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item label="日期">
                  <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择开始日期" v-model="params.start_time"
                                    style="width: 100%;"></el-date-picker>
                  </el-col>
                  <span style="display: block; float: left"> - </span>
                  <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择结束日期" v-model="params.end_time"
                                    style="width: 100%;"></el-date-picker>
                  </el-col>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
              </el-form>
              <p>汇总：总充值金额：{{ sum }}</p>
            </div>
            <div class="box-body">
              <table class="table table-bordered table-hover">
                <thead>
                <tr>
                  <th>充值账号</th>
                  <th>流水号</th>
                  <th>充值金额</th>
                  <th>充值时间</th>
                  <th>充值方式</th>
                  <th>充值状态</th>
                  <th>账户属性</th>
                  <th>是否要开发票</th>
                  <th>发票状态</th>
                  <!--<th>备注</th>-->
                  <th>确认充值</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in items">
                  <td>{{ item.user_name }}</td>
                  <td>{{ item.third_no }}</td>
                  <td>{{ item.amount }}</td>
                  <td>{{ item.pay_time | stampToTimeFull}}</td>
                  <td>
                    <template v-if="item.pay_type == 1 || item.pay_type == 4">支付宝</template>
                    <template v-else-if="item.pay_type == 7">银行卡</template>
                    <template v-else>微信</template>
                  </td>
                  <td>
                    <template v-if="item.order_status == 1">正在支付</template>
                    <template v-if="item.order_status == 2">交易成功</template>
                    <template v-if="item.order_status == 3">交易关闭(超时未支付)</template>
                    <template v-if="item.order_status == 4">订单关闭</template>
                  </td>
                  <td>
                    <template v-if="item.private_status == 1">对公</template>
                    <template v-else>对私</template>
                  </td>
                  <td>
                    <template v-if="item.invoice_status != 2">开</template>
                    <template v-else>不开</template>
                  </td>
                  <td>
                    <template v-if="item.invoice_status == 1 && (item.order_status == 1 || item.order_status == 2)">
                      <button class="btn btn-primary" @click="changeInvoiceStatus(item.id, 3)">开发票</button>
                      <button class="btn btn-error" @click="openRefuseDialog(item.id)">拒绝</button>
                    </template>
                    <template v-else-if="item.invoice_status == 3">已开发票</template>
                    <template v-else-if="item.invoice_status == 4">
                      <div>[拒绝]</div>
                      <div>{{ item.invoice_desc }}</div>
                    </template>
                    <template v-else></template>
                  </td>
                  <!--<td>{{ item.invoice_desc }}</td>-->
                  <td>
                    <template v-if="item.pay_type == 7 && item.order_status == 1">
                      <button class="btn btn-primary" @click="confirmPay(item.id, 2)">确认</button>
                    </template>
                    <template v-if="item.pay_type == 7 && item.order_status == 1 || item.order_status == 3">
                      <button class="btn btn-primary" @click="confirmPay(item.id, 4)">关闭</button>
                    </template>
                  </td>
                </tr>
                </tbody>
              </table>
              <el-pagination
                v-show="total > per_page"
                @current-change="onCurrentChange"
                :current-page.sync="page"
                :page-size="per_page"
                :total="total"
                layout="prev, pager, next, jumper">
              </el-pagination>
            </div>
            <el-dialog
              title="编辑信息"
              v-model="refuseDialog"
              top="5%"
              size="small"
              :close-on-click-modal="false">
              <div @close="closeRefuseDialog" class="box">
                <div class="box-header with-border">
                  <div class="col-md-8 form-horizontal">
                    <div class="form-group">
                      <div>
                        <p>备注：
                          <el-input type="textarea" v-model="refuseForm.desc" placeholder="请输入备注信息"></el-input>
                        </p>
                      </div>
                    </div>
                    <div class="col-sm-10">
                      <el-button type="primary" :disabled=disable @click="refuseConfirm">确定</el-button>
                      <el-button @click="closeRefuseDialog" type="primary">取消</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="给代理充值数据" name="second">
            <cps-channel-recharge></cps-channel-recharge>
          </el-tab-pane>
          <el-tab-pane label="给玩家充值数据" name="third">
            <cps-player-recharge></cps-player-recharge>
          </el-tab-pane>
          <el-tab-pane label="给玩家充值Q币" name="QB">
            <cps_player_cpst_recharge></cps_player_cpst_recharge>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
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
  import CpsChannelRecharge from "./cps_channel_recharge"
  import CpsPlayerRecharge from "./cps_player_recharge"
  import cps_player_cpst_recharge from "./cps_player_cpst_recharge"

  export default {
    data: function () {
      return {
        activeName: "first",
        refuseDialog: false,
        refuseForm: {
          id: '',
          status: '',
          desc: '',
        },
        page: 1,
        per_page: 15,
        total: 0,
        disable: false,
        items: [],
        token: '',
        sum: '',
        userName: "",
        params: {
          start_time: '',
          end_time: '',
          user_name: ''
        }
      }
    },
    components: {
      CpsChannelRecharge,
      cps_player_cpst_recharge,
      CpsPlayerRecharge
    },
    mounted: function () {
      this.token = sessionStorage.getItem("token")
      this.getRechargeLogList()
    },
    methods: {
      closeRefuseDialog() {
        this.refuseForm.id = ''
        this.refuseForm.status = ''
        this.refuseForm.desc = ''
        this.refuseDialog = false
      },
      openRefuseDialog(id) {
        this.refuseForm.id = id
        this.refuseForm.status = 4
        this.refuseForm.desc = ''
        this.refuseDialog = true
      },
      refuseConfirm() {
        let formData = new FormData()
        formData.append("token", this.token)
        formData.append("id", this.refuseForm.id)
        formData.append("status", this.refuseForm.status)
        formData.append("desc", this.refuseForm.desc)
        this.$http.put(ENV.CPS_HOST_URL + "/recharge/change_invoice_status", formData).then((response) => {
          this.$message.success('修改成功')
          this.getRechargeLogList()
          this.closeRefuseDialog()
        }, (error) => {
          this.$message.error(error.body)
        })
      },
      changeInvoiceStatus(id, status) {
        let formData = new FormData()
        formData.append("token", this.token)
        formData.append("id", id)
        formData.append("status", status)
        this.$http.put(ENV.CPS_HOST_URL + "/recharge/change_invoice_status", formData).then((response) => {
          this.$message.success('修改成功')
          this.getRechargeLogList()
        }, (error) => {
          this.$message.error(error.body)
        })
      },
      confirmPay(id, status) {
        this.$confirm('该操作将会给会长充值, 确认会长已经付钱了吗？').then(_ => {
          let formData = new FormData()
          formData.append("token", this.token)
          formData.append("id", id)
          formData.append("status", status)
          this.$http.put(ENV.CPS_HOST_URL + "/recharge/confirm_pay", formData).then((response) => {
            this.$message.success("确认成功")
            this.getRechargeLogList()
          }, (error) => {
            this.$message.error(error.body)
          })
        })
      },
      getRechargeLogList() {
        console.log(this.params.end_time / 1000)
        var end_time
        if (this.params.end_time !== '') {
          end_time = parseInt(new Date(new Date(this.params.end_time).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000)
        } else {
          end_time = ''
        }
        this.$http.get(ENV.CPS_HOST_URL + "/recharge/rechargelog4w",
          {
            params: {
              token: this.token, page: this.page, per_page: this.per_page,
              start_time: this.params.start_time / 1000, end_time: end_time,
              user_name: this.params.user_name
            }
          }
        ).then(response => {
          this.items = response.body.data
          this.sum = response.body.sum[0]['SUM(amount)']
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
        this.getRechargeLogList()
      },
      onCurrentChange() {
        this.getRechargeLogList()
      }
    }
  }
</script>

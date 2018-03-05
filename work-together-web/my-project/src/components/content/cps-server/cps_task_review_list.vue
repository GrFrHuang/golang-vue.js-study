<template>
  <div>
    <section class="content-header">
      <h1>
        代充任务审核
        <small>代充任务审核列表</small>
      </h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="订单号">
              <el-input v-model="params.OrderNo" placeholder="请输入订单号"></el-input>
            </el-form-item>
            <!--<el-form-item label="提现方式">-->
              <!--<el-select v-model="params.from" :clearable="true"-->
                         <!--filterable placeholder="提现方式">-->
                <!--<el-option :value=params.zero label="所有"></el-option>-->
                <!--<el-option-->
                  <!--v-for="item in params.collamode"-->
                  <!--:key="item.key"-->
                  <!--:label="item.value"-->
                  <!--:value="item.key">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item label="提交时间">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="开始时间" v-model="params.start_time"
                                style="width: 100%;"></el-date-picker>
              </el-col>
              <span style="display: block; float: left"> - </span>
              <el-col :span="11">
                <el-date-picker type="date" placeholder="结束时间" v-model="params.end_time"
                                style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="box-body">
          <table class="table table-bordered table-hover">
            <thead>
            <tr>
              <th>游戏名称</th>
              <th>订单号</th>
              <th>订单金额</th>
              <th>提交时间</th>
              <th>充值状态</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
              <td>{{ item.GameName }}</td>
              <td>{{ item.OrderNo }}</td>
              <td>{{ item.Money }}</td>
              <td>{{ item.CreateTime | stampToTimeFull }}</td>
              <td>
                <p v-if="item.Status == 1">完成</p>
                <p
                  v-else-if="item.Status == 2">
                  失败</p>
                <p v-else>进行中</p>
              </td>
              <td>
                <template>
                  <!--<a title="通过" style="cursor:pointer" @click = "auditSuccess(item.Id, 2)" >通过</a>-->
                  <!--<span > | </span>-->
                  <!--<a title="不通过" style="cursor:pointer" @click = "auditSuccess(item.Id, 3)" >不通过</a>-->
                  <!--<span > | </span>-->
                  <a title="编辑订单" style="cursor:pointer" @click="editAuditSuccess(item.OrderNo, item.GameId)">编辑订单</a>
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
      title="编辑子订单"
      :visible.sync="onInvoiceImg"
      size="large">
      <el-table :data="checkOrder">
        <el-table-column property="Service" align="center" label="区服"></el-table-column>
        <el-table-column property="Money" min-width="100" align="center" label="订单金额"></el-table-column>
        <el-table-column property="Qq" min-width="100" align="center" label="任务QQ"></el-table-column>
        <el-table-column min-width="100" align="center" v-for="(time, index) in game_Grade" :key="time.Id"
                         :label="'档次'+ time.Money">
          <template slot-scope="scope">
            <p v-for="(itemse, index) in scope.row.TaskGearMap" v-if="time.Id == itemse.AioGameGearId">
              {{itemse.Count}}</p>
          </template>
        </el-table-column>
        <el-table-column property="" min-width="100" align="center" label="新增/留存">
          <template scope="scope">
            <p v-if="scope.row.From === 0">新增</p>
            <p v-if="scope.row.From === 1">留存</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.Status == 2">完成</p>
            <p v-else>进行中</p>
          </template>
        </el-table-column>
        <el-table-column label="编辑" align="center">
          <template slot-scope="scope">
            <el-button  v-if="scope.row.Status === 0" size="small" @click="editOrder(scope.row.Id, scope.row.OrderNo, scope.row.GameId)">
              开始
            </el-button>
            <el-button v-if="(scope.row.QqStatus === 0 || (scope.row.QqStatus !== 101 && scope.row.QqStatus !== 102)) && scope.row.Status === 1" size="small" @click="editWithChange(scope.row.Id, scope.row.OrderNo, scope.row.GameId)">
              跟换QQ号
            </el-button>
            <el-button v-if="(scope.row.QqStatus === 0 || (scope.row.QqStatus !== 101 && scope.row.QqStatus !== 102)) && scope.row.Status === 1" size="small" @click="editRecharge(scope.row.Id, scope.row.OrderNo, scope.row.GameId)">
              给QQ充值
            </el-button>
            <el-button v-if="scope.row.QqStatus === 101 && scope.row.Status === 1"  size="small" @click="editschedule(scope.row.Id, scope.row.OrderNo, scope.row.GameId)">
              完成
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
    <el-button @click="onInvoiceImg = false">关 闭</el-button>
  </span>
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
        page: 1,
        per_page: 15,
        total: 0,
        items: [],
        token: '',
        game_Grade: null,
        checkOrder: null,
        onInvoiceImg: false,
        params: {
          start_time: '',
          end_time: '',
          // from: '',
          // zero: 0,
          OrderNo: '',
          // collamode: [{"key": 1, "value": "银行卡"}, {"key": 2, "value": "支付宝"}],
        }
      }
    },
    mounted: function () {
      this.token = sessionStorage.getItem("token")
      this.getList()
    },
    methods: {
      handleClick() {
        this.getList()
      },
      editOrder(v, OrderNo, dameid) {
        this.$http.put(ENV.CPS_HOST_URL_CARGE + '/recharge_task/' + v).then((response) => {
          this.$message.success('操作成功')
          this.editAuditSuccess(OrderNo, dameid)
        }, error => {
          this.$message.error(error.bodyText)
        })
      },
      editWithChange(v, OrderNo, dameid) {
        this.$http.post(ENV.CPS_HOST_URL_CARGE + '/recharge_task/change_task_qq?id=' + v).then((response) => {
          this.$message.success('操作成功')
          this.editAuditSuccess(OrderNo, dameid)
        }, error => {
          this.$message.error(error.bodyText)
        })
      },
      editRecharge(v, OrderNo, dameid) {
        this.$http.post(ENV.CPS_HOST_URL_CARGE + '/recharge_task/recharge_qq?id=' + v).then((response) => {
          this.$message.success('操作成功')
          this.editAuditSuccess(OrderNo, dameid)
        }, error => {
          this.$message.error(error.bodyText)
        })
      },
      editschedule(v, OrderNo, dameid) {
        this.$http.get(ENV.CPS_HOST_URL_CARGE + '/recharge_task/change_status?id=' + v + '&status=2').then((response) => {
          this.$message.success('操作成功')
          this.editAuditSuccess(OrderNo, dameid)
        }, error => {
          this.$message.error(error.bodyText)
        })
      },
      getList() {
        let start_time,end_time
        if (this.params.start_time !== '') {
          start_time = this.params.start_time / 1000
        } else {
          start_time = ''
        }
        if (this.params.end_time !== '') {
          end_time = this.params.end_time / 1000
        } else {
          end_time = ''
        }
        this.$http.get(ENV.CPS_HOST_URL_CARGE + "/agency_order/get_agency_order",
          // {params: { token: this.token, page: this.page, per_page: this.per_page,
          //   start_time: this.params.start_time / 1000, end_time: this.params.end_time / 1000,
          //   withdraw_way: this.params.from, user_name: this.params.id,}
          // }
          {
            params: {page: this.page, per_page: this.per_page,start_time:start_time ,
              end_time:end_time, order_no: this.params.OrderNo}
          }
        ).then(response => {
          console.log(response)
          this.items = response.body.data
          this.total = response.body.total
        }).then(error => {
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
      editAuditSuccess(v, gameid) {
        this.onInvoiceImg = true
        this.$http.get(ENV.CPS_HOST_URL_CARGE + '/game_gear/get_gear_with_del_by_id?game_id=' + gameid).then((response) => {
          this.game_Grade = response.data
        }, error => {
          this.$message.error(error)
        })
        this.$http.get(ENV.CPS_HOST_URL_CARGE + '/recharge_task/get_recharge_task_by_order_on/' + v).then((response) => {
          this.checkOrder = response.data
        }, error => {
          this.$message.error(error)
        })
      },
      auditSuccess(Id, status) {
        if (status === 2) {
          this.$confirm('确认通过吗？').then(_ => {
            this.$http.put(ENV.CPS_HOST_URL_CARGE + "/withdraw/verify_withdraw?token=" + this.token + "&id=" + Id + "&status=" + status).then((response) => {
              this.$message.success('审核成功')
              this.getList()
            }).then((error) => {
              this.$message.error(error)
            })
          })
        } else if (status === 3) {
          this.$confirm('确认不通过吗？').then(_ => {
            this.$http.put(ENV.CPS_HOST_URL_CARGE + "/withdraw/verify_withdraw?token=" + this.token + "&id=" + Id + "&status=" + status).then((response) => {
              this.$message.success('审核成功')
              this.getList()
            }).then((error) => {
              this.$message.error(error)
            })
          })
        }
      }
    }
  }
</script>

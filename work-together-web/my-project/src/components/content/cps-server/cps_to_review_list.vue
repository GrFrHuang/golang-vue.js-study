<template>
  <div>
    <section class="content-header">
      <h1>
        提现审核<small>提现审核列表</small>
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
            <el-form-item label="用户名">
              <el-input  v-model="params.id" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="提现方式">
              <el-select v-model="params.from" :clearable="true"
                         filterable placeholder="提现方式">
                <el-option :value=params.zero label="所有"></el-option>
                <el-option
                  v-for="item in params.collamode"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提现申请时间">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="申请开始时间" v-model="params.start_time" style="width: 100%;"></el-date-picker>
              </el-col>
              <span style="display: block; float: left"> - </span>
              <el-col :span="11">
                <el-date-picker type="date" placeholder="申请结束时间" v-model="params.end_time" style="width: 100%;"></el-date-picker>
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
              <th>编号</th>
              <th>银行用户名</th>
              <th>提现金额</th>
              <th>实际到帐金额</th>
              <th>手续费</th>
              <th>提现方式</th>
              <th>开户银行</th>
              <th>提现状态</th>
              <th>提现账号</th>
              <th>是否开发票</th>
              <th>发票</th>
              <th>提现申请时间</th>
              <th>打款时间</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
              <td>{{ item.Id }}</td>
              <td>{{ item.WithdrawUserName }}</td>
              <td>{{ item.Amount }}</td>
              <td>{{ item.TrueAmount }}</td>
              <td>{{ item.ServiceCharge }}</td>
              <td v-if="item.WithdrawWay === 1 ">银行卡</td>
              <td v-if="item.WithdrawWay === 2 ">支付宝</td>
              <td v-if="item.BankInfo !== null && item.BankInfo !== ''">{{ item.BankInfo.Name }}</td>
              <td v-else></td>
              <td v-if="item.WithdrawStatus === 1 ">未审核</td>
              <td v-if="item.WithdrawStatus === 2 ">已通过</td>
              <td v-if="item.WithdrawStatus === 3 ">未通过</td>
              <td>{{ item.WithdrawAccount }}</td>
              <td>
                <template v-if="item.InvoiceStatus === 0">不开</template>
                <template v-else>开</template>
              </td>
              <td>
                <a @click="InvoiceImg(item.Invoice)"><img style="width: 50px;height: 50px" :src="item.Invoice" alt=""></a>
              </td>
              <td>{{ item.CreateTime | stampToTimeFull }}</td>
              <td>{{ item.PayTime | stampToTimeFull }}</td>
              <td>
                <template v-if="item.WithdrawStatus == 1 ">
                  <a title="通过" style="cursor:pointer" @click = "auditSuccess(item.Id, 2)" >通过</a>
                  <span > | </span>
                  <a title="不通过" style="cursor:pointer" @click = "auditSuccess(item.Id, 3)" >不通过</a>
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
      title="查看发票"
      :visible.sync="onInvoiceImg"
      width="70%">
      <img style="width: 100%" :src="InvoiceImgs">
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
        total:0,
        items:[],
        token:'',
        InvoiceImgs:'',
        onInvoiceImg:false,
        params:{
          start_time: '',
          end_time: '',
          from: '',
          zero: 0,
          id: '',
          collamode: [{"key":1,"value":"银行卡"},{"key":2,"value":"支付宝"}],
        }
      }
    },
    mounted: function() {
      this.token = sessionStorage.getItem("token")
      this.getList()
    },
    methods: {
      handleClick() {
        this.getList()
      },
      InvoiceImg (v) {
        this.onInvoiceImg = true
        this.InvoiceImgs = v
      },
      getList() {
        this.$http.get(ENV.CPS_HOST_URL + "/withdraw/WT_withdraw_list",
          {params: { token: this.token, page: this.page, per_page: this.per_page,
            start_time: this.params.start_time / 1000, end_time: this.params.end_time / 1000,
            withdraw_way: this.params.from, user_name: this.params.id,}
          }
        ).then(response => {
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
      onSubmit () {
        this.getList()
      },
      onCurrentChange (currentPage) {
        this.page = currentPage
        this.getList()
      },
      auditSuccess (Id, status) {
        if (status === 2) {
          this.$confirm('确认通过吗？').then(_ => {
            this.$http.put(ENV.CPS_HOST_URL + "/withdraw/verify_withdraw?token=" + this.token + "&id=" + Id + "&status=" + status).then((response) => {
              this.$message.success('审核成功')
              this.getList()
            }).then((error) => {
              this.$message.error(error)
            })
          })
        } else if (status === 3) {
          this.$confirm('确认不通过吗？').then(_ => {
            this.$http.put(ENV.CPS_HOST_URL + "/withdraw/verify_withdraw?token=" + this.token + "&id=" + Id + "&status=" + status).then((response) => {
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

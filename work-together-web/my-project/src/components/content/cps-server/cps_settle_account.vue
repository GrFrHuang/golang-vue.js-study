<template>
  <div>
    <section class="content-header">
      <h1>结算账单</h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="账单号">
              <el-input v-model="params.settle_no" placeholder="帐单号"></el-input>
            </el-form-item>
            <el-form-item label="扩展信息">
              <el-input v-model="params.extend" placeholder="扩展信息"></el-input>
            </el-form-item>
            <el-form-item label="结算状态">
              <el-select v-model="params.settle_status" placeholder="请选择结算状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="未核算" value="0"></el-option>
                <el-option label="未结算" value="1"></el-option>
                <el-option label="结算中" value="2"></el-option>
                <el-option label="已结算" value="3"></el-option>
                <el-option label="结算失败" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="结算周期">
              <el-col :span="22">
                <el-date-picker
                  v-model="start_time"
                  type="daterange"
                  range-separator="至"
                  placeholder="选择时间范围">
                </el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="账号">
              <el-select v-model="params.user_id" clearable filterable remote :remote-method="fUserSearch"
                         placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in cdruserlist" :key="item.UserId" :label="item.UserName"
                           :value="item.UserId"></el-option>
                <el-pagination v-if="onuser.total > 20 "
                               small layout="prev, pager, next"
                               :page-size="20"
                               :total="onuser.total"
                               :current-page.sync="onuser.page"
                               @current-change="fUserCurrentChange">
                </el-pagination>
              </el-select>
            </el-form-item>
            <el-form-item label="合作模式">
              <el-select v-model="params.distinct_cooperation" placeholder="请选择结算状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="CPSA" value="1"></el-option>
                <el-option label="CPSG" value="2"></el-option>
                <el-option label="CPSO" value="4"></el-option>
                <el-option label="CPSD" value="5"></el-option>
                <el-option label="CPST" value="3"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submit">查询</el-button>
              <el-button type="primary" @click="onsubmit_excel">导出excel</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="box-body">
          <table class="table table-bordered table-hover">
            <thead>
            <tr>
              <th>帐单号</th>
              <th>结算周期</th>
              <th>结算金额</th>
              <th>流水</th>
              <th>申请时间</th>
              <th>成功时间</th>
              <th>扩展信息</th>
              <th>结算状态</th>
              <th>合作模式</th>
              <th>到帐人</th>
              <th>实际账单人</th>
              <th>支付类型</th>
              <th>游戏名</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in accounts.data">
              <td>{{ item.SettleAccountNo }}</td>
              <td>{{ item.SettleAccountPeriod }}</td>
              <td>{{ item.SeparateInput }}</td>
              <td>{{ item.SettlementFlow }}</td>
              <td>{{ item.CreateTime | stampToTimeFull }}</td>
              <td>{{ item.SuccessTime | stampToTimeFull }}</td>
              <td>{{ item.Extend }}</td>
              <td>
                <template v-if="item.SettleStatus == 0">未核算</template>
                <template v-else-if="item.SettleStatus == 1">未结算</template>
                <template v-else-if="item.SettleStatus == 2">结算中</template>
                <template v-else-if="item.SettleStatus == 3">已结算</template>
                <template v-else>结算失败</template>
              </td>
              <td>
                <template v-if="item.distinct_cooperation == 1">CPSA</template>
                <template v-else-if="item.distinct_cooperation == 2">CPSG</template>
                <template v-else-if="item.distinct_cooperation == 3">CPST</template>
                <template v-else>CPSO</template>
              </td>
              <td>{{ item.user_name }}</td>
              <td>{{ item.actual_name }}</td>
              <td>
                <template v-if="item.money_type == 1">现金</template>
                <template v-else>游戏币</template>
              </td>
              <td>{{ item.game_name }}</td>
              <td>
                <template v-if="item.SettleStatus == 0">
                  <a style="cursor:pointer" @click="changeStatus(item.SettleAccountNo, 1)">正确</a>
                  <a style="cursor:pointer" @click="changeStatus(item.SettleAccountNo, 4)">错误</a>
                </template>
              </td>
            </tr>
            </tbody>
          </table>
          <el-pagination
            v-show="accounts.total > params.per_page"
            @current-change="onCurrentChange"
            :current-page="accounts.page"
            :page-size="params.per_page"
            :total="accounts.total"
            layout="prev, pager, next, jumper">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        accounts: {
          data: [],
          total: 0,
          page: 1,
        },
        onuser: {
          query: "",
          total: 0,
          page: 1,
        },
        start_time: [],
        cdruserlist: [],
        params: {
          token: "",
          settle_no: "",
          user_id: "",
          extend: "",
          page: 1,
          settle_status: "",
          start_time: "",
          end_time: "",
          distinct_cooperation: "",
          per_page: 20,
        }
      }
    },
    methods: {
      onCurrentChange(p) {
        this.params.page = p
        this.getAccounts()
      },
      submit() {
        this.params.page = 1
        this.page = 1
        this.getAccounts()
      },
      changeStatus(SettleAccountNo, status) {
        var form = new FormData()
        form.append("settle_account_no", SettleAccountNo)
        form.append("status", status)
        form.append("token", this.params.token)
        this.$http.put(ENV.CPS_HOST_URL + "/settle_account/change_status", form).then(response => {
          this.getAccounts()
          this.$message.success("修改成功")
        }, error => {
          this.$message.error(error.body)
        })
      },
      fUserSearch(query) {
        this.onuser.query = query
        if (this.onuser.query === '全部') {
          this.onuser.query = ''
        }
        for (var i = 0; i < this.cdruserlist.length; i++) {
          if (this.cdruserlist[i].UserName === query) {
            return
          }
        }
        this.getcascader()
      },
      fUserCurrentChange() {
        this.getcascader()
      },
      getcascader() {
        this.$http.get(ENV.CPS_HOST_URL + "/user/get_users_for_cascader", {
          params: {token: this.params.token, page: this.onuser.page, user_name: this.onuser.query}
        }).then(response => {
          this.cdruserlist = response.data.data
          this.onuser.total = response.data.total
        }, error => {
          this.$message.error(error.body)
        })
      },
      onsubmit_excel () {
        this.params.start_time = ""
        this.params.end_time = ""
        if (this.start_time.length > 1) {
          if (this.start_time[0] != null) {
            this.params.start_time = util.stampToTime(this.start_time[0] / 1000)
          }
          if (this.start_time[1] != null) {
            this.params.end_time = util.stampToTime(this.start_time[1] / 1000)
          }
        }
        window.open(ENV.CPS_HOST_URL + '/settle_account/get_for_work_excel', {params: this.params})
      },
      getAccounts() {
        this.params.start_time = ""
        this.params.end_time = ""
        if (this.start_time.length > 1) {
          if (this.start_time[0] != null) {
            this.params.start_time = util.stampToTime(this.start_time[0] / 1000)
          }
          if (this.start_time[1] != null) {
            this.params.end_time = util.stampToTime(this.start_time[1] / 1000)
          }
        }
        this.$http.get(ENV.CPS_HOST_URL + "/settle_account/get_for_work", {params: this.params}).then(response => {
          var data = response.data
          this.accounts.total = data.total
          this.accounts.data = []
          if (data.total > 0) {
            this.accounts.data = data.data
          }
        }, error => {
          if (error.status === 403) {
            this.$router.push({path: '/login'})
          } else {
            this.$message.error(error.body)
          }
        })
      }
    },
    mounted() {
      this.params.token = sessionStorage.getItem("token")
      this.getAccounts()
      this.getcascader()
    }
  }
</script>

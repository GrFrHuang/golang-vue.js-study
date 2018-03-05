<template>
  <div>
    <table class="table table-bordered table-hover">
      <thead>
      <tr>
        <th>QQ号</th>
        <th>QQ密码</th>
        <th>区服</th>
        <th>角色名</th>
        <th>充值金额</th>
        <th>提交会长</th>
        <th>提交时间</th>
        <th style="width: 250px">备注</th>
        <th>游戏充值确认时间</th>
        <th>充值确认人</th>
        <th>游戏充值确认</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in items">
        <td>{{ item.Qq }}</td>
        <td>{{ item.Pwd }}</td>
        <td>{{ item.Service }}</td>
        <td>{{ item.Role }}</td>
        <td>{{ item.Amount }}</td>
        <td>{{ item.UserName}}</td>
        <td>{{ item.CreateTime | stampToTimeFull}}</td>
        <td>{{ item.Desc }}</td>
        <td>{{ item.GameConfirmTime | stampToTimeFull}}</td>
        <td>{{ item.GameConfirmUsername }}</td>
        <td>
          <template v-if="item.GameRechargeStatus == 0 ">
            <a title="通过" style="cursor:pointer" @click="openDialog(item.Id, 1)">确认</a>
            <!--<span> | </span>-->
            <!--<a title="不通过" style="cursor:pointer"-->
               <!--@click="openDialog(item.Id, 2)">不通过</a>-->
          </template>
          <template v-if="item.GameRechargeStatus == 1 ">
            <span>已确认</span>
          </template>
          <!--<template v-if="item.GameRechargeStatus == 2 ">-->
            <!--<span>拒绝通过</span>-->
          <!--</template>-->
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
</template>

<script>
  export default {
    props: ['editId'],
    data: function () {
      return {
        page: 1,
        per_page: 15,
        total: 0,
        items: [],
        token: '',
        params: {},
      }
    },
    mounted: function () {
      this.token = sessionStorage.getItem("token")
    },
    methods: {
      openDialog(user_id, Status) {
        let formData = new FormData()
        formData.append("token", this.token)
        formData.append("status", Status)
        this.$http.put(ENV.CPS_HOST_URL + "/qq_recharge_agency/game_recharge_confirm/" + user_id, formData).then((response) => {
          this.$message.success('操作成功')
          this.getList()
        }, (error) => {
          this.$message.error(error.body)
        })
      },
      getList(v) {
        this.token = sessionStorage.getItem("token")
        this.params = this.editId
        let que = {
          CreateTime: this.params.CreateTime / 1000 || '',
          Qq: this.params.Qq || '',
          GameRechargeStatus: this.params.game_name || '',
          ConfirmTime: this.params.ConfirmTime / 1000 || ''
        }
        let query = util.onBuildGetParamsa(que)
        let url = ENV.CPS_HOST_URL + "/qq_recharge_agency/get_game_commit_list"
        this.$http.get(url,
          {
            params: {
              token: this.token, limit: this.per_page, offset: this.per_page * (this.page - 1),
              end_time_1: this.params.end_time_1 / 1000 || '',
              end_time_2: this.params.end_time_2 / 1000 || '',
              query: query,
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
      // onSubmit() {
      //   this.getList(1)
      // },
      onCurrentChange(currentPage) {
        this.page = currentPage
        this.getList()
      }
      ,
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
      }
      ,
    },
  }
</script>

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

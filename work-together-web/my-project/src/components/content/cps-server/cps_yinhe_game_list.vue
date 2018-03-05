<template>
  <div>
    <section class="content-header">
      <h1>
        申领硬核游戏列表<small>申领游戏审核</small>
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
                  <a title="通过" style="cursor:pointer" @click = "auditSuccess(item.user_id, item.user_name, item.game_id, item.game_name)" >通过</a>
                  <span > | </span>
                  <a title="不通过" style="cursor:pointer" @click = "auditFault(item.user_id, item.user_name, item.game_id, item.game_name)" >不通过</a>
                  <span > | </span>
                  <a title="不再合作" style="cursor:pointer" @click = "auditBanned(item.user_id, item.user_name, item.game_id, item.game_name)" >不再合作</a>
                </template>
                <template v-if="item.status == 1 ">
                  <a title="终止" style="cursor:pointer" @click = "auditBanned(item.user_id, item.user_name, item.game_id, item.game_name)" >终止</a>
                  <span v-if="item.deposit_status == 0"> | </span>
                  <a v-if="item.deposit_status == 0" title="退押金" style="cursor:pointer" @click = "returnDeposit(item.user_id, item.user_name, item.game_id, item.game_name)" >退押金</a>
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
      getList() {
        this.$http.get(ENV.CPS_HOST_URL + "/auth/work_apply_game_list",
          {params: { token: this.token, page: this.page, per_page: this.per_page, from: 0, server_type: 4,
            start_time: this.params.start_time / 1000, end_time: this.params.end_time / 1000,
            user_name: this.params.user_name, game_name: this.params.game_name, status: this.params.status,  }}
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
          this.$http.post(ENV.CPS_HOST_URL + "/auth/change_game_status", {token:this.token, user_id: +userId, game_id: +gameId, status:1}).then((response) => {
            this.$message.success('通过成功')
            this.getList()
          }, (error) => {
            this.$message.error(error.body)
          })
        })
      },
      auditFault (userId, userName, gameId, gameName) {
        this.$confirm('确认不通过【'+userName+'】【'+gameName+'】吗？').then(_ => {
          this.$http.post(ENV.CPS_HOST_URL + "/auth/change_game_status", {token:this.token, user_id: +userId, game_id: +gameId, status:2}).then((response) => {
            this.$message.success('不通过成功')
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
          this.$http.post(ENV.CPS_HOST_URL + "/auth/change_game_status", {token:this.token, user_id: +userId, game_id: +gameId, status: 3}).then((response) => {
            this.$message.success('确认终止')
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

<template>
  <div>
  <div>
    <section class="content-header">
      <h1>
        游戏管理<small>用户归属查询</small>
      </h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <el-form :inline="true" class="demo-form-inline" >
            <el-form-item label="账号">
              <el-input  v-model="params.user_name" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="box-body">
          <el-tabs v-model="activeName" type="card" @tab-click="tabChange">
            <el-tab-pane label="CPSA" name="CPSA"></el-tab-pane>
            <el-tab-pane label="CPSG" name="CPSG"></el-tab-pane>
            <el-tab-pane label="CPSJ" name="CPSJ"></el-tab-pane>
          </el-tabs>
          <table class="table table-bordered table-hover">
            <thead>
              <tr>
                <th>账号</th>
                <th>游戏名</th>
                <th>绑定渠道</th>
                <th>绑定时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
              <td> {{ item.UserName }}({{ item.Mobile }})</td>
              <td>{{ item.GameName }}</td>
              <td>{{ item.SuperiorUserName }}</td>
              <td>{{ item.CreateTime | stampToTimeFull }}</td>
              <td> <el-button type="primary" @click="changeTheChannel(item)">更换渠道</el-button></td>
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
    title="更换渠道"
    :visible.sync="dialogVisible"
    width="30%">
    <el-form :model="form">
      <el-form-item  label="账号:" >
        {{ form.UserName }}
      </el-form-item>
      <el-form-item  label="游戏名称:" >
        {{ form.GameName }}
      </el-form-item>
      <el-form-item  label="当前渠道:" >
        {{ form.SuperiorUserName }}
      </el-form-item>
      <el-form-item label="更换渠道" >
        <el-select v-model="channel" filterable placeholder="请选择">
          <el-option
            v-for="item in channelAll"
            :label="item.UserName"
            :value="item.ChannelId">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  <el-button @click="dialogVisible = false">取 消</el-button>
  <el-button type="primary" @click="modChannel">确 定</el-button>
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
        activeName: "CPSA",
        page: 1,
        per_page: 15,
        total: 0,
        channel: '',
        items: [],
        channelAll: [],
        dialogVisible: false,
        token: '',
        params: {
          user_name: '',
        },
        form: {},
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
      getList() {
        // let from = this.activeName == "CPSA" ? 1 : 3
        this.$http.get(ENV.CPS_HOST_URL + "/user/UserAffiliationList",
          {
            params: {
              token: this.token, page: this.page, per_page: this.per_page,
              user_name: this.params.user_name, game_name: this.params.game_name, active: this.activeName
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
      changeTheChannel(v){
        this.dialogVisible = true
        this.channel = ''
        this.form = v
        var url = ENV.CPS_HOST_URL + "/channel/GetChanneSelectall"
        this.$http.get(url)
          .then((res) => {
            this.channelAll = res.body
          })

      },
      modChannel(){
        if (String(this.channel) ===""){
          this.$message.error("请选择渠道")
          return
        }
        let user = JSON.parse(localStorage.getItem("cnodeBaseInfo"))
        let post = {
            'id': this.form.Id,
            'channel': String(this.channel),
            'email': user.info.email,
            'cpsType': this.activeName,
        }
        this.$http.put(ENV.CPS_HOST_URL + "/channel/ModChannel",post).then((response)=>{
          this.$message.success("修改成功")
          this.getList()
        },(error)=>{
          this.$message.error(error.body)
        })

        this.dialogVisible = false
      }
    }
  }
</script>

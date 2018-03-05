<template>
  <div>
    <section class="content-header">
      <h1>
        游戏管理<small>渠道归属查询</small>
      </h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <el-form :inline="true" class="demo-form-inline" >
            <el-form-item label="渠道名称">
              <el-input  v-model="game_name" placeholder="渠道名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="box-body">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="渠道归属" name="game"></el-tab-pane>
            <!--<el-tab-pane label="用户归属" name="gamealias"></el-tab-pane>-->
          </el-tabs>
          <table class="table table-bordered table-hover" v-if="activeName=='game'">
            <thead>
            <tr>
              <th>当前渠道</th>
              <th>账户余额</th>
              <th>渠道级别</th>
              <th>上级渠道</th>
              <th>顶级渠道</th>
              <th>创建时间</th>
              <th>操作</th>
              <th>申领游戏列表</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
              <td>{{ item.UserName }}</td>
              <td>{{ item.Money }}</td>
              <td>{{ item.Grade }}</td>
              <td>{{ item.SecondName }}</td>
              <td>{{ item.ThreeName }}</td>
              <td>{{ item.CreationTime }}</td>
              <td>
                <el-checkbox v-model="item.checked" @change="checkboxClick(item.UserId)">禁止登录系统</el-checkbox>
              </td>
              <td>
                <el-button type="primary" @click="getChnnelList(item)">查看</el-button>
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
    <el-dialog title="渠道游戏列表" :visible.sync="dialogTableVisible">
      <div class="box-header with-border">
        <el-form :inline="true" class="demo-form-inline" >
          <el-form-item label="游戏名称">
            <el-input  v-model="params.game_name" placeholder="游戏名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getUserGameList">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-tabs v-model="activeName2" type="card" @tab-click="tabClick">
        <el-tab-pane label="cps" name="cps">
          <table class="table table-bordered table-hover" border>
            <thead>
            <tr>
              <th>游戏名称</th>
              <th>申领时间</th>
              <th>游戏状态</th>
              <!--<th>操作</th>-->
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in chnnelCpsGameData">
              <td>{{ item.GameName }}</td>
              <td>{{ item.CreateTime | stampToTimeFull }}</td>
              <td>
                <div v-if="item.Status == 0">
                  待审核
                </div>
                <div v-else-if="item.Status == 1">
                  审核成功
                </div>
                <div v-else-if="item.Status == 2">
                  审核失败
                </div>
                <div v-else-if="item.Status == 3">
                  终止合作
                </div>
              </td>
              <!--<td>操作</td>-->
            </tr>
            </tbody>
          </table>
          <el-pagination
            v-show="cps_total > game_per_page"
            @current-change="cpsGameChange"
            :current-page="cps_page"
            :page-size="game_per_page"
            :total="cps_total"
            layout="prev, pager, next, jumper">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="联运" name="联运">
          <table class="table table-bordered table-hover" border>
            <thead>
            <tr>
              <th>游戏名称</th>
              <th>申领时间</th>
              <th>游戏状态</th>
              <th>渠道名</th>
              <!--<th>操作</th>-->
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in chnnelGameData">
              <td>{{ item.GameName }}</td>
              <td>{{  item.CreateTime | stampToTimeFull }}</td>
              <td>
                <div v-if="item.State == 1">
                  不合作
                </div>
                <div v-else-if="item.State == 2">
                  审核中
                </div>
                <div v-else-if="item.State == 3">
                  终止合作
                </div>
                <div v-else-if="item.State == 4">
                  合作
                </div>
              </td>
              <td>{{ item.ChannelPlatformName }}</td>
              <!--<td>操作</td>-->
            </tr>
            </tbody>
          </table>
          <el-pagination
            v-show="ly_total > game_per_page"
            @current-change="lyGameChange"
            :current-page="ly_page"
            :page-size="game_per_page"
            :total="ly_total"
            layout="prev, pager, next, jumper">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
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

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

</style>
<script>
  export default {
    data: function () {
      return {
        activeName: 'game',
        page: 1,
        ly_page: 1,
        cps_page: 1,
        per_page: 15,
        game_per_page: 10,
        game_page: 3,
        total:0,
        ly_total:0,
        cps_total:0,
        items:[],
        token:'',
        game_name:'',
        activeName2:'cps',
        dialogTableVisible:false,
        chnnelGameData: [],
        chnnelCpsGameData: [],
        params:{
          game_name: '',
          user_id:0,
        },
        gamealias:[],
        disabledOption: [{value: 0, name: "全部"},
          {value: 1, name: "激活登陆"},
          {value: 2, name: "禁止登陆"}]

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

      filterByKey (a) {
        return function (b, index, items) {
          return b.key == a
        }
      },
      getList() {
        let urlpath ="/user/UserSelect"
        this.$http.get(ENV.CPS_HOST_URL + urlpath,
          {params: { token: this.token, page: this.page, per_page: this.per_page,
            user_name: this.game_name}
          }
        ).then(response => {
          for (let i in response.body.data) {
            if (response.body.data[i].Disabled === 2) {
              response.body.data[i].checked = true
            } else {
              response.body.data[i].checked = false
            }
          }
          this.items = response.body.data
          this.total = response.body.total
        }, error => {
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
      cpsGameChange (currentPage) {
        this.cps_page = currentPage
        this.getCpsChnnelList()
      },
      lyGameChange (currentPage) {
        this.ly_page = currentPage
        this.getLyChnnelList()
      },
      getChnnelList(item) {
        this.dialogTableVisible = true
        this.params.user_id = item.UserId
        this.getLyChnnelList()
        this.getCpsChnnelList()
      },
      getUserGameList() {
        this.getLyChnnelList()
        this.getCpsChnnelList()
      },
      getCpsChnnelList() {
        this.dialogTableVisible = true
        let urlpath ="/channel_game/channem_game_list"
        this.$http.get(ENV.CPS_HOST_URL + urlpath,
          {params: { token: this.token, page: this.cps_page, per_page: this.game_per_page,
            user_name: this.params.game_name,user_id:this.params.user_id,from:1}
          }
        ).then(response => {
          this.chnnelCpsGameData = response.body.data
          this.cps_total = response.body.total
          console.log(response.body.total)
        }, error => {
          this.$message.error(error.body)
        })
      },
      getLyChnnelList() {
        this.dialogTableVisible = true
        let urlpath ="/channel_game/channem_game_list"
        this.$http.get(ENV.CPS_HOST_URL + urlpath,
          {params: { token: this.token, page: this.ly_page, per_page: this.game_per_page,
            user_name: this.params.game_name,user_id:this.params.user_id,from:2}
          }
        ).then(response => {
          this.chnnelGameData = response.body.data
          this.ly_total = response.total
        }, error => {
          this.$message.error(error.body)
        })
      },
      tabClick(tab, event) {
        console.log(tab, event);
      },
      checkboxClick(id){
        let form = new FormData()
        form.append("user_id", id)
        form.append("username", "fdsf")
        this.$http.put(ENV.CPS_HOST_URL + "/channel_game/switch/", form ).then(
        )
      }


    }
  }
</script>

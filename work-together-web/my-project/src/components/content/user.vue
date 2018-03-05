<template>
  <div>
    <section class="content-header">
      <h1>
        用户管理<small>添加/删除/修改密码</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>用户/角色</li>
        <li>
          <router-link to="/home/user">角色管理</router-link>
        </li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="row">
            <div class="col-md-4 col-lg-3">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="请输入账号搜索" v-model="searchKey">
                <span class="input-group-btn">
                  <button type="button" class="btn btn-default btn-flat" @click="search()">搜索</button>
                </span>
              </div>
            </div>
            <div class="col-md-4 col-lg-3">
              <div class="input-group">
                <el-select v-model="disabled" placeholder="状态" @change="getUsers">
                  <el-option
                    v-for="item in disabledOption"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="col-md-4">
              <button class="btn btn-primary" @click=addHelper>添加用户</button>
            </div>
          </div>
        </div>

        <div class="box-body">
          <table class="table table-bordered table-hover">
            <thead>
            <tr>
              <th v-for="todo in todos">
                {{ todo.text }}
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
              <td>{{ item.email }}({{ item.nickname }})</td>
              <td>{{ item.department_name }}</td>
              <td>
                <el-tag :type="role.id==1?'primary':'gray'" class="role-tag"
                        v-for="role in item.roles">{{ role.name}}
               </el-tag>
              </td>
              <td class="td-opeation">
                <span class="fa fa-trash" @click=doDelete(item) title="删除"> </span>
                <span class="fa fa-edit" @click=doEdit(item) title="编辑"> </span>
                <span class="resetpwd fa fa-repeat" @click=resetPwd(item) title="重置密码"> </span>
                <span title="禁用登陆">
                  <el-checkbox @change="disableUser(item)" v-model="item.disabled" :false-label="1"
                               :true-label="2">禁用登陆</el-checkbox>
                </span>
              </td>

            </tr>
            </tbody>
          </table>
          <el-pagination
            v-show="pageInfo.total > pageInfo.limit"
            @current-change="onCurrentChange"
            :current-page="pageInfo.currPage"
            :page-size="pageInfo.limit"
            :total="pageInfo.total"
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
<script type="text/ecmascript-6">
  export default {
    data: function () {
      return {
        pageInfo: {
          limit: ENV.PAGE_SHOW_COUNT,
          currPage: 1,
          total: 0,
        },
        todos: [{
          text: '账号'
        }, {
          text: '部门'
        }, {
          text: '角色'
        }, {
          text: '操作'
        },],
        items: [],  //  用户
        searchKey: "",
        disabled: 0,
        disabledOption: [{value: 0, name: "全部"},
          {value: 1, name: "激活登陆"},
          {value: 2, name: "禁止登陆"}]
      }
    },
    mounted: function () {
      // 加载用户
      this.getUsers(1)
    },
    methods: {
      onCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.getUsers()
      },
      reload(){
        this.getUsers()
      },
      search(){
        this.getUsers()
      },
      getUsers(){
        let filter = ["name:like" + this.searchKey]
        if (this.disabled) {
          filter.push("disabled:" + this.disabled)
        }
        let query = util.buildGetParams({
          "query|query": filter,
          "limit": this.pageInfo.limit,
          "offset|page": this.pageInfo,
        })

        let url = '/user?' + query
        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data
            this.pageInfo.total = res.body.total
          })
          .catch((err) => {
            console.log(err)
          })
      },
      doEdit: function (item) {
        this.$router.push({
          path: '/home/addHelper?id=' + item.id
        })
      },
      doDelete: function (item) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete("/user/" + item.id)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getUsers(this.pageInfo.currPage)
            })
        })
      },

      resetPwd(item){
        this.$confirm('此操作将重置用户密码为随机密码并发送密码至用户邮箱, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.put("/user/resetpwd/" + item.id)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '重置成功!'
              })
            })
        });
      },
      disableUser(item){
        console.log(item.disabled)

        let query = util.buildGetParams({disabled: item.disabled})
        this.$http.put("/user/disable/" + item.id + "?" + query)
          .then((r) => {

          })
      },
      addHelper: function () {
        this.$router.push({
          path: '/home/addHelper'
        })
      },
    }

  }
</script>
<style rel="stylesheet/less" lang="less">
  .role-tag {
    margin: 0 3px 0 0
  }

  .resetpwd {
    color: #c55063;
  }
</style>



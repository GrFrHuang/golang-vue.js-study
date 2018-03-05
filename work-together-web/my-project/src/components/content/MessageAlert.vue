<template>
  <div>
    <section class="content-header">
      <h1>
        消息提醒权限
        <small>查看消息提醒权限</small>
      </h1>
    </section>
    <div class="content">
      <div class="box-header with-border">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="消息类型筛选：">
            <el-select v-model="type" clearable  @change="Inquire(type)" placeholder="请选择消息类型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item>-->
            <!--<el-button type="primary" @click="onSubmit">新增消息类型</el-button>-->
          <!--</el-form-item>-->
        </el-form>
      </div>
      <div class="box" v-loading="isLoading">
        <div class="box-body">
          <table class="table table-bordered table-hover">
            <thead>
            <tr>
              <th>消息类型</th>
              <th>修改时间</th>
              <th>修改人</th>
              <th>权限</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
              <td>
                <p v-if="item.role === '0'">超管</p>
                <p v-if="item.role === '1'">账号审核</p>
                <p v-if="item.role === '2'">实名认证</p>
                <p v-if="item.role === '3'">游戏审核</p>
                <p v-if="item.role === '4'">提现审核</p>
                <p v-if="item.role === '5'">对账审核</p>
                <p v-if="item.role === '6'">退币审核</p>
                <p v-if="item.role === '7'">Q币代充</p>
              </td>
              <td>{{ item.create_time }}</td>
              <td>{{ item.create_man }}</td>
              <td>
                <el-tag v-for="s in item.userids">{{ s.name }}</el-tag>
              </td>
              <td>
                <template>
                  <a title="编 辑" style="cursor:pointer" @click="auditSuccess(item)">编 辑</a>
                </template>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <!-- /.box-body -->
      </div>
    </div>
    <el-dialog
      :title="onstatus === true ? '新增消息类型' : '编辑消息类型'"
      :visible.sync="dialogVisible"
      size="tiny">
      <el-form label-width="85px" class="demo-form-inline">
        <el-form-item label="类型选择：">
          <el-select v-model="ontype" :disabled="onstatus === true ? false : true" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限：">
          <el-cascader
            :options="sendPeopleOp"
            :filterable="true"
            :change-on-select="true"
            @change="handleChange">
          </el-cascader>
          <el-button @click="addSendUser()">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-tag
            :key="index"
            v-for="(item, index) in user_ids"
            :closable="true"
            :close-transition="false"
            type="primary"
            @close="handleClose(item)">
            {{item.name}}
          </el-tag>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="formontype()">确 定</el-button>
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
<script type="text/ecmascript-6">
  export default {
    data: function () {
      return {
        sendPeopleOp: [],
        cascaderCurrValue: null, // 当前cascader选择的value
        user_ids: [],
        items: [],
        isLoading: true,
        dialogVisible: false,
        onstatus: false,
        token: null,
        type: '',
        ontype: '',
        // username: '',
        // email: '',
        ontypes: '',
        options: [{
          value: '0',
          label: '超管'
        }, {
          value: '1',
          label: '账号审核'
        }, {
          value: '2',
          label: '实名认证'
        }, {
          value: '3',
          label: '游戏审核'
        }, {
          value: '4',
          label: '提现审核'
        }, {
          value: '5',
          label: '对账审核'
        }, {
          value: '6',
          label: '退币审核'
        }, {
          value: '7',
          label: 'Q币代充'
        }]
      }
    },
    mounted: function () {
      this.token = sessionStorage.getItem("token")
      this.getAll()
      this.loadSendOption()
    },
    methods: {
      handleChange(value) {
        this.cascaderCurrValue = value
      },
      handleClose(item) {
        this.user_ids.splice(this.user_ids.indexOf(item), 1);
      },
      addSendUser(){
        if (!this.cascaderCurrValue) {
          return
        }

        if (this.cascaderCurrValue.length === 1) {
          // 部门
          let depment = this.cascaderCurrValue[0]
          // 找出部门
          let depMent = _.find(this.sendPeopleOp, i => i.value == depment)
          this.user_ids.push({
            type: 1,// 整个部门
            value: depment.toString(), // 部门id
            name: depMent.label, // 部门名称
          })
        } else {
          // 个人
          let depment = this.cascaderCurrValue[0]
          let userMail = this.cascaderCurrValue[1]
          // 找出部门
          let depMent = _.find(this.sendPeopleOp, i => i.value == depment)

          // 找出人
          let user = _.find(depMent.children, i => i.value == userMail)
          this.user_ids.push({
            type: 2,// 单个用户
            value: userMail, // 用户email
            name: depMent.label+"/"+user.label, // 部门名称/用户名
          })
        }
      },
      loadSendOption(){
        this.$http.get("/user/getbydep").then(({data}) => {
          this.sendPeopleOp = data
        })
      },
      onSubmit() {
        this.ontype = ''
        // this.username = ''
        // this.email = ''
        this.onstatus = true
        this.dialogVisible = true
      },
      Inquire(v) {
        this.getAll(v)
      },
      auditSuccess(v) {
        this.ontype = ''
        this.user_ids = []
        this.onstatus = false
        this.dialogVisible = true
        this.ontypes = v
        this.ontype = v.role
        console.log(v.userids)
        this.user_ids = v.userids ? v.userids : []
      },
      formontype() {
        console.log(this.user_ids)
        var code = new FormData()
        code.append('id', this.ontypes.Id ? this.ontypes.Id : '')
        code.append('role', this.ontype)
        // code.append('username', this.username)
        code.append('user_ids', JSON.stringify(this.user_ids))
        code.append('token', this.token)
        console.log(code)
        if (this.onstatus === false) {
          this.$http.put(ENV.CPS_HOST_URL + '/messagealert/v', code)
            .then(({data}) => {
              this.getAll()
              this.loadSendOption()
              this.dialogVisible = false
            }).catch((error) => {
            this.$message({
              type: 'error',
              message: error.response.data
            })
            this.dialogVisible = false
          })
        } else {
          this.$http.post(ENV.CPS_HOST_URL + '/messagealert/v', code)
            .then(({data}) => {
              this.getAll()
              this.loadSendOption()
              this.dialogVisible = false
            }).catch((error) => {
            this.$message({
              type: 'error',
              message: error.response.data
            })
            this.dialogVisible = false
          })
        }
      },
      onCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.getAll(currentPage)
      },
      getAll(v) {
        let role
        if (v) {
          role = v
        } else if (v===0) {
          role = '0'
        } else {
          role = ''
        }
        this.isLoading = true
        this.$http.get(ENV.CPS_HOST_URL + '/messagealert/v?token=' + this.token + '&role=' + role)
          .then(({data}) => {
            this.items = data.data;
            console.log(this.items)
            this.isLoading = false
          })
      }
    }
  }
</script>

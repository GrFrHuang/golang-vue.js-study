<template>
  <div>
    <section class="content-header">
      <h1>
        公司资质
        <small>查看公司资质</small>
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
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="上传账号">
              <el-select v-model="params.user_id" clearable  filterable remote :remote-method="userSearch" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in userList.data"
                           :key="item.UserId"
                           :label="item.UserName"
                           :value="item.UserId"></el-option>
                <el-pagination v-if="userList.total > userList.perPage "
                               small layout="prev, pager, next"
                               :page-size="userList.perPage"
                               :total="userList.total"
                               :current-page.sync="userList.page"
                               @current-change="userPageChange">
                </el-pagination>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="box-body">
          <table class="table table-bordered table-hover">
            <thead>
            <tr>
              <th>上传账号</th>
              <th>负责人</th>
              <th>推广名称/公司名称</th>
              <th>ICP</th>
              <th>文网文</th>
              <th>营业执照</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
              <td>{{ item.user_name }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.principal }}</td>
              <td>
                <img @click="img_url(item.ICP)" style="width: 30px;height: 30px" :src=item.ICP alt="">
              </td>
              <td>
                <img @click="img_url(item.ICOL)" style="width: 30px;height: 30px" :src=item.ICOL alt="">
              </td>
              <td>
                <img @click="img_url(item.BusinessLicense)" style="width: 30px;height: 30px" :src=item.BusinessLicense alt="">
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
      title="提示"
      :visible.sync="dialogFormVisible"
      width="20%">
      <img style="width: 100%;" :src=Img_urls alt="">
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">关 闭</el-button>
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
  import {VueEditor} from 'vue2-editor'

  export default {
    components: {
      VueEditor
    },
    data: function () {
      return {
        postToken: "",
        Roll: false,
        page: 1,
        per_page: 15,
        total: 0,
        items: [],
        Img_urls: '',
        roll: '',
        userList: {
          data: [],
          perPage: 20,
          page: 1,
          total: 0,
          query:'',
        },
        params: {
          user_id: ""
        },
        message_type: '',
        roll_select: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '0',
            label: '否'
          },
          {
            value: '1',
            label: '是'
          }
        ],
        dialogFormVisible: false,
        disableds: false,
        token: '',
        formLabelWidth: '70px'
      }
    },
    mounted: function () {
      this.token = sessionStorage.getItem('token')
      this.getList()
    },
    methods: {
      img_url(v) {
        this.Img_urls = ''
        this.Img_urls = v
        this.dialogFormVisible = true
      },
      userSearch(query) {
        this.userList.page = 1
        if (query != "全部") {
          this.userList.query = query
        } else {
          this.userList.query = ''
        }
        this.getList()
      },
      userPageChange() {
        this.getList()
      },
      getList() {
        this.$http.get(ENV.CPS_HOST_URL + "/user/get_users_for_w_select", {
          params:{token: this.token, page: this.userList.page, per_page: this.userList.perPage, key: this.userList.query}
        }).then((response) => {
          if (response.body.total > 0) {
            this.userList.data = response.body.data
            for (let i = 0; i < response.body.data.length; i++) {
              if (this.userList.data[i].RealName != '') {
                this.userList.data[i].UserName += '(' + this.userList.data[i].RealName + ')'
              }
            }
          }
          this.userList.total = response.body.total
        }, error => {
          this.$message.error(error.body)
        })
        this.$http.get(ENV.CPS_HOST_URL + '/user/get_qualification_for_work?token=' + this.token + '&page=' + this.page + '&per_page=' + this.per_page + '&user_id=' + this.params.user_id).then(response => {
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
      official() {
        this.postToken = ""
        this.dialogFormVisible = true
        this.disableds = false
        this.form.status = 1
      },
      onCurrentChange(currentPage) {
        this.page = currentPage
        this.getList()
      },
    }
  }
</script>

<template>
    <div>
        <div class="box-header with-border">
            <el-form :inline="true" class="demo-form-inline" >
                <el-form-item label="渠道账号">
                    <el-select @change="filterChange" v-model="params.user_name" clearable  filterable remote :remote-method="userSearch" placeholder="请选择">
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
                <el-form-item label="日期">
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择开始日期" @change="startTimeChange" v-model="start_time" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <span style="display: block; float: left"> - </span>
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择结束日期" @change="endTimeChange" v-model="end_time" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="充值渠道">
                    <el-select @change="filterChange" v-model="params.related_user" clearable  filterable remote :remote-method="relatedSearch" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in relatedUser.data"
                                   :key="item.UserId"
                                   :label="item.UserName"
                                   :value="item.UserId"></el-option>
                        <el-pagination v-if="relatedUser.total > relatedUser.perPage "
                                       small layout="prev, pager, next"
                                       :page-size="relatedUser.perPage"
                                       :total="relatedUser.total"
                                       :current-page.sync="relatedUser.page"
                                       @current-change="relatedPageChange">
                        </el-pagination>
                    </el-select>
                </el-form-item>
                <button class="btn btn-primary" @click="exportLog">导出</button>
              <p>汇总：总充值金额：{{ sum }}</p>
            </el-form>
        </div>
        <div class="box-body">
            <table class="table table-bordered table-hover">
                <thead>
                <tr>
                    <th>充值账号</th>
                    <th>渠道名称</th>
                    <th>充值金额</th>
                    <th>充值渠道</th>
                    <th>充值时间</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in channelLog.data">
                    <td>{{ item.user_name }}</td>
                    <td>{{ item.channel_name }}</td>
                    <td>{{ item.amount }}</td>
                    <td>{{ item.related_name }}</td>
                    <td>{{ item.create_time | stampToTimeFull}}</td>
                </tr>
                </tbody>
            </table>
            <el-pagination
                    v-show="channelLog.total > channelLog.per_page"
                    @current-change="onCurrentChange"
                    :current-page.sync="channelLog.page"
                    :page-size="channelLog.per_page"
                    :total="channelLog.total"
                    layout="prev, pager, next, jumper">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data: function () {
          return {
              userList: {
                  data: [],
                  total: 0,
                  page: 1,
                  perPage: 20,
                  query:""
              },
              relatedUser: {
                  data: [],
                  total: 0,
                  page: 1,
                  perPage: 20,
                  query: ""
              },
              token: "",
              sum: "",
              channelLog: {
                  data: [],
                  per_page: 20,
                  page: 1,
                  total: 0,
              },
              start_time: "",
              end_time: "",
              params:{
                  token: "",
                  page:1,
                  per_page: 20,
                  start_time: '',
                  end_time: '',
                  user_name: '',
                  related_user: '',
              }
          }
        },
        methods: {
            exportLog() {
                window.open(ENV.CPS_HOST_URL + '/details/channel_recharge_log_for_work' + '?token=' + this.token +
                    '&start_time=' + this.params.start_time + '&end_time=' + this.params.end_time + "&user_name=" + this.params.user_name +
                    '&related_user=' + this.params.related_user + "&active=2")
            },
            filterChange() {
               this.channelLog.page = 1
               this.params.page = 1
               this.getChannelLog()
            },
            startTimeChange(time) {
                if (time != undefined) {
                    this.params.start_time = Date.parse(new Date(time)) / 1000
                } else {
                    this.params.start_time = ""
                }
                this.getChannelLog()
            },
            endTimeChange(time) {
                if (time != undefined) {
                    this.params.end_time = parseInt(new Date(new Date(time).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000)
                } else {
                    this.params.end_time = ""
                }
                this.getChannelLog()
            },
            userSearch(query) {
                this.userList.page = 1
                if (query != "全部") {
                    this.userList.query = query
                } else {
                    this.userList.query = ''
                }
                this.getUserSelectList()
            },
            relatedSearch(query) {
                this.relatedUser.page = 1
                if (query != "全部") {
                    this.relatedUser.query = query
                } else {
                    this.relatedUser.query = ''
                }
                this.getRelatedUserList()
            },
            userPageChange() {
                this.getUserSelectList()
            },
            relatedPageChange () {
                this.getRelatedUserList()
            },
            onCurrentChange(page) {
                this.params.page = page
                this.getChannelLog()
            },
            getRelatedUserList() {
                this.relatedUser.data = []
                this.relatedUser.total = 0
                this.$http.get(ENV.CPS_HOST_URL + "/user/get_users_for_w_select", {
                    params:{token: this.token, page: this.relatedUser.page, per_page: this.relatedUser.perPage, level: "1,2", key: this.relatedUser.query}
                }).then((response) => {
                    if (response.body.total > 0) {
                        this.relatedUser.data = response.body.data
                    }
                    this.relatedUser.total = response.body.total
                }, error => {
                    this.$message.error(error.body)
                })
            },
            getUserSelectList() {
                this.userList.data = []
                this.userList.total = 0
                this.$http.get(ENV.CPS_HOST_URL + "/user/get_users_for_w_select", {
                    params:{token: this.token, page: this.userList.page, per_page: this.userList.perPage, level: "2,3", key: this.userList.query}
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
            },
            getChannelLog() {
                this.channelLog.data = []
                this.total = 0
                this.params.active = 1
                this.$http.get(ENV.CPS_HOST_URL + "/details/channel_recharge_log_for_work",{params:this.params})
                    .then(response => {
                        if (response.body.total != 0) {
                            this.channelLog.data = response.body.data
                            this.channelLog.total = response.body.total
                            this.sum = response.body.sum[0]['SUM(aio_account_details.amount)']
                        }
                    }, (error) => {
                      if (error.status === 403) {
                        this.$router.push({path: '/login'})
                      } else {
                        this.$message.error(error.body)
                      }
                    })
            }
        },
        mounted: function () {
            this.token = sessionStorage.getItem("token")
            this.params.token = this.token
            this.getChannelLog()
            this.getUserSelectList()
            this.getRelatedUserList()
        }
    }
</script>

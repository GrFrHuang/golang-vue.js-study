<template>
  <div style="overflow: inherit;" class="wrapper">
    <div>
      <header class="main-header">
        <!-- Logo -->
        <router-link to="/home/Welcome" class="logo">
          <!-- mini logo for sidebar mini 50x50 pixels -->
          <span class="logo-mini"><b>W</b>T</span>
          <!-- logo for regular state and mobile devices -->
          <span class="logo-lg"><b>Work</b>Together</span>
        </router-link>
        <!-- Header Navbar: style can be found in header.less -->
        <nav class="navbar navbar-static-top">
          <!-- Sidebar toggle button-->
          <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>

          <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">
              <!-- Messages: style can be found in dropdown.less-->
              <li style="display: none" class="dropdown messages-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                  <i class="fa fa-envelope-o"></i>
                  <span class="label label-success">4</span>
                </a>
                <ul class="dropdown-menu">
                  <li class="header">你有4条未读消息</li>
                  <li>
                    <!-- inner menu: contains the actual data -->
                    <ul class="menu">
                      <li>
                        <!-- start message -->
                        <a href="#">
                          <div class="pull-left">
                            <img src="../../dist/img/user2-160x160.jpg" class="img-circle" alt="User Image">
                          </div>
                          <h4>
                            Support Team
                            <small><i class="fa fa-clock-o"></i> 5 mins</small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                      <!-- end message -->
                      <li>
                        <a href="#">
                          <div class="pull-left">
                            <img src="../../dist/img/user3-128x128.jpg" class="img-circle" alt="User Image">
                          </div>
                          <h4>
                            AdminLTE Design Team
                            <small><i class="fa fa-clock-o"></i> 2 hours</small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div class="pull-left">
                            <img src="../../dist/img/user4-128x128.jpg" class="img-circle" alt="User Image">
                          </div>
                          <h4>
                            Developers
                            <small><i class="fa fa-clock-o"></i> Today</small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div class="pull-left">
                            <img src="../../dist/img/user3-128x128.jpg" class="img-circle" alt="User Image">
                          </div>
                          <h4>
                            Sales Department
                            <small><i class="fa fa-clock-o"></i> Yesterday</small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div class="pull-left">
                            <img src="../../dist/img/user4-128x128.jpg" class="img-circle" alt="User Image">
                          </div>
                          <h4>
                            Reviewers
                            <small><i class="fa fa-clock-o"></i> 2 days</small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li class="footer">
                    <a href="#">查看所有消息</a>
                  </li>
                </ul>
              </li>
              <!-- Notifications: style can be found in dropdown.less -->
              <li class="dropdown notifications-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                  <i @click="editMessage">发消息</i>
                </a>
              </li>
              <li style="display: none" class="dropdown notifications-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                  <i class="fa fa-bell-o"></i>
                  <span class="label label-warning">10</span>
                </a>
                <ul class="dropdown-menu">
                  <li class="header">你有10个通知</li>
                  <li>
                    <!-- inner menu: contains the actual data -->
                    <ul class="menu">
                      <li>
                        <a href="#">
                          <i class="fa fa-users text-aqua"></i> 5 new members joined today
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="fa fa-warning text-yellow"></i> Very long description here that may not fit into the
                          page and may cause design problems
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="fa fa-users text-red"></i> 5 new members joined
                        </a>
                      </li>

                      <li>
                        <a href="#">
                          <i class="fa fa-shopping-cart text-green"></i> 25 sales made
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="fa fa-user text-red"></i> You changed your username
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li class="footer">
                    <a href="#">查看所有</a>
                  </li>
                </ul>
              </li>
              <!-- Tasks: style can be found in dropdown.less -->
              <li style="display: none" class="dropdown tasks-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                  <i class="fa fa-flag-o"></i>
                  <span class="label label-danger">9</span>
                </a>
                <ul class="dropdown-menu">
                  <li class="header">你有9个任务</li>
                  <li>
                    <!-- inner menu: contains the actual data -->
                    <ul class="menu">
                      <li>
                        <!-- Task item -->
                        <a href="#">
                          <h3>
                            Design some buttons
                            <small class="pull-right">20%</small>
                          </h3>
                          <div class="progress xs">
                            <div class="progress-bar progress-bar-aqua" style="width: 20%" role="progressbar"
                                 aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                              <span class="sr-only">20% Complete</span>
                            </div>
                          </div>
                        </a>
                      </li>
                      <!-- end task item -->
                      <li>
                        <!-- Task item -->
                        <a href="#">
                          <h3>
                            Create a nice theme
                            <small class="pull-right">40%</small>
                          </h3>
                          <div class="progress xs">
                            <div class="progress-bar progress-bar-green" style="width: 40%" role="progressbar"
                                 aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                              <span class="sr-only">40% Complete</span>
                            </div>
                          </div>
                        </a>
                      </li>
                      <!-- end task item -->
                      <li>
                        <!-- Task item -->
                        <a href="#">
                          <h3>
                            Some task I need to do
                            <small class="pull-right">60%</small>
                          </h3>
                          <div class="progress xs">
                            <div class="progress-bar progress-bar-red" style="width: 60%" role="progressbar"
                                 aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                              <span class="sr-only">60% Complete</span>
                            </div>
                          </div>
                        </a>
                      </li>
                      <!-- end task item -->
                      <li>
                        <!-- Task item -->
                        <a href="#">
                          <h3>
                            Make beautiful transitions
                            <small class="pull-right">80%</small>
                          </h3>
                          <div class="progress xs">
                            <div class="progress-bar progress-bar-yellow" style="width: 80%" role="progressbar"
                                 aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                              <span class="sr-only">80% Complete</span>
                            </div>
                          </div>
                        </a>
                      </li>
                      <!-- end task item -->
                    </ul>
                  </li>
                  <li class="footer">
                    <a href="#">查看所有任务</a>
                  </li>
                </ul>
              </li>
              <!-- User Account: style can be found in dropdown.less -->
              <li class="dropdown user user-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                  <img v-if="!userPic" src="../../dist/img/kf_logo.png" class="user-image" alt="User Image">
                  <img v-else :src="userPic" class="user-image" alt="User Image">
                  <span class="hidden-xs">{{mapUserInfo.nickName}}</span>
                </a>
                <ul class="dropdown-menu">
                  <!-- User image -->
                  <li class="user-header">
                    <img v-if="!userPic" src="../../dist/img/kf_logo.png" class="img-circle" alt="User Image">
                    <img v-else :src="userPic" class="img-circle" alt="User Image">
                    <p>
                      {{mapUserInfo.nickName}}
                      <small>{{mapUserInfo.departmentName}}</small>
                    </p>
                  </li>
                  <!-- Menu Body -->
                  <li class="user-footer">
                    <div class="pull-left">
                      <router-link to="/home/ModifyPassword" class="btn btn-default btn-flat">个人中心</router-link>
                    </div>
                    <div class="pull-right">
                      <a href="#" class="btn btn-default btn-flat" @click=logout>退出</a>
                    </div>
                  </li>
                </ul>
              </li>
              <!-- Control Sidebar Toggle Button -->
              <li>
                <a data-toggle="control-sidebar"><i class="fa fa-gears"></i></a>
              </li>
            </ul>
          </div>
        </nav>

      </header>
      <el-dialog title="发消息" v-model="sendVisible" size="tiny" :close-on-click-modal="false">
        <template>
          <label>消息类型： </label>
          <el-radio class="radio" v-model="messagetype" label="1">邮件</el-radio>
        </template>
        <br>
        <template>
          <label>接收人类型</label>
          <el-radio class="radio" v-model="userType" label="1">个人或部门</el-radio>
          <el-radio class="radio" v-model="userType" label="2">群组</el-radio>
        </template>
        <br>

        <label>发送给(个人或者部门)： </label>
        <el-cascader
          :disabled="userType==2"
          :options="sendPeopleOp"
          :filterable="true"
          :change-on-select="true"
          @change="handleChange">
        </el-cascader>
        <br>
        <br>

        <label>群组邮箱:  </label>
        <el-input v-model="toGroup"  size="small" :disabled="userType==1" placeholder="请输入群组邮箱(多个用;隔开)"></el-input>
        <br>
        <br>

        <label>标题：  </label>
        <el-autocomplete
          class="inline-input"
          v-model="subject"
          :fetch-suggestions="querySearch"
          placeholder="请输入标题"
          @select="handleSelect"
        ></el-autocomplete>

        <label>by：{{mapUserInfo.nickName}}</label>
        <br>
        <br>
        <label>内容：</label>
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="body">
        </el-input>

        <span slot="footer" class="dialog-footer">
                <el-button @click="sendVisible = false">取 消</el-button>
                <el-button type="primary" @click="sendEmail();sendVisible = false">发 送</el-button>
              </span>
      </el-dialog>
      <!-- Left side column. contains the logo and sidebar -->
      <menu-sidebar></menu-sidebar>
      <!-- Content Wrapper. Contains page content -->
      <!-- Control Sidebar -->
      <aside class="control-sidebar control-sidebar-dark">
        <!-- Create the tabs -->
        <ul class="nav nav-tabs nav-justified control-sidebar-tabs">
          <!--<li>
                        <a href="#control-sidebar-home-tab" data-toggle="tab"><i class="fa fa-home"></i></a>
                    </li>
                    <li>
                        <a href="#control-sidebar-settings-tab" data-toggle="tab"><i class="fa fa-gears"></i></a>
                    </li>-->
        </ul>
        <!-- Tab panes -->
        <div class="tab-content">
          <!-- Home tab content -->
          <div class="tab-pane" id="control-sidebar-home-tab">
            <h3 class="control-sidebar-heading">最近的活动</h3>
            <ul class="control-sidebar-menu">
              <li>
                <a href="javascript:void(0)">
                  <i class="menu-icon fa fa-birthday-cake bg-red"></i>
                  <div class="menu-info">
                    <h4 class="control-sidebar-subheading">兰登的生日</h4>
                    <p>将于4月24日23</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <i class="menu-icon fa fa-user bg-yellow"></i>

                  <div class="menu-info">
                    <h4 class="control-sidebar-subheading">更新他的资料</h4>

                    <p>新电话+ 1（800）555-1234</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <i class="menu-icon fa fa-envelope-o bg-light-blue"></i>
                  <div class="menu-info">
                    <h4 class="control-sidebar-subheading">加入邮件列表</h4>
                    <p>nora@example.com</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <i class="menu-icon fa fa-file-code-o bg-green"></i>
                  <div class="menu-info">
                    <h4 class="control-sidebar-subheading">执行</h4>
                    <p>执行时间5秒</p>
                  </div>
                </a>
              </li>
            </ul>
            <!-- /.control-sidebar-menu -->
            <h3 class="control-sidebar-heading">任务进度</h3>
            <ul class="control-sidebar-menu">
              <li>
                <a href="javascript:void(0)">
                  <h4 class="control-sidebar-subheading">
                    自定义模板的设计
                    <span class="label label-danger pull-right">70%</span>
                  </h4>
                  <div class="progress progress-xxs">
                    <div class="progress-bar progress-bar-danger" style="width: 70%"></div>
                  </div>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <h4 class="control-sidebar-subheading">
                    更新简历
                    <span class="label label-success pull-right">95%</span>
                  </h4>

                  <div class="progress progress-xxs">
                    <div class="progress-bar progress-bar-success" style="width: 95%"></div>
                  </div>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <h4 class="control-sidebar-subheading">
                    积分
                    <span class="label label-warning pull-right">50%</span>
                  </h4>

                  <div class="progress progress-xxs">
                    <div class="progress-bar progress-bar-warning" style="width: 50%"></div>
                  </div>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <h4 class="control-sidebar-subheading">
                    后端框架
                    <span class="label label-primary pull-right">68%</span>
                  </h4>

                  <div class="progress progress-xxs">
                    <div class="progress-bar progress-bar-primary" style="width: 68%"></div>
                  </div>
                </a>
              </li>
            </ul>
            <!-- /.control-sidebar-menu -->

          </div>
          <!-- /.tab-pane -->
          <!-- Stats tab content -->
          <div class="tab-pane" id="control-sidebar-stats-tab">统计表的内容</div>
          <!-- /.tab-pane -->
          <!-- Settings tab content -->
          <div class="tab-pane" id="control-sidebar-settings-tab">
            <form method="post">
              <h3 class="control-sidebar-heading">一般设置</h3>

              <div class="form-group">
                <label class="control-sidebar-subheading">
                  面板的使用报告
                  <input type="checkbox" class="pull-right" checked>
                </label>

                <p>
                  有关此一般设置选项的一些信息
                </p>
              </div>
              <!-- /.form-group -->

              <div class="form-group">
                <label class="control-sidebar-subheading">
                  允许邮件重定向
                  <input type="checkbox" class="pull-right" checked>
                </label>

                <p>
                  其他可用的选项集
                </p>
              </div>
              <!-- /.form-group -->

              <div class="form-group">
                <label class="control-sidebar-subheading">
                  在帖子中公开作者姓名
                  <input type="checkbox" class="pull-right" checked>
                </label>

                <p>
                  允许用户在博客中显示自己的名字
                </p>
              </div>
              <!-- /.form-group -->

              <h3 class="control-sidebar-heading">聊天设置</h3>

              <div class="form-group">
                <label class="control-sidebar-subheading">
                  显示我作为在线
                  <input type="checkbox" class="pull-right" checked>
                </label>
              </div>
              <!-- /.form-group -->

              <div class="form-group">
                <label class="control-sidebar-subheading">
                  关闭通知
                  <input type="checkbox" class="pull-right">
                </label>
              </div>
              <!-- /.form-group -->

              <div class="form-group">
                <label class="control-sidebar-subheading">
                  删除的聊天记录
                  <a href="javascript:void(0)" class="text-red pull-right"><i class="fa fa-trash-o"></i></a>
                </label>
              </div>
              <!-- /.form-group -->
            </form>
          </div>
          <!-- /.tab-pane -->
        </div>
      </aside>
      <!-- /.control-sidebar -->
      <!-- Add the sidebar's background. This div must be placed
       immediately after the control sidebar -->
    </div>
   <div v-show="sonmessage" class="isonmessage">
     <p style="text-align: right;margin: 0"><i @click="shutDown" class="el-icon-close"></i></p>
     <el-badge :value="onmessage_total" class="item">
     <h4>消息提醒</h4>
     </el-badge>
     <div v-for="item in onmessage">
       <p v-if="item.messagetype == 1">【{{item.username}}】账号注册完成，请尽快审核</p>
       <p v-if="item.messagetype == 2">【{{item.username}}】账号实名认证完成，请尽快审核</p>
       <p v-if="item.messagetype == 3">【{{item.username}}】账号申领《{{item.gamename }}》，请尽快审核 </p>
       <p v-if="item.messagetype == 4">【{{item.username}}】账号发起提现申请，请尽快审核</p>
       <p v-if="item.messagetype == 5">【{{item.username}}】账号发起对账申请，请尽快审核</p>
       <p v-if="item.messagetype == 6">【{{item.username}}】账号发起退币申请，请尽快审核</p>
       <p v-if="item.messagetype == 7">【{{item.username}}】账号发起Q币代充，请尽快审核</p>
       <p v-if="item.messagetype == 8"><a @click="gettask(item)">【{{item.task_name}}】转交工作流程提醒，请尽快操作</a></p>
       <p class="msgtime">{{item.time}}</p>
     </div>
   </div>
    <page-content></page-content>
  </div>

</template>
<style type="text/css" scoped>
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
  .sendemail {
    color: #FFFFFF;
    font-size: 17px;
    height: 20px;
  }
.isonmessage{
  width: 400px;
  border: 1px solid #0c0c0c;
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: white;
  padding:10px 20px;
  max-height: 600px;
  overflow: auto;
}
  .isonmessage h4{
    text-align: center;
    margin-top: 0;
  }
  .isonmessage p{
    margin: 5px 0;
  }
  .isonmessage .msgtime{
    text-align: right;
    padding-bottom: 10px;
    border-bottom: 1px solid #808080;
  }
</style>
<script type="text/ecmascript-6">
  import pageContent from '../components/page_content'
  import mgt from '../components/content/mgt'
  import menuSidebar from './public/menu_sidebar'
  import auth from '../auth'
  import {mapState} from 'vuex'
  export default {
    computed: {
      ...mapState({
        mapUserInfo: ({userInfo}) => userInfo,
      }),
      userPic(){
        if (!this.mapUserInfo.picFileId) {
          return ''
        }
        return util.buildFileUrl(this.mapUserInfo.picFileId)
      }
    },
    components: {
      pageContent,
      mgt,
      menuSidebar
    },
    data(){
      return {
        sendVisible: false,
        messagetype: '1',
        sendPeopleOp: [],
        menu: [{'value': '游戏提测'}, {'value': '游戏测评'}, {'value': '游戏接入'}, {'value': '渠道接入'}, {'value': '运营准备'},
          {'value': '客服准备'}, {'value': '游戏更新'}, {'value': '游戏流水管理'}, {'value': '游戏盈亏表'},
          {'value': '预警中心'}, {'value': '预警列表'}, {'value': 'cp合同管理'}, {'value': 'cp对账管理'},
          {'value': 'cp结算管理'}, {'value': '渠道合同管理'}, {'value': '渠道对账管理'}, {'value': '渠道结算管理'},
          {'value': '通讯录研发商'}, {'value': '通讯录发行商'}, {'value': '通讯录渠道商'}, {'value': '用户管理'},
          {'value': '角色管理'}, {'value': '类型分组'}, {'value': '操作日志'}, {'value': '报警日志'}
        ],
        userType:'1',
        toUser: '',
        subject: '',
        body: '',
        depId: 0,
        toGroup:'',
        onmessage: [],
        onmessage_total: 0,
        sonmessage: false
      }
    },
    methods: {
      logout: function () {
        auth.logout(this);
      },
      ongetDashboardInfo(){
        var url = ENV.CPS_HOST_URL + '/message_scrollbar/getmessaget?token=' + sessionStorage.getItem("token")
        this.$http.get(url).then((res) => {
          if (Array.isArray(res.body.data)) {
            this.onmessage = res.body.data
            this.onmessage_total = res.body.total
            this.sonmessage = true
          } else {
            this.sonmessage = false
          }
        })
      },
      shutDown() {
        this.sonmessage = false
        var url = ENV.CPS_HOST_URL + '/message_scrollbar/is_read?token=' + sessionStorage.getItem("token")
        this.$http.get(url).then((res) => {
          this.ongetDashboardInfo()
        })
      },
      gettask(v) {
        var url = ENV.CPS_HOST_URL + '/message_scrollbar/is_read?token=' + sessionStorage.getItem("token") + '&id=' + v.id
        this.$http.get(url).then((res) => {
          this.ongetDashboardInfo()
          this.$router.push({path: '/home/ChannelProcess', query: { id: v.task_id }})
        })
      },
      getsetInterval () {
        setInterval(this.ongetDashboardInfo, 60000)
      },
      handleChange(value) {
        if (value.length == 2){
            this.toUser = value[1]
        }
        else{
            this.depId = value[0]
        }
      },
      querySearch(queryString, cb) {
        var menu = this.menu;
        var results = queryString ? menu.filter(this.createFilter(queryString)) : menu;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (menu) => {
          return (menu.value.indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        this.subject = item.value
      },
      loadSendOption(){
        this.$http.get("/user/getbydep").then(({data}) => {
          this.sendPeopleOp = data
        })
      },
      editMessage(){
        this.sendVisible = true
        this.userType = '1'
        this.toUser = ''
        this.subject = ''
        this.body = ''
        this.depId = ''
        this.toGroup = ''
      },
      sendEmail(){
          let body = {
            to_user: this.toUser,
            subject: this.subject+'(by'+this.mapUserInfo.nickName+')',
            body: this.body,
            dep_id:this.depId,
            to_group:this.toGroup,
            user_type:this.userType
        };
        let post = util.buildPostParams(body)
          this.$http.post("/user/sendemail",post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '发送成功'
              })
            })
      }

    },
    mounted(){
      this.loadSendOption()
      this.ongetDashboardInfo()
      this.getsetInterval()
    }
  }</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

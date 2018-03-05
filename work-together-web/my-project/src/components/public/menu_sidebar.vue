<template>
  <aside class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
      <!-- sidebar menu: : style can be found in sidebar.less -->
      <ul class="sidebar-menu">
        <li class="treeview">
          <a href="#">
            <i class="fa fa-step-forward"></i> <span>流程管理</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li>
              <router-link to="/home/ChannelProcess"><i class="fa fa-list"></i>渠道出包流程</router-link>
            </li>
          </ul>
        </li>
        <li class="treeview"
            v-if="m.homechannelAccess||m.homereference||m.homeGameEvaluation||m.homegameAccess||m.homegameUpdate||m.homeready||m.homegamemanagepreonlinepreoperation||m.homegamemanagepreonlineprecustomerservice">
          <a href="#">
            <i class="fa fa-gamepad"></i> <span>游戏管理</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li v-if="m.homereference||m.homeGameEvaluation">
              <a href="#"><i class="fa fa-paw"></i>游戏测评
                <span class="pull-right-container">
                      <i class="fa fa-angle-left pull-right"></i>
                    </span></a>
              <ul class="treeview-menu">
                <li v-if="m.homereference">
                  <router-link to="/home/reference"><i class="fa fa-hand-o-up"></i>游戏提测</router-link>
                </li>
                <li v-if="m.homeGameEvaluation">
                  <router-link to="/home/GameEvaluation"><i class="fa fa-play"></i>游戏测评</router-link>
                </li>
              </ul>
            </li>
            <li v-if="m.homegameAccess">
              <router-link to="/home/gameAccess"><i class="fa fa-sitemap"></i>游戏接入</router-link>
            </li>
            <li v-if="m.homechannelAccess">
              <router-link to="/home/channelAccess"><i class="fa fa-chain-broken"></i>渠道接入</router-link>
            </li>
            <li v-if="m.homeready||m.homegamemanagepreonlinepreoperation||m.homegamemanagepreonlineprecustomerservice">
              <a href="#"><i class="fa fa-book"></i>上线准备
                <span class="pull-right-container">
                      <i class="fa fa-angle-left pull-right"></i>
                    </span></a>
              <ul class="treeview-menu">
                <li v-if="m.homeready">
                  <router-link to="/home/ready"><i class="fa fa-newspaper-o"></i>概况</router-link>
                </li>
                <li v-if="m.homegamemanagepreonlinepreoperation">
                  <router-link to="/home/game-manage/pre-online/pre_operation"><i class="fa fa-space-shuttle"></i>运营准备
                  </router-link>
                </li>
                <li v-if="m.homegamemanagepreonlineprecustomerservice">
                  <router-link to="/home/game-manage/pre-online/pre_customer_service"><i class="fa fa-rocket"></i>客服准备
                  </router-link>
                </li>
              </ul>
            </li>
            <li v-if="m.homegameUpdate">
              <router-link to="/home/gameUpdate"><i class="fa fa-download"></i>游戏更新</router-link>
            </li>
            <li v-if="m.outageNotice">
              <router-link to="/home/outageNotice"><i class="fa fa-bullhorn"></i>停运公告</router-link>
            </li>
            <!--<li>-->
            <!--<router-link to="/home/spread_gamelisot"><i class="fa fa-chain-broken"></i>推广系统游戏配置</router-link>-->
            <!--</li>-->
          </ul>
        </li>
        <li class="treeview" v-if="m.homelist">
          <a href="#">
            <i class="fa  fa-database"></i> <span>数据中心</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li v-if="m.homelist">
              <router-link to="/home/list"><i class="fa fa-bar-chart-o"></i>游戏流水</router-link>
            </li>
            <li>
              <router-link to="/home/departmentStatistics"><i class="fa fa-refresh"></i>部门统计</router-link>
            </li>
            <li v-if="m.homelist">
              <router-link to="/home/Channeldetails"><i class="fa fa-random"></i>渠道详情</router-link>
            </li>
            <!--<li v-if="m.homegameIncome">-->
            <!--<router-link to="/home/gameIncome"><i class="fa fa-bar-chart-o"></i>游戏盈亏表</router-link>-->
            <!--</li>-->
          </ul>
        </li>
        <li class="treeview" v-if="m.homelist">
          <a href="#">
            <i class="fa  fa-warning"></i> <span>预警管理</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li v-if="m.homelist">
              <router-link to="/home/warning_center"><i class="fa  fa-bell-o"></i>预警中心</router-link>
            </li>
            <li v-if="m.homegameIncome">
              <router-link to="/home/warning"><i class="fa  fa-list-ul"></i>预警列表</router-link>
            </li>
          </ul>
        </li>

        <li class="treeview" v-if="m.homemgtmgta||m.homemgtmgtb||m.homemgtmgtc">
          <a href="#">
            <i class="fa  fa-bar-chart-o"></i> <span>CP管理</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li v-if="m.homemgtmgta">
              <router-link to="/home/mgt/mgta"><i class="fa fa-pencil-square-o"></i>合同管理</router-link>
            </li>
            <li v-if="m.homemgtmgtb">
              <router-link to="/home/mgt/mgtb"><i class="fa fa-clone"></i>对账管理</router-link>
            </li>
            <li v-if="m.homemgtmgtc">
              <router-link to="/home/mgt/mgtc"><i class="fa fa-cny"></i>付款管理</router-link>
            </li>
          </ul>
        </li>

        <li class="treeview"
            v-if="m.homechannelContractchannelContractA||m.homechannelContractchannelContractB||m.homechannelContractchannelContractC">
          <a href="#">
            <i class="fa  fa-pie-chart"></i> <span>渠道管理</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li v-if="m.homechannelContractchannelContractA">
              <router-link to="/home/channelContract/channelContractA"><i class="fa fa-pencil-square-o"></i>合同管理
              </router-link>
            </li>
            <li v-if="m.homechannelContractchannelContractB">
              <router-link to="/home/channelContract/channelContractB"><i class="fa fa-clone"></i>对账管理</router-link>
            </li>
            <li v-if="m.homechannelContractchannelContractC">
              <router-link to="/home/channelContract/channelContractC"><i class="fa fa-cny"></i>回款管理</router-link>
            </li>
          </ul>
        </li>

        <li class="treeview"
            v-if="m.homeaddresslist||m.homeexpressManagement">
          <a href="#">
            <i class="fa  fa-certificate"></i> <span>其他功能</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li v-if="m.homeaddresslist">
              <router-link to="/home/addresslist"><i class="fa fa-gears"></i>通讯录管理</router-link>
            </li>
            <li v-if="m.homeexpressManagement">
              <router-link to="/home/expressManagement"><i class="fa  fa-recycle"></i>快递管理</router-link>
            </li>
            <li v-if="m.homeexpressManagement">
              <router-link to="/home/cps_company_qualification"><i class="fa  fa-recycle"></i>公司资质</router-link>
            </li>
          </ul>
        </li>
        <li class="treeview" v-if="m.homeuser||m.homerole">
          <a href="#">
            <i class="fa  fa-user"></i> <span>用户/角色</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li v-if="m.homeuser">
              <router-link to="/home/user"><i class="fa fa-users"></i>用户管理</router-link>
            </li>
            <li v-if="m.homerole">
              <router-link to="/home/role"><i class="fa fa-user-secret"></i>角色管理</router-link>
            </li>
          </ul>
        </li>
        <li class="treeview" v-if="m.cpsServer">
          <a href="#">
            <i class="fa   fa-cogs"></i> <span>推广系统管理</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li v-if="m.cpsManageGame">
              <router-link to="/home/cps_manage_game"><i class="fa  fa-gamepad"></i>游戏管理</router-link>
            </li>
            <li v-if="m.cpsUserServer">
              <router-link to="/home/cps_user_list"><i class="fa  fa-user-md"></i>推广用户列表</router-link>
            </li>
            <li v-if="m.cpsUserServer">
              <router-link to="/home/cps_task_review_list"><i class="fa  fa-user-md"></i>代充任务审核</router-link>
            </li>
            <li v-if="m.cpsCpsGameServer">
              <router-link to="/home/cps_cps_game_list"><i class="fa  fa-gavel"></i>申领CPS游戏列表</router-link>
            </li>
            <li v-if="m.cpsTencentGameServer">
              <router-link to="/home/cps_tencent_game_list"><i class="fa  fa-inbox"></i>申领腾讯游戏列表</router-link>
            </li>
            <li v-if="m.cpsLianyunGameServer">
              <router-link to="/home/cps_lianyun_game_list"><i class="fa  fa-key"></i>申领联运游戏列表</router-link>
            </li>
            <li v-if="m.cpsYinheGameServer">
              <router-link to="/home/cps_yinhe_game_list"><i class="fa  fa-leaf"></i>申领硬核游戏列表</router-link>
            </li>
            <li v-if="m.cpsOfficialNews">
              <router-link to="/home/cps_official_news"><i class="fa  fa-envelope"></i>公告信息管理</router-link>
            </li>
            <li v-if="m.cpsWithdraw">
              <router-link to="/home/cps_to_review_list"><i class="fa  fa-lightbulb-o"></i>提现审核管理</router-link>
            </li>
            <li v-if="m.cpsRecharge">
              <router-link to="/home/cps_recharge_list"><i class="fa  fa-minus-square-o"></i>会长充值管理</router-link>
            </li>
            <li v-if="m.cpsPlayerRechargeDetails">
              <router-link to="/home/cps_player_recharge_list"><i class="fa  fa-pencil-square"></i>玩家消费明细</router-link>
            </li>
            <li v-if="m.cpsStatistic">
              <router-link to="/home/cps_statistic"><i class="fa  fa-print"></i>数据统计</router-link>
            </li>
            <li v-if="m.cpsUserAffiliation">
              <router-link to="/home/cps_user_select"><i class="fa  fa-question-circle"></i>渠道归属查询</router-link>
            </li>
            <li v-if="m.cpsSettleAccount">
              <router-link to="/home/cps_settle_account"><i class="fa  fa-recycle"></i>结算账单</router-link>
            </li>
            <li v-if="m.cpsUserAffiliationList">
              <router-link to="/home/cps_user_affiliation_list"><i class="fa  fa-reply-all"></i>用户归属查询</router-link>
            </li>
            <li v-if="m.cpsReturnGoldApply">
              <router-link to="/home/cps_return_gold_apply"><i class="fa fa-search-plus"></i>退币申请管理</router-link>
            </li>
            <li v-if="m.cpsQqInformation">
              <router-link to="/home/cps_qq_information"><i class="fa fa-share-alt"></i>QQ信息记录</router-link>
            </li>
            <li v-if="m.cpsApplyQqRechargeAmount">
              <router-link to="/home/cps_apply_qq_recharge_amount"><i class="fa  fa-sort-amount-desc"></i>Q币充值额度申请列表
              </router-link>
            </li>
            <li v-if="m.channelReplacementLog">
              <a href="#"><i class="fa fa-book"></i>日志统计
                <span class="pull-right-container">
                      <i class="fa fa-angle-left pull-right"></i>
                    </span></a>
              <ul class="treeview-menu">
                <li v-if="m.channelReplacementLog">
                  <router-link to="/home/cps_channel_replacement_log"><i class="fa fa-spinner"></i>渠道更换日志
                  </router-link>
                </li>
                <li v-if="m.channelReplacementLog">
                  <router-link to="/home/cps_game_point_log"><i class="fa fa-newspaper-o"></i>点位日志</router-link>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li class="treeview" v-if="m.homeTypeGroupingTypeGroupinga||m.homeOperation||m.homeAlarm">
          <a href="#">
            <i class="fa   fa-cog"></i> <span>系统管理</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li v-if="m.homeTypeGroupingTypeGroupinga">
              <router-link to="/home/TypeGrouping/TypeGroupinga"><i class="fa fa-gg"></i>类型分组</router-link>
            </li>
            <li v-if="m.homeOperation">
              <router-link to="/home/Operation"><i class="fa  fa-yelp"></i>操作日志</router-link>
            </li>
            <li v-if="m.homeAlarm">
              <router-link to="/home/Alarm"><i class="fa fa-bell"></i>报警日志</router-link>
            </li>
            <li>
              <router-link to="/home/MessageAlert"><i class="fa fa-bell"></i>消息提醒</router-link>
            </li>
          </ul>
        </li>
        <li v-if="m.homeuserexamine" class="treeview">
          <a href="#">
            <i class="fa   fa-check-square-o"></i> <span>人脸签到</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li v-if="m.homeuserexamine">
              <router-link to="/home/SignInToReview"><i class="fa fa-star"></i>人脸绑定审核</router-link>
            </li>
            <li v-if="m.homeuserexamine">
              <router-link to="/home/QRCode"><i class="fa fa-barcode"></i>早会二维码</router-link>
            </li>
            <li v-if="m.homeuserexamine">
              <router-link to="/home/onSignInToReview"><i class="fa fa-steam-square"></i>人脸签到审核</router-link>
            </li>
          </ul>
        </li>
        <li v-if="m.homeusersmallsheep" class="treeview">
          <a href="#">
            <i class="fa fa-yelp"></i> <span>任务模块</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li v-if="m.homeusersmallsheep">
              <router-link to="/home/task_publish"><i class="fa fa-bar-chart-o"></i>任务审核</router-link>
            </li>
            <li v-if="m.homeusersmallsheep">
              <router-link to="/home/withdrawal_approval"><i class="fa fa-bar-chart-o"></i>提现审核</router-link>
            </li>
            <li v-if="m.homeusersmallsheep">
              <router-link to="/home/task_create"><i class="fa fa-bar-chart-o"></i>任务发布</router-link>
            </li>
            <li v-if="m.homeusersmallsheep">
              <router-link to="/home/WeChat"><i class="fa fa-bar-chart-o"></i>微信账号</router-link>
            </li>
            <li v-if="m.homeusersmallsheep">
              <router-link to="/home/novice"><i class="fa fa-bar-chart-o"></i>新手任务</router-link>
            </li>
            <li v-if="m.homeusersmallsheep">
              <router-link to="/home/small_user"><i class="fa fa-bar-chart-o"></i>用户</router-link>
            </li>
            <li v-if="m.homeusersmallsheep">
              <router-link to="/home/InvitationCode"><i class="fa fa-bar-chart-o"></i>员工邀请码</router-link>
            </li>
            <li v-if="m.homeusersmallsheep">
              <router-link to="/home/VersionControl"><i class="fa fa-bar-chart-o"></i>版本控制</router-link>
            </li>
          </ul>
        </li>
        <li class="treeview">
          <a href="#">
            <i class="fa fa-yelp"></i> <span>统计查看</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li>
              <router-link to="/home/chartDisplay"><i class="fa fa-bar-chart-o"></i>查看图表</router-link>
            </li>
            <li>
              <router-link to="/home/chartDisplaytime"><i class="fa fa-bar-chart-o"></i>实时数据</router-link>
            </li>
          </ul>

        </li>
        <li class="treeview">
          <a href="#">
            <i class="fa fa-yelp"></i> <span>工作环境管控</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li>
              <router-link to="/home/onlineStatus"><i class="fa fa-bar-chart-o"></i>在线状态</router-link>
            </li>
            <li>
              <router-link to="/home/EarlyWarningManagement"><i class="fa fa-bar-chart-o"></i>预警管理</router-link>
            </li>
          </ul>

        </li>
        <li class="treeview">
          <a href="#">
            <i class="fa   fa-list"></i> <span>kpi管理</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li v-if="m.kpiManagement">
              <router-link to="/home/publishTask"><i class="fa fa-pencil-square-o"></i>发布任务</router-link>
            </li>
            <li v-if="m.leaderkpiManagement" v-show="m.leaderkpiManagement">
              <router-link to="/home/examineTask"><i class="fa fa-check"></i>审批任务</router-link>
            </li>
            <li v-if="m.kpiManagement">
              <router-link to="/home/manageTask"><i class="fa fa-window-restore"></i>整合kpi</router-link>
            </li>
            <li v-if="m.kpiManagement">
              <router-link to="/home/departmentTask"><i class="fa fa-list-ol"></i>部门kpi</router-link>
            </li>
          </ul>
        </li>

      </ul>
    </section>
    <!-- /.sidebar -->
  </aside>
</template>
<script>
  import {mapState} from 'vuex'

  export default {
    computed: {
      ...mapState({
        mapMenu: ({userInfo}) => userInfo.menu,
        mapIsAdmin: ({userInfo}) => userInfo.isAdmin,
      }),
    },
    data() {
      return {
        m: {
          'homereference': false,
          'homeGameEvaluation': false,
          'homegameAccess': false,
          'homechannelAccess': false,
          'homegameUpdate': false,
          'homeready': false,
          'homegamemanagepreonlinepreoperation': false,
          'homegamemanagepreonlineprecustomerservice': false,
          'homelist': false,
          'homegameIncome': false,
          'home': false,
          'homemgtmgta': false,
          'homemgtmgtb': false,
          'homemgtmgtc': false,
          'homechannelContractchannelContractA': false,
          'homechannelContractchannelContractB': false,
          'homechannelContractchannelContractC': false,
          'homeaddresslist': false,
          'homeexpressManagement': false,
          'homeChannelBusiness': false,
          'homeuser': false,
          'homerole': false,
          'homeTypeGroupingTypeGroupinga': false,
          'homeOperation': false,
          'homeAlarm': false,
          'homeuserexamine': false,
          'homeusersmallsheep': false,

          'cpsServer': false,               //推广系统
          'cpsUserServer': false,           //推广会长审核
          'cpsTencentGameServer': false,    //推广腾讯游戏审核
          'cpsLianyunGameServer': false,    //推广联运游戏审核
          'cpsCpsGameServer': false,        //推广CPS游戏审核
          'cpsYinheGameServer': false,      //推广硬核游戏审核
          'cpsOfficialNews': false,         //推广站内信
          'cpsManageGame': false,           //推广游戏管理
          'cpsStatistic': false,            //推广数据统计
          'cpsWithdraw': false,             //推广提现审核
          'cpsRecharge': false,             //推广会长充值余额
          'cpsUserAffiliation': false,      //推广渠道归属查询
          'cpsPlayerRechargeDetails': false, //推广玩家消费明细
          'cpsUserAffiliationList': false,    //推广用户归属查询
          'cpsReturnGoldApply': false,      //推广退币申请管理
          'outageNotice': false,      //停运公告
          'channelReplacementLog': false,      //更换渠道日志
          'cpsSettleAccount': false, //推广结算账单
          'cpsQqInformation': false, //推广Q币代充
          'cpsApplyQqRechargeAmount': false, //推广系统带充Q币提高额度申请列表
          'leaderkpiManagement':false,  //kpi管理(部门领导)
          'kpiManagement':false  //kpi管理
        },
        msg: 'hello vue',
        menus: [
          {
            'url': 'home/Ga-meEv_a/luation'
          }
        ],
        permissions: {
          viewusers: false,
          viewgames: false,
        },
      }
    },
    methods: {
      loadMenu: function () {
        var umenu = this.mapMenu
        var isAdmin = this.mapIsAdmin
        if (isAdmin) {
          for (var i in this.m) {
            this.m[i] = true
          }
          this.permissions.viewusers = true
          this.permissions.viewgames = true
        } else if (umenu) {
          for (var i in umenu) {
            var str = umenu[i].url.replace(/\//g, '').replace(/-/g, '').replace(/_/g, '')
            this.m[str] = true
            if (str == 'homeuser') {
              this.permissions.viewusers = true
            }
          }
        }
        this.$store.commit('SET_PERMISSION', this.permissions)
      }
    },
    mounted: function () {
      var cnodeBaseInfo = window.localStorage.getItem('cnodeBaseInfo')
      if (cnodeBaseInfo != '') {
        var data = JSON.parse(cnodeBaseInfo)
        this.$store.commit('SET_BASEINFO', data)
        var roles = data.info.role_ids
        if (roles.indexOf('31') != -1) {
          this.m.cpsSettleAccount = true
          this.m.cpsServer = true
        }
        if (roles.indexOf('27') != -1) {
          this.m.cpsApplyQqRechargeAmount = true
          this.m.cpsSettleAccount = true
          this.m.cpsWithdraw = true
          this.m.cpsServer = true
        }
        if (roles.indexOf('47') !== -1) {
          this.m.cpsUserServer = true
          this.m.cpsServer = true
        }
        if (roles.indexOf('48') !== -1) {
          this.m.cpsTencentGameServer = true
          this.m.cpsServer = true
        }
        if (roles.indexOf('49') !== -1) {
          this.m.cpsLianyunGameServer = true
          this.m.cpsServer = true
        }
        if (roles.indexOf('50') !== -1) {
          this.m.cpsCpsGameServer = true
          this.m.cpsServer = true
        }
        if (roles.indexOf('51') !== -1) {
          this.m.cpsYinheGameServer = true
          this.m.cpsServer = true
        }
        if (roles.indexOf('52') !== -1) {
          this.m.cpsOfficialNews = true
          this.m.cpsServer = true
        }
        if (roles.indexOf('53') !== -1) {
          this.m.cpsManageGame = true
          this.m.cpsServer = true
        }
        if (roles.indexOf('55') != -1) {
          this.m.cpsStatistic = true
          this.m.cpsServer = true
        }
        if (roles.indexOf('56') != -1) {
          this.m.cpsRecharge = true
          this.m.cpsServer = true
        }
        if (roles.indexOf('57') != -1) {
          this.m.cpsPlayerRechargeDetails = true
          this.m.cpsServer = true
        }
        if (roles.indexOf('58') != -1) {
          this.m.cpsUserAffiliation = true
          this.m.cpsServer = true
        }
        if (roles.indexOf('59') != -1) {
          this.m.cpsUserAffiliationList = true
          this.m.cpsServer = true
        }
        if (roles.indexOf('60') != -1) {
          this.m.cpsReturnGoldApply = true
          this.m.cpsServer = true
        }
        if (roles.indexOf('61') != -1) {
          this.m.channelReplacementLog = true
          this.m.cpsServer = true
        }
        if (roles.indexOf('63') != -1 || roles.indexOf('64') != -1 || roles.indexOf('65') != -1) {
          this.m.cpsQqInformation = true
          this.m.cpsServer = true
        }
//        kpi permission
        if (roles.indexOf('64') != -1) {
          this.m.leaderkpiManagement = true
        }
      }
      this.loadMenu()
    }
  }
</script>

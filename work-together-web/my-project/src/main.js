// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueBlu from 'vue-blu'
import ECharts from 'vue-echarts/components/ECharts.vue'
import VueRouter from "vue-router"
import VueResouce from "vue-resource"
import VueProgressBar from "vue-progressbar"
import store from './store'
import auth from './auth'
import App from './App'
import pageMain from './page/page_main'
import login from './page/login'
import lista from './components/content/list' //游戏流水管理
import gameIncome from './components/content/gameIncome' //游戏流水管理
import details from './components/content/details' //游戏流水管理详情
import ready from './components/content/ready' //游戏上线前准备
import edit from './components/content/edit' //游戏上线前准备编辑页面
import mgt from './components/content/mgt' //游戏合同头部
import channelContract from './components/content/channelContract' //渠道合同头部
import channelContractA from './components/content/channelContract/channelContractA' //渠道合同管理 的合同管理列表
import channelContractBV2 from './components/content/channelContract/channelContractBV2' //渠道合同管理的对账管理列表
import channelContractC from './components/content/channelContract/channelContractC' //渠道合同管理的结算管理列表
import mgta from './components/content/mgt/mgta' //游戏合同管理 的合同管理列表
import mgtbv2 from './components/content/mgt/mgtbv2' //游戏合同管理的对账管理列表
import mgtc from './components/content/mgt/mgtc' //游戏合同管理的结算管理列表
import addContract from './components/content/add_contract' //游戏合同管理 的合同管理添加
import addCpReconciliationv2 from './components/content/addCpReconciliationv2' //游戏合同管理 的对账管理添加
import addCpBilling from './components/content/addCpBilling' //游戏合同管理 的结算管理添加
import editContractv2 from './components/content/edit_contractv2' //游戏合同管理 的合同管理编辑
import editCpBilling from './components/content/editCpBilling' //游戏合同管理 的结算管理编辑
import editCpReconciliation from './components/content/editCpReconciliation' //游戏合同管理 的对账管理编辑
import addGame from './components/content/addGame' //游戏上线前准备添加页面
import gameAccess from './components/content/gameAccess' //游戏上线前准备
import channelAccessv2 from './components/content/channelAccessv2' //游戏上线前准备
import ChannelProcess from './components/content/ChannelProcess' //游戏上线前准备
import gameUpdatev2 from './components/content/gameUpdatev2' //游戏更新
import editChannelContract from './components/content/edit_channelContract' //游戏渠道合同
import channelOfReconciliationV2 from './components/content/channelOfReconciliationv2' //游戏渠道对账
import paymentChannels from './components/content/paymentChannels' //游戏渠道回款
import editgameAccess from './components/content/editgameAccess' //游戏接入编辑
import addgameAccess from './components/content/addgameAccess' //游戏接入添加
import GameEvaluation from './components/content/GameEvaluation' //游戏评测
import editGameEvaluation from './components/content/editGameEvaluation' //游戏评测编辑
import user from './components/content/user' //用户管理
import role from './components/content/role' //角色管理
import TypeGrouping from './components/content/TypeGrouping' //类型分组
import TypeGroupinga from './components/content/TypeGrouping/TypeGrouping' //游戏类型
import Cooperation from './components/content/TypeGrouping/Cooperation' //合作方式
import Research from './components/content/TypeGrouping/Research' //研发商
import Publisher from './components/content/TypeGrouping/Publisher' //发行商
import union from './components/content/TypeGrouping/union' //工会政策
import Evaluation from './components/content/TypeGrouping/Evaluation' //评测级别
import AccessStatus from './components/content/TypeGrouping/AccessStatus' //SDK接入状态
import AlarmRules from './components/content/TypeGrouping/AlarmRules' //报警规则
import Express from './components/content/TypeGrouping/Express' //快递方式
import ContractStatus from './components/content/TypeGrouping/ContractStatus' //快递方式
import Source from './components/content/TypeGrouping/Source' //游戏来源
import Operation from './components/content/Operation' //操作日志
import Alarm from './components/content/Alarm' //报警日志
import editOperationalReadiness from './components/content/editOperationalReadiness' //运营数据编辑
import Welcome from './components/content/Welcome' //欢迎
import addHelper from './components/content/addHelper' //用户管理添加
import editHelper from './components/content/editHelper' //用户管理编辑
import addrole from './components/content/addrole' //用户角色添加
import editrole from './components/content/editrole' //用户角色编辑
import ModifyPassword from './components/content/ModifyPassword' //用户角色编辑
import research from './components/content/addresslist/research' //研发商列表
import Companylist from './components/content/addresslist/Companylist' //研发商列表
import addresearch from './components/content/addresearch' //研发商添加
import editresearch from './components/content/editresearch' //研发商编辑
import publisher from './components/content/addresslist/publisher' //发行商列表
import addpublisher from './components/content/addpublisher' //发行商列表
import editpublisher from './components/content/editpublisher' //发行商编辑
import reference from './components/content/reference' //游戏提测列表
import addreference from './components/content/addreference' //添加游戏提测
import addUpdate from './components/content/addUpdate' //添加游戏更新
import addChannelAccessv2 from './components/content/addChannelAccessv2' //添加渠道接入
import editChannelAccessv2 from './components/content/editChannelAccessv2' //编辑渠道接入
import editUpdatev2 from './components/content/editUpdatev2' //编辑游戏更新
import editReference from './components/content/editreference' //编辑游戏提测
import ChannelBusiness from './components/content/addresslist/ChannelBusiness' //渠道商列表
import addChannelBusiness from './components/content/addChannelBusiness' //添加渠道商
import editChannelBusiness from './components/content/editChannelBusiness' //编辑渠道商
import warning from './components/content/warning' //预警列表
import warning_center from './components/content/warning_center' //预警中心
import addresslist from './components/content/addresslist' //预警中心
import Channeldetails from './components/content/Channeldetails' //渠道详情
import editChanneldetails from './components/content/editChanneldetails' //查看渠道详情
import editExpressmanagement from './components/content/editExpressmanagement' //快递管理
import Expressmanagement from './components/content/Expressmanagement' //快递管理
import departmentStatistics from './components/content/departmentStatistics' //部门统计

// 员工电脑屏幕监控
import OnlineStatus from './components/content/WorkEnvironment/OnlineStatus' //上线状态
import EarlyWarningManagement from './components/content/WorkEnvironment/EarlyWarningManagement' //上线状态


import pre_operation from './components/content/game-manage/pre-online/pre_operation' //运营准备
import pre_operation_edit from './components/content/game-manage/pre-online/pre_operation_edit' //运营准备编辑
import pre_customer_service from './components/content/game-manage/pre-online/pre_customer_service' //客服准备
import pre_customer_service_edit from './components/content/game-manage/pre-online/pre_customer_service_edit' //客服准备编辑

import cps_user_list from './components/content/cps-server/cps_user_list' //推广系统注册用户列表
import cps_task_review_list from './components/content/cps-server/cps_task_review_list' //推广系统注册用户列表
import cps_cps_game_list from './components/content/cps-server/cps_cps_game_list' //推广系统申领cps游戏列表
import cps_tencent_game_list from './components/content/cps-server/cps_tencent_game_list' //推广系统申领腾讯游戏列表
import cps_qq_information from './components/content/cps-server/cps_qq_information' //推广系统申领腾讯游戏列表
import cps_official_news from "./components/content/cps-server/cps_official_news" //推广系统公告列表
import cps_company_qualification from "./components/content/cps-server/cps_company_qualification" //推广系统公司资质
import cps_yinhe_game_list from './components/content/cps-server/cps_yinhe_game_list' //推广系统申领游硬核戏游戏列表
import cps_lianyun_game_list from './components/content/cps-server/cps_lianyun_game_list' //推广系统申领联运游戏列表
import cps_manage_game from './components/content/cps-server/cps_manage_game' //推广系统游戏配置
import cps_to_review_list from './components/content/cps-server/cps_to_review_list' //推广系统游戏配置
import cps_statistic from './components/content/cps-server/cps_statistic' //推广系统统计数据
import cps_recharge_list from './components/content/cps-server/cps_recharge_list' //推广系统充值记录
import cps_player_recharge_list from './components/content/cps-server/cps_player_recharge_list' //推广系统玩家消费明细
import cps_user_select from './components/content/cps-server/cps_user_select' //渠道归属查询
import cps_user_affiliation_list from './components/content/cps-server/cps_user_affiliation_list' //用户归属查询
import cps_return_gold_apply from './components/content/cps-server/cps_return_gold_apply' //退币申请管理
import outageNotice from './components/content/outageNotice' //停运公告管理
import cps_channel_replacement_log from './components/content/cps-server/cps_channel_replacement_log' //停运公告管理
import cps_game_point_log from './components/content/cps-server/cps_game_point_log' //停运公告管理
import cps_settle_account from './components/content/cps-server/cps_settle_account' //推广系统结算帐单
import cps_apply_qq_recharge_amount from './components/content/cps-server/cps_apply_qq_recharge_amount' //推广系统带充Q币提高额度申请列表


import chartDisplayPage from './components/content/chartDisplay/Show' //图表展示
import RealTimeData1page from './components/content/chartDisplay/RealTimeData1' //实时数据
// import RealTimeData1 from './components/content/chartDisplay/RealTimeData1' //实时数据
import SignInToReview from './components/content/SignInToReview/SignInToReview' //人脸绑定审核
import QRCode from './components/content/SignInToReview/QRCode' //早会签到二维码
import onSignInToReview from './components/content/SignInToReview/onSignInToReview' //人脸签到审核
import MessageAlert from './components/content/MessageAlert' //人脸签到审核

// 小绵羊系统任务模块
import task_publish from './components/content/small_sheep/task_publish' //任务审核
import withdrawal_approval from './components/content/small_sheep/withdrawal_approval' //提现审核
import task_commit from './components/content/small_sheep/task_commit' //任务审核
import task_create from './components/content/small_sheep/task_create' //任务发布
import WeChat from './components/content/small_sheep/WeChat' //微信账号
import novice from './components/content/small_sheep/task_novice' //新手任务
import small_user from './components/content/small_sheep/user' //用户
import InvitationCode from './components/content/small_sheep/InvitationCode' //邀请码
import VersionControl from './components/content/small_sheep/VersionControl' //版本控制
//kpi
import publishTask from './components/content/kpiManagement/publishTask.vue' //kpi管理
import examineTask from './components/content/kpiManagement/examineTask.vue' //kpi管理


import 'lodash'
import './publicjs/EventBus'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import '../static/dist/css/css/sign_warning.css'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/toolbox'
import echarts from 'echarts'
// import 'vue-blu/dist/css/vue-blu.min.css'
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(VueResouce);
Vue.use(VueBlu);
Vue.component('chart', ECharts)
Vue.prototype.$echarts = echarts

const NotFound = {
  template: '<p>Page not found</p>'
}
const About = {
  template: '<p>about page</p>'
}

// export 是為了讓其他分離的程式碼也能取得路由的物件實例
export var router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes: [{
    path: '/home',
    component: pageMain,
    children: [ // 设定嵌套路由
      {
        name: 'publishTask',
        path: 'publishTask',
        component: publishTask
      },
      {
        name: 'examineTask',
        path: 'examineTask',
        component: examineTask
      },
      {
        name: 'cps_apply_qq_recharge_amount',
        path: 'cps_apply_qq_recharge_amount',
        component: cps_apply_qq_recharge_amount
      },
      {
        name: 'cps_settle_account',
        path: 'cps_settle_account',
        component: cps_settle_account
      },
      // 任务审核
      {
        name: 'task_publish',
        path: 'task_publish',
        component: task_publish
      },
      // 任务审核
      {
        name: 'task_commit',
        path: 'task_commit',
        component: task_commit
      },
      // 邀请码
      {
        name: 'InvitationCode',
        path: 'InvitationCode',
        component: InvitationCode
      },
      // 版本控制
      {
        name: 'VersionControl',
        path: 'VersionControl',
        component: VersionControl
      },
      // 提现审核
      {
        name: 'withdrawal_approval',
        path: 'withdrawal_approval',
        component: withdrawal_approval
      },
      // 任务发布
      {
        name: 'task_create',
        path: 'task_create',
        component: task_create
      },
      // 微信账号
      {
        name: 'WeChat',
        path: 'WeChat',
        component: WeChat
      },
      // 新手任务
      {
        name: 'novice',
        path: 'novice',
        component: novice
      },
      // 用户
      {
        name: 'small_user',
        path: 'small_user',
        component: small_user
      },
      // 图表展示
      {
        name: 'chartDisplay',
        path: 'chartDisplay',
        component: chartDisplayPage
      },// 员工工作电脑屏幕监控
      {
        name: 'onlineStatus',
        path: 'onlineStatus',
        component: OnlineStatus
      },// 员工工作电脑屏幕监控预警
      {
        name: 'EarlyWarningManagement',
        path: 'EarlyWarningManagement',
        component: EarlyWarningManagement
      },
      // 实时数据
      {
        name: 'chartDisplaytime',
        path: 'chartDisplaytime',
        component: RealTimeData1page
      },
      // 人脸绑定审核
      {
        name: 'SignInToReview',
        path: 'SignInToReview',
        component: SignInToReview
      },// 早会二维码
      {
        name: 'QRCode',
        path: 'QRCode',
        component: QRCode
      },// 早会二维码
      {
        name: 'MessageAlert',
        path: 'MessageAlert',
        component: MessageAlert
      },// 人脸签到审核
      {
        name: 'onSignInToReview',
        path: 'onSignInToReview',
        component: onSignInToReview
      },
      {
        name: 'cps_player_recharge_list',
        path: 'cps_player_recharge_list',
        component: cps_player_recharge_list
      },
      {
        name: 'cps_return_gold_apply',
        path: 'cps_return_gold_apply',
        component: cps_return_gold_apply
      },
      {
        name: 'cps_recharge_list',
        path: 'cps_recharge_list',
        component: cps_recharge_list
      },
      {
        name: 'cps_statistic',
        path: 'cps_statistic',
        component: cps_statistic
      },
      {
        name: 'cps_user_list',
        path: 'cps_user_list',
        component: cps_user_list
      },{
        name: 'cps_task_review_list',
        path: 'cps_task_review_list',
        component: cps_task_review_list
      }, {
        name: 'cps_cps_game_list',
        path: 'cps_cps_game_list',
        component: cps_cps_game_list
      }, {
        name: 'cps_tencent_game_list',
        path: 'cps_tencent_game_list',
        component: cps_tencent_game_list
      }, {
        name: 'cps_qq_information',
        path: 'cps_qq_information',
        component: cps_qq_information
      }, {
        name: 'cps_official_news',
        path: 'cps_official_news',
        component: cps_official_news
      }, {
        name: 'cps_company_qualification',
        path: 'cps_company_qualification',
        component: cps_company_qualification
      }, {
        name: 'cps_yinhe_game_list',
        path: 'cps_yinhe_game_list',
        component: cps_yinhe_game_list
      }, {
        name: 'cps_lianyun_game_list',
        path: 'cps_lianyun_game_list',
        component: cps_lianyun_game_list
      }, {
        name: 'cps_manage_game',
        path: 'cps_manage_game',
        component: cps_manage_game
      }, {
        name: 'cps_user_select',
        path: 'cps_user_select',
        component: cps_user_select
      }, {
        name: 'cps_user_affiliation_list',
        path: 'cps_user_affiliation_list',
        component: cps_user_affiliation_list
      }, {
        name: 'cps_to_review_list',
        path: 'cps_to_review_list',
        component: cps_to_review_list
      }, {
        name: 'cps_channel_replacement_log',
        path: 'cps_channel_replacement_log',
        component: cps_channel_replacement_log
      }, , {
        name: 'cps_game_point_log',
        path: 'cps_game_point_log',
        component: cps_game_point_log
      }, {
        name: 'list',
        path: 'list',
        component: lista
      }, {
        name: 'gameIncome',
        path: 'gameIncome',
        component: gameIncome
      }, {
        name: 'details',
        path: 'details',
        component: details
      }, {
        name: 'ready',
        path: 'ready',
        component: ready
      }, {
        name: 'outageNotice',
        path: 'outageNotice',
        component: outageNotice
      }, {
        name: 'gameAccess',
        path: 'gameAccess',
        component: gameAccess
      }, {
        name: 'channelAccess',
        path: 'channelAccess',
        component: channelAccessv2
      },
      // 渠道出包流程
      {
        name: 'ChannelProcess',
        path: 'ChannelProcess',
        component: ChannelProcess
      }, {
        name: 'gameUpdate',
        path: 'gameUpdate',
        component: gameUpdatev2
      }, {
        name: 'edit',
        path: 'edit',
        component: edit
      }, {
        name: 'mgt',
        path: 'mgt',
        component: mgt,
        children: [{
          name: 'mgta',
          path: 'mgta',
          component: mgta
        }, {
          name: 'mgtb',
          path: 'mgtb',
          component: mgtbv2,
        }, {
          name: 'mgtc',
          path: 'mgtc',
          component: mgtc
        },]
      }, {
        name: 'addContract',
        path: 'addContract',
        component: addContract
      }, {
        name: 'addCpReconciliation',
        path: 'addCpReconciliation',
        component: addCpReconciliationv2
      }, {
        name: 'addCpBilling',
        path: 'addCpBilling',
        component: addCpBilling
      }, {
        name: 'addGame',
        path: 'addGame',
        component: addGame
      }, {
        name: 'editContract',
        path: 'editContract',
        component: editContractv2
      }, {
        name: 'editCpBilling',
        path: 'editCpBilling',
        component: editCpBilling
      }, {
        name: 'editCpReconciliation',
        path: 'editCpReconciliation',
        component: editCpReconciliation
      }, {
        name: 'channelContract',
        path: 'channelContract',
        component: channelContract,
        children: [{
          name: 'channelContractA',
          path: 'channelContractA',
          component: channelContractA
        }, {
          name: 'channelContractB',
          path: 'channelContractB',
          component: channelContractBV2
        }, {
          name: 'channelContractC',
          path: 'channelContractC',
          component: channelContractC
        },]
      }, {
        name: 'editChannelContract',
        path: 'editChannelContract',
        component: editChannelContract
      }, {
        name: 'channelOfReconciliation',
        path: 'channelOfReconciliation',
        component: channelOfReconciliationV2
      }, {
        name: 'paymentChannels',
        path: 'paymentChannels',
        component: paymentChannels
      }, {
        name: 'Companylist',
        path: 'Companylist',
        component: Companylist
      }, {
        name: 'Channeldetails',
        path: 'Channeldetails',
        component: Channeldetails
      }, {
        name: 'editChanneldetails',
        path: 'editChanneldetails',
        component: editChanneldetails
      }, {
        name: 'Expressmanagement',
        path: 'Expressmanagement',
        component: Expressmanagement
      }, {
        name: 'editExpressmanagement',
        path: 'editExpressmanagement',
        component: editExpressmanagement
      }, {
        name: 'departmentStatistics',
        path: 'departmentStatistics',
        component: departmentStatistics
      },{
        name: 'research',
        path: 'research',
        component: research
      }, {
        name: 'addresslist',
        path: 'addresslist',
        component: addresslist
      }, {
        name: 'publisher',
        path: 'publisher',
        component: publisher
      }, {
        name: 'reference',
        path: 'reference',
        component: reference
      }, {
        name: 'ChannelBusiness',
        path: 'ChannelBusiness',
        component: ChannelBusiness
      }, {
        name: 'addChannelBusiness',
        path: 'addChannelBusiness',
        component: addChannelBusiness
      }, {
        name: 'editChannelBusiness',
        path: 'editChannelBusiness',
        component: editChannelBusiness
      }, {
        name: 'addresearch',
        path: 'addresearch',
        component: addresearch
      }, {
        name: 'editresearch',
        path: 'editresearch',
        component: editresearch
      }, {
        name: 'addpublisher',
        path: 'addpublisher',
        component: addpublisher
      }, {
        name: 'editpublisher',
        path: 'editpublisher',
        component: editpublisher
      }, {
        name: 'addreference',
        path: 'addreference',
        component: addreference
      }, {
        name: 'addUpdate',
        path: 'addUpdate',
        component: addUpdate
      }, {
        name: 'addChannelAccess',
        path: 'addChannelAccess',
        component: addChannelAccessv2
      }, {
        name: 'editChannelAccess',
        path: 'editChannelAccess',
        component: editChannelAccessv2
      }, {
        name: 'editUpdate',
        path: 'editUpdate',
        component: editUpdatev2
      }, {
        name: 'editReference',
        path: 'editReference',
        component: editReference
      }, {
        name: 'editgameAccess',
        path: 'editgameAccess',
        component: editgameAccess
      }, {
        name: 'addgameAccess',
        path: 'addgameAccess',
        component: addgameAccess
      }, {
        name: 'GameEvaluation',
        path: 'GameEvaluation',
        component: GameEvaluation
      }, {
        name: 'editGameEvaluation',
        path: 'editGameEvaluation',
        component: editGameEvaluation
      }, {
        name: 'pre_operation',
        path: 'game-manage/pre-online/pre_operation',
        component: pre_operation
      }, {
        name: 'pre_operation_edit',
        path: 'game-manage/pre-online/pre_operation_edit',
        component: pre_operation_edit
      }, {
        name: 'user',
        path: 'user',
        component: user
      }, {
        name: 'role',
        path: 'role',
        component: role
      }, {
        name: 'TypeGrouping',
        path: 'TypeGrouping',
        component: TypeGrouping,
        children: [{
          name: 'TypeGroupinga',
          path: 'TypeGroupinga',
          component: TypeGroupinga
        }, {
          name: 'Cooperation',
          path: 'Cooperation',
          component: Cooperation
        }, {
          name: 'Research',
          path: 'Research',
          component: Research
        }, {
          name: 'Publisher',
          path: 'Publisher',
          component: Publisher
        }, {
          name: 'union',
          path: 'union',
          component: union
        }, {
          name: 'Evaluation',
          path: 'Evaluation',
          component: Evaluation
        }, {
          name: 'AccessStatus',
          path: 'AccessStatus',
          component: AccessStatus
        }, {
          name: 'AlarmRules',
          path: 'AlarmRules',
          component: AlarmRules
        }, {
          name: 'Express',
          path: 'Express',
          component: Express
        }, {
          name: 'ContractStatus',
          path: 'ContractStatus',
          component: ContractStatus
        }, {
          name: 'Source',
          path: 'Source',
          component: Source
        }]
      }, {
        name: 'Operation',
        path: 'Operation',
        component: Operation
      }, {
        name: 'Alarm',
        path: 'Alarm',
        component: Alarm
      }, {
        name: 'pre_customer_service',
        path: 'game-manage/pre-online/pre_customer_service',
        component: pre_customer_service
      }, {
        name: 'pre_customer_service_edit',
        path: 'game-manage/pre-online/pre_customer_service_edit',
        component: pre_customer_service_edit
      }, {
        name: 'editOperationalReadiness',
        path: 'editOperationalReadiness',
        component: editOperationalReadiness
      }, {
        name: 'Welcome',
        path: 'Welcome',
        component: Welcome
      }, {
        name: 'addHelper',
        path: 'addHelper',
        component: addHelper
      }, {
        name: 'warning',
        path: 'warning',
        component: warning
      }, {
        name: 'warning_center',
        path: 'warning_center',
        component: warning_center
      }, {
        name: 'editHelper',
        path: 'editHelper',
        component: editHelper
      }, {
        name: 'addrole',
        path: 'addrole',
        component: addrole
      }, {
        name: 'editrole',
        path: 'editrole',
        component: editrole
      }, {
        name: 'ModifyPassword',
        path: 'ModifyPassword',
        component: ModifyPassword
      }
    ]
  }, {
    path: '/about',
    component: About,
  }, {
    path: '/',
    redirect: '/home'
  }, {
    path: '/login',
    component: login,
  },]
});

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !auth.check()) {
    // return a Promise that resolves to true or false
    next("/login")
  } else {
    next()
  }
  // next();
  if (to.path === '/home/welcome') {
    var url = '/userown/'
    Vue.http.get(url)
      .then((res) => {
        sessionStorage.setItem('umenu', res.data.menu)
        sessionStorage.setItem('isAdmin', res.data.isAdmin)
        sessionStorage.setItem('nickname', res.data.nickname)
        sessionStorage.setItem('email', res.data.email)
      }).catch((err) => {
      console.log(err)
    })
    next()
  }
});
Vue.use(VueProgressBar, {
  color: 'rgb(240,128,128)',
  failedColor: 'red',
  height: '2px'
});
Vue.http.interceptors.push((request, next) => {
  var xtoken = sessionStorage.getItem("token")
  if (xtoken) {
    request.headers.set('Authorization', xtoken)
  }
  if (request.url.indexOf(ENV.CPS_HOST_URL) == -1 && request.url.indexOf(ENV.DELETE_PERSONNEL_HOST_URL) == -1 && request.url.indexOf(ENV.DASHBOARC_HOST_URL) == -1 && request.url.indexOf(ENV.SMALL_SHEEP_HOST_URL) == -1 && request.url.indexOf(ENV.CPS_HOST_URL_CARGE) == -1) {
    var host = ENV.HOST_URL
    if (request.url.indexOf(host) != 0) {
      request.url = host + request.url
    }
  }

  Vue.prototype.$Progress.start()
  next((response) => {
    if (response.status == 401) {
      router.push({path: '/login'})
    } else if (response.status != 200) {
      let message = response.status != 0 ? response.body : "请检查网络"
      Vue.prototype.$message({
        message: message,
        type: 'warning'
      });
    }
    Vue.prototype.$Progress.finish()
    return response
  });
  Vue.prototype.$Progress.finish()
});
Date.prototype.format = function (format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}

Vue.filter("stampToTime", (timestamp) => {
  "use strict";
  if (!timestamp) {
    return ""
  }
  let newDate = new Date()
  newDate.setTime(timestamp * 1000)
  return newDate.format('yyyy-MM-dd')
})

Vue.filter("stampToTimeFull", (timestamp) => {
  "use strict";
  if (!timestamp) {
    return ""
  }
  let newDate = new Date()
  newDate.setTime(timestamp * 1000)
  return newDate.format('yyyy-MM-dd hh:mm:ss')
})


Vue.filter("download", (fileId) => {
  "use strict";
  if (!fileId) {
    return "#"
  }
  return util.buildFileUrl(fileId)
})

Vue.filter("fixed2", (num) => {
  "use strict";
  if (typeof num !== 'number') {
    return ''
  }

  return num.toFixed(2).replace('.00', '')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App)
})

// console.log(QA)
/****/

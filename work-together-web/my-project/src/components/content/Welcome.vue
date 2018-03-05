<template>
  <div>
    <section class="content-header">
      <h1>
        Work Together
        <small>欢迎您</small>
      </h1>
    </section>
    <div class="row wel_div" v-show="dashboardinfo.total">
      <el-row>
        <el-col :span="4" v-for="(o,index) in dashboardinfo.data" :offset="index > 0 ? 1 : 2">
          <el-card :body-style="{ padding: '0px' }" v-show="o.show">
            <img :src="require('../../../static/dist/img/'+o.tag+'.png')">
            <div style="padding: 14px; ">
              <p class="count_max-width">{{o.count}}</p>
              <div class="bottom clearfix">
                <el-button type="text" class="button" @click="see(o.href)">查看</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="row">
    <div class="col-sm-offset-1 col-md-6">
      <!-- USERS LIST -->
      <div class="box box-danger">
        <div class="box-header with-border">
          <h3 class="box-title">最新的成员</h3>
          <div class="box-tools pull-right">
            <span class="label label-danger">8个新成员</span>
            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
            </button>
            <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i>
            </button>
          </div>
        </div>
        <!-- /.box-header -->
        <div class="box-body no-padding">
          <ul class="users-list clearfix">
            <li v-for="item in latestUsers">
              <img :src="item.pic_url" alt="User Image" style="width: 114px">
              <span class="users-list-name" >{{item.nickname}}-{{item.department_name}}</span>
              <span class="users-list-date">{{item.created_time|stampToTime}}</span>
            </li>
          </ul>
          <!-- /.users-list -->
        </div>
        <!-- /.box-body -->
        <div class="box-footer text-center" v-if="mapPermission.viewusers">
          <router-link to="/home/user">查看所有用户</router-link>
        </div>
        <!-- /.box-footer -->
      </div>
      <!--/.box -->
    </div>
      <div class=" box box-primary box-primary_game col-md-3">
      <div class="box-header with-border">
        <h3 class="box-title">最近新增的游戏</h3>
        <div class="box-tools pull-right">
          <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
          </button>
          <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
        </div>
      </div>
      <!-- /.box-header -->
      <div class="box-body">
        <ul class="products-list product-list-in-box">
          <li v-for="item in latest" class="Product_li">
            <div class="product-img">
              <img :src="item.show_icon" alt="Product Image">
            </div>
            <div class="product-info product-info_div">
              <a href="javascript:void(0)" class="product-title">{{ item.game_name }}</a>
              <span class="product-description">
                首发时间：
                <span v-if="item.publish_time==null || item.publish_time==0">暂未确定</span>
                <span v-else>{{ item.publish_time | stampToTime }}</span>
              </span>
            </div>
          </li>
        </ul>
      </div>
      <!-- /.box-body -->
      <div class="box-footer text-center" v-if="mapPermission.viewgames">
        <router-link to="/home/gameAccess">查看所有游戏</router-link>
      </div>
      <!-- /.box-footer -->
    </div>
  </div>
  </div>
</template>
<style>
  .el-notification{
    width: 480px!important;
  }
</style>
<style type="text/css" scoped>
  .wel_div > div {
    width: 90%;
    margin: auto;
    min-height: 200px;
    text-align: center;
    margin-bottom: 20px;
    margin-top: 50px;
    font-size: 20px;
    font-family: "微软雅黑";
  }

  .wel_div > div > div > div > div img {
    width: 100%;
  }

  .time {
    font-size: 13px;
    color: #999;
  }
  .users-list > li {
    padding: 17px;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-primary_game {
    width: 28%;
  }

  .product-info_div {
    padding: 5px 0;
  }

  .Product_li {
    padding: 10px 0;
  }
  .count_max-width{
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
  }
  .count_max-width:hover {
    text-overflow: inherit;
    overflow: visible;
    white-space: pre-line;
  }
</style>
<script>
  import { mapState} from 'vuex'
  import { Notification } from 'element-ui'
  export default{
    components: {
      Notification,
    },
    computed: {
      ...mapState({
        mapPermission: ({userInfo}) => userInfo.permission,
      }),
    },
    data() {
      return {
        currentDate: new Date(),
        dashboardinfo: {
          data:[],
          total:0
        },
        latest: [],//最近新增的游戏
        latestUsers: [], //最近新增用户
      };
    },
    methods: {
      see(href){
        this.$router.push({path: href})
      },
      getDashboardInfo(){
        var url = '/dashboardInfo/'

        this.$http.get(url).then((res) => {
          this.dashboardinfo = res.data
        })
      },
      getLatestGames(){
        var url = '/game/latest'

        this.$http.get(url).then((res) => {
          this.latest = _.each(res.data, (v)=>{
              if(!v.show_icon){
                v.show_icon = require('../../../dist/img/kf_logo.png')
              }
          })
        })
      },
      getLatestUsers(){
        this.$http.get('/user?sortby=created_time&order=desc&limit=8').then((res) => {
          this.latestUsers = _.each(res.data.data,(v)=>{
              if (!v.pic_file_id){
                v.pic_url = require('../../../dist/img/kf_logo.png')
              }else{
                v.pic_url = util.buildFileUrl(v.pic_file_id)
              }
          })
        })
      }
    },
    created: function () {
      this.getDashboardInfo()
      this.getLatestGames()
      this.getLatestUsers()
    },
  }
</script>

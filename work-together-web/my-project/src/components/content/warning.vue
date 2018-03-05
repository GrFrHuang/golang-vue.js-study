<template>
  <div>
    <section class="content-header">
      <h1>
        预警列表
        <small>查看预警通知</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>预警管理</li>
        <li><i class="fa fa-dashboard"></i>预警列表</li>
        <li>
          <router-link to="/home/warning">查看预警通知</router-link>
        </li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="col-md-10 form-horizontal">
            <div class="form-group">
              <!--<div class="col-sm-10">-->
                <!--<label class="col-sm-2 control-label">游戏选择</label>-->
                <!--<multiselect v-model="selectedGames" tag-placeholder="Add this as new tag"-->
                             <!--placeholder="游戏选择" selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
                             <!--label="game_name" track-by="id" :options="games" :multiple="true"-->
                             <!--:taggable="false" @input="doGetOrderList" >-->
                <!--</multiselect>-->
              <!--</div>-->
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">预警时间:</label>
                <div class="col-sm-10 ipt_jianju">
                  <el-date-picker
                    v-model="time" @change="doGetWarningLog"
                    type="daterange"
                    :range="true"
                    format="yyyy-MM-dd"
                    placeholder="选择日期范围">
                  </el-date-picker>
                </div>
                  <label class="col-sm-2 control-label">渠道名称:</label>
                  <div class="col-sm-10 ipt_jianju">
                  <!--<multiselect v-model="selectedChannels" tag-placeholder="Add this as new tag"-->
                               <!--placeholder="搜索或选择渠道" selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
                               <!--label="name" track-by="cp" :options="channels" :multiple="true"-->
                               <!--:taggable="false" @input="doGetWarningLog" >-->
                  <!--</multiselect>-->
                    <el-select v-model="selectedChannels" :clearable="true"
                               @change="doGetWarningLog" filterable multiple placeholder="请选择">
                      <el-option
                        v-for="item in channels"
                        :label="item.name"
                        :value="item.cp">
                      </el-option>
                    </el-select>
                </div>
                </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">游戏名称:</label>
                <div class="col-sm-10 ipt_jianju">
                  <!--<multiselect v-model="selectedGames" tag-placeholder="Add this as new tag"-->
                               <!--placeholder="搜索或选择游戏" selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
                               <!--label="game_name" track-by="game_id" :options="games" :multiple="true"-->
                               <!--:taggable="false" @input="doGetWarningLog" >-->
                  <!--</multiselect>-->
                  <el-select v-model="selectedGames" :clearable="true"
                             @change="doGetWarningLog" filterable multiple placeholder="请选择">
                    <el-option
                      v-for="item in games"
                      :label="item.game_name"
                      :value="item.game_id">
                    </el-option>
                  </el-select>
                </div>
                <label class="col-sm-2 control-label">预警等级:</label>
                <div class="col-sm-10 ipt_jianju">
                  <!--<multiselect v-model="selectedGrade" tag-placeholder="Add this as new tag"-->
                               <!--placeholder="搜索或选择等级" selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
                               <!--label="name" track-by="id" :options="grades" :multiple="false"-->
                               <!--:taggable="false" @input="doGetWarningLog" >-->
                  <!--</multiselect>-->
                  <el-select v-model="selectedGrade" :clearable="true"
                             @change="doGetWarningLog" filterable placeholder="请选择">
                    <el-option
                      v-for="item in grades"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-table
          v-loading="isLoading"
          element-loading-text="拼命加载中"
          class="table table-bordered table-hover"
          :data="items"
          border
          stripe
          style="width: 100%">
          <el-table-column
            fixed
            prop="create_time"
            label="时间">
            <template scope="scope">
              <p>{{ scope.row.create_time | stampToTimeFull}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="info"
            label="详情"
          min-width="220">
            <template scope="scope">
              <p  v-html="scope.row.info" class="max_widths"></p>
            </template>
          </el-table-column>
          <el-table-column
            prop="warning_name"
            label="预警名称">
            <template scope="scope">
              <p>{{ scope.row.warning_type }}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="grade"
            label="预警等级">
            <template scope="scope">
              <p>
                <span v-if="scope.row.grade===1">蓝色</span>
                <span v-if="scope.row.grade===2">黄色</span>
                <span v-if="scope.row.grade===3">橙色</span>
                <span v-if="scope.row.grade===4">红色</span>
              </p>
            </template>
          </el-table-column>
        </el-table>
        <Pagination v-show="pageInfo.total > pageInfo.limit"
                    @current-change="handleCurrentChange"
                    :current-page="pageInfo.currentPage"
                    :page-size="pageInfo.limit"
                    layout="prev, pager, next, jumper, total"
                    :total="pageInfo.total">
        </Pagination>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .el-date-editor--daterange.el-input{
    width: 100%;
  }
  .control-label{
    width: 94px;
  }
</style>
<script >
//  import warning from './warning/warning'
  import Multiselect from 'vue-multiselect'
  import {Pagination} from 'element-ui'
  import util from '../../publicjs/utils'

  export default {
//    props: ['items'],
    components: {
      Multiselect,
//      warning,
      Pagination,
      util
    },
    data: function () {
      return {
        pageInfo: {
          currentPage: 1,
          limit: ENV.PAGE_SHOW_COUNT,
          offset: 0,
          total: 0,
        },
        selectedGames: [],
        selectedChannels:[],
        selectedGrade:"",
        games: [],
        channels:[],
        grades:[{id:1, name:"蓝色"},{id:2, name:"黄色"},{id:3, name:"橙色"},{id:4, name:"红色"}],
        time: '',
        items:[],
        isLoading: true,
      }
    },
    methods: {
      reset:function () {
        this.selectedGames = []
        this.selectedChannels = null
        this.selectedGrade = null
        this.time = ''
        this.doGetWarningLog()
      },
      handleCurrentChange(currentPage) {
        let offset = util.buildOffsetByPage(currentPage, this.pageInfo.limit)
        this.pageInfo.offset = offset
        this.doGetWarningLog(currentPage)
      },
      getGameSelectList: function () {
        var url = '/order/game/'
        this.$http.get(url)
          .then((res) => {
            this.games = res.body
          })
      },
      getChannelSelectList: function () {
        var url = '/order/channel/'
        this.$http.get(url)
          .then((res) => {
            this.channels = res.body
          })
          .catch((err) => {
            context.error = err.data
          })
      },
      doGetWarningLog (page = 0) {
        if (page == 0) {
          this.pageInfo.offset = 0
        }
        let game_ids = []
        if (this.selectedGames.length != 0) {
          for (let i in this.selectedGames) {
            game_ids.push(this.selectedGames[i])
          }
        }

        let channels_codes = []
        if (this.selectedChannels.length != 0) {
          for (let i in this.selectedChannels) {
            channels_codes.push(this.selectedChannels[i])
          }
        }

        let start_time = ""
        let end_time = ""
        if (this.time.length > 1) {
          if (this.time[0] != null) {
            start_time = this.time[0].format("yyyy-MM-dd")
          }
          if (this.time[1] != null) {
            end_time = this.time[1].format("yyyy-MM-dd")
          }
        }

        let grade = this.selectedGrade ? this.selectedGrade : 0;

        let query = util.buildGetParams({
          "games": game_ids.join(","),
          "channels": channels_codes.join(","),
          "grade":grade,
          "start_time|timeToStamp":start_time,
          "end_time|timeToStamp":end_time,
          "limit": this.pageInfo.limit,
          "offset": this.pageInfo.offset,
        })
        let url = '/warninglog?' + query;
        this.isLoading = true
        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data;
            for (let i in this.items) {
              let context = this.items[i].info
              this.items[i].info = context.replace(/\[(.*?)\]/g, "<b class='txt-highlight' style='margin:0 3px'>$1</b>")
            }
            this.pageInfo.total = res.body.total
        this.isLoading = false
          })
      },
    },
    mounted: function () {
      this.getGameSelectList();
      this.getChannelSelectList();
      this.doGetWarningLog(0);
    }
  }
</script>

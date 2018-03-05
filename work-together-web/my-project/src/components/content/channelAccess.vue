  <template>
  <div>
    <section class="content-header">
      <h1>
        渠道接入
        <small>查看渠道接入情况</small>
      </h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="col-md-10 form-horizontal">
            <div class="form-group">
              <div class="col-sm-12 margin__btm">
                <label class="col-sm-2 control-label">游戏名称</label>
                <div class="col-lg-4 col-md-10 col-sm-10">
                  <!--<multiselect v-model="selectedGames" tag-placeholder="Add this as new tag"-->
                               <!--placeholder="请选择" selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
                               <!--label="game_name" track-by="game_id" :options="games" :multiple="true"-->
                               <!--:taggable="false"-->
                               <!--@input="doGetOrderList" :hide-selected="true" :close-on-select="false">-->
                  <!--</multiselect>-->
                  <el-select v-model="selectedGames" :clearable="true"
                             @change="doGetOrderList(0,sortData)" filterable multiple placeholder="请选择">
                    <el-option
                      v-for="item in games"
                      :label="item.game_name"
                      :value="item">
                    </el-option>
                  </el-select>
                </div>
                <label class="col-sm-2 control-label">渠道名称</label>
                <div class="col-lg-4 col-md-10 col-sm-10">
                  <!--<multiselect v-model="selectedChannel" tag-placeholder="Add this as new tag"-->
                               <!--placeholder="请选择" selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
                               <!--label="name" track-by="channel_id" :options="channels" :multiple="true"-->
                               <!--:taggable="false"-->
                               <!--@input="doGetOrderList" :hide-selected="true" :close-on-select="false">-->
                  <!--</multiselect>-->
                  <el-select v-model="selectedChannel" :clearable="true"
                             @change="doGetOrderList(0,sortData)" filterable multiple placeholder="请选择">
                    <el-option
                      v-for="item in channels"
                      :label="item.name"
                      :value="item">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-sm-12 margin__btm">
                <label class="col-sm-2 control-label control-label_width">商务负责人</label>
                <div class="col-lg-4 col-md-10 col-sm-10">
                  <!--<multiselect v-model="selectedAccessPersons" tag-placeholder="Add this as new tag"-->
                               <!--placeholder="请选择" selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
                               <!--label="nickname" track-by="id" :options="accessPersons" :multiple="false"-->
                               <!--:taggable="false"-->
                               <!--@input="doGetOrderList" :hide-selected="false" :close-on-select="true">-->
                  <!--</multiselect>-->
                  <el-select v-model="selectedAccessPersons" :clearable="true"
                             @change="doGetOrderList(0,sortData)" filterable placeholder="请选择">
                    <el-option
                      v-for="item in accessPersons"
                      :label="item.nickname"
                      :value="item">
                    </el-option>
                  </el-select>
                </div>
                <label class="col-sm-2 control-label">首发时间</label>
                <div class="col-lg-4 col-md-10 col-sm-10">
                  <el-date-picker
                    v-model="time" @change="doGetOrderList(0,sortData)"
                    type="daterange"
                    :range="true"
                    format="yyyy-MM-dd"
                    align="right"
                    :picker-options="pickerOptions2"
                    placeholder="选择日期范围">
                  </el-date-picker>
                </div>
                <!--<label class="col-sm-2 control-label">审核状态</label>-->
                <!--<div class="col-lg-4 col-md-10 col-sm-10">-->
                  <!--<el-select v-model="selectedState" :clearable="true"-->
                             <!--@change="doGetOrderList(0,sortData)" filterable placeholder="请选择">-->
                    <!--<el-option-->
                      <!--v-for="item in state"-->
                      <!--:label="item.state"-->
                      <!--:value="item">-->
                    <!--</el-option>-->
                  <!--</el-select>-->
                <!--</div>-->
              </div>
              <!--<div class="col-sm-12 margin__btm">-->
                <!--<label class="col-sm-2 control-label">审核财务</label>-->
                <!--<div class="col-lg-4 col-md-10 col-sm-10">-->
                  <!--<el-select v-model="selectedFinance" :clearable="true"-->
                             <!--@change="doGetOrderList(0,sortData)" filterable placeholder="请选择">-->
                    <!--<el-option-->
                      <!--v-for="item in finance"-->
                      <!--:label="item.nickname"-->
                      <!--:value="item">-->
                    <!--</el-option>-->
                  <!--</el-select>-->
                <!--</div>-->
              <!--</div>-->
            </div>
          </div>
          <div class="col-md-6">
            <div class="row form-group">
              <!--<div class="col-md-3 post-btn" v-if="userInfo.info.department_id==237||userInfo.isAdmin==true">-->
              <div class="col-md-3 post-btn" >
                <button class="btn btn-primary btn-block" @click=addChannelAccess>批量添加</button>
              </div>
            </div>
          </div>
        </div>
        <div class="box-body">
          <el-select v-model="selectedHeader" :clearable="true"
                     @change="showHeader" multiple placeholder="请选择">
            <el-option
              v-for="item in table_header"
              :key="item.id"
              :label="item.header_name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-table
            class="table table-bordered table-hover"
            :data="items"
            border
            @sort-change="handleSort"
            stripe
            style="width: 100%">
            <el-table-column
              fixed
              prop="game_name"
              label="游戏名称"
              v-if="!table_header[0].state"
              min-width="140">
              <template scope="scope">
                <p class="max_widthsd">{{ scope.row.game==null?"":scope.row.game.game_name }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="channel"
              label="渠道名称"
              v-if="!table_header[1].state"
              min-width="140">
              <template scope="scope">
                <p class="max_widthsd">{{ scope.row.channel==null?"":scope.row.channel.name }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="publish_time"
              label="首发时间"
              v-if="!table_header[2].state"
              sortable='custom'
              min-width="140">
              <template scope="scope">
                <p class="max_widthsd">{{ scope.row.publish_time | stampToTime }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="lexing"
              label="我方主体"
              v-if="!table_header[3].state"
              min-width="140">
              <template scope="scope">
                <p class="max_widthsd">{{ scope.row.body_my==1?"云端":"有量" }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="ip"
              label="合作方式"
              v-if="!table_header[4].state"
              min-width="140">
              <template scope="scope">
                <p class="max_widthsd">{{ scope.row.hezuo==null?"":scope.row.hezuo.name }}</p>
              </template>
              <!---->
            </el-table-column>
            <el-table-column
              prop="star"
              label="分成比例"
              v-if="!table_header[5].state"
              min-width="120">
              <template scope="scope">
                <p class="max_widthsd">
                  <span v-if="scope.row.ladder_front!=null && scope.row.ladder_front.length==1">
                {{ parseFloat(scope.row.ladder_front[0].ratio*100).toFixed(2) }} :
                {{ parseFloat(scope.row.ladder_front[0].slotting_fee*100).toFixed(2) }}
              </span>
                  <span v-if="scope.row.ladder_front!=null && scope.row.ladder_front.length>1">
                <el-button type="primary" @click="opendialog(scope.row.ladders)">查看</el-button>
              </span>
                </p>
              </template>
            </el-table-column>
            <el-table-column
              prop="budget"
              label="商务负责人"
              v-if="!table_header[6].state"
              min-width="120">
              <template scope="scope">
                <p class="max_widthsd">{{ scope.row.business==null?"":scope.row.business.nickname }}</p>
              </template>
            </el-table-column>
            <!--<el-table-column-->
              <!--prop="package"-->
              <!--label="审核状态"-->
              <!--width="160">-->
              <!--<template scope="scope">-->
                <!--<p>-->
                  <!--<span :style="{color:'black'}" v-if="scope.row.state=='未审核'">{{ scope.row.state }}</span>-->
                  <!--<span :style="{color:'DarkGoldenRod'}" v-if="scope.row.state=='审核中'">{{ scope.row.state }}</span>-->
                  <!--<span :style="{color:'green'}" v-if="scope.row.state=='已通过'">{{ scope.row.state }}</span>-->
                  <!--<span :style="{color:'red'}" v-if="scope.row.state=='未通过'">{{ scope.row.state }}</span>-->
                <!--</p>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="zip"-->
              <!--label="审核财务"-->
              <!--class="text-center"-->
              <!--width="140">-->
              <!--<template scope="scope">-->
                <!--<p>-->
                  <!--{{ scope.row.caiwu==null?"":scope.row.caiwu.nickname }}-->
                <!--</p>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column
              fixed="right"
                    prop="channel_update"
                    label="更新人"
              v-if="!table_header[7].state"
                    class="text-center"
              min-width="140">
              <template scope="scope">
                <p class="max_widthsd">
                  {{ scope.row.update_user==null ? "" : scope.row.update_user.nickname }} {{ scope.row.update_channeltime | stampToTime }}
                </p>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作111"
              v-if="!table_header[8].state"
              min-width="120">
              <template scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" >
                  <a class="fa fa-edit" @click="editChannelAccess(scope.row.game_id, scope.row.channel_code)" title="编辑"></a>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <el-dialog title="阶梯分成" v-model="dialogVisible" size="tiny">
            <el-row :gutter="24" style="margin-left:0px;text-align: center">
              <!--<el-col :span="12">生效时间</el-col>-->
              <el-col :span="12">我方比例</el-col>
              <el-col :span="12">通道费</el-col>
            </el-row>
            <el-row :gutter="24" style="margin-left:0px;" v-for="ladder in ladders">

              <el-col :span="12" align="center">
                <span>{{ parseFloat(ladder.ratio*100).toFixed(2) }}%</span>
              </el-col>
              <el-col :span="12" align="center">
                <span>{{ parseFloat(ladder.slotting_fee*100).toFixed(2) }}%</span>
              </el-col>
              <span>&nbsp;</span>
            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>
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

  .margin__btm {
    margin-bottom: 20px;
  }

  .control-label {
    width: 104px;
  }
</style>
<style>
  .max_widthsd {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
  }

  .max_widthsd:hover {
    text-overflow: inherit;
    overflow: visible;
    white-space: pre-line;
  }

  .el-table .el-tooltip__rel {
    display: inline !important;
  }
</style>
<script>
  import Multiselect from 'vue-multiselect'
  import utils from '../../publicjs/utils'
  import {Pagination} from 'element-ui'
  export default {
    components: {
      Multiselect,
      Pagination,
      utils
    },
    data: function () {
      return {
        sortData: {},
        pageInfo: {
          currentPage: 1,
          limit: ENV.PAGE_SHOW_COUNT,
          offset: 0,
          total: 0,
        },
        selectedHeader:[],
        table_header:[
          {
            id:0,
            header_name:"游戏名称",
            state:false
          },{
            id:1,
            header_name:"渠道名称",
            state:false
          },{
            id:2,
            header_name:"首发时间",
            state:false
          },{
            id:3,
            header_name:"我方主体",
            state:false
          },{
            id:4,
            header_name:"合作方式",
            state:true
          },{
            id:5,
            header_name:"分成比例",
            state:true
          },{
            id:6,
            header_name:"商务负责人",
            state:false
          },{
            id:7,
            header_name:"更新人",
            state:false
          },{
            id:8,
            header_name:"操作",
            state:false
          }
        ],
        selectedGames: [],
        games: [],
        selectedAccessPersons: null,
        accessPersons: [],
        selectedState: null,
        state: [
          {id: 1, state: '未审核'},
          {id: 2, state: '审核中'},
          {id: 3, state: '已通过'},
          {id: 4, state: '未通过'}],
        selectedFinance: null,
        finance: [],
        selectedChannel: [],
        channels: [],
        userInfo: null,

        parentMessage: 'Parent',
        items: [],
        time: '',
        dialogVisible: false,
        gridData: [],
        gameName: "",
        ladders: [],
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    methods: {
      opendialog: function (ladders) {
        this.ladders = []
        if (ladders != null) {
          let ladder = JSON.parse(ladders)
          for (let i in ladder) {
//            this.ladders.push({username:ladder[i].split(":")[0],password:ladder[i].split(":")[1]})
            this.ladders.push(ladder[i])
          }
        }

        this.dialogVisible = true
      },
      showHeader: function () {
        for(let i in this.table_header){
          if(i==4||i==5){
            this.table_header[i].state = true
          }
          this.table_header[i].state = false
        }
        for(let i in this.selectedHeader){
          console.log(this.table_header[this.selectedHeader[i]])
          console.log(this.table_header)
          this.table_header[this.selectedHeader[i]].state = true
          console.log(this.table_header[this.selectedHeader[i]])
        }
      },
      addChannelAccess: function () {
        this.$router.push({path: '/home/addChannelAccess'})
      },
      handleCurrentChange(currentPage) {
        let offset = util.buildOffsetByPage(currentPage, this.pageInfo.limit)
        this.pageInfo.offset = offset
        this.doGetOrderList(currentPage, this.sortData)
      },
      //获取商务负责人列表
      getAccessPersonlist: function () {
        var url = '/user/devment/237'
        this.$http.get(url)
          .then((res) => {
            this.accessPersons = res.body
          })
      },
      //获取财务列表
      getFinancePersonlist: function () {
        var url = '/user/devment/7'
        this.$http.get(url)
          .then((res) => {
            this.finance = res.body
          })
      },
      //编辑
      editChannelAccess: function (gameId, channelCode) {
        this.$router.push({
          path: '/home/editChannelAccess/?gameId=' + gameId + '&channel=' + channelCode
        })
      },
      getGameSelectList:function () {
        var url = '/game/select' + '?flag=qdjr'//渠道接入
        this.$http.get(url)
          .then((res) => {
            this.games = res.body
          })
      },
      getChannelList: function () {
        var url = '/channel/'
        this.$http.get(url)
          .then((res) => {
            this.channels = res.body.data
          })
      },
      doGetOrderList (page = 0, sortData) {
        if (page == 0) {
          this.pageInfo.offset = 0
        }
        let gameIds = []
        if (this.selectedGames.length != 0) {
          for (let i in this.selectedGames) {
            gameIds.push(this.selectedGames[i].game_id)
          }
        }

        let channels = []
        if (this.selectedChannel.length != 0) {
          for (let i in this.selectedChannel) {
            channels.push(this.selectedChannel[i].cp)
          }
        }

        let dates = []
        if (this.time.length > 1) {
          if (this.time[0] != null) {
            dates.push(this.time[0] / 1000)
          }
          if (this.time[1] != null) {
            dates.push(this.time[1] / 1000)
          }
        }

        let que = {
          "gameids": gameIds.join(","),
          "channels": channels.join(","),
          "business": this.selectedAccessPersons == null ? "" : this.selectedAccessPersons.id == undefined ? "" : this.selectedAccessPersons.id,
//          "state": this.selectedState == null ? "" : this.selectedState.id == undefined ? "" : this.selectedState.id,
//          "finance": this.selectedFinance == null ? "" : this.selectedFinance.id == undefined ? "" : this.selectedFinance.id,
          "time": dates.join(","),
          "limit": this.pageInfo.limit,
          "offset": this.pageInfo.offset,
        }

        if(sortData){
          let order = sortData.order
          let prop = sortData.prop
          let isDescending = order === 'descending'
          if(order){
            if(isDescending){
              que.order = "desc"
            }else{
              que.order = "asc"
            }
          }else{
            que.order = "desc"
          }

          if(prop){
            que.sortby = prop
          }else{
            que.sortby = "create_time"
          }
        }

        let query = util.buildGetParams(que)
        var url = '/channelaccess/?' + query

        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data
//            for (let i in this.items) {
//              if (this.items[i].state == 1) {
//                this.items[i].state = "未审核"
//              } else if (this.items[i].state == 2) {
//                this.items[i].state = "审核中"
//              } else if (this.items[i].state == 3) {
//                this.items[i].state = "已通过"
//              } else {
//                this.items[i].state = "未通过"
//              }
//            }
            this.pageInfo.total = res.body.total
          })
      },
      handleSort(obj) {
        if (!obj.prop){
          return
        }
        this.sortData = obj
        this.doGetOrderList(0, this.sortData)
      },
    },
    mounted: function () {
        this.getGameSelectList();
        this.doGetOrderList(0, this.sortData);
        this.getAccessPersonlist();
        this.getFinancePersonlist();
        this.getChannelList();
      let selected = [4,5]
      this.selectedHeader= selected
    },
  }
</script>

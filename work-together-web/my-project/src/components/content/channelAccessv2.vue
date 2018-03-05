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
                <div class="col-lg-4 col-md-10 col-sm-10 ipt_jianjus">
                  <el-select v-model="selectedGames" :clearable="true"
                             @change="doGetOrderList(0,sortData)" filterable multiple placeholder="请选择">
                    <el-option
                      v-for="item in games"
                      :label="item.game_name"
                      :value="item.game_id">
                    </el-option>
                  </el-select>
                </div>
                <label class="col-sm-2 control-label">渠道名称</label>
                <div class="col-lg-4 col-md-10 col-sm-10">
                  <el-select v-model="selectedChannel" :clearable="true"
                             @change="doGetOrderList(0,sortData)" filterable multiple placeholder="请选择">
                    <el-option
                      v-for="item in channels"
                      :label="item.name"
                      :value="item.cp">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-sm-12 margin__btm">
                <label class="col-sm-2 control-label control-label_width">商务负责人</label>
                <div class="col-lg-4 col-md-10 col-sm-10 ipt_jianjus">
                  <el-select v-model="selectedAccessPersons" :clearable="true"
                             @change="doGetOrderList(0,sortData)" filterable placeholder="请选择">
                    <el-option
                      v-for="item in accessPersons"
                      :label="item.nickname"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
                <label class="col-sm-2 control-label">首发时间</label>
                <div class="col-lg-4 col-md-10 col-sm-10 ipt_jianjus">
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
              </div><div class="col-sm-12 margin__btm">
                <label class="col-sm-2 control-label">接入时间</label>
                <div class="col-lg-4 col-md-10 col-sm-10 ipt_jianjus">
                  <el-date-picker
                    v-model="accTime" @change="doGetOrderList(0,sortData)"
                    type="daterange"
                    :range="true"
                    format="yyyy-MM-dd"
                    align="right"
                    :picker-options="pickerOptions2"
                    placeholder="选择日期范围">
                  </el-date-picker>
                </div>
              </div>
            </div>
          </div>
          <!--<div class="col-md-6">-->
            <!--<div class="row form-group">-->
              <!--<div class="col-md-3 post-btn" >-->
                <!--<button style="margin-top: 10px" class="btn btn-primary btn-block" @click=addChannelAccess>批量添加</button>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
          <div class="col-md-12 col-sm-12 ">
            <el-tag
              class="ontags"
              v-for="tag in tags"
              :key="tag.user_id"
              :type="tag.type">
              {{tag.nick_name}}今日接入：{{tag.total}}个渠道
            </el-tag>
          </div>
        </div>
        <p class="box-body">共铺：<span style="color: red;font-size: 24px">{{itemstatol}}</span>渠道</p>
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
            v-loading="isLoading"
            element-loading-text="拼命加载中"
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
                <p>
                  <span v-if="scope.row.ladder_front!=null && scope.row.ladder_front.length==1">
                {{ parseFloat(parseFloat(scope.row.ladder_front[0].ratio*100).toFixed(2)) }}% :
                {{ parseFloat(parseFloat(scope.row.ladder_front[0].slotting_fee*100).toFixed(2)) }}%
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
            <el-table-column
              prop="create_time"
              label="渠道接入时间"
              width="">
              <template scope="scope">
                <p>{{ scope.row.create_time | stampToTime }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="budget"
              label="接入状态"
              v-if="!table_header[7].state"
              min-width="140">
              <template scope="scope">
                <p class="max_widthsd" style="color: green" v-if="scope.row.access_state==1">上架中({{ scope.row.state_update_user==null?"":scope.row.state_update_user.nickname }} {{ scope.row.access_update_time | stampToTimeFull }})</p>
                <p class="max_widthsd" style="color: red" v-else-if="scope.row.access_state==2">已下架({{ scope.row.state_update_user==null?"":scope.row.state_update_user.nickname }} {{ scope.row.access_update_time | stampToTimeFull }})</p>
                <p class="max_widthsd" v-else="">——</p>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              prop="channel_update"
              label="更新人"
              v-if="!table_header[8].state"
              class="text-center"
              min-width="120">
              <template scope="scope">
                <p class="max_widthsd">
                  {{ scope.row.update_user==null ? "" : scope.row.update_user.nickname }} {{ scope.row.update_channeltime | stampToTime }}
                </p>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              v-if="!table_header[9].state"
              min-width="120">
              <template scope="scope">
                <!--<el-tooltip class="item" effect="dark" content="编辑" placement="top-start" >-->
                  <a class="fa fa-eye" @click=detailItem(scope.row.id) title="查看"></a>
                  <a class="fa fa-edit" @click="editChannelAccess(scope.row.id)" title="编辑"></a>
                <!--</el-tooltip>-->
              </template>
            </el-table-column>
          </el-table>

          <el-dialog title="阶梯分成" v-model="dialogVisible" size="small">
            <el-table
              :data="ladders"
              border
              style="width: 100%">
              <el-table-column
                prop=""
                label="生效时间"
                width="195">
                <template scope="scope">
                  <p>{{ scope.row.start_time }} ~ {{ scope.row.end_time}}</p>
                </template>
              </el-table-column>
              <el-table-column label="规则">
                <el-table-column
                  prop="money"
                  label="金额"
                  width="">
                  <template scope="scope">
                    <p v-for="rule in scope.row.rules">
                      <span v-if="rule.type=='money'">{{rule.begin}} ~ {{rule.end}}</span>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="time"
                  label="时间"
                  width="">
                  <template scope="scope">
                    <p v-for="rule in scope.row.rules">
                      <span v-if="rule.type=='time'">{{rule.begin}} ~ {{rule.end}}</span>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="user"
                  label="用户"
                  width="">
                  <template scope="scope">
                    <p v-for="rule in scope.row.rules">
                      <span v-if="rule.type=='user'">{{rule.begin}} ~ {{rule.end}}</span>
                    </p>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                label="我方比例">
                <template scope="scope">
                  <p>{{ parseFloat(parseFloat(scope.row.ratio*100).toFixed(2)) }}%</p>
                </template>
              </el-table-column>
              <el-table-column
                label="通道费">
                <template scope="scope">
                  <p>{{ parseFloat(parseFloat(scope.row.slotting_fee*100).toFixed(2)) }}%</p>
                </template>
              </el-table-column>
            </el-table>
            <!--<el-row :gutter="24" style="margin-left:0px;text-align: center">-->
              <!--&lt;!&ndash;<el-col :span="12">生效时间</el-col>&ndash;&gt;-->
              <!--<el-col :span="12">我方比例</el-col>-->
              <!--<el-col :span="12">通道费</el-col>-->
            <!--</el-row>-->
            <!--<el-row :gutter="24" style="margin-left:0px;" v-for="ladder in ladders">-->

              <!--<el-col :span="12" align="center">-->
                <!--<span>{{ parseFloat(ladder.ratio*100).toFixed(2) }}%</span>-->
              <!--</el-col>-->
              <!--<el-col :span="12" align="center">-->
                <!--<span>{{ parseFloat(ladder.slotting_fee*100).toFixed(2) }}%</span>-->
              <!--</el-col>-->
              <!--<span>&nbsp;</span>-->
            <!--</el-row>-->
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>
          <Pagination
            v-show="pageInfo.total > pageInfo.limit"
            @current-change="handleCurrentChange"
            :current-page="pageInfo.currentPage"
            :page-size="pageInfo.limit"
            layout="prev, pager, next, jumper, total"
            :total="pageInfo.total">
          </Pagination>
        </div>
      </div>
    </div>

    <el-dialog
      title="添加渠道"
      v-model="isShowAddForm"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <addChannelAccess @close="onEditClose"></addChannelAccess>
    </el-dialog>
    <el-dialog
      :title="readonly?'查看渠道接入':'编辑渠道接入'"
      v-model="isShowEditForm"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <editChannelAccess :rand="rand" :editId="editId" :remarks="remarks" :readonly="readonly" @close="onEditClose"></editChannelAccess>
    </el-dialog>
  </div>
</template>
<style scoped>
  .form-group{
    margin-bottom: 0;
  }
  .ontags {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    margin-top: 10px;
  }
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
  import utils from '../../publicjs/utils'
  import {Pagination} from 'element-ui'
  import addChannelAccessv2 from './addChannelAccessv2'
  import editChannelAccessv2 from './editChannelAccessv2'

  export default {
    components: {
      Pagination,
      utils,
      addChannelAccess: addChannelAccessv2,
      editChannelAccess: editChannelAccessv2
    },
    data: function () {
      return {
        tags: [],
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
            header_name:"接入状态",
            state:false
          },{
            id:8,
            header_name:"更新人",
            state:false
          },{
            id:9,
            header_name:"操作",
            state:false
          }
        ],
        selectedGames: [],
        games: [],
        selectedAccessPersons: null,
        accessPersons: [],
        selectedState: null,
        selectedFinance: null,
        finance: [],
        selectedChannel: [],
        channels: [],
        userInfo: null,

        parentMessage: 'Parent',
        items: [],
        isLoading: true,
        time: '',
        itemstatol: '',
        accTime: '',
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

        isShowAddForm: false,
        isShowEditForm: false,
        editId: 0,
        readonly: false,
        remarks: '',
        gameId: 0,
        channelCode: '',
        rand: 0,
      }
    },
    methods: {
      showHeader: function () {
        for(let i in this.table_header){
          if(i==4||i==5){
            this.table_header[i].state = true
          }
          this.table_header[i].state = false
        }
        for(let i in this.selectedHeader){
          this.table_header[this.selectedHeader[i]].state = true
        }
      },
      // 编辑对话框关闭
      onEditClose(needRefresh){
        this.isShowAddForm = false
        this.isShowEditForm = false
        if (needRefresh) {
          this.doGetOrderList()
        }
      },
      opendialog: function (ladders) {
        this.ladders = []
        if (ladders != null) {
          let ladder = JSON.parse(ladders)
          for (let i in ladder) {
            if (ladder[i].rule) {
              let rules = []
              let rulesString = ladder[i].rule.split("&")
              for (let j in rulesString) {
                let ru = rulesString[j]
                let begin, type, end
                [begin, type, end] = ru.split("<")
                rules.push({
                  begin, type, end
                })
              }
              ladder[i].rules = rules
            }
            this.ladders.push(ladder[i])
          }
        }

        this.dialogVisible = true
      },
      addChannelAccess: function () {
        this.readonly = false
        this.isShowAddForm = true
        this.editId = 0

//        this.$router.push({path: '/home/addChannelAccess'})
      },
      gettagsList: function () {
        var url = '/channelaccess/Statistics'
        this.$http.get(url)
          .then((res) => {
            for (let i in res.body) {
              if (res.body[i].total > 0) {
                res.body[i].type = 'success'
              } else {
                res.body[i].type = 'danger'
              }
            }
            this.tags = res.body
          })
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
//      getFinancePersonlist: function () {
//        var url = '/user/devment/7'
//        this.$http.get(url)
//          .then((res) => {
//            this.finance = res.body
//          })
//      },
      //编辑
      editChannelAccess: function (Id) {
        this.readonly = false
        this.isShowEditForm = true
        this.editId = Id
        // this.remarks = Id
        this.rand = Math.random()
      },
      //查看
      detailItem(id){
        this.isShowEditForm = true
        this.editId = id
        this.readonly = true

        this.rand = Math.random()
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
        this.isLoading = true
        if (page == 0) {
          this.pageInfo.offset = 0
        }
        let gameIds = []
        if (this.selectedGames.length != 0) {
          for (let i in this.selectedGames) {
            gameIds.push(this.selectedGames)
          }
        }

        let channels = []
        if (this.selectedChannel.length != 0) {
          for (let i in this.selectedChannel) {
            channels.push(this.selectedChannel)
          }
        }

        let dates = []
        if (this.time.length > 1) {
          if (this.time[0] != null) {
//            console.log( this.time[0])
//            let datasw = parseInt(this.time[0])
            dates.push(Date.parse(new Date(this.time[0])) / 1000)
          }
          if (this.time[1] != null) {
//            let datads = this.time[1] / 1000
            dates.push(parseInt(new Date(new Date(this.time[1]).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000))
          }
        }

        let accTime = []
        if (this.accTime.length > 1) {
          if (this.accTime[0] != null) {
            accTime.push(Date.parse(new Date(this.accTime[0])) / 1000)
          }
          if (this.accTime[1] != null) {
            accTime.push(parseInt(new Date(new Date(this.accTime[1]).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000))
          }
        }

        let que = {
          "gameids": gameIds.join(","),
          "channels": channels.join(","),
          "business": this.selectedAccessPersons == null ? "" : this.selectedAccessPersons == undefined ? "" : this.selectedAccessPersons,
          "time": dates.join(","),
          "accTime": accTime.join(","),
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
        console.log(que)
        let query = util.buildGetParams(que)
        var url = '/channelaccess/?' + query
        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data
            this.itemstatol = res.body.total
            this.pageInfo.total = res.body.total
            this.isLoading = false
            this.gettagsList();
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
      this.isLoading = true
        this.getGameSelectList();
        this.gettagsList();
        this.doGetOrderList(0, this.sortData);
        this.getAccessPersonlist();
//        this.getFinancePersonlist();
        this.getChannelList();

        let selected = [4,5]
        this.selectedHeader= selected
    },
  }
</script>

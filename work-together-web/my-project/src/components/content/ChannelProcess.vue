<template>
  <div>
    <section class="content-header">
      <h1>
        渠道出包流程
        <small>查看渠道出包流程情况</small>
      </h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="col-md-10 form-horizontal">
            <div class="form-group">
              <div class="col-sm-4 margin__btm">
                <label class="col-sm-2 control-label">任务名称：</label>
                <div class="col-lg-4 col-md-9 col-sm-9 ipt_jianjus">
                  <el-select v-model="mission_name" :clearable="true"
                             @change="doGetOrderList(0,sortData)" filterable placeholder="请选择">
                    <el-option
                      v-for="item in mission.task_name"
                      :label="item.task_name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-sm-4 margin__btm">
                <label class="col-sm-2 control-label">渠道名称：</label>
                <div class="col-lg-4 col-md-9 col-sm-9 ipt_jianjus">
                  <el-select v-model="ischannel_name" :clearable="true"
                             @change="doGetOrderList(0,sortData)" filterable placeholder="请选择">
                    <el-option
                      v-for="item in mission.channel_name"
                      :label="item.channel_name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-sm-4 margin__btm">
                <label class="col-sm-2 control-label">游戏名称：</label>
                <div class="col-lg-4 col-md-9 col-sm-9 ipt_jianjus">
                  <el-select v-model="isgame_name" :clearable="true"
                             @change="doGetOrderList(0,sortData)" filterable placeholder="请选择">
                    <el-option
                      v-for="item in mission.game_name"
                      :label="item.game_name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-10 form-horizontal">
            <div class="form-group">
              <!--<div class="col-sm-4 margin__btm">-->
                <!--<label class="col-sm-2 control-label">创建时间：</label>-->
                <!--<div class="col-lg-4 col-md-9 col-sm-9 ipt_jianjus">-->
                  <!--<el-date-picker-->
                    <!--v-model="times"-->
                    <!--@change="doGetOrderList(0,sortData)"-->
                    <!--range-separator="至"-->
                    <!--type="daterange"-->
                    <!--placeholder="选择时间范围">-->
                  <!--</el-date-picker>-->
                <!--</div>-->
              <!--</div>-->
              <div class="col-sm-4 margin__btm">
                <label class="col-sm-2 control-label">流程状态：</label>
                <div class="col-lg-4 col-md-9 col-sm-9 ipt_jianjus">
                  <el-select v-model="ProcessStatus" :clearable="true"
                             @change="doGetOrderList(0,sortData)" filterable placeholder="请选择">
                    <el-option
                      v-for="item in onstatus"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
          <div v-if="current_node_id === true" class="col-md-6">
            <div class="row form-group">
              <div style="width: 150px">
                <button style="margin-top: 10px" class="btn btn-primary btn-block" @click=addChannelAccess>新增渠道出包流程
                </button>
              </div>
            </div>
          </div>
          <!--<div class="col-md-12 col-sm-12 ">-->
          <!--<el-tag-->
          <!--class="ontags"-->
          <!--v-for="tag in tags"-->
          <!--:key="tag.user_id"-->
          <!--:type="tag.type">-->
          <!--{{tag.nick_name}}今日接入：{{tag.total}}个渠道-->
          <!--</el-tag>-->
          <!--</div>-->
        </div>
        <p class="box-body">总共：<span style="color: red;font-size: 24px">{{itemstatol}}</span>个任务</p>
        <div class="box-body">
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
              prop="task_name"
              label="任务名称"
            >
              <template scope="scope">
                <p class="max_widthsd">{{ scope.row.task_name }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="task_name"
              label="渠道名称"
            >
              <template scope="scope">
                <p class="max_widthsd">{{ scope.row.channel_name }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="task_name"
              label="游戏名称"
            >
              <template scope="scope">
                <p class="max_widthsd">{{ scope.row.game_name }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="current_progress_name"
              label="当前进度"
            >
            </el-table-column>
            <el-table-column
              prop="create_time"
              label="创建人"
            >
              <template scope="scope">
                <p class="max_widthsd">{{scope.row.create_name}}（{{ scope.row.create_time | stampToTimeFull }}）</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="remarks"
              label="备注"
            >
            </el-table-column>
            <el-table-column
              prop="status"
              label="接入状态"
            >
              <template scope="scope">
                <p class="max_widthsd" style="color: green" v-if="scope.row.status==1">成功</p>
                <p class="max_widthsd" style="color: red" v-else-if="scope.row.status==2">失败</p>
                <p class="max_widthsd" style="color: red" v-else-if="scope.row.status==3">挂起</p>
                <p class="max_widthsd" style="color: red" v-else-if="scope.row.status==4">创建</p>
                <p class="max_widthsd" style="color: red" v-else-if="scope.row.status==5">其他</p>
                <p class="max_widthsd" style="color: red" v-else-if="scope.row.status==6">流程中</p>
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="更新人"
            >
              <template scope="scope">
                <p class="max_widthsd">{{scope.row.update_name}}（{{ scope.row.update_time | stampToTimeFull }}）</p>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
            >
              <template scope="scope">
                <!--<el-tooltip class="item" effect="dark" content="编辑" placement="top-start" >-->
                <a class="fa fa-eye" @click=detailItem(scope.row) title="查看"></a>
                <!--<a class="fa fa-edit" @click="editChannelAccess(scope.row.id)" title="编辑"></a>-->
                <a v-if="scope.row.status!=1" class="fa fa-list-ol" @click="addWorkflow(scope.row)" title="工作流"></a>
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
      title="工作流"
      v-model="isWorkflow"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <editChannelAccess :rand="rand" :editId="editId" :workflow="true" :remarks="remarks"
                         @close="onEditClose"></editChannelAccess>
    </el-dialog>
    <el-dialog
      :title="readonly?'查看渠道接入':'编辑渠道接入'"
      v-model="isShowEditForm"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <editChannelAccess :rand="rand" :editId="editId"  :workflow="true" :remarks="remarks" :readonly="readonly"
                         @close="onEditClose"></editChannelAccess>
    </el-dialog>
  </div>
</template>
<style scoped>
  .form-group {
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
        // tags: [],
        sortData: {},
        pageInfo: {
          currentPage: 1,
          limit: ENV.PAGE_SHOW_COUNT,
          offset: 0,
          total: 0,
        },
        selectedHeader: [],
        ProcessStatus: '',
        mission_name: '',
        ischannel_name: '',
        isgame_name: '',
        times: [],
        onstatus: [
          {
            name: '成功',
            id: '1'
          },
          {
            name: '失败',
            id: '2'
          },
          {
            name: '挂起',
            id: '3'
          },
          {
            name: '创建',
            id: '4'
          },
          {
            name: '其他',
            id: '5'
          },
          {
            name: '流程中',
            id: '6'
          }
        ],
        selectedAccessPersons: null,
        accessPersons: [],
        selectedState: null,
        mission: [],
        selectedFinance: null,
        finance: [],
        selectedChannel: [],
        channels: [],
        workflow_name: null,
        inonUser: null,

        parentMessage: 'Parent',
        items: [],
        isLoading: true,
        time: '',
        itemstatol: '',
        accTime: '',
        dialogVisible: false,
        current_node_id: false,
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
        isWorkflow: false,
        // user_info: '',
        gameId: 0,
        channelCode: '',
        workflow_id: '',
        remarks: '',
        rand: 0,
      }
    },
    watch:{
      '$route': 'doGetOrderList'
    },
    methods: {
      // 编辑对话框关闭
      onEditClose(needRefresh) {
        this.isShowAddForm = false
        this.isShowEditForm = false
        this.isWorkflow = false
        if (needRefresh) {
          this.$router.push({path: '/home/ChannelProcess'})
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
      //编辑
      editChannelAccess: function (Id) {
        this.readonly = false
        this.isShowEditForm = true
        this.editId = Id
        this.remarks = Id
        this.rand = Math.random()
      },
      // 工作流
      addWorkflow: function (Id) {
        this.isWorkflow = true
        this.editId = Id.id
        this.remarks = Id
        this.rand = Math.random()
      },
      //查看
      detailItem(id) {
        this.readonly = true
        this.isShowEditForm = true
        this.editId = id.id
        this.remarks = id
        this.rand = Math.random()
      },
      getChannelList: function () {
        var url = '/channel/'
        this.$http.get(url)
          .then((res) => {
            this.channels = res.body.data
          })
      },
      getuserinfo() {
        // var url = '/workflow_node/workflow_node_id/'
        // this.$http.get(url)
        //   .then((res) => {
        //     this.user_info = res.body
        //   })
        var is_url = '/workflow_task/condition'
        this.$http.get(is_url)
          .then((res) => {
            console.log(res.body)
            this.mission = res.body
          })
      },
      doGetOrderList(page = 0, sortData) {
        let ids = this.$route.query.id
        this.isLoading = true
        var onUrl = '/userown/'
        this.$http.get(onUrl)
          .then((res) => {
            this.inonUser = res.body
            if (this.inonUser.info.department_name == '商务') {
              this.current_node_id = true
            } else {
              this.current_node_id = false
            }
            var onsurl = '/workflow_name/'
            this.$http.get(onsurl)
              .then((res) => {
                this.workflow_name = res.body
                for (let i in this.workflow_name.data) {
                  if (this.workflow_name.data[i].tb_nickname === '发包流程') {
                    this.workflow_id = this.workflow_name.data[i].id
                  }
                }
                if (page == 0) {
                  this.pageInfo.offset = 0
                }
//         let gameIds = []
//         if (this.selectedGames.length != 0) {
//           for (let i in this.selectedGames) {
//             gameIds.push(this.selectedGames)
//           }
//         }
//
//         let channels = []
//         if (this.selectedChannel.length != 0) {
//           for (let i in this.selectedChannel) {
//             channels.push(this.selectedChannel)
//           }
//         }
//
//         let dates = []
//         if (this.time.length > 1) {
//           if (this.time[0] != null) {
// //            console.log( this.time[0])
// //            let datasw = parseInt(this.time[0])
//             dates.push(Date.parse(new Date(this.time[0])) / 1000)
//           }
//           if (this.time[1] != null) {
// //            let datads = this.time[1] / 1000
//             dates.push(parseInt(new Date(new Date(this.time[1]).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000))
//           }
//         }
//
//         let accTime = []
//         if (this.accTime.length > 1) {
//           if (this.accTime[0] != null) {
//             accTime.push(Date.parse(new Date(this.accTime[0])) / 1000)
//           }
//           if (this.accTime[1] != null) {
//             accTime.push(parseInt(new Date(new Date(this.accTime[1]).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000))
//           }
//
                let que = {
                  //   "gameids": gameIds.join(","),
                  //   "channels": channels.join(","),
                  //   "business": this.selectedAccessPersons == null ? "" : this.selectedAccessPersons == undefined ? "" : this.selectedAccessPersons,
                  //   "time": dates.join(","),
                  //   "accTime": accTime.join(","),
                  "limit": this.pageInfo.limit,
                  "offset": this.pageInfo.offset,
                  'sortby': "create_time",
                  'order': "desc",
                  "wf_name_id": this.workflow_id,
                  "department_id": this.inonUser.info.department_id.toString()
                }
                if (ids && this.ProcessStatus != '') {
                    que.query = 'status:' + parseInt(this.ProcessStatus) + ';id:' + ids
                } else if (ids && this.ProcessStatus == '') {
                  que.query = 'id:' + ids
                } else if(!ids && this.ProcessStatus != '') {
                  que.query = 'status:' + parseInt(this.ProcessStatus)
                } else {
                  que.query = ''
                }
                if (this.mission_name != '') {
                  for (let f in this.mission.task_name) {
                    if (this.mission.task_name[f].id === this.mission_name) {
                      if (que.query === '') {
                        que.query += 'task_name:' + this.mission.task_name[f].task_name
                      } else {
                        que.query += ';task_name:' + this.mission.task_name[f].task_name
                      }
                    }
                  }
                }
                if (this.ischannel_name != '') {
                  for (let f in this.mission.channel_name) {
                    if (this.mission.channel_name[f].id === this.ischannel_name) {
                      if (que.query === '') {
                        que.query += 'channel_name:' + this.mission.channel_name[f].channel_name
                      } else {
                        que.query += ';channel_name:' + this.mission.channel_name[f].channel_name
                      }
                    }
                  }
                }
                if (this.isgame_name != '') {
                  for (let f in this.mission.game_name) {
                    if (this.mission.game_name[f].id === this.isgame_name) {
                      if (que.query === '') {
                        que.query += 'game_name:' + this.mission.game_name[f].game_name
                      } else {
                        que.query += ';game_name:' + this.mission.game_name[f].game_name
                      }
                    }
                  }
                }
                // if (this.times.length > 1) {
                //   if (this.times[0] !== null) {
                //     if (que.query === '') {
                //       que.query += 'create_time:>=' + this.times[0] / 1000
                //     } else {
                //       que.query += ';create_time:>=' + this.times[0] / 1000
                //     }
                //   }
                //   if (this.times[1] !== null) {
                //     que.query += ';create_time:<=' + parseInt(new Date(new Date(this.times[1]).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000)
                //   }
                // }
                let query = util.buildGetParams(que)
                var url = '/workflow_task/?' + query
                this.$http.get(url)
                  .then((res) => {
                    this.items = res.body.data
                    this.itemstatol = res.body.total
                    this.pageInfo.total = res.body.total
                    this.isLoading = false
                    // this.gettagsList();
                  })
              })

          })
      },
      handleSort(obj) {
        if (!obj.prop) {
          return
        }
        this.sortData = obj
        this.doGetOrderList(0, this.sortData)
      },
    },
    mounted: function () {
      this.isLoading = true
      this.getuserinfo();
// this.gettagsList();
      this.doGetOrderList(0, this.sortData);
      this.getAccessPersonlist();
//        this.getFinancePersonlist();
      this.getChannelList();
    },
  }
</script>

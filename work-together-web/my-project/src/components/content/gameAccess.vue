<template>
  <div>
    <section class="content-header">
      <h1>
        游戏接入
        <small>查看游戏接入情况</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>游戏管理</li>
        <li>
          <router-link to="/home/gameAccess">游戏接入</router-link>
        </li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="col-md-10 form-horizontal">
            <div class="form-group">
              <div class="col-sm-12 margin__btm">
                <label class="col-sm-2 control-label">游戏名称:</label>
                <div class="col-lg-4 col-md-10 col-sm-10 ipt_jianjus">
                  <el-select v-model="selectedGames"
                             filterable
                             multiple
                             :multiple="true" :clearable="true" :filterable="true"
                             @change="doGetOrderList"
                             placeholder="请选择">
                    <el-option
                      v-for="item in games"
                      :label="item.game_name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
                <label class="col-sm-2 control-label">首发时间:</label>
                <div class="col-lg-4 col-md-10 col-sm-10 ipt_jianjus">
                  <el-date-picker
                    v-model="time" @change="doGetOrderList"
                    type="daterange"
                    :range="true"
                    format="yyyy-MM-dd"
                    align="right"
                    :picker-options="pickerOptions2"
                    placeholder="选择日期范围">
                  </el-date-picker>
                </div>
              </div>
              <div class="col-sm-12 margin__btm">
                <label class="col-sm-2 control-label">接 入 人:</label>
                <div class="col-lg-4 col-md-10 col-sm-10 ipt_jianjus">
                  <el-select v-model="mentionPeople"
                             filterable
                             multiple
                             :multiple="true" :clearable="true" :filterable="true"
                             @change="doGetOrderList"
                             placeholder="请选择">
                    <el-option
                      v-for="item in onmentionPeople"
                      :label="item.nickname"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
                <label class="col-sm-2 control-label">接入时间:</label>
                <div class="col-lg-4 col-md-10 col-sm-10 ipt_jianjus">
                  <el-date-picker
                    v-model="accTime" @change="doGetOrderList"
                    type="daterange"
                    :range="true"
                    format="yyyy-MM-dd"
                    align="right"
                    :picker-options="pickerOptions2"
                    placeholder="选择日期范围">
                  </el-date-picker>
                </div>
              </div>
              <div class="col-sm-12 margin__btm">
                <label class="col-sm-2 control-label">发 行 商:</label>
                <div class="col-lg-4 col-md-10 col-sm-10 ipt_jianjus">
                  <el-select v-model="selectedPublisher" filterable clearable multiple
                             @change="doGetOrderList"
                             placeholder="请选择">
                    <el-option
                      v-for="item in Publisher"
                      :label="item.company_name"
                      :key="item.id"
                      :value="item.company_id">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="row form-group">
                <div class="col-md-4 post-btn">
                  <a style="margin-top: 10px" class="btn btn-block btn-primary" :href="downloadUrl" :disabled="downloadUrl==''">导出excel</a>
                </div>
                <el-tag
                  class="ontags"
                  v-for="tag in tags"
                  :key="tag.user_id"
                  :type="tag.type">
                  {{tag.nick_name}}今日接入：{{tag.total}}款游戏
                </el-tag>
              </div>
            </div>
          </div>
        </div>
        <div class="_list_tab">
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
              stripe
              @sort-change="handleSort"
              style="width: 100%">
              <el-table-column
                fixed
                prop="game_name"
                label="游戏名称"
                v-if="!table_header[0].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.game_name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="import_time"
                label="接入时间"
                v-if="!table_header[1].state"
                sortable='custom'
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.import_time | stampToTime }}</p>
                </template>
              </el-table-column>

              <el-table-column
                prop="lexing"
                label="类型"
                v-if="!table_header[2].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.lexing==null?"":scope.row.lexing.name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="hezuo"
                label="合作方式"
                v-if="!table_header[3].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.hezuo==null?"":scope.row.hezuo.name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="yanfa"
                label="研发"
                v-if="!table_header[4].state"
                min-width="160">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.yanfa==null?"":scope.row.yanfa.name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="faxing"
                label="发行"
                v-if="!table_header[5].state"
                min-width="160">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.faxing==null?"":scope.row.faxing.name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="quantity_policy"
                label="保量"
                v-if="!table_header[6].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.quantity_policy }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="gonghui"
                label="公会"
                v-if="!table_header[7].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.gonghui==null?"":scope.row.gonghui.name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="remarks"
                label="备注"
                v-if="!table_header[8].state"
                min-width="160">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.remarks }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="user"
                label="接入人"
                v-if="!table_header[9].state"
                min-width="100">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.user==null?"":scope.row.user.nickname }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="user"
                label="分成比例"
                v-if="!table_header[14].state"
                min-width="100">
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
                prop="ceping"
                label="状态"
                v-if="!table_header[10].state"
                min-width="100">
                <template scope="scope">
                  <p>
                      <span v-if="scope.row">
                        {{scope.row.game_id>0 ? "已接入":scope.row.game_id==-1? "不接入":"未接入"}}
                      </span>
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="ceping"
                label="接入状态"
                v-if="!table_header[11].state"
                min-width="100">
                <template scope="scope">
                  <p class="max_widthsd" v-if="scope.row.access==null">——</p>
                  <p class="max_widthsd" style="color: green" v-else-if="scope.row.access.state==1">上架中({{
                    scope.row.access.time | stampToTimeFull }})</p>
                  <p class="max_widthsd" style="color: red" v-else-if="scope.row.access.state==2">已下架({{
                    scope.row.access.time | stampToTimeFull }})</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="publish_time"
                label="首发时间"
                v-if="!table_header[12].state"
                sortable='custom'
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.publish_time | stampToTime }}</p>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                prop="updateinfo"
                label="更新人"
                v-if="!table_header[13].state"
                min-width="100">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.update_user==null?"":scope.row.update_user.nickname }} {{
                    scope.row.update_jrtime==null ? "" : scope.row.update_jrtime | stampToTimeFull }}</p>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                min-width="100">
                <template scope="scope">
                  <div class="result_report">
                    <el-button title="查看" class="fa fa-eye" type="text" size="small"
                               @click=readDialog(scope.row)></el-button>
                    <el-button title="编辑" class="fa fa-edit" type="text" size="small"
                               @click=editDialog(scope.row)></el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="box-footer">
            <!--<gameAccess :items="items" :downloadUrl="downloadUrl"></gameAccess>-->
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
    <el-dialog
      :title="readonly?'查看游戏接入':'编辑游戏接入'"
      v-model="isShowDialog"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <editaccessgame :rand="rand" :editId="editId" :readonly="readonly" @close="onEditClose"></editaccessgame>
    </el-dialog>
    <el-dialog title="阶梯分成" v-model="dialogVisible" size="small">
      <el-table
        :data="ladders"
        border
        style="width: 100%">
        <el-table-column
          prop="time"
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
  .control-label {
    width: 94px;
  }
</style>
<style>
  .ipt_jianjus {
    margin-bottom: 20px;
    min-width: 251px;
  }
</style>
<script>
  import util from '../../publicjs/utils'
  import gameAccess from './access/access'
  import {Pagination} from 'element-ui'
  import editaccessgame from './editgameAccess.vue'

  export default {
    components: {
      gameAccess,
      Pagination,
      editaccessgame,
    },
    data: function () {
      return {
        tags: [],
        readonly: false,//是否查看或者编辑 默认为查看(false)
        editId: 0,//操作对象的id
        isShowDialog: false,// 弹出框状态
        sortData: {},
        pageInfo: {
          currentPage: 1,
          limit: ENV.PAGE_SHOW_COUNT,
          offset: 0,
          total: 0,
        },
        selectedGames: [],
        selectedPublisher: null,
        games: [],
        mentionPeople: null,
        onmentionPeople: [],
        items: [],
        Publisher: [],
        isLoading: true,
        dialogVisible: false,
        ladders: [],
        downloadUrl: "", // 下载链接
        selectedHeader: [],
        table_header: [
          {
            id: 0,
            header_name: "游戏名称",
            state: false
          }, {
            id: 1,
            header_name: "接入时间",
            state: false
          }, {
            id: 2,
            header_name: "类型",
            state: false
          }, {
            id: 3,
            header_name: "合作方式",
            state: true
          }, {
            id: 4,
            header_name: "研发",
            state: true
          }, {
            id: 5,
            header_name: "发行",
            state: true
          }, {
            id: 6,
            header_name: "保量",
            state: true
          }, {
            id: 7,
            header_name: "公会",
            state: true
          }, {
            id: 8,
            header_name: "备注",
            state: true
          }, {
            id: 9,
            header_name: "接入人",
            state: false
          }, {
            id: 10,
            header_name: "状态",
            state: false
          }, {
            id: 11,
            header_name: "接入状态",
            state: false
          }, {
            id: 12,
            header_name: "首发时间",
            state: false
          }, {
            id: 13,
            header_name: "更新人",
            state: false
          }, {
            id: 14,
            header_name: "分成比例",
            state: true
          }
        ],
        time: '',//首发时间
        accTime: '',//首发时间
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
        rand: 0,
      }
    },
    methods: {
//      reset: function () {
//        this.selectedGames = []
//        this.doGetOrderList()
//      },
      handleCurrentChange(currentPage) {
        let offset = util.buildOffsetByPage(currentPage, this.pageInfo.limit)
        this.pageInfo.offset = offset
        this.doGetOrderList(currentPage, this.sortData)
      },
      gettagsList: function () {
        var url = '/game/JRStatistics'
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
      getGameSelectList: function () {
        var url = '/game/select' + '?flag=jr'
        this.$http.get(url)
          .then((res) => {
            this.games = res.body
          })
      },
      getonmentionPeopleList: function () {
        var url = '/user/devment/245'
        this.$http.get(url)
          .then((res) => {
            this.onmentionPeople = res.body
          })
      },
      getPublisherList: function () {
        var url = '/distributionCompany/companyname/'
        this.$http.get(url)
          .then((res) => {
            this.Publisher = res.body
          })
      },
      showHeader: function () {
        for (let i in this.table_header) {
          if (i == 3 || i == 4 || i == 5 || i == 6 || i == 7 || i == 8) {
            this.table_header[i].state = true
          }
          this.table_header[i].state = false
        }
        for (let i in this.selectedHeader) {
          this.table_header[this.selectedHeader[i]].state = true
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
      doGetOrderList(page = 0, sortData) {
        this.isLoading = true
        if (page == 0) {
          this.pageInfo.offset = 0
        }
        let Ids = []
        if (this.selectedGames.length != 0) {
          for (let i in this.selectedGames) {
            Ids.push(this.selectedGames[i])
          }
        }

        let access = []
        if (this.mentionPeople.length != 0) {
          for (let i in this.mentionPeople) {
            access.push(this.mentionPeople[i])
          }
        }

        let issue = []
        if (this.selectedPublisher.length != 0) {
          for (let i in this.selectedPublisher) {
            issue.push(this.selectedPublisher[i])
          }
        }

        let dates = []
        if (this.time.length > 1) {
          if (this.time[0] !== null) {
            dates.push(this.time[0] / 1000)
          }
          if (this.time[1] !== null) {
            dates.push(this.time[1] / 1000)
          }
        }

        let accTime = []
        if (this.accTime.length > 1) {
          if (this.accTime[0] !== null) {
            accTime.push(this.accTime[0] / 1000)
          }
          if (this.accTime[1] !== null) {
            accTime.push(this.accTime[1] / 1000)
          }
        }

        let que = {
          "ids": Ids.join(","),
          "time": dates.join(","),
          "issue": issue.join(","),
          "access": access.join(","),
          "accTime": accTime.join(","),
          "limit": this.pageInfo.limit,
          "offset": this.pageInfo.offset,
          "flag": 'jr',
        }

        if (sortData) {
          let order = sortData.order
          let prop = sortData.prop
          let isDescending = order === 'descending'
          if (order) {
            if (isDescending) {
              que.order = "desc"
            } else {
              que.order = "asc"
            }
          } else {
            que.order = "desc"
          }

          if (prop) {
            que.sortby = prop
          } else {
            que.sortby = "create_time"
          }
        } else {
          que.order = "desc"
          que.sortby = "create_time"
        }

        let query = util.buildGetParams(que)

        var url = '/game/result?' + query

        let xtoken = sessionStorage.getItem("token")
        this.downloadUrl = ENV.HOST_URL + '/game/download?' + query + "&_token=" + xtoken
        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data
            this.pageInfo.total = res.body.total
            this.isLoading = false
            this.gettagsList();
          })
      },
      // 弹出框 编辑
      editDialog(row) {
        this.isShowDialog = true
        this.editId = row.id
        this.readonly = false

        this.rand = Math.random()
      },
      // 弹出框 查看
      readDialog(row) {
        this.isShowDialog = true
        this.editId = row.id
        this.readonly = true

        this.rand = Math.random()
      },
      //编辑对话框
      onEditClose(needRefresh) {
        this.isShowDialog = false
        if (needRefresh) {
          this.doGetOrderList(this.pageInfo.currentPage, this.sortData)
        }
      },
      goDetails: function (id) {
        var data = {id: id}
        this.$store.commit('SET_SHAREDATA', data)
        this.$router.push({
          path: '/home/editgameAccess/?id=' + id
        })
      },
      addgame: function () {
        this.$router.push({path: '/home/addgameAccess'})
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
      this.getGameSelectList();
      this.getonmentionPeopleList();
      this.getPublisherList();
      this.gettagsList();
      this.doGetOrderList(0, this.sortData);
      let selected = [4, 5, 6, 7, 8, 3, 14]
      this.selectedHeader = selected
    },
  }
</script>

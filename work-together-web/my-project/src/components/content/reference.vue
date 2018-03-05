<template>
  <div>
    <section class="content-header">
      <h1>
        游戏提测
        <small>查看游戏提测</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>游戏管理</li>
        <li><i class="fa fa-dashboard"></i>游戏评测</li>
        <li>
          <router-link to="/home/reference">游戏提测</router-link>
        </li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="row">
            <div class="col-md-10 form-horizontal">
              <div class="form-group">
                <div class="col-sm-12 margin__btm">
                  <label class="col-sm-2 control-label">游戏名称:</label>
                  <div class="col-lg-4 col-md-10 col-sm-10 ipt_jianjus">
                    <el-select v-model="selectedGames" :clearable="true"
                               @change="doGetOrderList(0, sortData)" filterable multiple placeholder="请选择">
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
                      v-model="time" @change="doGetOrderList(0, sortData)"
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
                  <label class="col-sm-2 control-label">提 测 人:</label>
                  <div class="col-lg-4 col-md-10 col-sm-10 ipt_jianjus">
                    <el-select v-model="mentionPeople" :clearable="true"
                               @change="doGetOrderList(0, sortData)" filterable multiple placeholder="请选择">
                      <el-option
                        v-for="item in onmentionPeople"
                        :label="item.nickname"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                  <label class="col-sm-2 control-label">提测时间:</label>
                  <div class="col-lg-4 col-md-10 col-sm-10 ipt_jianjus">
                    <el-date-picker
                      v-model="subTime" @change="doGetOrderList(0, sortData)"
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
              <div class="col-md-12 margin__btm">
                <div class="col-md-3  post-btn">
                  <button style="margin-top: 10px" class="btn btn-primary btn-block" @click=addReference>添加提测</button>
                </div>
                <el-tag
                  class="ontags"
                  v-for="tag in tags"
                  :key="tag.user_id"
                  :type="tag.type">
                  {{tag.nick_name}}今日提测：{{tag.total}}款游戏
                </el-tag>
              </div>
            </div>
          </div>
        </div>
        <div class="_list_tab">
          <div class="box-body">

            <el-dialog title="高级账号" v-model="dialogVisible" size="tiny">
              <el-row :gutter="24" style="margin-left:0px;text-align: center">
                <el-col :span="12">账号</el-col>
                <el-col :span="12">密码</el-col>
              </el-row>
              <el-row :gutter="24" style="margin-left:0px;" v-for="number in numbers">
                <el-col :span="12">
                  <el-input v-model="number.username" readonly="true"></el-input>
                </el-col>
                <el-col :span="12">
                  <el-input v-model="number.password" readonly="true"></el-input>
                </el-col>
              </el-row>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
              </span>
            </el-dialog>

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
                min-width="120"
                v-if="!table_header[0].state"
              >
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.game_name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="publish_time"
                label="首发时间"
                sortable='custom'
                min-width="120"
                v-if="!table_header[1].state">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.publish_time | stampToTime }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="faxing"
                label="发行商"
                min-width="160"
                v-if="!table_header[2].state">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.faxing==null?"":scope.row.faxing.name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="faxing"
                label="游戏来源"
                min-width="160"
                v-if="!table_header[13].state">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.game_source==null?"":scope.row.game_source.name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="lexing"
                label="游戏类型"
                min-width="160"
                v-if="!table_header[3].state">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.lexing==null?"":scope.row.lexing.name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="ip"
                label="IP"
                min-width="80"
                v-if="!table_header[4].state">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.ip==1?"YES":"NO" }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="star"
                label="明星代言"
                min-width="80"
                v-if="!table_header[5].state">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.star }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="budget"
                label="市场预算"
                v-if="!table_header[6].state"
                min-width="80">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.budget }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="package"
                label="测试包"
                v-if="!table_header[7].state"
                min-width="160">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.package }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="zip"
                label="测试数据截图"
                class="text-center"
                v-if="!table_header[8].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">
              <span v-for="id in parseJson(scope.row.picture)">
                <span v-if="id>0">
                  <a class="fa fa-download" :href="download(id)"></a>&nbsp;&nbsp;
                </span>
              </span>
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="account"
                label="高级账号"
                v-if="!table_header[9].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">
                      <span v-if='scope.row.number!="[\":\"]"&&scope.row.number!=null'>
                        <el-button type="primary" @click="opendialog(scope.row.number)">查看</el-button>
                      </span>
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                prop="submitinfo"
                v-if="!table_header[10].state"
                label="提测人"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths" v-if="scope.row.user">{{ scope.row.user.nickname }}({{ scope.row.create_time |
                    stampToTimeFull }})</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="update_info"
                label="更新人"
                v-if="!table_header[11].state"
                min-width="160">
                <template scope="scope">
                  <p class="max_widths" v-if="scope.row.update_user">{{scope.row.update_user.nickname }} {{
                    scope.row.update_reftime |stampToTimeFull }}</p>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                v-if="!table_header[12  ].state"
                min-width="70">
                <template scope="scope">
                  <el-button title="查看" class="fa fa-eye" type="text" size="small"
                             @click=readReference(scope.row)></el-button>
                  <el-button title="编辑" class="fa fa-edit" type="text" size="small"
                             @click=editReference(scope.row)></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="box-footer">
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
      :title="editId==0?'添加游戏提测':readonly?'查看游戏提测':'编辑游戏提测'"
      v-model="isShowItemForm"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <span v-if="editId>0">
        <reference-edit ref="c1" :rand="rand" :readonly="readonly" :editId="editId"
                        @close="onEditClose"></reference-edit>
      </span>
      <span v-else>
        <reference-add :editId="0" @close="onEditClose"></reference-add>
      </span>
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

  .control-label {
    width: 94px;

  }

  .ipt_jianjus {
    margin-bottom: 20px;
    min-width: 251px;
  }

  .box-header {
    height: auto;
  }

  .max_widths {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
  }

  .max_widths:hover {
    text-overflow: inherit;
    overflow: visible;
    white-space: pre-line;
  }
</style>
<style>
  .el-date-editor--daterange.el-input {
    width: 100% !important;
  }
</style>
<script type="text/ecmascript-6">
  import util from '../../publicjs/utils'
  import {Pagination} from 'element-ui'
  import editReference from './editreference.vue'
  import addreference from './addreference.vue'

  export default {
    components: {
      Pagination,
      'reference-edit': editReference,
      'reference-add': addreference,
    },
    data: function () {
      return {
//        turn :true,//判断是否是添加或者是编辑 ture 为编辑
        isShowItemForm: false, //弹出框
        isSeen: false,//是否查看或者编辑 默认为查看(false)
        editId: 0, //是否是添加（0）、编辑（！=0）
        sortData: {},
        pageInfo: {
          currentPage: 1,
          limit: ENV.PAGE_SHOW_COUNT,
          offset: 0,
          total: 0,
        },
        tags: [],
        isLoading: true,
        selectedHeader: [],
        table_header: [
          {
            id: 0,
            header_name: "游戏名称",
            state: false
          }, {
            id: 1,
            header_name: "首发时间",
            state: false
          }, {
            id: 2,
            header_name: "发行商",
            state: false
          }, {
            id: 3,
            header_name: "游戏类型",
            state: false
          }, {
            id: 4,
            header_name: "IP",
            state: true
          }, {
            id: 5,
            header_name: "明星代言",
            state: true
          }, {
            id: 6,
            header_name: "市场预算",
            state: true
          }, {
            id: 7,
            header_name: "测试包",
            state: false
          }, {
            id: 8,
            header_name: "测试数据截图",
            state: true
          }, {
            id: 9,
            header_name: "高级账号",
            state: true
          }, {
            id: 10,
            header_name: "更新人",
            state: false
          }, {
            id: 11,
            header_name: "提测人",
            state: false
          }, {
            id: 12,
            header_name: "操作",
            state: false
          }, {
            id: 13,
            header_name: "游戏来源",
            state: false
          }
        ],
        selectedGames: [],
        mentionPeople: null,
        onmentionPeople: [],
        games: [],
        items: [],
        dialogVisible: false,
        numbers: [],
        show: false,
        time: '',//首发时间
        subTime: '',//提测时间
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
      showHeader: function () {
        for (let i in this.table_header) {
          this.table_header[i].state = false
        }
        for (let i in this.selectedHeader) {
          this.table_header[this.selectedHeader[i]].state = true
        }
      },
      handleCurrentChange(currentPage) {
        let offset = util.buildOffsetByPage(currentPage, this.pageInfo.limit)
        this.pageInfo.offset = offset

        this.doGetOrderList(currentPage, this.sortData)
      },
      getGameSelectList: function () {
        this.isLoading = true
        var url = '/game/select' + '?flag=tc'
        this.$http.get(url)
          .then((res) => {
            this.games = res.body
            this.isLoading = false
          })
      },
      getonmentionPeopleList: function () {
        var url = '/user/devment/245'
        this.$http.get(url)
          .then((res) => {
            this.onmentionPeople = res.body
          })
      },
      gettagsList: function () {
        var url = '/game/TCStatistics'
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
      doGetOrderList(page = 0, sortData) {
        if (page == 0) {
          this.pageInfo.offset = 0
        }
        let Ids = []
        if (this.selectedGames.length != 0) {
          for (let i in this.selectedGames) {
            Ids.push(this.selectedGames[i])
          }
        }

        let submit = []
        if (this.mentionPeople.length != 0) {
          for (let i in this.mentionPeople) {
            submit.push(this.mentionPeople[i])
          }
        }

        let dates = []
        if (this.time.length > 1) {
          if (this.time[0] !== null) {
            dates.push(1)
          }
          if (this.time[1] !== null) {
            dates.push(parseInt(new Date(new Date(this.time[1]).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000))
          }
        }
        let subTime = []
        if (this.subTime.length > 1) {
          if (this.subTime[0] !== null) {
            subTime.push(this.subTime[0] / 1000)
          }
          if (this.subTime[1] !== null) {
            subTime.push(parseInt(new Date(new Date(this.subTime[1]).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000))
          }
        }
        let que = {
          "ids": Ids.join(","),
          "time": dates.join(","),
          "submit": submit.join(","),
          "subTime": subTime.join(","),
          "limit": this.pageInfo.limit,
          "offset": this.pageInfo.offset,
          "flag": 'tc',
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
        }

        let query = util.buildGetParams(que)

        var url = '/game/result?' + query
        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data
            this.pageInfo.total = res.body.total
            this.gettagsList();
          }
      )
      },
      opendialog: function (numbers) {
        this.numbers = []
        if (numbers != null) {
          let number = JSON.parse(numbers)
          for (let i in number) {
            this.numbers.push({username: number[i].split(":")[0], password: number[i].split(":")[1]})
          }
        }

        this.dialogVisible = true
      },
      parseJson(json) {
        if (json != null) {
          return JSON.parse(json)
        } else {
          return null
        }
      },
      //弹出编辑框
      editReference(item) {
        this.isShowItemForm = true
        this.editId = item.id
        this.readonly = false
        this.rand = Math.random()
      },
      //查看弹出框
      readReference(item) {
        this.isShowItemForm = true
        this.editId = item.id
        this.readonly = true
        this.rand = Math.random()
      },
      //弹出添加框
      addReference() {
        this.isShowItemForm = true
        this.editId = 0
      },
      //编辑对话框关闭
      onEditClose(needRefresh) {
        this.isShowItemForm = false
        if (needRefresh) {
          this.doGetOrderList(this.pageInfo.currentPage, this.sortData)
        }
      },
      goDetails: function (id) {
        var data = {id: id}
        this.$store.commit('SET_SHAREDATA', data)
        this.$router.push({path: '/home/editReference/?id=' + id})
      },
      download(fileId) {
        return util.downloadFileUrl(fileId)
      },
      handleSort(obj) {
        if (!obj.prop) {
          return
        }
        this.sortData = obj
//        console.log("handleSort")
        this.doGetOrderList(0, this.sortData)
      },
    },
    mounted: function () {
      this.isLoading = true
      this.getGameSelectList();
      this.getonmentionPeopleList();
      this.gettagsList();
      this.doGetOrderList(0, this.sortData);
      let selected = [4, 5, 6, 8, 9]
      this.selectedHeader = selected
//      console.log(this.selectedHeader)
    },
  }
</script>

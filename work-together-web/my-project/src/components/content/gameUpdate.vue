<template>
  <div>
    <section class="content-header">
      <h1>
        游戏更新
        <small>查看游戏更新情况</small>
      </h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="col-md-10 form-horizontal">
            <div class="form-group">
              <div class="col-sm-12 margin__btm">
                <label class="col-sm-2 control-label">游戏名称:</label>
                <div class="col-lg-4 col-md-10 col-sm-10">
                  <!--<multiselect v-model="selectedGames" tag-placeholder="Add this as new tag"-->
                               <!--placeholder="请选择" selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
                               <!--label="game_name" track-by="game_id" :options="games" :multiple="true" :taggable="false"-->
                               <!--@input="doGetOrderList" :hide-selected="true" :close-on-select="false">-->
                  <!--</multiselect>-->
                  <el-select v-model="selectedGames" :clearable="true"
                             @change="doGetOrderList" filterable multiple placeholder="请选择">
                    <el-option
                      v-for="item in games"
                      :label="item.game_name"
                      :value="item">
                    </el-option>
                  </el-select>
                </div>
                <label class="col-sm-2 control-label">更新时间:</label>
                <div class="col-lg-4 col-md-10 col-sm-10">
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
            </div>
            <div class="col-md-12">
              <div class="row form-group">
                <div class="col-md-3 post-btn">
                  <button class="btn btn-primary btn-block" @click=addUpdate>添加更新</button>
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
              stripe
              style="width: 100%">
              <el-table-column
                fixed
                prop="game"
                label="游戏名称"
                v-if="!table_header[0].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.game==null?"":scope.row.game.game_name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="game_update_time"
                label="更新时间"
                v-if="!table_header[1].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.game_update_time | stampToTime }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="update_type"
                label="更新类型"
                v-if="!table_header[2].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.update_type==1?"强更":"热更" }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="version"
                label="更新版本"
                v-if="!table_header[3].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.version }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="version_code"
                label="VersionCode"
                v-if="!table_header[4].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.version_code }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="package_name"
                label="游戏包名"
                v-if="!table_header[5].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.package_name }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="faxing"
                label="素材"
                v-if="!table_header[6].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">
                    <span v-if="scope.row.material==null||scope.row.material=='[]'">未更新</span>
                    <span v-else>已更新</span>
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="quantity_policy"
                label="ICON"
                v-if="!table_header[7].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">
                    <span v-if="scope.row.icon==null || scope.row.icon=='[]'">未更新</span>
                    <el-button v-else type="primary" @click="showIcon(scope.row.game.game_name, scope.row.icon)">已更新</el-button>
                    <!--<span v-else>{{ scope.row.icon }}</span>-->
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="gonghui"
                label="渠道状况"
                v-if="!table_header[8].state"
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">
                    <el-button type="primary" @click="opendialog(scope.row.game.game_name, scope.row.update_channels,
                                                           scope.row.not_update_channels,scope.row.stop_channels)">查看
                    </el-button>
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="remark"
                label="备注"
                v-if="!table_header[9].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.remark }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="user"
                label="创建人"
                v-if="!table_header[10].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths"><span v-if="scope.row.create_user!=null">{{ scope.row.create_user.nickname }}({{ scope.row.create_time | stampToTime }})</span></p>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                prop="ceping"
                label="更新人"
                v-if="!table_header[11].state"
                min-width="140">
                <template scope="scope">
                  <p class="max_widths">
                    <span v-if="scope.row.update_user!=null">{{ scope.row.update_user.nickname }} {{ scope.row.update_time | stampToTime }}</span>
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                v-if="!table_header[12].state"
                min-width="100">
                <template scope="scope">
                  <el-button title="编辑" class="fa fa-edit" type="text" size="small" @click=editPreOperation(scope.row.game_id)></el-button>
                  <!--<div class="result_report"  @click=editPreOperation(scope.row.game_id)>-->
                    <!--<span class="fa fa-edit"></span>-->
                  <!--</div>-->
                </template>
              </el-table-column>
            </el-table>
            <el-dialog :title="gameName + '---渠道情况'" v-model="dialogTableVisible">
              <el-table :data="gridData">
                <el-table-column property="state" label="状态" width="200"></el-table-column>
                <el-table-column property="name" label="渠道名称"></el-table-column>
              </el-table>
            </el-dialog>
            <el-dialog :title="iconGameName + '---ICON预览'" v-model="iconDialogTableVisible" size="tiny">
              <el-carousel height="200px">
                <el-carousel-item v-for="item in icons">
                  <img :src="item"/>
                </el-carousel-item>
              </el-carousel>
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
  </div>
</template>
<style>
  .post-btn {
    width: 120px;
  }
</style>
<style scoped>
  th {
    text-align: center;
    background: #367fa9 !important;
    color: white !important;
  }
  .control-label{
    width: 94px;
  }
  td {
    text-align: center;
  }
  .el-date-editor--daterange.el-input{
    width: 100%;
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
            header_name:"更新时间",
            state:false
          },{
            id:2,
            header_name:"更新类型",
            state:false
          },{
            id:3,
            header_name:"更新版本",
            state:false
          },{
            id:4,
            header_name:"VersionCode",
            state:false
          },{
            id:5,
            header_name:"游戏包名",
            state:false
          },{
            id:6,
            header_name:"素材",
            state:true
          },{
            id:7,
            header_name:"ICON",
            state:true
          },{
            id:8,
            header_name:"渠道状况",
            state:false
          },{
            id:9,
            header_name:"备注",
            state:true
          },{
            id:10,
            header_name:"创建人",
            state:false
          },{
            id:11,
            header_name:"更新人",
            state:false
          },{
            id:12,
            header_name:"操作",
            state:false
          }
        ],
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
        selectedGames: [],
        games: [],
        parentMessage: 'Parent',
        items: [],
        time: '',
        dialogTableVisible: false,
        iconDialogTableVisible: false,
        gridData: [],
        gameName: "",
        iconGameName: "",
        icons: [],
      }
    },
    methods: {
      showHeader: function () {
        for(let i in this.table_header){
          if(i==6||i==7||i==9){
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
      opendialog: function (name, update, notUpdate, stop) {
        this.gameName = name
        this.gridData = []

        let updateChannels = []
        if (update.length != 0) {
          for (let i in update) {
            updateChannels.push(update[i].name)
          }
        }
        var data1 = {state: '', name: ''}
        data1.state = '更新的'
        data1.name = updateChannels.join("、")
        if (!data1.name) {
          data1.name = "无"
        }
        this.gridData.push(data1)

        let notUpdateChannels = []
        if (notUpdate.length != 0) {
          for (let i in notUpdate) {
            notUpdateChannels.push(notUpdate[i].name)
          }
        }
        var data2 = {state: '', name: ''}
        data2.state = '不更新的'
        data2.name = notUpdateChannels.join("、")
        if (!data2.name) {
          data2.name = "无"
        }
        this.gridData.push(data2)

        let stopChannels = []
        if (stop.length != 0) {
          for (let i in stop) {
            stopChannels.push(stop[i].name)
          }
        }
        var data3 = {state: '', name: ''}
        data3.state = '终止合作的'
        data3.name = stopChannels.join("、")
        if (!data3.name) {
          data3.name = "无"
        }
        this.gridData.push(data3)

        this.dialogTableVisible = true
      },
      showIcon: function (name, icon) {
        this.icons = []
        this.iconGameName = name
        let icons = JSON.parse(icon)
        for(let i in icons){
          this.icons.push(utils.buildFileUrl(icons[i]))
        }
        this.iconDialogTableVisible = true
      },
      addUpdate: function() {
        this.$router.push({path:'/home/addUpdate'})
      },
      reset: function () {
        this.selectedGames = []
        this.time = ''
        this.doGetOrderList()
      },
      handleCurrentChange(currentPage) {
        let offset = util.buildOffsetByPage(currentPage, this.pageInfo.limit)
        this.pageInfo.offset = offset
        this.doGetOrderList(currentPage)
      },
      editPreOperation: function (id) {
        this.$router.push({
          path: '/home/editUpdate/?id=' + id
        })
			},
      getGameSelectList:function () {
        var url = '/game/select' + '?flag=yxgx'
        this.$http.get(url)
          .then((res) => {
          this.games = res.body
        })
      },
      doGetOrderList (page = 0) {
        if (page == 0) {
          this.pageInfo.offset = 0
        }
        let gameIds = []
        if (this.selectedGames.length != 0) {
          for (let i in this.selectedGames) {
            gameIds.push(this.selectedGames[i].game_id)
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

        let query = util.buildGetParams({
          "gameids": gameIds.join(","),
          "time": dates.join(","),
          "limit": this.pageInfo.limit,
          "offset": this.pageInfo.offset,
        })
        var url = '/gameupdate/?' + query

        this.$http.get(url)
          .then((res) => {
          this.items = res.body.data
        for (let i in this.items) {
          let yunyings = []
          if (this.items[i].yunyingpeoples != null) {
            for (let j in this.items[i].yunyingpeoples) {
              yunyings.push(this.items[i].yunyingpeoples[j].nickname)
            }
          }
          let peoples = yunyings.join("、")
          this.items[i].peoples = peoples
        }
        this.pageInfo.total = res.body.total
      })
      }
    },
    mounted: function () {
      this.getGameSelectList();
      this.doGetOrderList(0);
      let selected = [6,7,9]
      this.selectedHeader= selected
    }
  }
</script>

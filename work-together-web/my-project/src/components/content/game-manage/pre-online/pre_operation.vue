<template>
  <div>
    <section class="content-header">
      <h1>
        上线准备
        <small>查看运营准备情况</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>游戏管理</li>
        <li><i class="fa fa-dashboard"></i>上线准备</li>
        <li>
          <router-link to="/home/game-manage/pre-online/pre_operation">运营准备</router-link>
        </li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="col-md-10 form-horizontal">
            <div class="form-group">
              <div class="col-sm-12 margin__btm">
                <label class="col-sm-3 control-label">游戏名称:</label>
                <div class="col-lg-5 col-md-10 col-sm-10">
                  <el-select v-model="selectedGames" :clearable="true"
                             @change="doGetOrderList" filterable multiple placeholder="请选择">
                    <el-option
                      v-for="item in games"
                      :label="item.game_name"
                      :value="item.game_id">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="row form-group">
                <div class="col-md-3 post-btn">
                  <a class="btn-block btn btn-primary" :href="downloadUrl" :disabled="downloadUrl==''">导出EXCEL</a>
                </div>
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
            v-loading="isLoading"
            element-loading-text="拼命加载中"
            class="table table-bordered table-hover"
            :data="items"
            border
            stripe
            style="width:100%">
            <el-table-column
              prop="game_name"
              label="游戏名称"
              v-if="!table_header[0].state"
              min-width="140">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.game == null ? "" : scope.row.game.game_name }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="channels"
              label="总渠道数"
              v-if="!table_header[1].state"
              min-width="100">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.details.channels == null ? "-" : scope.row.details.channels }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="gifs"
              label="礼包情况"
              v-if="!table_header[2].state"
              min-width="100">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.details.gifs == null ? "-" : scope.row.details.gifs }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="yunying"
              label="运营方"
              v-if="!table_header[3].state"
              min-width="160">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.yunying == null ? "" : scope.row.yunying.name }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="peoples"
              label="运营负责人"
              v-if="!table_header[4].state"
              min-width="140">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.peoples == null ? "" : scope.row.peoples }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="user2"
              label="更新人"
              v-if="!table_header[5].state"
              min-width="140">
              <template scope="scope">
                <p class="max_widths">{{ scope.row.user2 == null ? "" : scope.row.user2.nickname
                  }}({{ scope.row.operator_time | stampToTime }})</p>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              v-if="!table_header[6].state"
              min-width="120">
              <template scope="scope">
                <el-button title="查看" class="fa fa-eye" type="text" size="small" @click=readDialog(scope.row)></el-button>
                <el-button title="编辑" class="fa fa-edit" type="text" size="small" @click=editItem(scope.row)></el-button>
              </template>
            </el-table-column>
          </el-table>
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
      :title="readonly?'查看运营准备':'编辑运营准备'"
      v-model="isShowForm"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <editor :rand="rand" :readonly="readonly" :editId="editId" :gameId="gameId" @close="onEditClose"></editor>
    </el-dialog>
  </div>
</template>

<script>
  import utils from '../../../../publicjs/utils'
  import {Pagination} from 'element-ui'
  import editor from './pre_operation_edit.vue'

  export default {
    components: {
      Pagination,
      editor
    },
    data: function () {
      return {
        pageInfo: {currPage: 1, limit: ENV.PAGE_SHOW_COUNT, offset: 0, total: 0,},

        isShowForm: false,
        editId: 0,
        gameId: 0,
        selectedGames: [],
        games: [],
        parentMessage: 'Parent',
        items: [],
        isLoading: true,
        downloadUrl: "", // 下载链接
        selectedHeader: [],
        table_header: [
          {id: 0, header_name: "游戏名称", state: false},
          {id: 1, header_name: "总渠道数", state: false},
          {id: 2, header_name: "礼包情况", state: false},
          {id: 3, header_name: "运营方", state: false},
          {id: 4, header_name: "运营负责人", state: false},
          {id: 5, header_name: "更新人", state: false},
          {id: 6, header_name: "操作", state: false}
        ],
        readonly: false,
        rand: 0,
      }
    },
    methods: {
      reset: function () {
        this.selectedGames = []
        this.doGetOrderList()
      },
      onEditClose(needRefresh){
        this.isShowForm = false
        if (needRefresh) {
          this.doGetOrderList()
        }
      },
      editItem(row){
        this.editId = row.id
        this.gameId = row.game_id
        this.isShowForm = true
        this.readonly=false

        this.rand = Math.random()
      },
      readDialog(row){
        this.isShowForm=true
        this.editId = row.id
        this.gameId = row.game_id
        this.readonly=true

        this.rand = Math.random()
      },
      handleCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.doGetOrderList()
      },
      editPreOperation: function (id, gameName) {
        var data = {id: id, gameName: gameName}
        this.$store.commit('SET_SHAREDATA', data)
        this.$router.push({
          path: '/home/game-manage/pre-online/pre_operation_edit/?id=' + id + "&gameName=" + gameName
        })
      },
      showHeader: function () {
        for (let i in this.table_header) {
          this.table_header[i].state = false
        }
        for (let i in this.selectedHeader) {
          this.table_header[this.selectedHeader[i]].state = true
        }
      },
      getGameSelectList: function () {
        var url = '/game/select' + '?flag=sxyy'
        this.$http.get(url)
          .then((res) => {
            this.games = res.body
          })
      },
      doGetOrderList () {
        this.isLoading = true
        let gameIds = []
        if (this.selectedGames.length != 0) {
          for (let i in this.selectedGames) {
            gameIds.push(this.selectedGames[i])
          }
        }

        let query = util.buildGetParams({
          "gameids": gameIds.join(","),
          "offset|page": this.pageInfo,
          "flag": 2
        })
        var url = '/gameplan/?' + query
        let xtoken = sessionStorage.getItem("token")
        this.downloadUrl = ENV.HOST_URL + '/gameplan/download?' + query + "&_token=" + xtoken
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
            this.isLoading = false
          })
      }
    },
    mounted: function () {
      this.isLoading = true
      this.getGameSelectList();
      this.doGetOrderList(0);
      let selected = []
      this.selectedHeader = selected
    }
  }
</script>

<style scoped>
  th {
    text-align: center;
    background: #367fa9 !important;
    color: white !important;
  }

  td {
    text-align: center;
  }

  .control-label {
    width: 94px;
  }
</style>

<template>
  <div>
    <section class="content-header">
      <h1>
        上线准备
        <small>游戏上线前准备概况</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>游戏管理</li>
        <li><i class="fa fa-dashboard"></i>上线准备</li>
        <li>
          <router-link to="/home/ready">概况</router-link>
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
                <div class="col-lg-4 col-md-10 col-sm-10">
                  <!--<multiselect v-model="selectedGames" tag-placeholder="Add this as new tag"-->
                               <!--placeholder="搜索或选择" selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
                               <!--label="game_name" track-by="game_id" :options="gameplans" :multiple="true"-->
                               <!--:taggable="false" @input="doGetOrderList" :hide-selected="true" :close-on-select="false">-->
                  <!--</multiselect>-->
                  <el-select v-model="selectedGames" :clearable="true"
                             @change="doGetOrderList" filterable multiple placeholder="请选择">
                    <el-option
                      v-for="item in gameplans"
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
                  <a class="btn btn-primary btn-block col-sm-6" :href="downloadUrl"
                     :disabled="downloadUrl==''">导出excel</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ready v-loading="isLoading" element-loading-text="拼命加载中" :items="items" :downloadUrl="downloadUrl"></ready>
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
  .control-label {
    width: 94px;
  }

  @media screen and (min-width: 990px) and (max-width: 1377px) {
    .btn-primary {
      margin-top: 27px;
    }
  }

  .el-table th {
    text-align: center !important;
  }
</style>
<script type="text/ecmascript-6">
  import ready from './game_mgt/ready'
  import Multiselect from 'vue-multiselect'
  import {Pagination} from 'element-ui'
  import util from '../../publicjs/utils'

  export default {
    components: {
      Multiselect,
      ready,
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
        isLoading: true,
        games: [],
        selectedGames: [],
        gameplans: [],
        items: [],
        downloadUrl: "", // 下载链接
      }
    },
    methods: {
      reset: function () {
        this.selectedGames = []
        this.doGetOrderList()
      },
      handleCurrentChange(currentPage) {
        let offset = util.buildOffsetByPage(currentPage, this.pageInfo.limit)
        this.pageInfo.offset = offset
        this.doGetOrderList(currentPage)
      },
      getGameSelectList: function () {
//        var url = '/game/'
        var url = '/game/select' + '?flag=sx'
        this.$http.get(url)
          .then((res) => {
            this.gameplans = res.body
          })
      },
      doGetOrderList(page = 0) {
        this.isLoading = true
        if (page == 0) {
          this.pageInfo.offset = 0
        }
        let gameIds = []
        if (this.selectedGames.length != 0) {
          for (let i in this.selectedGames) {
            gameIds.push(this.selectedGames[i])
          }
        }

        let query = util.buildGetParams({
          "gameids": gameIds.join(","),
          "limit": this.pageInfo.limit,
          "offset": this.pageInfo.offset,
          "flag": 0 //概况
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
    }

  }
</script>

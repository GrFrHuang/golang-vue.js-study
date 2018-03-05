<template>
  <div>
    <section class="content-header">
      <h1>
        渠道对账
        <small>查看渠道对账单</small>
      </h1>
      <ol class="breadcrumb">
        <li>
          <i class="fa fa-dashboard"></i>渠道回款流
        </li>
        <li>
          <router-link to="/home/channelContract/channelContractB">对账管理</router-link>
        </li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="col-md-6 form-horizontal">
            <div class="form-group">
              <label class="col-sm-2 control-label">渠道</label>
              <div class="col-sm-10">
                <el-select
                  style="width:100%"
                  v-model="selectedChannels"
                  :multiple="true" :clearable="true" :filterable="true"
                  @change="doGetChanVList"
                  placeholder="渠道">
                  <el-option
                    v-for="item in channels"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </div>
            </div>

            <div class="form-group">
              <label class="col-sm-2 control-label">账单日期</label>
              <div class="col-sm-10">
                <el-date-picker
                  format="yyyy-MM-dd"
                  v-model="timeRange"
                  type="daterange"
                  :range="true"
                  placeholder="选择时间范围" @input="doGetChanVList">
                </el-date-picker>
              </div>
            </div>
          </div>

          <div class="col-md-6 form-horizontal">
            <div class="form-group">
              <label class="col-sm-2 control-label">对账状态</label>
              <div class="col-sm-10">
                <el-select
                  style="width:100%"
                  v-model="selectedStatus"
                  :multiple="true" :clearable="true" :filterable="true"
                  @change="doGetChanVList"
                  placeholder="状态">
                  <el-option
                    v-for="item in status"
                    :label="item.desc"
                    :value="item">
                  </el-option>
                </el-select>

              </div>
            </div>

            <div class="form-group">
              <div class="col-lg-2">
              </div>
              <div class="col-lg-4">
                <button class="btn-block btn btn-primary" @click="reset">重置</button>
                <div class="visible-md-block" style="height: 10px"></div>
              </div>
              <div class="col-lg-3 col-md-6">
                <a class="btn-block btn btn-primary" :href="downloadUrl" :disabled="downloadUrl==''">导出excel</a>
              </div>
              <div class="col-lg-3 col-md-6">
                <button class="btn-block btn btn-primary" @click=channelOfReconciliation(0)>添加对账</button>
              </div>
            </div>
          </div>
        </div>
        <!-- /.box-header -->
        <div class="box-body">
          <table id="example2" class="table table-bordered">
            <thead>
            <tr>
              <th>账单日期</th>
              <th>我方主体</th>
              <th>渠道</th>
              <th>游戏</th>
              <th>状态</th>
              <th>我方流水</th>
              <th>应付金额</th>
              <th>回款金额</th>
              <th>对账人</th>
              <th>更新人</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <!--未对账的数据-->
            <tr class="noverify">
              <td>{{ preItem.start_time }} - {{ preItem.end_time }}</td>
              <td></td>
              <td>{{ preItem.game_str }}</td>
              <td>{{ preItem.cp_name }}</td>
              <td>未对账</td>
              <td></td>
              <td>{{ preItem.amount }}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            <tr v-for="item in items">
              <td>{{ item.start_time }} - {{ item.end_time }}</td>
              <td>
                <span v-if="item.body_my===1">云端</span>
                <span v-else>有量</span>
              </td>
              <td>{{ item.channel.name }}</td>
              <td class="extend-hover" style="width: 150px">
                <div>{{previewGame(item.game_str)}}</div>
              </td>
              <td>{{ previewStatus(item.status) }}</td>
              <td>{{ item.amount_my }}</td>
              <td>{{ item.amount_payable }}</td>
              <td>{{ item.amount_remit }}</td>
              <td><span v-if="item.verify_user">{{ item.verify_user.nickname }}</span>（{{ item.verify_time | stamptotime }}）
              </td>
              <td>
                <span
                  v-if="item.update_user">{{ item.update_user.nickname }} {{ item.update_time | stampToTimeFull}}</span>
              </td>
              <td>
                <el-tooltip class="item item_cursor" effect="dark" content="对账单下载" placement="top-start">
                 <span class="fa fa-file-text-o "
                       v-if="item.file_preview_id"
                       @click="preview(item.file_preview_id)"></span>
                  <a v-if="item.file_id" :href="download(item.file_id)" target="_blank">
                    <span class="fa fa-download "></span>
                  </a>
                </el-tooltip>
                <el-tooltip class="item item_cursor" effect="dark" content="对账单编辑" placement="top-start">
                  <span class="fa fa-edit " @click=goaddCpReconciliation(item.id)></span>
                </el-tooltip>
                <el-tooltip class="item item_cursor" effect="dark" content="删除" placement="top-start">
                  <span class="fa fa-trash " @click=deleteItem(item.id)></span>
                </el-tooltip>
              </td>
            </tr>
            </tbody>
          </table>
          <!--v-show="pageInfo.total > pageInfo.limit"-->
          <el-pagination
            @current-change="onCurrentChange"
            :current-page="pageInfo.currPage"
            :page-size="pageInfo.limit"
            :total="pageInfo.total"
            layout="prev, pager, next, jumper, total">
          </el-pagination>
        </div>
        <!-- /.box-body -->
      </div>
    </div>
  </div>
</template>
<style>
  .noverify {
    background-color: #D3DCE6;
  }
</style>
<style scoped>
  th {
    text-align: center;
    background: #367fa9 !important;
    color: white !important;
  }

  td {
    text-align: center;
  }
</style>
<script type="text/ecmascript-6">
  import Multiselect from 'vue-multiselect'
  import datepicker from 'vue-date'
  import util from '../../../publicjs/utils'
  export default {
    components: {
      Multiselect,
      datepicker,
    },
    data: function () {
      return {
        selectedGames: [],
        games: [],
        invoker: [],

        selectedChannels: [],
        preItem: {},

        items: [],
        channels: [],
        selectedIds: [],
        time: [],
        status: [{value: 10, desc: "对账中"}, {value: 20, desc: "已对账,未开发票"},
          {value: 30, desc: "已开发票"}, {value: 100, desc: "已对账"}],
        selectedStatus: {},
        pageInfo: {
          limit: ENV.PAGE_SHOW_COUNT,
          currPage: 1,
          total: 0,
        },
        downloadUrl: "", // 下载链接
        timeRange: ""
      }
    },
    mounted: function () {
      this.getNoChannelVerify("");
      this.getSelectChannels();
      this.doGetChanVList(1);
    },
    methods: {
      reset() {
        this.selectedChannels = []
        this.timeRange = ""
        this.selectedStatus = {}
        this.doGetChanVList()
      },
      onCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.doGetChanVList(currentPage)
      },
      previewStatus(i){
        if (i) {
          return _.find(this.status, {'value': i}).desc
        }
        return ""
      },
      previewGame(i){
        if (!i) {
          return ""
        }
        i = JSON.parse(i)
        if (!i) {
          return ""
        }
        return _.map(i, "game_name").join(' ')
      },
      goaddCpReconciliation: function (id) {
        this.$router.push({
          path: '/home/channelOfReconciliation?id=' + id
        })
      },
      channelOfReconciliation: function (id) {
        this.$router.push({
          path: '/home/channelOfReconciliation?id=' + id
        })
      },
      getNoChannelVerify: function (query) {
        let url = '/channelverify/pre?' + query;
        this.$http.get(url)
          .then((res) => {
            this.preItem = res.body;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getChannelVerify: function () {
        let url = '/channelverify/'
        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getSelectChannels(){
        let url = '/channelverify/channels';
        this.$http.get(url)
          .then((res) => {
            this.channels = res.body;
          })
          .catch((err) => {
            console.log(err);
            context.error = err.data;
          })
      },
      doGetChanVList(page){
        if (page == 1) {
          this.pageInfo.offset = 0
        }
        let cps = [];
        if (this.selectedChannels.length != 0) {
          cps = _.map(this.selectedChannels, 'cp').join(",")
        }
        let param = {
          channels: cps,
        };

        if (this.timeRange.length > 1) {
          if (this.timeRange[0] != null) {
            param.start = this.timeRange[0].format('yyyy-MM-dd')
          }
          if (this.timeRange[1] != null) {
            param.end = this.timeRange[1].format('yyyy-MM-dd')
          }
        }

        if (this.selectedStatus && this.selectedStatus.value) {
          param.status = this.selectedStatus.value
        }
        param.limit = this.pageInfo.limit
        param.offset = util.buildOffsetByPage(page, this.pageInfo.limit)

        let query = util.buildGetParams(param);

        let url = "/channelverify?" + query;
        let xtoken = sessionStorage.getItem("token")
        this.downloadUrl = ENV.HOST_URL + '/channelverify/download?' + query + "&_token=" + xtoken

        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data;
            this.pageInfo.total = res.body.total
          })
        this.getNoChannelVerify(query);
      },
      download(fileId){
        return util.downloadFileUrl(fileId)
      },
      preview(fileId){
        util.previewFile(fileId)
      },
      deleteItem(id){
        this.$confirm('此操作将永久删除该对账单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let url = "/channelverify/" + id;
            this.$http.delete(url)
              .then((res) => {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })

                this.doGetChanVList(1)
              })
          });
      }
    }
  }
</script>

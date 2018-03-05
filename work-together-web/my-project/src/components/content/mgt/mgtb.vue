<template>
  <div>
    <section class="content-header">
      <h1>
        CP对账
        <small>查看CP对账单</small>
      </h1>
      <ol class="breadcrumb">
        <li>
          <i class="fa fa-dashboard"></i>
          CP结算流
        </li>
        <li>
          <router-link to="/home/mgt/mgtb">对账管理</router-link>
        </li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="col-md-10 form-horizontal">
            <div class="form-group">
                <div class="col-lg-6 col-sm-12">
                  <label class="col-sm-2 control-label">发行商:</label>
                  <div class="col-sm-9 ipt_jianju">
                <!--<multiselect v-model="selectedCompanies" :options="companies"-->
                             <!--placeholder="选择发行商"-->
                             <!--label="name" track-by="id"-->
                             <!--:multiple="true" :taggable="false" :close-on-select="false" :hide-selected="false"-->
                             <!--:clear-on-select="false" @input="doGetCpVerifyList">-->
                <!--</multiselect>-->
                    <el-select v-model="selectedCompanies" :clearable="true"
                               @change="doGetCpVerifyList" filterable multiple placeholder="请选择">
                      <el-option
                        v-for="item in companies"
                        :label="item.name"
                        :value="item">
                      </el-option>
                    </el-select>
              </div>
              <label class="col-sm-2 control-label">账单日期:</label>
              <div class="col-sm-9 ipt_jianju">
                <el-date-picker
                  format="yyyy-MM-dd"
                  v-model="timeRange"
                  type="daterange"
                  :range="true"
                  placeholder="选择时间范围" @input="doGetCpVerifyList">
                </el-date-picker>
              </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <label class="col-sm-2 control-label">对账状态:</label>
                <div class="col-sm-9 ipt_jianju">
                <!--<multiselect v-model="selectedStatus" tag-placeholder="Add this as new tag" placeholder="搜索或搜索状态"-->
                             <!--label="desc" track-by="value" :options="status" :multiple="false" :taggable="false" @input="doGetCpVerifyList">-->
                <!--</multiselect>-->
                  <el-select v-model="selectedStatus" :clearable="true"
                             @change="doGetCpVerifyList" filterable placeholder="请选择">
                    <el-option
                      v-for="item in status"
                      :label="item.desc"
                      :value="item">
                    </el-option>
                  </el-select>
              </div>
            </div>
            </div>
            <div class="col-md-12">
              <div class="row form-group">
                <div class="col-md-3 post-btn">
                <a class="btn-block btn btn-primary" :href="downloadUrl" :disabled="downloadUrl==''">导出excel</a>
              </div>
              <div class="col-lg-3 post-btn">
                <button class="btn-block btn btn-primary" @click=addCpReconciliation(0)>添加对账</button>
              </div>
            </div>
          </div>
        </div>
        <div class="box-body">
          <table class="table table-bordered table-hover">
            <thead>
            <tr>
              <th>账单日期</th>
              <th>我方主体</th>
              <th>发行商</th>
              <th>游戏</th>
              <th>对账状态</th>
              <th>我方流水</th>
              <th>应付金额</th>
              <th>已结算金额</th>
              <th>对账人</th>
              <th>创建/更新时间</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr class="noverify">
              <td>{{ preItem.start_time }} - {{ preItem.end_time }}</td>
              <td></td>
              <td></td>
              <td>{{ preItem.games }}</td>
              <td>未对账</td>
              <td></td>
              <td>{{ preItem.amount_my }}</td>
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
              <td><span v-if="item.company">{{ item.company.name }}</span></td>
              <td class="extend-hover" style="width: 150px">
                <div>{{previewGame(item.games)}}</div>
              </td>
              <td>{{ previewStatus(item.status) }}</td>
              <td>{{ item.amount_my }}</td>
              <td>{{ item.amount_payable }}</td>
              <td>{{ item.amount_settle }}</td>
              <td><span v-if="item.verify_user">{{ item.verify_user.nickname }}</span>({{ item.verify_time | stampToTime }})</td>
              <td>
                <span :title="item.create_user?item.create_user.nickname:''" v-if="item.create_time">{{ item.create_time | stampToTime }}</span> /
                <span :title="item.update_user?item.update_user.nickname:''" v-if="item.update_time">{{ item.update_time | stampToTime}}</span>
              </td>
              <td>
                <el-tooltip class="item item_cursor" effect="dark" content="对账单下载" placement="top-start">
                  <a v-if="item.file_id" :href="download(item.file_id)" target="_blank">
                    <span class="fa fa-download" title="下载"></span>
                  </a>
                </el-tooltip>
                <el-tooltip class="item item_cursor" effect="dark" content="对账单预览" placement="top-start">
                <span class="fa fa-image" style="margin-left:5px;" title="预览"
                      v-if="item.file_preview_id"
                      @click="preview(item.file_preview_id) "></span>
                </el-tooltip>
                <el-tooltip class="item item_cursor" effect="dark" content="对账单编辑" placement="top-start">
                  <span class="fa fa-edit" @click=addCpReconciliation(item.id)></span>
                </el-tooltip>
                <el-tooltip class="item item_cursor" effect="dark" content="删除" placement="top-start">
                  <span class="fa fa-trash" @click=deleteItem(item.id)></span>
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

      </div>
    </div>
  </div>
  </div>

</template>
<style>
  .item_cursor {
    cursor: pointer;
  }
</style>
<style scoped>
  .control-label{
    width: 94px;
  }
  .el-date-editor--daterange.el-input{
    width: 100%;
  }
  th {
    text-align: center;
    background: #367fa9 !important;
    color: white !important;
  }

  td {
    text-align: center;
  }
  .el-date-editor--daterange.el-input{
    width: 100%;
  }
</style>
<script type="text/ecmascript-6">
  import Multiselect from 'vue-multiselect'
  import datepicker from 'vue-date'
  import util from '../../../publicjs/utils'

  export default {
    components: {
      Multiselect,
      datepicker
    },
    data: function () {
      return {
        companies: [], // 发行商选项

        doGetSettleList: [],
        status: [{value: 10, desc: "对账中"}, {value: 20, desc: "对账完毕,未开票"},
          {value: 30, desc: "已收票"}, {value: 100, desc: "已打款"}
        ],

        preItem: {},
        items: [],
        pageInfo: {
          limit: ENV.PAGE_SHOW_COUNT,
          currPage: 1,
          total: 0,
        },
        downloadUrl: "", // 下载链接

        selectedCompanies: [],
        selectedStatus: {},
        timeRange: "",
      }
    },
    mounted: function () {
      this.getCompanies();
      this.doGetCpVerifyList(1);
    },

    methods: {
      reset() {
        this.selectedCompanies = []
        this.selectedStatus = {}
        this.timeRange = ""
        this.doGetCpVerifyList()
      },
      onCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.doGetCpVerifyList(currentPage)
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
          path: '/home/editCpReconciliation'
        })
      },
      addCpReconciliation: function (id) {
        this.$router.push({
          path: '/home/addCpReconciliation' + (id ? '?id=' + id : '')
        })
      },
      //获取开发商下拉框选项
      getCompanies(){
        let url = '/cpverify/companies';
        this.$http.get(url)
          .then(({data}) => {
            this.companies = data
          })
      },

      //获取Cp未对账的信息
      getNoCpVerify: function (query) {
        let url = '/cpverify/pre?' + query;
        this.$http.get(url)
          .then((res) => {
            this.preItem = res.body;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      //查询
      doGetCpVerifyList(page = 1){
        let ids = []
        if (this.selectedCompanies.length != 0) {
          ids = _.map(this.selectedCompanies, 'id')
        }

        let timeStart = ""
        let timeEnd = ""
        if (this.timeRange.length > 1) {
          if (this.timeRange[0] != null) {
            timeStart = this.timeRange[0]
          }
          if (this.timeRange[1] != null) {
            timeEnd = this.timeRange[1]
          }
        }

        let query = util.buildGetParams({
          company_ids: ids.join(","),
          "start|timeFormat": timeStart,
          "end|timeFormat": timeEnd,
          "status|number": this.selectedStatus.value,
          limit: this.pageInfo.limit,
          offset: util.buildOffsetByPage(page, this.pageInfo.limit)
        });

        let token = sessionStorage.getItem("token")
        this.downloadUrl = ENV.HOST_URL + '/cpverify/download?' + query + "&_token=" + token

        let url = "/cpverify?" + query;
        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data;
            this.pageInfo.total = res.body.total
          })
        this.getNoCpVerify(query);
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
            let url = "/cpverify/" + id;
            this.$http.delete(url)
              .then((res) => {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })

                this.doGetCpVerifyList(1)
              })
          });
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .extend-hover {
    div {
      white-space: nowrap;
    }
  }
</style>

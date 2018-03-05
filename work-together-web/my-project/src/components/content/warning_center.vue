<template>
  <div>
    <section class="content-header">
      <h1>预警中心
        <small>查看预警通知</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>预警管理</li>
        <li><i class="fa fa-dashboard"></i>预警中心</li>
        <li>
          <router-link to="/home/GameEvaluation">查看预警通知</router-link>
        </li>
      </ol>
    </section>
    <div class="content">
      <div class="box col-sm-10">
        <div class="box-header with-border">
          <div class="col-md-12 form-horizontal">
            <div class="form-group">
              <el-table
                v-loading="isLoading"
                element-loading-text="拼命加载中"
                class="table table-bordered table-hover"
                :data="items"
                border
                stripe
                style="width: 100%">
                <el-table-column
                  fixed
                  prop="name"
                  label="预警名称">
                  <template scope="scope">
                    <p class="max_widthv">{{ scope.row.type }}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="grade"
                  label="预警等级">
                  <template scope="scope">
                    <p>
                      <span v-if="scope.row.grade===1">蓝色</span>
                      <span v-if="scope.row.grade===2">黄色</span>
                      <span v-if="scope.row.grade===3">橙色</span>
                      <span v-if="scope.row.grade===4">红色</span>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="isRepeat"
                  label="重复发送">
                  <template scope="scope">
                    <p>
                      <span v-if="scope.row.is_repeat===1">是</span>
                      <span v-else>否</span>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="state"
                  label="预警状态">
                  <template scope="scope">
                    <p>
                      <span v-if="scope.row.state===1">开</span>
                      <span v-else>关</span>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作">
                  <template scope="scope">
                    <div class="result_report">
                      <el-tooltip class="item item_cursor" effect="dark" content="编辑" placement="top-start">
                        <span class="fa fa-edit" @click="edit(scope.row)"></span>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="预警编辑"
      v-model="editShow"
      top="5%"
      size="large"
      :close-on-click-modal="false">
      <div :readonly="readonly" @close="onEditClose" class="box">
        <div class="box-header with-border">
          <div class="col-md-8 form-horizontal">
            <div class="form-group">
              <div class="col-sm-10 win_cen_w">
                <p class="cen_p">预警名称:&nbsp <span>{{ editedWarning.type }}</span></p>
                <div
                  v-if="editedWarning.type === 'CP合同到期' || editedWarning.type === '渠道主合同到期' || editedWarning.type === 'cp主合同到期' || editedWarning.type === '渠道合同到期' || editedWarning.type === '渠道合同未签订'
                        || editedWarning.type === '游戏停运公告' || editedWarning.type === '停运游戏渠道合同待处理'
                        || editedWarning.type ==='停运游戏CP合同待处理'">
                  <p>提前：
                    <el-input style="width: 100px" v-model="editedWarning.intervals" placeholder="请输入天数"></el-input>
                    天进行预警
                  </p>
                  <p class="span_p">可输入多个数字，用英文“,”隔开。</p>
                </div>
                <div
                  v-if="editedWarning.type === '停运游戏渠道合同未下架' || editedWarning.type === '停运游戏CP合同未下架' ">
                  <p>关闭服务器后：
                    <el-input style="width: 100px" v-model="editedWarning.intervals" placeholder="请输入天数"></el-input>
                    天进行预警
                  </p>
                  <p class="span_p">可输入多个数字，用英文“,”隔开。</p>
                </div>
                <div v-if="editedWarning.type === 'CP未对账' || editedWarning.type === '合同未对账'">
                  <p>流水阀值：
                    <el-input style="width: 100px" v-model="editedWarning.amount" placeholder="请输入天数"></el-input>
                  </p>
                  <p>报警时间：（1）N+1月20号；</p>
                  <p class="span_p">当月的流水达到阀值后，会在次月进行报警；</p>
                </div>
                <div v-if="editedWarning.type === '渠道流水&阈值'">
                  <p>流水阀值：
                    <el-input style="width: 100px" v-model="editedWarning.amount" placeholder="请输入天数"></el-input>
                  </p>
                </div>
                <div v-if="editedWarning.type === '渠道未回款'">
                  <p>金额阀值：
                    <el-input style="width: 100px" v-model="editedWarning.amount" placeholder="请输入天数"></el-input>
                  </p>
                  <p>未回款时间：
                    <el-input style="width: 100px" v-model="editedWarning.intervals" placeholder="请输入天数"></el-input>
                    天
                  </p>
                </div>
                <p class="cen_p">
                  <el-col :span="24" class="margin_margin">
                    <el-col :span="3" class="min_width">重复发送:</el-col>
                    <el-col :span="14">
                      <el-switch
                        v-model="editedWarning.is_repeat"
                        on-color="#13ce66"
                        off-color="#ff4949">
                      </el-switch>
                    </el-col>
                  </el-col>
                </p>
                <p class="cen_p">
                  <el-col :span="24" class="margin_margin">
                    <el-col :span="3" class="min_width"> 发送对象:</el-col>
                    <el-col :span="10">
                      <el-cascader
                        :disabled="userType==2"
                        :options="sendPeopleOp"
                        :filterable="true"
                        :change-on-select="true"
                        @change="handleChange">
                      </el-cascader>
                    </el-col>
                    <el-col :span="2">
                      <el-button @click="addSendUser()">添加</el-button>
                    </el-col>
                  </el-col>
                <p>
                <el-tag
                  :key="item"
                  v-for="item in editedWarning.user_ids"
                  :closable="true"
                  :close-transition="false"
                  type="primary"
                  @close="handleClose(item)">
                  {{item.name}}
                </el-tag>
                </p>
                <p class="cen_p">
                  <el-col :span="24" class="margin_margin">
                    <el-col :span="3" class="min_width"> 预警等级:</el-col>
                    <el-col :span="12">
                      <el-select class="min_ipt_w" v-model="editedWarning.grade" filterable
                                 placeholder="请选择">
                        <el-option
                          v-for="item in grade_type"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-col>
                </p>
                <p class="cen_p">预警状态:&nbsp <span>
                    <el-switch
                      v-model="editedWarning.state"
                      on-text="已启用"
                      off-text="已停用"
                      :width='72'
                      on-color="#13ce66"
                      off-color="#ff4949">
                    </el-switch>
                  </span>
                </p>
              </div>
            </div>
            <div class="col-sm-10">
              <el-button type="primary" :disabled= disabl @click="submit">保存</el-button>
              <el-button @click="editShow = false" type="primary">取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped>
  .cen_float {
    float: left;
  }

  .cen_p {
    margin-top: 7px;
  }

  .cen_ipt {
    width: 30%;
    min-width: 50px;
  }

  .min_width {
    width: 68px;
    margin-top: 7px;
  }

  .margin_margin {
    margin-bottom: 10px;
  }

  .win_cen_w {
    min-width: 500px;
  }

  .min_option_w {
    width: 150px;
  }

  .margin_btn {
    margin-bottom: 20px;
  }

  .span_p {
    color: #979b9d;
  }
  .el-cascader{
    width: 100%;
  }
</style>
<style>
  .min_ipt_w {
    min-width: 150px;
  }
</style>
<script>
  export default {
    data() {
      return {
        disabl: false,
        readonly: "",
        items: [],
        isLoading: true,
        cascaderCurrValue: null, // 当前cascader选择的value
        editedWarning: {
          id: "",
          intervals: "",
          grade: "",
          type: "",
          amount: 0,
          state: false,
          is_repeat: false,
          user_ids: [],
        },
        editShow: false,
        grade_type: [
          {id: 1, name: "蓝色"},
          {id: 2, name: "黄色"},
          {id: 3, name: "橙色"},
          {id: 4, name: "红色"}
        ],
        pageInfo: {
          limit: ENV.PAGE_SHOW_COUNT,
          currPage: 1,
          total: 0,
        },
        userType: '1',
        sendPeopleOp: [],

      }
    },
    methods: {
      addSendUser(){
        if (!this.cascaderCurrValue) {
          return
        }

        if (this.cascaderCurrValue.length === 1) {
          // 部门
          let depment = this.cascaderCurrValue[0]
          // 找出部门
          let depMent = _.find(this.sendPeopleOp, i => i.value == depment)
          this.editedWarning.user_ids.push({
            type: 1,// 整个部门
            value: depment, // 部门id
            name: depMent.label, // 部门名称
          })
        } else {
          // 个人
          let depment = this.cascaderCurrValue[0]
          let userMail = this.cascaderCurrValue[1]
          // 找出部门
          let depMent = _.find(this.sendPeopleOp, i => i.value == depment)

          // 找出人
          let user = _.find(depMent.children, i => i.value == userMail)
          this.editedWarning.user_ids.push({
            type: 2,// 单个用户
            value: userMail, // 用户email
            name: depMent.label+"/"+user.label, // 部门名称/用户名
          })
        }
      },
      handleClose(item) {
        this.editedWarning.user_ids.splice(this.editedWarning.user_ids.indexOf(item), 1);
      },
      setNull: function () {
        this.editedWarning = {
          id: "",
          intervals: "",
          grade: "",
          type: "",
          amount: 0,
          state: false,
          is_repeat: false,
          user_ids: [],
        }
      },
      addNewWarning: function () {
        this.warningTypeSelect = "";
        this.setNull();
        this.show = true;
      },
      getGameSelectList: function () {
        var url = '/order/game/'
        this.$http.get(url)
          .then((res) => {
            this.games = res.body
          })
      },
      onEditClose(needRefresh){
        this.isShowItemForm = false
        if (needRefresh) {
          this.getChanVList(this.pageInfo.currPage)
        }
      },
      getChannelSelectList: function () {
        var url = '/order/channel/'
        this.$http.get(url)
          .then((res) => {
            this.channels = res.body
          })
          .catch((err) => {
            context.error = err.data
          })
      },
      stringsToNumbers(strings) {
        let nums = []
        for (let i = 0; i < strings.length; i++) {
          nums.push(Number(strings[i]))
        }
        return nums
      },
      handleChange(value) {
        this.cascaderCurrValue = value
      },
      loadSendOption(){
        this.$http.get("/user/getbydep").then(({data}) => {
          this.sendPeopleOp = data
        })
      },
      edit(warning) {
        console.log(warning)
        this.editShow = true
        this.editedWarning = util.objectTransform(warning,{
          user_ids:"json",
          state:(i)=>i===1,
          is_repeat:(i)=>i===1,
        })
        console.log(this.editedWarning)
        if (!this.editedWarning.user_ids){
          this.editedWarning.user_ids = []
        }
      },
      deleteWaring(id) {
      },
      submit() {
        if (this.disabl === false) {
          this.disabl = true
          setTimeout( () => {
            this.disabl = false
          }, 1500);
        }
        let body = util.objectTransform(this.editedWarning,{
          amount:"number",
          user_ids:"json",
          state:(i)=>i?1:0,
          is_repeat:(i)=>i?1:0,
        })

        let post = util.buildPostParams(body);
        let url = '/warning';

        url += "/" + this.editedWarning.id;
        this.$http.put(url, post)
          .then((r) => {
            this.$message({
               type: 'success',
              message: '操作成功',
          })
            this.editShow = false
            this.getWarnings();
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: err.body
            })
          })
      },
      handleClick() {
        this.show = !this.show
      },
      getWarningTypes() {
        let url = "/warningtype";
        this.$http.get(url)
          .then((res) => {
            this.warningTypes = res.body.data;
          })
      },
      getUsers() {
        let url = "/user/?limit=1000";
        this.$http.get(url)
          .then((res) => {
            this.users = res.body.data;
          })
      },
      onCurrentChange(currentPage) {
        this.pageInfo.currPage = currentPage
        this.getWarnings(currentPage)
      },
      getWarnings(page = 1) {
        let query = util.buildGetParams({
          limit: 1000,
          offset: 0
        });
        this.isLoading = true
        let url = "/warning/?" + query
        this.$http.get(url)
          .then((res) => {
            this.items = res.body.data
        this.isLoading = false
          })
      },
    },
    mounted: function () {
      this.getUsers();
      this.getWarnings();
      this.loadSendOption()
    }
  }
</script>

<!--suppress ALL -->
<template>
  <div>
    <section class="content-header">
      <h1>
        渠道对账单
        <small>添加/修改一个渠道下多个游戏对账</small>
      </h1>
      <ol class="breadcrumb">
        <li>
          <router-link to="/home/mgt/mgtc">结算管理</router-link>
        </li>
        <li>
          {{title}}
        </li>
      </ol>
    </section>

    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <h3 class="box-title">
            {{title}}
          </h3>
          <router-link to="/home/channelOfReconciliationv2" class="btn btn-primary" style="float: right">去新版</router-link>
        </div>

        <div class="box-body form-horizontal">
          <div class="form-group">
            <label class="col-sm-2 control-label">我方主体</label>
            <div class="col-sm-10">
              <el-radio-group v-model="bodyMy">
                <el-radio :disabled="id!=0" :label="1">云端</el-radio>
                <el-radio :disabled="id!=0" :label="2">有量</el-radio>
              </el-radio-group>
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-2 control-label">渠道名称</label>
            <div class="col-sm-10">
              <multiselect
                v-model="selectedChannel" :options="channels"
                placeholder="搜索或添加渠道"
                label="name" track-by="cp"
                :multiple="false" :taggable="false"
                :hide-selected="true" :disabled="id!=0">
              </multiselect>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-sm-2 control-label">对账日期</label>
            <div class="col-sm-10">
              <multiselect v-model="selectedDate" tag-placeholder="Add this as new tag" placeholder="搜索或添加区间"
                           label="section" track-by="start_time" :options="sections" :multiple="false"
                           :taggable="false" :hide-selected="true" :disabled="id!=0">
              </multiselect>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-sm-2 control-label">游戏</label>
            <div class="col-sm-10">
              <el-checkbox
                :indeterminate="isIndeterminate" v-model="checkAllGames" :disabled="id!=0"
                @change="handleCheckAllChange"
                style="position: absolute; left: 24px; top: 8px;">全选
              </el-checkbox>
              <el-checkbox-group
                v-model="selectedGames"
                @change="handleSelectedGamesChange">
                <table class="table">
                  <thead>
                  <tr>
                    <th style="width: 65px"></th>
                    <th>游戏名称</th>
                    <th>时间</th>
                    <th>我方流水</th>
                    <th>理论金额</th>
                    <th>对方流水</th>
                    <th>应付金额</th>
                    <th>差额</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,index) in games" track-by="game_id">
                    <td>
                      <el-checkbox :label="item">{{ }}</el-checkbox>
                    </td>
                    <td>
                      {{ item.game_name }}
                    </td>
                    <td>{{ item.date }}</td>
                    <td>{{ item.amount_my }}</td>
                    <td>
                      <i class="fa fa-spinner fa-spin" v-if="item.amount_theory==-1"></i>
                      <span v-else>{{item.amount_theory}}</span>
                    </td>
                    <td>
                      <input class="form-control" title="对方流水"
                             v-model.number="item.amount_opposite"
                             @input="onChange"/></td>
                    <td>
                      <input class="form-control" title="应付金额"
                             v-model.number="item.amount_payable"
                             @input="onChange"/></td>
                    <td v-text="item.amount_diff"></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>总计</td>
                    <td></td>
                    <td v-text="total.amount_my"></td>
                    <td v-text="total.amount_theory"></td>
                    <td v-text="total.amount_opposite"></td>
                    <td v-text="total.amount_payable"></td>
                    <td v-text="total.amount_diff"></td>
                  </tr>
                  </tbody>
                </table>
              </el-checkbox-group>
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-2 control-label">对账状态</label>
            <div class="col-sm-10">
              <multiselect
                v-model="selectedStatus" tag-placeholder="Add this as new tag" placeholder="搜索或搜索状态"
                label="desc" track-by="value" :options="status" :multiple="false" :taggable="false"
                :hide-selected="true">
              </multiselect>
            </div>
          </div>

          <div class="form-group" v-if="selectedStatus&&selectedStatus.value==30">
            <label class="col-sm-2 control-label">回款主体</label>
            <div class="col-sm-10">
              <multiselect
                v-model="selectedCompany" :options="companies"
                placeholder="选择回款主体"
                label="name" track-by="id"
                :multiple="false" :taggable="false"
                :hide-selected="true">
              </multiselect>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-sm-2 control-label">上传结算单</label>
            <div class="col-sm-10">
              <file-uploader v-model="fileId"></file-uploader>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-sm-2 control-label">上传结算单预览图</label>
            <div class="col-sm-10">
              <file-uploader v-model="filePreviewId"></file-uploader>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-sm-2 control-label">对账时间</label>
            <div class="col-sm-10">
              <el-date-picker
                v-model="verifyTime"
                type="date"
                :range="false"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-sm-2 control-label">对账人</label>
            <div class="col-sm-10">
              <multiselect v-model="selectedVerifyUser" tag-placeholder="Add this as new tag" placeholder="搜索或添加对账人"
                           label="nickname" track-by="id" :options="departUsers" :multiple="false" :tagaable="false"
                           :hide-selected="true">
              </multiselect>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-sm-2 control-label">备注</label>
            <div class="col-sm-10">
              <textarea v-model="desc" class="form-control" rows="3" placeholder="请备注 ..."></textarea>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-sm-2 control-label"></label>
            <div class="col-sm-10">
              <button class="btn btn-primary " @click="post">保存</button>
              <button class="btn btn-default " @click="$router.go(-1)">返回</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Multiselect from 'vue-multiselect'
  import datepicker from 'vue-date'
  import util from '../../publicjs/utils'
  import FileUploader from '../public/FileUploader.vue'
  export default {
    components: {
      Multiselect,
      datepicker,
      FileUploader
    },
    data: function () {
      return {
        bodyMy: 1,
        channels: [],   //渠道选项
        title: "",    //页面标题
        dates: [],    //区间选项
        games: [],    //游戏选项
        companies: [], // 回款主体

        selectedGames: [],  //已选中的游戏
        checkAllGames: true,
        isIndeterminate: true,
        selectedChannel: {},   //已选中的渠道
        selectedDate: {}, //已选中的区间
        departUsers: [],  //对账人选项
        selectedStatus: {}, //已选中的状态
        selectedVerifyUser: {}, //已选中的对账人
        selectedCompany: {}, // 已选中的回款主体
        filePreviewId: 0, // 预览文件id
        fileId: 0,// 文件id
        verifyTime: "",
        desc: "", //备注

        items: [],
        status: [{value: 10, desc: "对账中"}, {value: 20, desc: "对账完毕,未开票"},
          {value: 30, desc: "已开票"}],
        trueStatus: [{value: 10, desc: "对账中"}, {value: 20, desc: "对账完毕,未开票"},
          {value: 30, desc: "已开票"}, {value: 100, desc: "已回款"}],
        id: 0,  //修改传过来的id
        one: {},  //修改时的当前对账单

        // 总计
        total: {
          amount_my: 0,
          amount_theory: 0,
          amount_opposite: 0,
          amount_payable: 0,
          amount_diff: 0,
        }
      }
    },

    computed: {
      canAddGames(){
        // 得到所有能选游戏中没添加过的游戏
        if (!this.games || this.games.length == 0) {
          return []
        }

        return _.filter(this.games, (item) => {
          if (!item.game_name) {
            return false
          }
          let has = !!_.find(this.selectedGames, {game_id: item.game_id})
          return !has
        })
      },
      sections(){
        for (let i in this.dates) {
          this.dates[i].section = this.dates[i].start_time + " - " + this.dates[i].end_time;
        }
        return this.dates
      },
      canModify(){
        if (!this.one.status) {
          return true
        }
        return this.one.status != 100 && this.one.status != 30
      }
    },
    watch: {
      bodyMy() {
        if (this.id) {
          return
        }
        this.selectedDate = {}
        this.games = []
        this.selectedGames = []
      },
      selectedChannel(n) {
        if (this.id) {
          return
        }
        this.selectedStatus = {}
        this.selectedCompany = {}
        this.dates = [];
        this.selectedDate = {};
        if (n && n.cp) {
          this.getNovDateByCp(n.cp)
        }
      },
      // 日期改变就获取游戏
      selectedDate(n) {
        if (this.id) {
          return
        }

        this.games = [];
        this.selectedGames = [];
        if (n && n.start_time) {
          this.getNovGamesByCpAndDate(n.cp, n.start_time, n.end_time, this.bodyMy)
        }
      },

      selectedGames() {
        this.sumAmount();
      },

      selectedStatus(){
        let channel = ""
        if (this.selectedChannel && this.selectedChannel.cp) {
          channel = this.selectedChannel.cp
        }

        if (this.selectedStatus && this.selectedStatus.value == 30) {
          // 获取所有回款主体的选项
          this.$http
            .get('/channelverify/remitcompanies?channel_code=' + channel)
            .then(({data}) => {
              this.companies = data
            })
        }
      }
    },
    created(){
      this.id = parseInt(this.$route.query.id)
    },
    mounted: function () {
      let done = _.after(2, () => {
        if (this.id != 0) {
          this.title = "编辑对账单"
          this.getOne(this.id);
        } else {
          this.title = "添加对账单"
        }
      })
      this.getSelectChannels(done);
      this.getDepatUsers(done);
    },
    methods: {
      handleCheckAllChange(event) {
        this.selectedGames = event.target.checked ? this.games : [];
        this.isIndeterminate = false;
      },
      handleSelectedGamesChange(value) {
        let checkedCount = value.length;
        this.checkAllGames = checkedCount === this.games.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.games.length;
      },
      onChange(){
        this.sumAmount()
      },
      sumAmount(){
        let amount_my = 0
        let amount_theory = 0
        let amount_opposite = 0
        let amount_payable = 0
        let amount_diff = 0
        for (let i in this.selectedGames) {
          let game = this.selectedGames[i]
          amount_my += parseFloat(game.amount_my)
          amount_opposite += parseFloat(game.amount_opposite)
          amount_theory += parseFloat(game.amount_theory)
          amount_payable += parseFloat(game.amount_payable)

          game.amount_diff = (game.amount_theory - game.amount_payable).toFixed(2)
          amount_diff += parseFloat(game.amount_diff)
        }
        this.total.amount_my = amount_my.toFixed(2)
        this.total.amount_theory = amount_theory.toFixed(2)
        this.total.amount_opposite = amount_opposite.toFixed(2)
        this.total.amount_payable = amount_payable.toFixed(2)
        this.total.amount_diff = amount_diff.toFixed(2)
      },
      getSelectChannels(done){
        let url = '/channelverify/novchans';
        this.$http.get(url)
          .then((res) => {
            this.channels = res.body;
            done()
          })
      },

      getNovDateByCp(cp){
        let url = '/channelverify/novdate?cp=' + cp;
        this.$http.get(url)
          .then(({data}) => {
            this.dates = data
          })
      },

      getNovGamesByCpAndDate(cp, start, end, body_my){
        let url = '/channelverify/novgames?';
        url += "cp=" + cp + "&start=" + start + "&end=" + end + "&body_my=" + body_my;
        this.$http.get(url)
          .then((res) => {
            let temp = res.body
            for (let i in temp) {
              temp[i].amount_opposite = temp[i].amount_my
            }
            this.games = temp
            this.selectedGames = this.games
            this.checkAllGames = true
            this.isIndeterminate = false
          })
      },

      getDepatUsers(done){
        let url = "/user/devment/6"
        this.$http.get(url)
          .then((res) => {
            this.departUsers = res.body;
            done()
          })
      },
      post(){ // 添加或更新
        if (!this.selectedGames || this.selectedGames.length == 0) {
          this.$message({
            type: 'error',
            message: 'please choose games first'
          })
          return
        }

        if (!this.selectedStatus || !this.selectedStatus.value) {
          this.$message({
            type: 'error',
            message: 'please choose status'
          })
          return
        }
        if (this.selectedStatus.value == 30 && (!this.selectedCompany || !this.selectedCompany.id)) {
          this.$message({
            type: 'error',
            message: 'please choose company'
          })
          return
        }

        if (!this.total.amount_my || !this.total.amount_opposite || !this.total.amount_payable || !this.total.amount_theory) {
          this.$message({
            type: 'error',
            message: 'amount data has error'
          })
          return
        }

        if (!this.selectedVerifyUser || !this.selectedVerifyUser.id) {
          this.$message({
            type: 'warning',
            message: 'please choose user'
          })
          return
        }


        let body = ({
          body_my: this.bodyMy,
          start_time: this.selectedDate.start_time,
          end_time: this.selectedDate.end_time,
          "amount_my|number": this.total.amount_my,
          "amount_theory|number": this.total.amount_theory,
          "amount_opposite|number": this.total.amount_opposite,
          "amount_payable|number": this.total.amount_payable,
          cp: this.selectedChannel.cp,
          verify_user_id: this.selectedVerifyUser.id,
          desc: this.desc,
          status: this.selectedStatus.value,
          remit_company_id: this.selectedCompany ? this.selectedCompany.id : 0,
          game_str: JSON.stringify(this.selectedGames),
          "verify_time|timeToStamp": this.verifyTime,
          "file_id|number": this.fileId,
          "file_preview_id|number": this.filePreviewId,
        });

        let post = util.buildPostParams(body)

        let url = '/channelverify'
        if (this.id == 0) {
          this.$http.post(url, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
            })
        } else {
          url += "/" + this.id
          this.$http.put(url, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
            })
        }
      },

      getOne(id){
        let url = "/channelverify/" + id;
        this.$http.get(url)
          .then((res) => {
            this.one = res.body;
            this.bodyMy = this.one.body_my
            this.selectedChannel = this.one.channel
            this.selectedStatus = _.find(this.trueStatus, {'value': this.one.status})
            this.selectedCompany = this.one.remit_company
            this.games = JSON.parse(this.one.game_str)
            this.selectedGames = this.games

            this.selectedDate = {
              start_time: this.one.start_time,
              end_time: this.one.end_time,
              cp: this.one.cp,
              section: this.one.start_time + " - " + this.one.end_time
            }

            this.verifyTime = util.stampToTime(this.one.verify_time)
            this.selectedVerifyUser = this.one.verify_user
            this.desc = this.one.desc

            this.total.amount_my = this.one.amount_my
            this.total.amount_opposite = this.one.amount_opposite
            this.total.amount_theory = this.one.amount_theory

            this.fileId = this.one.file_id
            this.filePreviewId = this.one.file_preview_id


            // 2017-03-11 : 可以新增游戏
            // 所以重新请求未对账的游戏

            let query = util.buildGetParams({
              cp: this.selectedChannel.cp,
              start: this.selectedDate.start_time,
              end: this.selectedDate.end_time,
              body_my: this.bodyMy
            })
            let url = '/channelverify/novgames?' + query
            this.$http.get(url)
              .then(({data}) => {
                for (let i in data) {
                  data[i].amount_opposite = data[i].amount_my
                }
                this.games = this.games.concat(data)
              })
          })

      },
      addGame(value){

        value.amount_theory = -1
        value.amount_opposite = value.amount_my
        this.selectedGames.push(value)
        let query = util.buildGetParams({
          game_id: value.game_id,
          month: this.selectedDate.start_time.slice(0, 7),
          channel_code: this.selectedChannel.cp
        })
        this.$http.get('/ladder/clearchannel?' + query)
          .then(({data}) => {
            value.amount_theory = data.divideTotal
            value.amount_payable = value.amount_theory
            this.sumAmount()
          })
      }
    }
  };
</script>

<style rel="stylesheet/less" lang="less" scope>

</style>

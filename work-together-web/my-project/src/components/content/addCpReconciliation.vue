<template>
  <div>
    <section class="content-header">
      <h1>
        CP对账单
        <small>添加/编辑发行商下多个游戏对账</small>
      </h1>
      <ol class="breadcrumb">
        <li>
          <router-link to="/home/mgt/mgtc">结算管理</router-link>
        </li>
        <li>
          <i class="fa fa-dashboard"></i> {{title}}
        </li>
      </ol>
    </section>

    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <h3 class="box-title">
            {{title}}
          </h3>
        </div>

        <div class="box-body form-horizontal">
          <div class="form-group">
            <label class="col-sm-2 control-label">我方主体</label>
            <div class="col-sm-10">
              <el-radio-group v-model="bodyMy">
                <el-radio :label=1>云端</el-radio>
                <el-radio :label=2>有量</el-radio>
              </el-radio-group>
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-2 control-label">发行商</label>
            <div class="col-sm-10">
              <multiselect
                v-model="selectedCompany" :options="companies"
                placeholder="选择发行商"
                label="name" track-by="id"
                :multiple="false" :taggable="false" :disabled="id!=0">
              </multiselect>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-sm-2 control-label">日期</label>
            <div class="col-sm-10">
              <multiselect
                v-model="selectedDate" :options="computedDates"
                placeholder="搜索或添加区间"
                label="date" track-by="date"
                :multiple="false" :taggable="false"
                :disabled="id!=0">
              </multiselect>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-sm-2 control-label">选择游戏</label>
            <div class="col-sm-10">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAllGames"
                           @change="handleCheckAllChange"
                           style="position: absolute; left: 24px; top: 8px;">全选
              </el-checkbox>
              <el-checkbox-group v-model="selectedGames" @change="handleSelectedGamesChange">
                <table class="table table-bordered ">
                  <thead>
                  <tr>
                    <th style="width: 65px">
                    </th>
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

                  <tr v-for="(item,index) in games">
                    <td>
                      <el-checkbox :label="item" >{{ }}</el-checkbox>
                    </td>
                    <td>
                      {{item.game_name}}
                    </td>
                    <td v-text="item.date"></td>
                    <td v-text="item.amount_my"></td>
                    <td>
                      <i class="fa fa-spinner fa-spin" v-if="item.amount_theory==-1"></i>
                      <span v-else>{{item.amount_theory}}</span>
                    </td>
                    <td>
                      <input class="form-control" title="对方流水"
                             v-model.number="item.amount_opposite" @input="onAmountInput"/></td>
                    <td>
                      <input class="form-control" title="应付金额"
                             v-model.number="item.amount_payable" @input="onAmountInput"/></td>
                    <td v-text="item.amount_diff"></td>
                  </tr>


                  <tr>
                    <td></td>
                    <td v-text="">
                      总计
                    </td>
                    <td></td>
                    <td v-text="total.amountMy"></td>
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

          <div class="form-group ">
            <label class="col-sm-2 control-label">对账状态</label>
            <div class="col-sm-10">
              <multiselect
                v-model="selectedStatus" :options="status"
                placeholder="搜索或搜索状态"
                label="desc" track-by="value"
                :multiple="false" :taggable="false">
              </multiselect>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-sm-2 control-label">上传对账单</label>
            <div class="col-sm-10">
              <file-uploader v-model="fileId"></file-uploader>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-sm-2 control-label">上传对账单预览图</label>
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
              <multiselect
                v-model="selectedVerifyUser" tag-placeholder="Add this as new tag" placeholder="搜索或添加对账人"
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
              <button class="btn btn-primary" @click="submit">保存</button>
              <!--<button v-else class="btn btn-primary" disabled="true">账单已完成,不能修改</button>-->
              <button class="btn btn-default" @click="$router.go(-1)">返回</button>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>
<style type="text/css" scoped>
  .game-remove {
    color: #9c3328;
    padding: 5px;
    cursor: pointer;
  }

</style>

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
        title: "",    // 页面标题
        companies: [],    // 发行商选项
        dates: [],    // 时间选项
        games: [],    // 游戏选项
        departUsers: [],  // 对账人选项

        selectedCompany: {}, // 选中的发行商
        selectedDate: {}, // 已选中的区间
        selectedGames: [],  // 已选中的游戏
        checkAllGames: true,
        isIndeterminate: true,
        selectedStatus: {}, //已选中的状态
        selectedVerifyUser: {}, //已选中的对账人
        fileId: 0,// 文件id
        filePreviewId: 0, // 预览文件id
        verifyTime: "", // 对账时间
        desc: "", //备注

        // 所有游戏的汇总信息
        total: {
          amountMy: 0, // 理论
          amount_theory: 0, // 理论
          amount_opposite: 0, // 对方
          amount_payable: 0, // 应收
          amount_diff: 0, // 差额
        },
        amount: 0, //对账单流水总额

        status: [{value: 10, desc: "对账中"}, {value: 20, desc: "对账完毕,未开票"}, {value: 30, desc: "已收票"}
//          , {value: 100, desc: "已打款"}
        ],
        trueStatus: [{value: 10, desc: "对账中"}, {value: 20, desc: "对账完毕,未开票"}, {value: 30, desc: "已收票"}, {
          value: 100,
          desc: "已打款"
        }],

        id: 0,  // 编辑状态 id
        one: {},  // 编辑状态当前对账单
      }
    },
    computed: {
      computedDates(){
        for (let i in this.dates) {
          this.dates[i].date = this.dates[i].start_time + " - " + this.dates[i].end_time;
        }
//        console.log(this.dates)
        return this.dates
      },
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
      canModify(){
        if (!this.one.status) {
          return true
        }
        return this.one.status != 100 && this.one.status != 30
      }
    },
    created(){
      this.id = this.$route.query.id;
      if (!this.id) {
        this.id = 0
      }
      this.title = this.id ? "编辑对账单" : "添加对账单"
    },
    mounted: function () {
      if (this.id) {
        let url = "/cpverify/" + this.id
        this.$http.get(url)
          .then(({data}) => {
            this.one = data
            this.bodyMy = data.body_my
            this.selectedCompany = data.company
            this.games = JSON.parse(data.games)
            this.selectedGames = this.games

            this.selectedStatus = _.find(this.trueStatus, {'value': data.status})
            this.selectedVerifyUser = data.verify_user
            this.selectedDate = {
              start_time: data.start_time,
              end_time: data.end_time,
            }
            this.dates = [this.selectedDate]

            this.verifyTime = util.stampToTime(data.verify_time)
            this.desc = data.desc

            this.fileId = data.file_id
            this.filePreviewId = data.file_preview_id

            // 2017-03-11 : 可以新增游戏
            // 所以重新请求未对账的游戏
            let query = util.buildGetParams({
              my_body: this.bodyMy,
              company_id: this.selectedCompany.id,
              start_time: this.selectedDate.start_time,
              end_time: this.selectedDate.end_time,
            })

            this.$http.get('/cpverify/notgames?' + query)
              .then(({data}) => {
                for (let i in data) {
                  data[i].amount_opposite = data[i].amount_my
                }
                this.games = this.games.concat(data)
              })
          })
      }

      this.getDepatUsers()
      this.getCompanies()
    },
    watch: {
      // 选择公司后选择日期
      bodyMy() {
        if (this.id) {
          return
        }
        this.selectedDate = []
        this.games = []
        this.selectedGames = []
      },
      selectedCompany() {
        if (!this.selectedCompany || !this.selectedCompany.id) {
          this.dates = []
          this.selectedDate = {}
          this.isIndeterminate = true
          return
        }
        // 在编辑的时不能修改日期,所以这里只需要显示已选择的日期就行了
        // 因为这里已经添加了对账单,已经不能再次请求回数据
        // 2017-03-11: 如果要做修改时间的话, 应该请求一个数据回来,然后将本次数据拼进去. 暂时未完成.
        if (this.id) {
          return
        }

        this.selectedDate = {}
        let query = util.buildGetParams({
          company_id: this.selectedCompany.id,
        })
        this.$http.get('/cpverify/notdate?' + query)
          .then(({data}) => {
            this.dates = data
          })
      },
      // 选择日期后获取游戏
      selectedDate() {
        // 在编辑的时不能修改游戏,所以这里只需要显示已选择的游戏就行了
        // 因为这里已经添加了对账单,已经不能再次请求回数据
        // 2017-03-11: 如果要做修改时间的话, 应该请求一个数据回来,然后将本次数据拼进去. 暂时未完成.
        if (this.id) {
          return
        }

        if (!this.selectedDate || !this.selectedDate.start_time) {
          this.games = []
          this.selectedGames = []
          this.isIndeterminate = true
          return
        }


        this.selectedGames = []
        let query = util.buildGetParams({
          my_body: this.bodyMy,
          company_id: this.selectedCompany.id,
          start_time: this.selectedDate.start_time,
          end_time: this.selectedDate.end_time,
        })
        this.$http.get('/cpverify/notgames?' + query)
          .then(({data}) => {
            for (let i in data) {
              data[i].amount_opposite = data[i].amount_my
            }
            this.games = data
            this.selectedGames = this.games
            this.checkAllGames = true
            this.isIndeterminate = false
          })
      },
      selectedGames(){
        // var timer = new Timer();
        // timer.sleep(1).do(this.sumAmount())
        this.sumAmount()
      }
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
      getCompanies(){
        let url = '/cpverify/notcompanies';
        this.$http.get(url)
          .then((res) => {
            this.companies = res.body;
          })
      },
      //获取对账人列表，6:结算部人员
      getDepatUsers(){
        let url = "/user/devment/6";
        this.$http.get(url)
          .then((res) => {
            this.departUsers = res.body;
          })
      },
      // 当输入金额时计算差额 和 总金额
      onAmountInput(){
        for (let i in this.selectedGames) {
          let game = this.selectedGames[i]
          if (game.amount_payable != undefined) {
            this.selectedGames[i].amount_diff = (game.amount_theory - game.amount_payable).toFixed(2)
          }
        }

        this.sumAmount()
      },
      // 计算总额
      sumAmount(){
        this.total.amountMy = 0
        this.total.amount_theory = 0
        this.total.amount_opposite = 0
        this.total.amount_payable = 0
        this.total.amount_diff = 0

        for (let i in this.selectedGames) {
          let game = this.selectedGames[i]
          this.total.amountMy += parseFloat(game.amount_my)
          this.total.amount_theory += parseFloat(game.amount_theory)
          this.total.amount_opposite += parseFloat(game.amount_opposite)
          this.total.amount_payable += parseFloat(game.amount_payable)
          this.total.amount_diff += parseFloat(game.amount_diff)
        }
        this.total.amountMy = this.total.amountMy.toFixed(2)
        this.total.amount_theory = this.total.amount_theory.toFixed(2)
        this.total.amount_opposite = this.total.amount_opposite.toFixed(2)
        this.total.amount_payable = this.total.amount_payable.toFixed(2)
        this.total.amount_diff = this.total.amount_diff.toFixed(2)

      },
      //提交或者更新
      submit(){
        let url = '/cpverify'
        if (!this.id) {
          if (!this.selectedGames || this.selectedGames.length == 0) {
            this.$message({
              type: 'error',
              message: 'please choose games first'
            })
            return
          }
          if (!this.total.amountMy || !this.total.amount_opposite || !this.total.amount_payable || !this.total.amount_theory) {
            this.$message({
              type: 'error',
              message: 'amount data has error'
            })
            return
          }
          // post
          let body = {
            body_my: this.bodyMy,
            company_id: this.selectedCompany.id,
            start_time: this.selectedDate.start_time,
            end_time: this.selectedDate.end_time,
            "games|json": this.selectedGames,

            "amount_my|number": this.total.amountMy,
            "amount_opposite|number": this.total.amount_opposite,
            "amount_payable|number": this.total.amount_payable,
            "amount_theory|number": this.total.amount_theory,

            status: this.selectedStatus.value,
            "file_id": this.fileId,
            "file_preview_id": this.filePreviewId,
            verify_user_id: this.selectedVerifyUser.id,
            "verify_time|timeToStamp": this.verifyTime,
            desc: this.desc,
          };
          let post = util.buildPostParams(body);
          this.$http.post(url, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
            })
        } else {
          // put
          let body = ({
            // 2017.03.11 添加游戏等信息的修改
            body_my: this.bodyMy,
            company_id: this.selectedCompany.id,
            start_time: this.selectedDate.start_time,
            end_time: this.selectedDate.end_time,
            "games|json": this.selectedGames,

            "amount_my|number": this.total.amountMy,
            "amount_opposite|number": this.total.amount_opposite,
            "amount_payable|number": this.total.amount_payable,
            "amount_theory|number": this.total.amount_theory,
            // end

            status: this.selectedStatus.value,
            "file_id": this.fileId,
            "file_preview_id": this.filePreviewId,
            verify_user_id: this.selectedVerifyUser.id,
            "verify_time|timeToStamp": this.verifyTime,
            desc: this.desc,
          });
          let post = util.buildPostParams(body);
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
      addGame(value){
        value.amount_theory = -1
        value.amount_opposite = value.amount_my
        this.selectedGames.push(value)

        //let x = value.amount_my
        let query = util.buildGetParams({
          game_id: value.game_id,
          month: this.selectedDate.start_time.slice(0, 7)
        })
        this.$http.get('/ladder/clearcp?' + query)
          .then(({data}) => {
            value.amount_theory = data.divideTotal
            value.amount_payable = value.amount_theory
            this.sumAmount()
          })

//        setTimeout(function() {
//          value.amount_theory = x+1
//        },2000)
      }
    }
  }
  function protime(time) {

  }
  //  function sleep(numberMillis) {
  //    var now = new Date();
  //    var exitTime = now.getTime() + numberMillis;
  //    while (true) {
  //      now = new Date();
  //      if (now.getTime() > exitTime)
  //        return;
  //    }
  //  }
</script>

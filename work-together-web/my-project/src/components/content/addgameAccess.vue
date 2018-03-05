<template>
  <div>
    <div id="edit_h">
      <h3>添加游戏</h3>
      <div class="row">
        <div class=" col-sm-3 times_contract">
          <div class="flow_list_d">
            <div class="dowebok_zz" id="gname">
              <span>游戏名称：</span>
              <multiselect v-model="selectedGames" tag-placeholder="Add this as new tag" placeholder="游戏"
                           label="name" track-by="game_id" :options="games" :multiple="false" :taggable="false">
              </multiselect>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>接入时间:</label>

        <div class="input-group date">
          <div class="input-group-addon">
            <i class="fa fa-calendar"></i>
          </div>
          <el-date-picker
            v-model="importTime"
            placeholder="选择接入时间">
          </el-date-picker>
        </div>
        <!-- /.input group -->
      </div>
      <div class="form-group">
        <label>首发时间:</label>

        <div class="input-group date">
          <div class="input-group-addon">
            <i class="fa fa-calendar"></i>
          </div>
          <el-date-picker
            v-model="publishTime"
            placeholder="选择首发时间">
          </el-date-picker>
        </div>
        <!-- /.input group -->
      </div>
      <!-- /.input group -->
      <div class="situation row">
        <div>类型：</div>
        <div class=" col-sm-3 times_contract">
          <multiselect v-model="selectedGameTypes" tag-placeholder="Add this as new tag" placeholder="类型"
                       label="name" track-by="id" :options="gameTypes" :multiple="false" :taggable="false">
          </multiselect>
        </div>
      </div>
      <div class="situation row">
        <div>合作方式：</div>
        <div class=" col-sm-3 times_contract">
          <multiselect v-model="selectedCooperations" tag-placeholder="Add this as new tag" placeholder="合作方式"
                       label="name" track-by="id" :options="cooperations" :multiple="false" :taggable="false">
          </multiselect>
        </div>
      </div>
      <div class="situation row">
        <div>研发：</div>
        <div class=" col-sm-3 times_contract">
          <multiselect v-model="selectedDevelopments" tag-placeholder="Add this as new tag" placeholder="研发商"
                       label="name" track-by="id" :options="developments" :multiple="false" :taggable="false">
          </multiselect>
        </div>
      </div>
      <div class="situation row">
        <div>发行：</div>
        <div class=" col-sm-3 times_contract">
          <multiselect v-model="selectedIssues" tag-placeholder="Add this as new tag" placeholder="发行商"
                       label="name" track-by="id" :options="issues" :multiple="false" :taggable="false">
          </multiselect>
        </div>
      </div>
      <div class="row">
        <div>保量政策：</div>
        <div class=" col-sm-3 times_contract">
          <input class="form-control input-lg" type="text" v-model="quantityPolicy"
                 placeholder="保量政策"/>
        </div>
      </div>
      <div class="situation row">
        <div>工会政策：</div>
        <div class=" col-sm-3 times_contract">
          <multiselect v-model="selectedSociatys" tag-placeholder="Add this as new tag" placeholder="工会政策"
                       label="name" track-by="id" :options="sociatys" :multiple="false" :taggable="false">
          </multiselect>
        </div>

      </div>
      <div class="situation row">
        <div>接入人：</div>
        <div class=" col-sm-3 times_contract">
          <multiselect v-model="selectedAccessPersons" tag-placeholder="Add this as new tag" placeholder="接入人"
                       label="nickname" track-by="id" :options="accessPersons" :multiple="false" :taggable="false">
          </multiselect>
        </div>
      </div>

      <div class="row">
        <div>阶梯分成：</div>
        <div class=" col-sm-3 times_contract">
          <input class="form-control input-lg" type="text" v-model="remarks"
                 placeholder="阶梯分成"/>
        </div>

      </div>
      <div class="row">
        <div class="col-sm-5 div_p_btn">
          <p>
            <button class="btn btn-default btn_B col-sm-3" @click="post">保存</button>
            <button class="btn btn-default btn_F col-sm-3 col-md-offset-1" @click="back">返回</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<style type="text/css">
  .dowebok_zz {
    margin-bottom: 0 !important;
  }

  #edit_h > div {
    margin-left: 35px;
    padding-bottom: 30px;
  }

  #edit_h h3 {
    padding-bottom: 30px;
    margin-left: 20px;
    padding-top: 30px;
    margin-top: 0;
    margin-bottom: 0;
  }
</style>

<script>
  import Multiselect from 'vue-multiselect'
  import datepicker from 'vue-date'
  import utils from '../../publicjs/utils'
  import {Validator} from 'vee-validate'
  const validator = new Validator({
    gameid: 'required|numeric',
    itime: 'required|numeric',
    ptime: 'required|numeric',
    type: 'required|numeric',
    cooperation: 'required|numeric',
    development: 'required|numeric',
    issue: 'required|numeric',
    sociaty: 'required|numeric',
    person: 'required|numeric',
  });
  export default {
    components: {
      Multiselect,
      utils
    },
    data: function () {
      return {
        selectedGames: [],    //游戏列表
        games: [],
        importTime: [],//接入时间
        publishTime: [], //首发时间
        selectedGameTypes: [],    //游戏类型
        gameTypes: [],
        selectedCooperations: [], //合作方式
        cooperations: [],
        selectedDevelopments: [], //研发商
        developments: [],
        selectedIssues: [],   //发行商
        issues: [],
        quantityPolicy: '', //保量政策
        selectedSociatys: [], //公会政策
        sociatys: [],
        selectedAccessPersons: [], //接入人
        accessPersons: [],
        remarks: '', //备注（阶梯分成）
      }
    },
    methods: {
      back: function () {
        this.$router.push({path: '/home/gameAccess'})
      },
      //获取添加游戏游戏名列表
      getGameList: function () {
        var url = '/game/getAddGame'
        this.$http.get(url)
          .then((res) => {
            this.games = res.body
          })
          .catch((err) => {
            context.error = err.data
          })
      },
      //获取游戏类型列表
      getGameTypeList: function () {
        var url = '/types/?query=type%3A1'
        this.$http.get(url)
          .then((res) => {
            this.gameTypes = res.body
          })
          .catch((err) => {
            context.error = err.data
          })
      },
      //获取合作方式列表
      getCooperationList: function () {
        var url = '/types/?query=type%3A2'
        this.$http.get(url)
          .then((res) => {
            this.cooperations = res.body
          })
          .catch((err) => {
            context.error = err.data
          })
      },
      //获取研发商列表
      getDevelopmentList: function () {
        var url = '/types/?query=type%3A3'
        this.$http.get(url)
          .then((res) => {
            this.developments = res.body
          })
          .catch((err) => {
            context.error = err.data
          })
      },
      //获取发行商列表
      getIssueList: function () {
        var url = '/types/?query=type%3A4'
        this.$http.get(url)
          .then((res) => {
            this.issues = res.body
          })
          .catch((err) => {
            context.error = err.data
          })
      },
      //获取公会政策列表
      getSociatylist: function () {
        var url = '/types/?query=type%3A5'
        this.$http.get(url)
          .then((res) => {
            this.sociatys = res.body
          })
          .catch((err) => {
            context.error = err.data
          })
      },
      //获取接入人（cp商务）列表
      getAccessPersonlist: function () {
        var url = '/user/devment/245'
        this.$http.get(url)
          .then((res) => {
            this.accessPersons = res.body
          })
          .catch((err) => {
            context.error = err.data
          })
      },
      //添加接入游戏
      post() {

        if (!validator.validate('gameid', this.selectedGames.game_id) || !validator.validate('itime', utils.timeToStamp(this.importTime)) || !validator.validate('ptime', utils.timeToStamp(this.publishTime)) || !validator.validate('type', this.selectedGameTypes.id) || !validator.validate('cooperation', this.selectedCooperations.id) || !validator.validate('development', this.selectedDevelopments.id) || !validator.validate('issue', this.selectedIssues.id) || !validator.validate('sociaty', this.selectedSociatys.id) || !validator.validate('person', this.selectedAccessPersons.id)) {
          this.$message({
            message: "输入格式有误",
            type: 'warning'
          });
          return
        }

        let body = {
          game_id: parseInt(this.selectedGames.game_id),
          game_name: this.selectedGames.name,
          "import_time|timeToStamp": this.importTime,
          "publish_time|timeToStamp": this.publishTime,
          game_type: this.selectedGameTypes.id,
          cooperation: this.selectedCooperations.id,
          development: this.selectedDevelopments.id,
          issue: this.selectedIssues.id,
          quantity_policy: this.quantityPolicy,
          sociaty_policy: this.selectedSociatys.id,
          access_person: this.selectedAccessPersons.id,
          remarks: this.remarks,
          switch: 1
        }

        let post = utils.buildPostParams(body)
//        console.log(post)

        let url = '/game'
        this.$http.post(url, post)
          .then((r) => {
            this.$message({
              type: 'success',
              message: '保存成功',
            }),
              this.$router.push({path: '/home/gameAccess'})
          })
      }
    },
    mounted: function () {
      this.getGameList();
      this.getGameTypeList();
      this.getCooperationList();
      this.getDevelopmentList();
      this.getIssueList();
      this.getSociatylist();
      this.getAccessPersonlist();
    }
  };
</script>

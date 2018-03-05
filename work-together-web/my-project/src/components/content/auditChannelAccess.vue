<template>
  <div>
    <div id="edit_h">
      <h3>审核渠道</h3>
      <div class="row">
        <span>游戏名称：{{ gameName }}</span>
      </div>
      <div class="row">
        <span>渠道名称：{{ channelName }}</span>
      </div>
      <div class="row">
        <span>首发时间：{{ publishTime }}</span>
      </div>
      <div class="row">
        <span>我方主体：{{ body }}</span>
      </div>
      <div class="row">
        <span>合作方式：{{ selectedCooperations.name }}</span>
      </div>
      <div class="form-group">
        <span>分成比例：</span>
        <!--<el-button type="primary" icon="plus" @click=addGroup></el-button>-->
        <div>
          <!--<div id="materials_div" v-for="(item,index) in group">-->
          <div id="materials_div" >
            <span :gutter="24" style="margin-left:0px;">
              <el-row>
                <!--<ladder v-model="ladders" :defaultTime="time" :writeable="0"></ladder>-->
                <div v-for="ladder in ladders" class="ladder-item row">
                  <div >
                    <div class="col-md-4">
                      <label>我方比例</label>
                      <div class="input-group">
                        <input type="text" class="form-control" readonly v-model.number="ladder.ratio">
                        <div class="input-group-addon">%</div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <label>通道费</label>
                      <div class="input-group">
                        <input type="text" class="form-control" readonly v-model.number="ladder.slotting_fee">
                        <div class="input-group-addon">%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-row>
            </span>
          </div>
        </div>
      </div>
      <div class="row">
        <span>商务负责人：{{ business }}</span>
      </div>
      <div class="row">
        <div>审核状态：</div>
        <div class=" col-sm-3 times_contract">
          <!--<multiselect v-model="selectedState" tag-placeholder="Add this as new tag" placeholder="请选择"-->
                       <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
                       <!--label="state" track-by="id" :options="state" :multiple="false" :taggable="false">-->
          <!--</multiselect>-->
          <el-select v-model="selectedState" :clearable="true"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in state"
              :label="item.state"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="row">
        <div>审核财务：</div>
        <div class=" col-sm-3 times_contract">
          <!--<multiselect v-model="selectedFinance" tag-placeholder="Add this as new tag" placeholder="请选择"-->
                       <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
                       <!--label="nickname" track-by="id" :options="finance" :multiple="false" :taggable="false">-->
          <!--</multiselect>-->
          <el-select v-model="selectedFinance" :clearable="true"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in finance"
              :label="item.nickname"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="row">
        <div><label>审核标准：</label></div>
        <div class=" col-sm-3 times_contract">
          <span>合同情况：</span>
          <!--<multiselect v-model="selectContractStatus" tag-placeholder="Add this as new tag" placeholder="请选择"-->
                       <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
                       <!--label="status" track-by="id" :options="contractStatus" :multiple="false" :taggable="false">-->
          <!--</multiselect>-->
          <el-select v-model="selectContractStatus" :clearable="true"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in contractStatus"
              :label="item.status"
              :value="item">
            </el-option>
          </el-select>
          <span>回款情况：</span>
          <el-radio class="radio" v-model="payState" label="1">N+1</el-radio>
          <el-radio class="radio" v-model="payState" label="2">其他
            <el-input v-if="payState==2" placeholder="请输入" v-model="input" size="small"></el-input>
          </el-radio>
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

  #materials_div {
    border: 1px solid black;
    margin-top: 30px;
    padding: 30px;
  }
</style>

<script>
  import Multiselect from 'vue-multiselect'
  import datepicker from 'vue-date'
  import utils from '../../publicjs/utils'
  import {Validator} from 'vee-validate'
  import FileUploader from '../public/FileUploader.vue'
  import Ladder from './ladder/Ladder.vue'

  const validator = new Validator({
    state: 'required',
    finance: 'required',
    contract: 'required',
  });
  export default {
    components: {
      Multiselect,
      utils,
      FileUploader,
      Ladder
    },
    data: function () {
      return {
        details: '',
        gameName: '',
        channelName: '',
        publishTime: '',
        body: '',
        business: '',
        selectedCooperations: [],
        cooperations: [],
        selectedState: [],
        state: [
          {id:1, state: '未审核'},
          {id:2, state: '审核中'},
          {id:3, state: '已通过'},
          {id:4, state: '未通过'}],
        selectedFinance: [],
        finance: [],
        selectContractStatus: [],
        contractStatus: [
          {id: 1, status: '未签订'},
          {id: 2, status: '已签订'},
          {id: 3, status: '已到期'},
          {id: 4, status: '进行中'},
          {id: 5, status: '无合作'}],
        payState: '1',
        input: '',
        time: -1,
        ladders: [],
        group: [{ladder: '', selectedChannel: [], channels: []}],      //分成组

      }
    },
    mounted: function () {
      this.getChannelDetails();
    },
    watch:{
      details(){
        this.getCooperationList()
        this.getFinancelist()

        this.selectedState = _.find(this.state, {'id': this.details.state})
        this.selectContractStatus = _.find(this.contractStatus, {'id': this.details.contract_state})
        if(this.details.pay_state == "N+1" || this.details.pay_state == undefined){
          this.payState = '1'
        }else {
          this.payState = '2'
          this.input = this.details.pay_state
        }
        this.selectContractStatus = _.find(this.contractStatus, {'id': this.details.state})
        for(let i in this.details.ladder_front){
          this.details.ladder_front[i].slotting_fee = parseFloat(this.details.ladder_front[i].slotting_fee*100).toFixed(2)
          this.details.ladder_front[i].ratio = parseFloat(this.details.ladder_front[i].ratio*100).toFixed(2)
        }
        this.ladders = this.details.ladder_front
      }
    },
    methods: {
      back: function () {
        this.$router.push({path: '/home/channelAccess'})
      },
      //获取当前渠道接入详情
      getChannelDetails:function () {
        let gameId = this.$route.query.gameId;
        let channel = this.$route.query.channel;

        let query = util.buildGetParams({
          "gameids": gameId,
          "channels": channel,
        })
        var url = '/channelaccess/?' + query

        this.$http.get(url)
          .then((res) => {
            this.details = res.body.data[0]
            this.gameName = this.details.game.game_name
            this.channelName = this.details.channel.name
            this.publishTime = utils.stampToTime(this.details.publish_time)
            this.body = this.details.body_my==1?"云端":"有量"
            this.ladders = this.details.ladder_front
            this.business = this.details.business.nickname
          })
      },
      //获取合作方式列表
      getCooperationList: function () {
        var url = '/types/?query=type%3A2/'
        this.$http.get(url)
          .then((res) => {
            this.cooperations = res.body
            this.selectedCooperations = _.find(this.cooperations, {'id': this.details.cooperation})
          })
      },
      //获取财务列表
      getFinancelist: function () {
        var url = '/user/devment/7'
        this.$http.get(url)
          .then((res) => {
            this.finance = res.body
            this.selectedFinance = _.find(this.finance, {'id': this.details.finance})
          })
      },
      //检查数据合法性
      check: function () {
        if (!validator.validate('state', this.selectedState)) {
          return "请选择审核状态"
        }
        if (!validator.validate('finance', this.selectedFinance)) {
          return "请选择审核财务"
        }
        if (!validator.validate('contract', this.selectContractStatus)) {
          return "请选择合同情况"
        }
        if (this.payState == '2') {
          if(!this.input){
            return "请输入回款情况"
          }
        }
        return ""
      },
      //添加游戏更新
      post() {
        let errInfo = this.check()
        if (errInfo) {
          this.$message({
            type: 'warning',
            message: errInfo
          })
          return
        }

        let body = {
          game_id: this.details.game_id,
          channel_code: this.details.channel_code,
          body_my: this.details.body_my,
          ladders: this.details.ladders,
          state: this.selectedState.id,
          finance: this.selectedFinance.id,
          contract_state: this.selectContractStatus.id,
        }

        if(this.payState == '2') {
          body.pay_state = this.input
        }else{
          body.pay_state = "N+1"
        }

        let post = utils.buildPostParams(body)

//        console.log(post)
//        return

        let url = '/channelaccess/audit/' + this.details.id;
        this.$http.put(url, post)
          .then((r) => {
            this.$message({
              type: 'success',
              message: '保存成功',
            }),
              this.$router.push({path: '/home/channelAccess'})
          })
      }
    },

  };
</script>

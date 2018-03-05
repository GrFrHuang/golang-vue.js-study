<template>
  <div>
    <div id="edit_h">
      <h3>编辑渠道</h3>
      <div class="situation row">
        <label class="times_contracts">游戏名称:</label>
        <div class="col-sm-3 times_contract times_contracty">
          {{ gameName }}
        </div>
      </div>
       <div class="situation row">
        <label class="times_contracts">渠道名称:</label>
        <div class="col-sm-3 times_contract times_contracty">
          {{ channelName }}
        </div>
      </div>
    <div class="situation row">
        <label class="times_contracts">首发时间:</label>
        <div class="col-sm-3 times_contract times_contracty">
          {{publishTime}}
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">我方主体:</label>
        <div class="col-sm-3 times_contract ">
          <!--<multiselect v-model="selectedBodyMy" tag-placeholder="Add this as new tag" placeholder="请选择"-->
                       <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
                       <!--label="name" track-by="id" :options="bodyMy" :multiple="false" :taggable="false">-->
          <!--</multiselect>-->
          <el-select v-model="selectedBodyMy" :clearable="true"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in bodyMy"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">合作方式:</label>
        <div class="col-sm-3 times_contract ">
          <!--<multiselect v-model="selectedCooperations" tag-placeholder="Add this as new tag" placeholder="请选择"-->
                       <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
                       <!--label="name" track-by="id" :options="cooperations" :multiple="false" :taggable="false">-->
          <!--</multiselect>-->
          <el-select v-model="selectedCooperations" :clearable="true"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in cooperations"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="form-group">
        <label>分成比例：</label>
        <!--<el-button type="primary" icon="plus" @click=addGroup></el-button>-->
        <div>
          <!--<div id="materials_div" v-for="(item,index) in group">-->
          <div id="materials_div" >
            <span :gutter="24" style="margin-left:0px;">
              <el-row>
                <ladder v-model="ladders" :defaultTime="time"></ladder>
              </el-row>
            </span>
          </div>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">商务负责:</label>
        <div class="col-sm-3 times_contract ">
          <!--<multiselect v-model="selectedAccessPersons" tag-placeholder="Add this as new tag" placeholder="请选择"-->
                       <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
                       <!--label="nickname" track-by="id" :options="accessPersons" :multiple="false" :taggable="false">-->
          <!--</multiselect>-->
          <el-select v-model="selectedAccessPersons" :clearable="true"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in accessPersons"
              :label="item.nickname"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>
      <!--<div class="row">-->
        <!--<div>商务负责人：</div>-->
        <!--<div class=" col-sm-3 times_contract">-->
          <!--<multiselect v-model="selectedAccessPersons" tag-placeholder="Add this as new tag" placeholder="请选择"-->
                       <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
                       <!--label="nickname" track-by="id" :options="accessPersons" :multiple="false" :taggable="false">-->
          <!--</multiselect>-->
        <!--</div>-->
      <!--</div>-->
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
<style scoped>
  .times_contracty{
    margin-top: 7px;
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
    gameid: 'required',
    channel_id: 'required',
    bodyMy: 'required',
    cooperations: 'required',
    accessPersons: 'required',
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
        selectedBodyMy: [],
        bodyMy: [
          {id: 1, name: "云端"},
          {id: 2, name: "有量"},
        ],
        selectedCooperations: [],
        cooperations: [],
        selectedAccessPersons: [],
        accessPersons: [],
        time: -1,
        ladders: [],
        group: [{ladder: '', selectedChannel: [], channels: []}],      //分成组

      }
    },
    mounted: function () {
      this.getChannelDetails();

      this.getAccessPersonlist();
    },
    watch:{
      details(){
        this.getCooperationList()
        this.getAccessPersonlist()
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
            this.selectedBodyMy = _.find(this.bodyMy, {'id': this.details.body_my})
            this.ladders = this.details.ladder_front

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
      //获取商务负责人列表
      getAccessPersonlist: function () {
        var url = '/user/devment/237'
        this.$http.get(url)
          .then((res) => {
            this.accessPersons = res.body
            this.selectedAccessPersons = _.find(this.accessPersons, {'id': this.details.business_person})

          })
      },
      //检查数据合法性
      check: function () {
        if (!validator.validate('bodyMy', this.selectedBodyMy)) {
          return "请选择我方主体"
        }
        if (!validator.validate('cooperations', this.selectedCooperations)) {
          return "请选择合作方式"
        }
        let flag = 0
        for(let i in this.group){
          if(this.group[i].selectedChannel){
            flag += this.group[i].selectedChannel.length
          }
        }
        if (!validator.validate('accessPersons', this.selectedAccessPersons)) {
          return "请选择商务负责人"
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
          "ladders|json": this.ladders,
          body_my: this.selectedBodyMy.id,
          cooperation: this.selectedCooperations.id,
          business_person: this.selectedAccessPersons.id,
        }

        let post = utils.buildPostParams(body)

//        console.log(post)
//        return

        let url = '/channelaccess/' + this.details.id;
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

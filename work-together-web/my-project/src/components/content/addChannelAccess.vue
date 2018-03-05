<template>
  <div>
    <div id="edit_h">
      <h3>添加渠道</h3>
      <div class="situation row">
        <label class="times_contracts">游戏名称:</label>
        <div class="col-sm-3 times_contract times_contracty">
          <!--<multiselect v-model="selectedGames" tag-placeholder="Add this as new tag" placeholder="请选择"-->
          <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
          <!--label="game_name" track-by="game_id" :options="games" :multiple="false"-->
          <!--:taggable="false">-->
          <!--</multiselect>-->
          <el-select v-model="selectedGames" :clearable="true"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in games"
              :label="item.game_name"
              :value="item.game_id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">渠道名称:</label>
        <div class="col-sm-3 times_contract times_contracty">
          <!--<multiselect v-model="selectedChannels" tag-placeholder="Add this as new tag" placeholder="请选择"-->
          <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
          <!--label="name" track-by="channel_id" :options="allChannelList" :multiple="true"-->
          <!--:taggable="false">-->
          <!--</multiselect>-->
          <el-select v-model="selectedChannels" :clearable="true"
                     multiple filterable placeholder="请选择">
            <el-option
              v-for="item in allChannelList"
              :label="item.name"
              :value="item.channel_id">
            </el-option>
          </el-select>
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
        <div class="col-sm-3 times_contract times_contracty">
          <!--<multiselect v-model="selectedBodyMy" tag-placeholder="Add this as new tag" placeholder="类型"-->
          <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
          <!--label="name" track-by="id" :options="bodyMy" :multiple="false" :taggable="false">-->
          <!--</multiselect>-->
          <el-select v-model="selectedBodyMy" :clearable="true"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in bodyMy"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">合作方式:</label>
        <div class="col-sm-3 times_contract times_contracty">
          <!--<multiselect v-model="selectedCooperations" tag-placeholder="Add this as new tag" placeholder="类型"-->
          <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
          <!--label="name" track-by="id" :options="cooperations" :multiple="false" :taggable="false">-->
          <!--</multiselect>-->
          <el-select v-model="selectedCooperations" :clearable="true"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in cooperations"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="form-group">
        <label>分成比例：</label>
        <el-button type="primary" icon="plus" @click=addGroup></el-button>
        <div>
          <div id="materials_div" v-for="(item,index) in group">
            <span :gutter="24" style="margin-left:0px;">
              <el-row>
                <ladder v-model="item.ladder" :defaultTime="time"></ladder>
              </el-row>
              <el-row>
                  <span>适用渠道：</span>
                <!--<multiselect-->
                <!--v-model="item.selectedChannel" :options="ladderCanSelectedChannels"-->
                <!--tag-placeholder="Add this as new tag" placeholder="类型"-->
                <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
                <!--label="name" track-by="channel_id" :multiple="true"-->
                <!--:taggable="false">-->
                <!--</multiselect>-->
                <el-select v-model="item.selectedChannel" :clearable="true"
                           multiple filterable placeholder="请选择">
                      <el-option
                        v-for="item in ladderCanSelectedChannels"
                        :key="item.cp"
                        :label="item.name"
                        :value="item.channel_id"
                        :disabled="item.disabled">
                      </el-option>
                </el-select>
                <!--</el-col>-->
                <el-col :span="4">
                  <el-button style="margin-top: 0px;" type="primary" icon="minus"
                             @click="group.splice(index,1)"></el-button>
                </el-col>
              </el-row>
            </span>
          </div>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">商务负责人:</label>
        <div class="col-sm-3 times_contract times_contracty">
          <!--<multiselect v-model="selectedAccessPersons" tag-placeholder="Add this as new tag" placeholder="类型"-->
          <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
          <!--label="nickname" track-by="id" :options="accessPersons" :multiple="false" :taggable="false">-->
          <!--</multiselect>-->
          <el-select v-model="selectedAccessPersons" :clearable="true"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in accessPersons"
              :label="item.nickname"
              :value="item.id">
            </el-option>
          </el-select>
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
        selectedGames: [],//游戏列表
        games: [],
        allChannelList: [], //总渠道列表
        selectedChannels: [],
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
        group: [{ladder: '', selectedChannel: [], channels: []}],      //分成组

      }
    },
    computed: {
      ladderCanSelectedChannels(){
        let allLadderSelectedChannels = []
        for (let i in this.group) {
          let item = this.group[i]
          allLadderSelectedChannels = allLadderSelectedChannels.concat(item.selectedChannel)
        }

        for (let i in this.selectedChannels){
          let channel = this.selectedChannels[i]
          if (_.find(allLadderSelectedChannels, (j)=> {
              return j.channel_id == channel.channel_id
            })) {
            channel.disabled = true
          } else{
            channel.disabled = false
          }
        }
        return this.selectedChannels
      }
    },
    watch: {
      selectedGames(){
        if (!this.selectedGames) {
          this.publishTime = ''
        } else {
          this.getPublishTime(this.selectedGames.id);
        }
      },
    },
    mounted: function () {
      this.getGameSelectList();
      this.getAllChannelList();
      this.getCooperationList();
      this.getAccessPersonlist();
    },
    methods: {
      addGroup: function () {
        this.group.splice(0, 0,
          {ladder: '', selectedChannel: [], channels: []}
        )
      },
      back: function () {
        this.$router.push({path: '/home/channelAccess'})
      },
      //获取添加渠道游戏名列表
      getGameSelectList: function () {
        var url = '/game/select' + '?flag=qdjr'
        this.$http.get(url)
          .then((res)=> {
            this.games = res.body
          })
      },
      //获取所有渠道列表
      getAllChannelList: function () {
        var url = '/channel'
        this.$http.get(url)
          .then((res) => {
            this.allChannelList = res.body.data
          })
      },
      //根据选择的游戏id，获取该游戏首发时间
      getPublishTime(id) {
        let query = util.buildGetParams({
          "ids": id,
          "flag": 'tjqd',//添加渠道
        })
        var url = '/game/result?' + query
        this.$http.get(url)
          .then((res) => {
            this.publishTime = utils.stampToTime(res.body.data[0].publish_time)
          })
      },
      //获取合作方式列表
      getCooperationList: function () {
        var url = '/types/?query=type%3A2/'
        this.$http.get(url)
          .then((res) => {
            this.cooperations = res.body
          })
      },
      //获取商务负责人列表
      getAccessPersonlist: function () {
        var url = '/user/devment/237'
        this.$http.get(url)
          .then((res) => {
            this.accessPersons = res.body
          })
      },
      //检查数据合法性
      check: function () {
        if (!validator.validate('gameid', this.selectedGames)) {
          return "请选择游戏"
        }
        if (!validator.validate('channel_id', this.selectedChannels)) {
          return "请选择渠道"
        }
        if (!validator.validate('bodyMy', this.selectedBodyMy)) {
          return "请选择我方主体"
        }
        if (!validator.validate('cooperations', this.selectedCooperations)) {
          return "请选择合作方式"
        }
        let flag = 0
        for (let i in this.group) {
          if (this.group[i].selectedChannel) {
            flag += this.group[i].selectedChannel.length
          }
        }
        if (flag != this.selectedChannels.length) {
          return "分成比例渠道选择有误"
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

        let group = []
        if (this.group != null && this.group.length != 0) {
          for (let i in this.group) {
            var temp = {}
            var channel = []
            temp.ladder = JSON.stringify(this.group[i].ladder)
            for (let j in this.group[i].selectedChannel) {
              channel = channel.concat(this.group[i].selectedChannel[j].cp)
            }
            temp.channel = channel
            group.push(temp)
          }
        }

        let body = {
          game_id: parseInt(this.selectedGames.game_id),
          group: group,
          "publish_time|timeToStamp": this.publishTime,
          body_my: this.selectedBodyMy.id,
          cooperation: this.selectedCooperations.id,
          business_person: this.selectedAccessPersons.id,
        }

        let post = utils.buildPostParams(body)

//        console.log(post)
//        return

        let url = '/channelaccess/'
        this.$http.post(url, post)
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

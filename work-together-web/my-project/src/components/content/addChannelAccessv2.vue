<template>
  <div>
    <div id="edit_h">
      <!--<h3>添加渠道</h3>-->
      <div class="situation row">
        <label class="times_contracts">*&nbsp;&nbsp;游戏名称:</label>
        <div class="col-sm-8 times_contract times_contracty">
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
      <!--buxiaodeweishazibuildbudao-->
      <div class="situation row" v-if="selectedGames">
        <label class="times_contracts">&nbsp;&nbsp;game_id:</label>
        <div class="col-md-8 times_contract times_contracty">
          <input class="form-control" :value="selectedGames?selectedGames:''"/>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">*&nbsp;&nbsp;渠道名称:</label>
        <div class="col-sm-8 times_contract times_contracty">
          <el-select v-model="selectedChannels" :clearable="true"
                     multiple filterable placeholder="请选择">
            <el-option
              v-for="item in allChannelList"
              :label="item.name"
              :value="item.cp">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">*&nbsp;&nbsp;首发时间:</label>
        <div class="col-sm-8 times_contract times_contracty">
          {{publishTime}}
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">*&nbsp;&nbsp;我方主体:</label>
        <div class="col-sm-8 times_contract times_contracty">
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
        <label class="times_contracts">*&nbsp;&nbsp;合作方式:</label>
        <div class="col-sm-8 times_contract times_contracty">
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
      <div class="situation row" style="padding-bottom: 0">
        <label class="times_contracts">*&nbsp;&nbsp;转交下一步:</label>
        <div class="col-sm-8 times_contract times_contracty">
          <el-select v-model="next_step" filterable multiple placeholder="请选择">
            <el-option-group
              v-for="group in Forward"
              :key="group.department"
              :label="group.department">
              <el-option
                v-for="item in group.data"
                :key="item.id"
                :label="item.nickname"
                :value="item.id">
              </el-option>
            </el-option-group>
          </el-select>
        </div>
      </div>
      <p style="margin: 5px;padding-bottom: 25px;color:#a8a8a8"><label style="width: 130px"></label>下一步处理人按照选择顺序依次处理</p>
      <div class="situation row">
        <label class="times_contracts">上传附件:</label>
        <div class="col-sm-8 times_contract times_contracty">
          <div class="col-md-10">
            <div v-for="(file,index) in files" class="ladder-item">
              <div class="item-remove" @click="removeFile(index,1)"><i class="fa fa-trash"></i>
              </div>
              <file-uploader v-model="files[index]"></file-uploader>
            </div>
          </div>
          <div class="col-md-10">
            <el-button type="primary" icon="plus" @click="addFile()">点击上传附件</el-button>
          </div>
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
                <el-select v-model="item.selectedChannel" :clearable="true"
                           multiple filterable placeholder="请选择">
                      <el-option
                        v-for="item in ladderCanSelectedChannels"
                        :key="item.cp"
                        :label="item.name"
                        :value="item.cp"
                        :disabled="item.disabled">
                      </el-option>
                </el-select>
                <el-col :span="4">
                  <el-button style="margin-top: 0px;" type="primary" icon="minus"
                             @click="group.splice(index,1)"></el-button>
                </el-col>
              </el-row>
            </span>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>备注：</label>
        <div>
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="remarks">
          </el-input>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 div_p_btn">
          <p style="margin-top: 15px">
            <el-button @click="post('1')" type="primary" plain>转交下一步</el-button>
            <!--<el-button @click="post('2')" type="primary" plain>返回上一步</el-button>-->
            <el-button @click="close(false)" plain>取消转交</el-button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  #edit_h > div {
    margin-left: 20px!important;
    padding-bottom: 20px;
  }
  #edit_h > div > div{
    line-height: 33px;
    padding-bottom: 0;
  }
</style>
<style type="text/css">
  .dowebok_zz {
    margin-bottom: 0 !important;
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
  import datepicker from 'vue-date'
  import utils from '../../publicjs/utils'
  import FileUploader from '../public/FileUploader.vue'
  import Ladder from './ladder/Ladder.vue'

  export default {
    components: {
      utils,
      FileUploader,
      Ladder
    },
    props: ['workFlow'],
    data: function () {
      return {
        selectedGames: '',//游戏列表
        games: [],
        files: [],
        allChannelList: '', //总渠道列表
        selectedChannels: '',
        publishTime: '',
        selectedBodyMy: '',
        bodyMy: [
          {id: 1, name: "云端"},
          {id: 2, name: "有量"},
        ],
        selectedCooperations: '',
        next_step: [],
        channelId: '',
        remarks: '',
        workflow_name: null,
        workflow_status: null,
        workflow_id: '',
        channel_info: '',
        in_next_node_id: '',
        Forward: [],
        cooperations: [],
//        selectedAccessPersons: '',
//        accessPersons: [],
        time: -1,
        group: [{ladder: '', selectedChannel: [], channels: []}],      //分成组

      }
    },
    computed: {
      ladderCanSelectedChannels() {
        let allLadderSelectedChannels = []
        for (let i in this.group) {
          let item = this.group[i]
          allLadderSelectedChannels = allLadderSelectedChannels.concat(item.selectedChannel)
        }

//        for (let i in this.selectedChannels){
        let channel = []
        for (let i in this.allChannelList) {
          for (let j in this.selectedChannels) {
            if (this.selectedChannels[j] == this.allChannelList[i].cp) {
              channel.push(this.allChannelList[i])
            }
          }
        }
        if (_.find(allLadderSelectedChannels, (j) => {
            return j.channel_id == channel
          })) {
          allLadderSelectedChannels.disabled = true
        } else {
          allLadderSelectedChannels.disabled = false
        }
//        }
        return channel
      }
    },
    watch: {
      selectedGames() {
        if (!this.selectedGames || this.selectedGames.length == 0) {
          this.publishTime = ''
          this.allChannelList = []
        } else {
          this.getAllChannelList(this.selectedGames)
          var id
          for (var i = 0; i < this.games.length; i++) {
            if (this.games[i].game_id === this.selectedGames) {
              id = this.games[i].id
              break
            }
          }
          this.getPublishTime(id);
        }
      },
    },
    mounted: function () {
      this.getGameSelectList();
//      this.getAllChannelList();
      this.getCooperationList();
      this.getworkflowName();
      this.getworkflowId();
//      this.getAccessPersonlist();
    },
    methods: {
      addFile() {
        var defaultFile = _.cloneDeep(this.file)
        this.files.push(defaultFile)
      },
      removeFile(index) {
        // if (this.readonly) {
        //   return
        // }
        this.files.splice(index, 1)
      },
      addGroup: function () {
        this.group.splice(0, 0,
          {ladder: '', selectedChannel: [], channels: []}
        )
      },
      close(needRefresh = false) {
        this.reset()
        this.files = []
        this.next_step = []
        if (this.workFlow === false) {
          this.$emit('close', needRefresh)
        } else {
          this.$emit('close', needRefresh)
        }
      },
      //获取添加渠道游戏名列表
      getGameSelectList: function () {
        var url = '/game/select' + '?flag=qdjr'
        this.$http.get(url)
          .then((res) => {
            this.games = res.body
          })
      },
      //获取该游戏可选择渠道列表
      getAllChannelList(gameId) {
        this.allChannelList = []
        var url = '/channel/add/?gameId=' + gameId
        this.$http.get(url)
          .then((res) => {
            this.allChannelList = res.body
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
      getnodeidList: function (v) {
        for (let i in v.data) {
          if (v.data[i].tb_nickname === '发包流程') {
            this.workflow_id = v.data[i].id
          }
        }
        var url = '/workflow_node/get_next_users/?WfNameId=' + this.workflow_id+ '&step=1'
        this.$http.get(url)
          .then((res) => {
            this.Forward = res.body
          })
        this.reset()
      },
      getworkflowName: function () {
        var url = '/workflow_name/'
        this.$http.get(url)
          .then((res) => {
            this.workflow_name = res.body
            this.getnodeidList(this.workflow_name)
          })
        var onUrl = '/userown/'
        this.$http.get(onUrl)
          .then((res) => {
            this.inonUser = res.body
          })
      },
      getworkflowId: function () {
        var url = '/workflow_node/workflow_node_id/?step=1'
        this.$http.get(url)
          .then((res) => {
            this.in_next_node_id = res.body
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
//      getAccessPersonlist: function () {
//        var url = '/user/devment/237'
//        this.$http.get(url)
//          .then((res) => {
//            this.accessPersons = res.body
//          })
//      },
      //检查数据合法性
      check: function () {
        if (this.selectedGames == null || this.selectedGames.length == 0) {
          return "请选择游戏"
        }
        if (this.selectedChannels == null || this.selectedChannels.length == 0) {
          return "请选择渠道"
        }
        if (this.selectedBodyMy == null || this.selectedBodyMy.length == 0) {
          return "请选择我方主体"
        }
        if (this.selectedCooperations == null || this.selectedCooperations.length == 0) {
          return "请选择合作方式"
        }
        if (!this.group[0].ladder) {
          return "请填写分成比例"
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
//        if (this.selectedAccessPersons==null || this.selectedAccessPersons.length==0) {
//          return "请选择商务负责人"
//        }
        return ""
      },
      //添加游戏更新
      post(v) {
        let errInfo = this.check()
        if (errInfo) {
          this.$message({
            type: 'warning',
            message: errInfo
          })
          return
        }
        let channelCode = this.selectedChannels
        let gameId = this.selectedGames
        let gameName = ''
        let channelName = []
        for (let n in this.games) {
          if (this.selectedGames === this.games[n].game_id) {
            gameName = this.games[n].game_name
          }
        }
        for (let i in this.allChannelList) {
          for (let j in this.selectedChannels) {
            if (this.allChannelList[i].cp === this.selectedChannels[j]) {
              channelName.push(this.allChannelList[i].name)
            }
          }
        }
        let group = []
        if (this.group != null && this.group.length != 0) {
          for (let i in this.group) {
            var temp = {}
            var channel = []
            temp.ladder = JSON.stringify(this.group[i].ladder)
            for (let j in this.group[i].selectedChannel) {
              channel = channel.concat(this.group[i].selectedChannel[j])
            }
            temp.channel = channel
            group.push(temp)
          }
        }
        let onisfiles
        if (this.files[this.files.length - 1]) {
          onisfiles = this.files.toString()
        } else {
          onisfiles = ''
        }
        let body = {
          game_id: parseInt(this.selectedGames),
          group: group,
          "publish_time|timeToStamp": this.publishTime,
          body_my: this.selectedBodyMy,
          accessory: onisfiles,
          cooperation: this.selectedCooperations,
        }
        let post = utils.buildPostParams(body)
        let url = '/channelaccess/'
        this.$http.post(url, post)
          .then((r) => {
            for (let k in channelCode) {
              this.process_transfer(v, channelName[k], channelCode[k], gameName, gameId)
            }
          })
      },
      // 流程转交
      process_transfer(status, channelName, channelCode, gameName, gameId) {
        let wf_name_id
        for (let i in this.workflow_name.data) {
          if (this.workflow_name.data[i].tb_nickname === '发包流程') {
            wf_name_id = this.workflow_name.data[i].id
          }
        }
        let post = {
          'task_name': channelName + '&' + gameName,
          'channel_code': channelCode,
          'game_id': gameId,
          'wf_name_id': wf_name_id,
          'step': 1,
          'department_id': this.inonUser.info.department_id
        }
        if (this.workflow_status !== 1) {
          var url = '/workflow_task/'
          this.$http.post(url, post)
            .then((res) => {
              if (res.body > 0) {
                this.getOne(res.body)
                this.editprocess_transfer(res.body)
              }
            })
        } else {
          var url = '/workflow_task/' + channelCode
          this.$http.get(url)
            .then((res) => {
              this.close(true)
              // this.editprocess_transfer(res.body)
            })
        }
      },
      editprocess_transfer(v) {
        console.log(this.remarks)
        if (this.remarks === '') {
          this.$message({
            type: 'warning',
            message: '请填写备注信息!'
          })
          return false
        }
        let isinuser = []
        for (let i in this.Forward) {
          for (let j in this.Forward[i].data) {
            for (let k in this.next_step) {
              if (this.next_step[k] === this.Forward[i].data[j].id) {
                console.log(this.Forward[i].data[j])
                isinuser.push(this.Forward[i].data[j])
              }
            }
          }
        }
        let isinusers = []
        for (let g in isinuser) {
          isinusers.push({
            'uid': isinuser[g].id,
            'department_id': isinuser[g].department_id,
            'email': isinuser[g].email,
            'name': isinuser[g].nickname
          })
        }
        let put = {
          'user': isinusers,
          'perate_uid': this.inonUser.info.id,
          'department_id': this.inonUser.info.department_id.toString(),
          'remarks': this.remarks,
          'task_id': v,
          'step': this.in_next_node_id.step,
          'next_node_id': this.in_next_node_id.next_node_id,
        }
        var url = '/workflow_task/'
        this.$http.put(url, put)
          .then((res) => {
            this.flowSendPack()
          })
      },
      getOne(id) {
        var onurl = '/workflow_task/task/' + id
        this.$http.get(onurl)
          .then((res) => {
            this.channel_info = res.body
          })
      },
      flowSendPack () {
        let put = this.channel_info
        let user_id = this.channel_info.CurrentUserIds
        put.CurrentUserIds = this.next_step.join(',')
        put.UserId = put.UserId + ',' + user_id
        put.status = 1
        var url = '/workflow_send_package/'
        this.$http.put(url, put)
          .then((res) => {
            this.$message({
              type: 'success',
              message: res.body,
            })
            this.files = []
            this.next_step = []
            this.close(true)
            this.reset()
          })
      },
      reset() {
        this.selectedGames = ''
        this.remarks = ''
        this.selectedChannels = []
        this.publishTime = ''
        this.selectedBodyMy = ''
        this.selectedCooperations = ''
        this.group = [{ladder: '', selectedChannel: [], channels: []}]
        this.ladders = []
//        this.selectedAccessPersons = []
      }
    },

  };
</script>

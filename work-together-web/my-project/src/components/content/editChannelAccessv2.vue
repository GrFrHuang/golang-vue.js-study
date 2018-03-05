<template>
  <div>
    <div id="edit_h">
      <!--<h3>编辑渠道</h3>-->
      <div v-if="effective === true">
        <div class="situation row">
          <label class="times_contracts">游戏名称:</label>
          <div class="col-sm-3 times_contract times_contracty">
            {{ gameName }}
          </div>
        </div>
        <div class="situation row">
          <label class="times_contracts">game_id:</label>
          <div class="col-sm-3 times_contract times_contracty">
            {{ details.game_id }}
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
          <label class="times_contracts">*&nbsp;&nbsp;接入状态:</label>
          <div class="col-sm-8 times_contract ">
            <el-select v-model="selectedState" :clearable="true" :disabled="onreadonly"
                       filterable placeholder="请选择">
              <el-option
                v-for="item in state"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="situation row">
          <label class="times_contracts">*&nbsp;&nbsp;我方主体:</label>
          <div class="col-sm-8 times_contract ">
            <el-select v-model="selectedBodyMy" :clearable="true" :disabled="onreadonly"
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
          <div class="col-sm-8 times_contract ">
            <el-select v-model="selectedCooperations" :clearable="true" :disabled="onreadonly"
                       filterable placeholder="请选择">
              <el-option
                v-for="item in cooperations"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div v-if="workflow === true" class="situation row" style="padding-bottom: 0">
          <label class="times_contracts">*&nbsp;&nbsp;转交下一步:</label>
          <div class="col-sm-8 times_contract times_contracty">
            <el-radio-group @change="getworkflowName" v-model="hand_over">
              <el-radio :label='1'>交给下一步</el-radio>
              <el-radio v-if="in_next_node_id.current_node_id !== ''" :label='2'>返回给商务</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div v-if="workflow === true" class="situation row" style="padding-bottom: 0">
          <div class="col-sm-8 times_contract times_contracty">
            <el-select v-model="next_step" multiple filterable placeholder="请选择">
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
        <p style="margin: 5px;padding-bottom: 25px;color:#a8a8a8">下一步处理人按照选择顺序依次处理</p>
        <div class="situation row">
          <label class="times_contracts">上传附件:</label>
          <div class="col-sm-8 times_contract times_contracty">
            <div class="col-md-10">
              <div v-for="(file,index) in files" class="ladder-item">
                <div class="item-remove" :disabled="remarks.step != 1" @click="removeFile(index,1)"><i
                  class="fa fa-trash"></i>
                </div>
                <file-uploader v-model="files[index]" :readonly="remarks.step != 1"></file-uploader>
              </div>
            </div>
            <div class="col-md-10">
              <el-button :disabled="remarks.step != 1" type="primary" icon="plus" @click="addFile()">点击上传附件
              </el-button>
            </div>
          </div>
        </div>
        <div v-if="remarks.step > 4" class="situation row">
          <label class="times_contracts">*&nbsp;&nbsp;上传合同清单:</label>
          <div class="col-sm-8 times_contract times_contracty">
            <div class="col-md-10">
              <div v-for="(file,index) in onfiles" class="ladder-item">
                <div class="item-remove" :disabled="remarks.step != 5" @click="onremoveFile(index,1)"><i class="fa fa-trash"></i>
                </div>
                <file-uploader :readonly="remarks.step != 5" v-model="onfiles[index]"></file-uploader>
              </div>
            </div>
            <div class="col-md-10">
              <el-button :disabled="remarks.step != 5"  type="primary" icon="plus" @click="onaddFile()">上传合同清单</el-button>
            </div>
          </div>
        </div>


        <div v-if="in_next_node_id.channel_proportion_hide == 1 || workflow !== true" class="form-group">
          <label>分成比例：</label>
          <div>
            <div id="materials_div">
            <span :gutter="24" style="margin-left:0px;">
              <el-row>
                <ladder v-model="ladders" :defaultTime="time" :readonly="onreadonly"></ladder>
              </el-row>
            </span>
            </div>
          </div>
        </div>
        <div v-if="workflow === true" class="form-group">
          <label>备注：</label>
          <div>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="in_remarks">
            </el-input>
          </div>
        </div>

        <div class="situation row">
          <label class="times_contracts">*&nbsp;&nbsp;审核结果：</label>
          <div class="col-sm-8 times_contract times_contracty">
            <el-radio-group v-model="audit_results" @change="results">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">不通过</el-radio>
            </el-radio-group>
          </div>
        </div>


        <div class="form-group " v-if="editId">
          <label class="col-sm-2 control-label">操作日志</label>
          <div class="col-sm-10">
            <div v-if="remarks && workflow === true">
              <el-steps direction="vertical">
                <el-step style="height: 70px" v-for="item in this.step" :key="item.Id"
                         :title="item.CreateTime | stampToTimeFull"
                         :description="item.UserName + item.Remarks"></el-step>
              </el-steps>
            </div>
            <operate-log v-else :keyLabel="operateLabel" :page="27" :dataId="editId" :rand="rand"></operate-log>
          </div>
        </div>
      </div>
      <div v-else>
        <div>
          <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
            <el-tab-pane v-for="(initial,index) in initials" :label="initial.title" :name='initial.name'>
              <initialContract :process="process" :editId="initial.ContractInfoId" :readonly="initial.readonly"
                               :flag="flag" :initials="initials" :rand="initial.rand"
                               :flush="flush" ref="contract"></initialContract>
            </el-tab-pane>
          </el-tabs>
          <el-dialog title="提示" v-model="dialogVisible" size="tiny">
            <p>是否续签此合同？</p>
            <p>（续签后将以续签合同为准）</p>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisibles">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
          </el-dialog>
        </div>
        <div v-if="remarks.step > 4" class="situation row">
          <label class="times_contracts">*&nbsp;&nbsp;上传合同清单:</label>
          <div class="col-sm-8 times_contract times_contracty">
            <div class="col-md-10">
              <div v-for="(file,index) in onfiles" class="ladder-item">
                <div class="item-remove" :disabled="remarks.step != 5" @click="onremoveFile(index,1)"><i class="fa fa-trash"></i>
                </div>
                <file-uploader :readonly="remarks.step != 5" v-model="onfiles[index]"></file-uploader>
              </div>
            </div>
            <div class="col-md-10">
              <el-button :disabled="remarks.step != 5"  type="primary" icon="plus" @click="onaddFile()">上传合同清单</el-button>
            </div>
          </div>
        </div>
        <div v-if="workflow === true" class="situation row" style="padding-bottom: 0">
          <label class="times_contracts">*&nbsp;&nbsp;转交下一步:</label>
          <div class="col-sm-8 times_contract times_contracty">
            <el-radio-group @change="getworkflowName" v-model="hand_over">
              <el-radio :label='1'>交给下一步</el-radio>
              <el-radio v-if="this.in_next_node_id.current_node_id !== ''" :label='2'>返回给商务</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div v-if="workflow === true" class="situation row" style="padding-bottom: 0">
          <div class="col-sm-8 times_contract times_contracty">
            <el-select v-model="next_step" multiple filterable placeholder="请选择">
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
        <p style="margin: 5px;padding-bottom: 25px;color:#a8a8a8">下一步处理人按照选择顺序依次处理</p>
        <div class="form-group">
          <label>备注：</label>
          <div>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="in_remarks">
            </el-input>
          </div>
        </div>
        <div class="situation row">
          <label class="times_contracts">*&nbsp;&nbsp;审核结果：</label>
          <div class="col-sm-8 times_contract times_contracty">
            <el-radio-group v-model="audit_results">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">不通过</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="form-group " v-if="editId">
          <label class="col-sm-2 control-label">操作日志</label>
          <div class="col-sm-10">
            <div v-if="remarks">
              <el-steps direction="vertical">
                <el-step style="height: 70px" v-for="item in this.step" :key="item.Id"
                         :title="item.CreateTime | stampToTimeFull"
                         :description="item.UserName + item.Remarks"></el-step>
              </el-steps>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 div_p_btn">
          <p v-if="workflow !== true" style="margin-top: 15px">
            <el-button :disabled="workflow_status === 1 ? true : false" @click="post('3')" type="primary" plain>保 存
            </el-button>
            <el-button @click="close(false)" plain>关 闭</el-button>
          </p>
          <p v-else-if="workflow === true" style="margin-top: 15px">
            <el-button :disabled="dispost" @click="post('1')" type="primary" plain>转交下一步</el-button>
            <el-button @click="close(true)" plain>取消转交</el-button>
          </p>
          <p v-if="workflow === true && in_next_node_id.current_node_id === ''" style="margin-top: 15px">
            <el-button :disabled="dispost" @click="isend('1')" type="primary" plain>成 功</el-button>
            <el-button :disabled="dispost" @click="isend('2')" type="primary" plain>失 败</el-button>
            <el-button :disabled="dispost" @click="isend('3')" type="primary" plain>挂 起</el-button>
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

  .el-step__title.is-wait, .el-step__description.is-wait {
    color: #0c0c0c !important;
  }

  .el-step__line {
    background-color: #0c0c0c !important;
  }

  .el-step__head.is-text.is-wait {
    color: #0c0c0c !important;
    border-color: #0c0c0c !important;
  }

  .el-step__description.is-wait {
    font-size: 14px;
  }

  #edit_h > div > div {
    padding-bottom: 30px;
  }

  #edit_h > div > h3 {
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
  .times_contracty {
    margin-top: 7px;
  }
</style>
<script>
  import datepicker from 'vue-date'
  import initialContract from './InitialContract.vue'
  import utils from '../../publicjs/utils'
  import FileUploader from '../public/FileUploader.vue'
  import Ladder from './ladder/Ladder.vue'
  import OperateLog from "../public/OperateLog";

  export default {
    components: {
      utils,
      FileUploader,
      Ladder,
      'operate-log': OperateLog,
      initialContract
    },
    props: ['editId', 'remarks', 'readonly', 'workflow', 'rand'],
    data: function () {
      return {
        activeName2: '1',
        initials: [],
        files: [],
        onfiles: [],
        dialogVisible: false,
        effective: false,
        process: true,
        flush: 0,
        flag: 'qd',
        details: '',
        hand_over: 1,
        audit_results: 1,
        onreadonly: false,
        dispost: false,
        gameName: '',
        ContractInfoId: '',
        in_remarks: '',
        channelName: '',
        publishTime: '',
        step: '',
        selectedBodyMy: null,
        bodyMy: [
          {id: 1, name: "云端"},
          {id: 2, name: "有量"},
        ],
        selectedState: null,
        state: [
          {id: 1, name: "上架中"},
          {id: 2, name: "已下架"},
        ],
        selectedCooperations: null,
        cooperations: [],
//        selectedAccessPersons: null,
//        accessPersons: [],
        time: -1,
        ladders: [],
        next_step: [],
        workflow_name: null,
        workflow_id: null,
        in_next_node_id: '',
        inonUser: '',
        channel_info: null,
        Forward: [],
        group: [{ladder: '', selectedChannel: [], channels: []}],      //分成组

        operateLabel: {
          BodyMy: ['我方主体', (i) => {
            let v = _.find(this.bodyMy, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          Cooperation: ['合作方式', (i) => {
            let v = _.find(this.cooperations, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          Ladders: ['分成比例', i => -10086],
          AccessState: ['接入状态', (i) => {
            return i == 1 ? "已接入" : "已下架"
          }]
        },
      }
    },
    mounted: function () {
      this.getworkflowId()
      this.getworkflowName()
      this.workflowHistory()
    },
    watch: {
//      editId(){
//        this.load()
//      },
      rand() {
        this.load()
        this.getEditIds()
        this.getworkflowName()
      },
      readonly() {
        this.getworkflowId()
      },
      details() {
        this.getCooperationList()
//        this.getAccessPersonlist()
      }
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
      onaddFile() {
        var defaultFile = _.cloneDeep(this.onfile)
        this.onfiles.push(defaultFile)
      },
      onremoveFile(index) {
        // if (this.readonly) {
        //   return
        // }
        this.onfiles.splice(index, 1)
      },
      // 渠道信息部分
      close(needRefresh = false) {
        this.in_remarks = ''
        this.$emit('close', needRefresh)
      },
      getOne(id) {
        if (this.workflow === true) {
          this.workflowHistory()
          let game_id
          var onurl = '/workflow_task/task/' + id
          this.$http.get(onurl)
            .then((res) => {
              this.channel_info = res.body
              this.getEditIds()
              let CurrentUserIds = this.channel_info.CurrentUserIds.split(',')
              if (CurrentUserIds.indexOf(this.inonUser.info.id.toString()) === -1) {
                this.dispost = true
              } else {
                if (this.readonly && this.readonly === true){
                  this.dispost = true
                } else {
                  if (this.audit_results === 2) {
                    if (this.hand_over !== 2) {
                      this.dispost = true
                    } else {
                      this.dispost = false
                    }
                  } else {
                    this.dispost = false
                  }
                }
              }
              game_id = res.body.ChannelInfoId
              let url = "/channelaccess/" + game_id;
              this.$http.get(url)
                .then((res) => {
                  this.details = res.body
                  this.gameName = this.details.game.game_name
                  this.channelName = this.details.channel.name
                  this.publishTime = utils.stampToTime(this.details.publish_time)
//            this.selectedBodyMy = _.find(this.bodyMy, {'id': this.details.body_my})
                  this.selectedBodyMy = this.details.body_my
                  this.selectedState = this.details.access_state
                  this.ladders = this.details.ladder_front
                  this.workflow_status = this.details.workflow_status
                  if (this.details.accessory.indexOf(',')) {
                    this.files = this.details.accessory.split(',')
                  } else {
                    this.files = [this.details.accessory]
                  }
                  if (this.details.pact_id.indexOf(',')) {
                    this.onfiles = this.details.pact_id.split(',')
                  } else {
                    this.onfiles = [this.details.pact_id]
                  }
                })
            })
        } else {
          let url = "/channelaccess/" + id;
          this.$http.get(url)
            .then((res) => {
              this.details = res.body
              this.gameName = this.details.game.game_name
              this.channelName = this.details.channel.name
              this.publishTime = utils.stampToTime(this.details.publish_time)
//            this.selectedBodyMy = _.find(this.bodyMy, {'id': this.details.body_my})
              this.selectedBodyMy = this.details.body_my
              this.selectedState = this.details.access_state
              this.ladders = this.details.ladder_front
              this.workflow_status = this.details.workflow_status
            })
        }

      },
      workflowHistory() {
        var url = '/workflow_history/get_log?task_id=' + this.remarks.id
        this.$http.get(url)
          .then((res) => {
            this.step = res.body
          })
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
            this.load()
          })
      },
      getnodeidList: function (v) {
        for (let i in v.data) {
          if (v.data[i].tb_nickname === '发包流程') {
            this.workflow_id = v.data[i].id
          }
        }
        let status,step
        step = this.remarks
        if (this.hand_over === 1) {
          status = ''
        } else {
          status = 1
        }
        var url = '/workflow_node/get_next_users/?WfNameId=' + this.workflow_id + '&step=' + step.step + '&status=' + status
        this.$http.get(url)
          .then((res) => {
            this.Forward = res.body
          })
      },
      getworkflowId: function () {
        var url = '/workflow_node/workflow_node_id/?step=' + this.remarks.step
        this.$http.get(url)
          .then((res) => {
            this.in_next_node_id = res.body
            if (this.in_next_node_id.permissions === '4' || this.readonly === true) {
              this.onreadonly = true
            } else if (this.readonly === false || this.in_next_node_id.permissions !== '4') {
              this.onreadonly = false
            } else {
              this.onreadonly = true
            }
            if (this.workflow === true) {
              if (this.in_next_node_id.workflow_show === 1) {
                this.effective = true
              } else {
                this.effective = false
              }
            } else {
              this.effective = true
            }
          })
      },
      //获取合作方式列表
      getCooperationList: function () {
        var url = '/types/?query=type%3A2/'
        this.$http.get(url)
          .then((res) => {
            this.cooperations = res.body
//            this.selectedCooperations = _.find(this.cooperations, {'id': this.details.cooperation})
            this.selectedCooperations = this.details.cooperation
          })
      },
      //检查数据合法性
      check: function () {
        if (!this.selectedBodyMy) {
          return "请选择我方主体"
        }
        if (!this.selectedCooperations) {
          return "请选择合作方式"
        }
        if (!this.selectedState) {
          return "请选择接入状态"
        }
        if (!this.ladders) {
          return "请输入分成比例"
        }
        return ""
      },
      // 结束流程
      isend(v) {
        if (this.in_remarks === '') {
          this.$message({
            type: 'warning',
            message: '请填写备注信息!'
          })
          return false
        }
        let url = '/workflow_task/status?remarks=' + this.in_remarks + '&channel_id=' + this.details.id + '&id=' + this.remarks.id + '&status=' + v + '&contract_id=' + this.channel_info.ContractInfoId;
        this.$http.get(url)
          .then((r) => {
            this.close(true)
            this.reset()
          })
      },
      //添加游戏更新
      post(v) {
        if (this.effective === false) {
          let errdata = this.$refs.contract[0].getpostData(1)
          if (errdata == false) {
            return false
          }
        }
        let errInfo = this.check()
        if (errInfo != '') {
          this.$message({
            type: 'warning',
            message: errInfo
          })
          return false
        } else {
          let onisfiles
          if (this.onfiles[this.onfiles.length - 1]) {
            onisfiles = this.onfiles.toString()
          } else {
            onisfiles = ''
          }
          let body = {
            "ladders|json": this.ladders,
            body_my: this.selectedBodyMy,
            cooperation: this.selectedCooperations,
//          business_person: this.selectedAccessPersons,
            pact_id: onisfiles,
            access_state: this.selectedState
          }
          let remarksId = this.remarks.id
          let post = utils.buildPostParams(body)
          let url = '/channelaccess/' + this.details.id;
          this.$http.put(url, post)
            .then((r) => {
              if (v !== '3') {
                this.editprocess_transfer(remarksId)
              } else {
                this.$message({
                  type: 'success',
                  message: r.body,
                })
                this.close(true)
                this.reset()
              }
            })
        }
      },
      editprocess_transfer(v) {
        let user_ids = this.channel_info.CurrentUserIds.split(",")
        if (user_ids[0] == this.inonUser.info.id && user_ids.length == 1) {
          if (this.in_remarks === '') {
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
            'remarks': this.in_remarks,
            'step': this.in_next_node_id.step,
            'task_id': v,
          }
          if (this.hand_over === 1) {
            put.next_node_id = this.in_next_node_id.next_node_id
          } else {
            put.next_node_id = this.in_next_node_id.rollback_id.toString()
          }
          var url = '/workflow_task/'
          this.$http.put(url, put)
            .then((res) => {
              this.flowSendPack()
            })
        } else {
          this.flowSendPack()
        }
      },
      results() {
        this.load()
      },
      flowSendPack() {
        let user_id = this.channel_info.CurrentUserIds.split(",")
        // console.log(user_id.splice(-1,1))
        if (user_id[0] == this.inonUser.info.id && user_id.length > 1) {
          let put = this.channel_info
          put.CurrentUserIds = user_id.splice(-1,1)
          put.CurrentUserIds = put.CurrentUserIds.join(',')
          put.UserId = put.UserId + ',' + user_id[0]
          put.status = 2
          put.remarks = this.in_remarks
          var url = '/workflow_send_package/'
          this.$http.put(url, put)
            .then((res) => {
              this.$message({
                type: 'success',
                message: res.body,
              })
              this.close(true)
              this.reset()
            })
        } else if (user_id[0] == this.inonUser.info.id && user_id.length == 1) {
          let put = this.channel_info
          put.CurrentUserIds = this.next_step.join(',')
          put.UserId = put.UserId + ',' + user_id.join()
          var url = '/workflow_send_package/'
          this.$http.put(url, put)
            .then((res) => {
              this.$message({
                type: 'success',
                message: res.body,
              })
              this.close(true)
              this.reset()
            })
        } else {
          this.$message({
            type: 'warning',
            message: '其他人正在操作！请稍后再试',
          })
        }
      },
      // 重置所有输入框
      reset() {
        this.details = ''
        this.gameName = ''
        this.channelName = ''
        this.publishTime = ''
        this.selectedBodyMy = null
        this.next_step = []
        this.selectedCooperations = null
        this.ladders = []
      },
      load() {
//        this.id = this.editId
        this.reset()

        console.log(this.editId)
        if (this.editId != 0) {
          this.getOne(this.editId);
        }
      },
      // 合同部分
      // onEditClose(needRefresh = false){
      //   this.$emit('close', needRefresh)
      // },
      handleClick(tab, event) {
        if (this.activeName2 === 'second') {
          this.dialogVisible = true
        }
      },
      dialogVisibles() {
        this.dialogVisible = false

        let post = utils.buildPostParams({})
        var url = '/contract/renew/' + this.channel_info.ContractInfoId
        this.$http.put(url, post)
          .then((res) => {
            this.initials.splice(this.initials.length - 1, 0, {
              title: "续签合同" + (this.initials.length - 1) + '',
              ContractInfoId: res.body,
              name: this.initials.length - 1 + '',
              readonly: false
            });
            this.flush = Math.random()
            this.rand = Math.random()
            this.initials.splice(this.initials.length - 1, 1)
            this.activeName2 = this.initials.length - 1 + ''
          })
      },
      getEditIds() {
        let url = "/contract/getAllEditIds/" + this.channel_info.ContractInfoId;
        this.$http.get(url)
          .then((res) => {
            this.initials = []
            for (let i in res.body) {
              this.activeName2 = res.body.length - 1 + ''
              this.initials.push({
                title: i == 0 ? "初始合同" : "续签合同" + i,
                ContractInfoId: res.body[i].id,
                rand: Math.random(),
                name: i,
                readonly: this.readonly ? this.readonly : (res.body.length > 1 ? (i == res.body.length - 1 ? false : true) : this.readonly)
              })
            }
            if (res.body[res.body.length - 1].effective_state == 2) {
              this.initials[res.body.length - 1].readonly = true
            }
            if (!this.readonly) {
              //合同状态为已到期或已签订时，可续签
              if (res.body[res.body.length - 1].state == 150 || res.body[res.body.length - 1].state == 151) {
                this.initials.push({
                  title: "+续签",
                  ContractInfoId: res.body[0].id,
                  rand: Math.random(),
                  name: "second",
                  readonly: false
                })
              }
            }
          })
      },
    },

  };
</script>

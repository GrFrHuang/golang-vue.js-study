<template>
  <div>
    <div class="content">
      <div class="box">
        <div class="box-body form-horizontal">
          <div class="form-group ">
            <label class="col-md-2 control-label">游戏名称</label>
            <div class="col-md-10">
              <input class="form-control" :value="details.game?details.game.game_name:''" readonly/>
            </div>
          </div>
          <div class="form-group ">
            <label class="col-md-2 control-label">game_id</label>
            <div class="col-md-10">
              <input class="form-control" :value="details.game?details.game.game_id:''" readonly/>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">{{ flag=="cp"?"发行商":"渠道名称" }}</label>
            <div class="col-md-10">
              <input class="form-control" v-if="flag=='cp'" :value=" details.development?details.development.name:'' "
                     readonly/>
              <input class="form-control" v-if="flag=='qd'" :value="details.channel?details.channel.name:''" readonly/>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">我方主体</label>
            <div class="col-md-10">
              <el-select v-model="selectedBodyMy" :clearable="true" :disabled="true"
                         placeholder="请选择">
                <el-option
                  v-for="item in bodyMy"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="form-group ">
            <label class="col-md-2 control-label">*&nbsp;&nbsp;&nbsp;合同状态</label>
            <div class="col-md-10">
              <el-select v-model="selectContractStatus" :clearable="true" :disabled="readonly"
                         placeholder="请选择">
                <el-option
                  v-for="item in contractStatus"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="form-group ">
            <label class="col-md-2 control-label">
              <span v-if="selectContractStatus!=149 && selectContractStatus!=154 && selectContractStatus!=155">*&nbsp;&nbsp;&nbsp;</span>
              签订日期-终止日期
            </label>
            <div class="col-md-10">
              <el-date-picker
                :disabled="readonly"
                v-model="time"
                type="daterange"
                :range="true"
                format="yyyy-MM-dd"
                placeholder="选择日期范围">
              </el-date-picker>
            </div>
          </div>
          <div class="form-group " v-if="showExpress1">
            <label class="col-md-2 control-labels">*&nbsp;&nbsp;&nbsp;快递信息1</label>
            <div class="col-md-10">
              <div class="row">
                <p class="col-md-10">合同状态&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;已寄出，未回寄</p>
              </div>
              <div class="row">
                <p class="col-md-2 control_p">快递单号</p>
                <p class="col-md-10 ">
                  <el-select v-model="selectExpress1" filterable :clearable="true" :disabled="readonly"
                             placeholder="请选择">
                    <el-option
                      v-for="item in Express"
                      :label="item.number"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </p>
              </div>
            </div>
          </div>
          <div class="form-group " v-if="showExpress2">
            <label class="col-md-2 control-labels">快递信息2</label>
            <div class="col-md-10">
              <div class="row">
                <p class="col-md-10">合同状态&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对方寄出，未收到</p>
              </div>
              <div class="row">
                <p class="col-md-2 control_p">快递单号</p>
                <p class="col-md-10 ">
                  <el-select v-model="selectExpress2" filterable :clearable="true" :disabled="readonly"
                             placeholder="请选择">
                    <el-option
                      v-for="item in Express"
                      :label="item.number"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </p>
              </div>
            </div>
          </div>

          <div class="form-group ">
            <label v-if="details.is_main === 1 || details.is_main === 0" class="col-md-2 control-label">上传合同</label>
            <label v-if="details.is_main === 2" class="col-md-2 control-label">查看合同</label>
            <div v-if="details.is_main === 1 || details.is_main === 0" class="col-md-10">
              <div v-for="(file,index) in files" class="ladder-item">
                <div class="item-remove" @click="removeFile(index,1)" :disabled="readonly"><i class="fa fa-trash"></i>
                </div>
                <file-uploader v-model="files[index]" :readonly="readonly"></file-uploader>
              </div>
            </div>
            <div v-if="details.is_main === 1 || details.is_main === 0" class="col-md-10">
              <el-button type="primary" icon="plus" @click="addFile()" :disabled="readonly">新增合同</el-button>
              <router-link v-if="readonly !== true" :to="channerl_url">立即前往主合同添加</router-link>
            </div>

            <div v-if="details.is_main === 2 && flag !== 'cp'" class="col-md-10">
              <router-link :to="channerl_url">立即前往渠道主合同查看</router-link>
            </div>
            <div v-if="details.is_main === 2 && flag === 'cp'" class="col-md-10">
              <router-link :to="channerl_url">立即前往cp主合同查看</router-link>
            </div>

          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">备注</label>
            <div class="col-md-10">
              <textarea class="form-control" rows="3" placeholder="请备注 ..." v-model="desc"
                        :disabled="readonly"></textarea>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">阶梯</label>
            <div class="col-md-10">
              <ladder v-model="ladders" :defaultTime="time" :readonly="readonly"></ladder>
            </div>
          </div>

          <div class="form-group " v-if="editId">
            <label class="col-sm-2 control-label">操作日志</label>
            <div class="col-sm-10">
              <operate-log :keyLabel="operateLabel" :page="this.flag=='cp' ? 20 : 21" :dataId="editId"
                           :rand="rand"></operate-log>
            </div>
          </div>
          <div v-if="process !== true" class="form-group ">
            <label class="col-md-2 control-label"></label>
            <div class="col-md-10">
              <button class="btn btn-primary" @click="postData()" :disabled="readonly">保存</button>
              <button class="btn btn-default" @click="close(false)">关闭</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style type="text/css" scoped>
  .control_p {
    width: 84px;
    padding-right: 0;
  }

  .control-labels {
    padding-top: 0px;
    margin-bottom: 0;
    text-align: right;
  }
</style>
<script type="text/ecmascript-6">
  import {mapState} from 'vuex'
  import FileUploader from '../public/FileUploader.vue'
  import datepicker from 'vue-date'
  import utils from '../../publicjs/utils'
  import Ladder from './ladder/Ladder.vue'
  import {Pagination} from 'element-ui'
  import OperateLog from "../public/OperateLog";

  export default {
    components: {
      Pagination,
      datepicker,
      FileUploader,
      Ladder,
      'operate-log': OperateLog,
    },
    props: ['editId', 'readonly', 'flag', 'initials', 'rand', 'flush', 'process'],
    data() {
      return {
        time: [],
        files: [],
        file: 0,
        file_id: 0,
        ladders: [],
        channerl_url: '',
        selectContractStatus: null,
        contractStatus: [],
        selectExpress1: null,
        selectExpress2: null,
        Express: [],
        selectedBodyMy: null,
        operateLog: [],
        bodyMy: [{id: 1, name: "云端"},
          {id: 2, name: "有量"}],
        showExpress1: false,
        showExpress2: false,
        desc: '',
        details: {},
        pageInfo: {
          currentPage: 1,
          limit: 8,
          offset: 0,
          total: 0,
        },
        operateLabel: {
          BodyMy: ['我方主体', (i) => {
            let v = _.find(this.bodyMy, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          BeginTime: ['签订日期', (i) => {
            return util.stampToTime(i)
          }],
          EndTime: ['终止日期', (i) => {
            return util.stampToTime(i)
          }],
          FileId: ['合同', i => -10086],
          Desc: '备注',
          Ladder: ['阶梯分成', i => -10086],
          EffectiveState: ['有效状态', (i) => {
            return i == 1 ? '有效' : '无效'
          }]
        },
      }
    },
    methods: {
      close(needRefresh = false) {
        this.$emit('close', needRefresh)
      },
      //检查数据合法性
      check: function () {
//        if (!this.selectedBodyMy) {
//          return "请选择我方主体"
//        }
        if (!this.selectContractStatus) {
          return "请选择合同状态"
        }
//        if(this.selectContractStatus!=149 && this.selectContractStatus!=154 && this.selectContractStatus!=155){
        if (this.time == undefined || this.time[0] == null || isNaN(this.time[0].getTime())) {
          return "请选择签订日期"
        }
//        }
        if (this.showExpress1) {
          if (!this.selectExpress1) {
            return "请选择快递信息1快递单号"
          }
        }
        if (this.showExpress2) {
          if (!this.selectExpress2) {
            return "请选择快递信息2快递单号"
          }
        }

        return ""
      },
      addFile() {
        var defaultFile = _.cloneDeep(this.file)
        this.files.push(defaultFile)
      },
      removeFile(index) {
        if (this.readonly) {
          return
        }
        this.files.splice(index, 1)
      },
      postData(v) {
        let errInfo = this.check()
        if (errInfo) {
          this.$message({
            type: 'warning',
            message: errInfo
          })
          return false
        } else {
          let Express = {
            number1: this.selectExpress1 ? this.selectExpress1 : 0,
            number2: this.selectExpress2 ? this.selectExpress2 : 0,
          }
          let post = utils.buildPostParams({
            id: this.details.id,
            company_type: this.flag == "cp" ? 0 : 1,
            state: this.selectContractStatus,
            "ladders|json": this.ladders,
            desc: this.desc,
            "file_id|json": this.files,
            "end_time|timeToStamp": this.time[1],
            "begin_time|timeToStamp": this.time[0],
            express: Express
          })

          let url = '/contract/' + this.details.id

          this.$http.put(url, post)
            .then((r) => {
              if (v != 1) {
                this.$message({
                  message: "修改成功",
                  type: 'success'
                });
              }
              this.close(true)
            })
        }
      },
      //获取合同状态列表
      getContractStatusList: function () {
        var url = '/types/?query=type%3A10'
        this.$http.get(url)
          .then((res) => {
            this.contractStatus = res.body

            this.operateLabel.State = ['合同状态', (i) => {
              let v = _.find(this.contractStatus, (ii) => {
                return ii.id === i
              })
              return v ? v.name : ''
            }]
          })
      },
      //获取快递信息列表
      getExpressList: function () {
        var url = '/expressManage/expressList/'
        this.$http.get(url)
          .then((res) => {
            this.Express = res.body
          })
      },
      load() {
        this.reset()
        this.getContractStatusList()

        if (this.editId != 0 && this.editId != undefined) {
          this.getOne(this.editId);
        }
      },
      reset() {
        this.time = []
        this.ladders = []
        this.files = []
        this.selectContractStatus = null
        this.selectExpress1 = null
        this.selectExpress2 = null
        this.selectedBodyMy = null
//        this.number1 = ''
//        this.number2 = ''
      },
      getpostData(v) {
        let post_data = this.postData(v)
        if (post_data == false) {
          return false
        } else {
          return true
        }
      },
      getOne(id) {
        let url = "/contract/" + id + "?flag=" + this.flag;
        this.$http.get(url)
          .then((res) => {
            this.details = res.body
            if (this.flag == "cp") {
              this.channerl_url = '/home/addresslist?cps=' + this.details.development.id
            } else {
              this.channerl_url = '/home/addresslist?cp=' + this.details.channel.cp
            }
            this.selectedBodyMy = this.details.body_my
            if (this.details.begin_time === undefined) {
              this.time = ''
            } else {
              this.time = [
                util.parseDate(this.details.begin_time),
                util.parseDate(this.details.end_time)
              ]
            }
            this.selectContractStatus = this.details.state
//            this.file_id = this.details.file_id
            this.files = JSON.parse(this.details.file_id)
            this.desc = this.details.desc
            this.ladders = this.details.ladder_front

            if (this.details.express.id) {
              this.showExpress1 = this.details.express.express_id1 ? true : false
              this.showExpress2 = this.details.express.express_id2 ? true : false

              this.selectExpress1 = this.details.express.number1 ? this.details.express.number1 : null
              this.selectExpress2 = this.details.express.number2 ? this.details.express.number2 : null
            }

//            if(this.flag == "cp"){
//              let gameId = this.details.game_id
//
//              let query = util.buildGetParams({
//                game_id: gameId,
//              })
//              let url = "/ladder/cp?" + query
//              this.$http.get(url)
//                .then((res) => {
//                  this.ladders = res.body
//
//                  if(this.ladders.length === 0){
//                    this.ladders = this.details.ladder_front
//                  }
//                })
//            }else if(this.flag == "qd"){
//              let channelCode = this.details.channel_code
//              let gameId = this.details.game_id
//
//              let query = util.buildGetParams({
//                channel_code: channelCode,
//                game_id: gameId,
//              })
//              this.$http.get("/ladder/channel?" + query)
//                .then((res) => {
//                  this.ladders = res.body
//                  if (this.ladders==null || this.ladders.length==0){
//                    this.ladders = this.details.ladder_front
//                  }
//                })
//            }
          })
      },
    },
    mounted: function () {
      this.load()
    },
    watch: {
      editId() {
        this.load()
      },
      flush() {
        this.load()
      },
      selectContractStatus() {
        if (this.selectContractStatus == 152) {
          this.getExpressList()
          this.showExpress1 = true
          this.showExpress2 = false
        } else if (this.selectContractStatus == 153) {
          this.getExpressList()
          this.showExpress1 = true
          this.showExpress2 = true
        } else {
          this.showExpress1 = false
          this.showExpress2 = false
        }
        //当合同状态为已到期或已签订时可以续签合同
//        if(this.selectContractStatus==150 || this.selectContractStatus==151){
//          //防止出现多个续签标签页
//          if(this.initials[this.initials.length-1].title != "+续签"){
//            this.initials.push({
//              title: "+续签",
//              editId: this.editId,
//              name: "second",
//              readonly: false
//            })
//          }
//        }
      },
    }
  };
</script>

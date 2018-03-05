<template>
  <div>
    <div>
      <div id="resear">
        <div v-if="oneditId === 2" class="situation row contact_div">
          <label class="times_contracts">渠道名称:</label>
          <div class="col-sm-5 times_contract">
            <el-select v-model="onform.channel_code" :clearable="true"
                       filterable placeholder="请选择" :disabled="onform.id !== 0">
              <el-option
                v-for="item in channels"
                :label="item.name"
                :value="item.cp">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">公司名称:</label>
          <div class="col-sm-5 times_contract">
            <el-select v-model="onform.company_id" :clearable="true"
                       filterable placeholder="请选择" :disabled="onform.id !== 0">
              <el-option
                v-for="item in companies"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div v-if="oneditId === 1" class="situation row contact_div">
          <label class="times_contracts">平台名称:</label>
          <div class="col-sm-5 times_contract">
            <el-select v-model="onform.platform_name" :clearable="true"
                       filterable placeholder="请选择" :disabled="onform.id !== 0">
              <el-option
                v-for="item in channels"
                :label="item.name"
                :value="item.cp">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">我方主体:</label>
          <div class="col-sm-5 times_contract">
            <el-select v-model="form.body_my" :clearable="true"
                       filterable placeholder="请选择">
              <el-option
                v-for="item in mainBody"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">游戏名称:</label>
          <div class="col-sm-5 times_contract">
            <el-select v-model="form.game_ids" multiple :clearable="true"
                       filterable placeholder="请选择">
              <el-option
                v-for="item in gamenames"
                :key="item.game_name"
                :label="item.game_name"
                :value="item.game_id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">签订状态:</label>
          <div class="col-sm-5 times_contract">
            <el-select v-model="form.state" :clearable="true"
                       filterable placeholder="请选择">
              <el-option
                v-for="item in cooperateState"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">签订人:</label>
          <div class="col-sm-5 times_contract">
            <el-select v-model="form.sign_person" :clearable="true" :disabled="onform.main_contract_id !== 0"
                       filterable placeholder="请选择">
              <el-option
                v-for="item in users"
                :label="item.nickname"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">签订日期:</label>
          <div class="col-sm-5 times_contract">
            <el-date-picker
              v-model="form.sign_time"
              type="date"
              format="yyyy-MM-dd"
              @change="getSTime"
              placeholder="-">
            </el-date-picker>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">起始日期-终止日期:</label>
          <div class="col-sm-5 times_contract">
            <el-date-picker
              v-model="form.time"
              type="daterange"
              format="yyyy-MM-dd"
              range-separator="至"
              placeholder="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">上传合同:</label>
          <div class="col-sm-5 times_contract">
            <div v-for="(file,index) in files" class="ladder-item">
              <div class="item-remove" @click="removeFile(index,1)" :disabled="readonly"><i class="fa fa-trash"></i>
              </div>
              <file-uploader v-model="files[index]" :readonly="readonly"></file-uploader>
            </div>
          </div>
          <div class="col-sm-5 times_contract">
            <el-button type="primary" icon="plus" @click="addFile()" :disabled="readonly">新增合同</el-button>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">备注:</label>
          <div class="col-sm-5 times_contract">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="form.desc">
            </el-input>
          </div>
        </div>
        <div class="situation row contact_div" v-if="row.main_contract_id">
          <label class="times_contracts">操作日志</label>
          <div class="col-sm-10">
            <operate-log :keyLabel="operateLabel" :page="38" :dataId="row.main_contract_id" :rand="rand"></operate-log>
          </div>
        </div>
        <div class="row contact_div">
          <div class="dowebok form-control_statesd">
            <p>
              <button class="btn btn-default btn_B col-sm-3" :disabled=disabl @click="submit()">保存</button>
              <button class="btn btn-default btn_F col-sm-3 col-md-offset-1" @click="close(false)">返回</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import OperateLog from "../public/OperateLog";
  import FileUploader from '../public/FileUploader.vue'

  export default {
    components: {
      'operate-log': OperateLog,
      FileUploader,
    },
    props: ['row', 'oneditId', 'rand', 'readonly'],
    data() {
      return {
        editId: 0,
        form: {},
        files: [],
        onform: {},
        disabl: false,
        time: [],
        mainBody: [{
          name: '云端',
          id: 1
        }, {
          name: '有量',
          id: 2
        }],
        emptyForm: {
          id: 0,
          body_my: '',
          game_ids: [],
          begin_time: '',
          company_id: '',
          company_type: 2,
          sign_person: '',
          state: '',
          time: '',
          file_id: [],
          desc: ''
        },
        users: [],
        channels: [],
        companies: [],
        gamenames: [],
        cooperateState: null,
        operateLabel: {
          CompanyId: ['公司名称', (i) => {
            let v = _.find(this.companies, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          ChannelCode: ['渠道名称', (i) => {
            let v = _.find(this.channels, (ii) => {
              return ii.cp === this.onform.channel_code
            })
            return v ? v.name : ''
          }],
          BodyMy: ['我方主体', (i) => {
            let v = _.find(this.mainBody, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          State: ['签订状态', (i) => {
            let v = _.find(this.cooperateState, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          SignPerson: ['签订人', (i) => {
            let v = _.find(this.users, (ii) => {
              return ii.id === i
            })
            return v ? v.nickname : ''
          }],
          SignTime: '签订时间',
          BeginTime: '起始时间',
          EndTime: '终止时间',
          FileId: ['合同', i => -10086],
          GameIds: ['游戏', i => -10086],
          Desc: '备注',
        }
      }
    },
    methods: {
      getSTime(val) {
        this.form.sign_time = val
      },
      addFile(){
        var defaultFile = _.cloneDeep(this.file)
        this.files.push(defaultFile)
      },
      removeFile(index){
        if (this.readonly) {
          return
        }
        this.files.splice(index, 1)
      },
      getChannelSelectList: function () {
        let url = '/channelCompany/channels/'
        this.$http.get(url)
          .then((res) => {
            this.channels = res.body
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: err.body
            })
          })
      },
      getCompanySelectList: function () {
        let url = '/companytype/?limit=1000'
        this.$http.get(url)
          .then((res) => {
            this.companies = res.body.data;
          })
      },
      getgamenamesSelectList: function () {
        let url = '/mainContract/gameName?company_id=' + this.row.company_id + '&type=2'
        this.$http.get(url)
          .then((res) => {
            this.gamenames = res.body;
          })
      },
      getcooperateStateSelectList: function () {
        let url = '/types/?query=type%3A11'
        this.$http.get(url)
          .then((res) => {
            this.cooperateState = res.body;
          })
      },
      getUsers() {
        let url = "/user/?limit=1000";
        this.$http.get(url)
          .then((res) => {
            this.users = res.body.data;
          })
      },
      submit() {
        if (this.disabl === false) {
          this.disabl = true
          setTimeout(() => {
            this.disabl = false
          }, 1500);
        }
        this.form.begin_time = this.form.time[0].format('yyyy-MM-dd');
        this.form.end_time = this.form.time[1].format('yyyy-MM-dd');
        this.form.file_id = JSON.stringify(this.files);
        this.form.game_ids = this.form.game_ids.toString();
        this.form.company_id = this.onform.company_id;
        this.form.company_type = 2;

        let url = "/mainContract/"
        let body = util.objectTransform(this.form, {
          remit_company: 'json',
        })
        let post = util.buildPostParams(body)

        if (this.onform.main_contract_id !== 0) {
          this.$http.put(url + this.onform.main_contract_id, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.close(true)
            })
        } else {
          this.$http.post(url, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.close(true)
              this.resetForm()
            })
        }
      },

      resetForm() {
        this.form = _.cloneDeep(this.emptyForm)
        this.files = []
      },
      init() {
        this.resetForm()
        this.getCompanySelectList()
        this.getChannelSelectList()
        this.getgamenamesSelectList()
        this.getcooperateStateSelectList()
        this.getUsers()
        if (this.row) {
          console.log('1')
          this.onform = this.row
          if (this.onform.main_contract_id !== 0) {
            let url = "/mainContract/" + this.onform.main_contract_id;
            this.$http.get(url)
              .then((res) => {
                res.body.time = [new Date(res.body.begin_time), new Date(res.body.end_time)]
                res.body.file_id = res.body.file_id ? JSON.parse(res.body.file_id) : ''
                res.body.game_ids = res.body.game_ids ? JSON.parse('[' + res.body.game_ids + ']') : ''
                this.form = res.body;
                this.files = res.body.file_id
                this.editId = res.body.id
              })
          }
        }
      },
      close(needRefresh = false) {
        this.$emit('close', needRefresh)
      },
    },
    watch: {
      rand(){
        this.init()
      },
    },
    created() {
      this.resetForm()
    },
    mounted() {
      this.init()
    }
  }
</script>

<style>
  .times_contract .el-upload__input {
    display: none !important;
  }
</style>
<style scope>
  .contact_div {
    margin-left: 35px;
    padding-bottom: 30px;
  }

  #resear_h3 h3 {
    padding-bottom: 30px;
    margin-left: 20px;
    padding-top: 30px;
    margin-top: 0;
  }

  .el-table__body td > input {
    width: 70%;
    margin: auto;
  }

  .el-table__body td, #tabl_bod th {
    text-align: center;
  }
</style>

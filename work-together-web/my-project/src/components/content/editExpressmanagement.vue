<template>
  <div>
    <div class="content">
      <div class="box">
        <div class="box-body form-horizontal">
          <div class="form-group ">
            <label class="col-md-2 control-label">*&nbsp;快递单号:</label>
            <div class="col-md-10">
              <el-input v-model="number" placeholder="请输入快递单号" :disabled="readonly"></el-input>
            </div>
          </div>
          <div class="form-group ">
            <label class="col-md-2 control-label">*&nbsp;收件公司类型:</label>
            <div class="col-md-10">
              <el-select v-model="selectCompanyType" :clearable="true" :disabled="readonly"
                         placeholder="请选择">
                <el-option
                  v-for="item in companyType"
                  :label="item.companyType"
                  :value="item.id"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">*&nbsp;收件公司:</label>
            <div class="col-md-10">
              <el-select v-model="selectedCompanies" :clearable="true" :disabled="readonly" filterable
                         placeholder="首先公司类型后请选择">
                <el-option
                  v-for="item in companies"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">*&nbsp;收件地址:</label>
            <div class="col-md-10">
              <el-select v-model="selectedAddress" :clearable="true" :disabled="readonly" filterable placeholder="请选择">
                <el-option
                  v-for="item in address"
                  :label="item.name"
                  :value="item.key">
                </el-option>
              </el-select>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">*&nbsp;收件人:</label>
            <div class="col-md-10">
              <el-select v-model="selectRecevers" :clearable="true" :disabled="readonly"
                         placeholder="请选择">
                <el-option
                  v-for="item in recevers"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="form-group ">
            <label class="col-md-2 control-label">*&nbsp;我方主体:</label>
            <div class="col-md-10">
              <el-select v-model="selectedBodyMy" :clearable="true" :disabled="readonly"
                         placeholder="请选择">
                <el-option
                  v-for="item in bodyMy"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="form-group ">
            <label class="col-md-2 control-label">*&nbsp;邮寄方式:</label>
            <div class="col-md-10">
              <el-select v-model="selectPostWay" :clearable="true" :disabled="readonly"
                         placeholder="请选择">
                <el-option
                  v-for="item in postWays"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="form-group ">
            <label class="col-md-2 control-label">*&nbsp;邮寄内容:</label>
            <div class="col-md-10">
              <el-select v-model="selectPostContent" :clearable="true" :disabled="readonly"
                         placeholder="请选择">
                <el-option
                  v-for="item in postContent"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </div>
          </div>
          <!--内容-->
          <template v-if="selectPostContent === 1">
            <div class="form-group ">
              <label class="col-md-2 control-label">*&nbsp;包含游戏:</label>
              <div class="col-md-10">
                <el-select v-model="Includegames" :clearable="true" :disabled="readonly" filterable multiple
                           placeholder="请选择">
                  <el-option
                    v-for="item in Includegame"
                    :label="item.game_name"
                    :value="item.game_name">
                  </el-option>
                </el-select>
              </div>
            </div>
          </template>
          <template v-if="selectPostContent === 2">
            <!--<div>-->
              <!--<div class="form-group ">-->
                <!--<label class="col-md-2 control-label control-label_s">渠道名称:</label>-->
                <!--<div class="col-md-10">-->
                  <!--<p>{{ channelInfo.channel_name }}</p>-->
                <!--</div>-->
              <!--</div>-->
              <!--<div class="form-group ">-->
                <!--<label class="col-md-2 control-label">*&nbsp;对账日期:</label>-->
                <!--<div class="col-md-10">-->
                  <!--<el-date-picker-->
                    <!--v-model="channelInfo.verify_time"-->
                    <!--:readonly="true"-->
                    <!--placeholder="没有对账记录">-->
                  <!--</el-date-picker>-->
                <!--</div>-->
              <!--</div>-->
            <!--</div>-->
            <div>
              <div class="form-group ">
                <label class="col-md-2 control-label">内容详情:</label>
                <div class="col-md-10">
                  <el-input
                    type="textarea" :disabled="readonly"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    v-model="invoice">
                  </el-input>
                </div>
              </div>
            </div>
          </template>
          <template v-if="selectPostContent === 3">
            <div>
              <div class="form-group ">
                <label class="col-md-2 control-label">内容详情:</label>
                <div class="col-md-10">
                  <el-input
                    type="textarea" :disabled="readonly"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    v-model="textarea3">
                  </el-input>
                </div>
              </div>
            </div>
          </template>
          <div class="form-group ">
            <label class="col-md-2 control-label">*&nbsp;发件人部门:</label>
            <div class="col-md-10">
              <el-select v-model="selectedDepartment" :clearable="true" :disabled="readonly"
                         placeholder="请选择">
                <el-option
                  v-for="item in departments"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="form-group ">
            <label class="col-md-2 control-label">*&nbsp;发件人:</label>
            <div class="col-md-10">
              <el-select v-model="selectedSender" :clearable="true" :disabled="readonly"
                         placeholder="请选择">
                <el-option
                  v-for="item in senders"
                  :label="item.nickname"
                  :value="item.id"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="form-group " v-if="editId">
            <label class="col-sm-2 control-label">操作日志</label>
            <div class="col-sm-10">
              <operate-log :keyLabel="operateLabel" :page="33" :dataId="editId" :rand="rand"></operate-log>
            </div>
          </div>
          <div class="form-group ">
            <label class="col-md-2 control-label"></label>
            <div class="col-md-10">
              <span v-if="editId === 0"><button class="btn btn-primary" @click="postData()"
                                                :disabled="readonly">添加</button></span>
              <span v-else-if="editId > 0"><button class="btn btn-primary" @click="put()"
                                                   :disabled="readonly">保存</button></span>
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

  .control-label_s {
    padding-top: 0;
  }
</style>
<script type="text/ecmascript-6">
  import {mapState} from 'vuex'
  import FileUploader from '../public/FileUploader.vue'
  import datepicker from 'vue-date'
  import utils from '../../publicjs/utils'
  import OperateLog from "../public/OperateLog";

  export default {
    components: {
      datepicker,
      FileUploader,
      'operate-log': OperateLog,
    },
    props: ['editId', 'readonly', 'rand'],
    data ()  {
      return {
        number: '',
        time: [],
        textarea3: '',
        invoice: '',
        selectedBodyMy: '',
        icons: [{icon: 0}],

        bodyMy: [
          {id: 1, name: "云端"},
          {id: 2, name: "有量"},
        ],
        selectPostWay: '',
        postWays: [
          {id: 147, name: 'EMS'},
          {id: 148, name: '顺丰'}
        ],
        selectPostContent: '',
        postContent: [
          {id: 1, name: '合同'},
          {id: 2, name: '发票'},
          {id: 3, name: '其他'}
        ],
        departments: [],
        selectedDepartment: '',
        senders: [],
        selectedSender: '',
        selectedAddress: '',
        address: [],

        Includegames: [],
        Includegame: [{
          game_name: '',
          label: ''
        }],

        companies: [],
        selectedCompanies: '',
        selectRecevers: '',//收件人
        recevers: [],//收件人 集
        selectCompanyType: '',//公司类型值
        companyType: [
          {id: 1, companyType: '研发商'},
          {id: 2, companyType: '发行商'},
          {id: 3, companyType: '渠道商'}
        ],
        content: [],
        channelInfo: {
          channel_name: '',
          verify_time: []
        },
        express: {},
        operateLabel: {
          Number: '快递单号',
          TypeCompany: ['收件公司类型', (i) => {
            let v = _.find(this.companyType, (ii) => {
              return ii.id === i
            })
            return v ? v.companyType : ''
          }],
          ReceiveCompany: ['收件公司', (i) => {
            let v = _.find(this.companies, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          ReceiveAddress: '收件地址',
          ReceivePeople: ['收件人', (i) => {
            let v = _.find(this.recevers, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          BodyMy: ['我方主体', (i) => {
            let v = _.find(this.bodyMy, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          SendType: ['邮寄方式', (i) => {
            let v = _.find(this.postWays, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          ContentId: ['邮寄内容', (i) => {
            let v = _.find(this.postContent, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          IncludeGames: ["包含游戏", i=>-10086],
          Channels: ["渠道名称和对账日期", i=>-10086],
          Details: ["内容详情", i=>-10086],
          SendDepartment: ['发件人部门', (i) => {
            let v = _.find(this.departments, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          SendPeople: ['发件人', (i) => {
            let v = _.find(this.senders, (ii) => {
              return ii.id === i
            })
            return v ? v.nickname : ''
          }],
        }
      }
    },
    methods: {
      addIcon(){
        if (this.icons.length <= 5) {
          this.icons.splice(0, 0, {icon: 0})
        }
      },
      handleChange(){
      },
      close(needRefresh = false){
        this.$emit('close', needRefresh)
//        this.reset()
      },
      //检查数据合法性
      check: function () {
        if (!this.number) {
          return "请输入快递单号"
        }
        if (!this.selectCompanyType ) {
          return "请选择公司类型"
        }
        if (!this.selectedCompanies ) {
          return "请选择收件公司"
        }
        if (!this.selectedAddress ) {
          return "请选择收件地址"
        }
        if (!this.selectRecevers) {
          return "请选择收件人"
        }
        if (!this.selectedBodyMy) {
          return "请选择我方主体"
        }
        if (!this.selectPostWay) {
          return "请选择邮寄方式"
        }
        if (!this.selectPostContent) {
          return "请选择邮寄内容"
        }
        if (!this.selectedDepartment) {
          return "请选择发件部门"
        }
        if (!this.selectedSender ) {
          return "请选择发件人"
        }

//        if (this.time[0] == null || isNaN(this.time[0].getTime())) {
//          return "请选择签订日期"
//        }

        return ""
      },
      postData(){
        let errInfo = this.check()
        if (errInfo) {
          this.$message({
            type: 'warning',
            message: errInfo
          })
          return
        }
        var includeGames = []
        var channels = []
        if (this.selectPostContent === 1) {//合同
          for (let i = 0; i < this.Includegames.length; ++i) {
            includeGames[i] = this.Includegames[i]
          }
        } else if (this.selectPostContent === 2) {//发票
//          channels[0] = this.channelInfo.channel_name
//          channels[1] = utils.timeToStamp(this.channelInfo.verify_time)
        } else {//其他
//          includeGames[0] = this.textarea3
        }
        let icons = []
        for (let i in this.icons) {
          if (this.icons[i].icon !== 0) {
            icons.push(this.icons[i].icon)
          }
        }

        let post = utils.buildPostParams({
          type_company: this.selectCompanyType,
          number: this.number,
          receive_company: this.selectedCompanies,
          receive_address: this.selectedAddress,
          body_my: this.selectedBodyMy,
          send_department: this.selectedDepartment,
          send_people: this.selectedSender,
          content_id: this.selectPostContent,
          include_games: includeGames.length==0?"":JSON.stringify(includeGames),
//          channels: includeGames.length==0?"":JSON.stringify(channels),
          channels: this.invoice,
          details: this.textarea3,
          send_type: this.selectPostWay,
          receive_people: this.selectRecevers,
          "icon|json": icons,
        })

        let url = '/expressManage/'

        this.$http.post(url, post)
          .then((r) => {
            this.$message({
              message: "添加成功",
              type: 'success'

            })
            this.close(true)
            this.reset()
          })
      },

      //提交修改 数据
      put(){
        let errInfo = this.check()
        if (errInfo) {
          this.$message({
            type: 'warning',
            message: errInfo
          })
          return
        }
//        var contentStr = []
        var includeGames = []
        var channels = []
        if (this.selectPostContent === 1) {//合同
          for (let i = 0; i < this.Includegames.length; ++i) {
            includeGames[i] = this.Includegames[i]
          }
        } else if (this.selectPostContent === 2) {//发票
          channels[0] = this.channelInfo.channel_name
          channels[1] = utils.timeToStamp(this.channelInfo.verify_time)
        } else {//其他
//          contentStr[0] = this.textarea3
        }
        let icons = []
        for (let i in this.icons) {
          if (this.icons[i].icon !== 0) {
            icons.push(this.icons[i].icon)
          }
        }

        let post = utils.buildPostParams({
          type_company: this.selectCompanyType,
          number: this.number,
          receive_company: this.selectedCompanies,
          receive_address: this.selectedAddress,
          body_my: this.selectedBodyMy,
          send_department: this.selectedDepartment,
          send_people: this.selectedSender,
          content_id: this.selectPostContent,
          include_games: includeGames.length==0?"":JSON.stringify(includeGames),
          channels: channels.length==0?"":JSON.stringify(channels),
          details: this.textarea3,
          send_type: this.selectPostWay,
          receive_people: this.selectRecevers,
          "icon|json": icons,
        })

        let url = '/expressManage/' + this.editId
        this.$http.put(url, post)
          .then((res) => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.close(true)
          })
      },

      //获取合同状态列表
      //获取快递信息列表
      load(){
        this.reset()

        if (this.editId !== 0) {//查看 或者是编辑操作 显示单条数据
          this.getExpress();

        }
      },
      reset(){
        this.number = '',
        this.selectCompanyType = null,
        this.selectedCompanies = null,
        this.selectedAddress = null,
        this.selectRecevers = null,
        this.selectedBodyMy = null,
        this.selectPostWay = null,
        this.selectPostContent = null,
        this.Includegames = [],
//        this.channelInfo = {},
        this.textarea3 = '',
        this.invoice = '',
        this.selectedDepartment = null,
        this.selectedSender = null,
        this.Includegame = [],
        this.icons = []
      },
      getExpress(){
        let url = '/expressManage/' + this.editId
        this.$http.get(url)
          .then((res => {
            this.express = res.data

            this.number = this.express.number
            this.selectCompanyType = this.express.type_company
            this.selectedCompanies = this.express.receive_company
            this.selectedAddress = this.express.receive_address
            this.selectRecevers = this.express.receive_people
            this.selectedBodyMy = this.express.body_my
            this.selectPostWay = this.express.send_type
            this.selectPostContent = this.express.content_id
            if (this.express.content_id === 1) {//合同内容
              this.Includegames = JSON.parse(this.express.include_games)
            } else if (this.express.content_id === 2) {//发票
//              let ss = JSON.parse(this.express.channels)
//              this.channelInfo.channel_name = ss[0]
//              this.channelInfo.verify_time = ss[1]
              this.invoice = this.express.channels
            } else {//其他
              this.textarea3 = this.express.details
//              if (this.express.details){
//                let ss = JSON.parse(this.express.details)
////                this.textarea3 = ss.join("-")
//                this.textarea3 = ss
//              }
            }
            this.selectedDepartment = this.express.send_department
            this.selectedSender = this.express.send_people


            if (this.express.icon === undefined || this.express.icon === "") {

            } else {
              let icons = JSON.parse(this.express.icon)
              if (Object.keys(icons).length >= 1) {
                this.icons.splice(0, 1)
                for (let i in icons) {
                  this.icons.push({icon: icons[i]})
                }
              }
            }

          }))
      },
      getDepartments(){
        let url = '/expressManage/Express/department'
        this.$http.get(url)
          .then((res) => {
            this.departments = res.data
          })
      },
      getAddress(){
        this.address = []
        this.$http.get('/expressManage/getAddress/' + this.selectedCompanies + "?flag=" + this.selectCompanyType)
          .then((res) => {
            let ss = res.data
            $.trim(ss)
            if (ss !== '') {
              let dd = ss.split(",")
              for (let i in dd) {
                var option = {}
                option.key = dd[i]
                option.name = dd[i]
                this.address.push(option)
              }
            }
          })
      },
    },
    created: function () {
    },
    mounted: function () {
      this.load();
      this.getDepartments();
    },
    watch: {
      editId(){
        this.load()
      },
      selectPostContent(){
//        if (this.editId) {
//          return
//        }
        if (this.selectedCompanies !== '') {
          if (this.selectPostContent === 1) {//合同
            let url = '/expressManage/Express/contract/games/' + this.selectedCompanies
            if(this.selectCompanyType === 3){//渠道商类型
              url += '?flag=hetong'
            }else {
              url += '?flag=others'
            }
            this.$http.get(url)
              .then((res) => {
                this.Includegame = res.data
              })
          } else if (this.selectPostContent === 2) {//发票
            let url = '/expressManage/Express/channel/' + this.selectedCompanies
            this.$http.get(url)
              .then((res) => {
                this.channelInfo = res.data
              })
          } else {//其他

          }
        } else {
//              this.$message({
//                type:'warning',
//                message: '请选择公司!'
//              })
          this.selectPostContent = ''
        }

      },
      selectedDepartment(){
        if (!this.editId) {
          this.senders = [],
            this.selectedSender = ''
        }
        if (this.selectedDepartment) {
          let url = '/expressManage/Express/sender/' + this.selectedDepartment
          this.$http.get(url)
            .then((res) => {
              this.senders = res.data
            })
        }
      },
      selectCompanyType(){//一级级联 必须选项公司类型 从而加载 收件公司(二级) 数据
        if (!this.editId) {
          this.companies = []
          this.selectedCompanies = ''
          this.selectPostContent = ''
          this.address = []
          this.selectRecevers = ''
          this.selectedAddress = ''

        }
//          console.debug("--------",!!this.selectCompanyType)
        if (this.selectCompanyType) {
//            console.debug("--------",this.selectCompanyType)
          let url = '/expressManage/companiesList/' + this.selectCompanyType
          this.$http.get(url)
            .then((res) => {
              this.companies = res.data
            })
        }

      },
      selectedCompanies(){
        if (!this.editId) {
          this.recevers = []
          this.selectRecevers = ''
          this.channelInfo = {}
          this.selectPostContent = ''
          this.address = []
          this.selectedAddress = ''
        }
        if (this.selectedCompanies) {
          let url = '/expressManage/Express/receiver/' + this.selectedCompanies
          if (this.selectCompanyType === 1){//研发商
            url +='?flag=1'
          }else if(this.selectCompanyType === 2){//发行商
            url += '?flag=2'
          }else if(this.selectCompanyType === 3){//渠道商
            url += '?flag=3'
          }else{
              this.$message({
                type: 'warning',
                message:'公司类型有误!'
              })
              return
          }
          this.$http.get(url)
            .then((res) => {
              this.recevers = res.data
//                console.log("ppppppp",this.recevers[0].name)
            })
//          公司地址
          this.getAddress()

        }
      }
    }
  };
</script>

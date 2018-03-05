<!--suppress ALL -->
<template>
  <div>
    <div class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-1 control-label">我方主体</label>
        <div class="col-sm-11">
          <el-radio-group v-model="bodyMy" @change="onBodySelected">
            <el-radio :disabled="id!=0" :label="1">云端</el-radio>
            <el-radio :disabled="id!=0" :label="2">有量</el-radio>
          </el-radio-group>
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-1 control-label">合作方</label>
        <div class="col-sm-11">
          <el-select
            :disabled="id!=0"
            v-model="selectedCompany" @change="onCompanySelected"
            filterable
            placeholder="请选择合作方"
            style="width: 100%;">
            <el-option
              v-for="item in companies"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-1 control-label">对账日期</label>
        <div class="col-sm-11">
          <el-select v-model="selectedDate" @change="onDateSelected" multiple
                     placeholder="请选择月份" style="width: 100%;">
            <el-option
              v-for="item in dates"
              :label="item.date"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-1 control-label">结算业务</label>
        <div class="col-sm-11">
          <table class="table" v-loading="isLoading" element-loading-text="拼命加载中">
            <thead>
            <tr>
              <th>所属月份</th>
              <th>游戏项目</th>
              <th>订单金额</th>
              <th>渠道费率</th>
              <th>渠道费</th>
              <th>税率</th>
              <th>税费</th>
              <th>扣除手续费后金额</th>
              <th>分成比例</th>
              <th>支付金额</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in games" track-by="game_id">
              <td>{{ item.date }}</td>
              <td>{{ item.game_name }}</td>
              <td>{{ item.amount }}</td>
              <td>
                <input
                  class="form-control" title="渠道费率"
                  v-model.number="item.rate" type="text"
                  @input="onInputChange" >
              </td>
              <td>{{ item.channel_fee }}</td>
              <td>
                <input
                  class="form-control" title="税率"
                  v-model.number="item.tax_rate"
                  @input="onInputChange" />
              </td>
              <td>{{ item.taxation }}</td>
              <td>{{ item.amount_after }}</td>
              <td>
                <input
                  class="form-control" title="分成比例"
                  v-model.number="item.ratio"
                  @input="onInputChange" />
              </td>
              <td>{{ item.pay_amount }}</td>
            </tr>
            </tbody>
          </table>
          <div style="float: right">
            【支付金额】总计：<span>￥{{ total }}</span>
          </div>
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-1 control-label">备注</label>
        <div class="col-sm-11">
          <textarea
            v-model="desc"
            :disabled="readonly"
            class="form-control" rows="3" placeholder="请输入备注信息"></textarea>
        </div>
      </div>
      <div class="form-group ">
        <label class="col-sm-1 control-label">账户信息</label>
        <div class="col-sm-9" style="border: 1px solid rgb(210,214,222);margin-left: 15px;">
          <p style="margin-top: 10px">开户全称：<span>{{ info.account_name }}</span></p>
          <p>纳税人税号：<span>{{ info.taxpayer }}</span></p>
          <p>开票地址：<span>{{ info.billing_address }}</span></p>
          <p>开票电话：<span>{{ info.telephone }}</span></p>
          <p>开户银行：<span>{{ info.bank }}</span></p>
          <p>开户账号：<span>{{ info.account_number }}</span></p>
          <p>邮寄地址：<span>{{ info.mailing_address }}</span></p>
          <p>收 件 人 ： <el-select
            v-model="selectedUser" @change="onUserChange()"
            filterable
            placeholder="请选择"
            style="width: 30%">
            <el-option
              v-for="item in departUsers"
              :label="item.nickname"
              :value="item.id">
            </el-option>
          </el-select></p>
          <p>联系电话：<span>{{ userPhone }}</span></p>
        </div>
      </div>
      <div class="form-group ">
        <label class="col-sm-1 control-label">合作方账户信息</label>
        <div class="col-sm-9" style="border: 1px solid rgb(210,214,222);margin-left: 15px;">
          <p style="margin-top: 10px">开户全称：<span>{{ partnerInfo.account_name }}</span></p>
          <p>开户银行：<span>{{ partnerInfo.bank }}</span></p>
          <p>开户账号：<span>{{ partnerInfo.account_number }}</span></p>
          <p>邮件地址：<span>{{ partnerInfo.address }}</span></p>
          <p>收 件 人 ： <el-select
            v-model="selectedContact" @change="onContactChange"
            filterable
            placeholder="请选择收件人"
            style="width: 30%">
            <el-option
              v-for="item in contacts"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select></p>
          <p>联系电话：<span>{{ contactPhone }}</span></p>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-1 control-label"> </label>
        <div class="col-sm-11">
          <button v-if="!readonly" class="btn btn-primary " :disabled= disabl @click="post">保存</button>
          <button class="btn btn-default " @click="close(false)">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import OperateLog from "../public/OperateLog";
  import util from '../../publicjs/utils'
  import FileUploader from '../public/FileUploader.vue'

  export default {
    components: {
      'operate-log': OperateLog,
      FileUploader
    },
    props: ['editId', 'readonly', 'defaultValue', 'rand'],
    data: function () {
      return {
        bodyMy: 1,
        selectedCompany: null,//已选中的渠道
        companies: [],        // 发行商选项
        selectedDate: [],     //已选中的日期
        dates: [],            //区间选项

        desc: "", //备注
        info: {},             //账户信息
        selectedUser: null,   //已选中的账户信息收件人id
        departUsers: null,    //账户信息收件人
        userPhone: '',        //已选中的账户信息收件人电话

        partnerInfo: {},      //合作方账户信息
        selectedContact: null,//选中的合作方收件人id
        contacts: [],         //合作方收件人
        contactPhone: '',     //已选中的账户信息收件人电话

        games: [],    //游戏选项
        disabl: false,
        genGames: '', // 智能录入的文本

        checkAllGames: true,
        isIndeterminate: true,


        selectedStatus: null, //已选中的状态
        filePreviewId: 0, // 预览文件id
        fileId: 0, // 文件id
        billingdate: '', // 开票日期k
        verifyTime: "",
        isLoading: false,
        id: 0,  //修改传过来的id

        // 总计
        total: 0,

        operateLabel: {
          Desc: '备注',
          VerifyTime: ['对账时间', (i) => {
            return util.stampToTime(i)
          }],
          AmountOpposite: '对方流水',
          AmountPayable: '应付金额',
          VerifyUserId: ['对账人', (i) => {
            let v = _.find(this.departUsers, (ii) => {
              return ii.id === i
            })
            return v ? v.nickname : ''
          }],
          BillingDate: '开票日期'
        },
      }
    },

    watch: {
      editId(){
        this.load()
      },
      defaultValue(){
        if (!this.defaultValue) {
          return
        }

        this.bodyMy = this.defaultValue.body_my
        this.onBodySelected()
      },
//      genGames(){
//        let genGames = this.genGames.replace(new RegExp(/\n/g), " ").replace(new RegExp(/[￥|,]/g), "")
//        let reg = /[\t| ]+/gi
//        let gameInfo = genGames.split(reg)
//
//        let games = []
//        let l = gameInfo.length
//        for (let i = 0; i < l; i += 3) {
//          games.push({
//            game_name: gameInfo[i],
//            amount_opposite: gameInfo[i + 1],
//            amount_payable: gameInfo[i + 2],
//          })
//        }
//
//        // 找出最匹配的index
//        this.selectedGames = []
//        for (let i in games) {
//          let genGame = games[i]
//          if (genGame.game_name) {
//            let maxSameIndex = -1
//            let maxSame = 0
//            for (let j in this.games) {
//              let gameName = this.games[j].game_name.split("")
//              let gameName2 = genGame.game_name.split("")
//              let same = util.compare(gameName, gameName2)
//              if (maxSame < same) {
//                maxSame = same
//                maxSameIndex = j
//              }
//            }
//            if (maxSameIndex != -1 && maxSame > 30) {
//              let modefiyGame = this.games[maxSameIndex]
//              // 标记颜色, 提示正确率
//              if (maxSame == 100) {
//                modefiyGame.color = "#13CE66"
//              } else if (maxSame > 50) {
//                modefiyGame.color = "#F7BA2A"
//              } else {
//                modefiyGame.color = "#FF4949"
//              }
//              modefiyGame.amount_opposite = parseFloat(genGame.amount_opposite)
//              modefiyGame.amount_payable = parseFloat(genGame.amount_payable)
//              this.selectedGames.push(modefiyGame)
//            }
//          }
//        }
//
//      },
    },

    methods: {
      onBodySelected(){
        // 编辑的时候不重置
        if (this.id) {
          return
        }
        this.selectedCompany = null
        this.games = []
        this.selectedDate = []
        this.dates = []
        this.partnerInfo = {}
        this.selectedContact = null
        this.contacts = []
        this.contactPhone = ''
        this.getCompany()
        this.getAccountInfo(this.bodyMy)
      },
      onUserChange(){
        if(this.selectedUser){
          let user = _.find(this.departUsers, {id: this.selectedUser})
          this.userPhone = user.phone ? user.phone : ''
        }
      },
      //获取账户信息
      getAccountInfo(body=1) {
        let url = '/accountInformation/?body_my=' + body

        this.$http.get(url)
          .then((res) => {
            this.info = res.body
          })
      },
      close(needRefresh = false){
        this.$emit('close', needRefresh)
      },
      onCompanySelected(){
        // 编辑的时候不重置
        if (this.id) {
          return
        }
        if (!this.selectedCompany) {
          return
        }

        this.games = []
        this.selectedDate = []
        this.dates = []
        this.partnerInfo = {}
        this.selectedContact = null
        this.contacts = []
        this.contactPhone = ''
        this.getDate()
        this.getPartnerInfo()
      },
      onDateSelected(){
        // 编辑的时候不重置
        if (this.id) {
          return
        }
        if (_.isEmpty(this.selectedDate)) {
          return
        }
        this.isLoading = true
        this.games = []
        this.getGames()
      },
      getCompany(){
        let body_my = this.bodyMy
        let query = util.buildGetParams({body_my})
        let url = '/verify_cp_elec/company?' + query
        this.$http.get(url)
          .then(({data}) => {
            this.companies = data;
            if (this.defaultValue) {
              this.selectedCompany = this.defaultValue.company_id
            }
          })
      },
      getDate(){
        let body_my = this.bodyMy
        let company_id = this.selectedCompany
        let query = util.buildGetParams({body_my, company_id})
        let url = '/verify_cp_elec/verify_time?' + query
        this.$http.get(url)
          .then(({data}) => {
            this.dates = data
            if (this.defaultValue) {
//              this.selectedDate = this.defaultValue.date
              this.$emit('emptyDefault', null)
            }
          })
      },
      //获取合作方信息
      getPartnerInfo() {
        let url = "/distributionCompany/?query=company_id:in" + this.selectedCompany
        this.$http.get(url)
          .then(({data}) => {
            let account_name = data.data[0].account_name ? data.data[0].account_name : ""
            let bank = data.data[0].bank ? data.data[0].bank : ""
            let account_number = data.data[0].account_number ? data.data[0].account_number : ""
            let address = data.data[0].address ? data.data[0].address : ""

            this.partnerInfo = {account_name:account_name, bank:bank, account_number:account_number, address:address}

            this.contacts = data.data[0].contacts ? data.data[0].contacts : []
          })
      },
      onContactChange(){
        if(this.selectedContact){
          let user = _.find(this.contacts, {id: this.selectedContact})
          console.log(user)
          this.contactPhone = user.phone ? user.phone : ''
        }
      },
      getGames(){
        let company_id = this.selectedCompany
        let month = this.selectedDate.join(",")
        let query = util.buildGetParams({company_id, month})
        let url = '/verify_cp_elec/verify_game?' + query
        this.$http.get(url)
          .then(({data}) => {
            this.games = data;
            this.onInputChange()
            this.isLoading = false
          })
      },
//      handleCheckAllChange(event) {
//        this.isIndeterminate = false;
//      },
//      handleSelectedGamesChange(value) {
//        let checkedCount = value.length;
//        this.checkAllGames = checkedCount === this.games.length;
//        this.isIndeterminate = checkedCount > 0 && checkedCount < this.games.length;
//      },
      onInputChange(){
        let amount = 0
        for(let i in this.games) {
          let game = this.games[i]

          game.rate = game.rate ? game.rate : 0
          game.channel_fee = (game.amount * game.rate).toFixed(2)
          game.tax_rate = game.tax_rate ? game.tax_rate : 0
          game.taxation = (game.amount * game.tax_rate).toFixed(2)
          game.amount_after = game.amount - game.channel_fee - game.taxation
          game.ratio = game.ratio ? game.ratio : 0
          game.pay_amount = (game.amount_after * game.ratio).toFixed(2)

          amount += parseFloat(game.pay_amount)
        }
        this.total = amount.toFixed(2)
      },
      getDepatUsers(){
        let url = "/user/devment/6"
        this.$http.get(url)
          .then(({data}) => {
            this.departUsers = data
          })
      },
      post(){ // 添加或更新
        if (this.disabl === false) {
          this.disabl = true
          setTimeout( () => {
            this.disabl = false
          }, 1500);
        }
        let body = ({
          body_my: this.bodyMy,
          company_id: this.selectedCompany,
          games: this.games,
          desc: this.desc,
          receive_user: this.selectedUser,
          contact_id: this.selectedContact,
        })

        if (!body.games || body.games.length == 0) {
          this.$message({type: 'error', message: '请选择结算业务'})
          return
        }

        if (!body.receive_user) {
          this.$message({type: 'warning', message: '请选择账户信息收件人'})
          return
        }

        if (!body.contact_id) {
          this.$message({type: 'warning', message: '请选择合作方账户信息收件人'})
          return
        }

        let post = util.buildPostParams(body)

        let url = '/verify_cp_elec'
        if (this.id == 0) {
          this.$http.post(url, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.close(true)
              this.reset()
            })
        } else {
          console.log(post,2)
          return
          url += "/" + this.id
          this.$http.put(url, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.close(true)
            })
        }
      },

//      getOne(id){
//        let url = "/verify_cp/" + id;
//        this.$http.get(url)
//          .then(({data}) => {
//            this.bodyMy = data.body_my
//
//            this.companies = [data.company]
//
//            this.selectedCompany = data.company_id
//
//            this.games = data.pre_verify
//
////            this.selectedDate = data.date
//
//            this.verifyTime = util.stampToTime(data.verify_time)
//            this.selectedUser = data.verify_user_id
//            this.desc = data.desc
//
//            this.fileId = data.file_id
//            this.filePreviewId = data.file_preview_id
//            this.billingdate = data.billing_date ? new Date(Date.parse(data.billing_date.replace(/-/g,  "-"))) : ''
//
//            // 添加额外的没对账的游戏
//            let body_my = this.bodyMy
//            let company_id = this.selectedCompany
////            let month = this.selectedDate
//            let query = util.buildGetParams({body_my, company_id, month})
//            let url = '/verify_cp/not_verify_game?' + query
//            this.$http.get(url)
//              .then(({data}) => {
//                this.games = this.games.concat(data);
//              })
//          })
//      },
      // 重置所有输入框
      reset(){
        this.bodyMy = 1
        this.games = []  // 全部游戏
        this.selectedDate = [] //已选中的区间
        this.departUsers = null //账户信息收件人
        this.selectedStatus = null //已选中的状态
        this.selectedUser = null //已选中的对账人id
        this.selectedCompany = null // 已选中的发行商
        this.filePreviewId = 0 // 预览文件id
        this.fileId = 0 // 文件id
        this.verifyTime = ""
        this.desc = "" //备注
        this.billingdate = ""

        // 初始化获取发行商
        if (this.defaultValue) {
          this.bodyMy = this.defaultValue.body_my
        }
        this.onBodySelected()

        // 获取对账用户
        this.getDepatUsers()
      },
      load(){
        this.id = this.editId
        this.reset()
        if (this.id != 0) {
          this.getOne(this.id);
        }
      }
    },

    mounted: function () {
      this.load()
    },
  };
</script>

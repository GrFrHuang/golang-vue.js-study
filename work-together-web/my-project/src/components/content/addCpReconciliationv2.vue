<!--suppress ALL -->
<template>
  <div>
    <div class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-2 control-label">我方主体</label>
        <div class="col-sm-10">
          <el-radio-group v-model="bodyMy" @change="onBodySelected">
            <el-radio :disabled="id!=0" :label="1">云端</el-radio>
            <el-radio :disabled="id!=0" :label="2">有量</el-radio>
          </el-radio-group>
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-2 control-label">发行商</label>
        <div class="col-sm-10">
          <el-select
            :disabled="id!=0"
            v-model="selectedCompany" @change="onCompanySelected"
            filterable
            placeholder="请选择发行商"
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
        <label class="col-sm-2 control-label">对账日期</label>
        <div class="col-sm-10">
          <el-select
            :disabled="id!=0"
            v-model="selectedDate" @change="onDateSelected"
            filterable
            placeholder="请选择月份"
            style="width: 100%;">
            <el-option
              v-for="item in dates"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-2 control-label">游戏</label>
        <div class="col-sm-10">
          <el-checkbox
            :indeterminate="isIndeterminate" v-model="checkAllGames"
            @change="handleCheckAllChange" :disabled="readonly"
            style="position: absolute; left: 24px; top: 8px;">全选


          </el-checkbox>
          <el-checkbox-group
            v-model="selectedGames"
            @change="handleSelectedGamesChange">
            <table class="table" v-loading="isLoading" element-loading-text="拼命加载中">
              <thead>
              <tr>
                <th style="width: 65px"></th>
                <th>游戏名称</th>
                <th>我方流水</th>
                <th>理论金额</th>
                <th>对方流水</th>
                <th>应付金额</th>
                <th>差额</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in games" track-by="game_id">
                <td>
                  <el-checkbox :label="item" :disabled="readonly">{{ }}</el-checkbox>
                </td>
                <td>
                  <span :style="{color:item.color}">{{ item.game_name }}</span>
                </td>
                <td>{{ item.amount_my }}</td>
                <td>
                  <i class="fa fa-spinner fa-spin" v-if="item.amount_theory==-1"></i>
                  <span v-else>{{item.amount_theory}}</span>
                </td>
                <td>
                  <input
                    class="form-control" title="对方流水"
                    v-model.number="item.amount_opposite"
                    :disabled="readonly"
                    @input="onInputChange"/>
                </td>
                <td>
                  <input
                    class="form-control" title="应付金额"
                    v-model.number="item.amount_payable"
                    :disabled="readonly"
                    @input="onInputChange"/>
                </td>
                <td v-text="item.amount_diff"></td>
              </tr>
              <tr>
                <td>总计</td>
                <td>{{selectedGames.length}}个游戏</td>
                <td v-text="total.amount_my"></td>
                <td v-text="total.amount_theory"></td>
                <td v-text="total.amount_opposite"></td>
                <td v-text="total.amount_payable"></td>
                <td v-text="total.amount_diff"></td>
              </tr>
              </tbody>
            </table>
          </el-checkbox-group>

          <el-popover
            ref="popover"
            placement="right"
            width="400"
            trigger="click">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="genGames">
            </el-input>
          </el-popover>

          <el-button v-popover:popover :disabled="readonly">智能录入</el-button>
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-2 control-label">对账状态</label>
        <div class="col-sm-10">
          <el-select
            v-model="selectedStatus" filterable
            placeholder="对账状态"
            :disabled="readonly"
            style="width: 100%;">
            <el-option
              v-for="item in status"
              :label="item.desc"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>

      <div v-if="selectedStatus === 30 || selectedStatus === 100" class="form-group ">
        <label class="col-sm-2 control-label">*&nbsp;&nbsp;&nbsp;收票日期</label>
        <div class="col-sm-10">
          <el-date-picker
            v-model="billingdate"
            type="date"
            :range="false"
            :disabled="readonly"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-2 control-label">上传对账单</label>
        <div class="col-sm-10">
          <file-uploader v-model="fileId"></file-uploader>
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-2 control-label">上传对账单扫描件</label>
        <div class="col-sm-10">
          <file-uploader v-model="filePreviewId"></file-uploader>
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-2 control-label">对账时间</label>
        <div class="col-sm-10">
          <el-date-picker
            v-model="verifyTime"
            type="date"
            :range="false"
            :disabled="readonly"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-2 control-label">对账人</label>
        <div class="col-sm-10">
          <el-select
            :disabled="readonly"
            v-model="selectedVerifyUser" filterable
            placeholder="对账人"
            style="width: 100%;">
            <el-option
              v-for="item in departUsers"
              :label="item.nickname"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-2 control-label">备注</label>
        <div class="col-sm-10">
          <textarea
            v-model="desc"
            :disabled="readonly"
            class="form-control" rows="3" placeholder="请备注 ..."></textarea>
        </div>
      </div>

      <div class="form-group " v-if="id">
        <label class="col-sm-2 control-label">操作日志</label>
        <div class="col-sm-10">
          <operate-log :keyLabel="operateLabel" :page="22" :dataId="id" :rand="rand"></operate-log>
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-2 control-label"> </label>
        <div class="col-sm-10">
          <button v-if="!readonly" class="btn btn-primary " :disabled=disabl @click="post">保存</button>
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
        companies: [],   // 发行商选项
        title: "",    //页面标题
        dates: [],    //区间选项
        games: [],    //游戏选项
        disabl: false,
        genGames: '', // 智能录入的文本

        checkAllGames: true,
        isIndeterminate: true,

        bodyMy: 1,
        selectedGames: [],  //已选中的游戏
        selectedCompany: null,   //已选中的渠道
        selectedDate: null, //已选中的区间
        departUsers: null, //对账人选项
        selectedStatus: null, //已选中的状态
        selectedVerifyUser: null, //已选中的对账人id
        filePreviewId: 0, // 预览文件id
        fileId: 0, // 文件id
        billingdate: '', // 开票日期
        verifyTime: "",
        desc: "", //备注
        isLoading: false,
        status: [
          {value: 1, desc: "移交法务"},
          {value: 5, desc: "金额太小,作测试费处理"},
          {value: 10, desc: "对账中"},
          {value: 20, desc: "对账完毕,未开发票"},
          {value: 30, desc: "已收票"},
          {value: 100, desc: "已打款"}],
        id: 0,  //修改传过来的id

        // 总计
        total: {
          amount_my: 0,
          amount_theory: 0,
          amount_opposite: 0,
          amount_payable: 0,
          amount_diff: 0,
        },

        operateLabel: {
          Desc: '备注',
          VerifyTime: ['对账时间', (i) => {
            return util.stampToTime(i)
          }],
          Status: ['状态', (i) => {
            let v = _.find(this.status, (ii) => {
              return ii.value === i
            })
            return v ? v.desc : ''
          }],
          AmountOpposite: '对方流水',
          AmountPayable: '应付金额',
          VerifyUserId: ['对账人', (i) => {
            let v = _.find(this.departUsers, (ii) => {
              return ii.id === i
            })
            return v ? v.nickname : ''
          }],
          BillingDate: '收票日期'
        },
      }
    },

    watch: {
      editId(){
        this.load()
      },
      selectedGames() {
        this.sumAmount();
      },
      defaultValue(){
        if (!this.defaultValue) {
          return
        }

        this.bodyMy = this.defaultValue.body_my
        this.onBodySelected()
      },
      genGames(){
        let genGames = this.genGames.replace(new RegExp(/\n/g), " ").replace(new RegExp(/[￥|,]/g), "")
        let reg = /[\t| ]+/gi
        let gameInfo = genGames.split(reg)

        let games = []
        let l = gameInfo.length
        for (let i = 0; i < l; i += 3) {
          games.push({
            game_name: gameInfo[i],
            amount_opposite: gameInfo[i + 1],
            amount_payable: gameInfo[i + 2],
          })
        }

        // 找出最匹配的index
        this.selectedGames = []
        for (let i in games) {
          let genGame = games[i]
          if (genGame.game_name) {
            let maxSameIndex = -1
            let maxSame = 0
            for (let j in this.games) {
              let gameName = this.games[j].game_name.split("")
              let gameName2 = genGame.game_name.split("")
              let same = util.compare(gameName, gameName2)
              if (maxSame < same) {
                maxSame = same
                maxSameIndex = j
              }
            }
            if (maxSameIndex != -1 && maxSame > 30) {
              let modefiyGame = this.games[maxSameIndex]
              // 标记颜色, 提示正确率
              if (maxSame == 100) {
                modefiyGame.color = "#13CE66"
              } else if (maxSame > 50) {
                modefiyGame.color = "#F7BA2A"
              } else {
                modefiyGame.color = "#FF4949"
              }
              modefiyGame.amount_opposite = parseFloat(genGame.amount_opposite)
              modefiyGame.amount_payable = parseFloat(genGame.amount_payable)
              this.selectedGames.push(modefiyGame)
            }
          }
        }

      },
    },

    methods: {
      onBodySelected(){
        // 编辑的时候不重置
        if (this.id) {
          return
        }
        this.selectedCompany = null
        this.games = []
        this.selectedGames = []
        this.selectedDate = null
        this.getCompany()
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

        this.selectedGames = []
        this.games = []
        this.selectedDate = {}
        this.getDate()
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
        this.selectedGames = []
        this.getGames()
      },

      getCompany(){
        let body_my = this.bodyMy
        let query = util.buildGetParams({body_my})
        let url = '/verify_cp/not_verify_company?' + query
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
        let url = '/verify_cp/not_verify_time?' + query
        this.$http.get(url)
          .then(({data}) => {
            this.dates = data
            if (this.defaultValue) {
              this.selectedDate = this.defaultValue.date
              this.$emit('emptyDefault', null)
            }
          })
      },
      getGames(){
        let body_my = this.bodyMy
        let company_id = this.selectedCompany
        let month = this.selectedDate
        let query = util.buildGetParams({body_my, company_id, month})
        let url = '/verify_cp/not_verify_game?' + query
        this.$http.get(url)
          .then(({data}) => {
            this.games = data;
            this.selectedGames = data
            this.isLoading = false
          })
      },
      handleCheckAllChange(event) {
        this.selectedGames = event.target.checked ? this.games : [];
        this.isIndeterminate = false;
      },
      handleSelectedGamesChange(value) {
        let checkedCount = value.length;
        this.checkAllGames = checkedCount === this.games.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.games.length;
      },
      onInputChange(){
        this.sumAmount()
      },
      sumAmount(){
        let amount_my = 0
        let amount_theory = 0
        let amount_opposite = 0
        let amount_payable = 0
        let amount_diff = 0
        for (let i in this.selectedGames) {
          let game = this.selectedGames[i]
          amount_my += parseFloat(game.amount_my)
          amount_opposite += parseFloat(game.amount_opposite)
          amount_theory += parseFloat(game.amount_theory)
          amount_payable += parseFloat(game.amount_payable)

          game.amount_diff = (game.amount_theory - game.amount_payable).toFixed(2)
          amount_diff += parseFloat(game.amount_diff)
        }
        this.total.amount_my = amount_my.toFixed(2)
        this.total.amount_theory = amount_theory.toFixed(2)
        this.total.amount_opposite = amount_opposite.toFixed(2)
        this.total.amount_payable = amount_payable.toFixed(2)
        this.total.amount_diff = amount_diff.toFixed(2)
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
          setTimeout(() => {
            this.disabl = false
          }, 1500);
        }
        let body = ({
          body_my: this.bodyMy,
          company_id: this.selectedCompany,
          date: this.selectedDate,
          "amount_my|number": this.total.amount_my,
          "amount_theory|number": this.total.amount_theory,
          "amount_opposite|number": this.total.amount_opposite,
          "amount_payable|number": this.total.amount_payable,
          verify_user_id: this.selectedVerifyUser,
          desc: this.desc,
          status: this.selectedStatus,
          billing_date: this.selectedStatus >= 30 ? this.billingdate.format("yyyy-MM-dd") : "",
          pre_verify: this.selectedGames,
          "verify_time|timeToStamp": this.verifyTime,
          "file_id|number": this.fileId,
          "file_preview_id|number": this.filePreviewId,
        })

        if (!body.pre_verify || body.pre_verify.length == 0) {
          this.$message({type: 'error', message: 'please choose games first'})
          return
        }
        if (!body.status) {
          this.$message({type: 'error', message: 'please choose status'})
          return
        }

        if (!this.total.amount_my || !this.total.amount_opposite
          || !this.total.amount_payable || !this.total.amount_theory) {
          this.$message({type: 'error', message: 'amount data has error'})
          return
        }

        if (!body.verify_user_id) {
          this.$message({type: 'warning', message: 'please choose user'})
          return
        }

        //对账状态为已开票或者已打款，则开票日期必填
        if (this.selectedStatus >= 30 && this.billingdate === '') {
          this.$message({type: 'warning', message: '请输入开票日期'})
          return
        }

        let post = util.buildPostParams(body)

        let url = '/verify_cp'
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

      getOne(id){
        let url = "/verify_cp/" + id;
        this.$http.get(url)
          .then(({data}) => {
            this.bodyMy = data.body_my

            this.companies = [data.company]

            this.selectedStatus = data.status
            this.selectedCompany = data.company_id

            this.games = data.pre_verify
            this.selectedGames = this.games

            this.dates = [data.date]
            this.selectedDate = data.date

            this.verifyTime = util.stampToTime(data.verify_time)
            this.selectedVerifyUser = data.verify_user_id
            this.desc = data.desc

            this.fileId = data.file_id
            this.filePreviewId = data.file_preview_id
            this.billingdate = data.billing_date && data.status >= 30 ? new Date(Date.parse(data.billing_date.replace(/-/g, "-"))) : ''

            // 添加额外的没对账的游戏
            let body_my = this.bodyMy
            let company_id = this.selectedCompany
            let month = this.selectedDate
            let query = util.buildGetParams({body_my, company_id, month})
            let url = '/verify_cp/not_verify_game?' + query
            this.$http.get(url)
              .then(({data}) => {
                this.games = this.games.concat(data);
              })
          })
      },
      // 重置所有输入框
      reset(){
        this.bodyMy = 1
        this.games = []  // 全部游戏
        this.selectedGames = []  //已选中的游戏
        this.selectedDate = null //已选中的区间
        this.departUsers = null //对账人选项
        this.selectedStatus = null //已选中的状态
        this.selectedVerifyUser = null //已选中的对账人id
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

<style rel="stylesheet/less" lang="less" scope>

</style>

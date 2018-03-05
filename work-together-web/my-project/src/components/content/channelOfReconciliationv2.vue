<template>
  <div>
    <div class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-2 control-label">我方主体</label>
        <div class="col-sm-10">
          <el-radio-group v-model="form.body_my" @change="onBodySelected">
            <el-radio :disabled="id!==0" :label="1">云端</el-radio>
            <el-radio :disabled="id!==0" :label="2">有量</el-radio>
          </el-radio-group>
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-2 control-label">渠道名称</label>
        <div class="col-sm-10">
          <el-select
            :disabled="id!==0"
            v-model="form.channel_code" @change="onChannelSelected"
            filterable
            placeholder="请选择渠道"
            style="width: 100%;">
            <el-option
              v-for="item in channels"
              :label="item.name"
              :value="item.cp">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-2 control-label">对账日期</label>
        <div class="col-sm-10">
          <el-select
            :disabled="id!=0"
            v-model="form.date" @change="onDateSelected"
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
            v-model="form.pre_verify"
            @change="handleSelectedGamesChange">
            <table class="table" v-loading="isLoading" element-loading-text="拼命加载中">
              <thead>
              <tr>
                <th style="width: 65px"></th>
                <th>游戏名称</th>
                <th>我方流水</th>
                <th>理论金额</th>
                <th>对方流水</th>
                <th>应收金额</th>
                <th>差额</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in games" track-by="game_id">
                <td>
                  <el-checkbox :disabled="readonly" :label="item">{{ }}</el-checkbox>
                </td>
                <td>
                  {{ item.game_name }}

                </td>
                <td>{{ item.amount_my }}</td>
                <td>
                  <i class="fa fa-spinner fa-spin" v-if="item.amount_theory==-1"></i>
                  <span v-else>{{item.amount_theory}}</span>
                </td>
                <td>
                  <input
                    :disabled="readonly"
                    class="form-control" title="对方流水"
                    v-model.number="item.amount_opposite"
                    @input="onInputChange"/>
                </td>
                <td>
                  <input
                    :disabled="readonly"
                    class="form-control" title="应收金额"
                    v-model.number="item.amount_payable"
                    @input="onInputChange"/>
                </td>
                <td v-text="item.amount_diff"></td>
              </tr>
              <tr>
                <td>总计</td>
                <td>{{form.pre_verify.length}}个游戏</td>
                <td v-text="form.amount_my"></td>
                <td v-text="form.amount_theory"></td>
                <td v-text="form.amount_opposite"></td>
                <td v-text="form.amount_payable"></td>
                <td v-text="form.amount_diff"></td>
              </tr>
              </tbody>
            </table>
          </el-checkbox-group>
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-2 control-label">对账状态</label>
        <div class="col-sm-10">
          <el-select
            :disabled="readonly"
            v-model="form.status" filterable
            placeholder="请选择对账状态"
            style="width: 100%;">
            <el-option
              v-for="item in status"
              :label="item.desc"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="form-group" v-if="form.status === 30 || form.status === 100">
        <label class="col-sm-2 control-label">开票日期</label>
        <div class="col-sm-10">
          <el-date-picker
            :disabled="readonly"
            v-model="form.billing_date"
            type="date"
            :range="false"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>

      <div class="form-group" v-if="form.status === 30 || form.status === 100">
        <label class="col-sm-2 control-label">回款主体</label>
        <div class="col-sm-10">
          <el-select
            :disabled="readonly"
            v-model="form.remit_company_id"
            filterable
            placeholder="选择回款主体"
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
        <label class="col-sm-2 control-label">上传对账单</label>
        <div class="col-sm-10">
          <file-uploader v-model="form.file_id"></file-uploader>
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-2 control-label">上传对账单预览图</label>
        <div class="col-sm-10">
          <file-uploader v-model="form.file_perview_id"></file-uploader>
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-2 control-label">对账时间</label>
        <div class="col-sm-10">
          <el-date-picker
            :disabled="readonly"
            v-model="form.verify_time"
            type="date"
            :range="false"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-2 control-label">对账人</label>
        <div class="col-sm-10">
          <el-select
            :disabled="readonly"
            v-model="form.verify_user_id" filterable
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
            v-model="form.desc"
            :disabled="readonly"
            class="form-control" rows="3" placeholder="请备注 ..."></textarea>
        </div>
      </div>
      <div class="form-group " v-if="id">
        <label class="col-sm-2 control-label">操作日志</label>
        <div class="col-sm-10">
          <operate-log :keyLabel="operateLabel" :page="24" :dataId="id" :rand="rand"></operate-log>
        </div>
      </div>
      <div class="form-group ">
        <label class="col-sm-2 control-label"></label>
        <div class="col-sm-10">
          <button v-if="!readonly" class="btn btn-primary " :disabled=disabl @click="post">保存</button>
          <button class="btn btn-default " @click="close(false)">返回</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import util from '../../publicjs/utils'
  import FileUploader from '../public/FileUploader.vue'
  import OperateLog from "../public/OperateLog";

  export default {
    components: {
      'operate-log': OperateLog,
      FileUploader
    },
    props: ['editId', 'readonly', 'defaultValue', 'rand'],
    data: function () {
      return {
        form: null,
        emptyForm: {
          body_my: 1,
          channel_code: null,   //已选中的渠道
          date: null, //已选中的日期
          pre_verify: [],  //已选中的游戏
          status: null, //已选中的状态
          billing_date: "", // 开票日期
          remit_company_id: null, // 已选中的回款主体id
          verify_time: null,
          verify_user_id: null, //已选中的对账人id
          file_preview_id: 0, // 预览文件id
          file_id: 0, // 文件id
          desc: "", //备注
          amount_my: 0,
          amount_theory: 0,
          amount_opposite: 0,
          amount_payable: 0,

          amount_diff: 0, // 这个不传,只是展示
        },
        disabl: false,
        channels: [],   // 渠道选项
        title: "",    // 页面标题
        dates: [],    // 区间选项
        games: [],    // 游戏选项
        companies: [], // 回款主体

        checkAllGames: true,
        isIndeterminate: true,

        departUsers: [],

        items: [],
        isLoading: false,
        status: [
          {value: 1, desc: "移交法务"},
          {value: 5, desc: "金额太小,作测试费处理"},
          {value: 10, desc: "对账中"},
          {value: 20, desc: "对账完毕,未开票"},
          {value: 30, desc: "已开票"},
          {value: 100, desc: "已回款"}],
        id: 0,  //修改传过来的id

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
          AmountPayable: '应收金额',
          BillingDate: '开票日期'
        },
      }
    },

    watch: {
      editId(){
        this.init()
      },
      defaultValue(){
        if (!this.defaultValue) {
          return
        }

        this.form.body_my = this.defaultValue.body_my
        this.onBodySelected()
      },
      'form.pre_verify'() {
        this.sumAmount()
      },

      'form.status'(){
        if (this.form.status === 30 || this.form.status === 100) {
          // 获取所有回款主体的选项
          let channel = this.form.channel_code
          this.$http
            .get('/verify_channel/remitcompanies?channel_code=' + channel)
            .then(({data}) => {
              this.companies = data
            })
        }
      }
    },

    methods: {
      init(){
        this.id = this.editId
        this.resetForm()

        if (this.id !== 0) {
          this.getOne(this.id)
        }

        if (this.defaultValue) {
          this.form.body_my = this.defaultValue.body_my
        }

        // 初始化获取渠道
        this.onBodySelected()
        // 获取对账用户
        this.getDepatUsers()
      },
      resetForm(){
        this.form = _.cloneDeep(this.emptyForm)
        this.games = []
      },
      close(needRefresh = false){
        this.$emit('close', needRefresh)
      },
      onBodySelected(){
        // 编辑的时候不重置
        if (this.id) {
          return
        }
        this.form.channel_code = null
        this.form.pre_verify = []
        this.form.date = null
        this.games = []
        this.getChannels()
      },
      onChannelSelected(){
        // 编辑的时候不重置
        if (this.id) {
          return
        }
        if (_.isEmpty(this.form.channel_code)) {
          return
        }

        this.form.pre_verify = []
        this.form.date = null
        this.getDate()
      },
      onDateSelected(){
        // 编辑的时候不重置
        if (this.id) {
          return
        }
        if (_.isEmpty(this.form.date)) {
          return
        }
        this.isLoading = true
        this.form.pre_verify = []
        this.getGames()
      },

      getChannels(){
        let body_my = this.form.body_my
        let query = util.buildGetParams({body_my})
        let url = '/verify_channel/not_verify_channel?' + query
        this.$http.get(url)
          .then(({data}) => {
            this.channels = data;
            if (this.defaultValue) {
              this.form.channel_code = this.defaultValue.channel_code
            }
          })
      },
      getDate(){
        let body_my = this.form.body_my
        let channel_code = this.form.channel_code
        let query = util.buildGetParams({body_my, channel_code})
        let url = '/verify_channel/not_verify_channel_time?' + query
        this.$http.get(url)
          .then(({data}) => {
            this.dates = data;

            if (this.defaultValue) {
              this.form.date = this.defaultValue.date
              this.$emit('emptyDefault', null)
            }
          })
      },
      getGames(){
        let body_my = this.form.body_my
        let channel_code = this.form.channel_code
        let month = this.form.date
        let query = util.buildGetParams({body_my, channel_code, month})
        let url = '/verify_channel/not_verify_channel_game?' + query
        this.$http.get(url)
          .then(({data}) => {
            this.games = data;
            this.form.pre_verify = data
            this.isLoading = false
          })
      },
      handleCheckAllChange(event) {
        this.form.pre_verify = event.target.checked ? this.games : []
        this.isIndeterminate = false
      },
      handleSelectedGamesChange(value) {
        let checkedCount = value.length
        this.checkAllGames = checkedCount === this.games.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.games.length
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
        for (let i in this.form.pre_verify) {
          let game = this.form.pre_verify[i]
          amount_my += parseFloat(game.amount_my)
          amount_opposite += parseFloat(game.amount_opposite)
          amount_theory += parseFloat(game.amount_theory)
          amount_payable += parseFloat(game.amount_payable)

          game.amount_diff = (game.amount_theory - game.amount_payable).toFixed(2)
          amount_diff += parseFloat(game.amount_diff)
        }
        this.form.amount_my = amount_my.toFixed(2)
        this.form.amount_theory = amount_theory.toFixed(2)
        this.form.amount_opposite = amount_opposite.toFixed(2)
        this.form.amount_payable = amount_payable.toFixed(2)
        this.form.amount_diff = amount_diff.toFixed(2)
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
        let body = util.objectTransform(this.form, {
          verify_time: 'timeToStamp',
          amount_my: 'number',
          amount_theory: 'number',
          amount_opposite: 'number',
          amount_payable: 'number',
          file_id: 'number',
          file_preview_id: 'number',
          billing_date: 'dateToTimeString',
        })

        if (!body.pre_verify || body.pre_verify.length === 0) {
          this.$message({type: 'error', message: 'please choose games first'})
          return
        }
        if (!body.status) {
          this.$message({type: 'error', message: 'please choose status'})
          return
        }
        if ((body.status === 30 || body.status === 100 ) && !body.remit_company_id) {
          this.$message({type: 'error', message: 'please choose company'})
          return
        }
        if ((body.status === 30 || body.status === 100 ) && !body.billing_date) {
          this.$message({type: 'error', message: '请选择开票日期'})
          return
        }

//        if (!body.amount_my || !body.amount_opposite
//          || !body.amount_payable || !body.amount_theory) {
//          this.$message({type: 'error', message: 'amount data has error'})
//          return
//        }

        if (!body.verify_user_id) {
          this.$message({type: 'warning', message: 'please choose user'})
          return
        }

        let post = util.buildPostParams(body)

        let url = '/verify_channel'
        if (this.id == 0) {
          this.$http.post(url, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.close(true)
              this.resetForm()
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
        let url = "/verify_channel/" + id;
        this.$http.get(url)
          .then(({data}) => {
            data.amount_diff = 0
            this.form = util.objectTransform(data, {
              verify_time: 'timestampToDate',
              billing_date: 'stringToDate',
              amount_diff: () => {
                return 0
              },
              remit_company_id: (old) => {
                return old
              },
              pre_verify: (old) => {
                return old || []
              }
            })

            this.channels = [data.channel]
            this.dates = [data.date]
            this.games = this.form.pre_verify || []

            // 添加额外的没对账的游戏
            let body_my = this.form.body_my
            let channel_code = this.form.channel_code
            let month = this.form.date
            let query = util.buildGetParams({body_my, channel_code, month})
            let url = '/verify_channel/not_verify_channel_game?' + query
            this.$http.get(url)
              .then(({data}) => {
                this.games = this.games.concat(data);
              })
          })
      },
    },
    created(){
      this.resetForm()
    },
    mounted: function () {
      this.init()
    },
  };
</script>

<style rel="stylesheet/less" lang="less" scope>

</style>

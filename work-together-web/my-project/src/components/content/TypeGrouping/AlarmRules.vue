<template>
  <div class="box-body form-horizontal">
    <div class="rule-item">
      <div class="form-group">
        <label class="col-md-2 control-label">合同到期</label>
        <div class="col-md-8">
          <div class="row">
            <div class="col-md-6">
              <div style="padding-top: 7px">
                <label>默认规则：</label>距离 <b v-if="rules.contract_timeout">{{rules.contract_timeout.interval_time/24/3600}}</b> 天提醒
              </div>
            </div>
            <div class="col-md-6">
              <label>自定义：</label>
              <input class="form-control" style="display: inline-block;width: auto" type="text" v-model.number="custom.contractTimeout"
                     onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="天数"/>
            </div>
          </div>
          <div class="">
            <div style="margin-top: 6px;color: #999">生效规则：距离 <b>{{activeTimeout}}</b> 天提醒</div>
          </div>
        </div>
        <div class="col-md-2">
          <button class="btn btn-primary" @click="put(rules.contract_timeout.id, custom.contractTimeout)">保存</button>
        </div>
      </div>
    </div>

    <div class="rule-item">
      <div class="form-group">
        <label class="col-md-2 control-label">合同未签订</label>
        <div class="col-md-8">
          <div class="row">
            <div class="col-md-6">
              <div style="padding-top: 7px">
                <label>默认规则：</label>距离 <b v-if="rules.contract_timeout">{{rules.contract_timeout.interval_time/24/3600}}</b> 天提醒
              </div>
            </div>
            <div class="col-md-6">
              <label>自定义：</label>
              <input class="form-control" style="display: inline-block;width: auto" type="text" v-model.number="custom.contractSign"
                     onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="天数"/>
            </div>
          </div>
          <div class="">
            <div style="margin-top: 6px;color: #999">
              生效规则：距离 <b>{{activeNotSign}}</b> 天提醒
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <button class="btn btn-primary" @click="put(rules.contract_sign.id, custom.contractSign)">保存</button>
        </div>
      </div>
    </div>

    <div class="rule-item">
      <div class="form-group">
        <label class="col-md-2 control-label">未对账</label>
        <div class="col-md-8">
          <div class="row">
            <div class="col-md-6">
              <div style="padding-top: 7px">
                <label>默认规则：</label>
                距离 <b v-if="rules.verify_account">{{rules.verify_account.interval_time/24/3600}}</b> 天提醒 ,
                金额达到 <b v-if="rules.verify_account">{{rules.verify_account.amount}}</b> 提醒
              </div>
            </div>
            <div class="col-md-6">
              <label>自定义：</label>
              <div>
                天数:
                <input class="form-control" style="display: inline-block;width: auto" type="text" v-model.number="custom.verifyAccount.time"
                       onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="天数"/>
              </div>
              <div>
                金额:
                <input class="form-control" style="display: inline-block;width: auto" type="text" v-model.number="custom.verifyAccount.amount"
                       onKeypress="return (/[\d.]/.test(String.fromCharCode(event.keyCode)))" placeholder="金额"/>
              </div>
            </div>
          </div>
          <div class="">
            <div style="margin-top: 6px;color: #999">
              生效规则：
              距离 <b>{{activeVerify.time}}</b> 天提醒,
              金额达到 <b>{{activeVerify.amount}}</b> 提醒
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <button class="btn btn-primary" @click="put(rules.verify_account.id, custom.verifyAccount.time, custom.verifyAccount.amount)">保存</button>
        </div>
      </div>
    </div>

    <div class="rule-item">
      <div class="form-group">
        <label class="col-md-2 control-label">未回款</label>
        <div class="col-md-8">
          <div class="row">
            <div class="col-md-6">
              <div style="padding-top: 7px">
                <label>默认规则：</label>
                距离 <b v-if="rules.remit_account">{{rules.remit_account.interval_time/24/3600}}</b> 天提醒 ,
                金额达到 <b v-if="rules.remit_account">{{rules.remit_account.amount}}</b> 提醒
              </div>
            </div>
            <div class="col-md-6">
              <label>自定义：</label>
              <div>
                天数:
                <input class="form-control" style="display: inline-block;width: auto" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                       type="text" v-model.number="custom.remitAccount.time" placeholder="天数"/>
              </div>
              <div>
                金额:
                <input class="form-control" style="display: inline-block;width: auto" onKeypress="return (/[\d.]/.test(String.fromCharCode(event.keyCode)))"
                       type="text" v-model.number="custom.remitAccount.amount" placeholder="金额"/>
              </div>
            </div>
          </div>
          <div class="">
            <div style="margin-top: 6px;color: #999">
              生效规则：
              距离 <b>{{activeRemit.time}}</b> 天提醒,
              金额达到 <b>{{activeRemit.amount}}</b> 提醒
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <button class="btn btn-primary" @click="put(rules.remit_account.id, custom.remitAccount.time, custom.remitAccount.amount)">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style rel="stylesheet/less" lang="less" scoped>
  .rule-item {
    padding-top: 20px;
    border-bottom: 2px dashed #b1b1b1;
    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      border-bottom: none;
    }
  }
</style>
<script>
  import utils from '../../../publicjs/utils'
  import {Validator} from 'vee-validate'
  const validator = new Validator({
    time: 'required',
    amount: 'required',
  });
  export default {
    data() {
      return {
        rules: {},
        custom: {
          contractTimeout: 0,// 自定义的输入合同超时时间(天)
          contractSign: 0,// 自定义的输入合同游戏首发时到未签订时间(天)
          verifyAccount: {
            time: 0,
            amount: 0,
          },// 自定义的几天内的未对账金额
          remitAccount: {
            time: 0,
            amount: 0,
          },// 自定义的几天内的未回款金额
        },
      }
    },
    methods: {
      check(id, time, amount){
        if (id == 4 || id == 5){
          if (!validator.validate('time', time)){
            return "请输入自定义时间"
          }
        } else {
          if (!validator.validate('time', time)){
            return "请输入自定义时间"
          } else {
            if (!validator.validate('amount', amount)){
              return "请输入自定义金额"
            }
          }
        }
        return ""
      },
      put(id, time, amount) {
//        console.log(id + "::" + time + "::" + amount)
//        return

        let errInfo = this.check(id, time, amount)
        if (errInfo) {
          this.$message({
            type: 'warning',
            message: errInfo
          })
          return
        }

        var body
        if (id == 4 || id == 5){
          body = {
            custom_interval_time: parseInt(time) * 24 * 3600,
          }
        } else {
          body = {
            custom_interval_time: parseInt(time) * 24 * 3600,
            custom_amount: amount,
          }
        }

        let post = utils.buildPostParams(body)

        let url = '/alarmrule/' + id;
        this.$http.put(url, post)
          .then((r) => {
            this.$message({
              type: 'success',
              message: '保存成功',
            })
          })
      }
    },
    computed: {
      activeTimeout(){
        if (this.custom.contractTimeout) {
          return this.custom.contractTimeout
        }
        if (this.rules.contract_timeout) {
          let t = this.rules.contract_timeout.interval_time;
          return t ? t / 24 / 3600 : 0
        }
        return ""
      },
      activeNotSign(){
        if (this.custom.contractSign) {
          return this.custom.contractSign
        }
        if (this.rules.contract_sign) {
          let t = this.rules.contract_sign.interval_time
          return t ? t / 24 / 3600 : 0
        }
        return ""
      },
      activeVerify(){
        let time = 0
        if (this.rules.verify_account) {
          let t = this.rules.verify_account.interval_time
          time = t ? t / 24 / 3600 : 0
        }
        if (this.custom.verifyAccount.time) {
          time = this.custom.verifyAccount.time
        }

        let amount = 0
        if (this.rules.verify_account) {
          amount = this.rules.verify_account.amount
        }
        if (this.custom.verifyAccount.amount) {
          amount = this.custom.verifyAccount.amount
        }

        return {time, amount}
      },
      activeRemit(){
        let time = 0
        if (this.rules.remit_account) {
          let t = this.rules.remit_account.interval_time
          time = t ? t / 24 / 3600 : 0
        }
        if (this.custom.remitAccount.time) {
          time = this.custom.remitAccount.time
        }

        let amount = 0
        if (this.rules.remit_account) {
          amount = this.rules.remit_account.amount
        }
        if (this.custom.remitAccount.amount) {
          amount = this.custom.remitAccount.amount
        }

        return {time, amount}
      },
    },
    mounted(){
      this.$http.get("/alarmrule/")
        .then(({data}) => {
          this.rules = data

          // 设置自定义信息
          // 合同过期时间
          let t = data.contract_timeout.custom_interval_time
          this.custom.contractTimeout = t ? t / 24 / 3600 : t
          // 未签订时间
          t = data.contract_sign.custom_interval_time
          this.custom.contractSign = t ? t / 24 / 3600 : t

          // 回款
          if (data.remit_account) {
            t = data.remit_account.custom_interval_time
            this.custom.remitAccount.time = t ? t / 24 / 3600 : t
            this.custom.remitAccount.amount = data.remit_account.custom_amount
          }

          // 对账
          if (data.verify_account) {
            t = data.verify_account.custom_interval_time
            this.custom.verifyAccount.time = t ? t / 24 / 3600 : t
            this.custom.verifyAccount.amount = data.verify_account.custom_amount
          }

        })
    }
  }
</script>

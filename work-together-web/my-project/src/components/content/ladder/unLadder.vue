<template>

  <div class="ladder-box">
    <div v-for="(ladder,index) in ladders" class="ladder-item">
      <!--<div class="item-remove" @click="removeLadder(index,1)" :disabled="readonly"><i class="fa fa-trash"></i></div>-->
      <div class="form-group">
        <table class="table">
          <thead>
          <tr>
            <th>规则类型</th>
            <th>规则</th>
            <th>删除</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(rule,index) in ladder.rules" class="rule-item">
            <td>{{ {time:"时间",user:"用户数量",money:"金额"}[rule.type] }}</td>
            <td>{{rule.begin+' - '+rule.end}}</td>
            <!--<td>-->
              <!--<div class="item-remove" @click="removeRule(ladder.rules,index)" :disabled="readonly">-->
                <!--<i class="fa fa-trash"></i>-->
              <!--</div>-->
            <!--</td>-->
          </tr>

          <tr>
            <!--<td colspan="99">-->
              <!--<el-button class="btn-add-rule fa fa-plus" :disabled="readonly"-->
                         <!--@click="showAddRuleBox(ladder)"> 添加规则</el-button>-->
            <!--</td>-->
          </tr>
          </tbody>
        </table>
      </div>

      <div class="row">
        <div v-if="defaultTime!=-1" class="col-md-4">
          <label>生效时间</label>
          <el-date-picker
            v-model="ladder.time"
            @input="updateValue"
            type="daterange"
            placeholder="选择日期范围"  :disabled="true">
          </el-date-picker>
        </div>
        <div class="col-md-4">
          <label>我方比例</label>
          <div class="input-group">
            <input
              type="text" class="form-control" placeholder="请输入分成"
              v-model.number="ladder.ratio"
              @change="updateValue"  :disabled="true" >
            <div class="input-group-addon">%</div>
          </div>
        </div>
        <div class="col-md-4">
          <label>通道费</label>
          <div class="input-group">
            <input
              type="text" class="form-control" placeholder="请输入通道费用"
              v-model.number="ladder.slottingFee"
              @change="updateValue" :disabled="true">
            <div class="input-group-addon">%</div>
          </div>
        </div>
      </div>
    </div>

    <!--<div>-->
      <!--<el-button type="primary" icon="plus" @click="addLadder()" :disabled="readonly">新增阶梯</el-button>-->
    <!--</div>-->

    <el-dialog title="添加规则" v-model="isShowAddRuleBox" size="small" :modal="false" :modal-append-to-body="true">
      <el-tabs v-model="addRuleBox.type">
        <el-tab-pane label="金额" name="money">
          <el-row :gutter="24">
            <el-col :span="9">
              <el-input v-model="addRuleBox.moneyBegin" placeholder="请输入内容"  :disabled="true"></el-input>
            </el-col>
            <el-col :span="1">~</el-col>
            <el-col :span="10">
              <el-input v-model="addRuleBox.moneyEnd" placeholder="请输入内容"  :disabled="true"></el-input>
              <!--<div><button></button></div>-->
            </el-col>
            <!--<el-button :span="1" @click="infinity()">∞</el-button>-->
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="时间" name="time">
          <el-row :gutter="24">
            <el-col :span="20">
              <el-date-picker
                v-model="addRuleBox.time"
                type="daterange"
                placeholder="选择日期范围"  :disabled="true">
              </el-date-picker>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="用户" name="user">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-input v-model="addRuleBox.userBegin" placeholder="请输入内容"  :disabled="true"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="addRuleBox.userEnd" placeholder="请输入内容"  :disabled="true"></el-input>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="isShowAddRuleBox = false">取消</el-button>-->
        <!--<el-button type="primary" @click="addRule()">确定</el-button>-->
      <!--</span>-->
    </el-dialog>

  </div>

</template>
<script type="text/ecmascript-6">
  import util from '../../../publicjs/utils'
  export default {
    props: ['value', "defaultTime", 'readonly'],
    data(){
      return {
        ladders: [],
        mLadderItem: {
          rules: [],
          time: [],
          slottingFee: 0, // 通道费
          ratio: 0, // 我方比例
        }, // 定义ladder数组的element
        mRule: {
          type: 'user', // 类型,time,money,user:用户数量
          begin: null, // 数值的最大值(可能是时间,金额,用户数量)
          end: null, // 数值的最小值
        }, // 定义rules数组的element

        isShowAddRuleBox: false,
        prepareAddRuleLadder: null, // 将要添加规则的阶梯
        addRuleBox: {
          type: 'money',
          userBegin: null,
          userEnd: null,
          moneyBegin: null,
          moneyEnd: null,
          time: [],
        },
        defaultAddRuleBox: {
          type: 'money',
          userBegin: null,
          userEnd: null,
          moneyBegin: null,
          moneyEnd: null,
          time: [],
        }, // 用于重置addRuleBox
      }
    },
    methods: {
      // 重新构建阶梯规则结构 用于上传给后台
      reBuildLadders2Back(ladders){
//        console.log(ladders)
        let temp = []
        for (let i in ladders) {
          let ladder = ladders[i]

          let rule = ""
          if (ladder.rules.length != 0) {
            for (let j in ladder.rules) {
              let r = ladder.rules[j]
              rule += "&" + r.begin + "<" + r.type + "<" + r.end
            }
            rule = rule.substr(1)
          }

          let start, end = ""
          if (ladder.time[0]) {
            start = ladder.time[0].format("yyyy-MM-dd")
            end = ladder.time[1].format("yyyy-MM-dd")
          }

          temp.push({
            rule: rule,
            start_time: start,
            end_time: end,
//            slotting_fee: parseFloat(ladder.slottingFee / 100).toFixed(4).toString()
            slotting_fee: parseFloat(parseFloat((ladder.slottingFee / 100).toFixed(4))),
            ratio: parseFloat(parseFloat((ladder.ratio / 100).toFixed(4))),
          })
        }
        return temp
      },
      // 重新构建阶梯 由后台格式构建成前端需要的
      reBuildLadders2Front(ladders){
        let temp = []
        for (let i in ladders) {
          let item = ladders[i]
          let rules = []
          if (item.rule) {
            let rulesString = item.rule.split("&")
            for (let j in rulesString) {
              let ru = rulesString[j]
              let begin, type, end
              [begin, type, end] = ru.split("<")
              rules.push({
                begin, type, end
              })
            }
          }

          let time = []
          if (item.start_time) {
            time = [new Date(item.start_time), new Date(item.end_time)]
          }
          temp.push({
            rules: rules,
            time: time,
            slottingFee: parseFloat(parseFloat(item.slotting_fee * 100).toFixed(2)),
            ratio: parseFloat(parseFloat(item.ratio * 100).toFixed(2)),
          })
        }
        return temp
      },
      updateValue(){
        this.$emit('input', this.reBuildLadders2Back(this.ladders))
      },
      addLadder(){
        var defaultLadder = _.cloneDeep(this.mLadderItem)
        if (this.defaultTime && this.defaultTime.length == 2) {
          defaultLadder.time = this.defaultTime
        }
        this.ladders.push(defaultLadder)
        this.updateValue()
      },
      removeLadder(index){
        if (this.readonly){
          return
        }
        this.ladders.splice(index, 1)
        this.updateValue()
      },
      addRule(){
        let r = _.cloneDeep(this.mRule)
        r.type = this.addRuleBox.type
        switch (r.type) {
          case 'time':
            r.begin = r.end = ""
            if (this.addRuleBox.time[0]) {
              r.begin = this.addRuleBox.time[0].format("yyyy-MM-dd")
              r.end = this.addRuleBox.time[1].format("yyyy-MM-dd")
            }
            break
          case 'user':
            r.begin = this.addRuleBox.userBegin
            r.end = this.addRuleBox.userEnd
            break
          case 'money':
            r.begin = this.addRuleBox.moneyBegin
            r.end = this.addRuleBox.moneyEnd
            break
        }
        this.prepareAddRuleLadder.rules.push(r)

        this.isShowAddRuleBox = false
        this.addRuleBox = _.cloneDeep(this.defaultAddRuleBox)
        this.updateValue()
      },
      //设置无穷大数
      infinity(){
        this.addRuleBox.moneyEnd = 99999999
      },
      removeRule(parent, index){
        if (this.readonly){
          return
        }
        parent.splice(index, 1)
        this.updateValue()
      },
      showAddRuleBox(ladder){
        this.prepareAddRuleLadder = ladder
        this.isShowAddRuleBox = true
      },
      // 检查当前设置是否有效
      valid(ladders){
        // 检查是否有阶梯
        if (ladders.length == 0) {
          return "rules must contain at least one rule"
        }
        // 检查是否设置了时间(start,end),比例(ratio),通道费(slotting_fee)
        for (let i in ladders) {
          let ladder = ladders[i]
          if (!ladder.start_time) {
            return "you must set time range of rule"
          }
          if (ladder.ratio > 1 || ladder.ratio < 0) {
            return "ratio is invalid, ratio must in [0,1]"
          }
          if (ladder.slotting_fee > 1 || ladder.slotting_fee < 0) {
            return "slotting_fee is invalid, slotting_fee must in [0,1]"
          }
          // 暂时去掉
          // 有规则就必须有时间规则
//          if (ladder.rule&&ladder.rule.indexOf("time")===-1){
//            return "rules must contain a rule that it's type is 'time' if rules exist"
//          }
        }
        return ""
      },
    },
    mounted(){

    },
    watch: {
      value(){
//        console.log("value", this.value)
        this.ladders = this.reBuildLadders2Front(this.value)
      },
      defaultTime(n, o){
//        console.log("length:", this.ladders.length)
        if (this.ladders.length == 0) {
          this.addLadder()
        }

        for (let i in this.ladders) {

          let checkStart = util.checkSameDay(this.ladders[i].time[0], o[0])
          let checkEnd = util.checkSameDay(this.ladders[i].time[1], o[1])


          if (checkStart && checkEnd) {
            this.ladders[i].time = n
          }

          if (!this.ladders[i].time || this.ladders[i].time.length == 0) {
            this.ladders[i].time = n
          }
          this.updateValue()
        }
      },
    }
  };
</script>
<style rel="stylesheet/less" lang="less" scopted>
  .ladder-box {
    border: 1px solid #d2d6de;
    padding: 10px;
    margin-bottom: 10px;
  .ladder-item {
    position: relative;
    border-bottom: 2px dashed #b1b1b1;
    padding-bottom: 10px;
    margin-bottom: 10px;

  > .item-remove {
      position: absolute;
      right: 0px;
      top: 0px;
      width: 21px;
      height: 21px;
      background-color: #c55063;
      color: #fff;
      line-height: 20px;
      text-align: center;
      cursor: pointer;
  &[disabled]{
     opacity: 0.5;
     cursor: default;
   }
  }
  }
  .form-group {
    margin-right: 0;
    margin-left: 0;
  }
  }

  .rule-item {
  .item-remove {
    color: #c55063;
    cursor: pointer;
  &[disabled]{
     opacity: 0.5;
     cursor: default;
   }
  }
  }

  .btn-add-rule {
    cursor: pointer;
    color: #0f74a8;
  }
</style>

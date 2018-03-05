<template>
  <div>
    <div id="resear_h3">
      <!--<h3>添加游戏提测</h3>-->
      <div>
        <div id="resear">
          <div class="situation row">
            <label class="times_contracts"><span class="redSign">*</span>游戏名称：</label>
            <div class="col-sm-10 times_contract times_contracty">
              <el-input @change="gamenamekeyup" v-model.trim="gamename" placeholder="请输入游戏名称"></el-input>
              <span>请确保游戏名正确，游戏接入后不可修改！</span>
            </div>
          </div>
          <div class="situation row">
            <label class="times_contracts"><span class="redSign">*</span>游戏来源:</label>
            <div class="col-sm-10 times_contract times_contracty">
              <el-select v-model="selectedGameSource" :clearable="true"
                         filterable placeholder="请选择">
                <el-option
                  v-for="item in gameSource"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <span>请确保游戏来源选择正确，游戏接入后不可修改！</span>
            </div>
          </div>
          <div class="form-group row">
            <label class="times_contracts">首发时间:</label>
            <div class="col-sm-5">
              <div class="input-group date">
                <div class="input-group-addon">
                  <i class="fa fa-calendar"></i>
                </div>
                <el-date-picker
                  v-model="publishTime"
                  placeholder="选择首发时间">
                </el-date-picker>
              </div>
            </div>
            <p class="col-sm-12">（注:若首发时间未定，请选择大概时间并在备注中标明）</p>
          </div>
          <div class="situation row">
            <label class="times_contracts"><span class="redSign">*</span>发行商:</label>
            <div class="col-sm-10 times_contract times_contracty">
              <el-select v-model="selectedIssues" :clearable="true"
                         filterable placeholder="请选择">
                <el-option
                  v-for="item in issues"
                  :label="item.company_name"
                  :value="item.company_id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="situation row">
            <label class="times_contracts"><span class="redSign">*</span>游戏类型:</label>
            <div class="col-sm-10 times_contract times_contracty">
              <el-select v-model="selectedGameTypes" :clearable="true"
                         filterable placeholder="请选择">
                <el-option
                  v-for="item in gameTypes"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="situation row">
            <label class="times_contracts"><span class="redSign">*</span>是否有IP:</label>
            <div class="col-sm-10 times_contract times_contracty">
              <el-radio class="radio" v-model="ip" label="1">YES</el-radio>
              <el-radio class="radio" v-model="ip" label="2">NO</el-radio>
            </div>
          </div>
          <div class="situation row">
            <label class="times_contracts"><span class="redSign">*</span>明星代言:</label>
            <div class="col-sm-10 times_contract times_contracty">
              <el-select v-model="selectedStar" :clearable="true"
                         filterable placeholder="请选择">
                <el-option
                  v-for="item in star"
                  :label="item.star"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-input v-if="selectedStar==1" v-model="starName" placeholder="请输入代言人姓名"></el-input>
            </div>
          </div>
          <div class="situation row">
            <label class="times_contracts"><span class="redSign">*</span>市场预算:</label>
            <div class="col-sm-10 times_contract times_contracty">
              <el-select v-model="selectedBudget" :clearable="true"
                         filterable placeholder="请选择">
                <el-option
                  v-for="item in budget"
                  :label="item.budget"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-input v-if="selectedBudget==1" v-model="money" placeholder="请输入预算值"></el-input>
            </div>
          </div>
          <div class="situation row">
            <label class="times_contracts"><span class="redSign">*</span>测试包:</label>
            <div class="col-sm-10 times_contract times_contracty">
              <el-input v-model.trim="package" placeholder="请输入测试包路径"></el-input>
            </div>
          </div>
          <div class="dowebok  form-control_statesd">
            <label class="times_contracts">测试数据：</label>
            <el-button type="primary" icon="plus" @click=addTest></el-button>
            <div id="accountstest_div">
              <div>
                <el-row :gutter="24" style="margin-left:0px;" v-for="(item,index) in accountstest">
                  <el-col :span="20">
                    <file-uploader v-model="item.result_report"></file-uploader>
                    <span v-if="item.result_report>0">文件编号：YUND-{{item.result_report}}</span>
                  </el-col>
                  <el-col :span="4">
                    <el-button style="margin-top: 0px;" type="primary" icon="minus" @click="accountstest.splice(index,1)"></el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>

          <div class="dowebok  form-control_stateszzs">
            <label class="times_contracts">高级账号：</label>
            <el-button type="primary" icon="plus" @click=addTable></el-button>
            <div id="accounts_div">
              <div>
                <el-row :gutter="24" style="margin-left:0px;text-align: center">
                  <el-col :span="10">账号</el-col>
                  <el-col :span="10">密码</el-col>
                </el-row>
                <el-row :gutter="24" style="margin-left:0px;margin-bottom: 10px" v-for="(item,index) in accountszz">
                  <el-col :span="10">
                    <el-input v-model="item.accounts" placeholder="请输入账号"></el-input>
                  </el-col>
                  <el-col :span="10">
                    <el-input v-model="item.password" placeholder="请输入密码"></el-input>
                  </el-col>
                  <el-button style="margin-top: 0px;" type="primary" icon="minus" @click="accountszz.splice(index,1)"></el-button>
                </el-row>
              </div>
            </div>
          </div>
          <div class="situation row">
            <label class="times_contracts">备注:</label>
            <div class="col-sm-10 times_contract times_contracty">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="remarks">
              </el-input>
            </div>
            <div style="padding-bottom: 100px;" class="dowebok  form-control_statesd">
              <label class="times_contracts"></label>
              <div class="col-sm-10 times_contract times_contracty">
                <button class="btn btn-default btn_B col-md-4" :disabled= disabl @click="post">保存</button>
                <button class="btn btn-default btn_F col-md-4 col-md-offset-1" @click="close(false)">关闭</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  #resear > div{
    margin-left: 35px;
    padding-bottom: 30px;
  }
  .contact_div{
    margin-left: 35px;
    padding-bottom:30px;
  }
  #resear_h3 h3 {
    padding-bottom: 30px;
    margin-left: 20px;
    padding-top: 30px;
    margin-top: 0;
    margin-bottom: 0;
  }
  .el-select {
    display: inherit;
  }
  .el-table__body td > input {
    width: 70%;
    margin: auto;
  }
  .form-control_stateszzs{
    padding: 0;
    width: 50%;
    min-width: 300px;
    max-width: 700px;
  }
  .el-table__body td, #tabl_bod th {
    text-align: center;
  }
  #accounts_div>div{
    border: 1px solid black;
    margin-top: 30px;
    padding: 30px;
  }
  #accountstest_div>div{
    border: 1px solid black;
    margin-top: 30px;
    padding: 30px;
  }
  .el-date-editor.el-input{
    width: 100%;
  }
</style>
<style>
  #primary_file div .el-upload__input{
    display: none;
  }
</style>
<script>
  import {Pagination} from 'element-ui'
  import FileUploader from '../public/FileUploader.vue'
  import utils from '../../publicjs/utils'
  export default {
    components: {
      FileUploader,
      utils
    },
    data() {
      return {
        gamename: '',
        publishTime: '', //首发时间
        selectedIssues: '', //发行商
        issues: [],
        selectedGameTypes: '',    //游戏类型
        gameTypes: [],
        selectedGameSource: null,    //游戏来源
        gameSource: [],
        ip: '1',
        selectedStar: '',
        star: [
          {id:0, star:"否"},
          {id:1, star:"是"}],
        starName: '',
        selectedBudget: '',
        budget: [
          {id:0, budget:"否"},
          {id:1, budget:"是"}],
        money: '',
        package: '',
        remarks: '',
        accountszz: [
          {accounts: "",password: ""},
        ],
        accountstest: [
          {result_report: 0},
        ],
        accounts:'',
        password:'',
        disabl: false,
      }
    },
    methods: {
      trim:function () {
        alert("111")
      },
      back:function(){
        this.$router.push({path:'/home/reference'})
      },
      //获取发行商列表
      getDevelopmentList:function () {
        var url = '/distributionCompany/companyname/'
        this.$http.get(url)
          .then((res) => {
            this.issues = res.body
          })
      },
      gamenamekeyup (value) {
        this.gamename=value .replace(/\s/g, '');

      },
      //获取游戏类型列表
      getGameTypeList:function () {
        var url = '/types/?query=type%3A1'
        this.$http.get(url)
          .then((res) => {
            this.gameTypes = res.body
          })
          .catch((err) => {
            context.error = err.data
          })
      },
      // 获取游戏来源列表
      getGameSourceList: function () {
        var url = '/types/?query=type%3A12'
        this.$http.get(url)
          .then((res) => {
            this.gameSource = res.body
          })
          .catch((err) => {
            context.error = err.data
          })
      },
      //校验数据合法性
      check:function(){
        if(this.gamename==null||this.gamename==''){
          return "请填写游戏名称"
        }
        if(!this.selectedIssues){
          return "请选择发行商"
        }

        if(this.selectedGameTypes==null||this.selectedGameTypes.length==0){
          return "请选择游戏类型"
        }

        if(this.selectedGameSource==null||this.selectedGameSource.length==0){
          return "请选择游戏来源"
        }

        if(this.selectedStar!=[]||this.selectedStar.length!=0){
          if(this.selectedStar.id==1){
            if(this.starName==''||this.starName==null){
              return "请填写代言人姓名"
            }
          }
        }else{
          return "请选择是否有明星代言"
        }

        if(this.selectedBudget.length!=[]||this.selectedBudget.length!=0){
          if(this.selectedBudget.id == 1&& this.money == '' ){
            return "请填写预算值"
          }
        }else {
          return "请选择是否有市场预算"
        }

        if(this.package==''||this.package==null){
          return "请填写测试包路径"
        }
        return ""
      },
      //添加游戏提测
      post() {
        if (this.disabl === false) {
          this.disabl = true
          setTimeout( () => {
            this.disabl = false
          }, 1500);
        }
        let errInfo = this.check()
        if (errInfo) {
          this.$message({
            type: 'warning',
            message: errInfo
          })
          return
        }

        let star = "否"
        if (this.selectedStar == 1){
          star = this.starName
        }

        let bud = "否"
        if (this.selectedBudget == 1){
          bud = this.money
        }

        let number = []
        for (let i in this.accountszz) {
          let one_number=[]
          one_number.push(this.accountszz[i].accounts)
          one_number.push(this.accountszz[i].password)
          number.push(one_number.join(":"))
        }

        let pictures = []
        for (let i in this.accountstest) {
          pictures.push(this.accountstest[i].result_report)
        }

        let body = {
          game_name: this.gamename.replace(/(^\s*)|(\s*$)/g, ""),
          "publish_time|timeToStamp": this.publishTime,
          issue: this.selectedIssues,
          game_type: this.selectedGameTypes,
          source: this.selectedGameSource,
          "ip|number": this.ip,
          star: star,
          budget: bud,
          package: this.package,
          "picture|json": pictures,
          remarks: this.remarks,
          "number|json": number,

          switch: 1
        }

        let post = utils.buildPostParams(body)

        let url = '/game'
        this.$http.post(url, post)
          .then((r) => {
            this.$message({
              type: 'success',
              message: '保存成功',
            }),
            this.close(true)
            this.reset()
          })
      },
      addTable: function () {
        this.accountszz.splice(0,0,
          {accounts: "",password: ""}
        )
      },
      addTest: function () {
        this.accountstest.splice(0,0,
          {result_report: 0}
        )
      },
      close(needRefresh = false){
        this.$emit('close', needRefresh)
        this.reset()
      },
      reset(){
          this.gamename='',
            this.publishTime=[],
            this.selectedIssues='',
            this.selectedGameTypes=[],
            this.ip='1',
            this.selectedStar=[],
            this.starName='',
            this.selectedBudget=[],
            this.money='',
            this.package='',
            this.remarks='',
            this.accounts='',
            this.password='',
            this.selectedBodyMy=[],
            this. accountszz=[
              {accounts: "",password: ""},
            ],
            this.accountstest= [
              {result_report: 0},
            ]
      },
    },

    mounted: function() {
      this.getDevelopmentList();
      this.getGameTypeList();
      this.getGameSourceList();
    }
  }
</script>

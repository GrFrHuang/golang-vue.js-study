<template>
  <div id="edit_h">
    <h3>查看{{gameName}}</h3>
    <div class="situation row">
      <label class="times_contracts">游戏名称:</label>
      <div class="col-sm-3 times_contract times_contracty">
        {{gameName}}
      </div>
    </div>
    <div class="form-group row">
      <label class="times_contracts">评测时间:</label>
      <div class="col-sm-3">
        <el-date-picker
          v-model="resultTime"
          placeholder="评测时间无" :disabled="true">
        </el-date-picker>
      </div>
      <!-- /.input group -->
    </div>
    <div class="situation row">
      <label class="times_contracts">评测人:</label>
      <div class="col-sm-3 times_contract times_contracty">
        {{person.nickname}}
      </div>
    </div>
    <div class="situation row">
      <label class="times_contracts">评测结果:</label>
      <div class="col-sm-3 times_contract times_contracty">
        <!--<multiselect v-model="selectedResult" tag-placeholder="Add this as new tag" placeholder="请选择"-->
        <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
        <!--label="name" track-by="id" :options="results" :multiple="false" :taggable="false">-->
        <!--</multiselect>-->
        <el-select v-model="selectedResult" :clearable="true"
                   filterable placeholder="评测结果无" :disabled="true">
          <el-option
            v-for="item in results"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="situation row">
      <label class="times_contracts">接入建议:</label>
      <div class="col-sm-3 times_contract times_contracty">
        <el-radio class="radio" v-model="advise" label="1" :disabled="true">接入</el-radio>
        <el-radio class="radio" v-model="advise" label="2" :disabled="true">不接入</el-radio>
      </div>
    </div>
    <div id="Operate">
      <label>评测报告(word)上传</label>
      <span v-if="result_report_word>0">文件编号：YUND-{{result_report_word==0 ? "无":result_report_word}}</span>
      <span v-else style="color: blue"> 无</span>
    </div>
    <div id="Operatea">
      <label>评测报告(excel)上传</label>
      <span v-if="result_report_excel>0">文件编号：YUND-{{result_report_excel}}</span>
      <span v-else style="color: blue"> 无</span>
    </div>
    <div class="situation row">
      <label class="times_contracts">包路径:</label>
      <div class="col-sm-3 times_contract times_contracty">
        <textarea  rows="2" style="min-width: 120px;width: 100%; resize: none" v-model="package" :disabled="true"></textarea>
      </div>
    </div>
    <div class="row">
      <div class="col-md-5 div_p_btn">
        <p>
          <button class="btn btn-default btn_F col-md-4 col-md-offset-1" @click="close(false)">返回</button>
        </p>
      </div>
    </div>
  </div>
</template>
<style type="text/css" scoped>
  .times_contracty{
    margin-top: 7px;
  }
  .el-date-editor.el-input{
    width: 100%;
  }
  #Operate{
    margin-left: 68px;
  }
  #Operatea{
    margin-left: 68px;
  }
</style>

<script>
  import Multiselect from 'vue-multiselect'
  import utils from '../../publicjs/utils'
  import FileUploader from '../public/FileUploader.vue'
  import {Validator} from 'vee-validate'
  const validator = new Validator({
    time: 'required|numeric|min:10',
    people: 'required',
    result: 'required',
    word: 'required|numeric|min:1',
    excel: 'required|numeric|min:1',
  });
  export default {
    components: {
      Multiselect,
      utils,
      FileUploader
    },
    props:["editId"],
    data() {
      return {

        id:0,//传过来的Id
        result_report_word: 0,
        result_report_excel: 0,
        package: '',
        person: "", //评测人
        selectedResultPersons: [], //评测人
        resultPersons: [],
        selectedResult: [], //评测结果集
        results: [],
        advise: '1',
        resultDetail: [],  //评测详情
        gameName: [],  //游戏名
        resultTime: [],
      }
    },
    watch: {
      editId(){
        this.load()
      },
      resultDetail(){
//        this.getAccessPersonlist();
        this.getResultslist();
        this.getNowResultPerson();
        this.resultTime = utils.stampToTime(this.resultDetail.result_time)
        this.result_report_word = this.resultDetail.result_report_word
        this.result_report_excel = this.resultDetail.result_report_excel
        this.package = this.resultDetail.package
        this.selectedResultPersons = this.resultDetail.cepingpeoples

      }
    },
    mounted: function() {
//      this.getResultDetails();
      this.load();
    },
    methods:{
      back:function(){
        this.$router.push({path:'/home/GameEvaluation'})
      },
      getAccessPersonlist:function () {
        var url = '/user/devment/10'
        this.$http.get(url)
          .then((res) => {
            this.resultPersons = res.body
            this.selectedResultPersons = this.resultDetail.cepingpeoples
          })
      },
      getNowResultPerson: function () {
        var url = '/userown/'
        this.$http.get(url)
          .then((res) => {
            this.person = res.body.info
          })
      },
      //弹出框关闭
      close(needRefresh=false){
        this.$emit('close',needRefresh)
      },
      //load
      load(){
        this.id=this.editId
        if(this.id!=0){
          this.getResultDetails(this.id)
        }
      },
      getResultslist:function () {
        var url = '/types/?query=type%3A6'
        this.$http.get(url)
          .then((res) => {
            this.results = res.body
            this.selectedResult = _.find(this.results, {'id': this.resultDetail.result})
          })
      },
      //获取当前游戏的评测详情
      getResultDetails:function (hasId) {
//        let id = this.$route.query.id;
        let id=hasId
        let query = util.buildGetParams({
          "ids": id,
          "flag": 'pc',
        })
        var url = '/game/result?' + query

        this.$http.get(url)
          .then((res) => {
            this.resultDetail = res.body.data[0]

            this.gameName = this.resultDetail.game_name
            this.package = this.resultDetail.package
          })
      },
      //校验数据合法性
      check:function(){
//        if (!validator.validate('time', utils.timeToStamp(this.resultTime))){
//          return "请选择评测时间"
//        }
        if(utils.timeToStamp(this.resultTime)==0){
          return "请选择评测时间"
        }

//        if (!validator.validate('people', this.selectedResultPersons)){
//          return "请选择评测人"
//        }
//        if (!validator.validate('result', this.selectedResult)){
//          return "请选择评测结果"
//        }
        if(this.selectedResult==[]||this.selectedResult==null||this.selectedResult.length==0){
          return "请选择评测结果"
        }
//        if (!validator.validate('word', this.result_report_word)) {
//          return "请上传评测报告(word)"
//        }
//        if (!validator.validate('excel', this.result_report_excel)) {
//          return "请上传评测报告(excel)"
//        }

        return ""
      },
    },
  };
</script>

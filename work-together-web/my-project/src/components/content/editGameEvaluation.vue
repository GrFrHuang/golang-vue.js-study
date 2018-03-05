<template>
  <div id="edit_h">
    <div class="situation row">
      <label class="times_contracts">游戏名称:</label>
      <div class="col-sm-5 times_contract times_contracty">
        {{gameName}}
      </div>
    </div>
    <div class="form-group row">
      <label class="times_contracts"><span class="redSign">*</span>评测时间:</label>
      <div class="col-sm-5">
        <el-date-picker
          type="date"
          v-model="resultTime"
          placeholder="选择评测时间">
        </el-date-picker>
      </div>
      <!-- /.input group -->
    </div>
    <div class="situation row">
      <label class="times_contracts">评测人:</label>
      <div class="col-sm-5 times_contract times_contracty">
        {{this.nickname}}
      </div>
    </div>
    <div class="situation row">
      <label class="times_contracts"><span class="redSign">*</span>评测结果:</label>
      <div class="col-sm-5 times_contract times_contracty">
        <el-select v-model="selectedResult" :clearable="true"
                   filterable placeholder="请选择">
          <el-option
            v-for="item in results"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="situation row">
      <label class="times_contracts"><span class="redSign">*</span>接入建议:</label>
      <div class="col-sm-5 times_contract times_contracty">
        <el-radio class="radio" v-model="advise" label="1">接入</el-radio>
        <el-radio class="radio" v-model="advise" label="2">不接入</el-radio>
      </div>
    </div>
    <div id="Operate">
      <label>评测报告(word)上传</label>
      <file-uploader v-model="result_report_word"></file-uploader>
      <span v-if="result_report_word>0">文件编号：YUND-{{result_report_word}}</span>
    </div>
    <div id="Operatea">
      <label>评测报告(excel)上传</label>
      <file-uploader v-model="result_report_excel"></file-uploader>
      <span v-if="result_report_excel>0">文件编号：YUND-{{result_report_excel}}</span>
    </div>
    <div class="situation row">
      <label class="times_contracts"><span class="redSign">*</span>包路径:</label>
      <div class="col-sm-5 times_contract times_contracty">
        <textarea rows="2" style="min-width: 120px;width: 100%; resize: none" v-model="package"></textarea>
      </div>
    </div>
    <div class="form-group " v-if="editId">
      <label class="col-sm-2 control-label">操作日志</label>
      <div class="col-sm-10">
        <operate-log :keyLabel="operateLabel" :page="29" :dataId="editId" :rand="rand"></operate-log>
      </div>
    </div>
    <div class="row">
      <div class="col-md-5 div_p_btn">
        <p>
          <button class="btn btn-default btn_B col-md-4" :disabled=disabl @click="put">保存</button>
          <button class="btn btn-default btn_F col-md-4 col-md-offset-1" @click="close(false)">返回</button>
        </p>
      </div>
    </div>
  </div>
</template>
<style type="text/css" scoped>
  .times_contracty {
    margin-top: 7px;
  }

  .el-date-editor.el-input {
    width: 100%;
  }

  #Operate {
    margin-left: 68px;
  }

  #Operatea {
    margin-left: 68px;
  }
</style>
<script>
  import utils from '../../publicjs/utils'
  import FileUploader from '../public/FileUploader.vue'
  import OperateLog from "../public/OperateLog";
  export default {
    components: {
      utils,
      FileUploader,
      'operate-log': OperateLog,
    },
    props: ["editId", 'rand', 'readonly'],
    data() {
      return {
        id: 0,//传过来的Id
        result_report_word: 0,
        result_report_excel: 0,
        package: '',
        person: "", //评测人
        selectedResultPersons: null, //评测人
        nickname:'',
        resultPersons: [],
        selectedResult: null, //评测结果集
        results: [],
        advise: '1',
        resultDetail: [],  //评测详情
        gameName: [],  //游戏名
        resultTime: '',
        disabl: false,
        operateLabel: {
          ResultTime: ['评测时间', (i) => {
            return util.stampToTime(i)
          }],
          Result: ['评测结果', (i) => {
            let v = _.find(this.results, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          Advise: ['接入建议', i => -10086],
          ResultReportWord: ['评测报告(word)', i => -10086],
          ResultReportExcel: ['评测报告(excel)', i => -10086],
          Package: '包路径'
        }
      }
    },
    watch: {
      rand() {
        this.load()
      },
      resultDetail() {
        this.getResultslist();
        this.getNowResultPerson();
        if (this.resultDetail.result_time == undefined) {
          this.resultTime = ''
        } else {
          this.resultTime = utils.stampToTimeFull(this.resultDetail.result_time)
        }
        this.result_report_word = this.resultDetail.result_report_word
        this.result_report_excel = this.resultDetail.result_report_excel
        this.package = this.resultDetail.package
        this.selectedResultPersons = this.resultDetail.cepingpeoples
//        console.log(this.selectedResultPersons[0].nickname)
      },
      person() {
        if (this.resultDetail.advise) {
          this.setAdvise(this.resultDetail.advise);
        }
      }
    },
    mounted: function () {
      this.load();
    },
    methods: {
      setAdvise: function (advise) {
        let advises = JSON.parse(advise)

        for (let i in advises) {
          let ad = advises[i].split(":")
          if (ad[0] == this.person.id) {
            this.advise = ad[1]
          }
        }
      },
      getNowResultPerson: function () {
        var url = '/userown/'
        this.$http.get(url)
          .then((res) => {
            this.person = res.body.info
          })
      },
      //弹出框关闭
      close(needRefresh = false) {
        this.$emit('close', needRefresh)
      },
      //load
      load() {
        this.id = this.editId
        if (this.id != 0) {
          this.getResultDetails(this.id)
        }
      },
      getResultslist: function () {
        var url = '/types/?query=type%3A6'
        this.$http.get(url)
          .then((res) => {
            this.results = res.body
//          this.selectedResult = _.find(this.results, {'id': this.resultDetail.result})
            this.selectedResult = this.resultDetail.result
          })
      },
      //获取当前游戏的评测详情
      getResultDetails: function (hasId) {
//        let id = this.$route.query.id;
        let id = hasId
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
            this.nicknames = [];
            this.nicknames = this.resultDetail.advises
            var nicknames2 = []
            if (this.nicknames.length>1){
              for (var i=0; i<this.nicknames.length; i++){
                nicknames2.push(this.nicknames[i].nickname)
                this.nickname = nicknames2.join('  ')
              }
            }else{
              this.nickname = this.nicknames.length == 1 ? this.nicknames[0].nickname : ''
            }
          })
      },
      //校验数据合法性
      check: function () {
        if (utils.timeToStamp(this.resultTime) == 0) {
          return "请选择评测时间"
        }

        if (!this.selectedResult) {
          return "请选择评测结果"
        }

        if (!this.package) {
          return "请输入包路径"
        }

        return ""
      },
      //保存游戏评测修改
      put() {
        if (this.disabl === false) {
          this.disabl = true
          setTimeout(() => {
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

        let resultids = this.resultDetail.result_person ? JSON.parse(this.resultDetail.result_person) : []
//        if (this.selectedResultPersons) {
//          for (let i in this.selectedResultPersons) {
//            resultids.push(this.selectedResultPersons[i])
//          }
//        }
        if (!resultids.includes(this.person.id)) {
          resultids.push(this.person.id)
        }

        let advise = []

        if (!this.resultDetail.advise) {
          advise.push(this.person.id + ":" + this.advise)
        } else {
          advise = JSON.parse(this.resultDetail.advise)

          if (!advise.includes(this.person.id + ":1") && !advise.includes(this.person.id + ":2")) {
            advise.push(this.person.id + ":" + this.advise)
          } else {
            for (let i in advise) {
              let ad = advise[i].split(":")
              if (ad[0] == this.person.id) {
                advise[i] = this.person.id + ":" + this.advise
              }
            }
          }
        }

        let body = {
          "result_time|timeToStamp": this.resultTime,
          "result_person|json": resultids,
          "advise|json": advise,
          result: this.selectedResult,
          "result_report_word|number": this.result_report_word,
          "result_report_excel|number": this.result_report_excel,
          package: this.package,
        }

        let post = utils.buildPostParams(body)

        let url = '/game/evaluation/' + this.resultDetail.id;
        this.$http.put(url, post)
          .then((r) => {
            this.$message({
              type: 'success',
              message: '保存成功',
            })
            this.close(true)
          })
      }
    },
  };
</script>

<template>
  <div>
    <div class="content">
      <div class="box">
        <div class="box-body form-horizontal">
          <div class="form-group ">
            <label class="col-md-2 control-label">渠道名称：</label>
            <div class="col-md-6">
              {{ details.game?details.game.game_name:'' }}
            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">渠道负责人：</label>
            <div class="col-md-6">
              {{ details.development?details.development.name:'' }}
            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">游戏合同：</label>
            <div class="col-md-6">
              <p>{{ details.development?details.development.name:'' }}</p>
              <p class="control_p_color">共{{ 22 }}款游戏，其中有{{ 7 }}款合同我签订<router-link to="/home/channelContract/channelContractA">查看详情</router-link></p>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">未对账月份：</label>
            <div class="col-md-6">
              <p> 1.云端 2017-04 2.云端 2017-03 3.有量 2017-01</p>
              <p class="control_p_color">共{{ 3 }}个月未对账</p>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">最近回款</label>
            <div class="col-md-6">
              <el-table
                class="table table-bordered table-hover"
                :data="items"
                border
                stripe
                style="width: 100%">
                <el-table-column
                  prop="body_my"
                  label="回款日期"
                  min-width="100">
                  <template scope="scope">
                    <p class="max_widths">2017-04-01</p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="issue"
                  label="金额"
                  min-width="120">
                  <template scope="scope">
                    <p class="max_widths">600</p>
                  </template>
                </el-table-column>
              </el-table>
              <p class="control_p_color">仅显示最近5次回款</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style type="text/css" scoped>
  .control_p{
    width: 84px;
    padding-right: 0;
  }
  .control-labels{
    padding-top: 0px;
    margin-bottom: 0;
    text-align: right;
  }
  .control-label{
    padding-top: 0px;
    width: 167px;
  }
  .control_p_color{
    color: #bdbdbd;
  }
</style>
<script type="text/ecmascript-6">
  import Multiselect from 'vue-multiselect'
  import {mapState} from 'vuex'
  import FileUploader from '../public/FileUploader.vue'
  import datepicker from 'vue-date'
  import utils from '../../publicjs/utils'
  import Ladder from './ladder/Ladder.vue'

  export default {
    components: {
      datepicker,
      FileUploader,
      Multiselect,
      Ladder,
    },
//    computed: {
//      ...mapState({
//        mapinfo: ({userInfo}) => userInfo.shareData,
//      }),
//    },
    props: ['editId', 'readonly', 'flag'],
    data: () => {
      return {
        time: [],
        file_id: 0,
        ladders: [],
        selectContractStatus: null,
        contractStatus: [],
        selectExpress1: null,
        selectExpress2: null,
        Express: [],
        items: [],
        selectedBodyMy: null,

        bodyMy: [
          {id: 1, name: "云端"},
          {id: 2, name: "有量"},
        ],
        showExpress1: false,
        showExpress2: false,
        number1: '',
        number2: '',
        desc: '',
        details: {},
      }
    },
    methods: {
      close(needRefresh = false){
        this.$emit('close', needRefresh)
      },
      //检查数据合法性
      check: function () {
        if (!this.selectedBodyMy) {
          return "请选择我方主体"
        }
        if (this.time[0]==null || isNaN(this.time[0].getTime())) {
          return "请选择签订日期"
        }
        if (!this.selectContractStatus) {
          return "请选择合同状态"
        }
        if(this.showExpress1){
          if (!this.selectExpress1) {
            return "请选择快递信息1快递方式"
          }
          if(!this.number1){
            return "请输入快递信息1快递单号"
          }
        }
        if(this.showExpress2){
          if (!this.selectExpress2) {
            return "请选择快递信息2快递方式"
          }
          if(!this.number2){
            return "请输入快递信息2快递单号"
          }
        }

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

//        let errInfo2 = Ladder.methods.valid(this.ladders)
//        if (errInfo2) {
//          this.$message({
//            type: 'warning',
//            message: errInfo2
//          })
//          return
//        }

        let Express={
          express_id1: this.selectExpress1 ? this.selectExpress1 : 0,
          number1: this.number1,
          express_id2: this.selectExpress2 ? this.selectExpress2 : 0,
          number2: this.number2,
        }

        let post = utils.buildPostParams({
          id: this.details.id,
          company_type: this.flag=="cp" ? 0 : 1,
          state: this.selectContractStatus,
          "ladders|json": this.ladders,
          desc: this.desc,
          body_my: this.selectedBodyMy,
          "file_id|number": this.file_id,
          "end_time|timeToStamp": this.time[1],
          "begin_time|timeToStamp": this.time[0],
          express: Express
        })

        let url = '/contract/' + this.details.id

        this.$http.put(url, post)
          .then((r) => {
            this.$message({
              message: "修改成功",
              type: 'success'
            });
            this.close(true)
//            this.reset()
//            this.$router.push({path:'/home/mgt/mgta'})
          })
      },
      //获取合同状态列表
      getContractStatusList:function () {
        var url = '/types/?query=type%3A10'
        this.$http.get(url)
          .then((res) => {
            this.contractStatus = res.body
          })
      },
      //获取快递信息列表
      getExpressList:function () {
        var url = '/types/?query=type%3A9'
        this.$http.get(url)
          .then((res) => {
            this.Express = res.body
          })
      },
      load(){
        this.reset()
        this.getExpressList()
        this.getContractStatusList()
        if (this.editId != 0) {
          this.getOne(this.editId);
        }
      },
      reset(){
        this.time = []
        this.ladders = []
        this.selectContractStatus = null
        this.selectExpress1 = null
        this.selectExpress2 = null
        this.selectedBodyMy = null
        this.number1 = ''
        this.number2 = ''
      },
      getOne(id) {
        let url = "/contract/" + id + "?flag=" + this.flag;
        this.$http.get(url)
          .then((res) => {
            this.details = res.body
            this.selectedBodyMy = this.details.body_my
            this.time = [
              util.parseDate(this.details.begin_time),
              util.parseDate(this.details.end_time)
            ]
            this.selectContractStatus = this.details.state
            this.file_id = this.details.file_id
            this.desc = this.details.desc
//            this.ladders = this.details.ladder_front

            if(this.details.express.id){
              this.showExpress1 = this.details.express.express_id1 ? true : false
              this.showExpress2 = this.details.express.express_id2 ? true : false

              this.selectExpress1 = this.details.express.express_id1 ? this.details.express.express_id1 : null
              this.number1 = this.details.express.number1 ? this.details.express.number1 : ''
              this.selectExpress2 = this.details.express.express_id2 ? this.details.express.express_id2 : null
              this.number2 = this.details.express.number2 ? this.details.express.number2 : ''
            }

            if(this.flag == "cp"){
              let gameId = this.details.game_id

              let query = util.buildGetParams({
                game_id: gameId,
              })
              let url = "/ladder/cp?" + query
              this.$http.get(url)
                .then((res) => {
                  this.ladders = res.body

                  if(this.ladders.length === 0){
                    this.ladders = this.details.ladder_front
                  }
  //          this.ladders[0].time = this.time
                })
            }else if(this.flag == "qd"){
              let channelCode = this.details.channel_code
              let gameId = this.details.game_id

              let query = util.buildGetParams({
                channel_code: channelCode,
                game_id: gameId,
              })
              this.$http.get("/ladder/channel?" + query)
                .then((res) => {
                  this.ladders = res.body
                  if (this.ladders==null || this.ladders.length==0){
                    this.ladders = this.details.ladder_front
                  }
                })
            }


          })
      },
    },
    created: function () {
//      if (this.mapinfo.id == undefined) {
//        window.location.href = document.referrer;
//      }
//      this.getContractStatusList()
//
//      this.file_id = this.mapinfo.file_id
//      this.selectContractStatus = this.mapinfo.state
////      this.selectContractStatus.status = this.mapinfo.Status
//
//      this.selectedBodyMy =_.find(this.bodyMy,{'id':this.mapinfo.body_my})

    },
    mounted: function () {

      this.load()

    },
    watch: {
      editId(){
        this.load()
      },
      selectContractStatus(){
        if(this.selectContractStatus==152){
          this.showExpress1 = true
          this.showExpress2 = false
//          this.getExpressList()
        }else if(this.selectContractStatus==153){
          this.showExpress1 = true
          this.showExpress2 = true
//          this.getExpressList()
        }else{
          this.showExpress1 = false
          this.showExpress2 = false
        }
      },
    }
  };
</script>

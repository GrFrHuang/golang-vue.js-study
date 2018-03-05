<template>
  <div>
    <div id="edit_h">
      <div class="situation row" id="gname">
        <label class="times_contracts">游戏名称:</label>
        <div class="col-md-5 times_contract times_contracty">
          {{ gameDetails.game_name }}
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">game_id:</label>
        <div class="col-md-5 times_contract times_contracty">
          {{ gameDetails.game_id }}
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">游戏来源:</label>
        <div class="col-sm-10 times_contract times_contracty">
          {{ gameDetails.source == 0 ? '' : gameDetails.game_source.name }}
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts"><span class="redSign">*</span>接入游戏:</label>
        <div class="col-md-10 times_contract ">
          <el-select v-model="selectedGameAll" :clearable="true"
                     :disabled="readonly?readonly:gameDetails.game_id>0?true:false"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in gameAll"
              :label="item.game_name"
              :value="item.game_id">
            </el-option>
          </el-select>
        </div>
      </div>
      <!--我方主体-->
      <div class="situation row">
        <label class="times_contracts"><span class="redSign">*</span>我方主体:</label>
        <div class="col-md-10 times_contract ">
          <el-select v-model="selectedBodyMy" :clearable="true" :disabled="readonly"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in bodyMy"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="form-group row">
        <label class="times_contracts"><span class="redSign">*</span>接入时间:</label>
        <div class="col-sm-5">
          <div class="input-group date col-sm-3">
            <div class="input-group-addon">
              <i class="fa fa-calendar"></i>
            </div>
            <el-date-picker
              v-model="importTime" :disabled="readonly"
              placeholder="选择接入时间">
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">接入状态:</label>
        <div class="col-md-5 times_contract times_contracty">
          {{ gameDetails.access == null ? "待上架" : gameDetails.access.state == 1 ? "上架中" : "已下架" }}
        </div>
      </div>
      <div class="form-group row">
        <label class="times_contracts"><span class="redSign">*</span>首发时间:</label>
        <div class="col-sm-5">
          <div class="input-group date">
            <div class="input-group-addon">
              <i class="fa fa-calendar"></i>
            </div>
            <el-date-picker
              v-model="publishTime" :disabled="readonly"
              placeholder="选择首发时间">
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts"><span class="redSign">*</span>类型：</label>
        <div class="col-md-10 times_contract">
          <el-select v-model="selectedGameTypes" :clearable="true" :disabled="readonly"
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
        <label class="times_contracts"><span class="redSign">*</span>合作方式：</label>
        <div class="col-md-10 times_contract">
          <el-select v-model="selectedCooperations" :clearable="true" :disabled="readonly"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in cooperations"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">研发：</label>
        <div class="col-md-10 times_contract">

          <el-select v-model="selectedDevelopments" :clearable="true" :disabled="readonly"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in developments"
              :label="item.company_name"
              :value="item.company_id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts"><span class="redSign">*</span>发行：</label>
        <div class="col-md-10 times_contract">

          <el-select v-model="selectedIssues" :clearable="true" :disabled="readonly"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in issues"
              :label="item.company_name"
              :value="item.company_id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="row">
        <label class="times_contracts">保量政策：</label>
        <div class="col-md-10 times_contract">
          <input class="form-control" type="text" v-model="quantityPolicy" :readonly="readonly"
                 placeholder="首发3日新增500+"/>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">工会政策：</label>
        <div class="col-md-10 times_contract">

          <el-select v-model="selectedSociatys" :clearable="true" :disabled="readonly"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in sociatys"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="situation row ">
        <label class="times_contracts"><span class="redSign">*</span>阶梯:</label>
        <div class="col-md-8">
          <ladder v-model="ladders" :defaultTime="time" :readonly="readonly"></ladder>
        </div>
      </div>
      <div class="row">
        <label class="times_contracts">备注：</label>
        <div class="col-md-10 times_contract">
          <textarea class="form-control" rows="3" placeholder="请备注 ..." v-model="remarks"
                    :readonly="readonly"></textarea>
        </div>
      </div>
      <div class="form-group " v-if="editId">
        <label class="col-sm-2 control-label">操作日志</label>
        <div class="col-sm-10">
          <operate-log :keyLabel="operateLabel" :page="26" :dataId="editId" :rand="rand"></operate-log>
        </div>
      </div>
      <div class="row ">
        <div class="col-md-10 div_p_btn">
          <p>
            <button class="btn btn-default btn_B col-md-4" v-if="gameDetails.game_id" @click="put" :disabled="readonly">
              保存
            </button>
            <button class="btn btn-default btn_B col-md-4" v-else="" @click="put" :disabled="readonly">接入</button>
            <button class="btn btn-default btn_F col-md-4 col-md-offset-1" @click="close(false)">关闭</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<style type="text/css">
  .times_contracts {
    width: 102px;
    float: left;
    text-align: right;
    margin-top: 7px;
  }

  .input-group {
    width: 100%;
  }
</style>
<style scoped>
  .el-date-editor.el-input {
    width: 100%;
  }

  .times_contracty {
    margin-top: 7px;
  }
</style>
<script>
  import utils from '../../publicjs/utils'
  import datepicker from 'vue-date'
  import Ladder from './ladder/Ladder.vue'
  import OperateLog from "../public/OperateLog";

  export default {
    components: {
      utils,
      datepicker,
      Ladder,
      'operate-log': OperateLog,
    },
    props: ['editId', 'rand', 'readonly'],
    data() {
      return {

        id: 0,//传入id
        games: [{game_id: -1, game_name: "不接入"}],
        selectedGameTypes: null,    //游戏类型
        gameTypes: [],
        selectedCooperations: null, //合作方式
        cooperations: [],
        selectedDevelopments: null, //研发商
        developments: [],
        selectedIssues: null,   //发行商
        issues: [],
        quantityPolicy: '', //保量政策
        selectedSociatys: null, //公会政策
        sociatys: [],
        gameDetails: [], //当前游戏详情
        remarks: '', //备注（阶梯分成）
        importTime: [],
        publishTime: [],
        ladders: [],
        time: -1,
        selectedBodyMy: null,//我方主体
        bodyMy: [
          {id: 1, name: "云端"},
          {id: 2, name: "有量"}
        ],
        selectedGameAll: null,
        gameAll: [],
        selectedGameSource: null,    //游戏来源
        gameSource: [],
        operateLabel: {
          BodyMy: ['我方主体', (i) => {
            let v = _.find(this.bodyMy, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          ImportTime: ['接入时间', (i) => {
            return util.stampToTime(i)
          }],
          PublishTime: ['首发时间', (i) => {
            return util.stampToTime(i)
          }],
          GameType: ['类型', (i) => {
            let v = _.find(this.gameTypes, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          Cooperation: ['合作方式', (i) => {
            let v = _.find(this.cooperations, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          Development: ['研发商', (i) => {
            let v = _.find(this.developments, (ii) => {
              return ii.company_id === i
            })
            return v ? v.company_name : ''
          }],
          Issue: ['发行商', (i) => {
            let v = _.find(this.issues, (ii) => {
              return ii.company_id === i
            })
            return v ? v.company_name : ''
          }],
          QuantityPolicy: '保量政策',
          SociatyPolicy: ['工会政策', (i) => {
            let v = _.find(this.sociatys, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          Ladders: ['阶梯分成', i => -10086],
          Remarks: '备注',
          GameId: ['接入状态', (i) => {
            return i > 0 ? '已接入' : ''
          }],
        },
      }
    },
    methods: {
      getGameAllList: function () {
        var url = '/game/gameAll?gameName=' + this.gameDetails.game_name
        this.$http.get(url)
          .then((res) => {
            this.gameAll = res.body
            this.selectedGameAll = this.gameDetails.game_id
          })
      },
      //获取游戏类型列表
      getGameTypeList: function () {
        var url = '/types/?query=type%3A1'
        this.$http.get(url)
          .then((res) => {
            this.gameTypes = res.body
            this.selectedGameTypes = this.gameDetails.game_type
          })
          .catch((err) => {
            context.error = err.data
          })
      },
      //获取合作方式列表
      getCooperationList: function () {
        var url = '/types/?query=type%3A2/'
        this.$http.get(url)
          .then((res) => {
            this.cooperations = res.body
            this.selectedCooperations = this.gameDetails.cooperation
          })
      },
      //获取研发商列表
      getDevelopmentList: function () {
        var url = '/developCompany/companyname/'
        this.$http.get(url)
          .then((res) => {
            this.developments = res.body
            this.selectedDevelopments = this.gameDetails.development
          })
      },
      //获取发行商列表
      getIssueList: function () {
        var url = '/distributionCompany/companyname/'
        this.$http.get(url)
          .then((res) => {
            this.issues = res.body
            this.selectedIssues = this.gameDetails.issue
          })
      },
      //获取公会政策列表
      getSociatylist: function () {
        var url = '/types/?query=type%3A5/'
        this.$http.get(url)
          .then((res) => {
            this.sociatys = res.body
            this.selectedSociatys = this.gameDetails.sociaty_policy
          })
          .catch((err) => {
            context.error = err.data
          })
      },
      //获取要编辑游戏的信息
      getGame(hasId) {
        let id = hasId

        let query = util.buildGetParams({
          "ids": id,
          "flag": 'jr',
        })
        var url = '/game/result?' + query
        this.$http.get(url)
          .then((res) => {
            this.gameDetails = res.body.data[0]
          })
      },
      //保存游戏接入修改
      put() {
        let errInfo = this.check()
        if (errInfo) {
          this.$message({
            type: 'warning',
            message: errInfo
          })
          return
        }

        let body = {
          game_name: this.gameDetails.game_name,
          game_id: this.selectedGameAll,
          "import_time|timeToStamp": this.importTime,
          "publish_time|timeToStamp": this.publishTime,
          game_type: this.selectedGameTypes,
          cooperation: this.selectedCooperations,
          development: this.selectedDevelopments ? this.selectedDevelopments : 0,
          issue: this.selectedIssues,
          quantity_policy: this.quantityPolicy,
          sociaty_policy: this.selectedSociatys,
          "ladders|json": this.ladders,
          body_my: this.selectedBodyMy,
          remarks: this.remarks,
          switch: 1
        }

        let post = utils.buildPostParams(body)

        let url = '/game/';
        if (this.gameDetails.game_id) {
          url = url + 'GameAccessUpdate/' + this.gameDetails.id;
        } else {
          url = url + 'gameAccess/' + this.gameDetails.id;
        }

        this.$http.put(url, post)
          .then((r) => {
            this.$message({
              type: 'success',
              message: this.gameDetails.game_id ? '修改成功' : '接入成功',
            })
            this.close(true)
            this.$router.push({path: '/home/gameAccess'})
          })
      },
      //关闭弹出框
      close(needRefresh = false) {
        this.$emit('close', needRefresh)
      },
      //load 加载editId
      load() {
        this.id = this.editId
        if (this.id != 0) {
          this.getGame(this.id)
        }
      },
      //检查数据是否合法
      check: function () {
        if (!this.selectedBodyMy) {
          return "请选择我方主体"
        }
        if (utils.timeToStamp(this.importTime) == 0) {
          return "请输入合理的接入时间"
        }

        if (utils.timeToStamp(this.publishTime) == 0) {
          return "请输入合理的首发时间"
        }

        if (!this.selectedGameTypes) {
          return "请选择游戏类型"
        }

        if (!this.selectedGameAll) {
          return "请选择需要接入的游戏"
        }

        if (!this.selectedCooperations) {
          return "请选择合作方"
        }

        if (!this.selectedIssues) {
          return "请选择发行商"
        }

        if (this.ladders == null || this.ladders.length == 0) {
          return "请输入阶梯数据"
        } else {
          for (let i = 0; i < this.ladders.length; ++i) {
            if (this.ladders[i].ratio != 0 || this.ladders[i].slotting_fee != 0) {
            }
            else {
              return "请输入合理的阶梯数据"
            }
          }
        }
        return ""
      },
    },
    watch: {
      rand() {
        this.load()
      },
      gameDetails() {
        this.getGameTypeList();
        this.getCooperationList();
        this.getDevelopmentList();
        this.getIssueList();
        this.getSociatylist();
        this.getGameAllList();

        this.selectedBodyMy = this.gameDetails.body_my
        this.quantityPolicy = this.gameDetails.quantity_policy
        this.remarks = this.gameDetails.remarks
        if (this.gameDetails.import_time == undefined) {
          this.importTime = ''
        } else {
          this.importTime = utils.stampToTime(this.gameDetails.import_time)
        }
        if (this.gameDetails.publish_time == undefined) {
          this.publishTime = ''
        } else {
          this.publishTime = utils.stampToTime(this.gameDetails.publish_time)
        }
        this.ladders = this.gameDetails.ladder_front
      }
    },
    mounted: function () {
      this.load();
    }
  };
</script>

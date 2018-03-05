<!--运营准备编辑-->
<template>
  <table id="pre_operation_edit_form" cellpadding="1" cellspacing="1" bordercolor="black">
    <tr>
      <td class="td_clm1 zh3"> 游戏名称：</td>
      <td class="zh3" width="40%">
        <span id="pre_operation_edit_gamename">{{gameName}}</span>
      </td>
      <td width="20%"></td>
    </tr>
    <tr>
      <td class="td_clm1">渠道情况：</td>
      <td class="td_checkbox_container">
        <div class="checkbox_container_label">总渠道数：
          <span id="pro_edit_channelcount" class="keyword">{{allGameChannelList == null ? 0 : allGameChannelList.length}}</span>
        </div>
        <div v-if="allGameChannelList">
          <el-tag class="role-tag" v-for="perm in allGameChannelList">
            {{ perm.name}}
          </el-tag>
        </div>
      </td>
    </tr>
    <tr>
      <td class="td_clm1">礼包情况：</td>
      <td class="td_checkbox_container">
        <div class="checkbox_container_label">已铺渠道数：
          <span id="pro_edit_confirmcount" class="keyword">
          {{GiftChannelList == null ? 0 : GiftChannelList.length}}</span></div>
        <el-select v-model="GiftChannelList" :clearable="true" :disabled="readonly"
                   multiple filterable placeholder="请选择">
          <el-option
            v-for="item in allGameChannelList"
            :key="item.cp"
            :label="item.name"
            :value="item.cp">
          </el-option>
        </el-select>
      </td>
    </tr>
    <tr class=" tr_margin">
      <td class="td_clm1 ">运营方：</td>
      <td class="times_contract">
        <div>
          <el-select v-model="selectedIssues" :clearable="true" :disabled="readonly"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in issues"
              :label="item.company_name"
              :value="item.company_id">
            </el-option>
          </el-select>
        </div>
      </td>
      <td></td>
    </tr>
    <tr class=" tr_margin">
      <td class="td_clm1">运营人：</td>
      <td class="times_contract">
        <div>
          <el-select v-model="selectedOperatorPerson" :clearable="true" :disabled="readonly"
                     multiple filterable placeholder="请选择">
            <el-option
              v-for="item in operatorPersons"
              :key="item.id"
              :label="item.nickname"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </td>
      <td></td>
    </tr>
    <tr>
      <td class="td_clm1">操作日志：</td>
      <td class="times_contract" colspan="2">
        <div class="form-group " v-if="editId">
          <div class="col-sm-10">
            <operate-log :keyLabel="operateLabel" :page="30" :dataId="editId" :rand="rand"></operate-log>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td></td>
      <td>
        <button type="button" class="btn btn-default" :disabled= disabl @click="put">保 存</button>
        <button type="button" class="btn btn-default" @click="close(false)">返	回</button>
      </td>
    </tr>
  </table>
</template>

<script>
  import utils from '../../../../publicjs/utils'
  import OperateLog from "../../../public/OperateLog";
  export default {
    components: {
      'operate-log': OperateLog,
    },
    props: ['editId', 'gameId', 'rand', 'readonly'],
    data() {
      return {
        checkboxModel: [],
        operatorPersons: [],
        disabl: false,
        allGameChannelList: [], //已选择渠道列表
        GiftChannelList: [], //已发礼包渠道列表
        selectedOperatorPerson: [], //运营人
        selectedIssues: null,   //发行商
        issues: [],
        operatorDetails: {}, //运营详情
        gameName: "",
        operateLabel: {
          Operator: ['运营方', (i) => {
            let v = _.find(this.issues, (ii) => {
              return ii.company_id === i
            })
            return v ? v.company_name : ''
          }],
          OperatorPerson: ['运营人', (i) => {
            let peoples = JSON.parse(i)
            let operate = []
            for(let i in peoples){
              let v = _.find(this.operatorPersons, (ii) => {
                  return ii.id === peoples[i]
              })
              if(v){
                  operate.push(v.nickname)
              }
            }
            return operate.join(",")
          }],
          Gifts: ['礼包情况',i=>-10086],
        }
      }
    },
    methods: {
      //获取要编辑游戏的运营详情
      getGame: function () {
        let query = util.buildGetParams({
          "gameids": this.gameId,
          "flag": 2
        })
        var url = '/gameplan/?' + query
        this.$http.get(url)
          .then(({data}) => {
            this.operatorDetails = data.data[0]
            this.gameName = data.data[0].game.game_name
          })
      },
      init(){
        this.reset()
        this.getGame()
      },
      close(needRefresh = false){
        this.$emit('close', needRefresh)
      },
      reset(){
        this.gameName = ""
        this.selectedOperatorPerson = [] //运营人
        this.selectedIssues = null   //发行商
        this.issues = []
        this.operatorDetails = null //运营详情
        this.GiftChannelList = []
        this.allGameChannelList = []
      },
      //获取发行商列表
      getIssueList: function () {
        var url = '/distributionCompany/companyname/'
        this.$http.get(url)
          .then((res) => {
            this.issues = res.body
            this.selectedIssues = this.operatorDetails.operator
          })
      },
      //获取运营人列表
      getOperatorPersonlist: function () {
        var url = '/user/devment/10'
        this.$http.get(url)
          .then((res) => {
            this.operatorPersons = res.body
            let people = []
            for (let i in this.operatorDetails.yunyingpeoples) {
              let id = this.operatorDetails.yunyingpeoples[i].id
              if (id) {
                people.push(id)
              }
            }
            this.selectedOperatorPerson = people
          })
      },
      //获取游戏已发渠道列表
      getGameChannelList: function () {
        var url = '/gameplan/getAllChannelsByGameId?gameid=' + this.gameId
        this.$http.get(url)
          .then((res) => {
            if (res.body != null) {
              this.allGameChannelList = res.body
            }
          })
      },
      //获取游戏已发礼包渠道列表
      getGiftChannelList: function () {
        var url = '/gameplan/getGiftChannelsByGameId?gameid=' + this.gameId
        this.$http.get(url)
          .then((res) => {
            if (res.body != null) {
              let giftChannelList = []
              for (let i in res.body) {
                giftChannelList.push(res.body[i].cp)
              }
              this.GiftChannelList = giftChannelList
            }
          })
      },
      //保存游戏运营修改
      put() {
        if (this.disabl === false) {
          this.disabl = true
          setTimeout( () => {
            this.disabl = false
          }, 1500);
        }
        if (!this.selectedIssues || this.selectedOperatorPerson == null) {
          this.$message({
            message: "输入格式有误",
            type: 'warning'
          });
          return
        }

//        let gameChannels = []
//        if (this.allGameChannelList != null && this.allGameChannelList.length != 0) {
//          for (let i in this.allGameChannelList) {
//            gameChannels.push(this.allGameChannelList[i].channel_id)
//          }
//        }

        let giftChannels = []
        if (this.GiftChannelList != null && this.GiftChannelList.length != 0) {
          for (let i in this.GiftChannelList) {
            giftChannels.push(this.GiftChannelList[i])
          }
        }

        let yunyingids = []
        if (this.selectedOperatorPerson != null && this.selectedOperatorPerson.length != 0) {
          for (let i in this.selectedOperatorPerson) {
            yunyingids.push(this.selectedOperatorPerson[i])
          }
        }

        let body = {
          operator: this.selectedIssues,
          "operator_person|json": yunyingids,
//          channels: gameChannels.join(","),
          gifts: giftChannels.join(","),
          game_id: this.operatorDetails.game_id
        }

        let post = utils.buildPostParams(body)
        let url = '/gameplan/operatorPlan/' + this.operatorDetails.id;
        this.$http.put(url, post)
          .then((r) => {
            this.$message({
              type: 'success',
              message: '保存成功',
            })
            this.close(true)
          })
      },
    },
    watch: {
      operatorDetails(){
        if(!this.operatorDetails){
          return
        }
        this.getGameChannelList();

        this.getGiftChannelList();
        this.getIssueList();
        this.getOperatorPersonlist();
      },
      rand(){
        this.init()
      },
    },
    mounted: function () {
      this.init();
    }
  }
</script>


<style scoped>
  table tr td {
    border: 0px solid red;
  }

  td {
    vertical-align: middle;
  }

  td {
    font-family: "微软雅黑";
    font-size: 16px;
  }

  .td_clm1 {
    width: 10%;
    text-align: right;

  }

  .td_checkbox_container {
    vertical-align: top;
  }

  .checkbox_container {
    height: 300px;
    overflow-y: scroll;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 20px;

  }

  .keyword {
    font-size: 20px;
    font-style: italic;
    font-weight: bold;
    color: green;
  }

  .checkbox_container_label {
    width: 100%;
    text-align: left;

    margin: 10px;
    margin-left: 20px;
    padding-top: 30px;
    margin-bottom: 0;
  }

  #pre_operation_edit_form {
    border: 0;
    margin-left: 30px;
  }

  .zh3 {
    padding-top: 30px;
  }

  .form-control_name {
    width: 80%;
  }

  .tr_margin {
    border-top: 30px solid rgba(0, 0, 0, 0)
  }

  .btn-default {
    margin-top: 30px;
  }
</style>

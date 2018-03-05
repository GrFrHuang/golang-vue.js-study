<!--运营准备编辑-->
<template>
  <table id="pre_customer_service_edit_form" cellpadding="1" cellspacing="1" bordercolor="black">
    <tr>
      <td class="td_clm1 zh3">
        游戏名称：
      </td>
      <td class="zh3" width="40%">
        <span id="pre_customer_service_edit_gamename">{{gameName}}</span>
      </td>
      <td width="40%"></td>
    </tr>
    <tr>
      <td class="td_clm1">是否已拉组：</td>
      <td>
        <el-select style="margin:20px 0" v-model="selectedGroup" :clearable="true" :disabled="readonly"
                   filterable placeholder="请选择">
          <el-option
            v-for="item in group"
            :label="item.group"
            :value="item.id">
          </el-option>
        </el-select>
      </td>
    </tr>
    <tr v-if="selectedGroup==2">
      <td class="td_clm1">讨论组/QQ群：</td>
      <td class="">
        <textarea rows="4" v-model="groupName" :disabled="readonly"></textarea>
      </td>
    </tr>
    <tr>
      <td class="td_clm1">SDK接入情况：</td>
      <td class="">
        <el-select v-model="selectedsdks" :clearable="true" :disabled="readonly"
                   filterable placeholder="请选择">
          <el-option
            v-for="item in sdks"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </td>
    </tr>
    <tr>
      <td class="td_clm1">素材情况：</td>
      <td class="td_checkbox_container">
        <div class="checkbox_container_label">
          总渠道数：
          <span
                class="keyword">{{allGameChannelList==null?0:allGameChannelList.length}}</span>
          /已铺渠道数：
          <span class="keyword">
            {{allMaterialChannelList==null?0:allMaterialChannelList.length}}</span>
        </div>
        <el-select v-model="allMaterialChannelList" :clearable="true" :disabled="readonly"
                   multiple filterable placeholder="请选择">
          <el-option
            v-for="item in allGameChannelList"
            :label="item.name"
            :value="item.cp">
          </el-option>
        </el-select>
      </td>
    </tr>
    <tr>
      <td class="td_clm1">发包情况：</td>
      <td class="td_checkbox_container">
        <div class="checkbox_container_label">已铺渠道数：
          <span class="keyword">{{allPackageChannelList==null?0:allPackageChannelList.length}}</span>
        </div>
        <el-select v-model="allPackageChannelList" :clearable="true" multiple filterable :disabled="readonly" placeholder="请选择">
          <el-option
            v-for="item in allGameChannelList"
            :label="item.name"
            :value="item.cp">
          </el-option>
        </el-select>

      </td>
    </tr>
    <td class="td_clm1">测试情况：</td>
    <td class="td_checkbox_container">
      <div class="checkbox_container_label">已测试道数：
        <span class="keyword">{{allTestChannelList==null?0:allTestChannelList.length}}</span>
      </div>
      <el-select v-model="allTestChannelList" :clearable="true" multiple filterable :disabled="readonly" placeholder="请选择">
        <el-option
          v-for="item in allGameChannelList"
          :label="item.name"
          :value="item.cp">
        </el-option>
      </el-select>
    </td>
    <tr>
      <td class="td_clm1">操作日志：</td>
      <td class="times_contract" colspan="2">
        <div class="form-group " v-if="editId">
          <div class="col-sm-10">
            <operate-log :keyLabel="operateLabel" :page="31" :dataId="editId" :rand="rand"></operate-log>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td></td>
      <td>
        <button type="button" class="btn btn-default" :disabled= disabl @click="put">保 存</button>
        <button type="button" class="btn btn-default" @click="close(false)">返 回</button>
      </td>
      <td></td>
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
        allChecked: false,
        gameName: '',
        disabl: false,
        allGameChannelList: [], //游戏渠道列表
        allPackageChannelList: [],  //游戏已发包渠道列表
        allTestChannelList: [],  //游戏已测包渠道列表
        allMaterialChannelList: [],  //游戏已发素材渠道列表
        customerDetails: {},  //游戏上线准备客服详情
        selectedsdks: null,
        selectedGroup: null,//拉组情况

        sdks: [],  //sdk接入状态

        group: [
          {id: 1, group: "否"},
          {id: 2, group: "是"}],
        groupName: '',
        operateLabel: {
          Group: '是否拉组',
          SDKStatus: ['SDK接入状态', (i) => {
            let v = _.find(this.sdks, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          Materials: ['素材情况',i=>-10086],
          Packages: ['发包情况',i=>-10086],
          Tests: ['测试情况',i=>-10086],
        }
      }
    },
    methods: {
      checkedAll: function () {
        var _this = this;
        if (this.allChecked) {
          _this.checkboxModel = [];

        } else {
          _this.checkboxModel = [];
          _this.checkboxData.forEach(function (item) {
            _this.checkboxModel.push(item.id);
          });
        }

      },
      //获取要编辑游戏的运营详情
      getGame: function () {
          let query = util.buildGetParams({
          "gameids": this.gameId,
          "flag": 3
        })
        var url = '/gameplan/?' + query
        this.$http.get(url)
          .then(({data}) => {
            this.customerDetails = data.data[0]
            this.gameName = data.data[0].game.game_name
            if (this.customerDetails.group === "否") {
//              this.selectedGroup = _.find(this.group, {'id': 0})
              this.selectedGroup = 1
            } else {
//              this.selectedGroup = _.find(this.group, {'id': 1})
              this.selectedGroup = 2
              this.groupName = this.customerDetails.group
            }
          })
      },
      init(){
        this.reset()
        this.getGame()
      },
      reset(){
        this.gameName = ""
        this.groupName = ''
        this.selectedsdks = null
        this.allGameChannelList = []
        this.allPackageChannelList = []
        this.allTestChannelList = [] //运营详情
        this.allMaterialChannelList = []
        this.customerDetails = null
        this.selectedGroup = null
      },
      close(needRefresh = false){
        this.$emit('close', needRefresh)
      },
      //获取SDK接入状态
      getSDK: function () {
        var url = '/types/?query=type%3A7'
        this.$http.get(url)
          .then((res) => {
            this.sdks = res.body
//            this.selectedsdks = _.find(this.sdks, {'id': this.customerDetails.SDK_status})
            this.selectedsdks = this.customerDetails.SDK_status
          })
      },
      //获取游戏所有渠道列表
      getGameChannelList: function () {
        var url = '/gameplan/getAllChannelsByGameId?gameid=' + this.gameId
        this.$http.get(url)
          .then((res) => {
            if (res.body !== null) {
              this.allGameChannelList = res.body
            }
          })
      },
      //获取游戏已发包渠道列表
      getPackageChannelList: function () {
        let url = '/gameplan/getPackageChannelsByGameId?gameid=' + this.gameId;
        this.$http.get(url)
          .then((res) => {
            if (res.body !== null) {
              let pac = []
              for (let i in res.body) {
                pac.push(res.body[i].cp)
              }
              this.allPackageChannelList = pac
            }
          })
      },
      //获取游戏已测包渠道列表
      getTestChannelList: function () {
        var url = '/gameplan/getTestChannelsByGameId?gameid=' + this.gameId
        this.$http.get(url)
          .then((res) => {
            if (res.body != null) {
              let test = []
              for (let i in res.body) {
                test.push(res.body[i].cp)
              }
              this.allTestChannelList = test
            }
          })
      },
      //获取游戏已发素材渠道列表
      getMaterialChannelList: function () {
        var url = '/gameplan/getMaterialChannelsByGameId?gameid=' + this.gameId
        this.$http.get(url)
          .then((res) => {
            if (res.body != null) {
              let material = []
              for (let i in res.body) {
                material.push(res.body[i].cp)
              }
              this.allMaterialChannelList = material
            }
          })
      },
      check: function () {
        if (!this.selectedGroup){
          return "请选择是否拉组"
        }
        if (this.selectedGroup == 2 && !this.groupName){
          return "请输入讨论组/QQ群"
        }
        if (!this.selectedsdks) {
          return "请选择SDK接入状态"
        }
        return ""
      },
      //保存游戏客服修改
      put() {
        if (this.disabl === false) {
          this.disabl = true
          setTimeout( () => {
            this.disabl = false
          }, 1500);
        }
        let errInfo = this.check()
        if(errInfo){
          this.$message({
            type:'warning',
            message: errInfo
          })
          return
        }

        let materialChannels = []
        if (this.allMaterialChannelList != null && this.allMaterialChannelList.length != 0) {
          for (let i in this.allMaterialChannelList) {
            materialChannels.push(this.allMaterialChannelList[i])
          }
        }

        let packageChannels = []
        if (this.allPackageChannelList != null && this.allPackageChannelList.length != 0) {
          for (let i in this.allPackageChannelList) {
            packageChannels.push(this.allPackageChannelList[i])
          }
        }

        let testChannels = []
        if (this.allTestChannelList != null && this.allTestChannelList.length != 0) {
          for (let i in this.allTestChannelList) {
            testChannels.push(this.allTestChannelList[i])
          }
        }

        let group = "否"
        if (this.selectedGroup == 2) {
          group = this.groupName
        }

        let body = {
          group: group,
          SDK_status: this.selectedsdks,
          materials: materialChannels.join(","),
          packages: packageChannels.join(","),
          tests: testChannels.join(","),
          game_id: this.customerDetails.game_id
        }

        let post = utils.buildPostParams(body)
        let url = '/gameplan/customerPlan/' + this.customerDetails.id
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
    watch: {
      customerDetails(){
        if(!this.customerDetails){
          return
        }
        this.getGameChannelList();
        this.getPackageChannelList();
        this.getTestChannelList();
        this.getMaterialChannelList();
        this.getSDK();
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
  }

  textarea {

    margin-left: 20px;
    margin-top: 5px;
    margin-bottom: 20px;
    width: 300px;

  }

  #pre_customer_service_edit_form {
    border: 0;
    margin-left: 30px;
  }

  .zh3 {
    padding-top: 30px;
  }

  .form-control_name {
    width: 80%;
  }

  .btn-default {
    margin-top: 30px;
  }

  .multiselect {
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>

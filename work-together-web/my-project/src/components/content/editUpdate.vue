<script src="../../main.js"></script>
<template>
  <div>
    <div id="edit_h">
      <h3>编辑游戏更新</h3>
      <div class="situation row">
        <label class="times_contracts">游戏名称:</label>
        <div class="col-sm-3 times_contract times_contracty">
          {{ gameName }}
        </div>
      </div>
      <!--<div class="row">-->
      <!--<div class=" col-sm-3 times_contract">-->
      <!--<div class="flow_list_d">-->
      <!--<div class="dowebok_zz" id="gname">-->
      <!--<span>游戏名称：{{ gameName }}</span>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <div class="situation row">
        <label class="times_contracts">更新时间:</label>
        <div class="col-sm-3 times_contract times_contracty">
          <div class="input-group date">
            <div class="input-group-addon">
              <i class="fa fa-calendar"></i>
            </div>
            <el-date-picker
              v-model="updateTime"
              placeholder="选择更新时间">
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">更新类型:</label>
        <div class="col-sm-3 times_contract">
          <!--<multiselect v-model="selectedType" tag-placeholder="Add this as new tag" placeholder="请选择"-->
          <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
          <!--label="type" track-by="id" :options="types" :multiple="false" :taggable="false">-->
          <!--</multiselect>-->
          <el-select v-model="selectedType" :clearable="true"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in types"
              :label="item.type"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="situation row">
        <label class="times_contracts">更新版本:</label>
        <div class="col-sm-3 times_contract">
          <el-input v-model="version" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">VersionCode:</label>
        <div class="col-sm-3 times_contract">
          <el-input v-model="versionCode" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">游戏包名:</label>
        <div class="col-sm-3 times_contract">
          <el-input v-model="packageName" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="dowebok  form-control_statesd">
        <label class="times_contracts">素材：</label>
        <el-button type="primary" icon="plus" @click=addMaterial></el-button>
        <div class="sbLiSong">
          <div>
            <el-row :gutter="24" style="margin-left:0px;" v-for="(item,index) in materials">
              <el-col :span="20">
                <file-uploader v-model="item.material"></file-uploader>
                <span v-if="item.material>0">文件编号：YUND-{{item.material}}</span>
              </el-col>
              <el-col :span="4">
                <el-button style="margin-top: 0px;" type="primary" icon="minus"
                           @click="materials.splice(index,1)"></el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="dowebok  form-control_statesd">
        <label class="times_contracts">游戏ICON：</label>
        <el-button type="primary" icon="plus" @click=addIcon></el-button>
        <div class="sbLiSong">
          <div>
            <el-row :gutter="24" style="margin-left:0px;" v-for="(item,index) in icons">
              <el-col :span="20">
                <file-uploader v-model="item.icon" work_type="image"></file-uploader>
                <span v-if="item.icon>0">文件编号：YUND-{{item.icon}}</span>
              </el-col>
              <el-col :span="4">
                <el-button style="margin-top: 0px;" type="primary" icon="minus"
                           @click="icons.splice(index,1)"></el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">渠道情况：</label>
        <div class=" col-sm-3 times_contract">
          <span>更新渠道数：{{selectedUpdate==null?0:selectedUpdate.length}}</span>
          <!--<multiselect v-model="selectedUpdate" tag-placeholder="Add this as new tag" placeholder="请选择"-->
          <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除" :hide-selected="true"-->
          <!--label="name" track-by="channel_id" :options="canSelectedChannels" :multiple="true"-->
          <!--:taggable="false">-->
          <!--</multiselect>-->
          <el-select v-model="selectedUpdate" :clearable="true"
                     multiple filterable placeholder="请选择">
            <el-option
              v-for="item in canSelectedChannels"
              :key="item.cp"
              :label="item.name"
              :value="item.cp">
            </el-option>
          </el-select>
          <span>不更新渠道数：{{selectedNotUpdate==null?0:selectedNotUpdate.length}}</span>
          <!--<multiselect v-model="selectedNotUpdate" tag-placeholder="Add this as new tag" placeholder="请选择"-->
          <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除" :hide-selected="true"-->
          <!--label="name" track-by="channel_id" :options="canSelectedChannels" :multiple="true"-->
          <!--:taggable="false">-->
          <!--</multiselect>-->
          <el-select v-model="selectedNotUpdate" :clearable="true"
                     multiple filterable placeholder="请选择">
            <el-option
              v-for="item in canSelectedChannels"
              :key="item.cp"
              :label="item.name"
              :value="item.cp">
            </el-option>
          </el-select>
          <span>终止合作渠道数：{{selectedStop==null?0:selectedStop.length}}</span>
          <!--<multiselect v-model="selectedStop" tag-placeholder="Add this as new tag" placeholder="请选择"-->
          <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除" :hide-selected="true"-->
          <!--label="name" track-by="channel_id" :options="canSelectedChannels" :multiple="true"-->
          <!--:taggable="false">-->
          <!--</multiselect>-->
          <el-select v-model="selectedStop" :clearable="true"
                     multiple filterable placeholder="请选择">
            <el-option
              v-for="item in canSelectedChannels"
              :key="item.cp"
              :label="item.name"
              :value="item.cp">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">备注:</label>
        <div class="col-sm-3 times_contract">
          <el-input v-model="remarks" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-5 div_p_btn">
          <p>
            <button class="btn btn-default btn_B col-sm-3" @click="post">保存</button>
            <button class="btn btn-default btn_F col-sm-3 col-md-offset-1" @click="back">返回</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<style type="text/css" scoped>
  .dowebok_zz {
    margin-bottom: 0 !important;
  }

  #edit_h > div {
    margin-left: 35px;
    padding-bottom: 30px;
  }

  #edit_h h3 {
    padding-bottom: 30px;
    margin-left: 20px;
    padding-top: 30px;
    margin-top: 0;
    margin-bottom: 0;
  }

  .sbLiSong > div {
    border: 1px solid black;
    margin-top: 30px;
    padding: 30px;
  }

  .times_contracty {
    margin-top: 7px;
  }

  .el-date-editor.el-input {
    width: 100%;
  }
</style>

<script>
  import Multiselect from 'vue-multiselect'
  import datepicker from 'vue-date'
  import utils from '../../publicjs/utils'
  import {Validator} from 'vee-validate'
  import FileUploader from '../public/FileUploader.vue'
  const validator = new Validator({
    gameid: 'required',
    updateTime: 'required|numeric|min:10',
    type: 'required',
    version: 'required',
    versionCode: 'required',
    packageName: 'required',
    update: 'required',
    notUpdate: 'required',
    stop: 'required',
  });
  export default {
    components: {
      Multiselect,
      utils,
      FileUploader
    },
    data: function () {
      return {
        selectedGames: [],//游戏列表
        gameUpdates: [],
        updateTime: [],   //更新时间
        selectedType: [], //更新类型
        types: [{id: 1, type: '强更'}, {id: 2, type: '热更'}],
        version: '',      //版本
        versionCode: '',
        materials: [{material: 0}],      //素材
        icons: [{icon: 0}],          //icon
        packageName: '',  //游戏包名
        selectedUpdate: [],//更新渠道
        update: [],
        selectedNotUpdate: [],//不更新渠道
        notUpdate: [],
        selectedStop: [],  //终止合作渠道
        stop: [],
        channels: [],
        remarks: '',
        updateDetails: [],
        gameName: '',
      }
    },
    computed: {
      canSelectedChannels(){

        let allSelectedChannelIds = this.selectedUpdate.concat(this.selectedNotUpdate).concat(this.selectedStop)

        let temp = _.filter(this.channels, (item) => {
          return allSelectedChannelIds.indexOf(item.cp)==-1
        })

        return temp
      }
    },
    watch: {
      gameName(){
        this.getChannelsById(this.updateDetails.game_id);
      },
      channels(){
        // 由于在赋值selectedUpdate的时候canSelectedChannels 会变为空，
        // 导致el-option没有选项，导致初始化的时候，el-select 不能读取valve的label，导致不能显示label。
        // 这里延时,让el-select能读取到label
        this.$nextTick(()=>{
          this.selectedUpdate = _.map(this.updateDetails.update_channels, 'cp')
          this.selectedNotUpdate = _.map(this.updateDetails.not_update_channels, 'cp')
          this.selectedStop = _.map(this.updateDetails.stop_channels, 'cp')
        })
      }
    },
    mounted: function () {
      this.getUpdateDetails();
    },
    methods: {
      addMaterial: function () {
        if (this.materials.length <= 5) {
          this.materials.splice(0, 0,
            {material: 0}
          )
        }
      },
      addIcon: function () {
        if (this.icons.length <= 5) {
          this.icons.splice(0, 0,
            {icon: 0}
          )
        }
      },
      back: function () {
        this.$router.push({path: '/home/gameUpdate'})
      },
      //根据选择的游戏id，获取该游戏所有下发渠道
      getChannelsById(gameId) {
        let query = util.buildGetParams({
          "gameid": gameId
        })
        var url = '/gameupdate/getChannelsByGameId?' + query
        this.$http.get(url)
          .then((res) => {
//            this.selectedUpdate = []
//            this.selectedNotUpdate = []
//            this.selectedStop = []
            this.channels = _.map(res.body, (i) => {
              return {cp: i.cp, name: i.name}
            })
          })
      },
      //获取当前游戏的更新详情
      getUpdateDetails: function () {
        let id = this.$route.query.id;

        let query = util.buildGetParams({
          "gameids": id,
        })
        var url = '/gameupdate/?' + query

        this.$http.get(url)
          .then((res) => {
            this.updateDetails = res.body.data[0]

            this.gameName = this.updateDetails.game.game_name
            this.updateTime = utils.stampToTime(this.updateDetails.game_update_time)
            this.selectedType = _.find(this.types, {'id': this.updateDetails.update_type})
            this.version = this.updateDetails.version
            this.versionCode = this.updateDetails.version_code
            this.packageName = this.updateDetails.package_name
            this.remarks = this.updateDetails.remark

            let materials = JSON.parse(this.updateDetails.material)
            if (Object.keys(materials).length >= 1) {
              this.materials.splice(0, 1)
              for (let i in materials) {
                this.materials.push({material: materials[i]},)
              }
            }

            let icons = JSON.parse(this.updateDetails.icon)
            if (Object.keys(icons).length >= 1) {
              this.icons.splice(0, 1)
              for (let i in icons) {
                this.icons.push({icon: icons[i]},)
              }
            }
          })
      },
      //检查数据合法性
      check: function () {
        if (!validator.validate('updateTime', utils.timeToStamp(this.updateTime))) {
          return "请选择更新时间"
        }
        if (!validator.validate('type', this.selectedType)) {
          return "请选择更新类型"
        }
        if (!validator.validate('version', this.version)) {
          return "请输入更新版本"
        }
        if (!validator.validate('versionCode', this.versionCode)) {
          return "请输入VersionCode"
        }
        if (!validator.validate('packageName', this.packageName)) {
          return "请输入游戏包名"
        }
        if (!this.selectedUpdate) {
          this.selectedUpdate = []
        }
        if (!this.selectedNotUpdate) {
          this.selectedNotUpdate = []
        }
        if (!this.selectedStop) {
          this.selectedStop = []
        }
        if (!this.channels) {
          this.channels = []
        }
        if (this.selectedUpdate.length + this.selectedNotUpdate.length + this.selectedStop.length != this.channels.length) {
          return "渠道选择有误"
        }
        return ""
      },
      //添加游戏更新
      post() {
        let errInfo = this.check()
        if (errInfo) {
          this.$message({
            type: 'warning',
            message: errInfo
          })
          return
        }

        let update_channel = []
        if (this.selectedUpdate != null && this.selectedUpdate.length != 0) {
          for (let i in this.selectedUpdate) {
            update_channel.push(this.selectedUpdate[i])
          }
        }
        let not_update_channel = []
        if (this.selectedNotUpdate != null && this.selectedNotUpdate.length != 0) {
          for (let i in this.selectedNotUpdate) {
            not_update_channel.push(this.selectedNotUpdate[i])
          }
        }
        let stop_channel = []
        if (this.selectedStop != null && this.selectedStop.length != 0) {
          for (let i in this.selectedStop) {
            stop_channel.push(this.selectedStop[i])
          }
        }

        let materials = []
        for (let i in this.materials) {
          if (this.materials[i].material != 0) {
            materials.push(this.materials[i].material)
          }
        }

        let icons = []
        for (let i in this.icons) {
          if (this.icons[i].icon != 0) {
            icons.push(this.icons[i].icon)
          }
        }

        let body = {
          game_id: parseInt(this.selectedGames.game_id),
          "game_update_time|timeToStamp": this.updateTime,
          update_type: this.selectedType.id,
          version: this.version,
          version_code: this.versionCode,
          package_name: this.packageName,
          "material|json": materials,
          "icon|json": icons,
          "update_channel|json": update_channel,
          "not_update_channel|json": not_update_channel,
          "stop_channel|json": stop_channel,
          remark: this.remarks,
        }

        let post = utils.buildPostParams(body)

        let url = '/gameupdate/' + this.updateDetails.id;
        this.$http.put(url, post)
          .then((r) => {
            this.$message({
              type: 'success',
              message: '保存成功',
            }),
              this.$router.push({path: '/home/gameUpdate'})
          })
      }
    },

  };
</script>

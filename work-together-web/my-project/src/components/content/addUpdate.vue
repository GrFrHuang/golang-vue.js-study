<template>
  <div>
    <div id="edit_h">
      <!--<h3>游戏更新</h3>-->
      <div class="situation row">
        <label class="times_contracts">*&nbsp;&nbsp;游戏名称:</label>
        <div class="col-sm-8 times_contract times_contracty">
          <el-select v-model="selectedGames" :clearable="true"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in gameUpdates"
              :label="item.game_name"
              :value="item.game_id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="form-group row">
        <label class="times_contracts">*&nbsp;&nbsp;更新时间:</label>
        <div class="col-sm-8">
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
        <label class="times_contracts">*&nbsp;&nbsp;更新类型:</label>
        <div class="col-sm-8 times_contract times_contracty">
          <el-select v-model="selectedType" :clearable="true"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in types"
              :label="item.type"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">*&nbsp;&nbsp;更新版本:</label>
        <div class="col-sm-8 times_contract times_contracty">
          <input class="form-control input-lg" type="text" v-model="version"
                 placeholder="请输入版本"/>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">*&nbsp;&nbsp;VersionCode:</label>
        <div class="col-sm-8 times_contract times_contracty">
          <input class="form-control input-lg" type="text" v-model="versionCode"
                 placeholder="请输入VersionCode"/>
        </div>
      </div>
      <div class="situation row">
        <label class="times_contracts">*&nbsp;&nbsp;游戏包名:</label>
        <div class="col-sm-8 times_contract times_contracty">
          <input class="form-control input-lg" type="text" v-model="packageName"
                 placeholder="请输入包名"/>
        </div>
      </div>
      <div class="dowebok  form-control_statesd">
        <label>素材：</label>
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
        <label>游戏ICON</label>
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
        <label class="times_contracts">*&nbsp;&nbsp;渠道情况:</label>
        <div class="col-sm-8 times_contract times_contracty">
          <span>更新渠道数：{{selectedUpdate==null?0:selectedUpdate.length}}</span>
          <el-select v-model="selectedUpdate" filterable multiple placeholder="请选择">
            <el-option
              v-for="item in canSelectedChannels"
              :key="item.cp"
              :label="item.name"
              :value="item.cp">
            </el-option>
          </el-select>
          <span>不更新渠道数：{{selectedNotUpdate==null?0:selectedNotUpdate.length}}</span>
          <el-select v-model="selectedNotUpdate" :clearable="true"
                     filterable multiple placeholder="请选择">
            <el-option
              v-for="item in canSelectedChannels"
              :key="item.cp"
              :label="item.name"
              :value="item.cp">
            </el-option>
          </el-select>
          <span>终止合作渠道数：{{selectedStop==null?0:selectedStop.length}}</span>
          <el-select v-model="selectedStop" :clearable="true" :disabled="true"
                     filterable multiple placeholder="请选择">
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
        <div class="col-sm-8 times_contract times_contracty">
          <input class="form-control input-lg" type="text" v-model="remarks"
                 placeholder="请输入备注"/>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-5 div_p_btn">
          <p>
            <button class="btn btn-default btn_B col-sm-3" :disabled= disabl @click="post">保存</button>
            <button class="btn btn-default btn_F col-sm-3 col-md-offset-1" @click="close(false)">关闭</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<style type="text/css">
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
</style>

<script>
  import datepicker from 'vue-date'
  import utils from '../../publicjs/utils'
  import FileUploader from '../public/FileUploader.vue'

  export default {
    components: {
      utils,
      FileUploader
    },
    props: ["isShowAddForm"],
    data: function () {
      return {
        selectedGames: [],//游戏列表
        gameUpdates: [],
        updateTime: '',   //更新时间
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
        disabl: false,
      }
    },
    computed: {
      canSelectedChannels(){
        let allSelectedChannel = this.selectedUpdate.concat(this.selectedNotUpdate).concat(this.selectedStop)

//        return this.channels
        let temp = _.filter(this.channels, (item) => {
          if (_.find(allSelectedChannel, (i) => {
              return i == item.cp
            })) {
            return false
          }

          return true
        })

        return temp
      }
    },
    watch: {
      selectedGames(){
        if(this.selectedGames){
          this.getChannelsById(this.selectedGames);
        }
      },
      isShowAddForm(){
        if(this.isShowAddForm){
          this.getGameSelectList();
        }
      }
    },
    mounted: function () {
      this.getGameSelectList();
    },
    methods: {
      close(needRefresh = false){
        this.$emit('close', needRefresh)
      },
      reset(){
        this.selectedGames = ''
        this.gameUpdates = []
        this.updateTime = ''
        this.selectedType = ''
        this.version = ''
        this.versionCode = ''
        this.packageName = ''
        this.materials = []
        this.icons = []
        this.selectedUpdate = []
        this.selectedNotUpdate = []
        this.selectedStop = []
      },
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
      //获取添加游戏游戏名列表
      getGameSelectList: function () {
        var url = '/game/select/gameUpdate' //游戏更新
        this.$http.get(url)
          .then((res) => {
            this.gameUpdates = res.body
          })
      },
      //根据选择的游戏id，获取该游戏所有下发渠道
      getChannelsById(gameId) {
        let query = util.buildGetParams({
          "gameid": gameId
        })
        var url = '/gameupdate/getChannelsByGameId?' + query
        this.$http.get(url)
          .then((res) => {
            this.selectedUpdate = []
            this.selectedNotUpdate = []
            this.channels = res.body

            this.selectedStop = []
            setTimeout(()=>{
              for(let i in this.channels){
                if(!this.channels[i].cooperate_state || this.channels[i].cooperate_state!=1){
                  this.selectedStop.push(this.channels[i].cp)
                }
              }
            },10)

          })
      },
      //检查数据合法性
      check: function () {
        if (!this.selectedGames) {
          return "请选择游戏"
        }
        if (!this.updateTime) {
          return "请选择更新时间"
        }
        if (!this.selectedType) {
          return "请选择更新类型"
        }
        if (!this.version) {
          return "请输入更新版本"
        }
        if (!this.versionCode) {
          return "请输入VersionCode"
        }
        if (!this.packageName) {
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
      post () {
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
          game_id: parseInt(this.selectedGames),
          "game_update_time|timeToStamp": this.updateTime,
          update_type: this.selectedType,
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
        let url = '/gameupdate'
        this.$http.post(url, post)
          .then((r) => {
            this.$message({
              type: 'success',
              message: '保存成功',
            }),
            this.close(true)
            this.reset()
//              this.$router.push({path: '/home/gameUpdate'})
          })
      }
    },

  };
</script>

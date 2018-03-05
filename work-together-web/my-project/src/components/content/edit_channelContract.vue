<template>
  <div>
    <section class="content-header">
      <h1>
        渠道合同
        <small>对渠道合同进行编辑</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>渠道回款流</li>
        <li><i class="fa fa-dashboard"></i>合同管理</li>
        <li>
          <router-link to="/home/editChannelContract">修改渠道合同</router-link>
        </li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <div class="box-title">修改渠道合同</div>
        </div>
        <div class="box-body form-horizontal">
          <div class="form-group ">
            <label class="col-md-2 control-label">游戏名称</label>
            <div class="col-md-10">
              <input class="form-control" v-model="mapinfo.game.game_name" readonly/>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">渠道名称</label>
            <div class="col-md-10">
              <input class="form-control" v-model="mapinfo.channel.name" readonly="true"/>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">我方主体</label>
            <div class="col-md-8">
              <!--<multiselect v-model="selectedBodyMy" :options="bodyMy" placeholder="选择我方主体"-->
              <!--selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
              <!--label="name" track-by="id" :multiple="false" :taggable="false">-->
              <!--</multiselect>-->
              <el-select v-model="selectedBodyMy" :clearable="true"
                         filterable placeholder="请选择">
                <el-option
                  v-for="item in bodyMy"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">签订日期-终止日期</label>
            <div class="col-md-10">
              <el-date-picker
                v-model="time"
                type="daterange"
                :range="true"
                format="yyyy-MM-dd"
                placeholder="选择日期范围">
              </el-date-picker>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">合同状态</label>
            <div class="col-md-10">
              <!--<multiselect v-model="selectContractStatus" :options="contractStatus" label="status" track-by="id"-->
              <!--placeholder="合同" selectLabel="选择" selectedLabel="已选" deselectLabel="移除"-->
              <!--:multiple="false" :taggable="false">-->
              <!--</multiselect>-->
              <el-select v-model="selectContractStatus" :clearable="true"
                         filterable placeholder="请选择">
                <el-option
                  v-for="item in contractStatus"
                  :label="item.status"
                  :value="item">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="form-group ">
            <label class="col-md-2 control-labels">快递信息1</label>
            <div class="col-md-10">
              <div class="row">
                <p class="col-md-2 control_p">合同状态</p>
                <p class="col-md-10"> 111111</p>
              </div>
              <div class="row">
                <p class="col-md-2 control_p">快递方式</p>
                <p class="col-md-10 ">
                  <el-select v-model="selectContractStatus" :clearable="true"
                             filterable placeholder="请选择">
                    <el-option
                      v-for="item in contractStatus"
                      :label="item.status"
                      :value="item">
                    </el-option>
                  </el-select>
                </p>
              </div>
              <div class="row">
                <p class="col-md-2 control_p">快递单号</p>
                <p class="col-md-10">
                  <input class="form-control" v-model="mapinfo.game.game_name"/>
                </p>
              </div>
            </div>
          </div>
          <div class="form-group ">
            <label class="col-md-2 control-labels">快递信息2</label>
            <div class="col-md-10">
              <div class="row">
                <p class="col-md-2 control_p">合同状态</p>
                <p class="col-md-10"> 111111</p>
              </div>
              <div class="row">
                <p class="col-md-2 control_p">快递方式</p>
                <p class="col-md-10 ">
                  <el-select v-model="selectContractStatus" :clearable="true"
                             filterable placeholder="请选择">
                    <el-option
                      v-for="item in contractStatus"
                      :label="item.status"
                      :value="item">
                    </el-option>
                  </el-select>
                </p>
              </div>
              <div class="row">
                <p class="col-md-2 control_p">快递单号</p>
                <p class="col-md-10">
                  <input class="form-control" v-model="mapinfo.game.game_name"/>
                </p>
              </div>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">上传合同</label>
            <div class="col-md-10">
              <file-uploader v-model="file_id"></file-uploader>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">阶梯分成</label>
            <div class="col-md-10">
              <!--分成列表-->
              <ladder v-model="ladders" :defaultTime="time"></ladder>

            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label">备注</label>
            <div class="col-md-10">
              <textarea class="form-control" rows="3" placeholder="备注" v-model="mapinfo.desc"></textarea>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-md-2 control-label"></label>
            <div class="col-md-10">
              <button class="btn btn-primary" @click="postData()">保存</button>
              <button class="btn btn-default" @click="$router.go(-1)">返回</button>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>
<style rel="stylesheet/less" lang="less" scoped>
.control_p{
  width: 84px;
  padding-right: 0;
}
  .control-labels{
    padding-top: 0px;
    margin-bottom: 0;
    text-align: right;
  }
</style>

<script type="text/ecmascript-6">
  import Multiselect from 'vue-multiselect'
  import {mapState} from 'vuex'
  import FileUploader from '../public/FileUploader.vue'
  import datepicker from 'vue-date'
  import Ladder from './ladder/Ladder.vue'

  //  console.log(Ladder)

  export default {
    components: {
      datepicker,
      FileUploader,
      Multiselect,
      Ladder,
    },
    computed: {
      ...mapState({
        mapinfo: ({userInfo}) => userInfo.shareData,
      }),
    },
    data: () => {
      return {
        time: [], // 时间范围
        file_id: 0,
        ladders: [],
        selectContractStatus: {},
        selectedBodyMy: {},

        contractStatus: [
          {id: 0, status: '未签订'},
          {id: 1, status: '已签订'},
          {id: 2, status: '已到期'},
          {id: 3, status: '进行中'},
          {id: 4, status: '无合作'}
        ],
        bodyMy: [
          {id: 1, name: "云端"},
          {id: 2, name: "有量"},
        ],

        isLoadingLadder: true,
      }
    },
    methods: {
      postData(){ // 保存
        if (!this.selectedBodyMy || !this.selectedBodyMy.id) {
          this.$message({
            type: 'warning',
            message: 'please choose body'
          })
          return
        }

        // 如果是未签订状况 可以不保存ladder
        if (this.selectContractStatus.id > 0) {
          let errInfo = Ladder.methods.valid(this.ladders)
          if (errInfo) {
            this.$message({
              type: 'warning',
              message: errInfo
            })
            return
          }
        }

        let post = util.buildPostParams({
          id: this.mapinfo.id,
          state: this.selectContractStatus.id,
          "ladders|json": this.ladders,
          desc: this.mapinfo.desc,
          body_my: this.selectedBodyMy.id,
          "file_id|number": this.file_id,
          "end_time|timeToStamp": this.time[1],
          "begin_time|timeToStamp": this.time[0],
        })
        let url = '/contract/' + this.mapinfo.id
        this.$http.put(url, post)
          .then((r) => {
            this.$message({
              message: "修改成功",
              type: 'success'
            });
            this.$router.push({path: '/home/channelContract/channelContractA'})
          })
      },
    },
    created: function () {
      this.file_id = this.mapinfo.file_id
      this.selectContractStatus.id = this.mapinfo.state
      this.selectContractStatus.status = this.mapinfo.Status

      this.selectedBodyMy = _.find(this.bodyMy, {'id': this.mapinfo.body_my})
    },
    mounted: function () {
      this.time = [
        util.parseDate(this.mapinfo.begin_time),
        util.parseDate(this.mapinfo.end_time)
      ]
      let channelCode = this.mapinfo.channel.cp
      let gameId = this.mapinfo.game.game_id

      let query = util.buildGetParams({
        channel_code: channelCode,
        game_id: gameId,
      })
      this.$http.get("/ladder/channel?" + query)
        .then(({data}) => {
          if (data==null || data.length==0){
            this.ladders = this.mapinfo.ladder_front
          }else {
            this.ladders = data
          }
        })
    },
    watch: {
      ladders(){
      }
    },
  };
</script>

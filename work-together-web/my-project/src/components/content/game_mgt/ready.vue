<template>
  <div>
    <!-- /.box-header -->
    <div class="box-body">
      <el-select v-model="selectedHeader" :clearable="true"
                 @change="showHeader" multiple placeholder="请选择">
        <el-option
          v-for="item in table_header"
          :key="item.id"
          :label="item.header_name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-table
        class="table table-bordered table-hover"
        :data="items"
        border
        stripe
        style="width: 100%">
        <el-table-column
          fixed
          prop="game_name"
          label="游戏名称"
          v-if="!table_header[0].state"
          min-width="140">
          <template scope="scope">
            <p class="max_widths">{{ scope.row.game==null?"":scope.row.game.game_name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="import_time"
          label="是否拉组"
          v-if="!table_header[1].state"
          min-width="100">
          <template scope="scope">
            <p class="max_widths">{{ scope.row.group }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="publish_time"
          label="SDK接入情况"
          v-if="!table_header[2].state"
          min-width="120">
          <template scope="scope">
            <p class="max_widths">{{ scope.row.sdk==null?"":scope.row.sdk.name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="lexing"
          label="总渠道数"
          v-if="!table_header[3].state"
          min-width="100">
          <template scope="scope">
            <p :style="{'text-decoration':scope.row.details.channels==null?'none':'underline'}"
               class="channels td__center max_widths" @click="getDetail(scope.row.game.game_name,scope.row.game_id)">{{
              scope.row.details.channels==null?"-":scope.row.details.channels }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="hezuo"
          label="礼包情况"
          v-if="!table_header[4].state"
          min-width="100">
          <template scope="scope">
            <p :style="{color:scope.row.details.channels>scope.row.details.gifs?'red':'black'}" class="td__center max_widths">{{
              scope.row.details.materials==null?"-":scope.row.details.gifs }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="yanfa"
          label="素材情况"
          v-if="!table_header[5].state"
          min-width="100">
          <template scope="scope">
            <p :style="{color:scope.row.details.channels>scope.row.details.materials?'red':'black'}" class="td__center max_widths">
              {{ scope.row.details.materials==null?"-":scope.row.details.materials }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="faxing"
          label="发包情况"
          v-if="!table_header[6].state"
          min-width="100">
          <template scope="scope">
            <p :style="{color:scope.row.details.channels>scope.row.details.packages?'red':'black'}" class="td__center max_widths">
              {{ scope.row.details.packages==null?"-":scope.row.details.packages }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="quantity_policy"
          label="测包情况"
          v-if="!table_header[7].state"
          min-width="100">
          <template scope="scope">
            <p :style="{color:scope.row.details.channels>scope.row.details.test?'red':'black'}" class="td__center max_widths">{{
              scope.row.details.test==null?"-":scope.row.details.test }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="gonghui"
          label="运营方"
          v-if="!table_header[8].state"
          min-width="160px">
          <template scope="scope">
            <p class="max_widths">{{ scope.row.yunying==null?"":scope.row.yunying.name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          prop="remarks"
          label="运营负责人"
          v-if="!table_header[9].state"
          min-width="120">
          <template scope="scope">
            <p class="max_widths">{{ scope.row.peoples==null?"":scope.row.peoples }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="user"
          label="游戏评级"
          v-if="!table_header[10].state"
          min-width="100">
          <template scope="scope">
            <p class="max_widths">{{ scope.row.ceping==null?"":scope.row.ceping.result }}</p>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          v-if="!table_header[11].state"
          min-width="100">
          <template scope="scope">
            <div>
              <el-tooltip class="item" effect="dark" content="评测报告(word)下载" placement="top-start">
                <a v-show="scope.row.ceping==null?'':scope.row.ceping.report_word" class="fa fa-download table_hoverse"
                   target="_blank"
                   :href="download(scope.row.ceping==null?'':scope.row.ceping.report_word)"></a>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="评测报告(excel)下载" placement="top-start">
                <a v-show="scope.row.ceping==null?'':scope.row.ceping.report_excel" class="fa fa-download table_hoverse"
                   target="_blank"
                   :href="download(scope.row.ceping==null?'':scope.row.ceping.report_excel)"></a>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="gameName + '---渠道概览'" v-model="dialogTableVisible">
        <el-table :data="gridData">
          <el-table-column label="序号" width="150" type="index"></el-table-column>
          <el-table-column property="name" label="渠道名称" width="200"></el-table-column>
          <el-table-column property="address" label="项目完成情况">
            <template scope="scope">
              <span :style="{color:scope.row.gift_status=='0'?'red':'black'}">礼包</span><span>/</span>
              <span :style="{color:scope.row.material=='0'?'red':'black'}">素材</span><span>/</span>
              <span :style="{color:scope.row.package_status=='0'?'red':'black'}">发包</span><span>/</span>
              <span :style="{color:scope.row.test=='0'?'red':'black'}">测包</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>
<style>
  .el-table th {
    text-align: center !important;
    background: #367fa9 !important;
  }

  .el-table th div {
    background: #367fa9 !important;
    color: white !important;
  }
</style>
<style scoped>
  .channels {
    cursor: pointer;
    color: #20a0ff;
  }

  td, th {
    text-align: center;
  }

  th {
    background: #367fa9;
    color: white;
  }
</style>
<script>
  export default {
    props: ['items', 'downloadUrl'],
    data: function () {
      return {
        parentMessage: 'Parent',
        gridData: [],
        dialogTableVisible: false,
        gameName: "",
        selectedHeader:[],
        table_header:[
          {
            id:0,
            header_name:"游戏名称",
            state:false
          },{
            id:1,
            header_name:"是否拉组",
            state:false
          },{
            id:2,
            header_name:"SDK接入情况",
            state:false
          },{
            id:3,
            header_name:"总渠道数",
            state:false
          },{
            id:4,
            header_name:"礼包情况",
            state:false
          },{
            id:5,
            header_name:"素材情况",
            state:false
          },{
            id:6,
            header_name:"发包情况",
            state:false
          },{
            id:7,
            header_name:"测包情况",
            state:false
          },{
            id:8,
            header_name:"运营方",
            state:false
          },{
            id:9,
            header_name:"运营负责人",
            state:false
          },{
            id:10,
            header_name:"游戏评级",
            state:false
          },{
            id:11,
            header_name:"操作",
            state:false
          }
        ],
      }
    },
    methods: {
      getDetail(gameName, gameId){
        this.gameName = gameName
        let query = util.buildGetParams({
          "gameid": gameId
        })
        var url = '/gameplan/getDetailsByGameId?' + query
        this.$http.get(url)
          .then((res) => {
            this.gridData = res.body
          })
        this.dialogTableVisible = true
      },
      showHeader: function () {
        for(let i in this.table_header){
          this.table_header[i].state = false
        }
        for(let i in this.selectedHeader){
          console.log(this.table_header[this.selectedHeader[i]])
          console.log(this.table_header)
          this.table_header[this.selectedHeader[i]].state = true
          console.log(this.table_header[this.selectedHeader[i]])
        }
      },
      download(fileId){
        return util.downloadFileUrl(fileId)
      },
    },
    mounted: function () {
      let selected = []
      this.selectedHeader= selected
    }
  }
</script>

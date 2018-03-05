<template>
  <div>

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
          prop="game_name"
          min-width="120"
          label="游戏名称"
          v-if="!table_header[0].state"
          >
          <template scope="scope">
            <p class="max_widths">{{ scope.row.game_name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="result_time"
          label="评测时间"
          min-width="140"
          v-if="!table_header[1].state"
          >
          <template scope="scope">
            <p class="max_widths">{{ scope.row.result_time | stampToTime }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="peoples"
          label="评测人"
          min-width="140"
          v-if="!table_header[2].state"
         >
          <template scope="scope">
            <p class="max_widths">{{ scope.row.peoples==null?"":scope.row.peoples }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="ceping"
          label="游戏评级"
          min-width="100"
          v-if="!table_header[3].state"
          >
          <template scope="scope">
            <p class="max_widths">{{ scope.row.ceping==null?"":scope.row.ceping.name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="grade"
          label="接入建议"
          min-width="120"
          v-if="!table_header[4].state"
          >
          <template scope="scope">
            <p class="max_widths">
              <span v-for="advise in scope.row.advises">
                <span v-if="advise.adv!=undefined">
                  <span v-if="advise.adv=='接入'" class="fa fa-check" style="color: green"
                        :title="advise.nickname + '的建议：接入'"></span>&nbsp;
                  <span v-if="advise.adv=='不接入'" class="fa fa-close" style="color: red"
                        :title="advise.nickname + '的建议：不接入'"></span>&nbsp;
                </span>
              </span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateinfo"
          label="更新人"
          min-width="120"
          v-if="!table_header[5].state"
          >
          <template scope="scope">
            <p class="max_widths" v-if="scope.row.update_user">{{ scope.row.update_user.nickname }} {{ scope.row.update_evaltime | stampToTime }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          v-if="!table_header[6].state"
          >
          <template scope="scope">
            <div class="result_report">
              <a class="fa fa-edit" @click="editDialog(scope.row)" title="编辑"></a>
              <a v-show="scope.row.result_report_word" class="fa fa-download table_hoverse" target="_blank"
                 :href="download(scope.row.result_report_word)" title="评测报告(word)下载"></a>&nbsp;&nbsp;
              <a v-show="scope.row.result_report_excel" class="fa fa-download table_hoverse" target="_blank"
                 :href="download(scope.row.result_report_excel)" title="评测报告(excel)下载"></a>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  <el-dialog
    :title="'游戏评测编辑'"
    v-model="isShowDialog"
    top="5%"
    size="large"
    :close-on-click-modal="false">
    <edit_evalgame :editId="editId" @close="onEditClose"></edit_evalgame>
  </el-dialog>
  </div>

</template>
<style>
  ._list_tab_btn {
    margin-bottom: 10px;
  }

  .result_report {
    text-align: center;
  }
  .max_widths {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
  }

  .max_widths:hover {
    text-overflow: inherit;
    overflow: visible;
    white-space: pre-line;
  }
</style>
<script>
  import edit_evalgame from '../editGameEvaluation_2.vue'

  export default {
    components:{
        edit_evalgame
    },
    props: ['items', 'downloadUrl'],
    data: function () {
      return {
        editId:0,//默认
        isShowDialog:false,//弹出框状态
        parentMessage: 'Parent',
        selectedHeader:[],
        table_header:[
          {
            id:0,
            header_name:"游戏名称",
            state:false
          },{
            id:1,
            header_name:"评测时间",
            state:false
          },{
            id:2,
            header_name:"评测人",
            state:false
          },{
            id:3,
            header_name:"游戏评级",
            state:false
          },{
            id:4,
            header_name:"接入建议",
            state:false
          },{
            id:5,
            header_name:"更新人",
            state:false
          },{
            id:6,
            header_name:"操作",
            state:false
          }
        ],
      }
    },
    methods: {
      download(fileId){
        return util.downloadFileUrl(fileId)
      },
      //编辑弹出框
      editDialog(row){
        this.isShowDialog=true
        this.editId=row.id
      },
      //编辑弹出框
      onEditClose(needRefresh){
          this.isShowDialog=false
          if(needRefresh){
            this.$router.push({path:'/home/GameEvaluation'})
          }
      },
      editGameEvaluation: function (id) {
        var data = {id: id}
        this.$store.commit('SET_SHAREDATA', data)
        this.$router.push({
          path: '/home/editGameEvaluation/?id=' + id
        })
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
      getGame: function () {
        var url = '/gameplan/'
        this.$http.get(url)
          .then((res) => {
            this.items = res.body
          })
          .catch((err) => {
            context.error = err.data
          })
      }
    },
    mounted: function () {
//      this.getGame();
      let selected = []
      this.selectedHeader= selected
    }
  }
</script>


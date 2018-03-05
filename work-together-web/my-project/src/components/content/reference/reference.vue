<template>
  <div>
    <!-- /.box-header -->
    <div class="box-body">

      <el-dialog title="高级账号" v-model="dialogVisible" size="tiny">
        <el-row :gutter="24" style="margin-left:0px;text-align: center">
          <el-col :span="12">账号</el-col>
          <el-col :span="12">密码</el-col>
        </el-row>
        <el-row :gutter="24" style="margin-left:0px;" v-for="number in numbers">
          <el-col :span="12">
            <el-input v-model="number.username" readonly="true"></el-input>
            <!--<el-button>复制</el-button>-->
          </el-col>
          <el-col :span="12">
            <el-input v-model="number.password" readonly="true"></el-input>
            <!--<el-button>复制</el-button>-->
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <el-table
        class="table table-bordered table-hover"
        :data="items"
        border
        stripe
        @sort-change="handleSort"
        :default-sort = "{prop: 'publish_time', order: 'descending'}"
        style="width: 100%">
        <el-table-column
          fixed
          prop="game_name"
          label="游戏名称"
          width="140">
          <template scope="scope">
            <p class="max_widthv">{{ scope.row.game_name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="publish_time"
          label="首发时间"
          sortable='custom'
          width="120">
          <template scope="scope">
            <p>{{ scope.row.publish_time | stampToTime }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="faxing"
          label="发行商"
          width="220">
          <template scope="scope">
            <p class="max_widths">{{ scope.row.faxing==null?"":scope.row.faxing.name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="lexing"
          label="游戏类型"
          width="220">
          <template scope="scope">
            <p>{{ scope.row.lexing==null?"":scope.row.lexing.name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP"
          width="80">
          <template scope="scope">
            <p>{{ scope.row.ip==1?"YES":"NO" }}</p>
          </template>
          <!---->
        </el-table-column>
        <el-table-column
          prop="star"
          label="明星代言"
          width="120">
          <template scope="scope">
            <p>{{ scope.row.star }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="budget"
          label="市场预算"
          width="100">
          <template scope="scope">
            <p>{{ scope.row.budget }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="package"
          label="测试包"
          width="140">
          <template scope="scope">
            <p class="max_widths">{{ scope.row.package }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="zip"
          label="测试数据截图"
          class="text-center"
          width="160">
          <template scope="scope">
            <p>
              <span v-for="id in parseJson(scope.row.picture)">
                <span v-if="id>0">
                  <a class="fa fa-download" :href="download(id)"></a>&nbsp;&nbsp;
                </span>
              </span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="account"
          label="高级账号"
          width="120">
          <template scope="scope">
            <p>
              <span v-if='scope.row.number!="[\":\"]"'>
                <el-button type="primary" @click="opendialog(scope.row.number)">查看</el-button>
              </span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
                prop="submitinfo"
                label="提测人"
                width="210">
          <template scope="scope">
            <p v-if="scope.row.user">{{ scope.row.user.nickname }}({{ scope.row.create_time | stampToTimeFull }})</p>
          </template>
        </el-table-column>
        <el-table-column
                prop="updateinfo"
                label="更新人"
                width="160">
          <template scope="scope">
            <p v-if="scope.row.update_refuser">{{ scope.row.update_refuser }}({{ scope.row.update_reftime | stampToTime }})</p>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template scope="scope">
            <el-button type="text" size="small"><span class="fa fa-edit table-hovers" @click=goDetails(scope.row.id)></span></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- /.box-body -->
  </div>
</template>
<style>
  ._list_tab_btn {
    margin-bottom: 10px;
  }

  .el-dialog__header {
    text-align: center;
  }

  #table_ids > .el-table__header-wrapper > table > thead > tr > th {
    text-align: center;
  }

  .el-button--primary {
    background-color: #3c8dbc !important;
  }
  .el-table--striped .el-table__body tr:nth-child(2n) td{
    background-color: #dddddd !important;
  }
</style>
<style scoped>
  .max_widths{
    max-width: 180px;
    overflow:hidden;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
    white-space:nowrap;
  }
  .max_widths:hover{
    text-overflow:inherit;
    overflow: visible;
    white-space: pre-line;
  }
  .max_widthv{
    max-width: 104px;
    overflow:hidden;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
    white-space:nowrap;
  }
  .max_widthv:hover{
    text-overflow:inherit;
    overflow: visible;
    white-space: pre-line;
  }
</style>
<script>

  export default {
    components: {
    },
    props: ['items', 'sortData'],

    data: function () {
      return {
        parentMessage: 'Parent',
        dialogTableVisible: false,
        dialogVisible: false,
        numbers: [],
        tableData: []
      }
    },

    methods: {
      opendialog: function (numbers) {
        this.numbers = []
        if (numbers != null) {
          let number = JSON.parse(numbers)
          for (let i in number) {
            this.numbers.push({username: number[i].split(":")[0], password: number[i].split(":")[1]})
          }
        }

        this.dialogVisible = true
      },
      parseJson(json) {
        if (json != null) {
          return JSON.parse(json)
        } else {
          return null
        }
      },
      goDetails: function (id) {
        var data = {id: id}
        this.$store.commit('SET_SHAREDATA', data)
        this.$router.push({path: '/home/editReference/?id=' + id})

      },
      download(fileId){
        return util.downloadFileUrl(fileId)
      },
      addgame: function () {
        this.$router.push({path: '/home/addreference'})
      },
      handleSort(obj) {
        this.sortData = obj
      },
    },
    mounted: function () {
    }
  }
</script>

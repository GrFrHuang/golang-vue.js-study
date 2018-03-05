<template>
  <div>
    <!-- /.box-header -->
    <div class="box-body">
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
          width="140">
          <template scope="scope">
            <p class="max_widthv">{{ scope.row.game_name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="import_time"
          label="接入时间"
          width="120">
          <template scope="scope">
            <p>{{ scope.row.import_time | stampToTime }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="publish_time"
          label="首发时间"
          width="120">
          <template scope="scope">
            <p>{{ scope.row.publish_time | stampToTime }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="lexing"
          label="类型"
          width="160">
          <template scope="scope">
            <p class="max_lexing">{{ scope.row.lexing==null?"":scope.row.lexing.name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="hezuo"
          label="合作方式"
          width="120">
          <template scope="scope">
            <p>{{ scope.row.hezuo==null?"":scope.row.hezuo.name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="yanfa"
          label="研发"
          width="220">
          <template scope="scope">
            <p class="max_widths">{{ scope.row.yanfa==null?"":scope.row.yanfa.name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="faxing"
          label="发行"
          width="220">
          <template scope="scope">
            <p class="max_widths">{{ scope.row.faxing==null?"":scope.row.faxing.name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="quantity_policy"
          label="保量"
          width="200">
          <template scope="scope">
            <p>{{ scope.row.quantity_policy }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="gonghui"
          label="公会"
          width="200">
          <template scope="scope">
            <p>{{ scope.row.gonghui==null?"":scope.row.gonghui.name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="备注"
          width="220">
          <template scope="scope">
            <p class="max_widths">{{ scope.row.remarks }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="user"
          label="接入人"
          width="100">
          <template scope="scope">
            <p>{{ scope.row.user==null?"":scope.row.user.nickname }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="ceping"
          label="状态"
          width="100">
          <template scope="scope">
            <p>
              <span v-if="scope.row.game_id==null">未接入</span>
              <span v-if="scope.row.game_id>0">已接入</span>
              <span v-if="scope.row.game_id==-1">不接入</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
                prop="updateinfo"
                label="更新人"
                width="100">
          <template scope="scope">
            <p>{{ scope.row.update_user==null?"":scope.row.update_user.nickname }} {{ scope.row.update_jrtime==null ? "" : scope.row.update_jrtime | stampToTime }}</p>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template scope="scope">
            <div class="result_report">
              <a class="fa fa-edit table-hovers" @click=goDetails(scope.row.id) title="编辑"></a>
            </div>
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
</style>
<style scoped>
  th {
    text-align: center;
    background: #367fa9 !important;
    color: white !important;
  }

  td {
    text-align: center;
  }

  .max_lexing {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
  }

  .max_lexing:hover {
    text-overflow: inherit;
    overflow: visible;
    white-space: pre-line;
  }
</style>
<script>
  export default {
    props: ['items', 'downloadUrl'],
    data: function () {
      return {
        parentMessage: 'Parent',
      }
    },
    methods: {
      goDetails: function (id) {
        var data = {id: id}
        this.$store.commit('SET_SHAREDATA', data)
        this.$router.push({
          path: '/home/editgameAccess/?id=' + id
        })
      },
      addgame: function () {
        this.$router.push({path: '/home/addgameAccess'})
      },
    },
    mounted: function () {
    }
  }
</script>

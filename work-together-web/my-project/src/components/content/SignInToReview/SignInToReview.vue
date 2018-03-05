<template>
  <div>
    <section class="content-header">
      <h1>
        绑定人脸
        <small>绑定签到人脸</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>绑定人脸</li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <!--<div class="box-header with-border">-->
        <!--<div class="col-md-10 form-horizontal">-->
        <!--<div class="form-group">-->
        <!--<div class="col-sm-12 margin__btm">-->
        <!--<label class="col-sm-2 control-label">游戏名称:</label>-->
        <!--<div class="col-lg-4 col-md-10 col-sm-10 ipt_jianjus">-->
        <!--<el-select v-model="selectedGames"-->
        <!--filterable-->
        <!--multiple-->
        <!--:multiple="true" :clearable="true" :filterable="true"-->
        <!--@change="doGetOrderList"-->
        <!--placeholder="请选择">-->
        <!--<el-option-->
        <!--v-for="item in games"-->
        <!--:label="item.game_name"-->
        <!--:value="item.id">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</div>-->
        <!--<label class="col-sm-2 control-label">首发时间:</label>-->
        <!--<div class="col-lg-4 col-md-10 col-sm-10 ipt_jianjus">-->
        <!--<el-date-picker-->
        <!--v-model="time" @change="doGetOrderList"-->
        <!--type="daterange"-->
        <!--:range="true"-->
        <!--format="yyyy-MM-dd"-->
        <!--align="right"-->
        <!--:picker-options="pickerOptions2"-->
        <!--placeholder="选择日期范围">-->
        <!--</el-date-picker>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <div class="_list_tab">
          <div class="box-body">
            <el-table
              v-loading="isLoading"
              element-loading-text="拼命加载中"
              class="table table-bordered table-hover"
              :data="personnelList"
              border
              stripe
              style="width: 100%">
              <el-table-column
                fixed
                prop="name"
                label="姓名"
                min-width="120">
              </el-table-column>
              <el-table-column
                prop="create_time"
                label="创建时间"
                sortable='custom'
                min-width="120">
                <template scope="scope">
                  <p class="max_widths">{{ scope.row.create_time | stampToTimeFull }}</p>
                </template>
              </el-table-column>

              <el-table-column
                prop="lexing"
                label="识别图片"
                min-width="120">
                <template scope="scope">
                  <a @click="onImgCropper(scope.row.path)"><img style="width:30px;height: 50px"
                                                                                     :src="scope.row.path"
                                                                                     alt=""></a>
                </template>
              </el-table-column>
              <el-table-column
                prop="hezuo"
                label="状态"
                min-width="120">
                <template scope="scope">
                  <p v-if="scope.row.status === 2">未审核</p>
                  <p v-else-if="scope.row.status === 1">审核通过</p>
                  <p v-else>拒绝通过</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="remarks"
                label="备注"
                min-width="120">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                min-width="100">
                <template scope="scope">
                  <div class="result_report">
                    <button v-if="scope.row.status === 2" class="btn btn-primary"
                            @click="changeInvoiceStatus(scope.row, 1)">通过
                    </button>
                    <button v-if="scope.row.status === 2" class="btn btn-error"
                            @click="onchangeInvoiceStatus(scope.row)">不通过
                    </button>
                    <button v-if="scope.row.status === 1" class="btn btn-error"
                            @click="onchangeInvoiceStatus(scope.row)">删除
                    </button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="box-footer">
            <!--<gameAccess :items="items" :downloadUrl="downloadUrl"></gameAccess>-->
            <Pagination v-show="pageInfo.total > pageInfo.limit"
                        @current-change="handleCurrentChange"
                        :current-page="pageInfo.currentPage"
                        :page-size="pageInfo.limit"
                        layout="prev, pager, next, jumper, total"
                        :total="pageInfo.total">
            </Pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="图片查看"
      :visible.sync="dialogVisible"
      size="tiny">
      <img style="width: 100%" :src="Img_url">
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">关 闭</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="请填写备注"
      size="tiny"
      :visible.sync="onputSignTo">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入备注内容"
        v-model="code.remarks">
      </el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="onputSignTo = false">取 消</el-button>
    <el-button type="primary" @click="changeInvoiceStatus(code, 3)">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    components: {},
    data: function () {
      return {
        personnelList: [],
        pageInfo: {
          currentPage: 1,
          limit: ENV.PAGE_SHOW_COUNT,
          offset: 0,
          total: 0,
        },
        code: '',
        picUrl: '',
        onputSignTo: false,
        isLoading: false,
        dialogVisible: false,
        Img_url: '',
        PERSONNEL_HOST_URL: ENV.PERSONNEL_HOST_URL,
      }
    },
    methods: {
      handleCurrentChange(currentPage) {
        let offset = util.buildOffsetByPage(currentPage, this.pageInfo.limit)
        this.pageInfo.offset = offset
        this.load(currentPage)
      },
      onImgCropper(v) {
        this.dialogVisible = true
        this.Img_url = v
      },
      onchangeInvoiceStatus(v) {
        this.onputSignTo = true
        this.code = v
      },
      load(page = 0) {
        if (page == 0) {
          this.pageInfo.offset = 0
        }
        this.isLoading = true
        let que = {
          "limit": this.pageInfo.limit,
          "offset": this.pageInfo.offset,
        }

        let query = util.buildGetParams(que)
        var url = '/face/'
        this.$http.get(url)
          .then((res) => {
            this.personnelList = res.body.data
            this.pageInfo.total = res.body.total
            this.isLoading = false
            for (let i in this.personnelList) {
              this.picUrl = util.buildFileUrl(this.personnelList[i].path)
              this.personnelList[i].path = this.picUrl
            }
          })
      },
      changeInvoiceStatus(v, status) {
        var url = '/face/' + v.uid
        if (status === 1) {
          this.$http.put(url + '?status=' + status)
            .then((res) => {
              console.log(res)
              this.load()
              this.$message.success('操作成功')
            }), (error) => {
            this.$message.error(error.body)
          }
        } else if (status === 3) {
          var onurl = ENV.DELETE_PERSONNEL_HOST_URL + '/face_auth/delete?uid=' + v.uid
          this.$http.get(onurl)
            .then((res) => {
            })
          this.$http.put(url + '?status=' + status + '&remarks=' + v.remarks)
            .then((res) => {
              console.log(res)
              this.load()
              this.$message.success('操作成功')
              this.onputSignTo = false
            }), (error) => {
            this.$message.error(error.body)
          }
        }

      },
    },
    mounted: function () {
      this.load()
    },
  }
</script>

<style scoped>

</style>

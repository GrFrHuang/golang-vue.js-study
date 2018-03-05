<template>
  <div>
    <div class=" form-horizontal">

      <div class="form-group ">
        <label class="col-sm-2 control-label">我方主体</label>
        <div class="col-sm-10">
          <el-radio-group v-model="form.body_my">
            <el-radio :label=1>云端</el-radio>
            <el-radio :label=2>有量</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="form-group ">
        <label class="col-sm-2 control-label">回款主体</label>
        <div class="col-sm-10">
          <el-select v-model="form.remit_company_id" :clearable="true"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in remitCompanies"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-2 control-label">回款时间</label>
        <div class="col-sm-10">
          <el-date-picker
            v-model="form.remit_time"
            type="datetime"
            align="right"
            :picker-options="pickerOptions1"
            placeholder="选择回款时间">
          </el-date-picker>
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-2 control-label">回款单</label>
        <div class="col-sm-10">
          <file-uploader v-model="form.file_id"></file-uploader>
        </div>
      </div>


      <!--<div class="form-group ">
        <label class="col-sm-2 control-label">回款单预览上传</label>
        <div class="col-sm-10">
          <file-uploader v-model="file_preview_id"></file-uploader>
        </div>
      </div>
-->
      <div class="form-group ">
        <label class="col-sm-2 control-label">回款金额</label>
        <div class="col-sm-10">
          <input class="form-control" v-model="form.amount" placeholder="请输入应回款金额"/>
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-2 control-label">回款人</label>
        <div class="col-sm-10">
          <el-select v-model="form.user_id" :clearable="true"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in users"
              :label="item.nickname"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-2 control-label">备注</label>
        <div class="col-sm-10">
          <textarea
            v-model="form.extend" class="form-control" rows="3"
            placeholder="请备注 ..."></textarea>
        </div>
      </div>

      <div class="form-group " v-if="editId">
        <label class="col-sm-2 control-label">操作日志</label>
        <div class="col-sm-10">
          <operate-log :keyLabel="operateLabel" :page="23" :dataId="editId" :rand="rand"></operate-log>
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-2 control-label"></label>
        <div class="col-sm-10">
          <button class="btn btn-primary" :disabled= disabl @click="post">保存</button>
          <button class="btn btn-default" @click="close(false)">返回</button>
        </div>
      </div>

    </div>
  </div>
</template>
<style>
</style>

<script type="text/ecmascript-6">
  import utils from '../../publicjs/utils'
  import FileUploader from '../public/FileUploader.vue'
  import {Pagination} from 'element-ui'
  import OperateLog from "../public/OperateLog";

  export default {
    components: {
      Pagination,
      FileUploader,
      'operate-log': OperateLog,
    },
    props: ['editId', 'isShowForm', 'rand'],

    data(){
      return {
        pickerOptions1: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        disabl: false,
        remitCompanies: [], // 全部回款主体
        users: [], // 全部结算人

        form: null,
        emptyForm: {
          user_id: null, // 回款人
          remit_company_id: null, // 回款主体
          remit_time: null, // 回款时间
          amount: null, // 回款金额
          extend: '', // 扩展
          file_id: 0,// 上传文件
          file_preview_id: 0, // 上传文件
          body_my: 1,// 我方主体
        },
        operateLog: [],
        pageInfo: {
          currentPage: 1,
          limit: 8,
          offset: 0,
          total: 0,
        },
        bodyMy: [{id: 1, name: "云端"},
          {id: 2, name: "有量"}],
        operateLabel: {
          BodyMy: ['我方主体', (i) => {
            let v = _.find(this.bodyMy, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          RemitTime:['回款时间', (i) => {
            return util.stampToTime(i)
          }],
          FileId: '回款单',
          Amount: '金额',
          Extend: '备注',
        },
      }
    },
    watch: {
      editId(){
        this.init()
      },
      isShowForm(){
        if(this.isShowForm){
          this.getOperateLog(this.editId);
        }
      }
    },
    methods: {
      post(){
        if (this.disabl === false) {
          this.disabl = true
          setTimeout( () => {
            this.disabl = false
          }, 1500);
        }
        let body = util.objectTransform(this.form, {
          remit_time: 'dateToTimestamp',
          file_id: 'number',
          amount: 'number',
          file_preview_id: 'number',
          update_remituserid: '-',
          update_remittime: '-',
        })
        if (!body.user_id) {
          this.$message({type: 'error', message: '请选择回款人'})
          return
        }
        if (!body.amount) {
          this.$message({type: 'error', message: '请填入金额'})
          return
        }

        let post = utils.buildPostParams(body)

        let url = '/remitaccount/'
        if (body.id) {
          // 编辑
          this.$http.put(url + body.id, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.close(true)
            })
        } else {
          this.$http.post(url, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.close(true)
              this.resetForm()
            })
        }

      },
      close(needRefresh = false){
        this.$emit('close', needRefresh)
      },
      resetForm(){
        this.form = _.cloneDeep(this.emptyForm)
      },
      init(){
        this.id = this.editId
        this.resetForm()

        if (this.id != 0) {
          this.getOne(this.id)
          this.getOperateLog(this.id);
        }

        this.getUser()
        this.getCompany()
      },
      getOne(id){
        let url = '/remitaccount/' + id
        this.$http.get(url)
          .then(({data}) => {
            this.form = util.objectTransform(data, {
              remit_time: 'timestampToDate',
            })
          })
      },
      getUser(){
        let url = '/user/devment/7'
        this.$http.get(url)
          .then(({data}) => {
            this.users = data

            this.operateLabel.UserId = ['回款人', (i) => {
              let v = _.find(this.users, (ii) => {
                return ii.id === i
              })
              return v ? v.nickname : ''
            }]
          })
      },
      getCompany(){
        let url = '/remitaccount/remitcompanies/'
        this.$http.get(url)
          .then(({data}) => {
            this.remitCompanies = data

            this.operateLabel.RemitCompanyId = ['回款主体', (i) => {
              let v = _.find(this.remitCompanies, (ii) => {
                return ii.id === i
              })
              return v ? v.name : ''
            }]
          })
      },
      getOperateLog(id, page = 0){
        if (page == 0) {
          this.pageInfo.offset = 0
        }
        let query = util.buildGetParams({
          "page": 6,
          "limit": this.pageInfo.limit,
          "offset": this.pageInfo.offset,
        })
        var url = '/operatelog/contract/' + id + '?' + query
        this.$http.get(url)
          .then((res) => {
            this.operateLog = res.body.data
            this.pageInfo.total = res.body.total

            for(let i in this.operateLog) {
              let operate = []
              let content = JSON.parse(this.operateLog[i].Content)
              let newContent = content.new

              if (newContent.BodyMy) {
                operate.push(this.operateLog[i].Action + "我方主体为" + (newContent.BodyMy == 1 ? "云端" : "有量"))
              }
              if (newContent.RemitCompanyId) {
                operate.push(this.operateLog[i].Action + "回款主体为" + _.find(this.remitCompanies, {'id': newContent.RemitCompanyId}).name)
              }
              if (newContent.RemitTime) {
                operate.push(this.operateLog[i].Action + "回款时间为" + util.stampToTime(newContent.RemitTime))
              }
              if (newContent.FileId) {
                operate.push(this.operateLog[i].Action + "回款单文件为" + newContent.FileId)
              }
              if (newContent.Amount) {
                operate.push(this.operateLog[i].Action + "回款金额为" + newContent.Amount)
              }
              if (newContent.UserId) {
                operate.push(this.operateLog[i].Action + "回款人为" + _.find(this.users, {'id': newContent.UserId}).nickname)
              }
              if (newContent.Extend) {
                operate.push(this.operateLog[i].Action + "备注为" + newContent.Extend)
              }
              this.operateLog[i].Log = operate.join(",")
            }
          })
      },
      handleCurrentChange3(currentPage) {
        let offset = util.buildOffsetByPage(currentPage, this.pageInfo.limit)
        this.pageInfo.offset = offset
        this.getOperateLog(this.editId, currentPage)
      },
    },
    created(){
      this.resetForm()
    },
    mounted() {
      this.init()
    },
  }
</script>



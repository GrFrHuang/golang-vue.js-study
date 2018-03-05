<template>
  <div>
    <div class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-2 control-label">我方主体</label>
        <div class="col-sm-10">
          <el-radio-group v-model="form.body_my">
            <el-radio :label=1>云端</el-radio>
            <el-radio :label=2>有量</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">发行商</label>
        <div class="col-sm-10">
          <el-select v-model="form.company_id" :clearable="true"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in companies"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">结算时间</label>
        <div class="col-sm-10 ">
          <el-date-picker
            v-model="form.settle_time"
            placeholder="选择结算时间">
          </el-date-picker>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">金额</label>
        <div class="col-sm-10">
          <input class="form-control" v-model="form.amount"/>
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-2 control-label">结算人:</label>
        <div class="col-sm-10">

          <el-select v-model="form.user_id" :clearable="true"
                     filterable placeholder="请选择结算人">
            <el-option
              v-for="item in users"
              :label="item.nickname"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>

      <!--暂时不需要上传-->
      <!--<div class="situation row">-->
      <!--<label class="times_contracts">结算单:</label>-->
      <!--<div class="col-sm-3 times_contract times_contracty">-->
      <!--<file-uploader v-model="fileId"></file-uploader>-->
      <!--</div>-->
      <!--</div>-->

      <!--<div class="situation row">-->
      <!--<label class="times_contracts">结算单预览图:</label>-->
      <!--<div class="col-sm-3 times_contract times_contracty">-->
      <!--<file-uploader v-model="filePreviewId"></file-uploader>-->
      <!--</div>-->
      <!--</div>-->

      <div class="form-group">
        <label class="col-sm-2 control-label">备注:</label>
        <div class="col-sm-10">
          <textarea
            class="form-control" rows="3"
            placeholder="请备注 ..." v-model="form.extend">
          </textarea>
        </div>
      </div>

      <div class="form-group " v-if="editId">
        <label class="col-sm-2 control-label">操作日志</label>
        <div class="col-sm-10">
          <operate-log :keyLabel="operateLabel" :page="25" :dataId="editId" :rand="rand"></operate-log>
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-2 control-label"></label>
        <div class="col-sm-10">
          <p>
            <button class="btn btn-primary " :disabled= disabl @click="post">保存</button>
            <button class="btn btn-default " @click="close(false)">返回</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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
    data() {
      return {
        form: null,
        emptyForm: {
          body_my: 1,//
          company_id: null,// 选中的发行商
          settle_time: null,// 时间范围
          amount: null,// 金额
          extend: '', // 扩展
          user_id: null,// 选择的结算人
        },
        disabl: false,
        companies: [], // 全部发行商选项
        users: [], // 全部结算人
        id: 0,// 编辑的id
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
          SettleTime:['结算时间', (i) => {
            return util.stampToTime(i)
          }],
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
        }
      }
    },
    created(){
      this.resetForm()
    },
    mounted() {
      this.init()
    },

    methods: {
      init(){
        this.id = this.editId
        this.resetForm()
        // 加载所有公司
        let url = '/settleaccount/companies/'
        this.$http.get(url)
          .then(({data}) => {
            this.companies = data

            this.operateLabel.CompanyId = ['发行商', (i) => {
              let v = _.find(this.companies, (ii) => {
                return ii.id === i
              })
              return v ? v.name : ''
            }]
          })

        // 加载结算部门人员
        url = '/user/devment/7'
        this.$http.get(url)
          .then(({data}) => {
            this.users = data

            this.operateLabel.UserId = ['结算人', (i) => {
              let v = _.find(this.users, (ii) => {
                return ii.id === i
              })
              return v ? v.nickname : ''
            }]
          })

        if (this.id) {
          this.getOne(this.id)
        }
      },
      close(needRefresh = false){
        this.$emit('close', needRefresh)
      },
      post(){ // 添加
        if (this.disabl === false) {
          this.disabl = true
          setTimeout( () => {
            this.disabl = false
          }, 1500);
        }
        let body = util.objectTransform(this.form, {
          amount: 'number',
          settle_time: 'dateToTimestamp',
        })

        if (!body.amount) {
          this.$message({type: 'error', message: 'amount error'})
          return
        }

        let post = util.buildPostParams(body)

        let url = '/settleaccount/'
        if (body.id) {
          this.$http.put(url + body.id, post)
            .then(({data}) => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.close(true)
            })
        } else {
          this.$http.post(url, post)
            .then(({data}) => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.resetForm()
              this.close(true)
            })
        }

      },
      resetForm(){
        this.form = _.cloneDeep(this.emptyForm)
      },
      getOne(id){
        let url = "/settleaccount/" + id;
        this.$http.get(url).then(({data}) => {
          this.form = util.objectTransform(data, {
            settle_time: 'timestampToDate',
            body_my:(v)=>{return v}
          })
        })
      },
    },
  }

</script>

<style scoped>
  .game-remove {
    color: #9c3328;
    cursor: pointer;
  }
</style>

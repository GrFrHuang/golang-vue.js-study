<template>
  <div>

    <div>
      <div id="resear">
        <div class="situation row contact_div">
          <label class="times_contracts">渠道名称:</label>
          <div class="col-sm-5 times_contract">
            <el-select v-model="form.channel_code" :clearable="true"
                       filterable placeholder="请选择" :disabled="form.id !== 0">
              <el-option
                v-for="item in channels"
                :label="item.name"
                :value="item.cp">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">公司名称:</label>
          <div class="col-sm-5 times_contract">
            <el-select v-model="form.company_id" :clearable="true"
                       filterable placeholder="请选择" :disabled="form.id !== 0">
              <el-option
                v-for="item in companies"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">平台名称:</label>
          <div class="col-sm-5 times_contract">
            <el-input v-model="form.platform_name" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">区域:</label>
          <div class="col-sm-5 times_contract">
            <el-input v-model="form.region" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">渠道属性:</label>
          <div class="col-sm-5 times_contract">
            <el-input v-model="form.properties" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">合作状态:</label>
          <div class="col-sm-5 times_contract">
            <el-select v-model="form.cooperate_state" :clearable="true"
                       filterable placeholder="请选择">
              <el-option
                v-for="item in cooperateState"
                :label="item.state"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">公司网站:</label>
          <div class="col-sm-5 times_contract">
            <el-input v-model="form.website" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">公司地址:</label>
          <div class="col-sm-5 times_contract">
            <el-input v-model="form.address" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">商务负责人:</label>
          <div class="col-sm-5 times_contract">
            <p> 云端:</p>
            <el-select v-model="form.yunduan_responsible_person" :clearable="true" filterable placeholder="请选择负责人">
              <el-option
                v-for="item in users"
                :label="item.nickname"
                :value="item.id">
              </el-option>
            </el-select>
            <span v-if="flagA">请及时更新商务负责人</span>
            <p> 有量:</p>
            <el-select v-model="form.youliang_responsible_person" :clearable="true" filterable placeholder="请选择负责人">
              <el-option
                v-for="item in users"
                :label="item.nickname"
                :value="item.id">
              </el-option>
            </el-select>
            <span v-if="flagB">请及时更新商务负责人</span>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">回款主体:</label>
          <div class="col-sm-5 times_contract">
            <el-select v-model="form.remit_company" filterable multiple placeholder="请选择公司">
              <el-option
                v-for="refund in companies"
                :key="refund.id"
                :label="refund.name"
                :value="refund.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="situation row contact_div">
          <div style="margin-bottom: 30px" v-for="(item,index) in form.contacts">
            <div class="situation row" style="margin-left: 0">
              <label class="times_contracts">公司联系人:</label>
              <div class="col-sm-5 times_contract">
                <el-input v-model="item.name" placeholder="请输入内容"></el-input>
                <el-button v-if="index==0" type="primary" icon="plus" @click=addTable></el-button>
                <el-button v-else type="primary" icon="minus" @click="form.contacts.splice(index,1)"></el-button>
              </div>
            </div>
            <div>
              <div class="el-table el-table--fit" style="width: 80%;margin-top: 30px; min-width: 538px">
                <table>
                  <tr id="tabl_bod" class="el-table__header">
                    <th width="250">职位</th>
                    <th width="300">邮箱</th>
                    <th width="155">电话</th>
                    <th width="142">QQ</th>
                    <th>微信</th>
                  </tr>
                  <tr class="el-table__body">
                    <td><input v-model="item.position" class="el-input__inner" type="text"></td>
                    <td><input v-model="item.email" class="el-input__inner" type="text"></td>
                    <td><input v-model="item.phone" class="el-input__inner" type="text"></td>
                    <td><input v-model="item.qq" class="el-input__inner" type="text"></td>
                    <td><input v-model="item.wechart" class="el-input__inner" type="text"></td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">备注:</label>
          <div class="col-sm-5 times_contract">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="form.desc">
            </el-input>
          </div>
        </div>
        <div class="situation row contact_div" v-if="editId">
          <label class="times_contracts">操作日志</label>
          <div class="col-sm-10">
            <operate-log :keyLabel="operateLabel" :page="36" :dataId="editId" :rand="rand"></operate-log>
          </div>
        </div>
        <div class="row contact_div">
          <div class="dowebok form-control_statesd">
            <p>
              <button class="btn btn-default btn_B col-sm-3" :disabled=disabl @click="submit()">保存</button>
              <button class="btn btn-default btn_F col-sm-3 col-md-offset-1" @click="close(false)">返回</button>
            </p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import OperateLog from "../public/OperateLog";

  export default {
    components: {
      'operate-log': OperateLog,
    },
    props: ['editId', 'rand', 'channel_code'],
    data() {
      return {
        form: null,
        disabl: false,
        emptyForm: {
          id: 0,
          remit_company: [], // 多个回款主体id
          properties: null,
          cooperate_state: 1,
          channel_code: null,
          yunduan_responsible_person: null,
          youliang_responsible_person: null,
          company_id: null,
          address: null,
          platform_name: null,
          region: null,
          website: null,
          desc: null,
          contacts: [
            {name: "", position: "", email: "", phone: "", qq: "", wechart: ""}
          ],
        },
        users: [],
        channels: [],
        companies: [],
        cooperateState: [
          {id: 1, state: "合作中"},
          {id: 2, state: "谈判中"},
          {id: 3, state: "终止合作"}],
        flagA: false,
        flagB: false,
        operateLabel: {
          CompanyId: ['公司名称', (i) => {
            let v = _.find(this.companies, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          ChannelCode: ['渠道名称', (i) => {
            let v = _.find(this.channels, (ii) => {
              return ii.cp === i
            })
            return v ? v.name : ''
          }],
          PlatformName: '平台名称',
          Region: '区域',
          Properties: '渠道属性',
          CooperateState: ['合作状态', (i) => {
            let v = _.find(this.cooperateState, (ii) => {
              return ii.id === i
            })
            return v ? v.state : ''
          }],
          Website: '公司网站',
          Address: '公司地址',
          YunduanResponsiblePerson: ['云端负责人', (i) => {
            let v = _.find(this.users, (ii) => {
              return ii.id === i
            })
            return v ? v.nickname : ''
          }],
          YouliangResponsiblePerson: ['有量负责人', (i) => {
            let v = _.find(this.users, (ii) => {
              return ii.id === i
            })
            return v ? v.nickname : ''
          }],
          RemitCompany: ['回款主体', (i) => {
            let remits = JSON.parse(i)
            let remitCompany = []
            for (let i in remits) {
              let v = _.find(this.companies, (ii) => {
                return ii.id === remits[i]
              })
              if (v) {
                remitCompany.push(v.name)
              }
            }
            return remitCompany.join(",")
          }],
          ContactsForCompare: ['渠道商', i => -10086],
          Desc: '备注',

        }
      }
    },
    methods: {
      getCompanyDetails (id) {
        let url = "/channelCompany/?channel_code=" + id
        this.$http.get(url)
          .then(({data}) => {
            if (data.data[0].remit_company == 'null') {
              data.data[0].remit_company = "[]"
            } else {
              data.data[0].remit_company = data.data[0].remit_company
            }
            this.form = util.objectTransform(data.data[0], {
              remit_company: 'json',
              yunduan_responsible_person: v => v || null,
              youliang_responsible_person: v => v || null,
              cooperate_state: v => v || null,
              contacts: v => v || [{name: "", position: "", email: "", phone: "", qq: "", wechart: ""}]
            })
            this.flagA = true
            this.flagB = true
            for (let i in this.users) {
              if (this.form.yunduan_responsible_person === this.users[i].id) {
                this.flagA = false
              }
              if (this.form.youliang_responsible_person === this.users[i].id) {
                this.flagB = false
              }
            }
            if (this.flagA === true && this.form.yunduan_responsible_person !== null) {
              var yunduan_User
              this.$http.get("/user/" + this.form.yunduan_responsible_person)
                .then((res) => {
                  yunduan_User = res.body;
                  this.users.push({id: yunduan_User.id, nickname: yunduan_User.nickname})
                })
            }
            if (this.flagB === true && this.form.youliang_responsible_person !== null) {
              var youliang_User
              this.$http.get("/user/" + this.form.youliang_responsible_person)
                .then((res) => {
                  youliang_User = res.body;
                  this.users.push({id: youliang_User.id, nickname: youliang_User.nickname})
                })
            }
          })
      },
      addTable: function () {
        this.form.contacts.splice(0, 0,
          {name: "", position: "", email: "", phone: "", qq: "", wechart: ""}
        )
      },
      getChannelSelectList: function () {
        let url = '/channelCompany/channels/'
        this.$http.get(url)
          .then((res) => {
            console.log(this)
            this.channels = res.body
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: err.body
            })
          })
      },
      getCompanySelectList: function () {
        let url = '/companytype/?limit=1000'
        this.$http.get(url)
          .then((res) => {
            this.companies = res.body.data;
          })
      },
      getUsers() {
        let url = "/user/devment/237";
        this.$http.get(url)
          .then((res) => {
            this.users = res.body;
          })
      },
      submit() {
        if (this.disabl === false) {
          this.disabl = true
          setTimeout(() => {
            this.disabl = false
          }, 1500);
        }
        if (!this.form.company_id || !this.form.channel_code) {
          this.$message({
            type: 'error',
            message: '公司和渠道不能为空'
          })
          return
        }

        if (!this.form.youliang_responsible_person && !this.form.yunduan_responsible_person) {
          this.$message({
            type: 'error',
            message: '至少需选择一名商务负责人'
          })
          return
        }

        if (!this.form.cooperate_state) {
          this.$message({
            type: 'error',
            message: '合作状态不能为空'
          })
          return
        }
        let url = "/channelCompany/"
        console.log(this.form)
        let body = util.objectTransform(this.form, {
          remit_company: 'json',
        })
        let post = util.buildPostParams(body)

        if (this.form.id) {
          this.$http.put(url + this.form.id, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.close(true)
            })
        } else {
          this.$http.post(url, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.close(true)
              this.resetForm()
            })
        }
      },

      resetForm(){
        this.form = _.cloneDeep(this.emptyForm)
        this.flagA = false
        this.flagB = false
      },
      init(){
        this.resetForm()
        this.getCompanySelectList()
        this.getChannelSelectList()
        this.getUsers()
        if (this.channel_code) {
          this.getCompanyDetails(this.channel_code)
        }
      },
      close(needRefresh = false){
        this.$emit('close', needRefresh)
      },
    },
    watch: {
      editId(){
        this.init()
      },
    },
    created() {
      this.resetForm()
    },
    mounted() {
      this.init()
    }
  }
</script>

<style scope>
  .contact_div {
    margin-left: 35px;
    padding-bottom: 30px;
  }

  #resear_h3 h3 {
    padding-bottom: 30px;
    margin-left: 20px;
    padding-top: 30px;
    margin-top: 0;
  }

  .el-table__body td > input {
    width: 70%;
    margin: auto;
  }

  .el-table__body td, #tabl_bod th {
    text-align: center;
  }
</style>

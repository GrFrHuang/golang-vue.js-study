<template>
  <div>

    <div>
      <div id="resear">
        <div class="situation row contact_div">
          <label class="times_contracts">选择公司:</label>
          <div class="col-sm-3 times_contract">
            <el-select
              v-model="selectedCompany" :clearable="true"
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
          <div class="col-sm-3 times_contract">
            <el-input v-model="form.platform_name" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">区域:</label>
          <div class="col-sm-3 times_contract">
            <el-input v-model="form.region" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">公司网站:</label>
          <div class="col-sm-3 times_contract">
            <el-input v-model="form.website" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="situation row contact_div">
          <label class="times_contracts">公司地址:</label>
          <div class="col-sm-3 times_contract">
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
        <div class="row contact_div_name">
          <div style="margin-bottom: 30px" v-for="(item,index) in form.contacts">
            <div class="situation row">
              <label class="times_contracts">公司联系人:</label>
              <div class="col-sm-3 times_contract">
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
          <div class="col-sm-3 times_contract">
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
            <operate-log :keyLabel="operateLabel" :page="35" :dataId="editId" :rand="rand"></operate-log>
          </div>
        </div>
        <div class="row contact_div">
          <div class="dowebok form-control_statesd">
            <p id="test">
              <button class="btn btn-default btn_B col-sm-3" :disabled=disabl @click="submit">保存</button>
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
    props: ['editId', 'rand'],
    data() {
      return {
        disabl: false,
        selectedCompany: '',
        companies: '',
        form: null,
        users: null,
        emptyForm: {
          id: 0,
          company_id: null,
          platform_name: null,
          region: null,
          website: null,
          address: null,
          desc: null,
          yunduan_responsible_person: null,
          youliang_responsible_person: null,
          contacts: [
            {name: "", position: "", email: "", phone: "", qq: "", wechart: ""}
          ]
        },
        flagA: false,
        flagB: false,
        operateLabel: {
          CompanyId: ['发行商', (i) => {
            let v = _.find(this.companies, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          PlatformName: '平台名称',
          Region: '区域',
          Website: '公司网站',
          Address: '公司地址',
          YouliangResponsiblePerson: ['有量负责人', (i) => {
            let v = _.find(this.users, (ii) => {
              return ii.id === i
            })
            return v ? v.nickname : ''

          }],
          YunduanResponsiblePerson: ['云端负责人', (i) => {
            let v = _.find(this.users, (ii) => {
              return ii.id === i
            })
            return v ? v.nickname : ''

          }],
          ContactsForCompare: ['公司联系人', i => -10086],
          Desc: '备注',
          AccountName: '开户全称',
          Bank: '开户银行',
          AccountNumber: '开户账号',
        }
      }
    },
    methods: {
      getCompanyDetails (id) {
        let url = "/distributionCompany/" + id
        this.$http.get(url)
          .then(({data}) => {
            this.form = util.objectTransform(data, {
              yunduan_responsible_person: v => v || null,
              youliang_responsible_person: v => v || null,
              contacts: v => v || [{name: "", position: "", email: "", phone: "", qq: "", wechart: ""}]
            })
            this.selectedCompany = this.form.company_id
            if (!this.form.contacts) {
              this.form.contacts = [{name: "", position: "", email: "", phone: "", qq: "", wechart: ""}]
            }

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
      getCompanyTypes() {
        let url = "/companytype/?limit=1000"
        this.$http.get(url)
          .then(({data}) => {
            this.companies = data.data
          })
      },
      addTable: function () {
        this.form.contacts.splice(0, 0,
          {name: "", position: "", email: "", phone: "", qq: "", wechart: ""}
        )
      },
      submit() {
        if (this.disabl === false) {
          this.disabl = true
          setTimeout(() => {
            this.disabl = false
          }, 1500);
        }
        if (!this.selectedCompany) {
          this.$message({
            type: 'error',
            message: '请选择选择公司'
          })
          return
        }
        this.form.company_id = this.selectedCompany
        let post = util.buildPostParams(this.form)
        let url = "/distributionCompany/"
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
        this.selectedCompany = null
        this.flagA = false
        this.flagB = false
      },
      init(){
        this.resetForm()
        this.getUsers()
        if (this.editId) {
          this.getCompanyDetails(this.editId)
        }
      },
      close(needRefresh = false){
        this.$emit('close', needRefresh)
      },
      getUsers() {
        let url = "/user/devment/245";
        this.$http.get(url)
          .then((res) => {
            this.users = res.body;
          })
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
    mounted: function () {
      this.init()
      this.getCompanyTypes()
    }
  }
</script>


<style scoped>
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

  .contact_div_name {
    margin-left: 50px;
    padding-bottom: 30px;
  }
</style>

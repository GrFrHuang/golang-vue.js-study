<template>
  <div>
    <div id="resear_h3">

      <div id="resear">
        <div class="situation row contact_div">
          <label class="times_contracts">选择公司:</label>
          <div class="col-sm-3 times_contract">
            <el-select
              v-model="selectedCompany" :clearable="true"
              filterable placeholder="请选择" :disabled="form.id!==0">
              <el-option
                v-for="item in companies"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <!--<div class="situation row contact_div">-->
          <!--<label class="times_contracts">平台名称:</label>-->
          <!--<div class="col-sm-3 times_contract">-->
            <!--<el-input v-model="form.platform_name" placeholder="请输入内容"></el-input>-->
          <!--</div>-->
        <!--</div>-->
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
            <operate-log :keyLabel="operateLabel" :page="37" :dataId="editId" :rand="rand"></operate-log>
          </div>
        </div>
        <div class="row contact_div">
          <div class="dowebok form-control_statesd">
            <p id="test">
              <button class="btn btn-default btn_B col-sm-3" :disabled= disabl @click="submit">保存</button>
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
        form: null,
        companies: [],
        selectedCompany:null,
        emptyForm: {
          id: 0,
          company_id: null,
          platform_name: null,
          region: null,
          addres:null,
          website: null,
          desc: null,
          contacts: [
            {name: "", position: "", email: "", phone: "", qq: "", wechart: ""}
          ],
        },

        operateLabel: {
          CompanyId: ['研发商', (i) => {
            let v = _.find(this.companies, (ii) => {
              return ii.id === i
            })
            return v ? v.name : ''
          }],
          Region: '区域',
          Website: '公司网站',
          Address: '公司地址',
          ContactsForCompare: ['公司联系人',i=>-10086],
          Desc: '备注',
        }
      }
    },

    methods: {
      getCompanyDetails(id) {
        let url = "/developCompany/?query=id:in" + id
        this.$http.get(url)
          .then(({data}) => {
            this.form = data.data[0]
            this.selectedCompany = this.form.company_id
            if (!this.form.contacts) {
              this.form.contacts = [{name: "", position: "", email: "", phone: "", qq: "", wechart: ""}]
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
          setTimeout( () => {
            this.disabl = false
          }, 1500);
        }
        if(!this.selectedCompany) {
          this.$message({
            type: 'error',
            message: '请选择选择公司'
          })
          return
        }
        this.form.company_id = this.selectedCompany
        let post = util.buildPostParams(this.form)

        if (this.form.id) {
          // update
          let url = "/developCompany/" + this.form.id
          this.$http.put(url, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })

              this.close(true)
            })

        } else {
          // insert
          let url = "/developCompany/"
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
      },
      init(){
        this.resetForm()
        if (this.editId) {
          this.getCompanyDetails(this.editId)
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

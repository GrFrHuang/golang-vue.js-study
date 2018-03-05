<template>
  <div>
    <div id="resear_h3">
      <h3>添加渠道商</h3>
      <div>
        <div id="resear">
          <div class="dowebok contact_div  form-control_statesd"><span>选择渠道：</span>
            <!--<multiselect v-model="selectedCompanies" tag-placeholder="Add this as new tag"-->
                         <!--placeholder="搜索渠道名称"-->
                         <!--label="name" track-by="cp" :options="channels"-->
                         <!--:taggable="false">-->
            <!--</multiselect>-->
            <el-select v-model="selectedCompanies" :clearable="true"
                       filterable placeholder="请选择">
              <el-option
                v-for="item in channels"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="dowebok contact_div  form-control_statesd"><span>公司名称：</span>
            <el-input v-model="name"  @change="addNewCompanyName" placeholder="请输入内容"></el-input>
          </div>
          <div class="dowebok contact_div form-control_statesd"><span>平台名称：</span>
            <el-input v-model="platform_name" placeholder="请输入内容"></el-input>
          </div>
          <div class="dowebok contact_div form-control_statesd"><span>区域：</span>
            <el-input v-model="region" placeholder="请输入内容"></el-input>
          </div>
         <div class="dowebok contact_div form-control_statesd"><span>渠道属性：</span>
            <el-input v-model="properties" placeholder="请输入内容"></el-input>
          </div>
          <div class="dowebok contact_div form-control_statesd"><span>公司网站：</span>
            <el-input v-model="website" placeholder="请输入内容"></el-input>
          </div>

          <div class="dowebok contact_div form-control_statesd">
            <p>商务负责人:</p>
            <p> 云端:</p>
            <el-select v-model="yunduanRep" :clearable="true" filterable placeholder="请选择负责人">
              <el-option
                v-for="item in users"
                :label="item.nickname"
                :value="item.id">
              </el-option>
            </el-select>
            <span>有量:</span>
            <el-select v-model="youliangRep" :clearable="true" filterable placeholder="请选择负责人">
              <el-option
                v-for="item in users"
                :label="item.nickname"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="dowebok contact_div form-control_statesd"><span>回款主体：</span>
            <div class="refund">
              <el-select v-model="values" filterable  multiple placeholder="请选择公司">
                <el-option
                  v-for="refund in options"
                  :label="refund.name"
                  :value="refund.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row contact_div">
            <div style="margin-bottom: 30px" v-for="(item,index) in contacts">
              <div class="dowebok  form-control_statesd">
                <span>公司联系人：</span>
                <el-input v-model="item.name" placeholder="请输入内容"></el-input>
                <el-button v-if="index==0" type="primary" icon="plus" @click=addTable></el-button>
                <el-button v-else type="primary" icon="minus" @click="contacts.splice(index,1)"></el-button>
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
          <div class="contact_div margin_left form-control_statesd"><span>备注：</span>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="desc">
            </el-input>
          </div>
          <div class="row contact_div">
            <div class="dowebok form-control_statesd">
              <p id="test">
                <button class="btn btn-default btn_B col-sm-3" @click="submit">保存</button>
                <button class="btn btn-default btn_F col-sm-3 col-md-offset-1" @click="$router.go(-1)">返回</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
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
  .refund{
    width: 100%;
  }
  .refund>div{
    width: 100%;
  }
</style>
<script>
  import Multiselect from 'vue-multiselect'
  import {Pagination} from 'element-ui'

  export default {
    components: {
      Multiselect
    },
    data() {
      return {
        channel_code: '',
        remit_company: '',
        channels: [],
        selectedCompanies: {},
        name: '',
        platform_name: '',
        region: '',
        website: '',
        contact: '',
        properties: '',
        desc: '',
        yunduanRep: '',
        youliangRep: '',
        users: [],
        contacts: [
          {name: "", position: "", email: "", phone: "", qq: "", wechart: ""},
        ],
        values: '',
        options: []
      }
    },
    methods: {
      addNewCompanyName: function () {
        this.options = _.filter(this.options,(item)=>{return item.id!=0})
        this.options.push({id:0, name: this.name})
      },
      addTable: function () {
        this.contacts.splice(0, 0,
          {name: "", position: "", email: "", phone: "", qq: "", wechart: ""}
        )
      },
      getChannelSelectList: function () {
        var url = '/channelCompany/channels/'
        this.$http.get(url)
          .then((res) => {
            this.channels = res.body
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: err.body
            })
          })
      },
      getCompanySelectList:function () {
        var url = ENV.HOST_URL + '/company/type/3'
        this.$http.get(url)
          .then((res) => {
            this.options = res.body;
          })
      },
      getUsers() {
        let url = "/user/?limit=1000";
        this.$http.get(url)
          .then((res) => {
              this.users = res.body.data;
          })
      },
      submit() {
        if (!this.name) {
          this.$message({
            type: 'error',
            message: '公司名称不能为空'
          });
          return
        }
        if (this.yunduanRep=="" && this.youliangRep=="") {
          this.$message({
            type: 'error',
            message: '请至少选择一名负责人'
          });
          return
        }

        let body = ({
          "channel_code": this.selectedCompanies.cp,
          "remit_company|json": this.values,
          "properties": this.properties,
          "yunduan_responsible_person": this.yunduanRep != "" ? this.yunduanRep : 0,
          "youliang_responsible_person": this.youliangRep != "" ? this.youliangRep : 0,
          "company": {
            "name": this.name,
            "platform_name": this.platform_name,
            "region": this.region,
            "website": this.website,
            "desc": this.desc,
            "contacts": this.contacts
          }
        })
        let url = '/channelCompany'
        let post = util.buildPostParams(body);
        console.log(post)
        this.$http.post(url, post)
          .then((r) => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.$router.go(-1)
          })
          .catch((err) => {
              this.$message({
              type: 'error',
              message: err.body
            })
          })
      }
    },
    mounted: function () {
      this.getChannelSelectList();
      this.getCompanySelectList();
      this.getUsers();
    }
  }
</script>

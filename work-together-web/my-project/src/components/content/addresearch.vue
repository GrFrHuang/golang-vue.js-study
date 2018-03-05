<template>
  <div>
    <div id="resear_h3">
      <h3>添加研发商</h3>
      <div>
        <div id="resear">
          <div class="dowebok contact_div  form-control_statesd"><span>公司名称：</span>
            <el-input v-model="name" placeholder="请输入内容"></el-input>
          </div>
          <!--<div class="dowebok contact_div form-control_statesd"><span>平台名称：</span>-->
            <!--<el-input v-model="platform_name" placeholder="请输入内容"></el-input>-->
          <!--</div>-->
          <div class="dowebok contact_div form-control_statesd"><span>区域：</span>
            <el-input v-model="region" placeholder="请输入内容"></el-input>
          </div>
          <div class="dowebok contact_div form-control_statesd"><span>公司网站：</span>
            <el-input v-model="website" placeholder="请输入内容"></el-input>
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
  .contact_div{
    margin-left: 35px;
    padding-bottom:30px;
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
<script>
  import Multiselect from 'vue-multiselect'
  import {Pagination} from 'element-ui'

  export default {
    data() {
      return {
        name: '',
        platform_name: '',
        region: '',
        website: '',
        contact: '',
        desc: '',
        contacts: [
          {name: "",position: "",email: "",phone: "",qq: "",wechart: ""},
        ]
      }
    },
    methods: {
      addTable: function () {
        this.contacts.splice(0,0,
          {name: "",position: "",email: "",phone: "",qq: "",wechart: ""}
          )
      },
      submit() {
        console.log(this.name, this.region)
        if (this.name == "") {
          this.$message({
            type: 'error',
            message: '请输入公司名称'
          })
          return
        }
        if (this.region == "") {
          this.$message({
            type: 'error',
            message: '请输入区域名称'
          })
          return
        }
        let body = ({
          "company": {
            "name":this.name,
            "region":this.region,
            "website":this.website,
            "desc":this.desc,
            "contacts":this.contacts
          }
        })
        let url = '/developCompany'
        let post = util.buildPostParams(body);
        this.$http.post(url, post)
          .then((r) => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          })
          .catch((err) => {
              this.$message({
              type: 'error',
              message: err.body
            })
          })
      }
    }
  }
</script>

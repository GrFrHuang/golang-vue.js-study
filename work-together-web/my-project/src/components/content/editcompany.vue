<template>
  <div>
    <div id="resear_h3">
      <div id="resear">
        <div class="situation row contact_div">
          <label class="times_contracts">公司名称:</label>
          <div class="col-lg-10 col-sm-9 times_contract">
            <el-input v-model="form.company.name" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="row contact_div contact_div_btn">
          <div class="dowebok form-control_statesd">
            <p id="test">
              <button class="btn btn-default btn_B col-sm-5" @click="submit">保存</button>
              <button class="btn btn-default btn_F col-sm-5 col-md-offset-1" @click="close(false)">返回</button>
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import {Pagination} from 'element-ui'

  export default {
    props: ['editId'],
    data() {
      return {
        form: null,
        emptyForm: {
          id: 0,
          company: {
            id: 0,
            name: null,
            platform_name: null,
            region: null,
            website: null,
            desc: null,
            contacts: [
              {name: "", position: "", email: "", phone: "", qq: "", wechart: ""},
            ],
          },
        },

      }
    },

    methods: {
      getCompanyDetails(id) {
        let url = "/developCompany/?query=id:in" + id
        this.$http.get(url)
          .then(({data}) => {
            this.form = data.data[0]
          })
      },
      addTable: function () {
        this.form.company.contacts.splice(0, 0,
          {name: "", position: "", email: "", phone: "", qq: "", wechart: ""}
        )
      },
      submit() {
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
    }
  }
</script>

<style scoped>
  .contact_div {
    margin-left: 0;
    padding-bottom: 0;
    margin-right: 0;
  }
  .contact_div_btn{
    margin-left: 17vw;
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

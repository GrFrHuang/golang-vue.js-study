<template>
  <div>
    <div id="edit_h">
      <h3 style="    margin-bottom: 26px;">添加CP对账信息</h3>
      <p>账号：<span>{{user.name}}</span></p>
      <p>昵称：<span>{{user.nickname}}</span></p>
      <p style="margin-top: 42px;margin-left: 110px;">邮箱地址：<span style="margin-left: 20px;">{{user.email}}</span></p>
      <!-- /.input group -->
      <p style="margin-top: 42px;margin-left: 110px;margin-bottom: 40px;" class="situation">
        部门选择：
        <multiselect v-model="selectedDepartment" tag-placeholder=""
                     placeholder="选择部门"
                     label="name" track-by="id" :options="departments" :multiple="false"
                     :taggable="false">
        </multiselect>
      </p>
    </div>
    <div id="btn_dv">
      <p id="test">
        <button style="margin-left: 226px;margin-right: 45px;width: 114px;" class="btn btn-default btn_B"
                @click="post">保存
        </button>
        <button style="width: 114px;" class="btn btn-default btn_F" @click="sayHi('1')">返回</button>
      </p>
    </div>
  </div>

</template>


<script>
  import Multiselect from 'vue-multiselect'

  export default {
    props: ['items'],
    components: {
      Multiselect
    },
    data: function () {
      return {
        user: {email: ""},
        departments: [], //
        selectedDepartment: {},//
        nickname: "",//
      }
    },
    methods: {
      post(){

        let body = {
          nickname: this.nickname,
          department_id: this.selectedDepartment.id,
          "role_ids|json": roleIds,
        }
        let post = utils.buildPostParams(body)
        console.log(post)

        let url = '/user/' + this.user.id
        this.$http.put(url, post)
          .then((r) => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
          })
      }
    },
    mounted: function () {
      // 加载部门
      let url = '/department/'
      this.$http.get(url)
        .then((res) => {
          this.departments = res.body
        })
        .catch((err) => {
          console.log(err)
        })

      let uid = this.$route.query.id

      url = '/user/' + uid
      this.$http.get(url)
        .then((res) => {
          this.user = res.body
        })
        .catch((err) => {
          console.log(err)
        })
    },
    watch: {
      departments(){
        if (this.user.department_id) {
          this.selectedDepartment = _.find(this.departments, {'id': this.user.department_id})
        }
      },
      user(){
        if (this.selectedDepartment.length != 0) {
          this.selectedDepartment = _.find(this.departments, {'id': this.user.department_id})
        }
      }
    }
  }
</script>

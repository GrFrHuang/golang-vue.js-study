<template>
  <div>
    <section class="content-header">
      <h1>
        用户管理
        <small>添加或者编辑用户</small>
      </h1>
      <ol class="breadcrumb">
        <li>
          <i class="fa fa-dashboard"></i> {{title}}
        </li>
        <li>
          <router-link to="/home/mgt/mgtc">合同管理</router-link>
        </li>
      </ol>
    </section>
    <div class="content">

      <div class="box">
        <div class="box-header with-border">
          <h3 class="box-title">
            {{title}}
          </h3>
        </div>
        <div class="box-body form-horizontal">
          <div class="form-group ">
            <label class="col-sm-2 control-label">邮箱地址</label>
            <div class="col-sm-10">
              <input type="text"
                     class="form-control" v-model="email"
                     placeholder="请输入邮箱账号"/>
            </div>
          </div>
          <div class="form-group ">
            <label class="col-sm-2 control-label">昵称</label>
            <div class="col-sm-10">
              <input type="text"
                     class="form-control" v-model="nickname"
                     placeholder="昵称"/>
            </div>
          </div>
          <div class="form-group ">
            <label class="col-sm-2 control-label">头像</label>
            <div class="col-sm-10">
              <img :src="picUrl" alt="" class="preview">
              <input type="file" @change="onPicFileChange($event)" style="display: inline">
              <cropper @selected="picSelected" ref="cropper"></cropper>
            </div>
          </div>
          <div class="form-group ">
            <label class="col-sm-2 control-label">部门选择</label>
            <div class="col-sm-10">
              <!--<multiselect v-model="selectedDepartment" tag-placeholder=""-->
                           <!--placeholder="选择部门"-->
                           <!--label="name" track-by="id" :options="departments" :multiple="false"-->
                           <!--:taggable="false">-->
              <!--</multiselect>-->
              <el-select v-model="selectedDepartment" :clearable="true"
                         filterable placeholder="请选择">
                <el-option
                  v-for="item in departments"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="form-group ">
            <label class="col-sm-2 control-label">角色选择</label>
            <div class="col-sm-10">
              <!--<multiselect v-model="selectedRoles" tag-placeholder=""-->
                           <!--placeholder="选择角色"-->
                           <!--label="name" track-by="id" :options="roles" :multiple="true"-->
                           <!--:taggable="false">-->
              <!--</multiselect>-->
              <el-select v-model="selectedRoles" :clearable="true"
                         filterable multiple placeholder="请选择">
                <el-option
                  v-for="item in roles"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-sm-2 control-label">职位</label>
            <div class="col-sm-10">
              <input type="text"
                     class="form-control" v-model="position"
                     placeholder="职位"/>
            </div>
          </div>

          <div class="form-group ">
            <!--<label class="col-sm-2 control-label">入职时间</label>-->
            <label class="col-sm-2 control-label">入职时间</label>
            <div class="col-sm-4">
              <div class="input-group date">
                <el-date-picker
                  v-model="entryTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="选择入职时间"
                  align="right">
                </el-date-picker>

              </div>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-sm-2 control-label"></label>
            <div class="col-sm-10">
              <div class="row">
                <div class="col-md-2">
                  <button class="btn btn-primary btn-block"
                          @click="post">保存
                  </button>
                </div>
                <div class="col-md-2">
                  <button class="btn btn-default btn-block"
                          @click="$router.go(-1)">返回
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import Cropper from '../public/ImgCropper.vue'

  export default {
    props: ['items'],
    components: {
      Multiselect, Cropper
    },
    data: function () {
      return {
        todos: [{
          text: '账号'
        }, {
          text: '部门'
        }, {
          text: '角色名称'
        }, {
          text: '删除'
        }, {
          text: '操作'
        },],
        title: "", // 显示的标语
        departments: [], //
        roles: [], //
        selectedDepartment: 0,//
        email: "",//
        nickname: "",//
        position: "",// 职位
        entryTime: '',// 入职时间
        selectedRoles: [],

        picUrl: "",
        picFileId: 0,

        user: {}, // 用户信息, 只在更新用户时保存读取到的信息, 不参与v-model
      }
    },
    methods: {
      editHelper: function () {
        this.$router.push({
          path: '/home/editHelper'
        })
      },
      addHelper: function () {
        this.$router.push({
          path: '/home/addHelper'
        })
      },
      onPicFileChange(e){
        let el = e.target
        if (el.files == null || el.files.length == 0) {
          return
        }
        let file = el.files[0]
        if (file.type.indexOf("image") === -1) {
          this.$message({
            type: 'error',
            message: '文件格式错误'
          })
          return
        }
        let vm = this
        let reader = new FileReader();
        reader.onload = function () {
          vm.$refs.cropper.open(this.result)
          el.value = null
        };
        reader.readAsDataURL(file);
      },
      picSelected(data){
        console.log(data)
        this.picUrl = data.previewUrl
        util.fileUpload(`${ENV.HOST_URL}/asset/uploadFacePic`, {"asset_name": data.file},
          (type, data) => {
            //console.log(type, data)
            if (type == "success") {
              this.picFileId = JSON.parse(data).id
            }
          })
      },
      post(){
        let roleIds = []
        for (let i in this.selectedRoles) {
          roleIds.push(this.selectedRoles[i])
        }
        let body

        let uid = this.user.id
        if (uid) {
          // put
          body = {
            nickname: this.nickname,
            department_id: this.selectedDepartment,
            pic_file_id: this.picFileId,
            "role_ids|json": roleIds,
          }
        } else {
          let timeStamp = new Date(this.entryTime).getTime() / 1000
          // post
          body = {
            position: this.position,
            entry_time: timeStamp,

            email: this.email,
            nickname: this.nickname,
            pic_file_id: this.picFileId,
            department_id: this.selectedDepartment,
            "role_ids|json": roleIds,
          }
        }

        //console.log(body);return

        let post = util.buildPostParams(body)

        if (uid) {
          let url = '/user/' + uid
          this.$http.put(url, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          let url = '/user'
          this.$http.post(url, post)
            .then((r) => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch((err) => {
              console.log(err)
            })
        }

      }
    },
    mounted: function () {
      let done = _.after(3, () => {
        this.email = this.user.email
        this.name = this.user.name
        this.nickname = this.user.nickname
        this.picFileId = this.user.pic_file_id
        this.picUrl = util.buildFileUrl(this.picFileId)

        this.position = this.user.position
        if (typeof (this.user.entry_time) === 'undefined' || this.user.entry_time === 0){
          this.entry_time = parseInt(new Date().getTime()/1000)
        }
        this.entryTime = this.user.entry_time

//        this.selectedDepartment = _.find(this.departments, {'id': this.user.department_id})
        this.selectedDepartment = this.user.department_id
        let roleIds = JSON.parse(this.user.role_ids)
        this.selectedRoles = roleIds
        /*this.selectedRoles = _.filter(this.roles, (item) => {
            if( roleIds.indexOf(item.id) != -1 ) {
                return item.id
            }
          }
        )*/
      })

      // 加载部门
      let url = '/department/'
      this.$http.get(url)
        .then((res) => {
          this.departments = res.body
          done()
        }).catch((err) => {
        console.log(err)
      })

      // 角色
      url = '/role/'
      this.$http.get(url)
        .then((res) => {
          this.roles = res.body
          done()
        })
        .catch((err) => {
          console.log(err)
        })

      let uid = this.$route.query.id
      if (uid) {
        this.title = "编辑用户"
        // 加载用户
        url = '/user/' + uid
        this.$http.get(url)
          .then((r) => {
            this.user = r.body
            done()
          })
          .catch((err) => {
            console.log(err)
          })
      } else {

        this.title = "添加用户"
      }
    },

  }
</script>

<style scoped>
  .preview {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
</style>

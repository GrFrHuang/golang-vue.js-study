<template>
  <div>
    <section class="content-header">
      <h1>
        设置
        <small>修改密码与资料</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i> 设置</li>
      </ol>
    </section>
    <div class="content">
      <div class="row">
        <div class="col-lg-4 col-md-6">

          <div class="box">
            <div class="box-header with-border">
              <div class="box-title">
                修改密码
              </div>
            </div>
            <div class="box-body form-horizontal">
              <div class="form-group">
                <label class="col-sm-2 control-label">旧密码</label>
                <div class="col-sm-10">
                  <el-input
                    placeholder="旧密码"
                    type="password"
                    icon="information"
                    v-model="credentials.old_pwd">
                  </el-input>
                </div>
              </div>

              <div class="form-group">
                <label class="col-sm-2 control-label">新密码</label>
                <div class="col-sm-10">
                  <el-input
                    placeholder="新密码"
                    type="password"
                    icon="information"
                    v-model="credentials.new_pwd">
                  </el-input>
                </div>
              </div>

              <div class="form-group">
                <label class="col-sm-2 control-label">确认密码</label>
                <div class="col-sm-10">
                  <el-input
                    placeholder="再次输入新密码"
                    type="password"
                    icon="information"
                    v-model="credentials.new_pwd2">
                  </el-input>
                </div>
              </div>
            </div>
            <div class="box-footer">
              <button type="submit" class="btn btn-primary btn-block " @click=postPwd>保存</button>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="box">
            <div class="box-header with-border">
              <div class="box-title">
                修改信息
              </div>
            </div>
            <div class="box-body form-horizontal">
              <div class="form-group">
                <label class="col-sm-2 control-label">头像</label>
                <div class="col-sm-10">
                  <img :src="picUrl" alt="" class="preview">
                  <input type="file" @change="onPicFileChange($event)" class="file-input">
                  <cropper @selected="picSelected" ref="cropper"></cropper>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-2 control-label control-bumen">部门</label>
                <div class="col-sm-10">
                 {{ department }}
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-2 control-label control-bumen">角色</label>
                <div class="col-sm-10">
                  {{ role }}
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-2 control-label">电话</label>
                <div class="col-sm-6">
                  <el-input v-model="phone" placeholder="请输入内容" maxlength=11></el-input>
                </div>
              </div>

              <div class="form-group">
              <label class="col-sm-2 control-label control-bumen">职位</label>
              <div class="col-sm-1">
                {{ position }}
              </div>
              <label class="col-sm-2 control-label control-bumen">入职时间</label>
              <div class="col-sm-4">
                {{ entryTime }}
              </div>
              </div>

            </div>
            <div class="box-footer">
              <button type="submit" class="btn btn-primary btn-block " @click=postInfo>保存</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>
<script>
  import Cropper from '../public/ImgCropper.vue'
  import {mapState} from 'vuex'

  export default {
    components: {
      Cropper
    },
    computed: {
      ...mapState({
        mapUserInfo: ({userInfo}) => userInfo,
      }),
    },
    data: () => {
      return {
        credentials: {
          new_pwd: "",
          old_pwd: "",
          new_pwd2: "",
        },

        picUrl: "",
        phone: '',
        picFileId: 0,
        department: '',
        role: '',
        position: '',
        entryTime: '',
      }
    },
    mounted(){
      this.picFileId = this.mapUserInfo.picFileId
      this.picUrl = util.buildFileUrl(this.picFileId)
      this.getUserInfo()
    },
    methods: {
      postPwd(){
        let data = JSON.stringify(this.credentials)
        console.log(data)
        var reg = /^[0-9a-zA-Z]+$/;
        if (this.credentials.new_pwd != this.credentials.new_pwd2) {
          this.$message({
            message: "新密码不一致",
            type: 'warning'
          })
        } else if (!reg.test(this.credentials.new_pwd)) {
          this.$message({
            message: "密码只能由数字和字母组成",
            type: 'warning'
          })
        } else if (this.credentials.new_pwd.length < 6 || this.credentials.new_pwd.length > 20) {
          this.$message({
            message: "密码必须由6位-20位数字和字母组成",
            type: 'warning'
          })
        } else {
          let url = '/userown/pwd'
          this.$http.put(url, data)
            .then((r) => {
              this.$message({
                message: "修改成功",
                type: 'success'
              })
              this.credentials.new_pwd2 = this.credentials.new_pwd = this.credentials.old_pwd = ""
            })
        }
      },
      postInfo(){
        if (!this.picFileId) {
          this.$message({
            message: "请选择图片",
            type: 'warning'
          })
          return
        }
        let body = util.buildPostParams({
          'pic_file_id': this.picFileId,
          'phone': this.phone
        })

        let url = '/userown/info'
        this.$http.put(url, body)
          .then(({data}) => {
            this.$message({
              message: "修改成功",
              type: 'success'
            })

            let newInfo = JSON.parse(window.localStorage.getItem('cnodeBaseInfo'))
            newInfo.info.pic_file_id =this.picFileId
            newInfo.info.phone = this.phone

            this.$store.commit('SET_BASEINFO', newInfo)
            window.localStorage.setItem('cnodeBaseInfo', JSON.stringify(newInfo))
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
            console.log(type, data)
            if (type == "success") {
              this.picFileId = JSON.parse(data).id
            }
          })
      },
      getUserInfo(){
        this.role = ""
        this.department = ""
        this.phone = ""

        var info = window.localStorage.getItem('cnodeBaseInfo')
        var userInfo = JSON.parse(info)

        this.department = userInfo.info.department_name
        let roles = []
        for(let i in userInfo.info.roles){
            roles.push(userInfo.info.roles[i].name)
        }
        this.role = roles.join("、")
        this.phone = userInfo.info.phone

        this.position = userInfo.info.position
        let time = new Date(userInfo.info.entry_time * 1000)
        var y = time.getFullYear();//年
        var m = time.getMonth() + 1;//月
        var d = time.getDate();//日
        var h = time.getHours();//时
        var mm = time.getMinutes();//分
        this.entryTime = y+"-"+m+"-"+d+" "+h+":"+mm

      }
    }
  }

</script>
<style>
  .control-bumen{
    padding-top:0!important;
  }
</style>
<style scoped>
  .preview {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  .file-input {
    display: inline-block;
    width: 150px;
  }
</style>

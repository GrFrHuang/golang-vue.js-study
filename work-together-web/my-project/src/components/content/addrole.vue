<template>
  <div>
    <section class="content-header">
      <h1>
        角色管理
        <small>编辑角色</small>
      </h1>
      <ol class="breadcrumb">
        <li>
          <router-link to="/home/mgt/mgtc">结算管理</router-link>
        </li>
        <li>
          <i class="fa fa-dashboard"></i> {{title}}
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
            <label class="col-sm-2 control-label">角色名称</label>
            <div class="col-sm-10">
              <input type="text" v-model="name"
                     class="form-control"
                     placeholder="请输入角色名称"/>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-sm-2 control-label">权限分配</label>
            <div class="col-sm-10">
              <div class="permission-box">
                <el-checkbox-group v-model="selectedPermissionIds">
                  <div class="row" v-for="item in permissions">
                    <div class="col-md-3">
                      <div class="group">{{item.group}}</div>
                    </div>
                    <div class="col-md-9">
                      <div v-for="p in item.ps" class="col-lg-3 col-md-4 col-sm-6">
                        <el-checkbox :label='p.id'/>
                        <span class="ps-lable">{{p.name }}</span>
                      </div>
                    </div>
                  </div>
                </el-checkbox-group>
              </div>
            </div>
          </div>

          <div class="form-group ">
            <label class="col-sm-2 control-label"></label>
            <div class="col-sm-10">
              <div class="row bottom-5">
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
<style rel="stylesheet/less" lang="less" scoped>
  .bottom-5 {
    margin-bottom: 5px;
  }

  .permission-box {
    border: 1px #d2d6de solid;
    padding: 10px;
    line-height: 2;
    .group {
      font-size: 16px;
      border-bottom: 1px solid #eee;
      padding: 0 5px 5px 0px;
      margin-bottom: 5px;
      color: #333;
    }
    .ps-lable {
      font-weight: 800;
    }
  }
</style>

<style rel="stylesheet/less" lang="less">

  .permission-box {
    .el-checkbox__label {
      display: none;
    }
  }
</style>

<script>
  import utils from '../../publicjs/utils'

  export default {
    data: function () {
      return {
        uid: 0,// 如果是编辑则uid不为0
        permissions: [], // 所有权限
        selectedPermissionIds: [], // 选择的权限
        name: "", // 角色名称
        title: "",
      }
    },
    methods: {
      getPermissions(){
        let url = '/permission/group'
        this.$http.get(url)
          .then((res) => {
            this.permissions = res.body
          })
          .catch((err) => {
            console.log(err)
          })

      },
      post(){
        let body = {
          name: this.name,
          "permission_ids|json": this.selectedPermissionIds
        }
        let post = utils.buildPostParams(body)
        console.log(post)

        if (this.uid) {
          // 更新
          this.$http.put('/role/' + this.uid, post)
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
          // 新增
          this.$http.post('/role/', post)
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
      this.getPermissions()
      this.uid = this.$route.query.id

      if (this.uid) {
        this.title = "编辑角色"
        this.$http.get('/role/' + this.uid)
          .then((r) => {
            r = r.body
            this.name = r.name
            this.selectedPermissionIds = JSON.parse(r.permission_ids)
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        this.title = "添加角色"
      }
    }
  }
</script>

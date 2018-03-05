<template>
  <div>
    <section class="content-header">
      <h1>
        角色管理
        <small>删除/添加/编辑角色</small>
      </h1>
      <ol class="breadcrumb">
        <li><i class="fa fa-dashboard"></i>用户/角色</li>
        <li>
          <router-link to="/home/role">角色管理</router-link>
        </li>
      </ol>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <button class="btn btn-default" @click=addrole>添加角色</button>
        </div>
        <div class="box-body">
          <table id="exampleszn" class="table table-bordered table-hover">
            <thead>
            <tr>
              <th >角色名称</th>
              <th >角色权限</th>
              <th >操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
              <td>{{ item.name }}</td>
              <td class="extend-hover">
                <div style="padding: 5px">
                  <el-tag class="ps-name" :type="{'1':'warning','2':'success','3':'primary','4':'danger'}[perm.type]"
                          v-for="perm in item.permissions">{{ perm.name}}
                  </el-tag>
                  <!--<span v-for="perm in item.permissions" class="sssss">{{ perm.name}}</span>-->
                </div>
              </td>

              <td class="td-opeation">
                <span v-if="item.readonly!=1" class="fa fa-trash table-hovers table-hovers_display"
                        @click=doDelete(item)></span>
                <span v-if="item.readonly!=1" class="fa fa-edit table-hovers table-hovers_display"
                      @click=editrole(item)></span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>
<style scoped>
  th {
    text-align: center;
    background: #367fa9 !important;
    color: white !important;
  }

  td {
    text-align: center;
  }
</style>
<script>
  export default {
    data: function () {
      return {

        items: [], //
      }
    },
    methods: {
      addrole() {
        this.$router.push({
          path: '/home/addrole'
        })
      },
      editrole(item) {
        this.$router.push({
          path: '/home/addrole?id=' + item.id
        })
      },
      doDelete(item){
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$http.delete('/role/' + item.id)
              .then((r) => {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.getRoleList()
              })
              .catch((err) => {
                console.log(err)
              })
          });
      },

      getRoleList: function () {
        let url = '/role/'
        this.$http.get(url)
          .then((res) => {
            this.items = res.body
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    mounted: function () {
      this.getRoleList();
    },
  }
</script>


<style rel="stylesheet/less" lang="less">
  .ps-name{
    margin:0 3px   3px 0 ;
  }

</style>

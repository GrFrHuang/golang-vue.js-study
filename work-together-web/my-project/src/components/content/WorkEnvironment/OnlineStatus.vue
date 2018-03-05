<template>
  <div>
    <section class="content-header">
      <h1>
        上线状态
        <small>查看人员上线状态</small>
      </h1>
    </section>
    <div class="content">
      <div class="box" v-loading="isLoading">
        <div class="box-body">
          <el-row :gutter="20">
            <el-col :span="2" v-for="(o, index) in userList" :key="o.Id">
              <el-card :body-style="{ padding: '5px' }">
                <img v-if="o.OnlineStatus === 1" style="width: 80%;margin: auto;display: block"
                     src="../../../../static/img/user1.png">
                <img v-else style="width: 80%;margin: auto;display: block" src="../../../../static/img/user2.png">
                <div>
                  <p style="text-align: center;padding-top: 10px">{{ o.NickName }}</p>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <!-- /.box-body -->
      </div>
    </div>
  </div>
</template>
<style scoped>

</style>
<script type="text/ecmascript-6">
  export default {
    data: function () {
      return {
        isLoading: false,
        ontimes: false,
        userList: null,
        total: ''
      }
    },
    mounted: function () {
      this.isLoading = true
      this.$http.get('/desktop/')
        .then(response => {
          this.userList = response.data.data
          this.total = response.data.total
          this.isLoading = false
          this.load()
        });
    },
    methods: {
      load() {
        if (this.ontimes == false) {
          this.t1 = setInterval(() => {
            this.isLoading = true
            this.$http.get('/desktop/')
              .then(response => {
                this.userList = response.data.data
                this.total = response.data.total
                this.isLoading = false
              });
          }, 10000)
        } else {
          clearInterval(this.t1)
        }
      }
    },
    destroyed() {
      this.ontimes = true
      this.load()
    }
  }
</script>

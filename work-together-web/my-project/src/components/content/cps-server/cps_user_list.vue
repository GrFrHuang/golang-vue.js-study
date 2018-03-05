<template>
  <div>
    <section class="content-header">
      <h1>
        推广用户列表
        <small>账号审核</small>
      </h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="账号">
              <el-input v-model="params.user_name" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item label="日期">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择开始日期" v-model="params.start_time"
                                style="width: 100%;"></el-date-picker>
              </el-col>
              <span style="display: block; float: left"> - </span>
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择结束日期" v-model="params.end_time"
                                style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button type="primary"><a style="color: white" :href="downloadUrl" :disabled="downloadUrl==''">导出excel</a></el-button>
            </el-form-item>
            <p>共{{ total }}个注册人</p>
          </el-form>
        </div>
        <div class="box-body">
          <table class="table table-bordered table-hover">
            <thead>
            <tr>
              <th>账号</th>
              <th>等级</th>
              <th>余额</th>
              <th>押金</th>
              <th>实名认证</th>
              <th>注册时间</th>
              <th>审核状态</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
              <td>{{ item.user_name }}
                <template v-if="item.principal != ''"> ({{ item.principal }})</template>
              </td>
              <td>{{ item.level }}</td>
              <td>{{ item.money }}</td>
              <td>{{ item.total_cash_pledge_money }}</td>
              <td>
                <span v-if="item.is_bind_real_info == 0">未实名认证</span>
                <span v-else-if="item.is_bind_real_info == 1">已完成个人认证</span>
                <span v-else-if="item.is_bind_real_info == 2">已完成企业认证</span>
                <span v-else-if="item.is_bind_real_info == 3">已填写个人认证</span>
                <span v-else="item.is_bind_real_info == 4">已填写企业认证</span>
              </td>
              <td>{{ item.create_time }}</td>
              <td>{{ item.status_name }}</td>
              <td>
                <a v-if="item.is_bind_real_info !== 0" title="认证详情" style="cursor:pointer"
                   @click="realInfoDialog(item.user_id, item.user_name, item.is_bind_real_info)">认证信息</a>
                <template v-if="item.status == 0 ">
                  <a title="通过审核" style="cursor:pointer" @click="auditSuccess(item.user_name)">通过</a>
                  <span> | </span>
                  <a title="不通过审核" style="cursor:pointer" @click="auditFault(item.user_name)">不通过</a>
                </template>
                <a v-if="item.status != 0 " title="重新审核" style="cursor:pointer"
                   @click="auditReset(item.user_name)">重新审核</a>
                <a v-if="item.status == 1 || item.status == 3" title="设置等级" style="cursor:pointer"
                   @click="openDialog(item.user_name, item.grade)">设置等级</a>
                <a title="补点比例" style="cursor:pointer" @click="MakeUpTheRatio(item)">补点比例</a>
                <a title="设置区域" style="cursor:pointer" @click="SetTheArea(item)">设置区域</a>
              </td>
            </tr>
            </tbody>
          </table>
          <el-pagination
            v-show="total > per_page"
            @current-change="onCurrentChange"
            :current-page="page"
            :page-size="per_page"
            :total="total"
            layout="prev, pager, next, jumper">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      title="设置地区"
      v-model="set_the_area"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <div @close="closeDialogArea" class="box">
        <div class="box-header with-border">
          <div class="col-md-8 form-horizontal">
            <div class="form-group">
              <div>
                <p>请选择地区：</p>
                <el-radio class="radio" v-model="the_area" label="0">华北地区</el-radio>
                <el-radio class="radio" v-model="the_area" label="1">华中地区</el-radio>
                <el-radio class="radio" v-model="the_area" label="2">华东地区</el-radio>
                <el-radio class="radio" v-model="the_area" label="3">华南地区</el-radio>
                <el-radio class="radio" v-model="the_area" label="4">西北地区</el-radio>
                <el-radio class="radio" v-model="the_area" label="5">东北地区</el-radio>
                <el-radio class="radio" v-model="the_area" label="6">西南地区</el-radio>
              </div>
            </div>
            <div class="col-sm-10">
              <el-button type="primary" @click="setUserArea">保存</el-button>
              <el-button @click="closeDialogArea" type="primary">取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="设置等级"
      v-model="levelShow"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <div @close="closeDialog" class="box">
        <div class="box-header with-border">
          <div class="col-md-8 form-horizontal">
            <div class="form-group">
              <div>
                <p>请选择等级：</p>
                <el-radio class="radio" v-model="level" label="0">v0</el-radio>
                <el-radio class="radio" v-model="level" label="1">v1</el-radio>
                <el-radio class="radio" v-model="level" label="2">v2</el-radio>
                <el-radio class="radio" v-model="level" label="3">v3</el-radio>
                <el-radio class="radio" v-model="level" label="4">v4</el-radio>
                <el-radio class="radio" v-model="level" label="5">v5</el-radio>
                <el-radio class="radio" v-model="level" label="6">v6</el-radio>
                <el-radio class="radio" v-model="level" label="7">v7</el-radio>
              </div>
            </div>
            <div class="col-sm-10">
              <el-button type="primary" @click="setUserLevel">保存</el-button>
              <el-button @click="closeDialog" type="primary">取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="补点比例"
      v-model="onMakeUpTheRatio"
      top="5%"
      size="small"
      :close-on-click-modal="false">
      <label
        style="width: 100px;text-align: right;vertical-align: middle;line-height: 1;padding: 11px 12px 11px 0;box-sizing: border-box;font-size: 14px;">账号：</label>
      <span>{{ onuser_name }}（{{ names }}）</span>
      <el-form :model="MakeUpTheRatioForm" ref="MakeUpTheRatioForm" label-width="100px" class="demo-dynamic">
        <div style="border: 1px solid rgba(0,0,0,0.27);padding-right: 20px;padding-top: 20px;margin-bottom: 20px"
             v-for="(domain, index) in MakeUpTheRatioForm.domains" :key="domain.key">
          <el-form-item label="流水：">
            <el-input type="number" v-model="domain.ladder_switch"></el-input>
          </el-form-item>
          <el-form-item
            :label="'补点：'"
          >
            <el-input type="number" v-model="domain.ladder_info"></el-input>
            <el-button @click.prevent="removeDomain(domain)">删除</el-button>
          </el-form-item>
        </div>
        <label
          style="width: 100px;text-align: right;vertical-align: middle;line-height: 1;padding: 11px 12px 11px 0;box-sizing: border-box;font-size: 14px;">账号：</label>
        <span>
          <el-switch
            v-model="MakeUpTheRatioForm.ladder_info"
            on-color="#13ce66"
            off-color="#ff4949">
          </el-switch>
        </span>
        <el-form-item>
          <el-button type="primary" @click="submitForm(MakeUpTheRatioForm)">提交</el-button>
          <el-button @click="addDomain">新增补点</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="认证信息"
      v-model="realInfoShow"
      top="5%"
      size="small">
      <div @close="realInfoClose" class="box">
        <div class="box-header with-border">
          <div class="col-md-8 form-horizontal">
            <div class="form-group">
              <div class="realInfo" v-if="realInfo.type == 1">
                <p><span>类型：</span> 个人认证</p>
                <p><span>推广名称：</span> {{ realInfo.name }}</p>
                <p><span>负责人：</span> {{ realInfo.principal }}</p>
                <p><span>身份证号：</span> {{ realInfo.id_number }}</p>
                <p><span>邮箱：</span> {{ realInfo.email }}</p>
                <p><span>QQ：</span> {{ realInfo.qq }}</p>
                <p><span>身份证照片：</span></p>
                <p>
                  <el-col :span="11">
                    <el-card :body-style="{ padding: '0px' }">
                      <img style="width: 100%;height: 100px"  onerror="this.src='../../../../static/moren.png'" :src="realInfo.id_card_photo_1" class="image">
                      <a style="color: rgb(43, 171, 247);" target="view_window" v-if="realInfo.id_card_photo_1 && realInfo.id_card_photo_1.indexOf('.pdf') !== -1" :href="realInfo.id_card_photo_1">查看上传文件</a>
                      <div style="padding: 14px;">
                        <span>正面</span>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col :span="11" :offset="2">
                    <el-card :body-style="{ padding: '0px' }">
                      <img style="width: 100%;height: 100px" onerror="this.src='../../../../static/moren.png'" :src="realInfo.id_card_photo_2" class="image">
                      <a style="color: rgb(43, 171, 247);" target="view_window" v-if="realInfo.id_card_photo_2 && realInfo.id_card_photo_2.indexOf('.pdf') !== -1" :href="realInfo.id_card_photo_2">查看上传文件</a>
                      <div style="padding: 14px;">
                        <span>反面</span>
                      </div>
                    </el-card>
                  </el-col>
                </p>
              </div>
              <div class="realInfo" v-else>
                <p><span>类型：</span> 企业认证</p>
                <p><span>企业名称：</span> {{ realInfo.name }}</p>
                <p><span>负责人：</span> {{ realInfo.principal }}</p>
                <p><span>邮箱：</span> {{ realInfo.email }}</p>
                <p><span>QQ：</span> {{ realInfo.qq }}</p>
                <p><span>营业执照：</span></p>
                <p  v-if="realInfo.business_license && realInfo.business_license.indexOf('.pdf') !== -1">
                  <el-col style="width: 150px">
                    <el-card :body-style="{ padding: '0px' }">
                      <img style="width: 150px;height: 150px" onerror="this.src='../../../../static/moren.png'" :src="realInfo.business_license" class="image">
                      <a style="color: rgb(43, 171, 247);" target="view_window" v-if="realInfo.business_license && realInfo.business_license.indexOf('.pdf') !== -1" :href="realInfo.business_license">查看上传文件</a>
                    </el-card>
                  </el-col>
                </p>
                <p v-if="realInfo.business_license && realInfo.business_license.indexOf('.pdf') === -1">
                  <el-col :span="16">
                    <el-card :body-style="{ padding: '0px' }">
                      <img style="width: 100%;height: 100px" :src="realInfo.business_license" class="image">
                    </el-card>
                  </el-col>
                </p>
              </div>
            </div>
            <div class="col-sm-10">
              <el-button type="primary" v-if="!realInfo.is_bind"
                         @click="setRealInfoStatus(realInfo.user_id, realInfo.user_name)">通过
              </el-button>
              <el-button @click="realInfoClose" type="primary">取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped>
  th {
    text-align: center;
    background: #367fa9 !important;
    color: white !important;
  }

  .realInfo span {
    font-weight: bold;
  }

  td {
    text-align: center;
  }

  .image {
    width: 100%;
    display: block;
  }

</style>
<script>
  export default {
    data: function () {
      return {
        MakeUpTheRatioForm: {
          domains: [{
            ladder_switch: '',
            ladder_info: ''
          }],
          ladder_info: true
        },
        realInfo: '',
        names: '',
        onuser_name: '',
        onuser_id: '',
        downloadUrl: "", // 下载链接
        realInfoShow: false,
        levelShow: false,
        set_the_area: false,
        onMakeUpTheRatio: false,
        level: -1,
        the_area: -1,
        page: 1,
        per_page: 15,
        total: 0,
        items: [],
        token: '',
        userName: "",
        params: {
          start_time: '',
          end_time: '',
          user_name: ''
        }
      }
    },
    mounted: function () {
      this.token = sessionStorage.getItem("token")
      this.getUserList()
    },
    methods: {
      addDomain() {
        this.MakeUpTheRatioForm.domains.push({
          ladder_switch: '',
          ladder_info: '',
          key: Date.now()
        });
      },
      submitForm(v) {
        v.domains = JSON.stringify(v.domains)
        let ladder_info
        if (v.ladder_info == true) {
          ladder_info = 1
        } else {
          ladder_info = 0
        }
        console.log(v)
        let form = new (FormData)
        form.append("ladder_info", v.domains)
        form.append("user_id", this.onuser_id)
        form.append("ladder_switch", ladder_info)
        form.append("token", this.token)
        this.$http.put(ENV.CPS_HOST_URL + "/user/set_ladder_info", form).then(response => {
          this.$message.success('设置成功')
          v.domains = JSON.parse(v.domains)
          this.getUserList()
          this.onMakeUpTheRatio = false
        }, error => {
          v.domains = JSON.parse(v.domains)
          this.$message.error(error.body)
          this.onMakeUpTheRatio = false
        })
      },
      removeDomain(item) {
        var index = this.MakeUpTheRatioForm.domains.indexOf(item)
        if (index !== -1) {
          this.MakeUpTheRatioForm.domains.splice(index, 1)
        }
      },
      setRealInfoStatus(userId, userName) {
        this.$confirm('确认通过用户【' + userName + '】的实名认证吗？').then(_ => {
          let form = new (FormData)
          form.append("user_id", userId)
          form.append("token", this.token)
          this.$http.put(ENV.CPS_HOST_URL + "/user/change_real_info_status", form).then(response => {
            this.$message.success('通过用户【' + userName + '】实名认证成功')
            this.getUserList()
            this.realInfoClose()
          }, error => {
            this.$message.error(error.body)
          })
        })
      },
      // 设置区域
      SetTheArea(v) {
        switch(v.area){
          case '华北地区':
            this.the_area='0';
            break;
          case '华中地区':
            this.the_area='1';
            break;
          case '华东地区':
            this.the_area='2';
            break;
          case '华南地区':
            this.the_area='3';
            break;
          case '西北地区':
            this.the_area='4';
            break;
          case '东北地区':
            this.the_area='5';
            break;
          case '西南地区':
            this.the_area='6';
            break;
          default:
            this.the_area=-1
        }
        this.set_the_area = true
        this.onuser_id = v.user_id
      },
      setUserArea () {
        let theArea
        switch(this.the_area){
          case '0':
            theArea='华北地区';
            break;
          case '1':
            theArea='华中地区';
            break;
          case '2':
            theArea='华东地区';
            break;
          case '3':
            theArea='华南地区';
            break;
          case '4':
            theArea='西北地区';
            break;
          case '5':
            theArea='东北地区';
            break;
          case '6':
            theArea='西南地区';
            break;
        }
        let params = new FormData()
        params.append('token', this.token)
        params.append('area', theArea)
        this.$http.put(ENV.CPS_HOST_URL + "/user/set_area/" + this.onuser_id, params).then(response => {
          this.getUserList()
          this.set_the_area = false
        }, (error) => {
          this.$message.error(error.body)
          this.set_the_area = false
        })
      },
      MakeUpTheRatio(v) {
        this.onMakeUpTheRatio = true
        this.names = v.principal
        this.onuser_name = v.user_name
        this.onuser_id = v.user_id
        this.$http.get(ENV.CPS_HOST_URL + "/user/get_ladder_info/" + v.user_id,
          {params: {token: this.token}}
        ).then(response => {
          if (response.body.ladder_info != '') {
            response.body.domains = JSON.parse(response.body.ladder_info)
            this.MakeUpTheRatioForm = response.body
            if (response.body.ladder_switch == 1) {
              this.MakeUpTheRatioForm.ladder_info = true
            } else {
              this.MakeUpTheRatioForm.ladder_info = false
            }
          } else {
            response.body.domains = [{
              ladder_switch: '',
              ladder_info: ''
            }]
            this.MakeUpTheRatioForm = response.body
            this.MakeUpTheRatioForm.ladder_info = true
          }
        }, (error) => {
          this.$message.error(error.body)
        })
      },
      realInfoDialog(userId, userName, isBind) {
        this.$http.get(ENV.CPS_HOST_URL + "/user/get_real_info_for_work",
          {params: {token: this.token, user_id: userId}}
        ).then(response => {
          console.log(response.body)
          this.realInfo = response.body
          this.realInfo.user_name = userName
          if (isBind == 1 || isBind == 2)
            this.realInfo.is_bind = true
          else
            this.realInfo.is_bind = false
          this.realInfoShow = true
        }, (error) => {
          this.$message.error(error.body)
        })
      },
      realInfoClose() {
        this.realInfoShow = false
        this.realInfo = ''
      },
      closeDialog() {
        this.levelShow = false
        this.level = -1
      },
      closeDialogArea() {
        this.set_the_area = false
        this.the_area = -1
      },
      openDialog(userName, level) {
        console.log(level)
        this.level = "" + level
        this.userName = userName
        this.levelShow = true
      },
      setUserLevel() {
        if (this.level == -1) {
          return
        }

        this.$http.put(ENV.CPS_HOST_URL + "/auth/change_user_level", {
          token: this.token,
          user_name: this.userName,
          level: +this.level
        }).then((response) => {
          this.$message.success('设置成功')
          this.getUserList()
          this.closeDialog()
        }, (error) => {
          this.$message.error(error.body)
        })

      },
      getUserList() {
        let query = {
          token: this.token, page: this.page, per_page: this.per_page,
          start_time: this.params.start_time / 1000, end_time: this.params.end_time / 1000,
          user_name: this.params.user_name
        }
        this.downloadUrl = ENV.CPS_HOST_URL + '/auth/get_all_user_excel?token=' + query.token +
          '&page=' + query.page + '&per_page=' + query.per_page +
          '&start_time=' + query.start_time + '&end_time=' +
          query.end_time + '&user_name=' + query.user_name;
        this.$http.get(ENV.CPS_HOST_URL + "/auth/work_user_list",
          {
            params: query
          }
        ).then(response => {
          this.items = response.body.data
          this.total = response.body.total
        }, (error) => {
          if (error.status === 403) {
            this.$router.push({path: '/login'})
          } else {
            this.$message.error(error.body)
          }
        })
      },
      onSubmit() {
        this.getUserList()
      },
      onCurrentChange(currentPage) {
        this.page = currentPage
        this.getUserList()
      },
      auditSuccess(userName) {
        this.$confirm('确认通过用户【' + userName + '】吗？').then(_ => {
          this.$http.post(ENV.CPS_HOST_URL + "/auth/change_status", {
            token: this.token,
            user_name: userName,
            status: 1
          }).then((response) => {
            this.$message.success('通过审核成功')
            this.getUserList()
          }, (error) => {
            this.$message.error(error.body)
          })
        })
      },
      auditFault(userName) {
        this.$confirm('确认不同通过用户【' + userName + '】吗？').then(_ => {
          this.$http.post(ENV.CPS_HOST_URL + "/auth/change_status", {
            token: this.token,
            user_name: userName,
            status: 2
          }).then((response) => {
            this.$message.success('不通过审核成功')
            this.getUserList()
          }, (error) => {
            this.$message.error(error.body)
          })
        })
      },
      auditReset(userName) {
        this.$confirm('确认重新审核【' + userName + '】吗？').then(_ => {
          this.$http.post(ENV.CPS_HOST_URL + "/auth/change_status", {
            token: this.token,
            user_name: userName,
            status: 0
          }).then((response) => {
            this.$message.success('重置成功')
            this.getUserList()
          }, (error) => {
            this.$message.error(error.body)
          })
        })
      }
    }
  }
</script>

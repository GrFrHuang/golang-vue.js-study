<template>
  <div>
    <section class="content-header">
      <h1>
        公告信息管理
        <small>公告信息列表</small>
      </h1>
      <!--<ol class="breadcrumb">-->
      <!--<li><i class="fa fa-dashboard"></i></li>-->
      <!--<li>-->
      <!--<router-link to="/home/user">用户审核</router-link>-->
      <!--</li>-->
      <!--</ol>-->
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <el-form :inline="true" class="demo-form-inline" >
            <el-form-item label="是否加入滚动条">
              <el-select v-model="roll" placeholder="请选择">
                <el-option
                  v-for="item in roll_select"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="公告类型">
              <el-select v-model="message_type" placeholder="请选择">
                <el-option
                  v-for="item in message_type_select"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-button type="primary" @click="getList()">查询</el-button>
          </el-form>

        </div>
        <div class="box-header with-border">
          <el-button style="float: right" type="primary" @click="official">新增公告</el-button>
        </div>
        <div class="box-body">
          <table class="table table-bordered table-hover">
            <thead>
            <tr>
              <th>公告类型</th>
              <th>公告名称</th>
              <th>生效时间</th>
              <th>失效时间</th>
              <th>排序</th>
              <th>发送者</th>
              <th>是否加入滚动条</th>
              <th>接收者</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
              <td>{{ item.msg_type_name }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.start_time | stampToTimeFull }}</td>
              <td>{{ item.end_time | stampToTimeFull }}</td>
              <td>{{ item.sort }}</td>
              <td>{{ item.sender }}</td>
              <td><span v-if="item.roll === 1 ">是</span><span v-else>否</span></td>
              <td>{{ item.receiver }}</td>
              <td>
                <a v-if="item.status != 0" title="修改" style="cursor:pointer" @click="toview(item)">修改</a>&nbsp;&nbsp;&nbsp;
                <a v-if="item.status != 0" title="删除" style="cursor:pointer" @click="auditReset(item)">删除</a>
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
    <el-dialog title="新增公告" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-form :model="form">
        <el-form-item label="公告名称" :label-width="formLabelWidth">
          <el-input :disabled="disableds" v-model="form.Title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="公告类型" :label-width="formLabelWidth">
          <el-select :disabled="disableds" v-model="form.MessageType" placeholder="请选择公告类型">
            <el-option label="系统消息" value="global"></el-option>
            <el-option label="公告" value="public"></el-option>
            <el-option label="私信" value="private"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生效时间" :label-width="formLabelWidth">
          <el-date-picker
            :disabled="disableds"
            v-model="form.StartTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="form.MessageType !== 'private'" label="失效时间" :label-width="formLabelWidth">
          <el-date-picker
            :disabled="disableds"
            v-model="form.EndTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="form.status === 2" label="接收对象" :label-width="formLabelWidth">
          <el-input :disabled="disableds" v-model="form.user_name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item v-if="form.MessageType === 'global' && form.status === 1" label="接收对象"
                      :label-width="formLabelWidth">
          <el-autocomplete
            class="inline-input"
            :disabled="true"
            style="width: 193px"
            v-model="form.reciv"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            :trigger-on-focus="false"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item v-if="form.MessageType === 'public' && form.status === 1" label="接收对象"
                      :label-width="formLabelWidth">
          <el-select style="width: 193px" v-model="form.receivers" clearable placeholder="请选择">
            <el-option
              v-for="item in form.receiv"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.MessageType === 'private' && form.status === 1" label="接收对象"
                      :label-width="formLabelWidth">
          <el-tag
            :key="tag"
            v-for="tag in form.dynamicTags"
            :closable="true"
            :close-transition="false"
            @close="handleCloseha(tag)"
          >
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="form.inputVisible"
            v-model="form.receiver"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <!--<el-autocomplete-->
          <!--class="input-new-tag"-->
          <!--v-if="form.inputVisible"-->
          <!--v-model="form.receiver"-->
          <!--ref="saveTagInput"-->
          <!--size="mini"-->
          <!--:fetch-suggestions="querySearch"-->
          <!--placeholder="请输入内容"-->
          <!--:trigger-on-focus="false"-->
          <!--@keyup.enter.native="handleInputConfirm"-->
          <!--@blur="handleInputConfirm"-->
          <!--@select="handleSelect"-->
          <!--&gt;</el-autocomplete>-->
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input  style="width: 100px" type="number"  :min="1"  v-model="form.Sort" auto-complete="off"></el-input>
          &nbsp;数字越大越靠前
        </el-form-item>
        <el-form-item label="是否加入滚动消息" :label-width="formLabelWidth">
          <el-tooltip :content="'Switch value: ' + Roll" placement="top" >
            <el-switch
              v-model="Roll"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0">
            </el-switch>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="公告内容" :label-width="formLabelWidth">
          <VueEditor :disabled="disableds" v-model="form.description"></VueEditor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button  type="primary" @click="addregion(form)">确 定</el-button>
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

  td {
    text-align: center;
  }
</style>
<script>
  import { VueEditor } from 'vue2-editor'

  export default {
    components: {
      VueEditor
    },
    data: function () {
      return {
        postToken: "",
        Roll: false,
        page: 1,
        per_page: 15,
        total: 0,
        items: [],
        roll:'',
        message_type:'',
        roll_select: [
          { value: '',
            label: '全部'
          },
          { value: '0',
            label: '否'
          },
          { value: '1',
            label: '是'
          }
        ],
        message_type_select: [
          { value: '',
            label: '全部'
          },
          { value: 'private',
            label: '私信'
          },
          { value: 'public',
            label: '公共消息'
          },

          { value: 'global',
            label: '系统消息'
          }
        ],
        dialogFormVisible: false,
        disableds: false,
        token: '',
        params: {
          start_time: '',
          end_time: '',
          user_name: '',
          game_name: ''
        },
        form: {
          Id: 0,
          Sort: 0,
          Roll: '0',
          Title: '',
          MessageType: '',
          reciv: '全员',
          receivers: '',
          status: 1,
          StartTime: '',
          dynamicTags: [],
          inputVisible: false,
          receiv: [{
            value: 1,
            label: '一级会长'
          }, {
            value: 2,
            label: '二级会长'
          }, {
            value: 3,
            label: '三级会长'
          }],
          EndTime: '',
          receiver: '',
          Message: '',
          restaurants: [],
        },
        formLabelWidth: '70px'
      }
    },
    mounted: function () {
      this.token = sessionStorage.getItem('token')
      this.getList()
      this.form.restaurants = this.loadAll()
    },
    methods: {
      handleSelect (item) {
        console.log(item)
      },
      addregion (v) {
        var roll = this.Roll ? 1:0
        var sort = parseInt(v.Sort)
        console.log(v)

        if(v.Id != 0 && v.Id != undefined){
          let post = {
            'msg': {
              'Sort': sort,
              'Roll': roll,
              'Id': v.Id,
            },
            'token': this.token,
          }

          this.$http.put(ENV.CPS_HOST_URL + '/work_together_msg/', post).then((response) => {
            this.$message.success('修改成功')
            this.dialogFormVisible = false
            this.getList()
          }, (error) => {
            this.$message.error(error.body)
            this.postToken = ""
          })

        }else{
          if(this.postToken != "") {
            return
          }

          let userNames
          let UserType
          if (v.MessageType === 'global') {
            userNames = ''
          } else if (v.MessageType === 'public') {
            userNames = ''
            UserType = v.receivers
          } else {
            userNames = v.dynamicTags.join(",")
          }
          let post = {
            'msg': {
              'StartTime': Date.parse(v.StartTime) / 1000,
              'EndTime': Date.parse(v.EndTime) / 1000,
              'Title': v.Title,
              'MessageType': v.MessageType,
              'Message': v.description,
              'UserType': UserType,
              'Sort': sort,
              'Roll': roll,
            },
            'token': this.token,
            'user_name': userNames
          }
          this.postToken = "waiting"
          this.roll = '0'
          this.$http.post(ENV.CPS_HOST_URL + '/work_together_msg/', post).then((response) => {
            this.$message.success('发布成功')
            this.dialogFormVisible = false
            this.getList()
          }, (error) => {
            this.$message.error(error.body)
            this.postToken = ""
          })
        }

      },
      handleCloseha (tag) {
        this.form.dynamicTags.splice(this.form.dynamicTags.indexOf(tag), 1)
      },
      showInput () {
        this.form.inputVisible = true
        console.log(this)
        this.$nextTick(_ => {
          console.log(this.$refs.saveTagInput)
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },

      handleInputConfirm () {
        let inputValue = this.form.receiver
        if (inputValue) {
          this.form.dynamicTags.push(inputValue)
        }
        this.form.inputVisible = false
        this.form.receiver = ''
      },
      querySearch (queryString, cb) {
        var restaurants = this.form.restaurants
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter (queryString) {
        return (restaurant) => {
          return (restaurant.value.indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleClose (done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      },
      loadAll () {
        return [
          {'value': '三全鲜食（北新泾店）', 'address': '长宁区新渔路144号'},
          {'value': 'Hot honey 首尔炸鸡（仙霞路）', 'address': '上海市长宁区淞虹路661号'},
          {'value': '新旺角茶餐厅', 'address': '上海市普陀区真北路988号创邑金沙谷6号楼113'},
          {'value': '泷千家(天山西路店)', 'address': '天山西路438号'},
          {'value': '胖仙女纸杯蛋糕（上海凌空店）', 'address': '上海市长宁区金钟路968号1幢18号楼一层商铺18-101'},
          {'value': '贡茶', 'address': '上海市长宁区金钟路633号'},
          {'value': '豪大大香鸡排超级奶爸', 'address': '上海市嘉定区曹安公路曹安路1685号'},
          {'value': '茶芝兰（奶茶，手抓饼）', 'address': '上海市普陀区同普路1435号'},
          {'value': '十二泷町', 'address': '上海市北翟路1444弄81号B幢-107'},
          {'value': '星移浓缩咖啡', 'address': '上海市嘉定区新郁路817号'},
          {'value': '阿姨奶茶/豪大大', 'address': '嘉定区曹安路1611号'},
          {'value': '新麦甜四季甜品炸鸡', 'address': '嘉定区曹安公路2383弄55号'},
          {'value': 'Monica摩托主题咖啡店', 'address': '嘉定区江桥镇曹安公路2409号1F，2383弄62号1F'},
          {'value': '浮生若茶（凌空soho店）', 'address': '上海长宁区金钟路968号9号楼地下一层'},
          {'value': 'NONO JUICE  鲜榨果汁', 'address': '上海市长宁区天山西路119号'},
          {'value': 'CoCo都可(北新泾店）', 'address': '上海市长宁区仙霞西路'},
          {'value': '快乐柠檬（神州智慧店）', 'address': '上海市长宁区天山西路567号1层R117号店铺'},
          {'value': 'Merci Paul cafe', 'address': '上海市普陀区光复西路丹巴路28弄6号楼819'},
          {'value': '猫山王（西郊百联店）', 'address': '上海市长宁区仙霞西路88号第一层G05-F01-1-306'},
          {'value': '枪会山', 'address': '上海市普陀区棕榈路'},
          {'value': '纵食', 'address': '元丰天山花园(东门) 双流路267号'},
          {'value': '钱记', 'address': '上海市长宁区天山西路'},
          {'value': '壹杯加', 'address': '上海市长宁区通协路'},
          {'value': '唦哇嘀咖', 'address': '上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元'},
          {'value': '爱茜茜里(西郊百联)', 'address': '长宁区仙霞西路88号1305室'},
          {'value': '爱茜茜里(近铁广场)', 'address': '上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺'},
          {'value': '鲜果榨汁（金沙江路和美广店）', 'address': '普陀区金沙江路2239号金沙和美广场B1-10-6'},
          {'value': '开心丽果（缤谷店）', 'address': '上海市长宁区威宁路天山路341号'},
          {'value': '超级鸡车（丰庄路店）', 'address': '上海市嘉定区丰庄路240号'},
          {'value': '妙生活果园（北新泾店）', 'address': '长宁区新渔路144号'},
          {'value': '香宜度麻辣香锅', 'address': '长宁区淞虹路148号'},
          {'value': '凡仔汉堡（老真北路店）', 'address': '上海市普陀区老真北路160号'},
          {'value': '港式小铺', 'address': '上海市长宁区金钟路968号15楼15-105室'},
          {'value': '蜀香源麻辣香锅（剑河路店）', 'address': '剑河路443-1'},
          {'value': '北京饺子馆', 'address': '长宁区北新泾街道天山西路490-1号'},
          {'value': '饭典*新简餐（凌空SOHO店）', 'address': '上海市长宁区金钟路968号9号楼地下一层9-83室'},
          {'value': '焦耳·川式快餐（金钟路店）', 'address': '上海市金钟路633号地下一层甲部'},
          {'value': '动力鸡车', 'address': '长宁区仙霞西路299弄3号101B'},
          {'value': '浏阳蒸菜', 'address': '天山西路430号'},
          {'value': '四海游龙（天山西路店）', 'address': '上海市长宁区天山西路'},
          {'value': '樱花食堂（凌空店）', 'address': '上海市长宁区金钟路968号15楼15-105室'},
          {'value': '壹分米客家传统调制米粉(天山店)', 'address': '天山西路428号'},
          {'value': '福荣祥烧腊（平溪路店）', 'address': '上海市长宁区协和路福泉路255弄57-73号'},
          {'value': '速记黄焖鸡米饭', 'address': '上海市长宁区北新泾街道金钟路180号1层01号摊位'},
          {'value': '红辣椒麻辣烫', 'address': '上海市长宁区天山西路492号'},
          {'value': '(小杨生煎)西郊百联餐厅', 'address': '长宁区仙霞西路88号百联2楼'},
          {'value': '阳阳麻辣烫', 'address': '天山西路389号'},
          {'value': '南拳妈妈龙虾盖浇饭', 'address': '普陀区金沙江路1699号鑫乐惠美食广场A13'}
        ]
      },
      getList () {
        this.$http.get(ENV.CPS_HOST_URL + '/work_together_msg/?token=' + this.token + '&page=' + this.page + '&per_page=' + this.per_page+'&roll='+this.roll+'&message_type='+this.message_type).then(response => {
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
      official () {
        this.postToken = ""
        this.dialogFormVisible = true
        this.form = {
          Title: '',
          MessageType: '',
          reciv: '全员',
          receivers: '',
          status: 1,
          StartTime: '',
          dynamicTags: [],
          inputVisible: false,
          receiv: [{
            value: 1,
            label: '一级会长'
          }, {
            value: 2,
            label: '二级会长'
          }, {
            value: 3,
            label: '三级会长'
          }],
          EndTime: '',
          receiver: '',
          Message: '',
          restaurants: [],
        }
        this.disableds = false
        this.form.status = 1
      },
      onCurrentChange (currentPage) {
        this.page = currentPage
        this.getList()
      },
      toview (v) {
        this.$http.get(ENV.CPS_HOST_URL + '/work_together_msg/' + v.id + '?token=' + this.token).then((response) => {
          this.dialogFormVisible = true
          response.body.msg.user_name = response.body.user_name
          response.body.msg.StartTime = response.body.msg.StartTime * 1000
          response.body.msg.EndTime = response.body.msg.EndTime * 1000
          this.form = response.body.msg
          this.form.description = this.form.Message
          this.form.status = 2
          if (response.body.msg.Roll == 1){
            this.Roll = true
          }else {
            this.Roll = false
          }
          this.disableds = true
          console.log(response.body.msg)
        }, (error) => {
          this.$message.error(error.body)
        })
      },
      auditReset (v) {
        this.$http.delete(ENV.CPS_HOST_URL + '/work_together_msg/' + v.id + '?token=' + this.token).then((response) => {
          this.$message.success('删除成功')
          this.getList()
        }, (error) => {
          this.$message.error(error.body)
        })
      }
    }
  }
</script>

<template>
  <div class="row user_pages">
    <div class="str_type tab-pane active col-sm-12" id="tab_1zs">
      <div class="row type_ipts">
        <div class="col-sm-3">
          <input class="form-control" type="text" id="addTypeInput"
                 placeholder="请输入类型名称"/>
          <input class="btn btn-default type_btns" type="button" value="确认添加" @click="addType"/>
        </div>
      </div>
      <!--<p>已添加xxx个游戏类型</p>-->
      <div class="input_checked col-sm-8">
        <br/>
        <Tag
          v-for="tag in tags"
          :closable="!tag.is_deletable && type!=10 && type!=9"
          :key="tag.id"
          :close-transition="false"
          @close="handleClose(tag.id)"
        >{{tag.name}}</Tag>
      </div>
    </div>
  </div>
</template>
<style scope>
  .type_btns{
    min-width: 90px;
    margin-top: 20px;
  }
 .el-tag{
    margin-left: 10px;
  }
  #tab_1zs{
    padding-top: 30px;
  }
  .type_ipts{
    margin-left: 0;
  }
  .input_checked>input{
    margin: 15px 0;
    margin-left: 41px;
  }
  .input_checked>input:first-child,.input_checked>input:nth-child(3){
    margin-left: 41px;
  }
  .input_checked{
    border: 1px solid #000;
    padding: 10px;
    margin:30px 0;
    margin-left: 15px;
  }
</style>
<script type="text/javascript">
  import {Tag} from 'element-ui'
  import utils from '../../../publicjs/utils'
  export default {
    components: {
      Tag
    },
    props: ["type"],
    methods: {
      handleClose(tag) {
        this.deleteType(tag)
        this.tags.splice(this.tags.indexOf(tag), 1);
      },
      checkedAll: function () {
        let _this = this;
        console.log(_this.checkboxModel);
        if (this.allChecked) {
          _this.checkboxModel = [];

        } else {
          console.log(this.checked);
          _this.checkboxModel = [];
          _this.checkboxData.forEach(function (item) {
            _this.checkboxModel.push(item.id);
          });
        }
      },
      addType: function () {
        let body = {
          "name": $("#addTypeInput").val(),
          "type": this.type
        }
        if (body.name == "" || body.name == " ") {
            this.$message({
                type: "error",
                message: "类型名不能为空"
            })
            return
        }
        let post = utils.buildPostParams(body)
        let url = '/types'
        this.$http.post(url, post)
          .then((r) => {
            this.getType()
            document.getElementById("addTypeInput").value=""
          })
          .catch((err) => {
            this.$message({
                type: "error",
                message: err.body
            })
          })
      },
      getType: function () {
        let url = '/types?fields=id%2Cname%2Cis_deletable&query=type%3A'+this.type+"&limit=1000"
        this.$http.get(url)
          .then((res) => {
            this.tags = res.body
          })
          .catch((err) => {
            context.error = err.data
          })
      },
      deleteType: function (id) {
        let url = '/types/'
        this.$http.delete(url + id)
          .then((res) => {
            this.getType()
          })
        /*for(var i = 0; i < this.checkboxModel.length; i++) {
         this.$http.delete(url + this.checkboxModel[i])
         .then((res) => {
         this.getType()
         })
         }*/
      }
    },
    data() {
      return {
        checkboxData: [],
        checkboxModel: [],
        allChecked: false,
        tags: [],
      }
    },
    mounted:function () {
      this.getType()
    }
  }
</script>

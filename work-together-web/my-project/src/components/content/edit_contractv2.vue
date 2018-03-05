<template>
  <div>
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(initial,index) in initials" :label="initial.title" :name='initial.name'>
        <initialContract :editId="initial.editId" :readonly="initial.readonly" :flag="flag" :initials="initials" :rand="initial.rand"
                         :flush="flush" @close="onEditClose"></initialContract>
      </el-tab-pane>
      <!--<el-tab-pane label="+续签" name="second">-->
        <!--<div style="height: 300px"></div>-->
        <!--&lt;!&ndash;<el-button type="primary" @click="Contract">+续签</el-button>&ndash;&gt;-->
      <!--</el-tab-pane>-->
    </el-tabs>
    <el-dialog title="提示" v-model="dialogVisible" size="tiny">
      <p>是否续签此合同？</p>
      <p>（续签后将以续签合同为准）</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisibles">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style>
  .v-modal{
    z-index: 1000!important;
  }
</style>
<script>
  import initialContract from './InitialContract.vue'
  import utils from '../../publicjs/utils'

  export default {
    components: {
      initialContract
    },
    props: ['editId', 'readonly', 'flag', 'rand'],
    data() {
      return {
        activeName2: '1',
        initials:[],
        dialogVisible: false,
        flush: 0,
      };
    },
    methods: {
      onEditClose(needRefresh = false){
        this.$emit('close', needRefresh)
      },
      handleClick(tab, event) {
        if(this.activeName2 === 'second'){
          this.dialogVisible = true
        }
      },
      dialogVisibles () {
        this.dialogVisible = false

        let post = utils.buildPostParams({})
        var url = '/contract/renew/' + this.editId
        this.$http.put(url, post)
          .then((res) => {
            this.initials.splice(this.initials.length-1, 0, {
              title: "续签合同" + (this.initials.length-1) + '',
              editId: res.body,
              name: this.initials.length-1 + '',
              readonly: false
            });
            this.flush = Math.random()
            this.rand = Math.random()
            this.initials.splice(this.initials.length-1, 1)
            this.activeName2 = this.initials.length-1 + ''
          })
      },
      getEditIds(){
        let url = "/contract/getAllEditIds/" + this.editId;
        this.$http.get(url)
          .then((res) => {
            this.initials = []
            for(let i in res.body) {
              this.activeName2 = res.body.length-1 + ''
              this.initials.push({
                title: i==0?"初始合同":"续签合同"+i,
                editId: res.body[i].id,
                rand: Math.random(),
                name: i,
                readonly: this.readonly ? this.readonly : (res.body.length>1 ? (i==res.body.length-1 ? false: true) : this.readonly)
              })
            }
            if(res.body[res.body.length-1].effective_state == 2){
              this.initials[res.body.length-1].readonly = true
            }
            if(!this.readonly){
              //合同状态为已到期或已签订时，可续签
              if(res.body[res.body.length-1].state == 150 || res.body[res.body.length-1].state == 151){
                this.initials.push({
                  title: "+续签",
                  editId: res.body[0].id,
                  rand: Math.random(),
                  name: "second",
                  readonly: false
                })
              }
            }
          })
      }
    },
    mounted: function () {
      this.getEditIds()
    },
    watch:{
      rand(){
        this.getEditIds()
      }
    }
  };
</script>

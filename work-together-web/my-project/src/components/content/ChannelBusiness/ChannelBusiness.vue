<template>
  <div>
    <!-- /.box-header -->

    <!-- /.box-body -->
  </div>

</template>
<style scoped>
  ._list_tab_btn {
    margin-bottom: 10px;
  }

  .el-dialog__header {
    text-align: center;
  }

  #table_ids > .el-table__header-wrapper > table > thead > tr > th {
    text-align: center;
  }

  .el-tag {
    background-color: rgba(32, 159, 255, .1);
    border-color: rgba(32, 159, 255, .2);
    color: #20a0ff;
  }

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
  import Multiselect from 'vue-multiselect'
  import {Pagination} from 'element-ui'

  export default {
    components: {
      Multiselect,
    },
    props: ['items', 'downloadUrl'],

    data: function () {
      return {
        todos: [{
          text: '渠道名称'
        }, {
          text: '公司名称'
        }, {
          text: '平台名称'
        }, {
          text: '区域'
        }, {
          text: '公司网站'
        }, {
          text: '渠道属性'
        }, {
          text: '回款主体'
        }, {
          text: '公司联系人'
        }, {
          text: '备注'
        }, {
          text: '更新人'
        }, {
          text: '操作'
        },],

      }
    },
    methods: {
      getUsers() {
        let url = "/user/?limit=1000";
        this.$http.get(url)
          .then((res) => {
            this.users = res.body.data;
          })
      },

      goDetails: function (id) {
        var data = {id: id}
        this.$store.commit('SET_SHAREDATA', data)
        this.$router.push({path: '/home/editChannelBusiness/?id=' + id})
      },
      addgame: function () {
        this.$router.push({path: '/home/addChannelBusiness'})
      },

    },
    mounted: function () {
      let selected = [4, 6, 7]
      this.selectedHeader = selected
    }
  }
</script>

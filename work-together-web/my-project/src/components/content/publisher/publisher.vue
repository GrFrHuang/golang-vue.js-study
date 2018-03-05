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

  .max_widthv {
    max-width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
  }

  .max_widthv:hover {
    text-overflow: inherit;
    overflow: visible;
    white-space: pre-line;
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

      }
    },
    methods: {
      goDetails: function (id) {
        var data = {id: id}
        this.$store.commit('SET_SHAREDATA', data)
        this.$router.push({path: '/home/editpublisher/?id=' + id})
      },

      addgame: function () {
        this.$router.push({path: '/home/addpublisher'})
      },

    },
    mounted: function () {


    }
  }
</script>

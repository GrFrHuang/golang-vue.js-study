<template>

</template>
<style>

</style>
<style scoped>
  th{
    text-align: center;
    background:#367fa9!important;
    color: white!important;
  }
  td{
    text-align: center;
  }

</style>
<script>
  import Multiselect from 'vue-multiselect'
  import datepicker from 'vue-date'
  import utils from '../../../publicjs/utils'
  import {Pagination} from 'element-ui'

  export default {
    props: ['editId'],
    components: {
      Multiselect,
      datepicker,
      Pagination,
    },
    data: function () {
      return {
        items:[],
        selectedChannels: [],
        channels: [],
        selectedGames: [],
        games: [],
        time: [],
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        selectedHeader:[],
        table_header:[
          {
            id:0,
            header_name:"日期",
            state:false
          },{
            id:1,
            header_name:"名称",
            state:false
          },{
            id:2,
            header_name:"渠道名称",
            state:false
          },{
            id:3,
            header_name:"总流水",
            state:false
          },{
            id:4,
            header_name:"订单下载",
            state:true
          }
        ],
        pageInfo: {
          currentPage: 1,
          limit: ENV.PAGE_SHOW_COUNT,
          offset: 0,
          total: 0,
        },
        currentPage: 1,
        downloadUrl: "", // 下载链接
        sortData: {},
      }
    },
    methods: {
      showHeader: function () {
        for(let i in this.table_header){
          this.table_header[i].state = false
        }
        for(let i in this.selectedHeader){
          this.table_header[this.selectedHeader[i]].state = true
        }
      },
      handleCurrentChange(currentPage) {
        let offset = utils.buildOffsetByPage(currentPage, this.pageInfo.limit)
        this.pageInfo.offset = offset
        this.doGetOrderList(currentPage, this.sortData)
      },
      getGameSelectList: function () {
        var url = '/order/game/'
        this.$http.get(url)
          .then((res) => {
            this.games = res.body
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: err.body
            })
          })
      },
      getChannelSelectList: function () {
        let url = '/order/channel/'
        this.$http.get(url)
          .then((res) => {
            this.channels = res.body
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: err.body
            })
          })
      },
      parseQuery: function () {
        let gameIds = []
        if (this.selectedGames.length !== 0) {
          for (let i in this.selectedGames) {
            gameIds.push(this.selectedGames[i].game_id)
          }
        }
        let cps = []
        if (this.selectedChannels.length !== 0) {
          for (let i in this.selectedChannels) {
            cps.push(this.selectedChannels[i].cp)
          }
        }
        let dates = []
        if (!_.isEmpty(this.time)) {
          if (this.time[0] !== null) {
            dates.push(">=" + this.time[0].format("yyyy-MM-dd"))
          }
          if (this.time[1] !== null) {
            dates.push("<=" + this.time[1].format("yyyy-MM-dd"))
          }
        } else {
          let currentdate = this.parseCurrentDate()
          dates.push(">=" + currentdate)
          dates.push("<=" + currentdate)
          this.time = []
          this.time.push(new Date(currentdate))
          this.time.push(new Date(currentdate))
        }

        let params = []
        if (gameIds.length !== 0) {
          params.push("game_id:in" + gameIds.join(","))
        }
        if (cps.length !== 0) {
          params.push("cp:in" + cps.join(","))
        }
        if (dates.length !== 0) {
          params.push("date:" + dates.join("|"))
        }
        if (this.editId === 0) {
          params.push("groupby:ingame_id, cp")
        } else if (this.editId === 1) {
          params.push("groupby:ingame_id")
        } else {
          params.push("groupby:incp")
        }
        if (params.length > 0) {
          return "query=" + encodeURIComponent(params.join(";"))
        } else {
          return ""
        }
      },
      parseCurrentDate: function () {
        let date = new Date()
        // date.setDate(date.getDate() - 1)
        let seperator1 = "-"
        let month = date.getMonth() + 1
        let strDate = date.getDate()
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        return currentdate
      },
      doGetOrderList: function (page = 1, sortData) {
        this.pageInfo.currentPage = page
        let url = ENV.HOST_URL + "/order/data/"
        let query = this.parseQuery()
        if (query !== "") {
          url = url + "?" + query + "&offset=" + this.pageInfo.offset + "&limit=" + this.pageInfo.limit
        } else {
          url = url + "?offset=" + this.pageInfo.offset + "&limit=" + this.pageInfo.limit
        }

        if (sortData) {
          let order = sortData.order
          let prop = sortData.prop
          let isDescending = order === 'descending'
          url += order && !isDescending  ? "&order=asc" : "&order=desc"
          url += prop ? "&sortby=" + prop : "&sortby=total"

          this.$http.get(url)
            .then((res) => {
              this.items = res.body.data
              this.pageInfo.total = res.body.total
              this.sumOrder = Number(res.body.sum)
            })
        }
      },
      doDownloadOrderList: function () {
        let xtoken = sessionStorage.getItem("token")
        let url = ENV.HOST_URL + "/order/download?"
        url = url + this.parseQuery() + "&_token=" + xtoken
        if (this.sortData) {
          let order = this.sortData.order
          let prop = this.sortData.prop
          let isDescending = order === 'descending'
          if (order) {
            url += isDescending ? "&order=desc" : "&order=asc"
          } else {
            url = url + "&order=desc"
          }

          url += prop ? "&sortby=" + prop : "&sortby=total"
        }
        return url
      },
      getDownloadUrl: function (start, end, game_id, cp) {
        // var dates = date_range.split('--')
        // var url = '/order/url/' + '?query=game_id:in' + game_id  + ';cp:in' + cp + ';date:>='+ dates[0] + '|<=' + dates[1]
        let url = '/order/url/' + '?game_id=' + game_id + '&cp=' + cp + '&start=' + start + '&end=' + end
        this.$http.get(url)
          .then((res) => {
            window.location.href = res.body.url
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: err.body
            })
          })

      },
      handleSort(obj) {
        if (!obj.prop) {
          return
        }
        this.sortData = obj
        this.doGetOrderList(1, this.sortData)
      },
    },
    mounted: function () {
      this.getGameSelectList();
      this.getChannelSelectList();
      this.doGetOrderList(1, this.sortData);
      this.selectedHeader = []
    }
  }
</script>

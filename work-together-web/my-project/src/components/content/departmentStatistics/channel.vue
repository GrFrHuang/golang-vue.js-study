<template>
  <div class="minChartsd">
    <el-row :gutter="24">
      <el-col :span="6" :offset="1">
        <div class="block">
          <el-date-picker
            v-model="time"
            type="daterange"
            align="right"
            @change="doGetOrderList(1,sortData)"
            placeholder="选择日期范围"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="22">
        <!--<echarts></echarts>-->

        <chart :options="polarchannel" ref="chart"></chart>

      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column label="渠道商务">
          <el-table-column
            prop="time"
            label="日期"
            min-width="120">
            <template scope="scope">
              {{ scope.row.date }}
            </template>
          </el-table-column>
          <el-table-column
            prop="province"
            label="渠道接入"
            min-width="120">
            <template scope="scope">
              {{ scope.row.channel_access }}
            </template>
          </el-table-column>
          <el-table-column
            prop="city"
            label="渠道回款"
            min-width="120">
            <template scope="scope">
              {{ scope.row.channel_paid }}
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="渠道商信息"
            min-width="300">
            <template scope="scope">
              {{ scope.row.channel_company }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-row>
    <div class="box-footer">
      <Pagination v-show="pageInfo.total > pageInfo.limit"
                  @current-change="handleCurrentChange"
                  :current-page="pageInfo.currentPage"
                  :page-size="pageInfo.limit"
                  layout="prev, pager, next, jumper, total"
                  :total="pageInfo.total">
      </Pagination>
    </div>
  </div>
</template>
<script>
  import {Pagination} from 'element-ui'

  export default {
    components: {
      Pagination,
    },
    data() {
      return {
        time:'',
        items:[],
        channelAccess:[],
        channelPaid:[],
        channelCompany:[],
        sortData:null,
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
        itemsgb:[],
        tableData: [],
        pageInfo: {
          currentPage: 1,
          limit: ENV.PAGE_SHOW_COUNT,
          offset: 0,
          total: 0,
        },
        polarchannel: {}
      };
    },
    mounted() {
      this.itmes()
      this.doGetOrderList()
      this.polarSettlements ()
    },
    methods: {
      doGetOrderList: function () {
        this.ChartRequest()
        this.FormRequest()
      },
      itmes () {
        let now = new Date()
        this.time = [new Date(now.getTime() - 7 * 24 * 3600 * 1000), now]
      },
      ChartRequest () {
        let url = ENV.HOST_URL + "/statistic/channelTrade"
        let start = this.parseQuery()[0]
        let end = this.parseQuery()[1]
        let dates = Math.abs((start - end))/(60*60*24)
        if (start !== "" && end !== "") {
          url = url + "?start=" + start +"&end=" + end + "&limit=" + dates
        } else {
          url = url + "?limit=" + dates
        }
        this.$http.get(url)
          .then((res) => {
            let datasa = res.body.data;
            this.items= [];
            this.channelAccess= [];
            this.channelPaid= [];
            this.channelCompany= [];
            for( let i in datasa) {
              this.items.push(datasa[i].date);
              this.channelAccess.push(datasa[i].channel_access);
              this.channelPaid.push(datasa[i].channel_paid);
              this.channelCompany.push(datasa[i].channel_company)
            }
            this.polarSettlements ()
            this.pageInfo.total = res.body.total
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: err.data
            })
          })
      },
      FormRequest () {
        let url = ENV.HOST_URL + "/statistic/channelTrade"
        let start = this.parseQuery()[0]
        let end = this.parseQuery()[1]
        if (start !== "" && end !== "") {
          url = url + "?start=" + start +"&end=" + end + "&offset=" + this.pageInfo.offset + "&limit=" + this.pageInfo.limit
        } else {
          url = url + "?offset=" + this.pageInfo.offset + "&limit=" + this.pageInfo.limit
        }
        this.$http.get(url)
          .then((res) => {
            this.tableData = res.body.data
            this.pageInfo.total = res.body.total
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: err.data
            })
          })
      },
      parseCurrentDate: function () {
        let date = new Date()
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
      parseQuery: function () {
        let dates = []
        if (!_.isEmpty(this.time)) {
          if (this.time[0] !== null) {
            dates.push((Date.parse(new Date(this.time[0])))/1000)
          }
          if (this.time[1] !== null) {
            dates.push((Date.parse(new Date(this.time[1])))/1000)
          }
        } else {
          let currentdate = this.parseCurrentDate()
          dates.push((Date.parse(new Date(currentdate)))/1000)
          dates.push((Date.parse(new Date(currentdate)))/1000)
          this.time = []
          this.time.push(new Date(currentdate))
          this.time.push(new Date(currentdate))
        }
        if (dates.length > 0) {
          return dates
        } else {
          return ""
        }
      },
      chilFn (activeName2){
        this.polarSettlements ();
        setTimeout(()=>{
          this.$refs.chart.resize()
        },10)
      },
      handleCurrentChange(currentPage) {
        let offset = util.buildOffsetByPage(currentPage, this.pageInfo.limit)
        this.pageInfo.offset = offset
        this.doGetOrderList(currentPage, this.sortData)
      },
      polarSettlements () {
        this.polarchannel = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['渠道接入', '渠道回款', '渠道商信息'],
            selected: {
              '渠道接入': true,
              '渠道回款': false,
              '渠道商信息': false
            },
            width: '100%',
          },
          grid: {
            left: '125vw',
            width: '90%',
            bottom: '35vh',
          },
          toolbox: {
            show: true,
            feature: {
              magicType: {show: true, type: ['stack', 'tiled']},
              saveAsImage: {show: true}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.items
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: '渠道接入',
            type: 'line',
            smooth: true,
            data: this.channelAccess
          }, {
            name: '渠道回款',
            type: 'line',
            smooth: true,
            data: this.channelPaid
          }, {
            name: '渠道商信息',
            type: 'line',
            smooth: true,
            data: this.channelCompany
          }]
        }
      }
    }
  };
</script>
<style scoped>
  .echarts {
    height: 350px;
    width: 100%;
    margin-top:5vh;
    margin-bottom:5vh;
  }
  .minChartsd{
    overflow: scroll
  }
</style>


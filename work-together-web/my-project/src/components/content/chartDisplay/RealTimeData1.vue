<template>
  <div>
    <div>
      <section class="content-header">
        <h1>
          实时数据
          <small></small>
        </h1>
      </section>
      <div class="content">


        <div class="box">

          <div id="clock" class="alert">{{clock}}</div>


          <div class="box-header with-border">
            <el-row>


              <el-col :span="6" >
                <el-card :body-style="{ padding: '0px' }">
                  <div style="padding: 14px;">
                    <h1>联运</h1>
                    <div class="bottom clearfix">

                      <td>
                       <h4> <span class="percent" v-if="items['lianyun']['total_money'] === null">总金额：0</span>
                         <span class="percent" v-else >  总金额：{{ items['lianyun']["total_money"] }}  </span></h4>
                      </td>
                      <br/>
                      <td class="rt-num-item"><h4>充值数量：{{items["lianyun"]["count"]}}</h4></td>
                    </div>
                  </div>
                </el-card>
              </el-col>




              <el-col :span="6" >
                <el-card :body-style="{ padding: '0px' }">
                  <div style="padding: 14px;">
                    <h1>360</h1>
                    <div class="bottom clearfix">

                      <td>
                        <h4> <span class="percent" v-if="items['360']['total_money'] === null">总金额：0</span>
                          <span class="percent" v-else >  总金额：{{ items['360']["total_money"] }}  </span></h4>
                      </td>
                      <br/>
                      <td class="rt-num-item"><h4>充值数量：{{items["360"]["count"]}}</h4></td>
                    </div>
                  </div>
                </el-card>
              </el-col>



              <el-col :span="6" >
                <el-card :body-style="{ padding: '0px' }">
                  <div style="padding: 14px;">
                    <h1>酷派</h1>
                    <div class="bottom clearfix">

                      <td>
                        <h4> <span class="percent" v-if="items['kupai']['total_money'] === null">总金额：0</span>
                          <span class="percent" v-else >  总金额：{{ items['kupai']["total_money"] }}  </span></h4>
                      </td>
                      <br/>
                      <td class="rt-num-item"><h4>充值数量：{{items["kupai"]["count"]}}</h4></td>
                    </div>
                  </div>
                </el-card>
              </el-col>



              <el-col :span="6" >
                <el-card :body-style="{ padding: '0px' }">
                  <div style="padding: 14px;">
                    <h1>百度</h1>
                    <div class="bottom clearfix">

                      <td>
                        <h4> <span class="percent" v-if="items['baidu']['total_money'] === null">总金额：0</span>
                          <span class="percent" v-else >  总金额：{{ items['baidu']["total_money"] }}  </span></h4>
                      </td>
                      <br/>
                      <td class="rt-num-item"><h4>充值数量：{{items["baidu"]["count"]}}</h4></td>
                    </div>
                  </div>
                </el-card>
              </el-col>



              <el-col :span="6" >
                <el-card :body-style="{ padding: '0px' }">
                  <div style="padding: 14px;">
                    <h1>拇指玩</h1>
                    <div class="bottom clearfix">

                      <td>
                        <h4> <span class="percent" v-if="items['muzhiwan']['total_money'] === null">总金额：0</span>
                          <span class="percent" v-else >  总金额：{{ items['muzhiwan']["total_money"] }}  </span></h4>
                      </td>
                      <br/>
                      <td class="rt-num-item"><h4>充值数量：{{items["muzhiwan"]["count"]}}</h4></td>
                    </div>
                  </div>
                </el-card>
              </el-col>



              <el-col :span="6" >
                <el-card :body-style="{ padding: '0px' }">
                  <div style="padding: 14px;">
                    <h1>安智</h1>
                    <div class="bottom clearfix">

                      <td>
                        <h4> <span class="percent" v-if="items['anzhi']['total_money'] === null">总金额：0</span>
                          <span class="percent" v-else >  总金额：{{items['anzhi']["total_money"] }}  </span></h4>
                      </td>
                      <br/>
                      <td class="rt-num-item"><h4>充值数量：{{items["anzhi"]["count"]}}</h4></td>
                    </div>
                  </div>
                </el-card>
              </el-col>


              <el-col :span="6" >
                <el-card :body-style="{ padding: '0px' }">
                  <div style="padding: 14px;">
                    <h1>快发</h1>
                    <div class="bottom clearfix">

                      <td>
                        <h4> <span class="percent" v-if="items['kuaifa']['total_money'] === null">总金额：0</span>
                          <span class="percent" v-else >  总金额：{{items['kuaifa']["total_money"] }}  </span></h4>
                      </td>
                      <br/>
                      <td class="rt-num-item"><h4>充值数量：{{items["kuaifa"]["count"]}}</h4></td>
                    </div>
                  </div>
                </el-card>
              </el-col>



              <el-col :span="6" >
                <el-card :body-style="{ padding: '0px' }">
                  <div style="padding: 14px;">
                    <h1>半袋米</h1>
                    <div class="bottom clearfix">

                      <td>
                        <h4> <span class="percent" v-if="items['bandaimi']['total_money'] === null">总金额：0</span>
                          <span class="percent" v-else >  总金额：{{ items['bandaimi']["total_money"] }}  </span></h4>
                      </td>
                      <br/>
                      <td class="rt-num-item"><h4>充值数量：{{items["bandaimi"]["count"]}}</h4></td>
                    </div>
                  </div>
                </el-card>
              </el-col>



              <el-col :span="6" >
                <el-card :body-style="{ padding: '0px' }">
                  <div style="padding: 14px;">
                    <h1>好玩</h1>
                    <div class="bottom clearfix">

                      <td>
                        <h4> <span class="percent" v-if="items['haowan']['total_money'] === null">总金额：0</span>
                          <span class="percent" v-else >  总金额：{{ items['haowan']["total_money"] }}  </span></h4>
                      </td>
                      <br/>
                      <td class="rt-num-item"><h4>充值数量：{{items["haowan"]["count"]}}</h4></td>
                    </div>
                  </div>
                </el-card>
              </el-col>



              <el-col :span="6" >
                <el-card :body-style="{ padding: '0px' }">
                  <div style="padding: 14px;">
                    <h1>小绵羊</h1>
                    <div class="bottom clearfix">
                      <td class="rt-num-item"><h4>总用户数：{{ items['small_sheep']["total"] }}</h4></td><br/>
                      <td class="rt-num-item"><h4>今日新增：{{items["small_sheep"]["count"]}}</h4></td>
                    </div>
                  </div>
                </el-card>
              </el-col>


              <el-col :span="6" >
                <el-card :body-style="{ padding: '0px' }">
                  <div style="padding: 14px;">
                    <h1>半袋米app</h1>
                    <div class="bottom clearfix">

                      <td>
                        <h4> <span class="percent" v-if="items['bandaimi_app']['total_money'] === null">总金额：0</span>
                          <span class="percent" v-else >  总金额：{{items['bandaimi_app']["total_money"] }}  </span></h4>
                      </td>
                      <br/>
                      <td class="rt-num-item"><h4>充值数量：{{items["bandaimi_app"]["count"]}}</h4></td>
                    </div>
                  </div>
                </el-card>
              </el-col>


              <el-col :span="6" >
                <el-card :body-style="{ padding: '0px' }">
                  <div style="padding: 14px;">
                    <h1>公会数据</h1>
                    <div class="bottom clearfix">
                      <td class="rt-num-item"><h4 style="text-align: left;">会长总数：{{items["cps_user"]["count"]}}</h4>
                        <h4>新增会长：{{items["cps_level1"]["count"]}} + {{items["cps_level23"]["count"]}}(子会长)</h4>
                        <h4>新增合作：{{items["cps_level1_gamecount"]["count"]}} + {{items["cps_level23_gamecount"]["count"]}}(子会长)</h4></td>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
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
          clock:"",
          items:[],  //  用户
          length:0,
          ontimes: false,
        }
      },
      mounted: function () {
        // 加载用户

        this.getDate()
        this.getClockTimer()
        this.getDataTimer()
      },
      methods: {
        getDataTimer() {
          if(this.ontimes==false) {

            var func = this.getDate
            this.t1=setInterval(function () {
              func()
            }, 10000);

          }else {
            clearInterval(this.t1)
          }
        },
        getClockTimer() {
          if (this.ontimes == false) {
            var func = this.myTimer
            this.t2 = setInterval(function () {
              func()
            }, 1000);
          }else {
            clearInterval(this.t2)
          }
        },
        myTimer() {
          var d = new Date();
          var t = d.toLocaleTimeString();
          this.clock = t
        },
        getDate() {
          let is_date = new Date().toDateString()
          let start = new Date(new Date(is_date).getTime())
          let end = new Date(new Date(is_date).getTime() + 24 * 60 * 60 * 1000 - 1)
          let  url = ENV.DASHBOARC_HOST_URL + '/statistics_dashboarc/dashboardinfo?platform=haowan&start='
            +parseInt(start / 1000)+'&end='+parseInt(end / 1000)
          this.$http.get(url)
            .then((res) => {
              this.items =  res.body
            },err => {
              console.log(err.body)
            })
        },
     },
    destroyed () {
      this.ontimes = true
      this.getClockTimer()
      this.getDataTimer()
    }

    }
</script>



<style scoped>

</style>

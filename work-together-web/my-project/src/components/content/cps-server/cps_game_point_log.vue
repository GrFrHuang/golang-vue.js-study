<template>
    <div>
        <div>
            <section class="content-header">
                <h1>
                    游戏点位调整记录
                    <small>查看游戏点位调整情况</small>
                </h1>
                <ol class="breadcrumb">
                    <li><i class="fa fa-dashboard"></i>游戏点位调整日志记录</li>
                </ol>
            </section>
            <div class="content">
                <div class="box">
                    <div class="box-header with-border">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="游戏">
                                <el-select v-model="params.game_id" filterable clearable remote
                                           :remote-method="gameSearch" placeholder="请选择游戏">
                                    <el-option
                                            v-for="item in gameAll.data"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                    <el-pagination
                                            v-show="gameAll.total > gameAll.per_page"
                                            small
                                            @current-change="selectgameAdd"
                                            :current-page="gameAll.page"
                                            :page-size="gameAll.per_page"
                                            :total="gameAll.total"
                                            layout="prev, pager, next">
                                    </el-pagination>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="选择时间">
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
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="box-body">
                        <el-tabs v-model="activeName" type="card" @tab-click="tabChange">
                            <el-tab-pane label="平台点位" name="platform"></el-tab-pane>
                            <el-tab-pane label="特殊点位" name="special"></el-tab-pane>
                        </el-tabs>
                        <table class="table table-bordered table-hover" v-loading="loading">
                            <thead>
                            <tr>
                                <th>游戏别名</th>
                                <th>游戏名称</th>
                                <th v-if="activeName === 'special'">会长账号</th>
                                <th>折扣(旧)</th>
                                <th>折扣(新)</th>
                                <th>服务费(旧)</th>
                                <th>服务费(新)</th>
                                <th>返币模式</th>
                                <th>调整时间</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="item in items">
                                <td>{{ item.GameAlias }}</td>
                                <td>{{ item.GameName }}</td>
                                <td v-if="activeName ==='special'">{{ item.UserName }}</td>
                                <td>{{ item.OldDiscount }}%</td>
                                <td>{{ item.NewDiscount }}%</td>
                                <td>{{ item.OldServiceRate }}%</td>
                                <td>{{ item.NewServiceRate }}%</td>
                                <td v-if="item.ProfitModel === 1">实时返币</td>
                                <td v-if="item.ProfitModel === 2">佣金模式</td>
                                <td>{{ item.ChangeTime | stampToTimeFull }}</td>

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
        </div>
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
    export default {
        data: function () {
            return {
                loading: false,
                activeName: "platform",
                page: 1,
                per_page: 15,
                total: 0,
                channel: '',
                items: [],
                gameAll: {
                    data: [],
                    page: 1,
                    per_page: 10,
                    game_name: '',
                    total: 0
                },
                channelAll: [],
                dialogVisible: false,
                token: '',
                params: {
                    start_time: '',
                    end_time: '',
                    game_id: '',
                },
                form: {},
            }
        },
        mounted: function () {
            this.token = sessionStorage.getItem("token")
            this.load()
            this.getList()
            this.selectgameAdd(0)
        },
        methods: {
            tabChange() {
                this.getList()
            },
            load() {
                this.params.start_time = new Date() - 24 * 60 * 60 * 1000
                this.params.end_time = new Date()
            },
            getList() {
                this.loading = true
                let start_times, end_times
                let from = this.activeName === "platform" ? 1 : 2
                if (this.params.start_time === '') {
                    start_times = new Date()
                } else {
                    start_times = parseInt(this.params.start_time / 1000)
                }
                if (this.params.end_time === '') {
                    end_times = new Date()
                } else {
                    end_times = parseInt(new Date(new Date(this.params.end_time).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000)
                }
                this.$http.get(ENV.CPS_HOST_URL + "/discount_log/platform_discount_log",
                    {
                        params: {
                            token: this.token,
                            page: this.page,
                            per_page: this.per_page,
                            is_special: from,
                            start_time: start_times,
                            end_time: end_times,
                            game_id: this.params.game_id
                        }
                    }
                ).then(response => {
                    this.loading = false
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
                this.getList()
            },
            onCurrentChange(currentPage) {
                this.page = currentPage
                this.getList()
            },
            changeTheChannel(v) {
                this.dialogVisible = true
                this.channel = ''
                this.form = v
                var url = ENV.CPS_HOST_URL + "/channel/GetChanneSelectall"
                this.$http.get(url)
                    .then((res) => {
                        this.channelAll = res.body
                    })

            },
            modChannel() {
                let user = JSON.parse(localStorage.getItem("cnodeBaseInfo"))
                let post = {
                    'id': this.form.Id,
                    'channel': String(this.channel),
                    'email': user.info.email,
                    'cpsType': this.activeName,
                }
                this.$http.put(ENV.CPS_HOST_URL + "/channel/ModChannel", post).then((response) => {
                    this.$message.success("修改成功")
                    this.getList()
                }, (error) => {
                    this.$message.error(error.body)
                })
                this.dialogVisible = false
            },
            selectgameAdd(val) {
                this.gameAll.page = val ? val : 1
                var url = '/game/game_select_list'
                this.$http.get(ENV.CPS_HOST_URL + url, {
                    params: {
                        page: this.gameAll.page,
                        token: this.token,
                        per_page: this.gameAll.per_page,
                        game_name: this.gameAll.game_name
                    }
                })
                    .then((res) => {
                        this.gameAll.data = res.body.data
                        this.gameAll.total = res.body.total
                    })
            },
            gameSearch(game) {
                this.gameAll.game_name = game
                this.selectgameAdd()
            }
        }
    }
</script>

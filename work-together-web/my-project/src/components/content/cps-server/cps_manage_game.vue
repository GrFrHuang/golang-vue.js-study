<template>
  <div>
    <section class="content-header">
      <h1>
        游戏管理<small>游戏列表</small>
      </h1>
    </section>
    <div class="content">
      <div class="box">
        <div class="box-header with-border">
          <el-form :inline="true" class="demo-form-inline" >
            <el-form-item label="游戏名">
              <el-input  v-model="params.game_name" placeholder="游戏名"></el-input>
            </el-form-item>
            <el-form-item label="合作模式">
              <el-select v-model="params.from" :clearable="true" filterable placeholder="合作模式">
                <el-option :value=zero label="所有"></el-option>
                <el-option v-for="item in collamode" :key="item.key" :label="item.value" :value="item.key"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上线日期">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择开始日期" v-model="params.start_time" style="width: 100%;"></el-date-picker>
              </el-col>
              <span style="display: block; float: left"> - </span>
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择结束日期" v-model="params.end_time" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button type="success" @click="onCreateGame">添加游戏</el-button>
              <el-button type="success" @click="onCreateGameAlias">添加游戏别名</el-button>
              <el-button type="primary"><a style="color: white" :href="downloadUrl" :disabled="downloadUrl==''">导出excel</a></el-button>
            </el-form-item>
            <p>共{{ total }}款游戏</p>
          </el-form>
        </div>
        <div class="box-body">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="所有游戏" name="game"></el-tab-pane>
            <el-tab-pane label="游戏别名" name="gamealias"></el-tab-pane>
          </el-tabs>
          <table class="table table-bordered table-hover" v-if="activeName=='game'">
            <thead>
              <tr>
                <th>游戏编号</th>
                <th>游戏名</th>
                <th>游戏等级</th>
                <th>热度</th>
                <th>折扣</th>
                <th>服务费</th>
                <th>返币模式</th>
                <th>合作模式</th>
                <th>服</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
              <td>{{ item.id }}</td>
              <td>{{ item.game_name }}</td>
              <td>{{ gamelevel.filter(filterByKey(item.game_level))[0] ? gamelevel.filter(filterByKey(item.game_level))[0].value : '' }}</td>
              <td>{{ item.game_alias.sort }}</td>
              <td>{{ item.discount }}%</td>
              <td>{{ item.servicecharge_rate }}%</td>
              <td>{{ profitmodel.filter(filterByKey(item.profit_model))[0] ? profitmodel.filter(filterByKey(item.profit_model))[0].value : '' }}</td>
              <td>
                <template v-if="item.from === 0 || item.from === 'CPSG' || item.from === 'CPSA'">
                  <span v-if="item.distinct_cooperation === '2' || item.from === 'CPSG'">CPSG</span>
                  <span v-else>CPSA</span>
                </template>

                <span v-else-if=" item.from == 1 || item.from == 'CPST'">CPST</span>
                <span v-else-if=" item.from == 3 || item.from == 'CPSO'">CPSO</span>
                <span v-else-if=" item.from == 4 || item.from == 'CPSD'">CPSD</span>
                <span v-else-if=" item.from == 5 || item.from == 'CPSJ'">CPSJ</span>
                <span v-else-if="item.from == 2 || item.from == '联运'">联运</span>
              </td>
              <td>{{ servertype.filter(filterByKey(item.game_alias.server_type))[0] ? servertype.filter(filterByKey(item.game_alias.server_type))[0].value : '' }}</td>
              <td>{{ gamestate.filter(filterByKey(item.state))[0] ? gamestate.filter(filterByKey(item.state))[0].value : '' }}</td>
              <td>
                <!--<a title="编辑" style="cursor:pointer" @click = "auditSuccess(item.user_id, item.user_name, item.game_id, item.game_name)" >编辑</a>-->
                <a title="定时折扣" style="cursor:pointer" @click="openTimedTaskDialog(item)">定时折扣</a>
                <a title="编辑" style="cursor:pointer" @click = "auditSuccess(item)" >编辑</a>
                <a title="删除游戏" style="cursor:pointer" @click = "deleteGame(item.id)" >删除</a>
              </td>
            </tr>
            </tbody>
          </table>
          <table class="table table-bordered table-hover" v-else>
            <thead>
            <tr>
              <th>别名编号</th>
              <th>游戏别名</th>
              <th>游戏等级</th>
              <th>热度</th>
              <th>服</th>
              <th>版本号</th>
              <th>开发商</th>
              <th>文件大小</th>
              <th>发布时间</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
              <td>{{ item.id }}</td>
              <td>{{ item.alias }}</td>
              <td>{{ gamelevel.filter(filterByKey(item.game_level))[0] ? gamelevel.filter(filterByKey(item.game_level))[0].value : '' }}</td>
              <td>{{ item.sort }}</td>
              <td>{{ servertype.filter(filterByKey(item.server_type))[0] ? servertype.filter(filterByKey(item.server_type))[0].value : '' }}</td>
              <td>{{ item.version_name }}</td>
              <td>{{ item.developer }}</td>
              <td>{{ item.filesize }}</td>
              <td>{{ item.publish_time | stampToTime }}</td>
              <td>
                <!--<a title="编辑" style="cursor:pointer" @click = "auditSuccess(item.user_id, item.user_name, item.game_id, item.game_name)" >编辑</a>-->
                <a title="编辑" style="cursor:pointer" @click = "editAlias(item)" >编辑</a>
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
    <el-dialog title="编辑游戏信息" :visible.sync="dialogFormVisible2" :before-close="handleClose">
      <el-form :model="form2">
        <el-form-item label="游戏名称" :label-width="formLabelWidth">
          <el-input :disabled="disableds" v-model="form2.game_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="游戏别名" :label-width="formLabelWidth">
          <el-autocomplete
            v-model="form2.gamealias"
            :fetch-suggestions="querySearchGamealias"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="合作模式" :label-width="formLabelWidth">
          <el-select style="width: 193px" v-model="form2.from" clearable placeholder="请选择" @change="onFromChange" :disabled="dialogFlag == 'edit'">
            <el-option
              v-for="item in collamode"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="折扣" :label-width="formLabelWidth">
          <el-input-number :disabled="disableds" v-model="form2.discount" auto-complete="off" :max="100" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="服务费" :label-width="formLabelWidth">
          <el-input-number :disabled="disableds" v-model="form2.servicecharge_rate" auto-complete="off" :max="100" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="返币模式" :label-width="formLabelWidth">
          <el-select style="width: 193px" v-model="form2.profit_model" clearable placeholder="请选择">
            <el-option
              v-for="item in profitmodel"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="押金" :label-width="formLabelWidth">
          <el-input-number :disabled="disableds" v-model="form2.cash_pledge" auto-complete="off" :max="1000000000" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="游戏等级" :label-width="formLabelWidth">
          <el-select style="width: 193px" v-model="form2.game_level" clearable placeholder="请选择">
            <el-option
              v-for="item in gamelevel"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下放等级" :label-width="formLabelWidth">
          <el-select style="width: 193px" v-model="form2.transfer_level" clearable placeholder="请选择">
            <el-option
              v-for="item in levelmode"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核等级" :label-width="formLabelWidth">
          <el-select style="width: 193px" v-model="form2.audit_level" clearable placeholder="请选择">
            <el-option
              v-for="item in levelmode"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select style="width: 193px" v-model="form2.state" clearable placeholder="请选择">
            <el-option
              v-for="item in gamestate"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" :label-width="formLabelWidth">
          <el-date-picker
            :disabled="disableds"
            v-model="form2.publish_time"
            type="date"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="cpsGameid" :label-width="formLabelWidth2">
          <el-input-number style="margin-left: 3%" :disabled="cpsdisabled" v-model="form2.cps_gameid" auto-complete="off" :max="1000000" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="cps文件名" :label-width="formLabelWidth2" >
          <el-input :disabled="cpsdisabled" v-model="form2.cps_game_filename" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="腾讯Appid" :label-width="formLabelWidth2" >
          <el-input-number :disabled="tendisabled" v-model="form2.tencent_appid" auto-complete="off" :max="10000000000" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="联运Gameid" :label-width="formLabelWidth2" >
          <el-input-number :disabled="anydisabled" v-model="form2.anysdk_gameid" auto-complete="off" :max="10000000" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleDialog(form2)">取 消</el-button>
        <!--<el-button :disabled="disableds" type="primary" @click="addGame(form)">确 定</el-button>-->
        <el-button type="primary" @click="editGame(form2)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="(dialogFlag == 'edit'? '编辑':'新增')+'游戏'" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-form :model="form">
        <el-form-item label="游戏名称" :label-width="formLabelWidth">
          <el-input :disabled="disableds" v-model="form.game_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="游戏别名" :label-width="formLabelWidth">
          <el-autocomplete
            v-model="form.gamealias"
            :fetch-suggestions="querySearchGamealias"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="合作模式" :label-width="formLabelWidth">
          <el-select style="width: 193px" v-model="form.from" clearable placeholder="请选择" @change="onFromChange2" :disabled="dialogFlag == 'edit'">
            <el-option
              v-for="item in collamode"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="折扣" :label-width="formLabelWidth">
          <el-input-number :disabled="disableds" v-model="form.discount" auto-complete="off" :max="100" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="服务费" :label-width="formLabelWidth">
          <el-input-number :disabled="disableds" v-model="form.servicecharge_rate" auto-complete="off" :max="100" :min="0"></el-input-number>
        </el-form-item>

        <el-form-item label="返币模式" :label-width="formLabelWidth">
          <el-select :disabled="form.from === 7 ? true : false" style="width: 193px" v-model="form.profit_model"  clearable placeholder="请选择">
            <el-option
              v-for="item in profitmodel"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="押金" :label-width="formLabelWidth">
          <el-input-number :disabled="disableds" v-model="form.cash_pledge" auto-complete="off" :max="1000000000" :min="0"></el-input-number>
        </el-form-item>

        <el-form-item label="下放等级" :label-width="formLabelWidth">
          <el-select style="width: 193px" v-model="form.transfer_level" clearable placeholder="请选择">
            <el-option
              v-for="item in levelmode"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核等级" :label-width="formLabelWidth">
          <el-select style="width: 193px" v-model="form.audit_level" clearable placeholder="请选择">
            <el-option
              v-for="item in levelmode"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select style="width: 193px" v-model="form.state" clearable placeholder="请选择">
            <el-option
              v-for="item in gamestate"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" :label-width="formLabelWidth">
          <el-date-picker
            :disabled="disableds"
            v-model="form.publish_time"
            type="date"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="cpsGameid" :label-width="formLabelWidth2">
          <el-input-number style="margin-left: 3%" :disabled="cpsdisabled" v-model="form.cps_gameid" auto-complete="off" :max="1000000" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="cps文件名" :label-width="formLabelWidth2" >
          <el-input :disabled="cpsdisabled" v-model="form.cps_game_filename" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="腾讯Appid" :label-width="formLabelWidth2" >
          <el-input-number :disabled="tendisabled" v-model="form.tencent_appid" auto-complete="off" :max="10000000000" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="联运Gameid" :label-width="formLabelWidth2" >
          <el-input-number :disabled="anydisabled" v-model="form.anysdk_gameid" auto-complete="off" :max="10000000" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleAddDialog(form)">取 消</el-button>
        <!--<el-button :disabled="disableds" type="primary" @click="addGame(form)">确 定</el-button>-->
        <el-button type="primary" @click="addGame(form)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增游戏别名" :visible.sync="aliasFormVisible" :before-close="handleClose">
      <el-form :model="form">
        <el-form-item label="游戏别名" :label-width="formLabelWidth">
          <el-input :disabled="disableds" v-model="aliasform.alias" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="游戏icon" :label-width="formLabelWidth">
          <!--:show-file-list="false"-->
          <el-upload
            class="avatar-uploader"
            action="http://static.kuaifazs.com/sdkkitfile.php"
            :show-file-list="false"
            :on-success="onPicUpload"
            :before-upload="beforeAvatarUpload" name="uploadfile">
            <img v-if="aliasform.icon" :src="aliasform.icon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"> </i>
          </el-upload>
        </el-form-item>
        <el-form-item label="游戏等级" :label-width="formLabelWidth">
          <el-select style="width: 193px" v-model="aliasform.game_level" clearable placeholder="请选择">
            <el-option
              v-for="item in gamelevel"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开发商" :label-width="formLabelWidth">
          <el-input :disabled="disableds" v-model="aliasform.developer" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="游戏类型" :label-width="formLabelWidth">
          <el-input :disabled="disableds" v-model="aliasform.catename" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本号" :label-width="formLabelWidth">
          <el-input :disabled="disableds" v-model="aliasform.version_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="文件大小" :label-width="formLabelWidth">
          <el-input :disabled="disableds" v-model="aliasform.filesize" auto-complete="off"><template slot="append">MB</template></el-input>
        </el-form-item>
        <!--<el-form-item label="包名" :label-width="formLabelWidth">-->
        <!--<el-input :disabled="disableds" v-model="aliasform.packagename" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="热度" :label-width="formLabelWidth">
          <el-input-number :disabled="disableds" v-model="aliasform.sort" auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="服" :label-width="formLabelWidth">
          <el-select style="width: 193px" v-model="aliasform.server_type" clearable placeholder="请选择">
            <el-option
              v-for="item in servertype"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" :label-width="formLabelWidth">
          <el-date-picker
            :disabled="disableds"
            v-model="aliasform.publish_time"
            type="date"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleGameAlias(aliasform)">取 消</el-button>
        <el-button :disabled="disableds" type="primary" @click="addGameAlias(aliasform)">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑游戏别名-->
    <el-dialog title="编辑游戏别名" :visible.sync="aliasFormVisible2" :before-close="handleClose">
      <el-form :model="aliasform2">
        <el-form-item label="游戏别名" :label-width="formLabelWidth">
          <el-input :disabled="disableds" v-model="aliasform2.alias" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="游戏icon" :label-width="formLabelWidth">
          <!--:show-file-list="false"-->
          <el-upload
            class="avatar-uploader"
            action="http://static.kuaifazs.com/sdkkitfile.php"
            :show-file-list="false"
            :on-success="onPicUpload"
            :before-upload="beforeAvatarUpload" name="uploadfile">
            <img v-if="aliasform2.icon" :src="aliasform2.icon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"> </i>
          </el-upload>
          <!--<el-upload-->
            <!--class="avatar-uploader"-->
            <!--action="http://static.kuaifazs.com/sdkkitfile.php"-->
            <!--:show-file-list="false"-->
            <!--:on-success="onPicUpload"-->
            <!--:before-upload="beforeAvatarUpload">-->
            <!--<img v-if="aliasform.icon" :src="aliasform.icon" class="avatar">-->
            <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
          <!--</el-upload>-->
        </el-form-item>
        <el-form-item label="游戏等级" :label-width="formLabelWidth">
          <el-select style="width: 193px" v-model="aliasform2.game_level" clearable placeholder="请选择">
            <el-option
              v-for="item in gamelevel"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开发商" :label-width="formLabelWidth">
          <el-input :disabled="disableds" v-model="aliasform2.developer" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="游戏类型" :label-width="formLabelWidth">
          <el-input :disabled="disableds" v-model="aliasform2.catename" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本号" :label-width="formLabelWidth">
          <el-input :disabled="disableds" v-model="aliasform2.version_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="文件大小" :label-width="formLabelWidth">
          <el-input :disabled="disableds" v-model="aliasform2.filesize" auto-complete="off"><template slot="append">MB</template></el-input>
        </el-form-item>
        <!--<el-form-item label="包名" :label-width="formLabelWidth">-->
        <!--<el-input :disabled="disableds" v-model="aliasform.packagename" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="热度" :label-width="formLabelWidth">
          <el-input-number :disabled="disableds" v-model="aliasform2.sort" auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="服" :label-width="formLabelWidth">
          <el-select style="width: 193px" v-model="aliasform2.server_type" clearable placeholder="请选择">
            <el-option
              v-for="item in servertype"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" :label-width="formLabelWidth">
          <el-date-picker
            :disabled="disableds"
            v-model="aliasform2.publish_time"
            type="date"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleAuditGameAlias(aliasform2)">取 消</el-button>
        <el-button :disabled="disableds" type="primary" @click="addGameAlias(aliasform2)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="定时折扣" :visible.sync="timedTaskShow" :before-close="closeTimedTaskDialog" >
      <el-form :inline="true" :models="currentDiscount" class="demo-form-inline">
        <el-form-item label="折扣" >
          <el-input-number :disabled="true"  v-model="currentDiscount.discount" auto-complete="off" :max="100" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="服务费">
          <el-input-number :disabled="true" v-model="currentDiscount.servicecharge_rate" auto-complete="off" :max="100" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="timedTaskForm" class="demo-form-inline">
        <template v-for="(item, index) in timedTaskForm">
          <el-form-item label="时间">
            <el-date-picker v-model="timedTaskForm[index].execution_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="折扣" >
            <el-input-number  v-model="timedTaskForm[index].discount" auto-complete="off" :max="100" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="服务费">
            <el-input-number v-model="timedTaskForm[index].servicecharge_rate" auto-complete="off" :max="100" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="delTimedTask(index)">删除</el-button>
          </el-form-item>
        </template>
        <p>
        <el-form-item>
          <el-button type="warning" @click="addTimedTask">添加折扣</el-button>
          <el-button type="primary" @click="submitTimedTask">提交</el-button>
        </el-form-item>
        </p>
      </el-form>
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

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<script>
  export default {
    data: function () {
      return {
        currentGameId: 0,
        timedTaskShow: false,
        currentDiscount: {discount: 100, servicecharge_rate: 2},
        timedTaskForm:[],
        downloadUrl: "", // 下载链接
        dialogFlag: '',
        zero: 0,
        postToken:"",
        gamelevel:[{"key":1,"value":"SSS级"},{"key":2,"value":"SS级"}, {"key":3,"value":"S级"},{"key":4 ,"value":"AAA级"},
          {"key":5,"value":"AA级"},{"key":6,"value":"A级"}, {"key":7,"value":"B级"},{"key":8 ,"value":"C级"}],
        servertype:[{"key":1,"value":"专服"},{"key":2,"value":"混服"}, {"key":3,"value":"BT服"},{"key":4 ,"value":"硬核"}],
        collamode:[{"key":1,"value":"CPSA"},{"key":2,"value":"CPSG"}, {"key":3,"value":"CPST"},{"key":4 ,"value":"联运"},{"key":5 ,"value":"CPSO"},{"key":6 ,"value":"CPSD"},{"key":7 ,"value":"CPSJ"}],
        levelmode:[{"key":1,"value":"一级"},{"key":2,"value":"二级"}, {"key":3,"value":"三级"}],
        gamestate:[{"key":1,"value":"上架"},{"key":2,"value":"下架"}],
        profitmodel: [{"key":1,"value":"实时返币"},{"key":2,"value":"佣金模式"}],
        //gamestate:{"1":"上架","2":"下架"},
        activeName: 'game',
        page: 1,
        per_page: 15,
        total:0,
        items:[],
        token:'',
        params:{
          start_time: '',
          end_time: '',
          game_name: '',
          from:0,
        },
        show_cooperation: false,
        value_from: '',
        dialogFormVisible: false,
        dialogFormVisible2: false,
        aliasFormVisible: false,
        aliasFormVisible2: false,
        disableds: true,
        cpsdisabled: true,
        tendisabled: true,
        anydisabled: true,
        gamealias:[],
        form: {
          game_name: '',          // 游戏名
          gamealias: '',          // 游戏别名
          from: 1,               // 合作模式
          discount: 50,           // 折扣
          servicecharge_rate: 2,  // 服务费
          cash_pledge: 0,        // 押金
          state: 1,              // 状态 1上架2下架
          cps_gameid: 0,         // cps 游戏ID
          cps_game_filename: '',  // cps游戏文件名
          tencent_appid: 0,      // 腾讯appid
          anysdk_gameid: 0,      // 联运游戏id
          transfer_level: 1,       // 下放等级
          audit_level: 1,         // 审核等级
          publish_time: 0,
          profit_model: 1,        // 返币模式
        },
        form2: {
          id: '',
          game_name: '',          // 游戏名
          gamealias: '',          // 游戏别名
          from: 1,               // 合作模式
          discount: 50,           // 折扣
          servicecharge_rate: 2,  // 服务费
          cash_pledge: 0,        // 押金
          state: 1,              // 状态 1上架2下架
          cps_gameid: 0,         // cps 游戏ID
          cps_game_filename: '',  // cps游戏文件名
          tencent_appid: 0,      // 腾讯appid
          anysdk_gameid: 0,      // 联运游戏id
          transfer_level: 1,       // 下放等级
          audit_level: 1,         // 审核等级
          publish_time: 0,
          profit_model: 1,        // 返币模式
          game_level: 7          //游戏等级
        },
        time: 0,  //别名发布时间
        i: 0,     //游戏发布时间
        id: 0,
        aliasform: {
          alias: '',
          icon: '',
          game_level: 7,
          catename: '',
          server_type: 2,
          publish_time: 0,
          version_name: '',
          packagename: '',
          filesize: '',
          developer: '',
          sort: 0,
        },
        aliasform2: {
          alias: '',
          icon: '',
          game_level: 7,
          catename: '',
          server_type: 2,
          publish_time: 0,
          version_name: '',
          packagename: '',
          filesize: '',
          developer: '',
          sort: 0,
        },
        formLabelWidth: '70px',
        formLabelWidth2: '60px',
        editingIndex: 0
      }
    },
    mounted: function() {
      this.token = sessionStorage.getItem("token")
      this.getList()
    },
    methods: {
      addTimedTask() {
          let task = {game_id: +this.currentGameId, discount: 100, servicecharge_rate: 2, execution_time: new Date()}
          this.timedTaskForm.push(task)
      },
      delTimedTask(index) {
          this.timedTaskForm.splice(index,1)
      },
      openTimedTaskDialog(item) {
          this.currentGameId = item.id
          this.currentDiscount.discount = item.discount
          this.currentDiscount.servicecharge_rate = item.servicecharge_rate
          this.timedTaskForm = []
          this.$http.get(ENV.CPS_HOST_URL + "/game/get_game_discount_task",
              {params: {token: this.token, game_id: this.currentGameId}}
          ).then(response => {
            this.timedTaskForm = response.body
              for(var i=0;i<this.timedTaskForm.length; i++){
                  this.timedTaskForm[i].execution_time = new Date(this.timedTaskForm[i].execution_time * 1000)
              }
            this.timedTaskShow = true
          }, error => {
              this.$message.error(error.body)
          })
      },
      closeTimedTaskDialog() {
        this.timedTaskForm = []
        this.currentGameId = 0
        this.timedTaskShow = false
      },
      submitTimedTask() {
          for(var i=0;i<this.timedTaskForm.length; i++){
              this.timedTaskForm[i].execution_time = Date.parse(this.timedTaskForm[i].execution_time) / 1000
          }
          this.$http.post(ENV.CPS_HOST_URL + "/game/Add_timed_task",
              {token: this.token, task: this.timedTaskForm, game_id: +this.currentGameId}
          ).then(response => {
              this.$message.success("设置成功")
              this.closeTimedTaskDialog()
          }, error => {
              this.$message.error(error.body)
          })
      },
      handleClick() {
        this.getList()
      },
      handleClose (done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.aliasform.publish_time /= 1000
            this.form.publish_time /= 1000
            this.form.from = this.value_from
            done()
          })
          .catch(_ => {})
      },
      handleSelect (item) {
        console.log(item)
      },
      filterByKey (a) {
        return function (b, index, items) {
          return b.key == a
        }
      },
      querySearchGamealias(queryString, cb) {
        if ( queryString != "" ) {
          this.$http.get(ENV.CPS_HOST_URL + "/game_alias/search",
            {params: {token: this.token, gamename: queryString}}
          ).then(response => {
            var data = new Array()
            for(var i in response.body.data){
              let tmp = {"value":response.body.data[i].alias,"id":response.body.data[i].id}
              //console.log(response.body.data[i])
              data.push(tmp)
            }
            cb(data)
          }, error => {
            this.$message.error(error.body)
          })
        }
        cb([])
        //var restaurants = this.restaurants;
        //var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        //cb(results);
      },
      getList() {
        let urlpath = this.activeName == 'game' ? "/game/list" : "/game_alias/list"
        let query = {
          token: this.token, page: this.page, per_page: this.per_page,
          start_time: this.params.start_time / 1000, end_time: this.params.end_time / 1000,
          game_name: this.params.game_name, from: this.params.from
        }
        this.downloadUrl = ENV.CPS_HOST_URL + '/game/get_allGame_excel?token=' + query.token +
          '&page=' + query.page + '&from=' + query.from + '&per_page=' + query.per_page +
          '&start_time=' + query.start_time + '&end_time=' +
          query.end_time + '&game_name=' + query.game_name;
        this.$http.get(ENV.CPS_HOST_URL + urlpath,
          {params: query
          }
        ).then(response => {
          this.items = response.body.data
          this.total = response.body.total
        }, error => {
          if (error.status === 403) {
            this.$router.push({path: '/login'})
          } else {
            this.$message.error(error.body)
          }
        })
      },
      onSubmit () {
        this.getList()
      },
      onCreateGame () {
        this.dialogFlag = 'create'
        this.dialogFormVisible = true
        this.disableds = false
        this.cpsdisabled = false
        this.form = {
          game_name: '',          // 游戏名
          gamealias: '',          // 游戏别名
          from: 1,               // 合作模式
          discount: 50,           // 折扣
          servicecharge_rate: 2,  // 服务费
          cash_pledge: 0.00,        // 押金
          state: 1,              // 状态 1上架2下架
          cps_gameid: 0,         // cps 游戏ID
          cps_game_filename: '',  // cps游戏文件名
          tencent_appid: 0,      // 腾讯appid
          anysdk_gameid: 0,      // 联运游戏id
          transfer_level: 1,       // 下放等级
          audit_level: 1,         // 审核等级
          publish_time: (new Date()).valueOf(),
          profit_model: 1,        // 返币模式
        }
      },

      onCreateGameAlias () {
        this.aliasFormVisible = true
        this.disableds = false
        this.aliasform = {
          alias: '',
          icon: '',
          game_level: 7,
          catename: '',
          server_type: 2,
          publish_time: (new Date()).valueOf(),
          version_name: '',
          packagename: '',
          filesize: '',
          developer: '',
          sort: 0,
        }
      },

      onFromChange() {
        this.cpsdisabled = true
        this.tendisabled = true
        this.anydisabled = true
        if (this.form2.from ==  1 || this.form2.from == 2 || this.form2.from == 7){
          this.cpsdisabled = false
          this.tendisabled = true
          this.anydisabled = true
        }
        else if(this.form2.from == 3 || this.form2.from == 5 ) {
          this.cpsdisabled = true
          this.tendisabled = false
          this.anydisabled = true
        }else if(this.form2.from == 4 ) {
          this.cpsdisabled = true
          this.tendisabled = true
          this.anydisabled = false
        }
      },

      onFromChange2() {
        this.cpsdisabled = true
        this.tendisabled = true
        this.anydisabled = true
        if (this.form.from ==  1 || this.form.from == 2){
          this.cpsdisabled = false
          this.tendisabled = true
          this.anydisabled = true
        }
        else if (this.form.from == 7){
          this.cpsdisabled = false
          this.tendisabled = true
          this.anydisabled = true
          this.form.profit_model = 2
        }
        else if(this.form.from == 3 || this.form.from == 5 ) {
          this.cpsdisabled = true
          this.tendisabled = false
          this.anydisabled = true
        }else if(this.form.from == 4 ) {
          this.cpsdisabled = true
          this.tendisabled = true
          this.anydisabled = false
        }else if(this.form.from == 6 ) {
          this.cpsdisabled = true
          this.tendisabled = true
          this.anydisabled = true
        }
      },

      onCurrentChange (currentPage) {
        this.page = currentPage
        this.getList()
      },
//      编辑游戏
      auditSuccess ( v ) {
        // console.log(v)
        if (v.publish_time.toString().length > 11){
          v.publish_time = this.i
        }else {
          this.i = v.publish_time * 1000
          v.publish_time = this.i
        }
        this.dialogFlag = 'edit'
        this.show_cooperation = true
        this.disableds = false
        let form
        this.id = v.id
        this.value_from = v.from
        console.log(v)
        switch (v.from)
        {
          case 0:
            form = (v.distinct_cooperation==2 ? 2 : 1)
            this.cpsdisabled = false
            this.tendisabled = true
            this.anydisabled = true
            break;
          case 1:
            form = 3
            this.cpsdisabled = true
            this.tendisabled = false
            this.anydisabled = true
            break;
          case 2 :
            form = 4
            this.cpsdisabled = true
            this.tendisabled = true
            this.anydisabled = false
            break;
          case 3 :
             form = 5
            this.cpsdisabled = true
            this.tendisabled = false
            this.anydisabled = true
            break;
          case 4 :
             form = 6
            this.cpsdisabled = true
            this.tendisabled = true
            this.anydisabled = true
            break;
          case 5 :
             form = 7
            this.cpsdisabled = false
            this.tendisabled = true
            this.anydisabled = true
            break;
        }
        this.form2.game_name   = v.game_name
        this.form2.from         = form
        this.form2.discount   = v.discount
        this.form2.cash_pledge   = v.cash_pledge
        this.form2.state        = v.state
        this.form2.cps_gameid    = v.cps_gameid
        this.form2.cps_game_filename = v.cps_game_filename
        this.form2.tencent_appid = v.tencent_appid
        this.form2.anysdk_gameid = v.anysdk_gameid
        this.form2.transfer_level = v.transfer_level
        this.form2.publish_time = v.publish_time
        this.form2.audit_level = v.audit_level
        this.form2.mode = v.audit_level
        this.form2.profit_model = v.profit_model
        this.form2.servicecharge_rate = v.servicecharge_rate
        this.form2.gamealias = v.game_alias.alias
        this.form2.game_level = v.game_level
        this.dialogFormVisible2 = true
      },
//取消编辑框
      cancleDialog (item) {
        item.publish_time /= 1000
        this.dialogFormVisible2 = false
        // this.form2.from = this.value_from
      },
      cancleAddDialog (item) {
        item.publish_time /= 1000
        this.dialogFormVisible = false
      },

      //      编辑别名
      editAlias ( item ) {
        let t
        if (item.publish_time.toString().length > 11){
          item.publish_time = this.time
        }else {
          this.time = item.publish_time * 1000
          t = this.time
        }
//        item.publish_time = item.publish_time * 1000
        this.cpsdisabled = false
        this.tendisabled = false
        this.anydisabled = false
        this.disableds = false
//        this.aliasform = item
        this.aliasFormVisible2 = true

        this.aliasform2.id =  item.id,
        this.aliasform2.alias =  item.alias,
        this.aliasform2.icon =  item.icon,
        this.aliasform2.game_level = item.game_level,
        this.aliasform2.catename = item.catename,
        this.aliasform2.server_type = item.server_type,
        this.aliasform2.publish_time = t,
        this.aliasform2.version_name = item.version_name,
        this.aliasform2.packagename = item.packagename,
        this.aliasform2.filesize = item.filesize,
        this.aliasform2.developer = item.developer,
        this.aliasform2.sort = item.sort

      },

      editGame (v) {
        console.log(v)
        v.id = this.id
//        v.publish_time = v.publish_time/1000
        v.publish_time = parseInt(v.publish_time/1000)
        v.cps_gameid = parseInt(v.cps_gameid)
        v.anysdk_gameid = parseInt(v.anysdk_gameid)
        v.tencent_appid = parseInt(v.tencent_appid)
        v.cash_pledge = parseFloat(v.cash_pledge)
        v.discount = parseFloat(v.discount)
        v.servicecharge_rate = parseFloat(v.servicecharge_rate)
        console.log('========= ',v.servicecharge_rate)
        let put_json = {
          'game': v,
          'token': this.token,
          'game_alias': v.gamealias,
        }
        this.$http.put(ENV.CPS_HOST_URL + '/game/alter_game', put_json).then((response) => {
          this.$message.success('修改成功')
          this.dialogFormVisible2 = false
          this.getList()
          this.postToken = ""
        }, (error) => {
          this.postToken = ""
          this.$message.error(error.body)
        })
//        重新初始化时间回来
        v.publish_time = v.publish_time * 1000
      },

      addGame (v) {
        let from = v.from
        if(this.postToken != "") {
          return
        }
        v.publish_time = parseInt(v.publish_time/1000)
        v.cps_gameid = parseInt(v.cps_gameid)
        v.anysdk_gameid = parseInt(v.anysdk_gameid)
        v.tencent_appid = parseInt(v.tencent_appid)
        v.cash_pledge = parseFloat(v.cash_pledge)
        v.discount = parseFloat(v.discount)
        v.servicecharge_rate = parseFloat(v.servicecharge_rate)

        let post = {
          'game': v,
          'token': this.token,
          'game_alias': v.gamealias,
        }

        this.postToken = "waiting"
        this.postToken = ""
        this.$http.post(ENV.CPS_HOST_URL + '/game/addgame', post).then((response) => {
          this.$message.success('发布成功')
          this.dialogFormVisible = false
          this.getList()
          this.postToken = ""
        }, error => {
          this.postToken = ""
          this.$message.error(error.body)
        })

        v.from = from
        v.publish_time *= 1000
      },

      cancleGameAlias(v) {
        this.aliasFormVisible = false
        this.time = v.publish_time/1000
      },
      cancleAuditGameAlias(v) {
        this.aliasFormVisible2 = false
        v.publish_time /= 1000
      },
      addGameAlias (v) {
        if(this.postToken != "") {
          return
        }
        v.publish_time = parseInt(v.publish_time/1000)

        this.postToken = "waiting"
        this.postToken = ""
        if (v.id) {
          let put_json = {
            'gamealias': v,
            'token': this.token,
          }
          this.$http.put(ENV.CPS_HOST_URL + '/game_alias/alter_alias', put_json).then((response) => {
            this.$message.success('修改成功')
            this.getList()
            this.postToken = ""
            this.aliasFormVisible2 = false
          }).then((error) => {
            this.postToken = ""
            this.$message.error(error)
            this.aliasFormVisible = true
          })
        } else {
          let post = {
            'gamealias': v,
            'token': this.token,
          }
          this.postToken = "waiting"
          this.postToken = ""
          this.$http.post(ENV.CPS_HOST_URL + '/game_alias/addgamealias', post).then((response) => {
            this.$message.success('发布成功')
            this.aliasFormVisible = false
            this.getList()
            this.postToken = ""
          }, error => {
            this.postToken = ""
            this.$message.error(error.body)
          })
        }
        v.publish_time *= 1000
      },

      deleteGame(id) {
        this.token = sessionStorage.getItem("token")
        this.$confirm('此操作将删除该游戏, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(ENV.CPS_HOST_URL + "/game/delete_game?id=" + id + '&token=' + this.token).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getList()
          })
        }, (error) => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
        this.aliasFormVisible = false
      },

      onPicUpload(response, file, fileList) {
        if (response.status != 0) {
          this.$message.error(response.error_message)
        }
        this.aliasform.icon = response.data.url
        this.aliasform2.icon = response.data.url
      },

      beforeAvatarUpload(file) {
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isPNG) {
          this.$message.error('上传头像图片只能是 PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isPNG && isLt2M;
      },

    }
  }
</script>

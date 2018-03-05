<template>
  <div>
    <div id="edit_h">
      <h3>编辑阴阳师</h3>
      <div>
        <div>
          <div class="flow_list_d">
            <div>
              <span>游戏名称：</span>
              <multiselect class="form-control form-control_statesd"
                           v-model="selectedStatus" tag-placeholder="Add this as new tag" placeholder="搜索选择游戏"
                           label="desc" track-by="value" :options="status" :multiple="false" :taggable="false">
              </multiselect>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group_settlementsd">
        <label>对账日期 ：</label>
        <div class="input-group input-lg_status">
          <div class="input-group-addon">
            <i class="fa fa-calendar"></i>
          </div>
          <datepicker v-model="time" :range="true"></datepicker>
        </div>
        <!-- /.input group -->
      </div>
      <div>
        <p class="situation">
          结算状态：
          <select name="contr" class=" form-control input-lg input-lg_status">
            <option value="0">请选择对账状态</option>
            <option value="1">未结算</option>
            <option value="2">结算中</option>
            <option value="4">已结算</option>
          </select>
        </p>
      </div>
      <div>
        <span>应付金额：</span><input class="form-control input-lg input-lg_status" type="text" name=""
                                 placeholder="请输入应付金额！"/>
      </div>
      <div>
        <span>实付金额：</span><input class="form-control input-lg input-lg_status" type="text" name=""
                                 placeholder="请输入实付金额！"/>
      </div>
      <div>
        <p>
          结算人：
          <select name="contr" class=" form-control input-lg input-lg_status">
            <option value="0">请选择结算人</option>
            <option value="1">ZZ</option>
            <option value="2">MDZZ</option>
            <option value="4">ZZMD</option>
          </select>
        </p>
      </div>
      <div id="Operate">
        <p>上传合同：
        <div class="message">
          <form method="post" action="" enctype="multipart/form-data">
            <input type="text" id="txt" name="txt" class="input" value="未上传" disabled="disabled"/>
            <input type="button" onMouseMove="f.style.pixelLeft=event.x-60;f.style.pixelTop=this.offsetTop;"
                   value="上传图片" size="30" onClick="f.click()" class="liulan">
            <input type="file" id="f" onChange="txt.value=this.value" name="f" style="height:26px;" class="files"
                   size="1" hidefocus>
          </form>
        </div>
        </p>
      </div>
      <div class="form-group form-group_textarea">
        <span>备注：</span>
        <textarea class="form-control" rows="3" placeholder="请备注 ..."></textarea>
      </div>
      <div id="btn_dv">
        <p id="test">
          <button class="btn btn-default btn_B" @click="sayHi('0')">保存</button>
          <button class="btn btn-default btn_F" @click="sayHi('1')">返回</button>
        </p>
      </div>
    </div>
  </div>
</template>
<style>
  .form-group_settlementsd {
    width: 25%;
    min-width: 256px;
    margin-top: 30px;
  }

  .input-lg_status {
    width: 35%;
    min-width: 220px;
    max-width: 400px;
  }
  .form-control_statesd{
    padding:0;
    width: 35%;
    min-width: 220px;
    max-width: 400px;
  }
  .form-group_textarea{
    width: 30%;
    max-width: 400px;
    min-width: 220px;
  }
  .form-group_textarea>textarea{
    margin-left: 0px;
  }

</style>
<script>
  import Multiselect from 'vue-multiselect'
  import datepicker from 'vue-date'
  import util from '../../publicjs/utils'

  export default {
    data: function () {
      return {
        selectedGames: [],
        games: [],
        selectedStatus:[],
        status:[],
        time:[],
      }
    },
    components: {
      Multiselect,
      datepicker
    },
    mounted: function () {

    }
  }
</script>

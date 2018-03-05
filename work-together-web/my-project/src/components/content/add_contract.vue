<template>
  <div class="content-wrapper">
    <div id="edit_h">
      <h3>添加CP合同信息</h3>
      <div>
        <div style="padding-left: 0px; " class="flow_list_d">
          <div class="dowebok" id="gname">
            <span>游戏名称：</span>
            <select style="margin-top: -26px;z-index: 10;margin-left: 88px;" id="select">
              <option value="">请选择游戏</option>
              <option value="一月">阴阳师</option>
              <option value="二月">2</option>
              <option value="三月">3</option>
              <option value="四月">4</option>
              <option value="五月">5</option>
              <option value="六月">6</option>
              <option value="七月">7</option>
              <option value="八月">8</option>
              <option value="九月">9</option>
              <option value="十月">10</option>
              <option value="十一月">11</option>
              <option value="十二月">12</option>
            </select>
          </div>
        </div>
      </div>
      <div class="form-group" style="margin-top: 46px;width: 25.2%;">
        <label>合同开始日期--结束日期 ：</label>

        <div class="input-group">
          <div class="input-group-addon">
            <i class="fa fa-calendar"></i>
          </div>
          <input style="margin-top: 0;margin-left: 3%;" type="text" class="form-control pull-right" id="reservationss">
        </div>
        <!-- /.input group -->
      </div>

      <div>
        <p style="margin-top: 42px;" class="situation">
          合同状态
          <select name="contr" class=" form-control input-lg">
            <option value="0">请选择合同状态</option>
            <option value="1">未签订</option>
            <option value="2">进行中</option>
            <option value="3">已签订</option>
            <option value="4">已到期</option>
          </select>
          <input class="form-control input-lg" type="text" name="" id="" placeholder="请填写合同编号"/>
        </p>
      </div>
      <div id="Operate">
        <p style="margin-top: 50px;">上传合同：
        <div style="left: 15.5%;margin-top: -23px;" class="message">
          <form method="post" action="" enctype="multipart/form-data">
            <input type="text" id="txt" name="txt" class="input" value="未上传" disabled="disabled"/>
            <input type="button" onMouseMove="f.style.pixelLeft=event.x-60;f.style.pixelTop=this.offsetTop;" value="上传图片" size="30" onClick="f.click()" class="liulan">
            <input type="file" id="f" onChange="txt.value=this.value" name="f" style="height:26px;" class="files" size="1" hidefocus>
          </form>
        </div>
        </p>
      </div>
      <div style="margin-left: 110px;margin-top: 50px;" class="form-group">
        <span>备注：</span>
        <textarea style="margin-top: 0px;margin-left: 40px;" class="form-control" rows="3" placeholder="请备注 ..."></textarea>
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
<style type="text/css">

  .sele {
    margin-left: 26px;
  }

</style>
<script>
  export default {
    mounted: function () {
    }
  };
</script>

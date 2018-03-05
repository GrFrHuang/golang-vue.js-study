<template>
  <div>
    <div class="row">
      <div style="padding-top: 73px;" class="flow_list_d col-md-3">
        <div style="z-index: 10;position: relative;" class="dowebok" id="gname">
          游戏名称：
          <select style="margin-top: -26px;z-index: 10;margin-left: 88px;" id="selectdt3">
            <option value="">请选择游戏</option>
            <option value="一月">1</option>
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
    <div>

    </div>
    <div class="row col-md-10">
      <div style="margin-left: 60px;" class="col-md-7">
        <div class="htmleaf-container">
          <div id="_htmleaf" class="htmleaf-content" style="    margin-bottom: 0;">
            <div style="padding-bottom: 145px;">

              运营方：
              <select id="selectcthj4" name="selectc" multiple>

                <option value="1" class="option_one">请选择运营方</option>
                <option value="2" class="option_two">有量</option>
                <option value="3" class="option_three">快发</option>
                <option value="4" class="option_four">1</option>
                <option value="5" class="option_five">2</option>
                <option value="7" class="option_seven">3</option>
                <option value="8" class="option_eight">4</option>
                <option value="9" class="option_nine">5</option>
                <option value="10" class="option_ten">6</option>
                <option value="11" class="option_eleven">7</option>
                <option value="12" class="option_twelve">8</option>
                <option value="13" class="option_thirteen">9</option>
                <option value="14" class="option_fourteen">0</option>
              </select>
              <input style="display: none" value="activate selectator" id="activate_selectatorcj3" type="button"> <br/>
              运营负责人：
              <select id="selecthj5" name="select4" multiple>
                <option value="3" class="option_three">请选择运营负责人</option>
                <option value="4" class="option_four">XX</option>
                <option value="5" class="option_five">XXX</option>
                <option value="6" class="option_six">XXXX</option>
                <option value="8" class="option_eight">XXXXX</option>
                <option value="9" class="option_nine">XXXXX</option>
                <option value="10" class="option_ten">XXXXX</option>
                <option value="11" class="option_eleven">XXXXXX</option>
                <option value="12" class="option_twelve">XXXXX</option>
                <option value="13" class="option_thirteen">XXXXXXX</option>
                <option value="14" class="option_fourteen">XXXXXXXX</option>
              </select>
              <input style="display: none" value="activate selectator" id="activate_selectatorj2" type="button">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  #selectcthj4 {
    width: 278px;
    height: 36px;
    top: 4%;
    right: 18%;
  }

  #selecthj5 {
    width: 278px;
    height: 36px;
    top: 4%;
    left: 27%;
  }

  #activate_selectatorcj3 {
    left: 3%;
    margin-right: 58px;
  }

  #activate_selectatorj2 {
    left: 3%;
  }
</style>
<script>
  export default {
    mounted: function () {
    }
  };
</script>

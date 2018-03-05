<template>
  <div>
    <div id="edit_h">
      <h3>添加游戏</h3>
      <div>
        <div class="htmleaf-container">
          <div id="_htmleaf" class="htmleaf-content" style="margin-bottom: 0;margin-left: 0;">
            <div style="padding-bottom: 145px;">

              游戏名称:
              <select id="selecta" name="selecta" multiple>

                <option value="1" class="option_one">请选择游戏名称</option>
                <option value="2" class="option_two">Two</option>
                <option value="3" class="option_three">Three</option>
                <option value="4" class="option_four">Four</option>
                <option value="5" class="option_five">Five</option>
                <option value="7" class="option_seven">Seven</option>
                <option value="8" class="option_eight">Eight</option>
                <option value="9" class="option_nine">Nine</option>
                <option value="10" class="option_ten">Ten</option>
                <option value="11" class="option_eleven">Eleven</option>
                <option value="12" class="option_twelve">Twelve</option>
                <option value="13" class="option_thirteen">Thirteen</option>
                <option value="14" class="option_fourteen">Fourteen</option>
              </select>
              <input style="display: none" value="activate selectator" id="activate_selectatora" type="button">
            </div>
          </div>
        </div>
      </div>

      <div class="Whether">
        <p>是否拉组<input name="Fruit" type="radio" value=""/>是
          <input name="Fruit" type="radio" value=""/>否</p>
        <input class="form-control input-lg" type="text" name="" id="" placeholder="百度&快发对接群"/>
      </div>
      <div>
        <p class="situation">
          SDK接入情况 <input class="form-control input-lg" type="text" name="" id="" placeholder="已完成对接"/>
        </p>
      </div>
      <div id="Operate">
        <p>
          运营方<input name="Fruit" type="checkbox" value=""/>快发
          <input name="Fruit" type="checkbox" value=""/>有量
        </p>
      </div>
      <div>
        <p class="charge">
          运营负责人
          <input class="form-control input-lg" type="text" name="" id="" placeholder="小自傲"/>
        </p>
      </div>
      <div id="Situation">
        <p>总渠道数:<input class="form-control input-lg" type="text" name="" id="" placeholder="34"/></p>
        <p>发包情况:<input class="form-control input-lg" type="text" name="" id="" placeholder="ok"/></p>
        <p>礼包情况:<input class="form-control input-lg" type="text" name="" id="" placeholder="ok"/></p>
        <p>素材情况:<input class="form-control input-lg" type="text" name="" id="" placeholder="ok"/></p>
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
</style>
<script>
  export default {
    mounted: function () {

    }
  }

</script>

<template>
  <div>
    <div class="row">
      <div style="z-index: 9;" class="row col-md-4">
        <div style="margin-left: 60px;" class="col-md-12">
          <div class="htmleaf-container">
            <div id="_htmleaf" class="htmleaf-content" style="    margin-bottom: 0;">
              <div style="padding-bottom: 145px;">

                游戏选择
                <select id="select6" name="select6" multiple>

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
                <input value="activate selectator" id="activate_selectator6" type="button" style="display: none;width: 278px;">
              </div>
            </div>
          </div>
        </div>
      </div>
      <button style="z-index: 9;" class="flow_list_btn col-md-1 btn btn-default">提交</button>
      <CustomerService></CustomerService>
    </div>
  </div>
</template>
<style>

</style>
<script>
  import CustomerService from './CustomerService/CustomerService'

  export default {
    components: {
      CustomerService
    }, mounted: function () {

    }

  }
</script>

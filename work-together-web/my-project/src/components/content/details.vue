<template>
	<div>
		<div class="row">
			<div  style="padding-top: 73px;" class="flow_list_d col-md-7 col-lg-7">
				<div  style="z-index: 10;position: relative;"  class="dowebok" id="gname">
					游戏名称：
					<select style="margin-top: -26px;z-index: 10;margin-left: 88px;" id="selectd2">
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
				<div style="margin-top: 52px;position: relative;z-index: 8;" class="dowebok">
					渠道名称：
					<select style="margin-top: -26px;z-index: 10;margin-left: 88px;" id="selectd3">
						<option value="">请选择渠道</option>
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
			<div class="form-group col-md-7 col-lg-7" style="margin-top: 46px;">
				<label>日期 ：</label>

				<div class="input-group">
					<div class="input-group-addon">
						<i class="fa fa-calendar"></i>
					</div>
					<input style="margin-top: 0;"  type="text" class="form-control pull-right" id="reservation">
				</div>
				<!-- /.input group -->
			</div>
			<button class="flow_list_btn col-md-1 btn btn-default">提交</button>
		</div>
		<detailsa></detailsa>
	</div>

</template>
<style>
	.sele {
		margin-left: 26px;
	}

</style>
<script>
	//	require.ensure([], function(require){
	//  var daterangepicker = require('./daterangepicker.js');
	//});
	import detailsa from './game_flow/detailsa'

	export default {
		components: {
			detailsa
		},
		mounted: function() {
    }
	}
</script>

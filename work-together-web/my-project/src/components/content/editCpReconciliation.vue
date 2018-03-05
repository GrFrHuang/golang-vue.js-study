<template>
	<div>
		<div id="edit_h">
			<h3 style="    margin-bottom: 26px;">编辑阴阳师</h3>
			<div>
				<div>
					<div style="padding-left: 0;" class="flow_list_d">
						<div class="dowebok" id="gname">
							<span>游戏名称：</span>
							<select style="margin-top: -26px;z-index: 10;margin-left: 97px;" id="select">
								<option value="">请选择游戏</option>
								<option value="一月">阴阳师</option>
								<option value="二月">大话西游</option>
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
			</div>
			<div class="form-group" style="margin-top: 46px;width: 30.5rem;">
				<label>对账开始日期--结束日期 ：</label>

				<div class="input-group">
					<div class="input-group-addon">
						<i class="fa fa-calendar"></i>
					</div>
					<input style="margin-top: 0;margin-left: 3%;"  type="text" class="form-control pull-right" id="reservationss">
				</div>
				<!-- /.input group -->
			</div>
			<!-- /.input group -->
			<p style="margin-top: 42px;margin-left: 110px;" class="situation">
				对账状态：
				<select style="    margin-left: 1.2rem;" name="contr" class=" form-control input-lg">
					<option value="0">请选择对账状态</option>
					<option value="1">未开发票</option>
					<option value="2">对账中</option>
					<option value="3">已开发票</option>
					<option value="4">已对账</option>
				</select>
			</p>
		</div>
		<div style="margin-top: 50px;    margin-left: 140px;" id="Operate">
			<p>对账单上传：
				<div style="left: 19rem;margin-top: -23px;" class="message">
					<form method="post" action="" enctype="multipart/form-data">
						<input type="text" id="txt" name="txt" class="input" value="未上传" disabled="disabled" />
						<input type="button" onMouseMove="f.style.pixelLeft=event.x-60;f.style.pixelTop=this.offsetTop;" value="上传图片" size="30" onClick="f.click()" class="liulan">
						<input type="file" id="f" onChange="txt.value=this.value" name="f" style="height:26px;" class="files" size="1" hidefocus>
					</form>
				</div>
			</p>
		</div>
		<div style="margin-top: 40px;  margin-left: 140px" class="form-group">
				<label>对账时间:</label>

				<div style="width: 30.5rem;margin-top:0px;" class="input-group date">
					<div class="input-group-addon">
						<i class="fa fa-calendar"></i>
					</div>
					<input style="margin-top:0px;" type="text" class="form-control pull-right" id="datepicker3">
				</div>
				<!-- /.input group -->
			</div>
			<div>
				<div style="margin-top: 20px;  margin-left: 80px"  class="flow_list_d">
					<div>
						<span>对账金额：</span><input style="margin-top: 0;margin-left: 17px;" class="form-control" type="text" name="" id="" value="" />
					</div>
				</div>
			</div>
			<div>
				<p style="margin-top: 40px;  margin-left: 140px" class="situationf1">
					对账人：
					<select style="margin-left: 27px;margin-top: 0;" name="contr" class=" form-control input-lg">
						<option value="0">请选择对账人</option>
						<option value="1">ZZ</option>
						<option value="2">MDZZ</option>
						<option value="4">ZZMD</option>
					</select>
				</p>
			</div>
		<div style="margin-left: 140px;margin-top: 50px;" class="form-group">
			<span style="margin-right: 41px;">备注：</span>
			<textarea style="margin-top: 0px;" class="form-control" rows="3" placeholder="请备注 ..."></textarea>
		</div>
		<div id="btn_dv">
			<p id="test">
				<button style="margin-left: 226px;margin-right: 45px;width: 114px;" class="btn btn-default btn_B" @click="sayHi('0')">保存</button>
				<button style="width: 114px;" class="btn btn-default btn_F" @click="sayHi('1')">返回</button>
			</p>
		</div>
	</div>
	</div>

</template>
<style type="text/css">

	.sele {
		margin-left: 26px;
	}

	.datepicker-days>.table>thead>tr:first-child {
		background: #fff!important;
	}

	.datepicker-days>.table>tfoot>tr,
	.datepicker-days>.table>tbody>tr {
		height: 0;
	}

	.datepicker-days>.table {
		width: 100%!important;
		max-width: 100%!important;
	}
</style>

<script>
	export default {
		mounted: function() {
				$('#select').comboSelect();

				$('#reservationss').daterangepicker();
			//Date range picker with time picker
			$('#reservationtime').daterangepicker({
				timePicker: true,
				timePickerIncrement: 30,
				format: 'MM/DD/YYYY h:mm A'
			});
					$('#datepicker3').datepicker({
				autoclose: true
			});
		}};
</script>

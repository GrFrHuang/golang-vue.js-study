<template>
	<div>
		<p style="margin-top: 42px;margin-left: 110px;">角色名称：<i>CTO</i></p>
		<div class="row">
			<p class="col-md-1" style="margin-top: 42px;margin-left: 110px;">权限分配:</p>
			<div class="col-md-5 role_input row">
				<p style="margin-top: 20px;">
					<input type='checkbox' class='input-checkbox' @click='checkedAll' v-model="allCheck">全选<br />
				</p>
				<div class="clearfix">
					<h3>游戏数据管理</h3>
					<p v-for="GameDat in GameDats" class=" col-md-4">
						<input type="checkbox" v-model="GameDate" v-bind:true-value="1" v-bind:false-value="0" :value='GameDat.id'>{{ GameDat.value }}
					</p>
				</div>
				<div class="clearfix">
					<h3>游戏管理</h3>
					<p v-for="GameManagemen in GameManagemens" class=" col-md-4">
						<input type="checkbox" v-model="GameDate" v-bind:true-value="1" v-bind:false-value="0" :value='GameManagemen.id'>{{ GameManagemen.value }}
					</p>
				</div>
				<div class="clearfix">
					<h3>游戏合同管理</h3>
					<p v-for="GameContrac in GameContracs" class=" col-md-4">
						<input type="checkbox" v-model="GameDate" v-bind:true-value="1" v-bind:false-value="0" :value='GameContrac.id'>{{ GameContrac.value }}
					</p>
				</div>
				<div class="clearfix">
					<h3>渠道合同管理</h3>
					<p v-for="ChannelContrac in ChannelContracs" class=" col-md-4">
						<input type="checkbox" v-model="GameDate" v-bind:true-value="1" v-bind:false-value="0" :value='ChannelContrac.id'>{{ ChannelContrac.value }}
					</p>
				</div>
				<div class="clearfix">
					<h3>协助者管理</h3>
					<p v-for="AssistantManagemen in AssistantManagemens" class=" col-md-4">
						<input type="checkbox" v-model="GameDate" v-bind:true-value="1" v-bind:false-value="0" :value='AssistantManagemen.id'>{{ AssistantManagemen.value }}
					</p>
				</div>
			</div>
		</div>
		<div id="btn_dv">
			<p id="test">
				<button style="margin-left: 200px;margin-right: 45px;width: 114px;" class="btn btn-default btn_B" @click="sayHi('0')">保存</button>
				<button style="width: 114px;" class="btn btn-default btn_F" @click="sayHi('1')">返回</button>
			</p>
		</div>
	</div>
</template>
<style type="text/css">
	.role_input {
		border: 1px solid #000;
		padding-right: 3%;
		margin-left: -40px;
		margin-top: 40px;
		margin-bottom: 50px;
	}
	
	.role_input>div>p {
		margin: 10px 0;
		padding-left: 0;
	}
</style>
<script type="text/javascript">
	export default {
		data: function() {
			return {
				GameDats: [{
					id: '1',
					value: '查看游戏盈亏表'
				}, {
					id: '2',
					value: '查看游戏流水'
				}, ],
				GameManagemens: [{
					id: '3',
					value: '查看游戏进度'
				}, {
					id: '4',
					value: '添加游戏进度'
				}, {
					id: '5',
					value: '编辑游戏进度'
				}, {
					id: '6',
					value: '查看游戏接入'
				}, {
					id: '7',
					value: '添加游戏接入'
				}, {
					id: '8',
					value: '编辑游戏接入'
				}, ],
				GameContracs: [{
					id: '9',
					value: '查看游戏合同'
				}, {
					id: '10',
					value: '添加游戏合同'
				}, {
					id: '11',
					value: '编辑游戏合同'
				}, {
					id: '12',
					value: '查看游戏对账'
				}, {
					id: '13',
					value: '添加游戏对账'
				}, {
					id: '14',
					value: '编辑游戏对账'
				}, {
					id: '15',
					value: '查看游戏结算'
				}, {
					id: '16',
					value: '添加游戏结算'
				}, {
					id: '17',
					value: '编辑游戏结算'
				}, ],
				ChannelContracs: [{
					id: '18',
					value: '查看渠道合同'
				}, {
					id: '19',
					value: '添加渠道合同'
				}, {
					id: '20',
					value: '编辑渠道合同'
				}, {
					id: '21',
					value: '查看渠道对账'
				}, {
					id: '22',
					value: '添加渠道对账'
				}, {
					id: '23',
					value: '编辑渠道对账'
				}, {
					id: '24',
					value: '查看渠道回款'
				}, {
					id: '25',
					value: '添加渠道回款'
				}, {
					id: '26',
					value: '编辑渠道回款'
				}, ],
				AssistantManagemens: [{
					id: '27',
					value: '查看部门'
				}, {
					id: '28',
					value: '添加部门'
				}, {
					id: '29',
					value: '编辑部门'
				}, {
					id: '30',
					value: '查看用户'
				}, {
					id: '31',
					value: '添加用户'
				}, {
					id: '32',
					value: '编辑用户'
				}, ],
				GameDate: [],
				allCheck: false
			}
		},
		components: {},
		props: {},
		methods: {
			checkedAll: function() {
				var _this = this;
				console.log(_this.GameDate);
				if(this.allCheck) {
					_this.GameDate = [];

				} else {
					console.log(this.checked);
					_this.GameDate = [];
					_this.GameDate.forEach(function(item) {
						_this.GameDate.push(item.id);
					});
				}

			}

		},
	}
</script>
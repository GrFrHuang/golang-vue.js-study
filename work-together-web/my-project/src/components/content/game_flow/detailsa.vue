<template>
	<div style="width: 90%;" class="_list_tab">
		<div style="    margin-top: -34px;" class="_list_tab_btn">
			<button class=" btn btn-default">导出excel</button>
		</div>
		<table class="table table-hover" id="show1">
			<thead id="app-41">
				<tr>
					<th v-for="todo in todos">
						{{ todo.text }}
					</th>
				</tr>
			</thead>
			<tbody v-for="item in items">
				<tr>
					<td>{{ item.date_range }}</td>
					<td>{{ item.game_name }}</td>
					<td>{{ item.cp }}</td>
					<td>{{ item.total }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<style>
#show1>tbody:nth-child(2)>tr>td:last-child{
	color: red;
}
</style>
<script>
	export default {
		data: function() {
			return {
				todos: [{
					text: '日期'
				}, {
					text: '游戏名称'
				}, {
					text: '渠道名称'
				}, {
					text: '总流水'
				}],

				parentMessage: 'Parent',
				items: []
			}
		}
	}
</script>

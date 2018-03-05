<template>
	<div>
		<div class="box">

				<div class="box-header">
				</div>
				<!-- /.box-header -->
					<div style="margin-top: -40px;" class="_list_tab_btn">
			<button class="btn btn-default">导出excel</button>
		</div>
				<div class="box-body col-md-11">
					<table id="examplesg2" class="table table-bordered table-hover">
						<thead>
							<tr>
								<th v-for="todo in todos">
									{{ todo.text }}
								</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in items">
								<td>{{ item.msg }}</td>
								<td>{{ item.kk }}</td>
								<td>{{ item.ll }}</td>
								<td>{{ item.rr }}</td>
								<td>{{ item.qq }}</td>
								<td>{{ item.ww }}</td>
								<td>{{ item.tt }}</td>
								<td style="border-top:0 ;cursor:pointer;display:table-cell" class="fa fa-edit" @click=editGameEvaluation(item.id)>{{ item.ee }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<!-- /.box-body -->
	</div>
	</div>

</template>

<script>
	export default {
		data: function() {
			return {
				todos: [{
					text: '游戏名称'
				}, {
					text: '礼包情况'
				}, {
					text: '总渠道数'
				}, {
					text: '运营方'
				}, {
					text: '运营负责人'
				}, {
					text: '更新人'
				}, {
					text: '更新时间'
				},  {
					text: '操作'
				}, ],
				parentMessage: 'Parent',
				items: [{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				},{
					msg: '皇室战争',
					kk: '12',
					ll: '12',
					rr: '快发',
					ww: '何宗江、xxx',
					qq: '某某',
					tt: '2016-12-30',
					ee: ''
				}, 	]
			}
		},
		methods: {
			editGameEvaluation: function(id) {
				this.$router.push({path:'/home/editOperationalReadiness'})
			}
		}
		}
</script>

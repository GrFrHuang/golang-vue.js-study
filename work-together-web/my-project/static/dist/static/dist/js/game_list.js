$(function() {
	jeDate({
		dateCell: "#dateinfo",
		format: 'YYYY-MM-DD',
		isinitVal: true,
		isTime: true, //isClear:false,
		okfun: function(val) {}
	})
	jeDate({
		dateCell: "#dateinfo1",
		format: 'YYYY-MM-DD',
		isinitVal: true,
		isTime: true, //isClear:false,
		okfun: function(val) {}
	})
	var gema_td = $('#show>tbody:nth-child(n+3)>tr>td:nth-child(4)');
	gema_td.addClass('fa fa-bell-o');
	gema_td.css('color', 'red');
	var gema_td1 = $('#show>tbody:nth-child(n+5)>tr>td:nth-child(4)');
	gema_td1.css('color', 'goldenrod');
});
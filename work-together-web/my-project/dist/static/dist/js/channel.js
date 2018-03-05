$(function(){
		var app4 = new Vue({
			  el: '#app-4',
			  data: {
			    todos: [
			      { text: '游戏名称' },
			      { text: '渠道名称' },
			      { text: '预付款' },
			      { text: '签订时间' },
			      { text: '终止时间' },
			      { text: '合同情况' },
			      { text: '合同下载' },
			      { text: '操作' },
			    ]
			  }
		});
	var ex1 = new Vue({
    el: '#show',
    data: {
        parentMessage: 'Parent',
        items: [
            {msg: '大话西游',kk: '乐嗨嗨',ll:'100万',ww:'2016-10-1',qq:'2017-10-1',rr:'已签订（KF343434）',tt:' ',yy:' '},
            {msg: '大话西游',kk: '乐嗨嗨',ll:'100万',ww:'2016-10-1',qq:'2017-10-1',rr:'已签订（KF343434）',tt:' ',yy:' '},
        ]
    }
});
var gema_td = $('#show>tbody:nth-child(n+2)>tr>td:last-child');
	gema_td.addClass('fa fa-edit');
	gema_td.css({'border-top':'0px','cursor':'pointer','display': 'table-cell'});
	gema_td.click(function(){
		window.location.href="edit.html";
	})
var game_download = $('#show>tbody:nth-child(n+2)>tr>td:nth-child(7)');
	game_download.addClass('fa fa-download');
	game_download.css({'border-top':'0px','cursor':'pointer','display': 'table-cell'});
});
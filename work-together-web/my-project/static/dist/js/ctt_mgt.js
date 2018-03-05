$(function(){
		var app4 = new Vue({
			  el: '#app-4',
			  data: {
			    todos: [
			      { text: '游戏名称' },
			      { text: 'CP厂商' },
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
            {msg: '大话西游',kk: '网易',ll:'2016-10-1',ww:'2017-10-1',qq:'已签订（KF343434）',rr:' ',tt:' '},
            {msg: '大话西游',kk: '网易',ll:'2016-10-1',ww:'2017-10-1',qq:'已签订（KF343434）',rr:' ',tt:' '},
        ]
    }
});		var app5 = new Vue({
			  el: '#app-5',
			  data: {
			    todos: [
			      { text: '月份' },
			      { text: '游戏名称' },
			      { text: '对账状态' },
			      { text: '对账单下载' },
			      { text: '对账单查看' },
			      { text: '操作' },
			    ]
			  }
		});
	var ex1 = new Vue({
    el: '#showe',
    data: {
        parentMessage: 'Parent',
        items: [
            {msg: '6',kk: '大话西游',ll:'对账中',ww:'',qq:'',ee:''},
            {msg: '6',kk: '大话西游',ll:'对账中',ww:'',qq:'',ee:''},
        ]
    }
});
var app6 = new Vue({
			  el: '#app-6',
			  data: {
			    todos: [
			      { text: '月份' },
			      { text: '游戏名称' },
			      { text: '结算状态' },
			      { text: '结算单下载' },
			      { text: '结算单查看' },
			      { text: '操作' },
			    ]
			  }
		});
	var ex1 = new Vue({
    el: '#showl',
    data: {
        parentMessage: 'Parent',
        items: [
            {msg: '6',kk: '大话西游',ll:'结算中',ww:'',qq:'',ee:''},
            {msg: '6',kk: '大话西游',ll:'结算中',ww:'',qq:'',ee:''},
        ]
    }
});
var gema_td = $('#show>tbody:nth-child(n+2)>tr>td:last-child');
	gema_td.addClass('fa fa-edit');
	gema_td.css({'border-top':'0px','cursor':'pointer','display': 'table-cell'});
	gema_td.click(function(){
		window.location.href="edit.html";
	})
var game_download = $('#show>tbody:nth-child(n+2)>tr>td:nth-child(6)');
	game_download.addClass('fa fa-download');
	game_download.css({'border-top':'0px','cursor':'pointer','display': 'table-cell'});
	$('#add_btns>button:last-child').click(function(){
		window.location.href="Add.html";
	})
	
	//page2=============
	var game_download = $('#showe>tbody:nth-child(n+2)>tr>td:nth-child(4)');
	game_download.addClass('fa fa-download');
	game_download.css({'border-top':'0px','cursor':'pointer','display': 'table-cell'});
	var game_downloads = $('#showe>tbody:nth-child(n+2)>tr>td:nth-child(5)');
	game_downloads.addClass('fa fa-file-text-o');
	game_downloads.css({'border-top':'0px','cursor':'pointer','display': 'table-cell'});
	var gema_td = $('#showe>tbody:nth-child(n+2)>tr>td:last-child');
	gema_td.addClass('fa fa-edit');
	gema_td.css({'border-top':'0px','cursor':'pointer','display': 'table-cell'});
	gema_td.click(function(){
		window.location.href="DZ_edit.html";
	})
	$('#add_btn>button:last-child').click(function(){
		window.location.href="DZ_add.html";
	})
	//page3============================
	$('#add_btnz>button:last-child').click(function(){
		window.location.href="JS_add.html";
	})
	var game_download = $('#showl>tbody:nth-child(n+2)>tr>td:nth-child(4)');
	game_download.addClass('fa fa-download');
	game_download.css({'border-top':'0px','cursor':'pointer','display': 'table-cell'});
	var game_downloads = $('#showl>tbody:nth-child(n+2)>tr>td:nth-child(5)');
	game_downloads.addClass('fa fa-file-text-o');
	game_downloads.css({'border-top':'0px','cursor':'pointer','display': 'table-cell'});
	var gema_td = $('#showl>tbody:nth-child(n+2)>tr>td:last-child');
	gema_td.addClass('fa fa-edit');
	gema_td.css({'border-top':'0px','cursor':'pointer','display': 'table-cell'});
	gema_td.click(function(){
		window.location.href="JS_edit.html";
	})
	
});
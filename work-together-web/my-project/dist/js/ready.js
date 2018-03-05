$(function(){
		var app4 = new Vue({
			  el: '#app-4',
			  data: {
			    todos: [
			      { text: '游戏名称' },
			      { text: '是否拉组' },
			      { text: 'SDK接入情况' },
			      { text: '礼包情况' },
			      { text: '素材情况' },
			      { text: '总渠道数' },
			      { text: '发包情况' },
			      { text: '运营方' },
			      { text: '运营负责人' },
			      { text: '评测结果' },
			      { text: '操作' },
			    ]
			  }
		});
	var ex1 = new Vue({
    el: '#show',
    data: {
        parentMessage: 'Parent',
        items: [
            {msg: '皇室战争',kk: '否',ll:'正在对接中......',ww:'ok',qq:'ok',rr:'12',tt:'ok',yy:'快发',uu:'何宗江',ii:'A',oo:''},
            {msg: '大话西游',kk: '快发&百度对接群',ll:'还未对接....',ww:'ok',qq:'还有1个渠道未发',rr:'34',tt:'ok',yy:'有量',uu:'何宗江',ii:'A+',oo:''},
        ]
    }
});
var gema_td = $('#show>tbody:nth-child(n+2)>tr>td:last-child');
	gema_td.addClass('fa fa-edit');
	gema_td.css({'border-top':'0px','cursor':'pointer'});
	gema_td.click(function(){
		window.location.href="edit.html";
	})
});
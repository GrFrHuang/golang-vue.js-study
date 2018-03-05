$(function(){
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
		var app41 = new Vue({
			  el: '#app-41',
			  data: {
			    todos: [
			      { text: '日期' },
			      { text: '游戏名称' },
			      { text: '渠道名称' },
			      { text: '总流水' }
			    ]
			  }
			})
		var ex1 = new Vue({
    el: '#show1',
    data: {
        parentMessage: 'Parent',
        items: [
            {msg: '汇总',kk: '',ll:'',ww:'￥567434.3434'},
            {msg: '2016-6-01——2016-6-30',kk: '大话西游',ll:'乐嗨嗨',ww:'￥343434.3434'},
            {msg: '2016-6-01——2016-6-30',kk: '大话西游',ll:'乐嗨嗨',ww:'￥343434.3434'},
            {msg: '2016-6-01——2016-6-30',kk: '大话西游',ll:'当乐',ww:'￥343434.3434'},
            {msg: '2016-6-01——2016-6-30',kk: '大话西游',ll:'当乐',ww:'￥343434.3434'},
        ]
    }
});
});
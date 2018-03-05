
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
		
	 var myVue = new Vue({
                el: '#test',
                methods: {      //这里使用methods
                    sayHi: function (message) {
                    	if(message == 0){
                        window.location.href="ready.html";
						}else{
						window.location.href=history.go(-1);	
						}
                    }
                    
                }
            });
            });
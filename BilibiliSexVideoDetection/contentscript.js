
var html = document.body.innerHTML;
// 必须设置 "run_at": "document_end" 才能获取到
//console.log(html);
//将html放在command中发给background.js
chrome.runtime.sendMessage({command: html});

// 接收contentscript.js和popup.js发送过来的html文件进行分析
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
		// background.js 中的log时在扩展页面该扩展的背景页显示的
        command = request.command;
		if(command == "detect"){ //收到popup.js发来的点击事件detect后，向background.js发送检测请求
			console.log("收到");
			chrome.runtime.sendMessage({command: html});
		}
		
    }
);
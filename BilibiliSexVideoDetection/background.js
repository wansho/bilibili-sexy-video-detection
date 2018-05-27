// 在安装了这个扩展的时候，加入一个监听器
chrome.runtime.onInstalled.addListener(function() {
	
	/*
	// set 函数存储一个颜色参数
	chrome.storage.sync.set({color: '#3aa757'}, function() {
		console.log('The color is green.');
	});
	*/
	
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			// 条件：hostEquals == 'www.bilibili.com'
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				pageUrl: {hostEquals: 'www.bilibili.com'},
				})
			],
			// 干什么：showPageAction
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});

/*
// 在网页加载完成的时候，设置一个监听事件，需要 webNavigation 权限
chrome.webNavigation.onCompleted.addListener(
	function() {
		// 弹出一个对话框，这里可以写提醒信息,也可以写判断语句
		alert("This is my favorite website!");
	}, 
	{url: [{urlMatches : 'https://www.bilibili.com/'}]}
);
*/

// 接收contentscript.js和popup.js发送过来的html文件进行分析
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
		// background.js 中的log时在扩展页面该扩展的背景页显示的
        command = request.command; // command可能是detect命令，也可能直接是html页面
		var html = ""
		if(command == "detect"){ //只接受html的通信
			return;
		}else{
			html = command;
		}
		//console.log(html);
		
		// 用正则获取弹幕文件的ID, 注意转义字符
		cid = getCID(html);
		//console.log(cid);
		
		if(cid != -1){ // CID存在并获取到了ID，下面构造url然后获取数据
			xml_str = requestXML(cid)
			if(xml_str != -1){
				//console.log(xml_str);
				// 下面开始解析弹幕文件
				var danmu_list = parseXML(xml_str);
				//console.log(danmu_list.length);
				var prob = computeSexProb(danmu_list);
				var divide = 0.016093672147483806;
				if (prob > divide){
					alert("    *** FBI WARNING ***    \n \n   这可能是一个软色情视频!!!");
				}
			}
		}
    }
);

// 获取弹幕文件的ID
function getCID(html){
	var patt = /;cid=\d+/i;
	var index = html.search(patt);
	var cid = -1;
	if(index != -1){ // CID存在，获取cid
		//获取CID，也就是 弹幕的ID
		cid = patt.exec(html)[0].substring(5);
	}
	return cid;
}

// 请求弹幕文件并以字符串形式返回
function requestXML(cid){
	xml_str = -1
	var url = "https://comment.bilibili.com/" + cid + ".xml";
	// 同步访问该文件
	htmlobj=$.ajax({url:url,async:false});
	xml_str = htmlobj.responseText;
	return xml_str;
}

// 解析xml 字符串，获取弹幕列表
function parseXML(xml_str){
	
	var danmu_list = new Array(); // 增加元素的方法：push
	var patt = />.+?</;
	var str_list = xml_str.split("<d");
	str_list.shift(); // 弹出第一个无效元素
	for (x in str_list){
		var content_str = patt.exec(str_list[x])[0];
		danmu_list.push(content_str.substring(1,content_str.length - 1));
	}
	return danmu_list;
}

// 计算其为软色情的概率
function computeSexProb(danmu_list){
	
	var sex_dict = loadSexDict();
	var regs = new Array();
	
	for (var i in sex_dict) {  
		regs.push(i);
		//console.log(i);
	}

    var score_sum = 0;
	var danmu = ""
	for(var i in danmu_list){
		var score = 0;
		danmu = danmu_list[i];
		for (var j in regs){
			var reg = new RegExp(regs[j]);
			if (reg.test(danmu)){
				console.log(danmu);
				score = score + sex_dict[regs[j]];
			}  
		}
		score_sum = score_sum + score;
	}
	
	var danmu_count = danmu_list.length;
	
	var prob = score_sum / parseFloat(danmu_count);
    console.log(prob);
	return prob;
	
}

function test(){
	console.log("test");
}

// 加载色情字典
function loadSexDict(){
	var dictURL = chrome.runtime.getURL("/sex_dict.txt");
	// 同步访问该文件
	htmlobj=$.ajax({url:dictURL,async:false});
	dict_str = htmlobj.responseText;
	//console.log(dict_str);
	var re_sex = "";
	var score = -1;
	var sex_dict = new Array();   
	// 按照换行进行切割
	var str_list = dict_str.split(/[\n]/);
	for (x in str_list){
		str = str_list[x];
		//console.log(str);
		// 去掉换行符和回车符
		str = str.replace(/[\r\n]/g,"");
		if(str.startsWith("score")){
			if(score > 0){
				var key = re_sex.substring(1);
				var value = score;
				sex_dict[key] = value;  
			}
			score = parseInt(str.substring(str.indexOf(':')+1));
			re_sex = "";
		}else{
			re_sex = re_sex + "|" + str;
		}
	}
	sex_dict[re_sex.substring(1)] = score;
	return sex_dict;
}
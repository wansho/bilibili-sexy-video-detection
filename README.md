# 介绍

之前已经写了一个 python 的程序，可以根据输入的 AV 号码检测 B 站的视频是否是 *软色情*  视频。

Blog介绍链接：[B站软色情视频检测](http://wansho.cn/2018/04/13/blog_source/Coding/B%E7%AB%99%E8%BD%AF%E8%89%B2%E6%83%85%E8%A7%86%E9%A2%91%E6%A3%80%E6%B5%8B/)

Github 链接  : [B 站风纪委员](https://github.com/wansho/BilibiliSexVideoDetection)

这个周末正好没事，就做了一个 Chrome 浏览器的插件扩展，用来监测 B站的软色情视频。扩展实现的效果为：

> 在打开一个B站的视频后，扩展会从html页面中解析出弹幕文件的ID，然后构造弹幕文件的url，向B站服务器发送请求，从而获取到弹幕文件，软色情视频的分类算法和 [B站软色情视频检测](http://wansho.cn/2018/04/13/blog_source/Coding/B%E7%AB%99%E8%BD%AF%E8%89%B2%E6%83%85%E8%A7%86%E9%A2%91%E6%A3%80%E6%B5%8B/) 一样的，只是将 python 的代码移植成了 JavaScript的。如果分类结果显示该视频为软色情视频，就用一个 alert 窗口弹出警告。

![扩展效果图](http://ox1llsxib.bkt.clouddn.com/%E6%95%88%E6%9E%9C%E5%9B%BE.png-origin)

扩展的图标为一个 *红色的苹果*，红苹果代表着诱惑，在 B站不作为甚至默许的现状下，面对这些软色情视频，只能自觉抵制这些诱惑了。点击扩展的图标会弹出一个小窗口，里面有一个按钮，点击按钮后，可以检测该视频是否为软色情视频，如果是软色情视频，则弹出弹窗进行警告，如果不是则不做任何动作。

*注意：该扩展只有在打开网址为 B 站视频的前提下才能生效，在其他网站上都是灰色效果的。*



![扩展图标](http://ox1llsxib.bkt.clouddn.com/chrome%E6%89%A9%E5%B1%95%E7%9A%84%E5%9B%BE%E6%A0%87.png)



另外，由于分类器的训练比较复杂，所以这个工作是在python上完成的，在该程序中，是直接将训练结果(分类阈值)拿来用了。



# 安装和使用

由于该扩展并没有发布在Google的扩展平台上，所以直接 Chrome是不识别文件夹中的 crx 文件的，如果想要使用该扩展，应该打开浏览器的开发者模式，直接加载源码，教程在此：[Chrome提示“该扩展程序未列在 Chrome 网上应用店中，并可能是在您不知情的情况下添加的”解决办法](http://429006.com/article/technology/4101.htm)



该扩展有两种使用方式：

第一种方式是后台默认的检测，只要打开了一个B站的视频，扩展就会在后台自动检测该视频，如果是软色情视频，则弹出弹窗进行警告。



第二种方式是点击扩展popup窗口的按钮，进行手动检测，检测结果和第一种方式一样



# 感触

Chrome 扩展的逻辑处理语言是 JavaScript，虽然没有学习过这门语言，但是上手后发现和 C 语言差别不是很大，本来以为要学习一下 JavaScript 才能把扩展做出来，后来只用了大概一天的时间就完成了。chrome 扩展编写的逻辑很清楚，html页面负责前端的显示，JavaScript 负责后台的逻辑处理，和之前开发 Android 的思想类似，background.js 有点像是一个基类，大部分的代码逻辑都是在这个文件中。貌似现在大多数的软件开发都遵循 界面 和 逻辑 分开编写的原则。另外，Google的开发文档真的写的很棒，简明扼要，我在 GitHub 里面也共享了我用到的一些文档pdf版。



# 源码

[Chrome_Extension_for_Bilibili_Sex_Video_Detection](https://github.com/wansho/Chrome_Extension_for_Bilibili_Sex_Video_Detection)



# 参考

1. [Google官方文档](https://developer.chrome.com/extensions)
2.  [如何显示 background.js 中用 `console.log()` 打的log](https://stackoverflow.com/questions/10257301/where-to-read-console-messages-from-background-js-in-a-chrome-extension)
3. [js 正则表达式](http://www.jb51.net/article/97901.htm)
4. [content script 和 popup script, background script 之间的通信](https://www.cnblogs.com/ligerleng/p/gmail_assist_2.html)
5. [请求Bilibili服务器的弹幕文件](http://www.w3school.com.cn/jquery/ajax_ajax.asp)
6. [程序打包](http://open.chrome.360.cn/extension_dev/packaging.html)



# 下一步

1. 将检测到的可疑软色情视频上传到一个服务器进行汇总
2. 爬去更多的视频进行分类器的训练
3. 鉴定更多少儿不宜的视频
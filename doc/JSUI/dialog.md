
# Dialog
***

	弹出框组件

var dialog = require("dialog");

# js
			   domReady(function(require){
            		var dialog = require("dialog");
					dialog.init({
                            title:'文档评分'
                            scrollMove: false,
                            buttons: {
                                '取消': function(){
                                    this.close();
                                }
                            },
                            content:  '<div  class="vote-dialog" style="display:block"><p class="vote"></p><p>星级从1到5，获得越多星星，表示等级越高</p></div>'
                        });
	 			});

# 索引


*	[方法](#方法)
	-	[init](#init)：创建一个弹出框
	-	[showToast](#showToast)：创建一个toast消息提示框

*	[注意事项](#注意事项)


## <div id="方法">方法</div>
	对外提供方法--function
	调用对象 : var dialog = require("dialog");


###  <div id="init">init</div>
	
*	dialog.init(options)   ⇒ object
	-	<div id="buttons">buttons</div> 
		-	description : 弹出框上的按钮
		-	type : object
		-	默认值 ： {
		                '取消': function() {
		                    this.close();
		                },
		                '确定': function() {
		                    this.close();
		                }
		            }
	-	<div id="mask">mask</div> 
		-	description : 是否有遮罩层
		-	type ： boolean
		-	默认值 ： true

	-	<div id="width">width</div> 
		-	description : 弹出框宽度
		-	type ： number
		-	默认值 ： 300

	-	<div id="height">height</div> 
		-	description : 弹出框高度
		-	type ： number
		-	默认值 ： auto

	-	<div id="contentMaxHeight">contentMaxHeight</div> 
		-	description : 内容区域的最大高度（当存在内容区域过高时使用）
		-	type ： number
		-	默认值 ： null

	-	<div id="touchMashClose">touchMashClose</div> 
		-	description : 点击蒙版是否关闭 弹出框
		-	type ： boolean
		-	默认值 ： true

	-	<div id="title">title</div> 
		-	description : 弹出框标题
		-	type ： String
		-	默认值 ： '提示框'

	-	<div id="content">content</div> 
		-	description : 弹出框内容（通常是一段HTML字符串）
		-	type ： String
		-	默认值 ： null

	-	<div id="scrollMove">scrollMove</div> 
		-	description : 是否在弹出的时候禁用掉scroll
		-	type ： boolean
		-	默认值 ： true

ex. 创建自定义弹出框
	
					Dialog.init({
                            title:'登陆提示'
                            content:  '<div style="display:block"><p>登录后, 获得更多个性化特色功能</p></div>'
                        })
###  <div id="showToast">showToast</div>
*	dialog.showToast(opts)   ⇒ object
	-	<div id="time">time</div> 
		-	description : toast持续时间
		-	type : number
		-	默认值 ： 2000
	-	<div id="message">message</div> 
		-	description : toast提示消息
		-	type ： String
		-	默认值 ： ''


ex. 弹出toast弹出框
	
					dialog.showToast({
                        message:'您输入的信息有误，请重新输入'
                    });
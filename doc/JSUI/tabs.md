
# Tabs 
***

	选项卡组件

$(selector).tab(options) 

*	返回值：选项卡对象（多个时返回数组）


# 组件构成
* html+css
* js

# html+css
		<div class="ui-tab-bar">
            <a class="ui-tab-item">
                <span class="ui-icon ui-icon-home"></span>
                <span class="ui-tab-label">首页</span>
            </a>
            <a class="ui-tab-item">
                <span class="ui-icon ui-icon-email"></span>
                <span class="ui-tab-label">消息</span>
            </a>
            <a class="ui-tab-item">
                <span class="ui-icon ui-icon-contact"></span>
                <span class="ui-tab-label">通讯录</span>
            </a>
            <a class="ui-tab-item">
                <span class="ui-icon ui-icon-gear"></span>
                <span class="ui-tab-label">设置</span>
            </a>
        </div>

# js
			domReady(function(require){
		          require("tab");
		          $('.ui-tab-bar').tab({
		              active:1
		          });
		    });


# 索引
*	[options](#options)
	-	[active](#active)

*	[接口](#接口)
	-	[switchTo](#switchTo)

*	[事件](#事件)
	-	[beforeActivate](#beforeActivate)
	-	[activate](#activate)
	-	[afteractivate](#afteractivate)
	
*	[样式说明](#样式说明)
*	[注意事项](#注意事项)

## <div id="options">options</div>
	配置对象--JSON

### <div id="active">active</div>

*	初始时哪个为选中状态 
*	number 
*	默认值：0

## <div id="接口">接口</div>
	对外提供方法--function
	调用对象 : var tab = $(selector).tab(opts)


###  <div id="switchTo">switchTo</div>
	
*	tab.switchTo()   ⇒ self

切换到指定页

	tab.switchTo(number);

## <div id="事件">事件</div>
	对外提供事件--Event
	调用对象	: var sc = $(selector).tab(opts)
			$(selector).on(Event,function(e){})  或  sc.ref.on(Event,function(e){})

###  <div id="beforeActivate">beforeActivate</div>
	
*	$(selector).on('beforeActivate',function(e,to,from){})
	-	to : 目标下标
	-	from ：当前下标
选中某项之前触发

###  <div id="activate">activate</div>
	
*	$(selector).on('activate',function(e,to,from){})
	-	to : 目标下标
	-	from ：当前下标
选中某项时触发

###  <div id="afteractivate">afteractivate</div>
	
*	$(selector).on('afteractivate',function(e,to,from){})
	-	to : 目标下标
	-	from ：当前下标
选中某项后触发

## <div id="样式说明">样式说明</div>

*	ui-tab-bar ： 组件顶层标示
*	ui-tab-item ： tab项样式
*	ui-icon ui-icon-home ： tab项图标样式
*	ui-tab-label ： tab项文字描述样式

## <div id="注意事项">注意事项</div>

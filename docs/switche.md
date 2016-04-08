
# switche
***

	开关组件

$(selector).switche(options) 

*	返回值：开关对象（多个时返回数组）

# 组件构成
* html+css
* js

# html+css
					<div class="ui-switch">
						<div class="ui-switch-handle"></div>
					</div>


# js
		domReady(function(require){
			require("switch");
            $('.ui-switch').switch();
		});

# 索引
*	[接口](#接口)
	-	[toggle](#toggle)

*	[事件](#事件)
	-	[toggle](#toggle)
	
*	[样式说明](#样式说明)
*	[注意事项](#注意事项)


## <div id="接口">接口</div>
	对外提供方法--function
	调用对象 : var sc = $('.ui-switch').switch();

###  <div id="toggle">toggle</div>
	
*	sc.toggle()   ⇒ self

切换开关状态

## <div id="事件">事件</div>
	对外提供事件--Event
	调用对象	: var sc = $('.ui-switch').switch();
			$(selector).on(Event,function(e){})  或  sc.ref.on(Event,function(e){})

###  <div id="toggle">toggle</div>
	
*	$(selector).on('toggle',function(e){})

切换开关状态时触发的事件


## <div id="样式说明">样式说明</div>

*	ui-switch ： 组件顶层标示
*	ui-switch-handle ： 开关按钮样式

## <div id="注意事项">注意事项</div>

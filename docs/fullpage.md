
# fullpage
***
	滚屏组件

$(selector).fullpage(opts) 

*	返回值：fullpage对象（多个时返回数组）

# 组件构成

* html+css
* js

# html+css
	<div  class="ui-fullpage">
            <div class="ui-fullpage-page ">
                <img class = "ui-fullpage-pageinner" src="img/1.png"></img>
            </div>
            <div class="ui-fullpage-page">
                <img class = "ui-fullpage-pageinner" src="img/2.png"></img>
            </div>
            <div class="ui-fullpage-page">
                <img class = "ui-fullpage-pageinner" src="img/3.png"></img>
            </div>
            <div class="ui-fullpage-page">
                <img class = "ui-fullpage-pageinner" src="img/4.png"></img>
            </div>
    </div>

# js
	domReady(function(require){
        require("fullpage");
        var fp = $('.ui-fullpage').fullpage({
            dots:true,
            arrow:true,
            loop: true,
            drag: false
        });
    });

# 索引
*	[options](#options)
	-	[loop](#loop)
	-	[gesture](#gesture)
	-	[dots](#dots)
	-	[arrow](#arrow)

*	[接口](#接口)
	-	[start](#start)
	-	[stop](#stop)
	-	[moveTo](#moveTo)
	-	[prev](#prev)
	-	[next](#next)
	-	[getCurIndex](#getCurIndex)

*	[事件](#事件)
	-	[beforeChange](#beforeChange)
	-	[change](#change)
	-	[afterChange](#afterChange)

*	[样式说明](#样式说明)
*	[注意事项](#注意事项)

## <div id="options">options</div>
	配置对象--JSON

### <div id="loop">loop</div>

*	是否循环滑动 
*	true/false 
*	默认值：false

### <div id="gesture">gesture</div>

*	是否手势跟随 
*	true/false 
*	默认值：false

### <div id="dots">dots</div>

*	是否显示滚动点 
*	true/false 
*	默认值：false

###  <div id="arrow">arrow</div>

*	是否显示向上指示箭头 
*	true/false 
*	默认值：false



## <div id="接口">接口</div>
	对外提供方法--function
	调用对象 : var fp = $(selector).fullpage(opts)

###  <div id="start">start</div>
	
*	fp.start()   ⇒ self

使滚屏对象可以滚动

###  <div id="stop">stop</div>
	
*	fp.stop()   ⇒ self

禁止滚屏对象滚动

###  <div id="moveTo">moveTo</div>
	
*	fp.moveTo(next)   ⇒ self

移动到目标页

	fp.moveTo(0) //移动到第一页

###  <div id="prev">prev</div>
	
*	fp.prev()   ⇒ self

移动到上一页

###  <div id="next">next</div>
	
*	fp.next()   ⇒ self

移动到下一页

###  <div id="getCurIndex">getCurIndex</div>
	
*	fp.getCurIndex()   ⇒ number

获取当前选中序号

## <div id="事件">事件</div>
	对外提供事件--Event
	调用对象	: var fp = $(selector).fullpage(opts)
			$(selector).on(Event,function(e){})  或  fp.ref.on(Event,function(e){})


###  <div id="beforeChange">beforeChange</div>

*	$(selector).on('beforeChange',function(e, cur, next){})
	-	cur：当前选中页码
	-	next：目前页码

当前显示发生变化前触发

###  <div id="change">change</div>

*	$(selector).on('change',function(e, cur, next){})
	-	cur：当前选中页码
	-	next：目前页码

当前显示发生变化时触发

###  <div id="afterChange">afterChange</div>

*	$(selector).on('afterChange',function(e, cur, next){})
	-	cur：当前选中页码
	-	next：目前页码

当前显示发生变化后触发

## <div id="样式说明">样式说明</div>

*	ui-fullpage ： 组件顶层标示
*	ui-fullpage-page ： 滚屏页标示
*	ui-fullpage-pageinner ： 滚屏内容区域

## <div id="注意事项">注意事项</div>


# navigator
***
	导航组件

$(selector).navigator(opts) 

*	返回值：navigator（多个时返回数组）

# 组件构成

* html+css
* js

# html+css
	<div class="ui-navigator">
           <ul class="ui-navigator-list">
                <li><a>首页</a></li>
                <li><a>要闻</a></li>
                <li><a>国内</a></li>
                <li><a>国际</a></li>
                <li><a>军事</a></li>
                <li><a>社会</a></li>
                <li><a>娱乐</a></li>
                <li><a>女人</a></li>
                <li><a>体育</a></li>
                <li><a>科技</a></li>
                <li><a>互联网</a></li>
                <li><a>教育</a></li>
                <li><a>财经</a></li>
                <li><a>房产</a></li>
                <li><a>汽车</a></li>
            </ul>
    </div>

# js
	domReady(function(require){
            require("navigator");
            $('.ui-navigator').navigator().ref.on('beforeselect',function(e,to){
            });
        })

# 索引
*	[接口](#接口)
	-	[enable](#enable)
	-	[disable](#disable)
	-	[clear](#clear)
	-	[search](#search)

*	[事件](#事件)
	-	[beforeselect](#beforeselect)
	-	[select](#select)
	
*	[样式说明](#样式说明)
*	[注意事项](#注意事项)



## <div id="接口">接口</div>
	对外提供方法--function
	调用对象 : var nav = $(selector).navigator(opts)

###  <div id="switchTo">switchTo</div>
	
*	nav.switchTo(to)   ⇒ self
	-	to : 目标项下标(number)

切换到导航栏的某一项

## <div id="事件">事件</div>
	对外提供事件--Event
	调用对象	: var nav = $(selector).navigator(opts)
			$(selector).on(Event,function(e){})  或  nav.ref.on(Event,function(e){})

###  <div id="beforeselect">beforeselect</div>
	
*	$(selector).on('beforeselect',function(e,to,li){})
	-	to : 目标项的下标
	-	li : 目标项的dom对象

切换到目标项之前触发

###  <div id="select">select</div>
	
*	$(selector).on('select',function(e,to,li){})
	-	to : 目标项的下标
	-	li : 目标项的dom对象
	
切换到目标项时触发

## <div id="样式说明">样式说明</div>

*	ui-navigator ： 组件顶层标示
*	ui-navigator-list ： 导航项容器样式

## <div id="注意事项">注意事项</div>

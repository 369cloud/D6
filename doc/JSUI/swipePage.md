
# swipepage
***
	多页滑动组件

$(selector).swipepage(opts) 

*	返回值：swipepage（多个时返回数组）

# 组件构成

* html+css
* js

# html+css
	<div class="ui-swipe">
        <div class="ui-swipe-group">
            <div class="ui-swipe-item">
                <div class="ui-swipe-content">
                    1
                </div>
            </div>
            <div class="ui-swipe-item">
                <div class="swipe-content">
                    2
                </div>
            </div>
            <div class="ui-swipe-item">
                <div class="swipe-content">
                    3
                </div>
            </div>
            <div class="ui-swipe-item">
                <div class="swipe-content">
                    4
                </div>
            </div>
            <div class="ui-swipe-item">
                <div class="swipe-content">
                    5
                </div>
            </div>
        </div>
    </div>

# js
	domReady(function(require) {
	    require("swipepage");
	    var swipe = $('.ui-swipe').swipepage();
	});

# 索引
*	[options](#options)
	-	[speed](#speed)
	-	[index](#index)

*	[接口](#接口)
	-	[next](#next)
	-	[prev](#prev)
	-	[slideTo](#slideTo)
	-	[getIndex](#getIndex)

*	[事件](#事件)
	-	[slide](#slide)
	-	[moveend](#moveend)
	
*	[样式说明](#样式说明)
*	[注意事项](#注意事项)


## <div id="options">options</div>
	配置对象--JSON

### <div id="speed">speed</div>

*	动画执行速度
*	number 
*	默认值：100

### <div id="index">index</div>

*	初始位置
*	number 
*	默认值：0


## <div id="接口">接口</div>
	对外提供方法--function
	调用对象 : var sw = $(selector).swipepage(opts)

###  <div id="next">next</div>
	
*	sw.next()   ⇒ self

切换到下一个slide

###  <div id="prev">prev</div>
	
*	sw.prev()   ⇒ self

切换到上一个slide

###  <div id="slideTo">slideTo</div>
	
*	sw.slideTo(to, [speed])   ⇒ self

切换到第几个slide

	sl.slideTo(2, 400) //以400的速度切换到第3个（下标从0开始）slide

###  <div id="getIndex">getIndex</div>
	
*	sw.getIndex()   ⇒ number

返回当前显示的第几个slide

## <div id="事件">事件</div>
	对外提供事件--Event
	调用对象	: var sw = $(selector).swipepage(opts)
			$(selector).on(Event,function(e){})  或  sw.ref.on(Event,function(e){})

###  <div id="slide">slide</div>
	
*	$(selector).on('slide',function(e,to,from){})
	-	to : 当前下标
	-	from ：原来下标	

当滑动到下一页时触发

###  <div id="moveend">moveend</div>
	
*	$(selector).on('moveend',function(e,index,dir){})
	-	index : 当前下标
	-	dir ：移动方向，-1 向右 1 向左	

当滑动到尽头时触发

## <div id="样式说明">样式说明</div>

*	ui-swipe ： 组件顶层标示
*	ui-swipe-group ： 多页滑动容器对象
*	ui-swipe-item ： 多页滑动容器容器
*	ui-swipe-content ： 多页滑动内容容器

## <div id="注意事项">注意事项</div>

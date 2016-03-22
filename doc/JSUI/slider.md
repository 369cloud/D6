
# slider
***
	轮播图组件

$(selector).slider(opts) 

*	返回值：轮播图对象（多个时返回数组）


# 组件构成
* html+css
* js

# html+css
			<div class="ui-slider">
                <div class="ui-slider-group">
                    <div class="ui-slider-item">
                        <img class="ui-slider-img" src="img/1.png">
                    </div>
                    <div class="ui-slider-item">
                        <img class="ui-slider-img" src="img/2.png">
                    </div>
                    <div class="ui-slider-item">
                        <img class="ui-slider-img" src="img/3.png">
                    </div>
                    <div class="ui-slider-item">
                        <img class="ui-slider-img" src="img/4.png">
                    </div>
                </div>
            </div> 

# js
			domReady(function(require){
		        require("slider");
		        $('.ui-slider').slider( { 
		            loop:true,
		            dots:true,
		            gestur:true
		        }).ref.on('slide',function(){
		           console.log('slide');
		        }).on('moveend',function(){
		           console.log('moveend');
		        });
		    });

# 索引
*	[options](#options)
	-	[loop](#loop)
	-	[speed](#speed)
	-	[index](#index)
	-	[autoPlay](#autoPlay)
	-	[interval](#interval)
	-	[dots](#dots)
	-	[guide](#guide)
	-	[gestur](#gestur)
	-	[mulViewNum](#mulViewNum)
	-	[space](#space)

*	[接口](#接口)
	-	[play](#play)
	-	[stop](#stop)
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

### <div id="loop">loop</div>

*	是否连续滑动
*	true/false 
*	默认值：false

### <div id="speed">speed</div>

*	动画执行速度
*	number 
*	默认值：100

### <div id="index">index</div>

*	初始位置
*	number 
*	默认值：0

### <div id="autoPlay">autoPlay</div>

*	是否开启自动播放
*	true/false 
*	默认值：false

### <div id="interval">interval</div>

*	自动播放的间隔时间（毫秒）
*	number 
*	默认值：4000

### <div id="dots">dots</div>

*	是否显示轮播点
*	true/false 
*	默认值：false

### <div id="guide">guide</div>

*	是否显示导向按钮
*	true/false 
*	默认值：false

### <div id="gestur">gestur</div>

*	是否添加手势事件
*	true/false 
*	默认值：false

### <div id="mulViewNum">mulViewNum</div>

*	用来指定一页显示多少个图片
*	number
*	默认值：1

### <div id="space">space</div>

*	图片之间的间隔
*	number
*	默认值：0


## <div id="接口">接口</div>
	对外提供方法--function
	调用对象 : var sl = $(selector).slider(opts)


###  <div id="play">play</div>
	
*	sl.play()   ⇒ self

使轮播图处于自动播放状态

###  <div id="stop">stop</div>
	
*	sl.stop()   ⇒ self

停止自动播放

###  <div id="next">next</div>
	
*	sl.next()   ⇒ self

切换到下一个slide

###  <div id="prev">prev</div>
	
*	sl.prev()   ⇒ self

切换到上一个slide

###  <div id="slideTo">slideTo</div>
	
*	sl.slideTo(to, [speed])   ⇒ self

切换到第几个slide

	sl.slideTo(2, 400) //以400的速度切换到第3个（下标从0开始）slide

###  <div id="getIndex">getIndex</div>
	
*	sl.getIndex()   ⇒ number

返回当前显示的第几个slide

## <div id="事件">事件</div>
	对外提供事件--Event
	调用对象	: var sl = $(selector).slider(opts)
			$(selector).on(Event,function(e){})  或  sc.ref.on(Event,function(e){})

###  <div id="slide">slide</div>
	
*	$(selector).on('slide',function(e,to,from){})
	-	to : 当前下标
	-	from ：原来下标	

当轮播图完成轮播，并切换到下一个对象时触发

###  <div id="moveend">moveend</div>
	
*	$(selector).on('moveend',function(e,index,dir){})
	-	index : 当前下标
	-	dir ：移动方向，-1 向右 1 向左	

当轮播图播放到尽头时触发（只有在loop为false时触发）

## <div id="样式说明">样式说明</div>

*	ui-slider ： 组件顶层标示
*	ui-slider-group ： 轮播图容器对象
*	ui-slider-item ： 轮播图单个对象容器
*	ui-slider-img ： 轮播图对象，无论使用何种标签，轮播对象必须包含该样式，否则组件无法定位轮播对象

## <div id="注意事项">注意事项</div>
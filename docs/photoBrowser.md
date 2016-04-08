
# photobrowser
***
	图片浏览器组件

$(selector).photobrowser(opts) 

*	返回值：photobrowser对象（多个时返回数组）

# 组件构成

* html+css
* js

# html+css
	<div class="ui-photo-browser ui-photo-browser-light">
        <div class="ui-photo-browser-container">
            <div class="ui-slider-item">
                <img class="ui-slider-img" src="img/p1.jpg">
            </div>
            <div class="ui-slider-item">
                <img class="ui-slider-img" src="img/p2.jpg">
            </div>
            <div class="ui-slider-item">
                <img class="ui-slider-img" src="img/p3.jpg">
            </div>
            <div class="ui-slider-item">
                <img class="ui-slider-img" src="img/p4.jpg">
            </div>
        </div>
    </div>

# js
	domReady(function(require){
        require("photobrowser");
        $('.ui-photo-browser').photobrowser({
            captions: ['描述1','描述2','描述3','描述4']
        }).open();
  	})

# 索引
*	[options](#options)
	-	[loop](#loop)
	-	[speed](#speed)
	-	[index](#index)
	-	[gestur](#gestur)
	-	[captions](#captions)
	-	[light](#light)
	-	[space](#space)

*	[接口](#接口)
	-	[open](#open)
	-	[moveTo](#moveTo)
	-	[prev](#prev)
	-	[next](#next)
	-	[close](#close)

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

###  <div id="change">change</div>

*	当前显示发生变化时的回调方法
*	function(cur, next) {}
	-	cur：当前选中页码
	-	next：目前页码

###  <div id="beforeChange">beforeChange</div>

*	当前显示发生变化前的回调方法，返回false时，可阻止滚屏的发生
*	function(cur, next) {}
	-	cur：当前选中页码
	-	next：目前页码

###  <div id="afterChange">afterChange</div>

*	当前显示发生变化后的回调方法
*	function(cur, next) {}
	-	cur：当前选中页码
	-	next：目前页码



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


## <div id="样式说明">样式说明</div>

*	ui-photo-browser： 组件顶层标示
*	ui-photo-browser-light : 添加该样式时，图片浏览器为白色状态（默认为黑色系）
*	ui-photo-browser-container ： 组件内容区域
*	ui-slider-item ： 图片查看项
*	ui-slider-img ： 图片项

## <div id="注意事项">注意事项</div>

# searchbar
***
	搜索栏组件

$(selector).searchbar(opts) 

*	返回值：searchbar对象（多个时返回数组）

# 组件构成

* html+css
* js

# html+css
	<div  class="ui-searchbar">
     <form class="ui-searchbar-container">
      <div class="ui-searchbar-input">
        <input type="search"  placeholder="Search"/>
      </div>
    </form>
    <div  class="ui-searchbar-content">
      <div class="list-block ui-searchbar-list">
        <ul>
           <li class="item-content ui-searchbar-item">
            <div class="item-inner"> 
              <div class="item-title ui-searchbar-key">中国</div>
            </div>
          </li>
          <li class="item-content ui-searchbar-item ui-searchbar-ignore">
            <div class="item-inner"> 
              <div class="item-title ui-searchbar-key">太阳系</div>
            </div>
          </li>
          ……
        </ul>
      </div>
    </div>
  </div>

# js
	domReady(function(require){
          require('searchbar');
          $('.ui-searchbar').searchbar({
             searchKey:'.item-title'
          });
     });

# 索引
*	[options](#options)
	-	[customSearch](#customSearch)

*	[接口](#接口)
	-	[enable](#enable)
	-	[disable](#disable)
	-	[clear](#clear)
	-	[search](#search)

*	[事件](#事件)
	-	[enableSearch](#enableSearch)
	-	[disableSearch](#disableSearch)
	-	[clearSearch](#clearSearch)
	-	[search](#searchEvent)
	
*	[样式说明](#样式说明)
*	[注意事项](#注意事项)


## <div id="options">options</div>
	配置对象--JSON

### <div id="customSearch">customSearch</div>

*	是否启用自定义搜索
*	true/false 
*	默认值：false
*	当该值为true时，可通过监听search事件来进行自定义搜索


## <div id="接口">接口</div>
	对外提供方法--function
	调用对象 : var sc = $(selector).searchbar(opts)

###  <div id="enable">enable</div>
	
*	sc.enable()   ⇒ self

使搜索栏处于搜索状态

###  <div id="disable">disable</div>
	
*	sc.disable()   ⇒ self

使搜索栏处于普通状态

###  <div id="clear">clear</div>
	
*	sc.clear()   ⇒ self

清空搜索栏

###  <div id="search">search</div>
	
*	sc.search(query)   ⇒ self

根据传入值进行搜索
	
	sc.search('a') //搜索所有带有a字符项

## <div id="事件">事件</div>
	对外提供事件--Event
	调用对象	: var sc = $(selector).searchbar(opts)
			$(selector).on(Event,function(e){})  或  sc.ref.on(Event,function(e){})

###  <div id="enableSearch">enableSearch</div>
	
*	$(selector).on('enableSearch',function(e){})

当搜索栏可以进行搜索时触发

###  <div id="disableSearch">disableSearch</div>
	
*	$(selector).on('disableSearch',function(e){})

搜索栏由可搜索状态变为普通状态时触发

###  <div id="clearSearch">clearSearch</div>
	
*	$(selector).on('clearSearch',function(e){})

清空搜索栏时触发

###  <div id="searchEvent">search</div>
	
*	$(selector).on('search',function(e，query，[foundItems]){})
	-	query : 搜索栏的输入内容
	-	foundItems ：customSearch为false时，传入的搜索结果集数组

进行搜索时触发

## <div id="样式说明">样式说明</div>

*	ui-searchbar ： 组件顶层标示
*	ui-searchbar-container ： 搜索栏外围样式
*	ui-searchbar-input ： 搜索栏样式
*	ui-searchbar-content ： 搜索内容区域
*	ui-searchbar-list ： 搜索列表
*	ui-searchbar-item ： 搜索项
*	ui-searchbar-key ： 搜索关键字所在的标示
*	ui-searchbar-ignore ： 搜索排除样式（添加此样式的项，始终处于结果当中）

## <div id="注意事项">注意事项</div>

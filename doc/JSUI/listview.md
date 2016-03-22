# listview
***

# 索引
*	[deflistview](#deflistview)
*	[customlistView](#customlistView)
*	[medialistView](#medialistView)
*	[swipelistView](#swipelistView)

## <div id="deflistview">deflistview</div>

	默认列表组件


## 组件构成
* html+css

## html+css
		<div class="ui-list-block">
            <ul>
              <li><div class="ui-list-item-link ui-list-item-content">
                  <div class="ui-list-item-inner"> 
                    <div class="ui-list-item-title">名称</div>
                    <div class="ui-list-item-after">你的iPhone</div>
                  </div></div></li>
            </ul>
          </div>
    	<div class="ui-list-block">
            <ul>
               <li>
                  <div class="ui-list-item-content">
                    <div class="ui-list-item-inner">
                      <div class="ui-list-item-title">网络</div>
                      <div class="ui-list-item-after">中国移动</div>
                    </div>
                  </div>
                </li>
               <li>
                  <div class="ui-list-item-content">
                    <div class="ui-list-item-inner">
                      <div class="ui-list-item-title">歌曲</div>
                      <div class="ui-list-item-after">0</div>
                    </div>
                  </div>
                </li>
               <li>
                  <div class="ui-list-item-content">
                    <div class="ui-list-item-inner">
                      <div class="ui-list-item-title">视频</div>
                      <div class="ui-list-item-after">0</div>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="ui-list-item-content">
                    <div class="ui-list-item-inner">
                      <div class="ui-list-item-title">照片</div>
                      <div class="ui-list-item-after">229</div>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="ui-list-item-content">
                    <div class="ui-list-item-inner">
                      <div class="ui-list-item-title">应用程序</div>
                      <div class="ui-list-item-after">132</div>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="ui-list-item-content">
                    <div class="ui-list-item-inner">
                      <div class="ui-list-item-title">总容量</div>
                      <div class="ui-list-item-after">55.9G</div>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="ui-list-item-content">
                    <div class="ui-list-item-inner">
                      <div class="ui-list-item-title">可用容量</div>
                      <div class="ui-list-item-after">32.9G</div>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="ui-list-item-content">
                    <div class="ui-list-item-inner">
                      <div class="ui-list-item-title">版本</div>
                      <div class="ui-list-item-after">8.4(12H143)</div>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="ui-list-item-content">
                    <div class="ui-list-item-inner">
                      <div class="ui-list-item-title">运营商</div>
                      <div class="ui-list-item-after">中国移动20.0</div>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="ui-list-item-content">
                    <div class="ui-list-item-inner">
                      <div class="ui-list-item-title">型号</div>
                      <div class="ui-list-item-after">MG4H2CH/A</div>
                    </div>
                  </div>
                </li>
                <li><div class="ui-list-item-link ui-list-item-content">
                  <div class="ui-list-item-inner"> 
                    <div class="ui-list-item-title">SEID</div>
                  </div></div></li>
            </ul>
          </div>
          <div class="ui-list-block">
            <ul>
              <li><div class="ui-list-item-link ui-list-item-content">
                  <div class="ui-list-item-inner"> 
                    <div class="ui-list-item-title">法律信息</div>
                  </div></div></li>
            </ul>
          </div>

## <div id="样式说明">样式说明</div>

*	ui-list-block ： 组件顶层标示
*	ui-list-item-content ： 列表项外层容器
*	ui-list-item-link ： 需要该项有点击效果的时候，在该项最外层添加该样式
*	ui-list-item-inner ： 列表项内层容器
*	ui-list-item-title ： 列表项标题
*	ui-list-item-after ： 标题对应的值（若存在值的话）,内部出了文字外也可放HTML元素(参见[customListView](#customListView))

## <div id="注意事项">注意事项</div>


## <div id="customlistView">customlistView</div>

	自定义列表组件


## 组件构成
* html+css

## html+css
		<div class="ui-list-block">
            <ul>
              <li><div class="ui-list-item-content">
                  <div class="ui-list-item-inner"> 
                    <div class="ui-list-item-title">item</div>
                    <div class="ui-list-item-after">
                      <div class="ui-switch ui-active">
                        <div class="ui-switch-handle"></div>
                      </div></div>
                  </div>
                  </div>
              </li>
              <li><div class="ui-list-item-link ui-list-item-content">
                  <div class="ui-list-item-inner"> 
                    <div class="ui-list-item-title">item</div>
                    <div class="ui-list-item-after">你的iPhone</div>
                  </div>
                  </div>
              </li>
              <li><div class="ui-list-item-link ui-list-item-content">
                  <div class="ui-list-item-inner"> 
                    <div class="ui-list-item-title">item</div>
                    <div class="ui-list-item-after"><span class="ui-badge ui-badge-red">15</span></div>
                  </div>
                  </div>
              </li>
              <li><div class="ui-list-item-link ui-list-item-content">
                  <div class="ui-list-item-inner"> 
                    <div class="ui-list-item-title">item</div>
                    <div class="ui-list-item-after">
                      <button type="button" class="ui-btn ui-btn-blue">
                        蓝色
                      </button>
                    </div>
                  </div>
                  </div>
              </li>
            </ul>
      </div>

## <div id="样式说明">样式说明</div>

*	ui-switch ： switch组件标示
*	ui-active ： 启用标示
*	ui-switch-handle ： switch组件滑动按钮样式
*	ui-badge ： 标注样式
*	ui-badge-red ： 红色标注样式
*	ui-btn ： button样式
*	ui-btn-blue ： 蓝色按钮样式

## <div id="medialistView">medialistView</div>

	媒体列表组件


## 组件构成
* html+css

## html+css
		<div class="ui-list-block ui-media-list">
          <ul>
            <li><div class="ui-list-item-link ui-list-item-content">
                <div class="ui-item-media"><img src="../img/dmbj.jpg" width="80"/></div>
                <div class="ui-list-item-inner">
                  <div class="ui-list-item-title-row">
                    <div class="ui-list-item-title">盗墓笔记</div>
                    <div class="ui-list-item-after">￥150</div>
                  </div>
                  <div class="ui-media-item-subtitle">南派三叔</div>
                  <div class="ui-media-item-text">出身“老九门”世家的吴邪，因身为考古学家的父母在某次保护国家文物行动时被国外盗墓团伙杀害，吴家为保护吴邪安全将他送去德国读书，因而吴邪对“考古”事业有着与生俱来的兴趣，在一次护宝过程中他偶然获得一张记载着古墓秘密的战国帛书，为赶在不明势力之前解开帛书秘密，保护古墓中文物不受侵害，按照帛书的指引吴邪跟随三叔吴三省、潘子以及神秘小哥张起灵来到鲁殇王墓探究七星鲁王宫的秘密。 在古墓中，吴邪结识了前来探秘的王胖子并救下身份不明的阿宁，经过一系列惊险刺激匪夷所思的事件之后，众人又发现了更多未解的谜团。吴邪等人在和不明势力斗智斗勇的同时又踏上了新的探秘之旅。</div>
                </div></div></li>
          </ul>
        </div>

		<div class="ui-list-block ui-media-list">
              <ul class="ui-table-view">
                    <li>
                          <div class="ui-list-item-content ui-list-item-link">
                            <div class="item-media"><img class="ui-media-object ui-pull-left" src="../img/1.png"></div>
                            <div class="ui-list-item-inner"> 
                              <div class="ui-list-item-title">在喧嚣浮躁的繁华都市里,不断拼命追逐</div>
                            </div>
                          </div>
                    </li>
            </ul>
          </div>

		<div class="ui-list-block ui-media-list">
          <ul>
            <li>
              <div class="ui-list-item-link ui-list-item-content">
                  <div class="ui-list-item-inner">
                    <div class="ui-list-item-title-row">
                      <div class="ui-list-item-title">计费通知</div>
                      <div class="ui-list-item-after">12:14</div>
                    </div>
                    <div class="ui-media-item-subtitle">您支付了7元</div>
                    <div class="ui-media-item-text">您2015-05-17 21:09:49的用车服务已完成，行驶10.00分钟3.70公里，原价10.00元，使用优惠券3.00元，应付7.00元，2小时后系统将自动从您的信用卡中扣款，账户有余额时优先扣除余额。</div>
                  </div>
              </div>
            </li>
          </ul>
        </div>

		<div class="ui-list-block ui-media-list">
          <ul>
            <li>
              <div class="ui-list-item-content">
                <div class="ui-item-media"><img src="../img/1.png" width="44"/></div>
                <div class="ui-list-item-inner">
                  <div class="ui-list-item-title-row">
                    <div class="ui-list-item-title">都市</div>
                  </div>
                  <div class="ui-media-item-subtitle">在喧嚣浮躁的繁华都市里,不断拼命追逐。</div>
                </div>
              </div>
            </li>
          </ul>
        </div>

## <div id="样式说明">样式说明</div>

*	ui-media-list ： 媒体列表组件标示
*	ui-item-media ： 媒体项标示
*	ui-media-object：媒体对象样式
*	ui-pull-left ： 控制与右边元素的距离
*	ui-list-item-title-row ： 媒体项媒体项主标题样式
*	ui-media-item-subtitle ： 媒体项副标题样式
*	ui-media-item-text ： 媒体项文字描述样式



## <div id="swipelistView">swipelistView</div>

	滑动操作列表组件


## 组件构成
* html+css
* js

## html+css
		<div class="ui-list-block">
            <ul>
              <li class="ui-swipeout">
                      <div class="ui-list-item-content ui-swipeout-content">
                        <div class="ui-list-item-inner"> 
                          <div class="ui-list-item-title">左滑显示删除按钮</div>
                        </div>
                      </div>
                      <div class="ui-swipeout-actions-right"><span class="ui-swipeout-delete">删除</span></div>
                  </li>
                  <li class="ui-swipeout">
                      <div class="ui-list-item-content ui-swipeout-content">
                        <div class="ui-list-item-inner"> 
                          <div class="ui-list-item-title">右滑显示删除按钮</div>
                        </div>
                      </div>
                      <div class="ui-swipeout-actions-left"><span class="ui-swipeout-delete">删除</span></div>
                  </li>
            </ul>
          </div>  

          <div class="ui-list-block ui-media-list">
                <ul>
                  <li class="ui-swipeout">
                    <div class="ui-swipeout-content"><div class="ui-list-item-link ui-list-item-content">
                        <div class="ui-list-item-inner">
                          <div class="ui-list-item-title-row">
                            <div class="ui-list-item-title">左滑显示删除按钮</div>
                          </div>
                        </div></div></div>
                    <div class="ui-swipeout-actions-right"><span class="ui-swipeout-delete">Delete</span></div>
                  </li>
                  
                <li class="ui-swipeout">
                    <div class="ui-swipeout-content"><div class="ui-list-item-link ui-list-item-content">
                        <div class="ui-list-item-inner">
                          <div class="ui-list-item-title-row">
                            <div class="ui-list-item-title">右滑显示删除按钮</div>
                          </div>
                        </div></div></div>
                    <div class="ui-swipeout-actions-left"><span class="ui-swipeout-delete">删除</span></div>
                  </li>
                </ul>
              </div>
              <div class="ui-list-block">
            <ul class="ui-table-view">
                  <li class="ui-swipeout">
                      <div class="ui-list-item-content ui-swipeout-content">
                        <div class="item-media"><img class="ui-media-object ui-pull-left" src="../img/1.png"></div>
                        <div class="ui-list-item-inner"> 
                          <div class="ui-list-item-title">右滑显示按钮</div>
                        </div>
                      </div>
                      <div class="ui-swipeout-actions-left"><span class="bg-green">Reply</span><span  class="bg-blue">Forward</span></div>
                    </li>
                    <li class="ui-swipeout">
                      <div class="ui-list-item-content ui-swipeout-content">
                            <div class="item-media"><img class="ui-media-object ui-pull-left" src="../img/1.png"></div>
                            <div class="ui-list-item-inner"> 
                              <div class="ui-list-item-title">左滑显示按钮</div>
                            </div>
                      </div>
                      <div class="ui-swipeout-actions-right"><span class="bg-green">Reply</span><span  class="bg-blue">Forward</span></div>
                    </li>
            </ul>
          </div>  
          <div class="ui-list-block ui-media-list">
              <ul class="ui-table-view">
                    <li class="ui-swipeout">
                      <div class="ui-swipeout-content">
                          <div class="ui-list-item-content ui-list-item-link">
                            <div class="item-media"><img class="ui-media-object ui-pull-left" src="../img/1.png"></div>
                            <div class="ui-list-item-inner"> 
                              <div class="ui-list-item-title">左滑显示按钮</div>
                            </div>
                          </div>
                      </div>
                      <div class="ui-swipeout-actions-right"><span class="bg-green">Reply</span><span  class="bg-blue">Forward</span></div>
                    </li>

                    <li class="ui-swipeout">
                      <div class="ui-swipeout-content">
                          <div class="ui-list-item-content ui-list-item-link">
                            <div class="item-media"><img class="ui-media-object ui-pull-left" src="../img/1.png"></div>
                            <div class="ui-list-item-inner"> 
                              <div class="ui-list-item-title">右滑显示按钮</div>
                            </div>
                          </div>
                      </div>
                      <div class="ui-swipeout-actions-left"><span class="bg-green">Reply</span><span  class="bg-blue">Forward</span></div>
                    </li>
            </ul>
          </div>

          <div class="ui-list-block ui-media-list">
            <ul>
              <li class="ui-swipeout">
                <div class="ui-swipeout-content"><div class="ui-list-item-link ui-list-item-content">
                    <div class="ui-list-item-inner">
                      <div class="ui-list-item-title-row">
                        <div class="ui-list-item-title">计费通知</div>
                        <div class="ui-list-item-after">17:14</div>
                      </div>
                      <div class="ui-media-item-subtitle">您支付了7元</div>
                      <div class="ui-media-item-text">您2015-05-17 21:09:49的用车服务已完成，行驶10.00分钟3.70公里，原价10.00元，使用优惠券3.00元，应付7.00元，2小时后系统将自动从您的信用卡中扣款，账户有余额时优先扣除余额。</div>
                    </div></div></div>
                <div class="ui-swipeout-actions-left"><span class="bg-green ui-swipeout-overswipe">Reply</span><span class="bg-blue">Forward</span></div>
                <div class="ui-swipeout-actions-right"><span>More</span><span class="bg-orange">Mark</span><span class="ui-swipeout-delete ui-swipeout-overswipe">Delete</span></div>
              </li>
              <li class="ui-swipeout">
                <div class="ui-swipeout-content"><div class="ui-list-item-link ui-list-item-content">
                    <div class="ui-list-item-inner">
                      <div class="ui-list-item-title-row">
                        <div class="ui-list-item-title">计费通知</div>
                        <div class="ui-list-item-after">17:14</div>
                      </div>
                      <div class="ui-media-item-subtitle">您支付了7元</div>
                      <div class="ui-media-item-text">您2015-05-17 21:09:49的用车服务已完成，行驶10.00分钟3.70公里，原价10.00元，使用优惠券3.00元，应付7.00元，2小时后系统将自动从您的信用卡中扣款，账户有余额时优先扣除余额。</div>
                    </div></div></div>
                <div class="ui-swipeout-actions-left"><span class="bg-green ui-swipeout-overswipe">Reply</span><span class="bg-blue">Forward</span></div>
                <div class="ui-swipeout-actions-right"><span>More</span><span class="bg-orange">Mark</span><span class="ui-swipeout-delete ui-swipeout-overswipe">Delete</span></div>
              </li>
            </ul>
          </div>

# js
	domReady(function(require){
        require("swipelist");
    	$('.ui-swipeout').swipelist();
     });

# 索引
*	[接口](#接口)
	-	[delete](#delete)
	-	[close](#close)

*	[事件](#事件)
	-	[open](#open)
	-	[opened](#opened)
	-	[close](#close)
	-	[closed](#closed)
	-	[delete](#delete)
	-	[deleted](#deleted)
	
*	[样式说明](#样式说明)
*	[注意事项](#注意事项)

## <div id="接口">接口</div>
	对外提供方法--function
	调用对象 : var sl = $(selector).swipelist();

###  <div id="delete">delete</div>
	
*	sl.delete([callback])   ⇒ self
	-	callback(el) ：删除时回调函数
		-	el ： 被删除的对象
删除当前对象对应的dom元素，并执行回调函数，将要删除的元素作为参数传入

###  <div id="close">close</div>
	
*	sl.close([callback])   ⇒ self
	-	callback(el) ：关闭时回调函数
		-	el ： 被删除的对象
关闭当前对象对应的dom元素，并执行回调函数，将要关闭的元素作为参数传入

## <div id="事件">事件</div>
	对外提供事件--Event
	调用对象	: var sl = $(selector).swipelist();
			$(selector).on(Event,function(e){})  或  sc.ref.on(Event,function(e){})

###  <div id="open">open</div>
	
*	$(selector).on('open',function(e){})

当打开时触发

###  <div id="opened">opened</div>
	
*	$(selector).on('opened',function(e){})

当打开动作完成时触发

###  <div id="close">close</div>
	
*	$(selector).on('close',function(e){})

当关闭时触发

###  <div id="closed">closed</div>
	
*	$(selector).on('closed',function(e){})

当关闭动作完成时触发

当打开动作完成时触发

###  <div id="delete">delete</div>
	
*	$(selector).on('delete',function(e){})

当删除时触发

###  <div id="deleted">deleted</div>
	
*	$(selector).on('deleted',function(e){})

当删除动作完成时触发

## <div id="样式说明">样式说明</div>

*	ui-swipeout ： 滑动列表组件标示
*	ui-swipeout-content ： 滑动列表项内容样式
*	ui-swipeout-actions-right ： 滑动列表右侧可滑动样式标示
*	ui-swipeout-delete ： 删除按钮样式
*	ui-swipeout-actions-left ： 滑动列表左侧可滑动样式标示
*	bg-green ： 背景色-绿
*	bg-blue ： 背景色-蓝
*	ui-swipeout-overswipe ： 在滑动按钮的最后一个上面添加该样式，则在滑动时，滑动距离过大时，最后一个按钮					将覆盖前面的按钮，并执行该按钮上的tap事件

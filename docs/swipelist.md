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

*	ui-swipeout ： 媒体列表组件标示
*	ui-item-media ： 媒体项标示
*	ui-list-item-title-row ： 媒体项媒体项主标题样式
*	ui-media-item-subtitle ： 媒体项副标题样式
*	ui-media-item-text ： 媒体项文字描述样式
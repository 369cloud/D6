
# lazyloadimage
***
	图片懒加载组件

$(selector).lazyloadimage() 

*	返回值：lazyloadimage对象（多个时返回数组）

# 组件构成
* html+css
* js

# html+css
	<div class="ui-lazy-loader">
        <div class="ui-lazy-loader-content">
            <p> <img data-src="http://www.freeimages.co.uk/galleries/sports/relaxation/thumbs/peaceful_bamboo_grove.jpg" class="ui-lazy" /></p>
            <p> <img data-src="http://www.freeimages.co.uk/galleries/sports/relaxation/thumbs/peaceful_lake.jpg" class="ui-lazy" /></p>
            <p> <img data-src="http://www.freeimages.co.uk/galleries/sports/relaxation/thumbs/quiet_rainforest.jpg" class="ui-lazy" /></p>
            <p> <img data-src="http://www.freeimages.co.uk/galleries/sports/relaxation/thumbs/mossy_glade.jpg" class="ui-lazy" /></p>
            <p> <img data-src="http://www.freeimages.co.uk/galleries/sports/relaxation/thumbs/quiet_zen_retreat.jpg" class="ui-lazy" /></p>
            <p> <img data-src="http://www.freeimages.co.uk/galleries/sports/relaxation/thumbs/still_sunset.jpg" class="ui-lazy" /></p>
            <p> <img data-src="http://www.freeimages.co.uk/galleries/sports/relaxation/thumbs/reading_a_book.jpg" class="ui-lazy" /></p>
            <p> <img data-src="http://www.freeimages.co.uk/galleries/sports/relaxation/thumbs/zen_tranquility.jpg" class="ui-lazy" /></p>
            <p> <img data-src="http://www.freeimages.co.uk/galleries/sports/relaxation/thumbs/calm_zen_garden.jpg" class="ui-lazy" /></p>
            <p> <img data-src="http://www.freeimages.co.uk/galleries/sports/relaxation/thumbs/calm_ocean.jpg" class="ui-lazy" /></p>
            <div style='height:300px;' data-background="http://www.freeimages.co.uk/galleries/sports/relaxation/thumbs/beach_walk.jpg" class="ui-lazy"></div>
        </div>
    </div>

# js
	 domReady(function(require){
        require("lazyloadimage");
        $('.ui-lazy-loader').lazyloadimage();
    });

## <div id="样式说明">样式说明</div>

*	ui-lazy-loader ： 组件顶层标示
*	ui-lazy-loader-content ： 组件内容区域
*	ui-lazy ： 需要延迟加载的项

## 注意事项

*	需要进行图片懒加载的内容需要包含在 ui-lazy-loader > ui-lazy-loader-content 内部
*	在需要进行懒加载的图片对象上需要添加 ui-lazy 样式
*	需要将图片的真实地址写在图片对象的data-src属性上
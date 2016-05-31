# 移动端开发规范

## 框架基础
1. zepto，打包(event、ajax、fx、fx_methods、data、detect、touch); 方便开源框架使用
2. d6基于zeptojs开发的前端组件库。
3. debug.js为引擎api的js模拟，用来调试。
3. native为引擎api的封装-d6。

## ui组件库
### 基本样式
1. 样式统一
	
	在统一浏览器默认样式上，Reset 一度非常流行，更有简单粗暴的通配符 reset ：

		* {
		    margin: 0;
		    padding: 0;
		    border:0;
		}
	
	时过境迁，Reset 逐渐淡出的前沿前端的视野，[normalize.css](https://github.com/necolas/normalize.css) 取而代之。normalize.css，统一样式的同时保留可辨识性；reset 统一样式，完全没有可读性，分不清是男人、女人，或者是不男不女，看着都一样。

	字体抗锯齿，这个在chrome上试过，没什么用

		-webkit-font-smoothing: antialiased

2. 基础设置

	Amaze UI 定义的一些基础样式。

	1. CSS 盒模型
	
		曾几何时，IE 6 及更低版本的非标准盒模型被喷得体无完肤。IE 原来的盒模型真的不好么？最终，时间给了另外一个答案。 W3C 终认识到所谓标准盒模型在实际使用中的复杂性，于是在 CSS3 中增加 box-sizing 这一属性，允许用户自定义盒模型。
		
		> You tell me I'm wrong, Then you better prove you're right.  
		> King of Pop – Scream
		
		这就是 W3C 的证明。
		
		扯远了，Amaze UI 将所有元素的盒模型设置为 border-box。这下好了，妈妈再也不用担心你没计算好 padding、border 而使布局破相了。咱来写样式，不是来学算术。
		
			 *,
			 *:before,
			 *:after {
			   -moz-box-sizing: border-box;
			   -webkit-box-sizing: border-box;
			   box-sizing: border-box;
			 }
	
		Box sizing
		
		参考链接：
		
		https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing
		http://www.paulirish.com/2012/box-sizing-border-box-ftw/
		Box Sizing
	
	2. 字号及单位
	
		Amaze UI 将浏览器的基准字号设置为 62.5%，也就是 10px，现在 1rem = 10px —— 为了计算方便。然后在 body 上应用了 font-size: 1.6rem;，将页面字号设置为 16px。
			
			html {
			  	font-size: 62.5%;
			}
			
			body {
			  	font-size: 1.6rem; /* =16px */
			}
	
		与 em 根据上下文变化不同，rem 只跟基准设置关联，只要修改基准字号，所有使用 rem 作为单位的设置都会相应改变。
	
		当然，并非所有所有浏览器的默认字号都是 16px，所以在不同的浏览器上会有细微差异。
	
		另外，一些需要根据字号做相应变化的场景也使用了 em，需要像素级别精确的场景也使用了 px。
3. 文字排版


### 布局相关
1. 网格grid

	.container 自带padding，padding默认为10px，可以通过less文件进行配置，自动生成

		.container 在使用grid布局时必须在最外层添加container

		** grid 在使用中虽然不是完全依赖container，但是在有些情况下不依赖container会出现横向滚动条，就是当grid的宽度等于整个window的宽度时 **

	横向排列等分布局

		<div class="container">
			<div class="grid">
				<div class="grid-cell">
					grid-cell
				</div>
				<div class="grid-cell">
					grid-cell
				</div>
				<div class="grid-cell">
					grid-cell
				</div>
			</div>
		</div>

	左侧固定，右侧自适应
	
		<div class="container">
			<div class="grid demo">
				<span class="col-1">左侧固定</span>
				<div class="grid-cell">
					<p>grid-cell</p>
				</div>
			</div>
		<div>


	父容器

		.grid

	子列容器可以在横向和纵向布局中自适应容器剩余宽度

		.grid-cell

	横向排列栅格布局

		.col-1 25%;
		.col-2 50%;
		.col-3 75%;
		.col-4 100%;

	纵向排列布局

		.grid-column

### css组件


### js插件
		

> 参考资料：

1. 基于flexbox的栅格化布局库，提供更直观、丰富的布局方式 [http://coffcer.github.io/flex-layout/](http://coffcer.github.io/flex-layout/ "http://coffcer.github.io/flex-layout/")
2. bootstrap 布局例子  [http://v3.bootcss.com/examples/grid/](http://v3.bootcss.com/examples/grid/ "http://v3.bootcss.com/examples/grid/") 
3. aui [http://www.auicss.com/?m=Home&c=Document#calendar](http://www.auicss.com/?m=Home&c=Document#calendar "http://www.auicss.com/?m=Home&c=Document#calendar")
4. 妹子ui [http://amazeui.org/javascript/selected](http://amazeui.org/javascript/selected "http://amazeui.org/javascript/selected")
5. fontawesome  [http://www.bootcss.com/p/font-awesome/](http://www.bootcss.com/p/font-awesome/ "http://www.bootcss.com/p/font-awesome/")
6. iconfont [http://www.iconfont.cn/](http://www.iconfont.cn/ "http://www.iconfont.cn/")
7. dcloud mui
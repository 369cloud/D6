
## 环境配置


1、安装nodeJs
	http://www.cnblogs.com/pigtail/archive/2013/01/08/2850486.html

2、安装git
	http://jingyan.baidu.com/article/90895e0fb3495f64ed6b0b50.html

3、工程目录右键，选择Git Bash


4、安装gulp 
	
	执行命令：npm install gulpjs/gulp#4.0 -g安装gulp到全局
	执行命令：npm install 安装配置环境到本地
	执行命令：gulp

   运行`gulp`命令后，会监听`src`目录下所有`JS`、`less`文件的变更，并且会在`3003`端口启动服务器，然后再浏览器打开`http://localhost:3003/examples/index.html`


## 项目主页
	
[http://369cloud.github.io/D6](http://369cloud.github.io/D6/)

##开发工具


[369Cloud](http://www.369cloud.com) 致力于打造移动互联网云平台研发生态系统，将移动应用开发与移动应用云服务（BaaS、IaaS服务）完美集成，为开发者提供集成开发环境、移动应用开发引擎、基础服务、后端服务等一站式的移动应用开发解决方案；由[369Cloud](http://www.369cloud.com) 自主研发的一体化开发流程，实现从应用创建、自定义认证、组件选择、模板配置、到混合平台编译等一系列可视化、可配置化操作，最大程度的为开发者及创业团队节约时间成本、人力成本、资金成本。

##反馈bug
如果您有任何关于 `D6` 或移动前端开发中的问题，可以在QQ群中讨论，也可以通过git issue给我们反馈bug，我们会尽快解决。 当然，我们更欢迎您的fork，为 `D6` 添砖加瓦。

###联系我们###
* (QQ群）491311335 
 

# 开发规范

## 文件组织

	 .
	    ├── src
	        └── js 字体库
	            ├── widgets 组件文件存放位置
	            ├── $extend.js 在zepto上扩展的常用方法
	            ├── core.js组件库核心文件
	            ├── iscroll.js 组件库依赖的iscroll文件（经过修改，请勿替换）
				├── zepto.extend.js 在zepto对象上扩展的方法
	        └── less 样式文件存放位置
			└── fonts 字体库存放位置
*	iscroll.js 组件库依赖的iscroll文件（经过修改，请勿替换）

*	组件JS需放在 `js/widgets` 目录下，若组件自身含有功能插件，应在 `widgets` 文件夹下建立一个单独文件夹来存放相关组件和插件

*	组件相关less文件放在 `less目录下` ，并且在d6.less文件中添加

	
## 样式
组件的classname使用 `ui-组件名称` 作为命名空间，其后根据功能添加不同标识。如：ui-tab-active

## 组件开发

D6组件的开发主要使用两种方式：

*	基于zeptoJs开发组件，可根据个人习惯开发基于`zeptoJs`的插件。

*	基于core.js，其提供一些简单的移动方法便于组件的构建，主要包含以下几个对象和方法：`d6`、`Base`、`$ui`、`define`、`domReady`
	-	d6：组件库的对外暴露对象，提供全局属性和方法
	-	Base：组件对象的基础类，提供组件的基础方法和属性，所有组件对象基于该对象扩展，实例化过程会调用每个组件的`init`方法
	-	$ui：组件的管理对象，提供组件和插件的定义、获取、注册方法
	-	define：组件主体部分定义方法，将`$ui`对象传入
	-	domReady：页面初始化方法，传入`require`方法获取组件对象

	组件示例代码：

	
		/**
		 * @file 组件
		 */
		
		;(function() {
		
		// 私有变量  
		   
		// 私有方法  
		
		    // 渲染组件
		
		    // 绑定事件 
		
		    /**
		     * 组件定义
		     */
		    define(function($ui) {
		        // 组件对象定义  
		        var widget = $ui.define('widgetName', {
		            /**
		             * @property  组件属性
		             */
		            property: 0
		        });

		     //实现init方法
		
		        widget.prototype.init = function() {
		            // 渲染组件
		            // 绑定事件
		        };
		
		     // 对象扩展对外接口  
		
		        /**
		         * 功能描述
		         * @method method
		         * @param {Number} index 
		         * @return {self} 返回本身。
		         */
		        widget.prototype.method = function(index) {
			    ......
			    ......
		            return this;
		        };
		
		        /**
		         * 销毁组件
		         * @method destroy
		         */
		       widget.prototype.destroy = function() {
		
		        };
		
		     // 绑定到zepto对象上  供外部创建对象使用 
		
		        //注册$插件
		        $.fn.widget = function(opts) {
		            var objs = [];
		            opts || (opts = {});
		            this.each(function() {
		                var obj = null;
		                var id = this.getAttribute('data-widget');
		                if (!id) {
		                    opts = $.extend(opts, {
		                        ref: this
		                    });
		                    id = ++$ui.uuid;
		                    obj = $ui.data[id] = new widget(opts);
		                    this.setAttribute('data-widget', id);
		                } else {
		                    obj = $ui.data[id];
		                }
		                objs.push(obj);
		            });
		            return objs.length > 1 ? objs : objs[0];
		        };
		
		    });
		})();

	插件示例代码：

	
		/**
		 * @file 插件
		 */
		;(function() {
		    // 私有变量  
		   
		    // 私有方法 
		
		    /**
		     * 插件定义
		     */
		    define(function($ui) {
		
			// 插件对象定义  
		        $ui.plugin('plugin', function(){
		
			// 插件内部实现
			
		        });
		    });
		})()

	


## 组件初始化
组件有两种初始化方式：

*	$('#className').widget()的方式；

*	通过require方法获取组件对象手动初始化：

		var widget = require('widgetName')
        var widgetObj = new widget({
            ref:$('.className')
        })


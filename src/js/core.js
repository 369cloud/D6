
;
(function(global, $, undefined) {
	var d6 = {
			verticalSwipe: true //是否可以纵向滑动
		},
		$ui = {},
		Base = {},
		readyRE = /complete|loaded|interactive/,
		REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,
		SLASH_RE = /\\\\/g;

	var getWidget = function(name) {
		return $ui.widgets[name]
	};

	Base.eachObj = function(obj, iterator) {
		obj && Object.keys(obj).forEach(function(key) {
			iterator(key, obj[key]);
		});
	};
	Base.getWidget = getWidget;
	Base.register = function(name, callback) {
		if ($.isFunction(callback)) {
			callback.call(global, $ui.plugins[name])
		}
	};
	Base.init = function() {};
	/**
	 * @name extend
	 * @desc 扩充现有组件
	 */
	Base.extend = function(obj) {
		var proto = this.prototype;
		Base.eachObj(obj, function(key, val) {
			proto[key] = val;
		});
		return this;
	};

	Base.parseTpl = function(str, data) {
		var tmpl = 'var __p=[];' + 'with(obj||{}){__p.push(\'' +
			str.replace(/\\/g, '\\\\')
			.replace(/'/g, '\\\'')
			.replace(/<%=([\s\S]+?)%>/g, function(match, code) {
				return '\',' + code.replace(/\\'/, '\'') + ',\'';
			})
			.replace(/<%([\s\S]+?)%>/g, function(match, code) {
				return '\');' + code.replace(/\\'/, '\'')
					.replace(/[\r\n\t]/g, ' ') + '__p.push(\'';
			})
			.replace(/\r/g, '\\r')
			.replace(/\n/g, '\\n')
			.replace(/\t/g, '\\t') +
			'\');}return __p.join("");',

			func = new Function('obj', tmpl);

		return data ? func(data) : func;
	};

	/*
	      判断是否Touch屏幕
	  */
	Base.isTouchScreen = function() {
		return (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
	};

	Base.touchEve = function() {
		return this.isTouchScreen() ? "tap" : "click"
	};

	Base.touchStart = function() {
		return this.isTouchScreen() ? "touchstart" : "mousedown"
	};

	Base.touchEnd = function() {
		return this.isTouchScreen() ? "touchend" : "mouseup mouseout"
	};

	Base.touchCancel = function() {
		return this.isTouchScreen() ? "touchcancel" : "mouseup"
	};

	Base.touchMove = function() {
		return this.isTouchScreen() ? "touchmove" : "mousemove"
	};

	Base.longTap = function() {
		return this.isTouchScreen() ? "longTap" : "mouseup"
	};

	Base.touchOver = function() {
		return this.isTouchScreen() ? "touchend touchmove" : "mouseup"
	};


	Base.log = function(str) {
		console.log(str);
		return this;
	};

	Base.stopPropagation = function(e) {
		e.stopPropagation();
		return this;
	};

	Base.preventDefault = function(e) {
		e.preventDefault();
		return this;
	};


	Base.focus = function(element) {
		if ($.os.ios) {
			setTimeout(function() {
				element.focus();
			}, 10);
		} else {
			element.focus();
		}
		return this;
	};

	$ui.uuid = 0;
	$ui.data = {};
	$ui.widgets = {};
	$ui.plugins = {};
	$ui.module = {};
	$ui.define = function(name, options) {
		if ($ui.widgets[name]) return $ui.widgets[name];
		var defOpts = {
			/**
			 * 参照对象
			 * @property {String} [ref=null]
			 */
			ref: null, //参照目标 

			/**
			 * 点击回调函数
			 * @type {function}
			 */
			callback: null
		}
		var klass = function(opts) {
			var baseOpts = $.extend(true, {}, this.options);
			this.opts = $.extend(true, baseOpts, opts);
			this.ref = $(this.opts.ref);
			this.callback = this.opts.callback;
			this.$family = {
				name: name
			}
			this.init();
		}
		$ui.widgets[name] = Base.extend.call(klass, Base);
		$ui.widgets[name].prototype.options = $.extend(defOpts, options);
		return $ui.widgets[name];
	};

	$ui.plugin = function(name, factory) {
		$ui.plugins[name] = factory
	};

	var define = function(factory) {
		if ($.isFunction(factory)) {
			var module = factory.call(global, $ui)
		}
	};

	var require = function(widget) {
		var widget = getWidget(widget);
		return widget;
	}


	setTimeout(function() {
		$(document).find('.ui-action-back').button(function(evt) {
			if (window.app) {
				window.app.currentView().back();
			} else if (window.rd) {
				window.rd.window.closeSelf();
			} else {
				window.history.back()
			}
		})
	}, 100);

	$.fn.ready = function(callback) {
		if (readyRE.test(document.readyState) && document.body) global.domReady(callback);
		else document.addEventListener('DOMContentLoaded', function() {
			global.domReady(callback)
		}, false)
		return this
	};
	if (global.domReady) {
		var domReady = global.domReady;
		global.domReady = function(factory) {
			if ($.isFunction(factory)) {
				domReady.call(global, factory, require);
			}
		};
	} else {
		global.domReady = function(factory) {
			if ($.isFunction(factory)) {
				factory.call(global, require);
			}
		};
	}

	global.define = define;
	
	global.d6 = d6;
})(this, $);
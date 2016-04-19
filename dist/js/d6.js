
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
/*! iScroll v5.1.3 ~ (c) 2008-2014 Matteo Spinelli ~ http://cubiq.org/license */
(function(window, document, Math) {
	var rAF = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};

	var utils = (function() {
		var me = {};

		var _elementStyle = document.createElement('div').style;
		var _vendor = (function() {
			var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
				transform,
				i = 0,
				l = vendors.length;

			for (; i < l; i++) {
				transform = vendors[i] + 'ransform';
				if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
			}

			return false;
		})();

		function _prefixStyle(style) {
			if (_vendor === false) return false;
			if (_vendor === '') return style;
			return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
		}

		me.getTime = Date.now || function getTime() {
			return new Date().getTime();
		};

		me.extend = function(target, obj) {
			for (var i in obj) {
				target[i] = obj[i];
			}
		};

		me.addEvent = function(el, type, fn, capture) {
			el.addEventListener(type, fn, !!capture);
		};

		me.removeEvent = function(el, type, fn, capture) {
			el.removeEventListener(type, fn, !!capture);
		};

		me.prefixPointerEvent = function(pointerEvent) {
			return window.MSPointerEvent ?
				'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10) :
				pointerEvent;
		};

		me.momentum = function(current, start, time, lowerMargin, wrapperSize, deceleration) {
			var distance = current - start,
				speed = Math.abs(distance) / time,
				destination,
				duration;

			deceleration = deceleration === undefined ? 0.0006 : deceleration;

			destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
			duration = speed / deceleration;

			if (destination < lowerMargin) {
				destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
				distance = Math.abs(destination - current);
				duration = distance / speed;
			} else if (destination > 0) {
				destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
				distance = Math.abs(current) + destination;
				duration = distance / speed;
			}

			return {
				destination: Math.round(destination),
				duration: duration
			};
		};

		var _transform = _prefixStyle('transform');

		me.extend(me, {
			hasTransform: _transform !== false,
			hasPerspective: _prefixStyle('perspective') in _elementStyle,
			hasTouch: 'ontouchstart' in window,
			hasPointer: window.PointerEvent || window.MSPointerEvent, // IE10 is prefixed
			hasTransition: _prefixStyle('transition') in _elementStyle
		});

		// This should find all Android browsers lower than build 535.19 (both stock browser and webview)
		me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion));

		me.extend(me.style = {}, {
			transform: _transform,
			transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
			transitionDuration: _prefixStyle('transitionDuration'),
			transitionDelay: _prefixStyle('transitionDelay'),
			transformOrigin: _prefixStyle('transformOrigin')
		});

		me.hasClass = function(e, c) {
			var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
			return re.test(e.className);
		};

		me.addClass = function(e, c) {
			if (me.hasClass(e, c)) {
				return;
			}

			var newclass = e.className.split(' ');
			newclass.push(c);
			e.className = newclass.join(' ');
		};

		me.removeClass = function(e, c) {
			if (!me.hasClass(e, c)) {
				return;
			}

			var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
			e.className = e.className.replace(re, ' ');
		};

		me.offset = function(el) {
			var left = -el.offsetLeft,
				top = -el.offsetTop;

			// jshint -W084
			while (el = el.offsetParent) {
				left -= el.offsetLeft;
				top -= el.offsetTop;
			}
			// jshint +W084

			return {
				left: left,
				top: top
			};
		};

		me.preventDefaultException = function(el, exceptions) {
			for (var i in exceptions) {
				if (exceptions[i].test(el[i])) {
					return true;
				}
			}

			return false;
		};

		me.extend(me.eventType = {}, {
			touchstart: 1,
			touchmove: 1,
			touchend: 1,

			mousedown: 2,
			mousemove: 2,
			mouseup: 2,

			pointerdown: 3,
			pointermove: 3,
			pointerup: 3,

			MSPointerDown: 3,
			MSPointerMove: 3,
			MSPointerUp: 3
		});

		me.extend(me.ease = {}, {
			quadratic: {
				style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				fn: function(k) {
					return k * (2 - k);
				}
			},
			circular: {
				style: 'cubic-bezier(0.1, 0.57, 0.1, 1)', // Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
				fn: function(k) {
					return Math.sqrt(1 - (--k * k));
				}
			},
			back: {
				style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
				fn: function(k) {
					var b = 4;
					return (k = k - 1) * k * ((b + 1) * k + b) + 1;
				}
			},
			bounce: {
				style: '',
				fn: function(k) {
					if ((k /= 1) < (1 / 2.75)) {
						return 7.5625 * k * k;
					} else if (k < (2 / 2.75)) {
						return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
					} else if (k < (2.5 / 2.75)) {
						return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
					} else {
						return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
					}
				}
			},
			elastic: {
				style: '',
				fn: function(k) {
					var f = 0.22,
						e = 0.4;

					if (k === 0) {
						return 0;
					}
					if (k == 1) {
						return 1;
					}

					return (e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1);
				}
			}
		});

		me.tap = function(e, eventName) {
			var ev = document.createEvent('Event');
			ev.initEvent(eventName, true, true);
			ev.pageX = e.pageX;
			ev.pageY = e.pageY;
			e.target.dispatchEvent(ev);
		};

		me.click = function(e) {
			var target = e.target,
				ev;

			if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
				ev = document.createEvent('MouseEvents');
				ev.initMouseEvent('click', true, true, e.view, 1,
					target.screenX, target.screenY, target.clientX, target.clientY,
					e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
					0, null);

				ev._constructed = true;
				target.dispatchEvent(ev);
			}
		};

		return me;
	})();

	function IScroll(el, options) {
		this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
		this.scroller = this.wrapper.children[0];
		this.scrollerStyle = this.scroller.style; // cache style for better performance

		this.options = {

			resizeScrollbars: true,

			mouseWheelSpeed: 20,

			snapThreshold: 0.334,

			// INSERT POINT: OPTIONS 

			startX: 0,
			startY: 0,
			scrollY: true,
			directionLockThreshold: 5,
			momentum: true,

			bounce: true,
			bounceTime: 600,
			bounceEasing: '',

			preventDefault: true,
			preventDefaultException: {
				tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
			},

			HWCompositing: true,
			useTransition: true,
			useTransform: true
		};

		for (var i in options) {
			this.options[i] = options[i];
		}

		// Normalize options
		this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

		this.options.useTransition = utils.hasTransition && this.options.useTransition;
		this.options.useTransform = utils.hasTransform && this.options.useTransform;

		this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
		this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

		// If you want eventPassthrough I have to lock one of the axes
		this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
		this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

		// With eventPassthrough we also need lockDirection mechanism
		this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
		this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

		this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

		this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

		if (this.options.tap === true) {
			this.options.tap = 'tap';
		}

		if (this.options.shrinkScrollbars == 'scale') {
			this.options.useTransition = false;
		}

		this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

		if (this.options.probeType == 3) {
			this.options.useTransition = false;
		}

		// INSERT POINT: NORMALIZATION

		// Some defaults	
		this.x = 0;
		this.y = 0;
		this.directionX = 0;
		this.directionY = 0;
		this._events = {};

		// INSERT POINT: DEFAULTS

		this._init();
		this.refresh();

		this.scrollTo(this.options.startX, this.options.startY);
		this.enable();
	}

	IScroll.prototype = {
		version: '5.1.3',

		_init: function() {
			this._initEvents();

			if (this.options.scrollbars || this.options.indicators) {
				this._initIndicators();
			}

			if (this.options.mouseWheel) {
				this._initWheel();
			}

			if (this.options.snap) {
				this._initSnap();
			}

			if (this.options.keyBindings) {
				this._initKeys();
			}

			// INSERT POINT: _init

		},

		destroy: function() {
			this._initEvents(true);

			this._execEvent('destroy');
		},

		_transitionEnd: function(e) {
			if (e.target != this.scroller || !this.isInTransition) {
				return;
			}

			this._transitionTime();
			if (!this.resetPosition(this.options.bounceTime)) {
				this.isInTransition = false;
				this._execEvent('scrollEnd');
			}
		},

		_start: function(e) {
			// React to left mouse button only
			if (utils.eventType[e.type] != 1) {
				if (e.button !== 0) {
					return;
				}
			}

			if (!this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated)) {
				return;
			}

			if (this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
				e.preventDefault();
			}

			var point = e.touches ? e.touches[0] : e,
				pos;

			this.initiated = utils.eventType[e.type];
			this.moved = false;
			this.distX = 0;
			this.distY = 0;
			this.directionX = 0;
			this.directionY = 0;
			this.directionLocked = 0;

			this._transitionTime();

			this.startTime = utils.getTime();

			if (this.options.useTransition && this.isInTransition) {
				this.isInTransition = false;
				pos = this.getComputedPosition();
				this._translate(Math.round(pos.x), Math.round(pos.y));
				this._execEvent('scrollEnd');
			} else if (!this.options.useTransition && this.isAnimating) {
				this.isAnimating = false;
				this._execEvent('scrollEnd');
			}

			this.startX = this.x;
			this.startY = this.y;
			this.absStartX = this.x;
			this.absStartY = this.y;
			this.pointX = point.pageX;
			this.pointY = point.pageY;

			this._execEvent('beforeScrollStart');
		},

		_move: function(e) {
			if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
				return;
			}

			if (this.options.preventDefault) { // increases performance on Android? TODO: check!
				e.preventDefault();
			}


			var point = e.touches ? e.touches[0] : e,
				deltaX = point.pageX - this.pointX,
				deltaY = point.pageY - this.pointY,
				timestamp = utils.getTime(),
				newX, newY,
				absDistX, absDistY;

			this.pointX = point.pageX;
			this.pointY = point.pageY;

			this.distX += deltaX;
			this.distY += deltaY;
			absDistX = Math.abs(this.distX);
			absDistY = Math.abs(this.distY);

			if (this.options.scrollY) {
				var diff_x = point.pageX - this.pointX,
					diff_y = point.pageY - this.pointY;
				if (this.options.probeType > 1) {
					this._execEvent('scroll');
				}
				if (Math.abs(360 * Math.atan(diff_y / diff_x) / (2 * Math.PI)) < 60) return;
				if (!d6.verticalSwipe) return;
			}

			// We need to move at least 10 pixels for the scrolling to initiate
			if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
				return;
			}

			// If you are scrolling in one direction lock the other
			if (!this.directionLocked && !this.options.freeScroll) {
				if (absDistX > absDistY + this.options.directionLockThreshold) {
					this.directionLocked = 'h'; // lock horizontally
				} else if (absDistY >= absDistX + this.options.directionLockThreshold) {
					this.directionLocked = 'v'; // lock vertically
				} else {
					this.directionLocked = 'n'; // no lock
				}
			}

			if (this.directionLocked == 'h') {
				if (this.options.eventPassthrough == 'vertical') {
					e.preventDefault();
				} else if (this.options.eventPassthrough == 'horizontal') {
					this.initiated = false;
					return;
				}

				deltaY = 0;
			} else if (this.directionLocked == 'v') {
				if (this.options.eventPassthrough == 'horizontal') {
					e.preventDefault();
				} else if (this.options.eventPassthrough == 'vertical') {
					this.initiated = false;
					return;
				}

				deltaX = 0;
			}

			deltaX = this.hasHorizontalScroll ? deltaX : 0;
			deltaY = this.hasVerticalScroll ? deltaY : 0;

			newX = this.x + deltaX;
			newY = this.y + deltaY;

			// Slow down if outside of the boundaries
			if (newX > 0 || newX < this.maxScrollX) {
				newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
			}
			if (newY > 0 || newY < this.maxScrollY) {
				newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
			}

			this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
			this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

			if (!this.moved) {
				this._execEvent('scrollStart');
			}

			this.moved = true;

			this._translate(newX, newY);

			/* REPLACE START: _move */
			if (timestamp - this.startTime > 300) {
				this.startTime = timestamp;
				this.startX = this.x;
				this.startY = this.y;

				if (this.options.probeType == 1) {
					this._execEvent('scroll');
				}
			}

			if (this.options.probeType > 1) {
				this._execEvent('scroll');
			}
			/* REPLACE END: _move */

		},

		_end: function(e) {
			if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
				return;
			}

			if (this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
				e.preventDefault();
			}

			var point = e.changedTouches ? e.changedTouches[0] : e,
				momentumX,
				momentumY,
				duration = utils.getTime() - this.startTime,
				newX = Math.round(this.x),
				newY = Math.round(this.y),
				distanceX = Math.abs(newX - this.startX),
				distanceY = Math.abs(newY - this.startY),
				time = 0,
				easing = '';

			this.isInTransition = 0;
			this.initiated = 0;
			this.endTime = utils.getTime();

			// reset if we are outside of the boundaries
			if (this.resetPosition(this.options.bounceTime)) {
				return;
			}

			this.scrollTo(newX, newY); // ensures that the last position is rounded

			// we scrolled less than 10 pixels
			if (!this.moved) {
				if (this.options.tap) {
					utils.tap(e, this.options.tap);
				}

				if (this.options.click) {
					utils.click(e);
				}

				this._execEvent('scrollCancel');
				return;
			}

			if (this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100) {
				this._execEvent('flick');
				return;
			}

			// start momentum animation if needed
			if (this.options.momentum && duration < 300) {
				momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
					destination: newX,
					duration: 0
				};
				momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
					destination: newY,
					duration: 0
				};
				newX = momentumX.destination;
				newY = momentumY.destination;
				time = Math.max(momentumX.duration, momentumY.duration);
				this.isInTransition = 1;
			}


			if (this.options.snap) {
				var snap = this._nearestSnap(newX, newY);
				this.currentPage = snap;
				time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(newX - snap.x), 1000),
						Math.min(Math.abs(newY - snap.y), 1000)
					), 300);
				newX = snap.x;
				newY = snap.y;

				this.directionX = 0;
				this.directionY = 0;
				easing = this.options.bounceEasing;
			}

			// INSERT POINT: _end

			if (newX != this.x || newY != this.y) {
				// change easing function when scroller goes out of the boundaries
				if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
					easing = utils.ease.quadratic;
				}

				this.scrollTo(newX, newY, time, easing);
				return;
			}

			this._execEvent('scrollEnd');
		},

		_resize: function() {
			var that = this;

			clearTimeout(this.resizeTimeout);

			this.resizeTimeout = setTimeout(function() {
				that.refresh();
			}, this.options.resizePolling);
		},

		resetPosition: function(time) {
			var x = this.x,
				y = this.y;

			time = time || 0;

			if (!this.hasHorizontalScroll || this.x > 0) {
				x = 0;
			} else if (this.x < this.maxScrollX) {
				x = this.maxScrollX;
			}

			if (!this.hasVerticalScroll || this.y > 0) {
				y = 0;
			} else if (this.y < this.maxScrollY) {
				y = this.maxScrollY;
			}

			if (x == this.x && y == this.y) {
				return false;
			}

			this.scrollTo(x, y, time, this.options.bounceEasing);

			return true;
		},

		disable: function() {
			this.enabled = false;
		},

		enable: function() {
			this.enabled = true;
		},

		refresh: function() {
			var rf = this.wrapper.offsetHeight; // Force reflow

			this.wrapperWidth = this.wrapper.clientWidth;
			this.wrapperHeight = this.wrapper.clientHeight;

			/* REPLACE START: refresh */

			this.scrollerWidth = this.scroller.offsetWidth;
			this.scrollerHeight = this.scroller.offsetHeight;

			this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
			this.maxScrollY = this.wrapperHeight - this.scrollerHeight;

			/* REPLACE END: refresh */

			this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
			this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;

			if (!this.hasHorizontalScroll) {
				this.maxScrollX = 0;
				this.scrollerWidth = this.wrapperWidth;
			}

			if (!this.hasVerticalScroll) {
				this.maxScrollY = 0;
				this.scrollerHeight = this.wrapperHeight;
			}

			this.endTime = 0;
			this.directionX = 0;
			this.directionY = 0;

			this.wrapperOffset = utils.offset(this.wrapper);

			this._execEvent('refresh');

			this.resetPosition();

			// INSERT POINT: _refresh

		},

		on: function(type, fn) {
			if (!this._events[type]) {
				this._events[type] = [];
			}

			this._events[type].push(fn);
		},

		off: function(type, fn) {
			if (!this._events[type]) {
				return;
			}

			var index = this._events[type].indexOf(fn);

			if (index > -1) {
				this._events[type].splice(index, 1);
			}
		},

		_execEvent: function(type) {
			if (!this._events[type]) {
				return;
			}

			var i = 0,
				l = this._events[type].length;

			if (!l) {
				return;
			}

			for (; i < l; i++) {
				this._events[type][i].apply(this, [].slice.call(arguments, 1));
			}
		},

		scrollBy: function(x, y, time, easing) {
			x = this.x + x;
			y = this.y + y;
			time = time || 0;

			this.scrollTo(x, y, time, easing);
		},

		scrollTo: function(x, y, time, easing) {
			easing = easing || utils.ease.circular;

			this.isInTransition = this.options.useTransition && time > 0;

			if (!time || (this.options.useTransition && easing.style)) {
				this._transitionTimingFunction(easing.style);
				this._transitionTime(time);
				this._translate(x, y);
			} else {
				this._animate(x, y, time, easing.fn);
			}
		},

		scrollToElement: function(el, time, offsetX, offsetY, easing) {
			el = el.nodeType ? el : this.scroller.querySelector(el);

			if (!el) {
				return;
			}

			var pos = utils.offset(el);

			pos.left -= this.wrapperOffset.left;
			pos.top -= this.wrapperOffset.top;

			// if offsetX/Y are true we center the element to the screen
			if (offsetX === true) {
				offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
			}
			if (offsetY === true) {
				offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
			}

			pos.left -= offsetX || 0;
			pos.top -= offsetY || 0;

			pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
			pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;

			time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time;

			this.scrollTo(pos.left, pos.top, time, easing);
		},

		_transitionTime: function(time) {
			time = time || 0;

			this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';

			if (!time && utils.isBadAndroid) {
				this.scrollerStyle[utils.style.transitionDuration] = '0.001s';
			}


			if (this.indicators) {
				for (var i = this.indicators.length; i--;) {
					this.indicators[i].transitionTime(time);
				}
			}


			// INSERT POINT: _transitionTime

		},

		_transitionTimingFunction: function(easing) {
			this.scrollerStyle[utils.style.transitionTimingFunction] = easing;


			if (this.indicators) {
				for (var i = this.indicators.length; i--;) {
					this.indicators[i].transitionTimingFunction(easing);
				}
			}


			// INSERT POINT: _transitionTimingFunction

		},

		_translate: function(x, y) {
			if (this.options.useTransform) {

				/* REPLACE START: _translate */

				this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

				/* REPLACE END: _translate */

			} else {
				x = Math.round(x);
				y = Math.round(y);
				this.scrollerStyle.left = x + 'px';
				this.scrollerStyle.top = y + 'px';
			}

			this.x = x;
			this.y = y;


			if (this.indicators) {
				for (var i = this.indicators.length; i--;) {
					this.indicators[i].updatePosition();
				}
			}


			// INSERT POINT: _translate

		},

		_initEvents: function(remove) {
			var eventType = remove ? utils.removeEvent : utils.addEvent,
				target = this.options.bindToWrapper ? this.wrapper : window;

			eventType(window, 'orientationchange', this);
			eventType(window, 'resize', this);

			if (this.options.click) {
				eventType(this.wrapper, 'click', this, true);
			}

			if (!this.options.disableMouse) {
				eventType(this.wrapper, 'mousedown', this);
				eventType(target, 'mousemove', this);
				eventType(target, 'mousecancel', this);
				eventType(target, 'mouseup', this);
			}

			if (utils.hasPointer && !this.options.disablePointer) {
				eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
				eventType(target, utils.prefixPointerEvent('pointermove'), this);
				eventType(target, utils.prefixPointerEvent('pointercancel'), this);
				eventType(target, utils.prefixPointerEvent('pointerup'), this);
			}

			if (utils.hasTouch && !this.options.disableTouch) {
				eventType(this.wrapper, 'touchstart', this);
				eventType(target, 'touchmove', this);
				eventType(target, 'touchcancel', this);
				eventType(target, 'touchend', this);
			}

			eventType(this.scroller, 'transitionend', this);
			eventType(this.scroller, 'webkitTransitionEnd', this);
			eventType(this.scroller, 'oTransitionEnd', this);
			eventType(this.scroller, 'MSTransitionEnd', this);
		},

		getComputedPosition: function() {
			var matrix = window.getComputedStyle(this.scroller, null),
				x, y;

			if (this.options.useTransform) {
				matrix = matrix[utils.style.transform].split(')')[0].split(', ');
				x = +(matrix[12] || matrix[4]);
				y = +(matrix[13] || matrix[5]);
			} else {
				x = +matrix.left.replace(/[^-\d.]/g, '');
				y = +matrix.top.replace(/[^-\d.]/g, '');
			}

			return {
				x: x,
				y: y
			};
		},

		_initIndicators: function() {
			var interactive = this.options.interactiveScrollbars,
				customStyle = typeof this.options.scrollbars != 'string',
				indicators = [],
				indicator;

			var that = this;

			this.indicators = [];

			if (this.options.scrollbars) {
				// Vertical scrollbar
				if (this.options.scrollY) {
					indicator = {
						el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
						interactive: interactive,
						defaultScrollbars: true,
						customStyle: customStyle,
						resize: this.options.resizeScrollbars,
						shrink: this.options.shrinkScrollbars,
						fade: this.options.fadeScrollbars,
						listenX: false
					};

					this.wrapper.appendChild(indicator.el);
					indicators.push(indicator);
				}

				// Horizontal scrollbar
				if (this.options.scrollX) {
					indicator = {
						el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
						interactive: interactive,
						defaultScrollbars: true,
						customStyle: customStyle,
						resize: this.options.resizeScrollbars,
						shrink: this.options.shrinkScrollbars,
						fade: this.options.fadeScrollbars,
						listenY: false
					};

					this.wrapper.appendChild(indicator.el);
					indicators.push(indicator);
				}
			}

			if (this.options.indicators) {
				// TODO: check concat compatibility
				indicators = indicators.concat(this.options.indicators);
			}

			for (var i = indicators.length; i--;) {
				this.indicators.push(new Indicator(this, indicators[i]));
			}

			// TODO: check if we can use array.map (wide compatibility and performance issues)
			function _indicatorsMap(fn) {
				for (var i = that.indicators.length; i--;) {
					fn.call(that.indicators[i]);
				}
			}

			if (this.options.fadeScrollbars) {
				this.on('scrollEnd', function() {
					_indicatorsMap(function() {
						this.fade();
					});
				});

				this.on('scrollCancel', function() {
					_indicatorsMap(function() {
						this.fade();
					});
				});

				this.on('scrollStart', function() {
					_indicatorsMap(function() {
						this.fade(1);
					});
				});

				this.on('beforeScrollStart', function() {
					_indicatorsMap(function() {
						this.fade(1, true);
					});
				});
			}


			this.on('refresh', function() {
				_indicatorsMap(function() {
					this.refresh();
				});
			});

			this.on('destroy', function() {
				_indicatorsMap(function() {
					this.destroy();
				});

				delete this.indicators;
			});
		},

		_initWheel: function() {
			utils.addEvent(this.wrapper, 'wheel', this);
			utils.addEvent(this.wrapper, 'mousewheel', this);
			utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

			this.on('destroy', function() {
				utils.removeEvent(this.wrapper, 'wheel', this);
				utils.removeEvent(this.wrapper, 'mousewheel', this);
				utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
			});
		},

		_wheel: function(e) {
			if (!this.enabled) {
				return;
			}

			e.preventDefault();
			e.stopPropagation();

			var wheelDeltaX, wheelDeltaY,
				newX, newY,
				that = this;

			if (this.wheelTimeout === undefined) {
				that._execEvent('scrollStart');
			}

			// Execute the scrollEnd event after 400ms the wheel stopped scrolling
			clearTimeout(this.wheelTimeout);
			this.wheelTimeout = setTimeout(function() {
				that._execEvent('scrollEnd');
				that.wheelTimeout = undefined;
			}, 400);

			if ('deltaX' in e) {
				if (e.deltaMode === 1) {
					wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
					wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed;
				} else {
					wheelDeltaX = -e.deltaX;
					wheelDeltaY = -e.deltaY;
				}
			} else if ('wheelDeltaX' in e) {
				wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
				wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
			} else if ('wheelDelta' in e) {
				wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
			} else if ('detail' in e) {
				wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
			} else {
				return;
			}

			wheelDeltaX *= this.options.invertWheelDirection;
			wheelDeltaY *= this.options.invertWheelDirection;

			if (!this.hasVerticalScroll) {
				wheelDeltaX = wheelDeltaY;
				wheelDeltaY = 0;
			}

			if (this.options.snap) {
				newX = this.currentPage.pageX;
				newY = this.currentPage.pageY;

				if (wheelDeltaX > 0) {
					newX--;
				} else if (wheelDeltaX < 0) {
					newX++;
				}

				if (wheelDeltaY > 0) {
					newY--;
				} else if (wheelDeltaY < 0) {
					newY++;
				}

				this.goToPage(newX, newY);

				return;
			}

			newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
			newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

			if (newX > 0) {
				newX = 0;
			} else if (newX < this.maxScrollX) {
				newX = this.maxScrollX;
			}

			if (newY > 0) {
				newY = 0;
			} else if (newY < this.maxScrollY) {
				newY = this.maxScrollY;
			}

			this.scrollTo(newX, newY, 0);

			if (this.options.probeType > 1) {
				this._execEvent('scroll');
			}

			// INSERT POINT: _wheel
		},

		_initSnap: function() {
			this.currentPage = {};

			if (typeof this.options.snap == 'string') {
				this.options.snap = this.scroller.querySelectorAll(this.options.snap);
			}

			this.on('refresh', function() {
				var i = 0,
					l,
					m = 0,
					n,
					cx, cy,
					x = 0,
					y,
					stepX = this.options.snapStepX || this.wrapperWidth,
					stepY = this.options.snapStepY || this.wrapperHeight,
					el;

				this.pages = [];

				if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight) {
					return;
				}

				if (this.options.snap === true) {
					cx = Math.round(stepX / 2);
					cy = Math.round(stepY / 2);

					while (x > -this.scrollerWidth) {
						this.pages[i] = [];
						l = 0;
						y = 0;

						while (y > -this.scrollerHeight) {
							this.pages[i][l] = {
								x: Math.max(x, this.maxScrollX),
								y: Math.max(y, this.maxScrollY),
								width: stepX,
								height: stepY,
								cx: x - cx,
								cy: y - cy
							};

							y -= stepY;
							l++;
						}

						x -= stepX;
						i++;
					}
				} else {
					el = this.options.snap;
					l = el.length;
					n = -1;

					for (; i < l; i++) {
						if (i === 0 || el[i].offsetLeft <= el[i - 1].offsetLeft) {
							m = 0;
							n++;
						}

						if (!this.pages[m]) {
							this.pages[m] = [];
						}

						x = Math.max(-el[i].offsetLeft, this.maxScrollX);
						y = Math.max(-el[i].offsetTop, this.maxScrollY);
						cx = x - Math.round(el[i].offsetWidth / 2);
						cy = y - Math.round(el[i].offsetHeight / 2);

						this.pages[m][n] = {
							x: x,
							y: y,
							width: el[i].offsetWidth,
							height: el[i].offsetHeight,
							cx: cx,
							cy: cy
						};

						if (x > this.maxScrollX) {
							m++;
						}
					}
				}

				this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);

				// Update snap threshold if needed
				if (this.options.snapThreshold % 1 === 0) {
					this.snapThresholdX = this.options.snapThreshold;
					this.snapThresholdY = this.options.snapThreshold;
				} else {
					this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
					this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
				}
			});

			this.on('flick', function() {
				var time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(this.x - this.startX), 1000),
						Math.min(Math.abs(this.y - this.startY), 1000)
					), 300);

				this.goToPage(
					this.currentPage.pageX + this.directionX,
					this.currentPage.pageY + this.directionY,
					time
				);
			});
		},

		_nearestSnap: function(x, y) {
			if (!this.pages.length) {
				return {
					x: 0,
					y: 0,
					pageX: 0,
					pageY: 0
				};
			}

			var i = 0,
				l = this.pages.length,
				m = 0;

			// Check if we exceeded the snap threshold
			if (Math.abs(x - this.absStartX) < this.snapThresholdX &&
				Math.abs(y - this.absStartY) < this.snapThresholdY) {
				return this.currentPage;
			}

			if (x > 0) {
				x = 0;
			} else if (x < this.maxScrollX) {
				x = this.maxScrollX;
			}

			if (y > 0) {
				y = 0;
			} else if (y < this.maxScrollY) {
				y = this.maxScrollY;
			}

			for (; i < l; i++) {
				if (x >= this.pages[i][0].cx) {
					x = this.pages[i][0].x;
					break;
				}
			}

			l = this.pages[i].length;

			for (; m < l; m++) {
				if (y >= this.pages[0][m].cy) {
					y = this.pages[0][m].y;
					break;
				}
			}

			if (i == this.currentPage.pageX) {
				i += this.directionX;

				if (i < 0) {
					i = 0;
				} else if (i >= this.pages.length) {
					i = this.pages.length - 1;
				}

				x = this.pages[i][0].x;
			}

			if (m == this.currentPage.pageY) {
				m += this.directionY;

				if (m < 0) {
					m = 0;
				} else if (m >= this.pages[0].length) {
					m = this.pages[0].length - 1;
				}

				y = this.pages[0][m].y;
			}

			return {
				x: x,
				y: y,
				pageX: i,
				pageY: m
			};
		},

		goToPage: function(x, y, time, easing) {
			easing = easing || this.options.bounceEasing;

			if (x >= this.pages.length) {
				x = this.pages.length - 1;
			} else if (x < 0) {
				x = 0;
			}

			if (y >= this.pages[x].length) {
				y = this.pages[x].length - 1;
			} else if (y < 0) {
				y = 0;
			}

			var posX = this.pages[x][y].x,
				posY = this.pages[x][y].y;

			time = time === undefined ? this.options.snapSpeed || Math.max(
				Math.max(
					Math.min(Math.abs(posX - this.x), 1000),
					Math.min(Math.abs(posY - this.y), 1000)
				), 300) : time;

			this.currentPage = {
				x: posX,
				y: posY,
				pageX: x,
				pageY: y
			};

			this.scrollTo(posX, posY, time, easing);
		},

		next: function(time, easing) {
			var x = this.currentPage.pageX,
				y = this.currentPage.pageY;

			x++;

			if (x >= this.pages.length && this.hasVerticalScroll) {
				x = 0;
				y++;
			}

			this.goToPage(x, y, time, easing);
		},

		prev: function(time, easing) {
			var x = this.currentPage.pageX,
				y = this.currentPage.pageY;

			x--;

			if (x < 0 && this.hasVerticalScroll) {
				x = 0;
				y--;
			}

			this.goToPage(x, y, time, easing);
		},

		_initKeys: function(e) {
			// default key bindings
			var keys = {
				pageUp: 33,
				pageDown: 34,
				end: 35,
				home: 36,
				left: 37,
				up: 38,
				right: 39,
				down: 40
			};
			var i;

			// if you give me characters I give you keycode
			if (typeof this.options.keyBindings == 'object') {
				for (i in this.options.keyBindings) {
					if (typeof this.options.keyBindings[i] == 'string') {
						this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
					}
				}
			} else {
				this.options.keyBindings = {};
			}

			for (i in keys) {
				this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
			}

			utils.addEvent(window, 'keydown', this);

			this.on('destroy', function() {
				utils.removeEvent(window, 'keydown', this);
			});
		},

		_key: function(e) {
			if (!this.enabled) {
				return;
			}

			var snap = this.options.snap, // we are using this alot, better to cache it
				newX = snap ? this.currentPage.pageX : this.x,
				newY = snap ? this.currentPage.pageY : this.y,
				now = utils.getTime(),
				prevTime = this.keyTime || 0,
				acceleration = 0.250,
				pos;

			if (this.options.useTransition && this.isInTransition) {
				pos = this.getComputedPosition();

				this._translate(Math.round(pos.x), Math.round(pos.y));
				this.isInTransition = false;
			}

			this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

			switch (e.keyCode) {
				case this.options.keyBindings.pageUp:
					if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
						newX += snap ? 1 : this.wrapperWidth;
					} else {
						newY += snap ? 1 : this.wrapperHeight;
					}
					break;
				case this.options.keyBindings.pageDown:
					if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
						newX -= snap ? 1 : this.wrapperWidth;
					} else {
						newY -= snap ? 1 : this.wrapperHeight;
					}
					break;
				case this.options.keyBindings.end:
					newX = snap ? this.pages.length - 1 : this.maxScrollX;
					newY = snap ? this.pages[0].length - 1 : this.maxScrollY;
					break;
				case this.options.keyBindings.home:
					newX = 0;
					newY = 0;
					break;
				case this.options.keyBindings.left:
					newX += snap ? -1 : 5 + this.keyAcceleration >> 0;
					break;
				case this.options.keyBindings.up:
					newY += snap ? 1 : 5 + this.keyAcceleration >> 0;
					break;
				case this.options.keyBindings.right:
					newX -= snap ? -1 : 5 + this.keyAcceleration >> 0;
					break;
				case this.options.keyBindings.down:
					newY -= snap ? 1 : 5 + this.keyAcceleration >> 0;
					break;
				default:
					return;
			}

			if (snap) {
				this.goToPage(newX, newY);
				return;
			}

			if (newX > 0) {
				newX = 0;
				this.keyAcceleration = 0;
			} else if (newX < this.maxScrollX) {
				newX = this.maxScrollX;
				this.keyAcceleration = 0;
			}

			if (newY > 0) {
				newY = 0;
				this.keyAcceleration = 0;
			} else if (newY < this.maxScrollY) {
				newY = this.maxScrollY;
				this.keyAcceleration = 0;
			}

			this.scrollTo(newX, newY, 0);

			this.keyTime = now;
		},

		_animate: function(destX, destY, duration, easingFn) {
			var that = this,
				startX = this.x,
				startY = this.y,
				startTime = utils.getTime(),
				destTime = startTime + duration;

			function step() {
				var now = utils.getTime(),
					newX, newY,
					easing;

				if (now >= destTime) {
					that.isAnimating = false;
					that._translate(destX, destY);

					if (!that.resetPosition(that.options.bounceTime)) {
						that._execEvent('scrollEnd');
					}

					return;
				}

				now = (now - startTime) / duration;
				easing = easingFn(now);
				newX = (destX - startX) * easing + startX;
				newY = (destY - startY) * easing + startY;
				that._translate(newX, newY);

				if (that.isAnimating) {
					rAF(step);
				}

				if (that.options.probeType == 3) {
					that._execEvent('scroll');
				}
			}

			this.isAnimating = true;
			step();
		},

		handleEvent: function(e) {
			switch (e.type) {
				case 'touchstart':
				case 'pointerdown':
				case 'MSPointerDown':
				case 'mousedown':
					this._start(e);
					break;
				case 'touchmove':
				case 'pointermove':
				case 'MSPointerMove':
				case 'mousemove':
					this._move(e);
					break;
				case 'touchend':
				case 'pointerup':
				case 'MSPointerUp':
				case 'mouseup':
				case 'touchcancel':
				case 'pointercancel':
				case 'MSPointerCancel':
				case 'mousecancel':
					this._end(e);
					break;
				case 'orientationchange':
				case 'resize':
					this._resize();
					break;
				case 'transitionend':
				case 'webkitTransitionEnd':
				case 'oTransitionEnd':
				case 'MSTransitionEnd':
					this._transitionEnd(e);
					break;
				case 'wheel':
				case 'DOMMouseScroll':
				case 'mousewheel':
					this._wheel(e);
					break;
				case 'keydown':
					this._key(e);
					break;
				case 'click':
					if (!e._constructed) {
						e.preventDefault();
						e.stopPropagation();
					}
					break;
			}
		}
	};

	function createDefaultScrollbar(direction, interactive, type) {
		var scrollbar = document.createElement('div'),
			indicator = document.createElement('div');

		if (type === true) {
			scrollbar.style.cssText = 'position:absolute;z-index:9999';
			indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px';
		}

		indicator.className = 'iScrollIndicator';

		if (direction == 'h') {
			if (type === true) {
				scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
				indicator.style.height = '100%';
			}
			scrollbar.className = 'iScrollHorizontalScrollbar';
		} else {
			if (type === true) {
				scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
				indicator.style.width = '100%';
			}
			scrollbar.className = 'iScrollVerticalScrollbar';
		}

		scrollbar.style.cssText += ';overflow:hidden';

		if (!interactive) {
			scrollbar.style.pointerEvents = 'none';
		}

		scrollbar.appendChild(indicator);

		return scrollbar;
	}

	function Indicator(scroller, options) {
		this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
		this.wrapperStyle = this.wrapper.style;
		this.indicator = this.wrapper.children[0];
		this.indicatorStyle = this.indicator.style;
		this.scroller = scroller;

		this.options = {
			listenX: true,
			listenY: true,
			interactive: false,
			resize: true,
			defaultScrollbars: false,
			shrink: false,
			fade: false,
			speedRatioX: 0,
			speedRatioY: 0
		};

		for (var i in options) {
			this.options[i] = options[i];
		}

		this.sizeRatioX = 1;
		this.sizeRatioY = 1;
		this.maxPosX = 0;
		this.maxPosY = 0;

		if (this.options.interactive) {
			if (!this.options.disableTouch) {
				utils.addEvent(this.indicator, 'touchstart', this);
				utils.addEvent(window, 'touchend', this);
			}
			if (!this.options.disablePointer) {
				utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
				utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
			}
			if (!this.options.disableMouse) {
				utils.addEvent(this.indicator, 'mousedown', this);
				utils.addEvent(window, 'mouseup', this);
			}
		}

		if (this.options.fade) {
			this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
			this.wrapperStyle[utils.style.transitionDuration] = utils.isBadAndroid ? '0.001s' : '0ms';
			this.wrapperStyle.opacity = '0';
		}
	}

	Indicator.prototype = {
		handleEvent: function(e) {
			switch (e.type) {
				case 'touchstart':
				case 'pointerdown':
				case 'MSPointerDown':
				case 'mousedown':
					this._start(e);
					break;
				case 'touchmove':
				case 'pointermove':
				case 'MSPointerMove':
				case 'mousemove':
					this._move(e);
					break;
				case 'touchend':
				case 'pointerup':
				case 'MSPointerUp':
				case 'mouseup':
				case 'touchcancel':
				case 'pointercancel':
				case 'MSPointerCancel':
				case 'mousecancel':
					this._end(e);
					break;
			}
		},

		destroy: function() {
			if (this.options.interactive) {
				utils.removeEvent(this.indicator, 'touchstart', this);
				utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
				utils.removeEvent(this.indicator, 'mousedown', this);

				utils.removeEvent(window, 'touchmove', this);
				utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
				utils.removeEvent(window, 'mousemove', this);

				utils.removeEvent(window, 'touchend', this);
				utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
				utils.removeEvent(window, 'mouseup', this);
			}

			if (this.options.defaultScrollbars) {
				this.wrapper.parentNode.removeChild(this.wrapper);
			}
		},

		_start: function(e) {
			var point = e.touches ? e.touches[0] : e;

			e.preventDefault();
			e.stopPropagation();

			this.transitionTime();

			this.initiated = true;
			this.moved = false;
			this.lastPointX = point.pageX;
			this.lastPointY = point.pageY;

			this.startTime = utils.getTime();

			if (!this.options.disableTouch) {
				utils.addEvent(window, 'touchmove', this);
			}
			if (!this.options.disablePointer) {
				utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
			}
			if (!this.options.disableMouse) {
				utils.addEvent(window, 'mousemove', this);
			}

			this.scroller._execEvent('beforeScrollStart');
		},

		_move: function(e) {
			var point = e.touches ? e.touches[0] : e,
				deltaX, deltaY,
				newX, newY,
				timestamp = utils.getTime();

			if (!this.moved) {
				this.scroller._execEvent('scrollStart');
			}

			this.moved = true;

			deltaX = point.pageX - this.lastPointX;
			this.lastPointX = point.pageX;

			deltaY = point.pageY - this.lastPointY;
			this.lastPointY = point.pageY;

			newX = this.x + deltaX;
			newY = this.y + deltaY;

			this._pos(newX, newY);


			if (this.scroller.options.probeType == 1 && timestamp - this.startTime > 300) {
				this.startTime = timestamp;
				this.scroller._execEvent('scroll');
			} else if (this.scroller.options.probeType > 1) {
				this.scroller._execEvent('scroll');
			}


			// INSERT POINT: indicator._move

			e.preventDefault();
			e.stopPropagation();
		},

		_end: function(e) {
			if (!this.initiated) {
				return;
			}

			this.initiated = false;

			e.preventDefault();
			e.stopPropagation();

			utils.removeEvent(window, 'touchmove', this);
			utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
			utils.removeEvent(window, 'mousemove', this);

			if (this.scroller.options.snap) {
				var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

				var time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(this.scroller.x - snap.x), 1000),
						Math.min(Math.abs(this.scroller.y - snap.y), 1000)
					), 300);

				if (this.scroller.x != snap.x || this.scroller.y != snap.y) {
					this.scroller.directionX = 0;
					this.scroller.directionY = 0;
					this.scroller.currentPage = snap;
					this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
				}
			}

			if (this.moved) {
				this.scroller._execEvent('scrollEnd');
			}
		},

		transitionTime: function(time) {
			time = time || 0;
			this.indicatorStyle[utils.style.transitionDuration] = time + 'ms';

			if (!time && utils.isBadAndroid) {
				this.indicatorStyle[utils.style.transitionDuration] = '0.001s';
			}
		},

		transitionTimingFunction: function(easing) {
			this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
		},

		refresh: function() {
			this.transitionTime();

			if (this.options.listenX && !this.options.listenY) {
				this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
			} else if (this.options.listenY && !this.options.listenX) {
				this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
			} else {
				this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
			}

			if (this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll) {
				utils.addClass(this.wrapper, 'iScrollBothScrollbars');
				utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

				if (this.options.defaultScrollbars && this.options.customStyle) {
					if (this.options.listenX) {
						this.wrapper.style.right = '8px';
					} else {
						this.wrapper.style.bottom = '8px';
					}
				}
			} else {
				utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
				utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

				if (this.options.defaultScrollbars && this.options.customStyle) {
					if (this.options.listenX) {
						this.wrapper.style.right = '2px';
					} else {
						this.wrapper.style.bottom = '2px';
					}
				}
			}

			var r = this.wrapper.offsetHeight; // force refresh

			if (this.options.listenX) {
				this.wrapperWidth = this.wrapper.clientWidth;
				if (this.options.resize) {
					this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
					this.indicatorStyle.width = this.indicatorWidth + 'px';
				} else {
					this.indicatorWidth = this.indicator.clientWidth;
				}

				this.maxPosX = this.wrapperWidth - this.indicatorWidth;

				if (this.options.shrink == 'clip') {
					this.minBoundaryX = -this.indicatorWidth + 8;
					this.maxBoundaryX = this.wrapperWidth - 8;
				} else {
					this.minBoundaryX = 0;
					this.maxBoundaryX = this.maxPosX;
				}

				this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));
			}

			if (this.options.listenY) {
				this.wrapperHeight = this.wrapper.clientHeight;
				if (this.options.resize) {
					this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
					this.indicatorStyle.height = this.indicatorHeight + 'px';
				} else {
					this.indicatorHeight = this.indicator.clientHeight;
				}

				this.maxPosY = this.wrapperHeight - this.indicatorHeight;

				if (this.options.shrink == 'clip') {
					this.minBoundaryY = -this.indicatorHeight + 8;
					this.maxBoundaryY = this.wrapperHeight - 8;
				} else {
					this.minBoundaryY = 0;
					this.maxBoundaryY = this.maxPosY;
				}

				this.maxPosY = this.wrapperHeight - this.indicatorHeight;
				this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
			}

			this.updatePosition();
		},

		updatePosition: function() {
			var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
				y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

			if (!this.options.ignoreBoundaries) {
				if (x < this.minBoundaryX) {
					if (this.options.shrink == 'scale') {
						this.width = Math.max(this.indicatorWidth + x, 8);
						this.indicatorStyle.width = this.width + 'px';
					}
					x = this.minBoundaryX;
				} else if (x > this.maxBoundaryX) {
					if (this.options.shrink == 'scale') {
						this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
						this.indicatorStyle.width = this.width + 'px';
						x = this.maxPosX + this.indicatorWidth - this.width;
					} else {
						x = this.maxBoundaryX;
					}
				} else if (this.options.shrink == 'scale' && this.width != this.indicatorWidth) {
					this.width = this.indicatorWidth;
					this.indicatorStyle.width = this.width + 'px';
				}

				if (y < this.minBoundaryY) {
					if (this.options.shrink == 'scale') {
						this.height = Math.max(this.indicatorHeight + y * 3, 8);
						this.indicatorStyle.height = this.height + 'px';
					}
					y = this.minBoundaryY;
				} else if (y > this.maxBoundaryY) {
					if (this.options.shrink == 'scale') {
						this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
						this.indicatorStyle.height = this.height + 'px';
						y = this.maxPosY + this.indicatorHeight - this.height;
					} else {
						y = this.maxBoundaryY;
					}
				} else if (this.options.shrink == 'scale' && this.height != this.indicatorHeight) {
					this.height = this.indicatorHeight;
					this.indicatorStyle.height = this.height + 'px';
				}
			}

			this.x = x;
			this.y = y;

			if (this.scroller.options.useTransform) {
				this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
			} else {
				this.indicatorStyle.left = x + 'px';
				this.indicatorStyle.top = y + 'px';
			}
		},

		_pos: function(x, y) {
			if (x < 0) {
				x = 0;
			} else if (x > this.maxPosX) {
				x = this.maxPosX;
			}

			if (y < 0) {
				y = 0;
			} else if (y > this.maxPosY) {
				y = this.maxPosY;
			}

			x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
			y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;

			this.scroller.scrollTo(x, y);
		},

		fade: function(val, hold) {
			if (hold && !this.visible) {
				return;
			}

			clearTimeout(this.fadeTimeout);
			this.fadeTimeout = null;

			var time = val ? 250 : 500,
				delay = val ? 0 : 300;

			val = val ? '1' : '0';

			this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';

			this.fadeTimeout = setTimeout((function(val) {
				this.wrapperStyle.opacity = val;
				this.visible = +val;
			}).bind(this, val), delay);
		}
	};

	IScroll.utils = utils;

	if (typeof module != 'undefined' && module.exports) {
		module.exports = IScroll;
	} else {
		window.IScroll = IScroll;
	}

})(window, document, Math);
/*===============================================================================
************   zepto extend   ************
===============================================================================*/
;
(function($) {
    var isTouch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch)
    var unique = function(arr) {
        var unique = [];
        for (var i = 0; i < arr.length; i++) {
            if (unique.indexOf(arr[i]) === -1) unique.push(arr[i]);
        }
        return unique;
    };
    // Transforms
    $.fn.transform = function(transform) {
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
        }
        return this;
    };
    $.fn.transition = function(duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
        }
        return this;
    };
    $.fn.transitionEnd = function(callback) {
        var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
            i, j, dom = this;

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
        return this;
    };
    $.fn.animationEnd = function(callback) {
        var events = ['webkitAnimationEnd', 'OAnimationEnd', 'MSAnimationEnd', 'animationend'],
            i, j, dom = this;

        function fireCallBack(e) {
            callback(e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
        return this;
    }
    $.fn.outerWidth = function(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                var styles = this.styles();
                return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
            } else
                return this[0].offsetWidth;
        } else return null;
    }
    $.fn.outerHeight = function(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                var styles = this.styles();
                return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
            } else
                return this[0].offsetHeight;
        } else return null;
    }

    $.fn.is = function(selector) {
        if (!this[0] || typeof selector === 'undefined') return false;
        var compareWith, i;
        if (typeof selector === 'string') {
            var el = this[0];
            if (el === document) return selector === document;
            if (el === window) return selector === window;

            if (el.matches) return el.matches(selector);
            else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
            else if (el.mozMatchesSelector) return el.mozMatchesSelector(selector);
            else if (el.msMatchesSelector) return el.msMatchesSelector(selector);
            else {
                compareWith = $(selector);
                for (i = 0; i < compareWith.length; i++) {
                    if (compareWith[i] === this[0]) return true;
                }
                return false;
            }
        } else if (selector === document) return this[0] === document;
        else if (selector === window) return this[0] === window;
        else {
            if (selector.nodeType || selector instanceof Zepto) {
                compareWith = selector.nodeType ? [selector] : selector;
                for (i = 0; i < compareWith.length; i++) {
                    if (compareWith[i] === this[0]) return true;
                }
                return false;
            }
            return false;
        }

    }

    $.fn.button = function(callback) {

        var self = this;
        self.on(isTouch ? "tap" : "click", function(evt) {
            var ele = evt.currentTarget;
            if ($.isFunction(callback)) {
                callback.apply(self, [ele, evt]);
            }
        });
        return self;
    };


    ['checkbox', 'radio'].forEach(function(eventName) {
        $.fn[eventName] = function(callback) {
            var self = this;
            var els = eventName == 'checkbox' ? self.find('input[type=checkbox]') : self.find('input[type=radio]');
            els.on('change', function(evt) {
                var ele = evt.currentTarget;
                if ($.isFunction(callback)) {
                    callback.apply(self, [ele, evt]);
                }
            });
            return self;
        }
    });

    $.fn.select = function(callback) {
        var self = this;
        self.find('select').on("change", function(evt) {
            var sel = evt.currentTarget;
            if ($.isFunction(callback)) {
                callback.apply(self, [sel.options[sel.selectedIndex], evt]);
            }
        });
        return self;
    };

    $.fn.children = function(selector) {
        var children = [];
        for (var i = 0; i < this.length; i++) {
            var childNodes = this[i].childNodes;

            for (var j = 0; j < childNodes.length; j++) {
                var node = childNodes[j];
                if (!selector) {
                    if (node.nodeType === 1 && node.nodeName.toUpperCase() !== 'SCRIPT') children.push(childNodes[j]);
                } else {
                    if (node.nodeType === 1 && node.nodeName.toUpperCase() !== 'SCRIPT' && $(node).is(selector)) children.push(node);
                }
            }
        }
        return $(unique(children));
    }
}($));
/*===============================================================================
************   $ extend   ************
===============================================================================*/
;
(function($) {
    $.animationFrame = function(cb) {
        var args, isQueued, context;
        return function() {
            args = arguments;
            context = this;
            if (!isQueued) {
                isQueued = true;
                requestAnimationFrame(function() {
                    cb.apply(context, args);
                    isQueued = false;
                });
            }
        };
    };

    $.trimLeft = function(str) {
        return str == null ? "" : String.prototype.trimLeft.call(str)
    };
    $.trimRight = function(str) {
        return str == null ? "" : String.prototype.trimRight.call(str)
    };
    $.trimAll = function(str) {
        return str == null ? "" : str.replace(/\s*/g, '');
    };
    $.cellPhone = function(v) {
        var cellphone = /^1[3|4|5|8][0-9]\d{8}$/;
        return cellphone.test(v);
    };
    $.email = function(v) {
        var email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i;
        return email.test(v);
    };
    //全数字
    $.isDigit = function(v) {
        var patrn = /^[0-9]{1,20}$/;
        return patrn.test(v);
    };

    //校验登录名：只能输入5-20个以字母开头、可带数字、“_”、“.”的字串 
    $.isRegisterUserName = function(v) {
        var patrn = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/;
        return patrn.test(v);
    };

    //校验密码：只能输入6-20个字母、数字、下划线   
    $.registerPasswd = function(v) {
        var patrn = /^(\w){6,20}$/;
        return patrn.test(v);
    };
    // 至少一个小写字母
    $.charOne = function(v) {
        var patrn = /[a-z]/;
        return patrn.test(v);
    };
    // 至少一个大写字母
    $.upperCharOne = function(v) {
        var patrn = /[A-Z]/;
        return patrn.test(v);
    };

    $.idcard = function(num) {
        num = num.toUpperCase();
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
            //            alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。 ');
            return false;
        }
        // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        // 下面分别分析出生日期和校验位
        var len, re;
        len = num.length;
        if (len == 15) {
            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            var arrSplit = num.match(re); // 检查生日日期是否正确
            var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
                //                alert('输入的身份证号里出生日期不对！');
                return false;
            } else { // 将15位身份证转成18位 //校验位按照ISO 7064:1983.MOD
                // 11-2的规定生成，X可以认为是数字10。
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0,
                    i;
                num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                num += arrCh[nTemp % 11];
                return true;
            }
        }
        if (len == 18) {
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
            var arrSplit = num.match(re); // 检查生日日期是否正确
            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
                //                alert('输入的身份证号里出生日期不对！');
                return false;
            } else { // 检验18位身份证的校验码是否正确。 //校验位按照ISO 7064:1983.MOD
                // 11-2的规定生成，X可以认为是数字10。
                var valnum;
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0,
                    i;
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                valnum = arrCh[nTemp % 11];
                if (valnum != num.substr(17, 1)) {
                    //                    alert('18位身份证的校验码不正确！应该为：' + valnum);
                    return false;
                }
                return true;
            }
        }

        return false;
    };
    //获取字符串的字节长度
    $.getBytesLength = function(str) {
        if (!str) {
            return 0;
        }
        var totalLength = 0;
        var charCode;
        var len = str.length
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode < 0x007f) {
                totalLength++;
            } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
                totalLength += 2;
            } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
                totalLength += 3;
            } else {
                totalLength += 4;
            }
        }
        return totalLength;
    };

    $.chk = function(obj) {
        return !!((obj && obj !== 'null' && obj !== 'undefined') || obj === 0);
    };

}($));
/*===============================================================================
************   $ extend end  ************
************   $ dateFormat begin  ************
===============================================================================*/

(function($) {
    /**
     * dataFormat工具类接口
     */
    // 下面是日期的format的格式转换的规则
    /*
    Full Form和Short Form之间可以实现笛卡尔积式的搭配

     Field        | Full Form          | Short Form                            中文日期，所有Full Form 不处理(除了年)
     -------------+--------------------+-----------------------
     Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)      NNNN  NN  N
     Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)      Y
                  | NNN (abbr.)        |
     Day of Month | dd (2 digits)      | d (1 or 2 digits)                     R
     Day of Week  | EE (name)          | E (abbr)
     Hour (1-12)  | hh (2 digits)      | h (1 or 2 digits)                     S
     Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)                     T
     Hour (0-11)  | KK (2 digits)      | K (1 or 2 digits)                     U
     Hour (1-24)  | kk (2 digits)      | k (1 or 2 digits)                     V
     Minute       | mm (2 digits)      | m (1 or 2 digits)                     F
     Second       | ss (2 digits)      | s (1 or 2 digits)                     W
     AM/PM        | a                  |

     */
    //
    //例子
    //dataFormat.formatDateToString(new Date(),"yyyymmdd");//
    //dataFormat.formatStringToDate("1992_09_22","yyyy_mm_dd");
    //dataFormat.formatStringToString("1992_09_22","yyyy_mm_dd","yy______mmdd");
    //dataFormat.compareDates("1992_09_22","yyyy_mm_dd","1992_09_23","yyyy_mm_dd");//返回false
    //dataFormat.isDate("1992_09_________22","yyyy_mm_________dd");//返回true
    //
    var dataFormat = {
        MONTH_NAMES: new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ),
        DAY_NAMES: new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
            'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
        ),
        //    chi : [ '一', '二', '三', '四', '五', '六', '七', '八', '九','十'],
        toChi: function(year) { //转换中文，不进位   //todo 需要优化为一条正则表达式
            return year.replace(/0/g, '零').replace(/1/g, '一').
            replace(/2/g, '二').replace(/3/g, '三').replace(/4/g, '四')
                .replace(/5/g, '五').replace(/6/g, '六').replace(/7/g, '七')
                .replace(/8/g, '八').replace(/9/g, '九');
        },

        toChiNum: function(n) { //转换中文，进位,只支持到十位数
            var num = n / 1;
            var num_s = num + '';
            if (num > 9 && num < 20) {
                num_s = '十' + num_s.charAt(1);
            } else if (num > 19) {
                num_s = num_s.charAt(0) + '十' + num_s.charAt(1);
            }
            num_s = this.toChi(num_s);
            if (num != 0) num_s = num_s.replace(/零/g, '');
            return num_s;
        },
        toNum: function(year) { //中文转换阿拉伯数字，纯替换  //todo 需要优化为一条正则表达式
            return year.replace(/零/g, '0').replace(/一/g, '1').
            replace(/二/g, '2').replace(/三/g, '3').replace(/四/g, '4')
                .replace(/五/g, '5').replace(/六/g, '6').replace(/七/g, '7')
                .replace(/八/g, '8').replace(/九/g, '9');
        },
        toNum2: function(year) { //中文转换阿拉伯数字，带进位，支持2位数 //todo 需要优化为一条正则表达式
            var l = year.length;
            if (year == '十') return 10;
            if (l == 1 && '十' != year) return this.toNum(year); //零 到 九
            if (l == 2 && '十' != year.charAt(l - 1)) return this.toNum(year.replace(/十/g, '一')); //十一 到 十九
            if (l == 2 && '十' == year.charAt(l - 1)) return this.toNum(year.replace(/十/g, '零')); //二十 到 九十 的整数
            if (l == 3) return this.toNum(year.replace(/十/g, '')); //二十一 到 九十九 的三位中文数字
        },

        LZ: function(x) {
            return (x < 0 || x > 9 ? "" : "0") + x;
        },
        isDate: function(val, format) { //看看给定的字符串是否为Date类型
            var date = this.formatStringToDate(val, format);
            if (date == 0) {
                return false;
            }
            return true;
        },
        compareDates: function(date1, dateformat1, date2, dateformat2) { //比较大小
            var d1 = this.formatStringToDate(date1, dateformat1);
            var d2 = this.formatStringToDate(date2, dateformat2);
            if (d1 == 0 || d2 == 0) {
                alert("format格式转换有问题");
                return;
            } else if (d1 > d2) {
                return true;
            }
            return false;
        },
        formatDateToString: function(date, format) { //将日期转化为Str
            //赋值
            format = format + "";
            var result = ""; //返回的结果字符串
            var i_format = 0; //format字符串的位置指针
            var c = "";
            var token = ""; //format字符串中的子串
            var y = date.getFullYear() + "";
            var M = date.getMonth() + 1;
            var d = date.getDate();
            var E = date.getDay();
            var H = date.getHours();
            var m = date.getMinutes();
            var s = date.getSeconds();
            var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;

            //将所有的规则的key加入到value对象的key中,将传入的date取出来的值加入到value对象的value中
            var value = new Object();
            value["y"] = "" + y;
            value["yyyy"] = y;
            value["yy"] = y.substring(2, 4);

            value["M"] = M;
            value["MM"] = this.LZ(M);
            value["MMM"] = this.MONTH_NAMES[M - 1];
            value["NNN"] = this.MONTH_NAMES[M + 11];

            value["d"] = d;
            value["dd"] = this.LZ(d);
            value["E"] = this.DAY_NAMES[E + 7];
            value["EE"] = this.DAY_NAMES[E];

            value["H"] = H;
            value["HH"] = this.LZ(H);
            if (H == 0) {
                value["h"] = 12;
            } else if (H > 12) {
                value["h"] = H - 12;
            } else {
                value["h"] = H;
            }
            value["hh"] = this.LZ(value["h"]);
            if (H > 11) {
                value["K"] = H - 12;
            } else {
                value["K"] = H;
            }
            value["k"] = H + 1;
            value["KK"] = this.LZ(value["K"]);
            value["kk"] = this.LZ(value["k"]);

            if (H > 11) {
                value["a"] = "PM";
            } else {
                value["a"] = "AM";
            }

            value["m"] = m;
            value["mm"] = this.LZ(m);

            value["s"] = s;
            value["ss"] = this.LZ(s);

            value["NNNN"] = this.toChi(value["yyyy"]);
            value["NN"] = this.toChi(value["yy"]);
            value["N"] = this.toChi(value["y"]);
            value["Y"] = this.toChiNum(M);
            value["R"] = this.toChiNum(d);
            value["S"] = this.toChiNum(value["h"]);
            value["T"] = this.toChiNum(value["H"]);
            value["U"] = this.toChiNum(value["K"]);
            value["V"] = this.toChiNum(value["k"]);
            value["F"] = this.toChiNum(m);
            value["W"] = this.toChiNum(s);


            //开始进行校验
            while (i_format < format.length) { //以i_format为记录解析format的指针,进行遍历
                c = format.charAt(i_format);
                token = "";
                while ((format.charAt(i_format) == c) && (i_format < format.length)) { //当进行遍历的字符相同的时候,token取的就是当前遍历的相同字符,例如yyyy mm dd,这里就是三个循环yyyy mm dd
                    token += format.charAt(i_format++);
                }
                if (value[token] != null) {
                    result = result + value[token]; //循环叠加value
                } else {
                    result = result + token;
                }
            }
            return result; //最后返回格式化的字符串
        },
        _isInteger: function(val) {
            //return ['0','1','2','3','4','5','6','7','8','9'].contains(val);
            var digits = "1234567890";
            for (var i = 0; i < val.length; i++) {
                if (digits.indexOf(val.charAt(i)) == -1) {
                    return false;
                }
            }
            return true;
        },
        _isInteger_chi: function(val) {
            //return ['0','1','2','3','4','5','6','7','8','9'].contains(val);
            var digits = "零一二三四五六七八九十";
            for (var i = 0; i < val.length; i++) {
                if (digits.indexOf(val.charAt(i)) == -1) {
                    return false;
                }
            }
            return true;
        },
        _getInt: function(str, i, minlength, maxlength) {
            for (var x = maxlength; x >= minlength; x--) {
                var token = str.substring(i, i + x);
                if (token.length < minlength) {
                    return null;
                }
                if (this._isInteger(token)) {
                    return token;
                }
            }
            return null;
        },
        _getInt2: function(str, i, minlength, maxlength) {
            for (var x = maxlength; x >= minlength; x--) {
                var token = str.substring(i, i + x);
                if (token.length < minlength) {
                    return null;
                }
                if (token) {
                    return token;
                }
            }
            return null;
        },

        _getInt_month: function(str, i) {
            for (var x = 2; x >= 1; x--) {
                var token = str.substring(i, i + x);
                if (token.length < 1) {
                    return null;
                }
                if (token.length == 1) {
                    return token;
                }
                if (['十一', '十二'].contains(token)) {
                    return token;
                }
            }
            return null;
        },

        _getInt_date: function(str, i) {
            for (var x = 3; x >= 1; x--) {
                var token = str.substring(i, i + x);
                if (token.length < 1) {
                    return null;
                }
                if (token.length == 1) return token;
                if (this._isInteger_chi(token)) return token;
            }
            return null;
        },
        formatStringToDate: function(val, format) { //将字符串转化为Date
            //赋值
            val = val + "";
            format = format + "";
            var i_val = 0; //val字符串的指针
            var i_format = 0; //format字符串的指针
            var c = "";
            var token = "";
            var token2 = "";
            var x, y;
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var date = 1;
            var hh = now.getHours();
            var mm = now.getMinutes();
            var ss = now.getSeconds();
            var ampm = "";

            while (i_format < format.length) {
                //根据类似yyyy,mm同名的字符串的规则,可以取得yyyy或者mm等format字符串
                c = format.charAt(i_format);
                token = "";
                while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                    token += format.charAt(i_format++);
                }
                //从val中通过format中的token解析,进行规则转换
                if (token == "NNNN" || token == "NN" || token == "N") { //年 中文
                    if (token == "NNNN") {
                        x = 4;
                        y = 4;
                    }
                    if (token == "NN") {
                        x = 2;
                        y = 2;
                    }
                    if (token == "N") {
                        x = 2;
                        y = 4;
                    }
                    year = this._getInt2(val, i_val, x, y); //从val字符串中根据val的指针i_val,定义的最小/大长度(如上面的y,它所允许的最大长度就是4,最小长度就是2,例如2009,09等)
                    if (year == null) {
                        return 0;
                    }
                    year = this.toNum(year);
                    i_val += year.length; //修改val的指针i_val,使其指向当前的变量
                    if (year.length == 2) { //年输入两位数的作用
                        if (year > 70) {
                            year = 1900 + (year - 0); //如果>70年的话,肯定不是现在了,加1900就行了
                        } else {
                            year = 2000 + (year - 0);
                        }
                    }
                } else if (token == "Y") { //月_数字_大写

                    month = this._getInt_month(val, i_val);
                    i_val += month.length;
                    month = this.toNum2(month);
                    if (month == null || (month < 1) || (month > 12)) {
                        return 0;
                    }

                } else if (token == "R") { //日 数字 中文

                    date = this._getInt_date(val, i_val);
                    i_val += date.length;
                    date = this.toNum2(date);
                    if (date == null || (date < 1) || (date > 31)) {
                        return 0;
                    }

                } else if (token == "S") { //小时 数字 中文 h
                    hh = this._getInt_date(val, i_val);
                    i_val += hh.length;
                    hh = this.toNum2(hh);
                    if (hh == null || (hh < 1) || (hh > 12)) {
                        return 0;
                    }
                } else if (token == "T") { //小时 数字 中文  H
                    hh = this._getInt_date(val, i_val);
                    i_val += hh.length;
                    hh = this.toNum2(hh);
                    if (hh == null || (hh < 0) || (hh > 23)) {
                        return 0;
                    }
                } else if (token == "U") { //小时 数字 中文 K
                    hh = this._getInt_date(val, i_val);
                    i_val += hh.length;
                    hh = this.toNum2(hh);
                    if (hh == null || (hh < 0) || (hh > 11)) {
                        return 0;
                    }
                } else if (token == "V") { //小时 数字 中文 k
                    hh = this._getInt_date(val, i_val);
                    i_val += hh.length;
                    hh = this.toNum2(hh);
                    hh--;
                    if (hh == null || (hh < 1) || (hh > 24)) {
                        return 0;
                    }
                } else if (token == "F") { //分 数字 中文
                    mm = this._getInt_date(val, i_val);
                    i_val += mm.length;
                    mm = this.toNum2(mm);
                    if (mm == null || (mm < 0) || (mm > 59)) {
                        return 0;
                    }
                } else if (token == "W") { //秒 数字 中文
                    ss = this._getInt_date(val, i_val);
                    i_val += ss.length;
                    ss = this.toNum2(ss);
                    if (ss == null || (ss < 0) || (ss > 59)) {
                        return 0;
                    }
                } else if (token == "yyyy" || token == "yy" || token == "y") { //年
                    if (token == "yyyy") {
                        x = 4;
                        y = 4;
                    }
                    if (token == "yy") {
                        x = 2;
                        y = 2;
                    }
                    if (token == "y") {
                        x = 2;
                        y = 4;
                    }
                    year = this._getInt(val, i_val, x, y); //从val字符串中根据val的指针i_val,定义的最小/大长度(如上面的y,它所允许的最大长度就是4,最小长度就是2,例如2009,09等)
                    if (year == null) {
                        return 0;
                    }
                    i_val += year.length; //修改val的指针i_val,使其指向当前的变量
                    if (year.length == 2) { //年输入两位数的作用
                        if (year > 70) {
                            year = 1900 + (year - 0); //如果>70年的话,肯定不是现在了,加1900就行了
                        } else {
                            year = 2000 + (year - 0);
                        }
                    }
                } else if (token == "MMM" || token == "NNN") { //月_name
                    month = 0;
                    for (var i = 0; i < this.MONTH_NAMES.length; i++) {
                        var month_name = this.MONTH_NAMES[i];
                        if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) { //如果指针指向的长度与this.MONTH_NAMES中的任何一项都相同
                            if (token == "MMM" || (token == "NNN" && i > 11)) {
                                month = i + 1; //将month转换为数字,+1是js中的month比实际的小1
                                if (month > 12) {
                                    month -= 12;
                                }
                                i_val += month_name.length;
                                break;
                            }
                        }
                    }
                    if ((month < 1) || (month > 12)) {
                        return 0;
                    } //不符合规则返回0
                } else if (token == "EE" || token == "E") { //日
                    for (var i = 0; i < this.DAY_NAMES.length; i++) {
                        var day_name = this.DAY_NAMES[i];
                        if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                            i_val += day_name.length;
                            break;
                        }
                    }
                } else if (token == "MM" || token == "M") { //月_数字
                    month = this._getInt(val, i_val, token.length, 2);
                    if (month == null || (month < 1) || (month > 12)) {
                        return 0;
                    }
                    i_val += month.length;
                } else if (token == "dd" || token == "d") {
                    date = this._getInt(val, i_val, token.length, 2);
                    if (date == null || (date < 1) || (date > 31)) {
                        return 0;
                    }
                    i_val += date.length;
                } else if (token == "hh" || token == "h") {
                    hh = this._getInt(val, i_val, token.length, 2);
                    if (hh == null || (hh < 1) || (hh > 12)) {
                        return 0;
                    }
                    i_val += hh.length;
                } else if (token == "HH" || token == "H") {
                    hh = this._getInt(val, i_val, token.length, 2);
                    if (hh == null || (hh < 0) || (hh > 23)) {
                        return 0;
                    }
                    i_val += hh.length;
                } else if (token == "KK" || token == "K") {
                    hh = this._getInt(val, i_val, token.length, 2);
                    if (hh == null || (hh < 0) || (hh > 11)) {
                        return 0;
                    }
                    i_val += hh.length;
                } else if (token == "kk" || token == "k") {
                    hh = this._getInt(val, i_val, token.length, 2);
                    if (hh == null || (hh < 1) || (hh > 24)) {
                        return 0;
                    }
                    i_val += hh.length;
                    hh--;
                } else if (token == "mm" || token == "m") {
                    mm = this._getInt(val, i_val, token.length, 2);
                    if (mm == null || (mm < 0) || (mm > 59)) {
                        return 0;
                    }
                    i_val += mm.length;
                } else if (token == "ss" || token == "s") {
                    ss = this._getInt(val, i_val, token.length, 2);
                    if (ss == null || (ss < 0) || (ss > 59)) {
                        return 0;
                    }
                    i_val += ss.length;
                } else if (token == "a") { //上午下午
                    if (val.substring(i_val, i_val + 2).toLowerCase() == "am") {
                        ampm = "AM";
                    } else if (val.substring(i_val, i_val + 2).toLowerCase() == "pm") {
                        ampm = "PM";
                    } else {
                        return 0;
                    }
                    i_val += 2;
                } else { //最后,没有提供关键字的,将指针继续往下移
                    if (val.substring(i_val, i_val + token.length) != token) {
                        return 0;
                    } else {
                        i_val += token.length;
                    }
                }
            }
            //如果有其他的尾随字符导致字符串解析不下去了,那么返回0
            /*if (i_val != val.length) { return 0; }*/ //todo此处有问题
            //对于特殊月份:2月,偶数月的天数进行校验
            if (month == 2) {
                if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) { //测试是否是闰年
                    if (date > 29) {
                        return 0;
                    }
                } else {
                    if (date > 28) {
                        return 0;
                    }
                }
            }
            if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
                if (date > 30) {
                    return 0;
                }
            }
            //对于上午下午的具体显示小时数,进行加减
            if (hh < 12 && ampm == "PM") {
                hh = hh - 0 + 12;
            } else if (hh > 11 && ampm == "AM") {
                hh -= 12;
            }

            //将给定的字符串解析成Data
            var newdate = new Date(year, month - 1, date, hh, mm, ss);
            return newdate;
        },
        formatStringToString: function(val, format1, format2) { //将一个字符串从原来的format1的字符串格式输出到format2字符格式
            var tempDate = this.formatStringToDate(val, format1);
            if (tempDate == 0) {
                return val;
            }
            var returnVal = this.formatDateToString(tempDate, format2);
            if (returnVal == 0) {
                return val;
            }
            return returnVal;
        }

    };

    $.formatStringToDate = function(val) { //将字符串转化为Date
        // return dataFormat.formatStringToDate(val, format);
        function getDate(strDate) {
            var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
                function(a) {
                    return parseInt(a, 10) - 1;
                }).match(/\d+/g) + ')');
            return date;
        }
        return getDate(val);
    };
    $.formatDateToString = function(date, format) { //将日期转化为Str
        !format && (format = 'yyyy-MM-dd HH:mm:ss');
        return dataFormat.formatDateToString(date, format);
    };

    $.getDays = function(format) { //获取当前时间
        return $.formatDateToString(new Date(), format);
    };

    $.milliseconds = function(str) {
        return $.formatStringToDate(str).getTime();
    };

    $.msToDateStr = function(ms, format) {
        return $.formatDateToString(new Date(ms), format);
    }

    $.daysBetween = function(startDate, endDate) {
        var res = $.getMilliseconds(startDate) - $.getMilliseconds(endDate);
        return Math.abs(res / 86400000);
    };

    $.showToast = function(opts) {
        $.chk(toast) && toast.remove();
        window.clearTimeout(clearT);
        opts = $.extend(true, {
            time: 2000,
            message: ''
        }, opts);
        if (opts.message) {
            toast = $('<div class="ui-toast"><span class="ui-toast-message">' + opts.message + '</span></div>').appendTo($('body'));
            var tWidth = toast.width();
            toast.css({
                'margin-left': -tWidth / 2
            });
        } else {
            toast = $('<div class="ui-toast"><span class="ui-toast-white ui-spinner"></span></div>').appendTo($('body'));
        }
        clearT = setTimeout(function() {
            toast.remove();
        }, opts.time);
        return toast;
    };

}($));

/*/*===============================================================================
************   $ dateFormat end  ************
===============================================================================*/
/**
 * @file 图片轮播组件
 */
;
(function() {

    var cssPrefix = $.fx.cssPrefix,
        transitionEnd = $.fx.transitionEnd;
    var CLASS_STATE_ACTIVE = 'ui-state-active',
        CLASS_SLIDER_DOTS = 'ui-slider-dots',
        CLASS_SLIDER_GROUP = 'ui-slider-group',
        CLASS_SLIDER_ITEM = 'ui-slider-item',
        CLASS_SLIDER_IMG = 'ui-slider-img',
        CLASS_SLIDER = 'ui-slider';

    /**
     * @property {Object}  容器的选择器
     */
    var SELECTOR_SLIDER_DOTS = '.' + CLASS_SLIDER_DOTS,
        SELECTOR_SLIDER_ITEM = '.' + CLASS_SLIDER_ITEM,
        SELECTOR_SLIDER_IMG = '.' + CLASS_SLIDER_IMG,
        SELECTOR_SLIDER_GROUP = '.' + CLASS_SLIDER_GROUP;
    var defDots = '<p class="' + CLASS_SLIDER_DOTS + '"><%= new Array( len + 1 )' +
        '.join("<b></b>") %></p>';
    var loading = '<div class="ui-loading">' +
        '<div class="ui-spinner">' +
        '</div>' +
        '</div>'

    // todo 检测3d是否支持。
    var transitionEnd, translateZ = ' translateZ(0)';

    var render = function() {
        var _sl = this,
            opts = _sl.opts,
            viewNum = opts.mulViewNum || 1,
            items,
            container;
        _sl.loading = $(loading).appendTo(_sl.ref);
        _sl.index = opts.index,
            // 检测容器节点是否指定
            container = _sl.ref.find(SELECTOR_SLIDER_GROUP);
        // 检测是否构成循环条件
        if ((items = container.children()).length < viewNum + 1) {
            opts.loop = false;
        }

        _sl.length = container.children().length;

        // 如果节点少了，需要复制几份
        while (opts.loop && container.children().length < 3 * viewNum) {
            container.append(items.clone());
        }

        _sl._items = (_sl._container = container)
            .children()
            .toArray();

        _sl._pages = container.find(SELECTOR_SLIDER_ITEM);

        _sl.ref.trigger('donedom');
        opts.dots && initDots.call(_sl);
        initWidth.call(_sl);
        // 转屏事件检测
        $(window).on('ortchange', function() {
            initWidth.call(_sl);
        });
    };

    var bind = function() {
        var _sl = this,
            opts = _sl.opts;
        _sl.ref.on('slideend', $.proxy(handleEvent, _sl))
            .on('touchstart', $.proxy(handleEvent, _sl))
            .on('touchend', $.proxy(handleEvent, _sl));
        //dots添加
        if (opts.dots) {
            _sl.ref.on('slide', function(evt, to, from) {
                updateDots.apply(_sl, [to, from]);
            })
        }
        _sl._container.on(transitionEnd,
            $.proxy(tansitionEnd, _sl));
    };

    var handleEvent = function(evt) {
        var _sl = this,
            opts = _sl.opts;
        // if (element.classList.contains(CLASS_DISABLED)) {
        //     return;
        // }
        switch (evt.type) {
            case 'touchstart':
                _sl.stop();
                break;
            case 'touchend':
            case 'touchcancel':
            case 'slideend':
                _sl.play();
                break;
        }
    };

    /**
     * 更新dots
     */
    var updateDots = function(to, from) {
        var _sl = this,
            dots = _sl._dots;

        typeof from === 'undefined' || $(dots[from % this.length]).removeClass(CLASS_STATE_ACTIVE);
        $(dots[to % this.length]).addClass(CLASS_STATE_ACTIVE);
    };

    var initDots = function() {
        var _sl = this,
            opts = _sl.opts;
        var dots = _sl.ref.find(SELECTOR_SLIDER_DOTS);

        if (!dots.length) {
            dots = _sl.parseTpl(defDots, {
                len: _sl.length
            });
            dots = $(dots).appendTo(_sl.ref[0]);
        }

        _sl._dots = dots.children().toArray();
        updateDots.call(_sl, _sl.index);
    };



    var initWidth = function() {
        var _sl = this,
            opts = _sl.opts,
            width;

        // width没有变化不需要重排
        if ((width = _sl.ref.width()) === _sl.width) {
            return;
        }
        _sl._container.css('display', 'block');
        if (opts.fullPage) {
            $(document.body).css('position', 'absolute');
            _sl.height = $(document.body).height();
        } else {
            if (opts.heightTarget == 'parent') {
                _sl.height = _sl.ref.parent().height();
            } else if (opts.heightTarget == 'img') {
                _sl.height = _sl._pages.find(SELECTOR_SLIDER_IMG).height();
            } else {
                _sl.height = _sl.ref.height();
            }

        }
        _sl.ref.height(_sl.height);
        _sl._pages.height(_sl.height);
        _sl._pages.find(SELECTOR_SLIDER_IMG).height(_sl.height);
        _sl.width = width;
        _sl.arrange();
        _sl.ref.find(SELECTOR_SLIDER_DOTS).css('display', 'block');
        _sl.ref.trigger('hiChange');
        _sl.loading.remove();
    };


    var tansitionEnd = function(evt) {
        var _sl = this,
            opts = _sl.opts;
        // ~~用来类型转换，等价于parseInt( str, 10 );
        if (~~evt.target.getAttribute('data-index') !== _sl.index) {
            return;
        }
        _sl.ref.trigger('slideend', [_sl.index]);
    };



    /**
     * 图片轮播组件
     */
    define(function($ui) {
        var $slider = $ui.define('Slider', {
            /**
             * @property {Boolean} [loop=false] 是否连续滑动
             * @namespace options
             */
            loop: false,

            /**
             * @property {Number} [speed=400] 动画执行速度
             * @namespace options
             */
            speed: 100,

            /**
             * @property {Number} [index=0] 初始位置
             * @namespace options
             */
            index: 0,
            /**
             * @property {Boolean} [autoPlay=true] 是否开启自动播放
             * @namespace options
             */
            autoPlay: false,
            /**
             * @property {Number} [interval=4000] 自动播放的间隔时间（毫秒）
             * @namespace options
             */
            interval: 4000,

            /**
             * @property {Boolean} [dots=true] 是否显示轮播点
             * @namespace options
             */
            dots: false,
            /**
             * @property {Boolean} [guide=true] 是否显示导向按钮
             * @namespace options
             */
            guide: false,
            /**
             * @property {Boolean} [gestur=true] 是否添加手势事件。
             * @namespace options
             */
            gestur: false,
            touch:true,
            /**
             * @property {Number} [mulViewNum=2] 当slider为multiview模式时，用来指定一页显示多少个图片。
             * @namespace options
             */
            mulViewNum: 1,
            /**
             * @property {Number} [space=10] 图片之间的间隔
             * @namespace options
             */
            space: 0,
            /**
             * @property {Number} [space=10f] 是否全屏显示
             * @namespace options
             */
            fullPage: false,
            /**
             * @property {Number} [space=10f] 高度目标 parent/self
             * @namespace options
             */
            heightTarget: 'self'

        });
        //初始化
        $slider.prototype.init = function() {
            var _sl = this,
                opts = _sl.opts;
            if (opts.mulViewNum > 1) {
                //加載多图显示功能
                _sl.register('sMultiview', function(sm) {
                    sm.call(_sl);
                    opts.travelSize = 1;
                    // 初始dom结构
                    render.call(_sl);
                    //绑定事件
                    bind.call(_sl);
                    //自动轮播
                    opts.autoPlay && _sl.play();
                });
            } else {
                // 初始dom结构
                render.call(_sl);
                //绑定事件
                bind.call(_sl);
                //自动轮播
                opts.autoPlay && _sl.play();
            }

            //加載觸摸按鈕
            if (opts.touch) {
                _sl.register('sTouch', function(st) {
                    st.call(_sl);
                });
            }

            if (opts.guide) {
                _sl.register('sGuide', function(sg) {
                    sg.call(_sl);
                });
            }
            if (opts.gestur) {
                _sl.register('sGestures', function(gt) {
                    gt.call(_sl);
                });
            }
        };



        // 重排items
        $slider.prototype.arrange = function() {
            var _sl = this,
                opts = _sl.opts,
                items = _sl._items,
                i = 0,
                item,
                len;

            _sl._slidePos = new Array(items.length);

            for (len = items.length; i < len; i++) {
                item = items[i];

                item.style.cssText += 'width:' + _sl.width + 'px;' + 'margin-right:' + opts.space + 'px;' +
                    'left:' + (i * (-_sl.width - opts.space)) + 'px;';
                item.setAttribute('data-index', i);

                _sl.move(i, i < _sl.index ? -_sl.width : i > _sl.index ? _sl.width : 0, 0);
            }

            _sl._container.css('width', (_sl.width + opts.space) * len);
        };

        /**
         * 自动播放。
         */
        $slider.prototype.play = function() {
            var _sl = this,
                opts = _sl.opts;
            if (opts.autoPlay && !_sl._timer) {
                _sl._timer = setTimeout(function() {
                    _sl.slideTo(_sl.index + 1);
                    _sl._timer = null;
                }, opts.interval);
            }
            return _sl;
        };

        /**
         * 停止自动播放
         * @method stop
         * @chainable
         * @return {self} 返回本身
         * @for Slider
         * @uses Slider.autoplay
         */
        $slider.prototype.stop = function() {
            var _sl = this;
            if (_sl._timer) {
                clearTimeout(_sl._timer);
                _sl._timer = null;
            }
            return _sl;
        };


        /**
         * 切换到下一个slide
         * @method next
         * @chainable
         * @return {self} 返回本身
         */
        $slider.prototype.next = function() {
            var _sl = this,
                opts = _sl.opts;
            if (opts.loop || _sl.index + 1 < _sl.length) {
                _sl.slideTo(_sl.index + 1);
            }

            return _sl;
        };
        /**
         * 切换到上一个slide
         * @method prev
         * @chainable
         * @return {self} 返回本身
         */
        $slider.prototype.prev = function() {
            var _sl = this,
                opts = _sl.opts;
            if (opts.loop || _sl.index > 0) {
                _sl.slideTo(_sl.index - 1);
            }

            return _sl;
        };



        $slider.prototype.move = function(index, dist, speed, immediate) {
            var _sl = this,
                opts = _sl.opts,
                slidePos = _sl._slidePos,
                items = _sl._items;

            if (slidePos[index] === dist || !items[index]) {
                return;
            }

            _sl.translate(index, dist, speed);
            slidePos[index] = dist; // 记录目标位置

            // 强制一个reflow
            immediate && items[index].clientLeft;
        };

        $slider.prototype.translate = function(index, dist, speed) {
            var _sl = this,
                opts = _sl.opts,
                slide = _sl._items[index],
                style = slide && slide.style;
            if (dist > 0) {
                dist = dist + opts.space
            } else if (dist < 0) {
                dist = dist - opts.space
            }
            if (!style) {
                return false;
            }

            style.cssText += cssPrefix + 'transition-duration:' + speed +
                'ms;' + cssPrefix + 'transform: translate(' +
                dist + 'px, 0)' + translateZ + ';';
        };

        $slider.prototype.circle = function(index, arr) {
            var _sl = this,
                opts = _sl.opts,
                len;

            arr = arr || _sl._items;
            len = arr.length;

            return (index % len + len) % arr.length;
        };

        $slider.prototype.slide = function(from, diff, dir, width, speed, opts) {
            var _sl = this,
                to, opts = _sl.opts;

            to = _sl.circle(from - dir * diff);

            // 如果不是loop模式，以实际位置的方向为准
            if (!opts.loop) {
                dir = Math.abs(from - to) / (from - to);
            }

            // 调整初始位置，如果已经在位置上不会重复处理
            _sl.move(to, -dir * width, 0, true);

            _sl.move(from, width * dir, speed);
            _sl.move(to, 0, speed);

            _sl.index = to;
            _sl.ref.trigger('slide', [to, from]);
            return _sl;
        };

        /**
         * 切换到第几个slide
         */
        $slider.prototype.slideTo = function(to, speed) {
            var _sl = this,
                opts = _sl.opts;
            if (_sl.index === to || _sl.index === _sl.circle(to)) {
                return this;
            }

            var index = _sl.index,
                diff = Math.abs(index - to),

                // 1向左，-1向右
                dir = diff / (index - to),
                width = _sl.width;

            speed = speed || opts.speed;

            return _sl.slide(index, diff, dir, width, speed, opts);
        };

        /**
         * 返回当前显示的第几个slide
         * @method getIndex
         * @chainable
         * @return {Number} 当前的silde序号
         */
        $slider.prototype.getIndex = function() {
            return this.index;
        };

        /**
         * 销毁组件
         * @method destroy
         */
        $slider.prototype.destroy = function() {

        };

        //注册$插件
        $.fn.slider = function(opts) {
            var sliderObjs = [];
            opts || (opts = {});
            this.each(function() {
                var sliderObj = null;
                var id = this.getAttribute('data-slider');
                if (!id) {
                    opts = $.extend(opts, {
                        ref: this
                    });
                    id = ++$ui.uuid;
                    sliderObj = $ui.data[id] = new $slider(opts);
                    this.setAttribute('data-slider', id);
                } else {
                    sliderObj = $ui.data[id];
                }
                sliderObjs.push(sliderObj);
            });
            return sliderObjs.length > 1 ? sliderObjs : sliderObjs[0];
        };

    });

})();
/**
 * @file 图片轮播手指跟随插件
 * @import slider.js
 */
;(function() {
    
    var isScrolling,
        touchesStart,
        touchesEnd,
        delta,
        moved;

        var sliderTonClick = function() {
                return !moved;
            };
        var angle = function(start,end){
                var diff_x = end.x - start.x,
                    diff_y = end.y - start.y;
                //返回角度,不是弧度
                return 360*Math.atan(diff_y/diff_x)/(2*Math.PI);
        }

        var sliderTonStart = function( e ) {
                    
                // 不处理多指
                if ( e.touches.length > 1 ) {
                    return false;
                }

                var _sl = this,
                    touche = e.touches[ 0 ],
                    opts = _sl.opts,
                    num;

                touchesStart = {
                    x: touche.pageX,
                    y: touche.pageY,
                    time: +new Date()
                };

                delta = {};
                moved = false;
                isScrolling = undefined;

                num = opts.mulViewNum || 1;
                _sl.move( opts.loop ? _sl.circle( _sl.index - num ) :
                        _sl.index - num, -_sl.width, 0, true );
                _sl.move( opts.loop ? _sl.circle( _sl.index + num ) :
                        _sl.index + num, _sl.width, 0, true );

                _sl.ref.on( 'touchmove' + ' touchend' +
                        ' touchcancel', _sl._touchHandler );
            };


        var sliderTonMove = function( e ) {
                // 多指或缩放不处理
                if ( e.touches.length > 1 || e.scale &&
                        e.scale !== 1 ) {
                    return false;
                }

                var _sl = this,
                    opts = _sl.opts,
                    viewNum = opts.mulViewNum || 1,
                    touche = e.touches[ 0 ],
                    index = _sl.index,
                    i,
                    len,
                    pos,
                    slidePos;

                opts.disableScroll && e.preventDefault();
                touchesEnd = {
                    x: touche.pageX,
                    y: touche.pageY
                }
                if(Math.abs(angle(touchesStart,touchesEnd)) > 30)return;
                
                d6.verticalSwipe = false;
                delta.x = touche.pageX - touchesStart.x;
                delta.y = touche.pageY - touchesStart.y;
                if ( typeof isScrolling === 'undefined' ) {
                    isScrolling = Math.abs( delta.x ) <
                            Math.abs( delta.y );
                }

                if ( !isScrolling ) {
                    e.preventDefault();

                    if ( !opts.loop ) {

                        // 如果左边已经到头
                        delta.x /= (!index && delta.x > 0 ||

                                // 如果右边到头
                                index === _sl._items.length - 1 && 
                                delta.x < 0) ?

                                // 则来一定的减速
                                (Math.abs( delta.x ) / _sl.width + 1) : 1;
                    }

                    slidePos = _sl._slidePos;

                    for ( i = index - viewNum, len = index + 2 * viewNum;
                            i < len; i++ ) {
                        pos = opts.loop ? _sl.circle( i ) : i;
                        _sl.translate( pos, delta.x + slidePos[ pos ], 0 );
                    }

                    moved = true;
                }
            };

        var sliderTonEnd = function() {
                d6.verticalSwipe = true;
                var _sl = this,
                    opts = _sl.opts;
                // 解除事件
                _sl.ref.off( 'touchmove' + ' touchend' + ' touchcancel',
                        _sl._touchHandler );

                if ( !moved ) {
                    return;
                }

                var viewNum = opts.mulViewNum || 1,
                    index = _sl.index,
                    slidePos = _sl._slidePos,
                    duration = +new Date() - touchesStart.time,
                    absDeltaX = Math.abs( delta.x ),

                    // 是否滑出边界
                    isPastBounds = !opts.loop && (!index && delta.x > 0 ||
                        index === slidePos.length - viewNum && delta.x < 0),

                    // -1 向右 1 向左
                    dir = delta.x > 0 ? 1 : -1,
                    speed,
                    diff,
                    i,
                    len,
                    pos;

                if ( duration < 250 ) {

                    // 如果滑动速度比较快，偏移量跟根据速度来算
                    speed = absDeltaX / duration;
                    diff = Math.min( Math.round( speed * viewNum * 1.2 ),
                            viewNum );
                } else {
                    diff = Math.round( absDeltaX / (_sl.perWidth || _sl.width) );
                }
                
                if ( diff && !isPastBounds ) {
                    _sl.slide( index, diff, dir, _sl.width, opts.speed,
                            opts, true );
                    
                    // 在以下情况，需要多移动一张
                    if ( viewNum > 1 && duration >= 250 &&
                            Math.ceil( absDeltaX / _sl.perWidth ) !== diff ) {

                        _sl.index < index ? _sl.move( _sl.index - 1, -_sl.perWidth,
                                opts.speed ) : _sl.move( _sl.index + viewNum,
                                _sl.width, opts.speed );
                    }
                } else {
                    if((_sl.index == 0 && dir == 1) || (_sl.index == (_sl.length - 1) && dir == -1)){//左右滑到尽头
                        (!opts.loop) && _sl.ref.trigger('moveend', [_sl.index,dir]);
                    }
                    // 滑回去
                    for ( i = index - viewNum, len = index + 2 * viewNum;
                        i < len; i++ ) {

                        pos = opts.loop ? _sl.circle( i ) : i;
                        _sl.translate( pos, slidePos[ pos ], 
                                opts.speed );
                    }
                }
        };

    

    /**
     * 图片轮播手指跟随插件
     * @pluginfor Slider
     */
    define(function($ui) {
       
        $ui.plugin('sTouch', function() {
                var _sl = this, opts = _sl.opts;

                 // 提供默认options
                $.extend(true, opts, {

                    /**
                     * @property {Boolean} [stopPropagation=false] 是否阻止事件冒泡
                     * @namespace options
                     * @for Slider
                     * @uses Slider.touch
                     */
                    stopPropagation: false,

                    /**
                     * @property {Boolean} [disableScroll=false] 是否阻止滚动
                     * @namespace options
                     * @for Slider
                     * @uses Slider.touch
                     */
                    disableScroll: false
                });

                _sl._touchHandler = function( e ) {
                    opts.stopPropagation && e.stopPropagation();
                    switch (e.type) {
                        case 'touchstart':
                            sliderTonStart.call(_sl,e);
                            break;
                        case 'touchmove':
                            sliderTonMove.call(_sl,e);
                            break;
                        case 'touchcancel':
                        case 'touchend':
                            sliderTonEnd.call(_sl,e);
                            break;
                        case 'click':
                            sliderTonClick.call(_sl,e);
                            break;
                    }
                };
                // 绑定手势
                _sl.ref.on( 'touchstart', _sl._touchHandler);
                    
            });
    } );
})()
/**
 * @file 图片轮播剪头按钮
 */
;(function() {
    

    /**
     * 图片轮播剪头按钮
     */
    define(function($ui) {
        $ui.plugin('sGuide', function(){
            var _sl = this, opts = _sl.opts,
                arr = [ 'prev', 'next' ];

             $.extend(true, opts, {
                    tpl: {
                        prev: '<span class="ui-slider-pre"></span>',
                        next: '<span class="ui-slider-next"></span>'
                    },

                    /**
                     * @property {Object} [select={prev:'.ui-slider-pre',next:'.ui-slider-next'}] 上一张和下一张按钮的选择器
                     * @namespace options
                     * @for Slider
                     * @uses Slider.arrow
                     */
                    selector: {
                        prev: '.ui-slider-pre',    // 上一张按钮选择器
                        next: '.ui-slider-next'    // 下一张按钮选择器
                    }
                });

            

                var selector = opts.selector;

                arr.forEach(function( name ) {
                    var item = _sl.ref.find( selector[ name ] );
                    item.length || _sl.ref.append( item = $( opts.tpl[name]));
                    _sl[ '_' + name ] = item;
                });

                arr.forEach(function( name ) {
                    _sl[ '_' + name ].on( _sl.touchEve(), function() {
                        _sl[ name ].call( _sl );
                    } );
                });

                _sl.ref.on( 'destroy', function() {
                    _sl._prev.off();
                    _sl._next.off();
                } );
        });
    });
})()
/**
 * 图片轮播多图显示功能
 */
;(function() {
     /**
     * 图片轮播多图显示功能
     */
    define(function($ui) {
        $ui.plugin('sMultiview', function(){
            var _sl = this, opts = _sl.opts;

            _sl.arrange = function() {
                var items = _sl._items,
                    viewNum = opts.mulViewNum,
                    factor = _sl.index % viewNum,
                    i = 0,
                    perWidth = _sl.perWidth = Math.ceil( _sl.width / viewNum ),
                    item,
                    len;

                _sl._slidePos = new Array( items.length );

                for ( len = items.length; i < len; i++ ) {
                    item = items[ i ];

                    item.style.cssText += 'width:' + perWidth + 'px;' +
                            'left:' + (i * -perWidth) + 'px;';
                    item.setAttribute( 'data-index', i );

                    i % viewNum === factor && _sl.move( i,
                            i < _sl.index ? -_sl.width : i > _sl.index ? _sl.width : 0,
                            0, Math.min( viewNum, len - i ) );
                }

                _sl._container.css( 'width', perWidth * len );
            };

            _sl.move = function( index, dist, speed, immediate, count ) {
                var _sl = this, opts = _sl.opts,
                    perWidth = _sl.perWidth,
                    i = 0;

                count = count || opts.mulViewNum;

                for ( ; i < count; i++ ) {
                    _sl.move(opts.loop ? _sl.circle( index + i ) :
                            index + i, dist + i * perWidth, speed, immediate );
                }
            };

            _sl.slide = function( from, diff, dir, width, speed, opts, mode ) {
                var _sl = this, opts = _sl.opts,
                    viewNum = opts.mulViewNum,
                    len = this._items.length,
                    offset,
                    to;

                // 当不是loop时，diff不能大于实际能移动的范围
                opts.loop || (diff = Math.min( diff, dir > 0 ?
                                from : len - viewNum - from ));

                to = _sl.circle( from - dir * diff );

                // 如果不是loop模式，以实际位置的方向为准
                opts.loop || (dir = Math.abs( from - to ) / (from - to));

                diff %= len;    // 处理diff大于len的情况

                // 相反的距离比viewNum小，不能完成流畅的滚动。
                if ( len - diff < viewNum ) {
                    diff = len - diff;
                    dir = -1 * dir;
                }

                offset = Math.max( 0, viewNum - diff );

                // 调整初始位置，如果已经在位置上不会重复处理
                // touchend中执行过来的，不会执行以下代码
                if ( !mode ) {
                    _sl.move( to, -dir * this.perWidth *
                            Math.min( diff, viewNum ), 0, true );
                    _sl.move( from + offset * dir, offset * dir *
                            this.perWidth, 0, true );
                }

                _sl.move( from + offset * dir, width * dir, speed );
                _sl.move( to, 0, speed );

                _sl.index = to;
                _sl.ref.trigger('slide', [to,from]);
                return _sl;
            };

            _sl.prev = function() {
                var _sl = this, to, opts = _sl.opts;
                    travelSize = opts.travelSize;

                if ( opts.loop || (_sl.index > 0, travelSize =
                        Math.min( _sl.index, travelSize )) ) {

                    _sl.slideTo( _sl.index - travelSize );
                }

                return _sl;
            };

            _sl.next = function() {
                var _sl = this, opts = _sl.opts;
                    travelSize = opts.travelSize,
                    viewNum = opts.mulViewNum;

                if ( opts.loop || (_sl.index + viewNum < _sl.length &&
                        (travelSize = Math.min( _sl.length - 1 - _sl.index,
                        travelSize ))) ) {

                    _sl.slideTo( _sl.index + travelSize );
                }

                return _sl;
            };
        });
    });
})()
/**
 * @file 图片轮播手指缩放插件
 */
;(function() {
    var bWidth,
        bHeight,
        bScrollLeft,
        bScrollTop,
        target,
        targetImg;


    var gesturestart = function(e) {
        var _gt = this;
        target = _gt._items[_gt.index];
        targetImg = $(target).find('.ui-slider-img');
        bWidth = targetImg.width();
        bHeight = targetImg.height();
        bScrollLeft = $(target).scrollLeft();
        bScrollTop = $(target).scrollTop();
        var scale = e.scale;
        _gt.ref.on('gesturechange ' + ' gestureend', _gt._gestureHandler);
    };


    var gesturechange = function(e) {
        // 多指或缩放不处理
        var _gt = this,
            opts = _gt.opts,
            scale = e.scale;
        $(target).css('overflow', 'hidden');
        if (1 < scale && scale < 2) {
            target.isMax = true;
            var ratio = scale - 1;
            var mWidth = bWidth + opts.MaxWidthPx * ratio;
            var mHeight = targetImg[0].sHeight / targetImg[0].sWidth * mWidth;
            if ((mWidth) < (targetImg[0].sWidth + opts.MaxWidthPx)) {
                targetImg.css('width', mWidth)
                target.scrollLeft = bScrollLeft + (mWidth - bWidth) / 2
                targetImg.css('height', mHeight)
                target.scrollTop = bScrollTop + (mHeight - bHeight) / 2
            } else {
                targetImg.css('width', targetImg[0].sWidth + opts.MaxWidthPx);
                target.scrollLeft = bScrollLeft + (targetImg[0].sWidth + opts.MaxWidthPx - bWidth) / 2;
                targetImg.css('height', (targetImg[0].sHeight / targetImg[0].sWidth) * (targetImg[0].sWidth + opts.MaxWidthPx))
                target.scrollTop = bScrollTop + ((targetImg[0].sHeight / targetImg[0].sWidth) * (targetImg[0].sWidth + opts.MaxWidthPx) - bHeight) / 2
            }
            _gt.ref.off('touchstart ' + 'touchmove' + ' touchend' + ' touchcancel',
                _gt._touchHandler);
        } else if (scale < 1) {
            var ratio = 1 - scale;
            var mWidth = bWidth - opts.MaxWidthPx * ratio;
            var mHeight = targetImg[0].sHeight / targetImg[0].sWidth * mWidth;

            if (mWidth > (targetImg[0].sWidth)) {
                targetImg.css('width', mWidth)
                target.scrollLeft = (bScrollLeft - (bWidth - mWidth) / 2) > 0 ? bScrollLeft - (bWidth - mWidth) / 2 : 0
                targetImg.css('height', mHeight)
                target.scrollTop = (bScrollTop - (bHeight - mHeight) / 2) > 0 ? bScrollTop - (bHeight - mHeight) / 2 : 0
                    // _gt.ref.find('.ui-slider-dots').html(target.scrollLeft + "  " + target.scrollTop)
            } else {
                target.isMax = false;
                targetImg.css('width', targetImg[0].sWidth)
                targetImg.css('height', targetImg[0].sHeight)
                target.scrollLeft = 0;
                target.scrollTop = 0;
                $(target).css('overflow', 'hidden');
                _gt.ref.on('touchstart', _gt._touchHandler);
            }

        }

    };

    var gestureend = function() {
        var _gt = this,
            opts = _gt.opts;
        if (target.isMax) $(target).css('overflow', 'scroll');
        // 解除事件
        _gt.ref.off('gesturechange ' + 'gestureend',
            _gt._gestureHandler);


    };



    /**
     * 图片轮播手指跟随插件
     * @pluginfor Slider
     */
    define(function($ui) {

        $ui.plugin('sGestures', function() {
            var _gt = this,
                opts = _gt.opts;

            // 提供默认options
            $.extend(true, opts, {

                /**
                 * @property 宽度放大的最大PX值
                 * @namespace options
                 * @for Slider
                 * @uses 
                 */
                MaxWidthPx: 500
            });

            _gt._gestureHandler = function(e) {
                opts.stopPropagation && e.stopPropagation();
                switch (e.type) {
                    case 'gesturestart':
                        gesturestart.call(_gt, e);
                        break;
                    case 'gesturechange':
                        gesturechange.call(_gt, e);
                        break;
                    case 'gestureend':
                        gestureend.call(_gt, e);
                        break;
                }
            };
            // 绑定手势
            _gt.ref.on('gesturestart', _gt._gestureHandler);

            $.each(_gt._items, function(i, item) {
                var img = $(item).find('.ui-slider-img');
                img[0].sWidth = img.width();
                img.css('transform', 'translate3d(0, 0, 0)');
                img[0].sHeight = img.height();
            });

            _gt.ref.find('.ui-slider-img').on('doubleTap', function(e) {
                target = _gt._items[_gt.index];
                targetImg = $(target).find('.ui-slider-img');
                bWidth = targetImg.width();
                bHeight = targetImg.height();
                if (!target.isMax) {
                    target.isMax = true;
                    $(target).css('overflow', 'scroll');
                    targetImg.css('width', targetImg[0].sWidth + opts.MaxWidthPx);
                    target.scrollLeft = target.scrollLeft + (targetImg[0].sWidth + opts.MaxWidthPx - bWidth) / 2;
                    targetImg.css('height', (targetImg[0].sHeight / targetImg[0].sWidth) * (targetImg[0].sWidth + opts.MaxWidthPx))
                    target.scrollTop = target.scrollTop + ((targetImg[0].sHeight / targetImg[0].sWidth) * (targetImg[0].sWidth + opts.MaxWidthPx) - bHeight) / 2

                    _gt.ref.off('touchstart ' + 'touchmove' + ' touchend' + ' touchcancel',
                        _gt._touchHandler);
                } else {
                    target.isMax = false;
                    targetImg.css('width', targetImg[0].sWidth)
                    targetImg.css('height', targetImg[0].sHeight)
                    target.scrollLeft = 0;
                    target.scrollTop = 0;
                    $(target).css('overflow', 'hidden');
                    _gt.ref.on('touchstart', _gt._touchHandler);
                }
            });

        });
    });
})()
/**
 * @file accordion 组件
 */
;(function() {
    var CLASS_ACCORDION_ITEM = 'ui-accordion-item',
        CLASS_ACCORDION_ITEM_EXPANDED = 'ui-accordion-item-expanded',
        CLASS_ACCORDION_ITEM_LINK = 'ui-accordion-item-link',
        CLASS_ACCORDION = 'ui-accordion',
        CLASS_ACCORDION_ITEM_CONTENT = 'ui-accordion-item-content',
        CLASS_ACCORDION_ITEM_CONTENT_IOS = 'ui-accordion-item-content-ios',
        CLASS_ACCORDION_ITEM_CONTENT_ANDROID = 'ui-accordion-item-content-android',
        CLASS_ACCORDION_ITEM_INNER = 'ui-accordion-item-inner',
        CLASS_ACCORDION_ITEM_TITLE = 'ui-accordion-item-title',
        CLASS_ACCORDION_ITEM_LINK_EXPANDED = 'ui-accordion-item-link-expanded';

    var SELECTOR_ACCORDION_ITEM = '.' + CLASS_ACCORDION_ITEM,
        SELECTOR_ACCORDION_ITEM_EXPANDED = '.' + CLASS_ACCORDION_ITEM_EXPANDED,
        SELECTOR_ACCORDION_ITEM_LINK = '.' + CLASS_ACCORDION_ITEM_LINK,
        SELECTOR_ACCORDION_ITEM_INNER = '.' + CLASS_ACCORDION_ITEM_INNER,
        SELECTOR_ACCORDION_ITEM_TITLE = '.' + CLASS_ACCORDION_ITEM_TITLE,
        SELECTOR_ACCORDION = '.' + CLASS_ACCORDION,
        SELECTOR_ACCORDION_ITEM_CONTENT = '.' + CLASS_ACCORDION_ITEM_CONTENT;

    var render = function() {
        var _acd = this,
            opts = _acd.opts;
        var toggleClose = opts.toggleClose;
        opts.toggleClose = false;
        _acd.ref.find('li.' + CLASS_ACCORDION_ITEM_EXPANDED).each(function(index, item) {
            _acd.accordionOpen(item);
        })
        opts.toggleClose = toggleClose;
        if($.os.ios){
            _acd.ref.find(SELECTOR_ACCORDION_ITEM_CONTENT).addClass(CLASS_ACCORDION_ITEM_CONTENT_IOS)
        }else{
            _acd.ref.find(SELECTOR_ACCORDION_ITEM_CONTENT).addClass(CLASS_ACCORDION_ITEM_CONTENT_ANDROID)
        }
    };

    //绑定事件
    var bind = function() {
        var _acd = this,
            opts = _acd.opts;
        _acd.ref.on(_acd.touchEve(), function(evt) {
            if ($(evt.target).is(SELECTOR_ACCORDION_ITEM_INNER) || $(evt.target).is(SELECTOR_ACCORDION_ITEM_TITLE) || $(evt.target).is(SELECTOR_ACCORDION_ITEM_LINK)) {
                var accordionItem = $(evt.target).closest(SELECTOR_ACCORDION_ITEM);
                _acd.accordionToggle(accordionItem);
            }
        })
    };

    define(function($ui) {
        var $accordion = $ui.define('Accordion', {
            toggleClose: true
        });

        //初始化
        $accordion.prototype.init = function() {
            var _acd = this;
            render.call(this);
            bind.call(this);

        };

        $accordion.prototype.accordionToggle = function(item) {
            var _acd = this,
                item = $(item);
            if (item.length === 0) return;
            if (item.hasClass(CLASS_ACCORDION_ITEM_EXPANDED)) _acd.accordionClose(item);
            else _acd.accordionOpen(item);
        };

        $accordion.prototype.accordionOpen = function(item) {
            var _acd = this,
                opts = _acd.opts,
                item = $(item);
            var list = item.parents(SELECTOR_ACCORDION).eq(0);
            var content = item.children(SELECTOR_ACCORDION_ITEM_CONTENT);
            if (content.length === 0) content = item.find(SELECTOR_ACCORDION_ITEM_CONTENT);
            var expandedItem = list.length > 0 && item.parent().children(SELECTOR_ACCORDION_ITEM_EXPANDED);
            if (expandedItem.length > 0) {
                opts.toggleClose && _acd.accordionClose(expandedItem);
                _acd.ref.trigger('toggle', [item, item.hasClass(CLASS_ACCORDION_ITEM_EXPANDED)]);
            }
            content.css('height', content[0].scrollHeight + 'px').transitionEnd(function() {
                content.transition(0);
                content.css('height', 'auto');
                var clientLeft = content[0].clientLeft;
                content.transition('');
                _acd.ref.trigger('opened', [item]);
            });
            _acd.ref.trigger('open', [item]);
            item.addClass(CLASS_ACCORDION_ITEM_EXPANDED);
            $(item.children()[0]).addClass(CLASS_ACCORDION_ITEM_LINK_EXPANDED);
        };

        $accordion.prototype.accordionClose = function(item) {
            var _acd = this,
                item = $(item);
            var content = item.children(SELECTOR_ACCORDION_ITEM_CONTENT);
            if (content.length === 0) content = item.find(SELECTOR_ACCORDION_ITEM_CONTENT);
            content.transition(0);
            content.css('height', content[0].scrollHeight + 'px');
            content[0].clientLeft;
            // Close
            content.transition('');
            content.css('height', '').transitionEnd(function() {
                content.transition(0);
                content.css('height', '');
                content.transition('');
                _acd.ref.trigger('closed', [item]);
            });
            _acd.ref.trigger('close', [item]);
            item.removeClass(CLASS_ACCORDION_ITEM_EXPANDED);
            $(item.children()[0]).removeClass(CLASS_ACCORDION_ITEM_LINK_EXPANDED);
        };


        //注册$插件
        $.fn.accordion = function(opts) {
            var accordionObjs = [];
            opts || (opts = {});
            this.each(function() {
                var accordionObj = null;
                var id = this.getAttribute('data-accordion');
                if (!id) {
                    opts = $.extend(opts, {
                        ref: this
                    });
                    id = ++$ui.uuid;
                    accordionObj = $ui.data[id] = new $accordion(opts);
                    this.setAttribute('data-accordion', id);
                } else {
                    accordionObj = $ui.data[id];
                }
                accordionObjs.push(accordionObj);
            });
            return accordionObjs.length > 1 ? accordionObjs : accordionObjs[0];
        };

        /*module.exports = function(opts){
            return new botton(opts);
        };
    */
    });
})();
/**
 * @file accordion-list 组件
 */
;
(function() {
    var CLASS_ACCORDION_LIST = 'ui-accordion-list',
        CLASS_ACCORDION_LIST_ITEM = 'ui-accordion-list-item',
        CLASS_ACCORDION_LIST_ITEM_EXPANDED = 'ui-accordion-list-item-expanded',
        CLASS_ACCORDION_LIST_ITEM_LINK = 'ui-accordion-list-item-link',
        CLASS_ACCORDION_LIST_ITEM_CONTENT = 'ui-accordion-list-item-content',
        CLASS_ACCORDION_LIST_ITEM_CONTENT_IOS = 'ui-accordion-list-item-content-ios',
        CLASS_ACCORDION_LIST_ITEM_CONTENT_ANDROID = 'ui-accordion-list-item-content-android',
        CLASS_ACCORDION_LIST_ITEM_INNER = 'ui-accordion-list-item-inner',
        CLASS_ACCORDION_LIST_ITEM_TITLE = 'ui-accordion-list-item-title',
        CLASS_ACCORDION_LIST_ITEM_LINK_EXPANDED = 'ui-accordion-list-item-link-expanded',
        CLASS_ACCORDION_LIST_ITEM_EXTEND = 'ui-accordion-list-item-extend',
        CLASS_ACTIVE = 'ui-active';

    var SELECTOR_ACCORDION_LIST = '.' + CLASS_ACCORDION_LIST,
        SELECTOR_ACCORDION_LIST_ITEM = '.' + CLASS_ACCORDION_LIST_ITEM,
        SELECTOR_ACCORDION_LIST_ITEM_EXPANDED = '.' + CLASS_ACCORDION_LIST_ITEM_EXPANDED,
        SELECTOR_ACCORDION_LIST_ITEM_LINK = '.' + CLASS_ACCORDION_LIST_ITEM_LINK,
        SELECTOR_ACCORDION_LIST_ITEM_CONTENT = '.' + CLASS_ACCORDION_LIST_ITEM_CONTENT,
        SELECTOR_ACCORDION_LIST_ITEM_INNER = '.' + CLASS_ACCORDION_LIST_ITEM_INNER,
        SELECTOR_ACCORDION_LIST_ITEM_TITLE = '.' + CLASS_ACCORDION_LIST_ITEM_TITLE;

    var render = function() {
        var _acd = this,
            opts = _acd.opts;
        _acd.ref.find(SELECTOR_ACCORDION_LIST_ITEM).each(function(index, el) {
            el = $(el);
            if (el.children(SELECTOR_ACCORDION_LIST_ITEM_CONTENT).length == 0) {
                el.addClass(CLASS_ACCORDION_LIST_ITEM_EXTEND);
            }
        })
        if($.os.ios){
            _acd.ref.find(SELECTOR_ACCORDION_LIST_ITEM_CONTENT).addClass(CLASS_ACCORDION_LIST_ITEM_CONTENT_IOS)
        }else{
            _acd.ref.find(SELECTOR_ACCORDION_LIST_ITEM_CONTENT).addClass(CLASS_ACCORDION_LIST_ITEM_CONTENT_ANDROID)
        }
    };

    //绑定事件
    var bind = function() {
        var _acd = this,
            opts = _acd.opts;
        _acd.ref.on(_acd.touchEve(), function(evt) {
            if ($(evt.target).parents(SELECTOR_ACCORDION_LIST_ITEM_LINK).length > 0 || $(evt.target).is(SELECTOR_ACCORDION_LIST_ITEM_LINK)) {
                var accordionItem = $(evt.target).closest(SELECTOR_ACCORDION_LIST_ITEM);
                _acd.accordionToggle(accordionItem);
            }
        })
    };

    define(function($ui) {
        //accordionList
        var $accordionList = $ui.define('AccordionList', {
            toggleClose: true
        });

        //初始化
        $accordionList.prototype.init = function() {
            var _acd = this;
            render.call(this);
            bind.call(this);

        };

        $accordionList.prototype.accordionToggle = function(item) {
            var _acd = this,
                item = $(item);
            if (item.length === 0) return;
            if (item.hasClass(CLASS_ACCORDION_LIST_ITEM_EXPANDED)) _acd.accordionClose(item);
            else _acd.accordionOpen(item);
        };

        $accordionList.prototype.accordionOpen = function(item) {
            var _acd = this,
                opts = _acd.opts,
                item = $(item);
            var list = item.parents(SELECTOR_ACCORDION_LIST).eq(0);
            var content = item.children(SELECTOR_ACCORDION_LIST_ITEM_CONTENT);
            if (content.length === 0) content = item.find(SELECTOR_ACCORDION_LIST_ITEM_CONTENT);
            var expandedItem = list.length > 0 && item.parent().children(SELECTOR_ACCORDION_LIST_ITEM_EXPANDED);
            if (content.length === 0) {
                _acd.ref.trigger('tapped', [item]);
                return;
            }
            if (expandedItem.length > 0) {
                opts.toggleClose && _acd.accordionClose(expandedItem);
                _acd.ref.trigger('toggle', [item, item.hasClass(CLASS_ACCORDION_LIST_ITEM_EXPANDED)]);
            };
            content.css('height', content[0].scrollHeight + 'px').transitionEnd(function() {
                content.transition(0);
                content.css('height', 'auto');
                var clientLeft = content[0].clientLeft;
                content.transition('');
                _acd.ref.trigger('opened', [item]);
            });
            _acd.ref.trigger('open', [item]);
            item.addClass(CLASS_ACCORDION_LIST_ITEM_EXPANDED)
            $(item.children()[0]).addClass(CLASS_ACCORDION_LIST_ITEM_LINK_EXPANDED).addClass(CLASS_ACTIVE);
        };

        $accordionList.prototype.accordionClose = function(item) {
            var _acd = this,
                item = $(item);
            var content = item.children(SELECTOR_ACCORDION_LIST_ITEM_CONTENT);
            if (content.length === 0) content = item.find(SELECTOR_ACCORDION_LIST_ITEM_CONTENT);
            item.removeClass(CLASS_ACCORDION_LIST_ITEM_EXPANDED)
            $(item.children()[0]).removeClass(CLASS_ACCORDION_LIST_ITEM_LINK_EXPANDED).removeClass(CLASS_ACTIVE);
            content.transition(0);
            content.css('height', content[0].scrollHeight + 'px');
            // Relayout
            var clientLeft = content[0].clientLeft;
            // Close
            content.transition('');
            content.css('height', '').transitionEnd(function() {
                content.css('height', '');
                _acd.ref.trigger('closed', [item]);
            });
            _acd.ref.trigger('close', [item]);
        };


        //注册$插件
        $.fn.accordionList = function(opts) {
            var accordionListObjs = [];
            opts || (opts = {});
            this.each(function() {
                var accordionListObj = null;
                var id = this.getAttribute('data-accordionList');
                if (!id) {
                    opts = $.extend(opts, {
                        ref: this
                    });
                    id = ++$ui.uuid;
                    accordionListObj = $ui.data[id] = new $accordionList(opts);
                    this.setAttribute('data-accordionList', id);
                } else {
                    accordionListObj = $ui.data[id];
                }
                accordionListObjs.push(accordionListObj);
            });
            return accordionListObjs.length > 1 ? accordionListObjs : accordionListObjs[0];
        };

        /*module.exports = function(opts){
            return new botton(opts);
        };
    */
    });
})();
/**
 * @file fullpage组件
 */
;(function($, window, undefined) {
    var cssPrefix = $.fx.cssPrefix;
    var transitionEnd = $.fx.transitionEnd;
    var translateZ = ' translateZ(0)';
    var CLASS_FULLPAGE_ARROW = 'ui-fullpage-arrow',
        CLASS_FULLPAGE_INNER = 'ui-fullPage-inner',
        CLASS_FULLPAGE_PAGE = 'ui-fullpage-page',
        CLASS_STATE_ACTIVE = 'ui-state-active',
        CLASS_FULLPAGE_DOTS = 'ui-fullpage-dots',
        CLASS_FULLPAGE_DOTS_CIRCLE = 'fa fa-circle-thin';

    var SELECTOR_FULLPAGE_INNER = '.' + CLASS_FULLPAGE_INNER,
        SELECTOR_FULLPAGE_PAGE = '.' + CLASS_FULLPAGE_PAGE;

    var arrow = '<span class="' + CLASS_FULLPAGE_ARROW + '"><b class="fa fa-angle-double-up fa-2x"></b></span>';
    var inner = '<div class="' + CLASS_FULLPAGE_INNER + '"></div>';
    var defDots = '<p class="' + CLASS_FULLPAGE_DOTS + '"><%= new Array( len + 1 )' +
        '.join("<i></i>") %></p>';

    // $(document).on('touchmove', function(e) {
    //     e.preventDefault();
    // });
    //渲染组件
    var render = function() {
        var _fp = this,
            opts = _fp.opts;
        _fp.curIndex = 0;
        _fp.startY = 0;
        _fp.movingFlag = false;
        opts.der = 0.1;
        _fp.ref.children().wrapAll(inner);
        _fp._inner = _fp.ref.find(SELECTOR_FULLPAGE_INNER);
        _fp._pages = _fp.ref.find(SELECTOR_FULLPAGE_PAGE);
        _fp.pagesLength = _fp._pages.length;
        opts.dots && initDots.call(_fp);
        update.call(_fp);
        _fp.status = 1;
        opts.arrow && (_fp._arrow = $(arrow).appendTo(_fp.ref));
        opts.gesture && (opts.loop = false)
    };
    //绑定事件
    var bind = function() {
        var _fp = this,
            opts = _fp.opts;


        _fp._inner.on('touchstart', function(e) {
            if (!_fp.status) {
                return 1;
            }
            if (_fp.movingFlag) {
                return 0;
            }

            _fp.startX = e.targetTouches[0].pageX;
            _fp.startY = e.targetTouches[0].pageY;
        });
        _fp._inner.on('touchend', function(e) {
            if (!_fp.status) {
                return 1;
            }
            if (_fp.movingFlag) {
                return 0;
            }
            console.log(e.changedTouches[0].pageY - _fp.startY);
            var sub = (e.changedTouches[0].pageY - _fp.startY) / _fp.height;
            console.log(sub);
            var der = ((sub > 0 && sub > opts.der) || (sub < 0 && sub < -opts.der)) ? sub > 0 ? -1 : 1 : 0;
            _fp.dir = -der // -1 向上 1 向下
            console.log(_fp.dir);
            moveTo.call(_fp, _fp.curIndex + der, true);

        });
        if (opts.gesture) {
            _fp._inner.on('touchmove', function(e) {
                if (!_fp.status) {
                    return 1;
                }
                if (_fp.movingFlag) {
                    _fp.startX = e.targetTouches[0].pageX;
                    _fp.startY = e.targetTouches[0].pageY;
                    return 0;
                }

                var y = e.changedTouches[0].pageY - _fp.startY;
                if ((_fp.curIndex == 0 && y > 0) || (_fp.curIndex === _fp.pagesLength - 1 && y < 0)) y /= 2;
                if ((_fp.curIndex == 0 && y > 0) || (_fp.curIndex == _fp.pagesLength - 1 && y < 0)) {
                    y = 0;
                }
                var dist = (-_fp.curIndex * _fp.height + y);
                _fp._inner.removeClass('anim');
                _fp._inner.css({
                    '-webkit-transform': 'translate3d(' + 0 + 'px , ' + dist + 'px , 0px);',
                    'transform': 'translate3d(' + 0 + 'px , ' + dist + 'px , 0px);'
                });
            });
        }

        // 翻转屏幕提示
        // ==============================      
        // 转屏事件检测
        $(window).on('ortchange', function(evt) {
            _fp.ref.trigger('ortchange');
        });

        _fp._inner.on(transitionEnd,
            $.proxy(tansitionEnd, _fp));
    };

    var tansitionEnd = function(evt) {
        var _fp = this,
            opts = _fp.opts;
        _fp.ref.trigger('afterChange', [_fp.curIndex]);
    };

    var update = function() {
        var _fp = this,
            opts = _fp.opts;
        if (opts.fullPage) {
            $(document.body).css('position', 'absolute');
            _fp.height = $(document.body).height();
        } else {
            _fp.height = _fp.ref.parent().height();
        }
        _fp.ref.height(_fp.height);
        _fp._pages.height(_fp.height);
        if (!opts.gesture) {
            $.each(_fp._pages, function(index, el) {
                move.call(_fp, index, 0);
            })
            move.call(_fp, _fp.curIndex, 0);
        }
    };

    var initDots = function() {
        var _fp = this,
            opts = _fp.opts;

        var dots = _fp.parseTpl(defDots, {
            len: _fp.pagesLength
        });
        dots = $(dots).appendTo(_fp.ref[0]);

        _fp._dots = dots.children().toArray();
        $(_fp._dots).addClass(CLASS_FULLPAGE_DOTS_CIRCLE);
        updateDots.call(_fp, _fp.curIndex);
    };

    /**
     * 更新dots
     */
    var updateDots = function(to, from) {
        var _fp = this,
            dots = _fp._dots;
        typeof from === 'undefined' || $(dots[from % _fp.pagesLength]).removeClass(CLASS_STATE_ACTIVE);
        $(dots[to % _fp.pagesLength]).addClass(CLASS_STATE_ACTIVE);
    };

    var fix = function(cur, pagesLength, loop) {
        var _fp = this;
        if (cur < 0) {
            return !!loop ? pagesLength - 1 : 0;
        }

        if (cur >= pagesLength) {
            if (!!loop) {
                return 0;
            } else {
                return pagesLength - 1;
            }
        }


        return cur;
    };
    var move = function(car, speed) {
        isMove = true;
        var _fp = this,
            opts = _fp.opts;
        var pre = car - 1 > -1 ? car - 1 : _fp.pagesLength - 1;
        var next = car + 1 < _fp.pagesLength ? car + 1 : 0;
        if (speed == 0) {
            speed = speedPre = speedNext = 0;
        } else {
            speed = speedPre = speedNext = opts.speed
        }
        if (_fp.dir == 1) { //向下
            speedPre = 0;
        } else {
            speedNext = 0;
        }
        console.log(_fp.dir);
        if (_fp.pagesLength == 1) {
            _fp._pages[car].style.cssText += cssPrefix + 'transition-duration:' + speed +
                'ms;' + cssPrefix + 'transform: translate(0,' +
                (0 - _fp._pages[car].offsetTop) + 'px)' + translateZ + ';';
        } else if (_fp.pagesLength == 2) {
            if (typeof _fp.dir === 'undefined') {
                _fp._pages[car].style.cssText += cssPrefix + 'transition-duration:' + speed +
                    'ms;' + cssPrefix + 'transform: translate(0,' +
                    (0 - _fp._pages[car].offsetTop) + 'px)' + translateZ + ';';
                _fp._pages[next].style.cssText += cssPrefix + 'transition-duration:' + 0 +
                    'ms;' + cssPrefix + 'transform: translate(0,' +
                    (0 - _fp._pages[next].offsetTop + _fp.height) + 'px)' + translateZ + ';';
            } else if (_fp.dir == -1) { //向上
                _fp._pages[car].style.cssText += cssPrefix + 'transition-duration:' + 0 +
                    'ms;' + cssPrefix + 'transform: translate(0,' +
                    (0 - _fp._pages[car].offsetTop + _fp.height) + 'px)' + translateZ + ';';
                _fp._pages[pre].style.cssText += cssPrefix + 'transition-duration:' + speed +
                    'ms;' + cssPrefix + 'transform: translate(0,' +
                    (0 - _fp._pages[pre].offsetTop - _fp.height) + 'px)' + translateZ + ';';
                _fp._pages[car].style.cssText += cssPrefix + 'transition-duration:' + speed +
                    'ms;' + cssPrefix + 'transform: translate(0,' +
                    (0 - _fp._pages[car].offsetTop) + 'px)' + translateZ + ';';

            } else if (_fp.dir == 1) { //向下
                _fp._pages[car].style.cssText += cssPrefix + 'transition-duration:' + 0 +
                    'ms;' + cssPrefix + 'transform: translate(0,' +
                    (0 - _fp._pages[car].offsetTop - _fp.height - _fp.height) + 'px)' + translateZ + ';';
                _fp._pages[pre].style.cssText += cssPrefix + 'transition-duration:' + speed +
                    'ms;' + cssPrefix + 'transform: translate(0,' +
                    (0 - _fp._pages[pre].offsetTop + _fp.height) + 'px)' + translateZ + ';';
                _fp._pages[car].style.cssText += cssPrefix + 'transition-duration:' + speed +
                    'ms;' + cssPrefix + 'transform: translate(0,' +
                    (0 - _fp._pages[car].offsetTop) + 'px)' + translateZ + ';';
            }
        } else {
            _fp._pages[pre].style.cssText += cssPrefix + 'transition-duration:' + speedPre +
                'ms;' + cssPrefix + 'transform: translate(0,' +
                (0 - _fp._pages[pre].offsetTop - _fp.height) + 'px)' + translateZ + ';';
            _fp._pages[car].style.cssText += cssPrefix + 'transition-duration:' + speed +
                'ms;' + cssPrefix + 'transform: translate(0,' +
                (0 - _fp._pages[car].offsetTop) + 'px)' + translateZ + ';';
            _fp._pages[next].style.cssText += cssPrefix + 'transition-duration:' + speedNext +
                'ms;' + cssPrefix + 'transform: translate(0,' +
                (0 - _fp._pages[next].offsetTop + _fp.height) + 'px)' + translateZ + ';';
        }
    };

    var moveTo = function(next, anim) {
        var _fp = this,
            opts = _fp.opts;
        var cur = _fp.curIndex;

        next = fix.call(_fp, next, _fp.pagesLength, opts.loop);

        if (anim) {
            _fp._inner.addClass('anim');
        } else {
            _fp._inner.removeClass('anim');
        }

        if (next !== cur) {
            _fp.ref.trigger('beforeChange', [cur, next]);
        } else {
            return;
        }

        _fp.movingFlag = true;
        _fp.curIndex = next;
        if (!opts.gesture) {
            move.call(_fp, next);
        } else {
            _fp._inner.css({
                '-webkit-transform': 'translate3d(' + 0 + 'px , ' + (-next * _fp.height) + 'px , 0px);',
                'transform': 'translate3d(' + 0 + 'px , ' + (-next * _fp.height) + 'px , 0px);'
            });
        }

        if (next !== cur) {
            _fp.ref.trigger('change', [cur, next]);
        }

        window.setTimeout(function() {
            _fp.movingFlag = false;
            if (next !== cur) {
                _fp._pages.removeClass('active').eq(next).addClass('active');
                opts.dots && updateDots.apply(_fp, [next, cur]);
            }
        }, opts.speed + 100);

        return this;
    };


    define(function($ui) {
        //fullpage
        var $fullpage = $ui.define('Fullpage', {
            loop: false,
            gesture: false,
            dots: false,
            arrow: false,
            fullPage: true,
            speed: 500
        });

        //初始化
        $fullpage.prototype.init = function() {
            render.call(this);
            bind.call(this);
        };

        $.extend($fullpage.prototype, {
            start: function() {
                this.status = 1;
                return this;
            },
            stop: function() {
                this.status = 0;
                return this;
            },
            moveTo: function(next) {
                moveTo.call(this, next, true);
                return this;
            },
            prev: function() {
                this.moveTo(this.curIndex - 1);
                return this;
            },
            next: function() {
                this.moveTo(this.curIndex + 1);
                return this;
            },
            getCurIndex: function() {
                return this.curIndex;
            }
        });

        //注册$插件
        $.fn.fullpage = function(opts) {
            var fullpageObjs = [];
            opts || (opts = {});
            this.each(function() {
                var fullpageObj = null;
                var id = this.getAttribute('data-fullpage');
                if (!id) {
                    opts = $.extend(opts, {
                        ref: this
                    });
                    id = ++$ui.uuid;
                    fullpageObj = $ui.data[id] = new $fullpage(opts);
                    this.setAttribute('data-fullpage', id);
                } else {
                    fullpageObj = $ui.data[id];
                }
                fullpageObjs.push(fullpageObj);
            });
            return fullpageObjs.length > 1 ? fullpageObjs : fullpageObjs[0];
        };

    });
})($, window);
/**
 * @file Input组件
 */
;(function(window, document) {
    var CLASS_ICON = 'ui-icon',
        CLASS_ACTIVE = 'ui-active',
        CLASS_ICON_CLEAR = 'ui-icon-clear',
        CLASS_ICON_SPEECH = 'ui-icon-speech',
        CLASS_ICON_SEARCH = 'ui-icon-search',
        CLASS_INPUT_ROW = 'ui-input-row',
        CLASS_PLACEHOLDER = 'ui-placeholder',
        CLASS_HIDDEN = 'ui-hidden',
        CLASS_SEARCH = 'ui-search',
        CLASS_INPUT_CLEAR = 'ui-input-clear',
        CLASS_INPUT_SPEECH = 'ui-input-speech',

        SELECTOR_ICON_CLOSE = '.' + CLASS_ICON_CLEAR,
        SELECTOR_ICON_SPEECH = '.' + CLASS_ICON_SPEECH,
        SELECTOR_PLACEHOLDER = '.' + CLASS_PLACEHOLDER,
        SELECTOR_ACTION = '.ui-input-row input';


    var findRow = function(target) {
        for (; target && target !== document; target = target.parentNode) {
            if (target.classList && target.classList.contains(CLASS_INPUT_ROW)) {
                return target;
            }
        }
        return null;
    };

    //渲染
    var render = function() {
        var _ip = this,
            opts = _ip.opts,
            element = opts.ref;

        if (~opts.actions.indexOf('clear')) {
            opts.clearActionClass = CLASS_ICON + ' ' + CLASS_ICON_CLEAR + (element.value ? '' : (' ' + CLASS_HIDDEN));
            opts.clearActionSelector = SELECTOR_ICON_CLOSE;
        }
        if (~opts.actions.indexOf('speech')) {
            opts.speechActionClass = CLASS_ICON + ' ' + CLASS_ICON_SPEECH;
            opts.speechActionSelector = SELECTOR_ICON_SPEECH;
        }
        if (~opts.actions.indexOf('search')) {
            opts.searchActionClass = CLASS_PLACEHOLDER;
            opts.searchActionSelector = SELECTOR_PLACEHOLDER;
        }
    };

    var initAction = function() {
        var _ip = this,
            opts = _ip.opts,
            element = opts.ref;

        var row = element.parentNode;
        if (row) {
            if (opts.searchActionClass) {
                _ip._searchAction = createAction.apply(_ip, [row, opts.searchActionClass, opts.searchActionSelector]);
                _ip._searchAction.addEventListener(_ip.touchEve(), function(evt) {
                    _ip.focus(element);
                    evt.stopPropagation();
                });
            }
            if (opts.speechActionClass) {
                _ip._speechAction = createAction.apply(_ip, [row, opts.speechActionClass, opts.speechActionSelector]);
                _ip._speechAction.addEventListener('click', _ip.stopPropagation);
                // _ip._speechAction.addEventListener(_ip.touchEve(), function(evt) {
                //     speechActionClick.call(_ip,evt);
                // });
            }
            if (opts.clearActionClass) {
                _ip._clearAction = createAction.apply(_ip, [row, opts.clearActionClass, opts.clearActionSelector]);
                _ip._clearAction.addEventListener(_ip.touchEve(), function(evt) {
                    clearActionClick.call(_ip, evt);
                });

            }
        }
    };

    var createAction = function(row, actionClass, actionSelector) {
        var _ip = this,
            opts = _ip.opts,
            element = opts.ref;
        var action = row.querySelector(actionSelector);
        if (!action) {
            var action = document.createElement('span');
            action.className = actionClass;
            if (actionClass === opts.searchActionClass) {
                action.innerHTML = '<span class="' + CLASS_ICON + ' ' + CLASS_ICON_SEARCH + '"></span>' + element.getAttribute('placeholder');
                element.setAttribute('placeholder', '');
                if (element.value.trim()) {
                    row.classList.add(CLASS_ACTIVE);
                }
            }
            row.insertBefore(action, element.nextSibling);
        }
        return action;
    };


    var speechActionClick = function(evt) {
        if (this.isPlus()) {
            var _ip = this,
                opts = _ip.opts,
                element = opts.ref;
            element.value = '';

        } else {
            alert('当前浏览器不支持');
        }
        evt.preventDefault();
    };


    var clearActionClick = function(evt) {
        var _ip = this,
            opts = _ip.opts,
            element = opts.ref;
        element.value = '';
        _ip.focus(element);
        _ip._clearAction.classList.add(CLASS_HIDDEN);
        evt.preventDefault();
    };

    //绑定事件
    var bind = function() {
        var _ip = this,
            opts = _ip.opts,
            element = opts.ref;

        if (opts.clearActionClass) {
            var action = _ip._clearAction;
            if (!action) {
                return;
            }
            $.each(['keyup', 'change', 'input', 'focus', 'blur', 'cut', 'paste'], function(index, type) {
                (function(type) {
                    element.addEventListener(type, function() {
                        action.classList[element.value.trim() ? 'remove' : 'add'](CLASS_HIDDEN);
                    });
                })(type);
            });
        }
        if (opts.searchActionClass) {
            element.addEventListener('focus', function() {
                element.parentNode.classList.add(CLASS_ACTIVE);
            });
            element.addEventListener('blur', function() {
                if (!element.value.trim()) {
                    element.parentNode.classList.remove(CLASS_ACTIVE);
                }
            });
        }
    };
    /**
     * 文本框
     *
     */
    define(function($ui) {
        var $input = $ui.define('Input', {
            /**
             * 输入框类型
             * @type {function}
             */
            actions: 'clear'
        });

        $input.prototype.init = function() {
            render.call(this);
            initAction.call(this);
            bind.call(this);
        };

        $.fn.input = function(opts) {
            this.each(function() {
                var actions = [];
                var row = findRow(this.parentNode);
                var classList = this.classList;
                if (classList.contains(CLASS_INPUT_CLEAR)) {
                    actions.push('clear');
                }
                if (classList.contains(CLASS_INPUT_SPEECH)) {
                    actions.push('speech');
                }
                if (this.type === 'search' && row.classList.contains(CLASS_SEARCH)) {
                    actions.push('search');
                }
                var id = this.getAttribute('data-input-' + actions[0]);
                if (!id) {
                    id = ++$ui.uuid;
                    opts || (opts = {});
                    opts = $.extend(opts, {
                        ref: this,
                        actions: actions.join(',')
                    });
                    new $input(opts);
                    for (var i = 0, len = actions.length; i < len; i++) {
                        this.setAttribute('data-input-' + actions[i], id);
                    }
                }

            });
        };
        $(SELECTOR_ACTION).input();
    });
})(window, document);
/**
 * @file lazyLoadImage组件
 */
;(function() {
    var imagesSequence = [];
    var imageIsLoading = false;
    var CLASS_LAZY = 'ui-lazy';

    var SELECTOR_LAZY = '.' + CLASS_LAZY;

    var render = function() {
        var _lli = this,
            opts = _lli.opts;
        _lli.pageContent = _lli.ref.find('.' + opts.lazyContent);
        if (_lli.pageContent.length === 0) return;
        _lli._lazyLoadImages = _lli.ref.find(SELECTOR_LAZY);
        if (_lli._lazyLoadImages.length === 0) return;
        _lli._lazyLoadImages.each(function() {
            if ($(this).data('src')) $(this).attr('src', opts.placeholderSrc);
            if ($(this).data('background')) $(this).css('background-image', 'url(' + opts.placeholderSrc + ')');
        });
        lazyHandler.call(_lli);
    };

    //绑定事件
    var bind = function() {
        var _lli = this;
        _lli.pageContent.on('scroll', $.proxy(lazyHandler, _lli));
        $(window).on('resize', $.proxy(lazyHandler, _lli));

    };

    var loadImage = function(el) {
        el = $(el);
        var bg = el.data('background');
        var src = bg ? bg : el.data('src');
        if (!src) return;

        function onLoad() {
            el[0].setAttribute('lazyLoaded', true);
            if (bg) {
                el.css('background-image', 'url(' + src + ')');
            } else {
                el.attr('src', src);
            }

            imageIsLoading = false;
            if (imagesSequence.length > 0) {
                loadImage(imagesSequence.shift());
            }
        }

        if (imageIsLoading) {
            if (imagesSequence.indexOf(el[0]) < 0) imagesSequence.push(el[0]);
            return;
        }

        // Loading flag
        imageIsLoading = true;

        var image = new Image();
        image.onload = onLoad;
        image.onerror = onLoad;
        image.src = src;
    }

    var lazyHandler = function() {
        var _lli = this;
        _lli._lazyLoadImages.each(function(index, el) {
            el = $(el);
            if (isElementInViewport(el[0])) {
                loadImage(el);
            }
        });
    }

    var isElementInViewport = function(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= (0) &&
            rect.left >= (0) &&
            rect.top <= (window.innerHeight) &&
            rect.left <= (window.innerWidth)
        );
    }

    define(function($ui) {
        //lazyLoadImage
        var $lazyLoadImage = $ui.define('LazyLoadImage', {
            placeholderSrc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXCwsK592mkAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==',
            lazyContent: 'ui-lazy-loader-content'
        });

        //初始化
        $lazyLoadImage.prototype.init = function() {
            var _lli = this,
                opts = _lli.opts;
            render.call(_lli);
            bind.call(_lli);

        };
        //注册$插件
        $.fn.lazyloadimage = function(opts) {
            var lazyLoadImageObjs = [];
            opts || (opts = {});
            this.each(function() {
                var lazyLoadImageObj = null;
                var id = this.getAttribute('data-lazyLoadImage');
                if (!id) {
                    opts = $.extend(opts, {
                        ref: this
                    });
                    id = ++$ui.uuid;
                    lazyLoadImageObj = $ui.data[id] = new $lazyLoadImage(opts);
                    this.setAttribute('data-lazyLoadImage', id);
                } else {
                    lazyLoadImageObj = $ui.data[id];
                }
                lazyLoadImageObjs.push(lazyLoadImageObj);
            });
            return lazyLoadImageObjs.length > 1 ? lazyLoadImageObjs : lazyLoadImageObjs[0];
        };

        /*module.exports = function(opts){
            return new botton(opts);
        };
    */
    });
})();
/**
 * @file navigator组件
 */

;(function() {
    var CLASS_NAVIGATOR_LIST = 'ui-navigator-list',
        CLASS_NAVIGATOR = 'ui-navigator';

    var CLASS_SCROLLER = 'ui-scroller';
    var CLASS_NAVIGATOR_WRAPPER = 'ui-navigator-wrapper';
    var render = function() {
        var _nav = this,
            opts = _nav.opts;
        _nav.$list = _nav.ref.find('ul').first();
        _nav.$bar = $('<span class="bar"></span>').appendTo(_nav.$list);
        // 处理直接通过ul初始化的情况
        if (_nav.ref.is('ul, ol')) {
            $list = _nav.ref.wrap('<div>');
            _nav.ref = _nav.ref.parent();
        }

        if (opts.index === undefined) {

            // 如果opts中没有指定index, 则尝试从dom中查看是否有比较为ui-state-active的
            opts.index = _nav.$list.find('.ui-state-active').index();

            // 没找到还是赋值为0
            ~opts.index || (opts.index = 0);
        }
        _nav.index = -1;
    };

    var bind = function() {
        var _nav = this,
            opts = _nav.opts;
        var left = _nav.$list.offset().left;
        _nav.$list.on(_nav.touchEve(),
            'li:not(.ui-state-disable)>a',
            function(e) {
                _switchTo.call(_nav, $(this).parent().index());
            });
        _nav.ref.on('select', function(e, index, li) {
            _nav.$bar.css({
                left: li.offsetLeft - left,
                width: li.childNodes[0].offsetWidth
            });
        });
    };


    /**
     * 切换到某个Tab
     * @method switchTo
     * @param {Number} index Tab编号
     * @chainable
     * @return {self} 返回本身。
     */
    var _switchTo = function(to, e) {
        var _nav = this,
            opts = _nav.opts;
        if (to === _nav.index) {
            return;
        }

        var list = _nav.$list.children(),
            cur;

        _nav.ref.trigger('beforeselect', [to, list.get(to)]);

        cur = list.removeClass('ui-state-active')
            .eq(to)
            .addClass('ui-state-active');

        _nav.index = to;
        _nav.ref.trigger('select', [to, cur[0]]);
        return _nav;
    };

    /**
     * 导航组件
     */
    define(function($ui) {
        var $nav = $ui.define('Navigator', {});

        //初始化
        $nav.prototype.init = function() {
            var _nav = this,
                opts = _nav.opts;
            _nav.ref.addClass(CLASS_NAVIGATOR_WRAPPER);
            new IScroll(_nav.ref[0], {
                scrollX: true,
                scrollY: false,
                disableMouse: true,
                disablePointer: true
            })
            render.call(_nav);
            bind.call(_nav);
            _nav.switchTo(opts.index);
        };

        /**
         * 切换到导航栏的某一项
         * @param {Number} to 序号
         * @method switchTo
         */
        $nav.prototype.switchTo = function(to) {
            return _switchTo.call(this, ~~to);
        };
        /**
         * 销毁组件
         * @method destroy
         */
        $nav.prototype.destroy = function() {

        };
        //注册$插件
        $.fn.navigator = function(opts) {
            var navObjs = [];
            opts || (opts = {});
            this.each(function() {
                var navObj = null;
                var id = this.getAttribute('data-nav');
                if (!id) {
                    opts = $.extend(opts, {
                        ref: this
                    });
                    id = ++$ui.uuid;
                    navObj = $ui.data[id] = new $nav(opts);
                    this.setAttribute('data-nav', id);
                } else {
                    navObj = $ui.data[id];
                }
                navObjs.push(navObj);
            });
            return navObjs.length > 1 ? navObjs : navObjs[0];
        };

    });
})();
/**
 * @file photoBrowser 组件
 */
;
(function($, window, undefined) {
    var animationEnd = $.fx.animationEnd;

    var CLASS_PHOTO_BROWSER = 'ui-photo-browser',
        CLASS_PHOTO_BROWSER_LIGHT = 'ui-photo-browser-light',
        CLASS_PHOTO_BROWSER_IN = 'ui-photo-browser-in',
        CLASS_PHOTO_BROWSER_OUT = 'ui-photo-browser-out',
        CLASS_PHOTO_BROWSER_CONTAINER = 'ui-photo-browser-container',
        CLASS_PHOTO_BROWSER_NAVBAR = 'ui-photo-browser-navbar',
        CLASS_NAVBAR_CENTER = 'ui-navbar-center',
        CLASS_PHOTO_BROWSER_CURRENT = 'ui-photo-browser-current',
        CLASS_PHOTO_BROWSER_TOTAL = 'ui-photo-browser-total',
        CLASS_PHOTO_BROWSER_TOOLBAR = 'ui-photo-browser-toolbar',
        CLASS_TOOLBAR_LINK = 'ui-toolbar-link',
        CLASS_ICON_PREV = 'ui-icon-prev',
        CLASS_ICON_NEXT = 'ui-icon-next',
        CLASS_PHOTO_BROWSER_CAPTIONS = 'ui-photo-browser-captions',
        CLASS_PHOTO_BROWSER_CAPTION = 'ui-photo-browser-caption',
        CLASS_SLIDER = 'ui-slider',
        CLASS_SLIDER_GROUP = 'ui-slider-group',
        CLASS_SLIDER_IMG = 'ui-slider-img',
        CLASS_SLIDER_ITEM = 'ui-slider-item',
        CLASS_PHOTO_BROWSER_CLOSE = 'ui-photo-browser-close',
        CLASS_PHOTO_BROWSER_BACK = 'ui-photo-browser-back',
        CLASS_PHOTO_BROWSER_LINK_INACTIVE = 'ui-photo-browser-link-inactive',
        CLASS_PHOTO_BROWSER_CAPTION_ACTIVE = 'ui-photo-browser-caption-active',
        CLASS_PHOTO_BROWSER_EXPOSED = 'ui-photo-browser-exposed';



    var SELECTOR_PHOTO_BROWSER = '.' + CLASS_PHOTO_BROWSER,
        SELECTOR_PHOTO_BROWSER_CONTAINER = '.' + CLASS_PHOTO_BROWSER_CONTAINER,
        SELECTOR_PHOTO_BROWSER_CURRENT = '.' + CLASS_PHOTO_BROWSER_CURRENT,
        SELECTOR_PHOTO_BROWSER_TOTAL = '.' + CLASS_PHOTO_BROWSER_TOTAL,
        SELECTOR_SLIDER = '.' + CLASS_SLIDER,
        SELECTOR_SLIDER_GROUP = '.' + CLASS_SLIDER_GROUP,
        SELECTOR_PHOTO_BROWSER_CLOSE = '.' + CLASS_PHOTO_BROWSER_CLOSE,
        SELECTOR_ICON_PREV = '.' + CLASS_ICON_PREV,
        SELECTOR_ICON_NEXT = '.' + CLASS_ICON_NEXT,
        SELECTOR_TOOLBAR_LINK = '.' + CLASS_TOOLBAR_LINK,
        SELECTOR_SLIDER_IMG = '.' + CLASS_SLIDER_IMG,
        SELECTOR_SLIDER_ITEM = '.' + CLASS_SLIDER_ITEM;

    var navbar = '<div class="' + CLASS_PHOTO_BROWSER_NAVBAR + '"> ' +
        '<div> <a class="' + CLASS_PHOTO_BROWSER_CLOSE + '"><i class="' + CLASS_PHOTO_BROWSER_BACK + '"></i><span>Close</span></a></div> ' +
        '<div class = "' + CLASS_NAVBAR_CENTER + '"> ' +
        '<span class = "' + CLASS_PHOTO_BROWSER_CURRENT + '">  </span> ' +
        '<span style="margin: 0 5px;">/ </span> ' +
        '<span class="' + CLASS_PHOTO_BROWSER_TOTAL + '"></span> ' +
        '</div> <div> ' +
        '</div> ' +
        '</div>';
    var toolbar = '<div class="' + CLASS_PHOTO_BROWSER_TOOLBAR + '">' +
        '<a class="' + CLASS_TOOLBAR_LINK + '">' +
        '<i class="' + CLASS_ICON_PREV + '"></i>' +
        '</a>' +
        '<a class="' + CLASS_TOOLBAR_LINK + '">' +
        '<i class="' + CLASS_ICON_NEXT + '"></i>' +
        '</a>' +
        '</div>';
    var captions = '<div class="' + CLASS_PHOTO_BROWSER_CAPTIONS + '"></div>';
    var caption = '<div class="' + CLASS_PHOTO_BROWSER_CAPTION + '" ><%=cont%></div>';

    var sliderWapll = '<div class="' + CLASS_SLIDER + '"><div class="' + CLASS_SLIDER_GROUP + '"></div></div>'
        //渲染组件
    var render = function() {
        var _pb = this,
            opts = _pb.opts,
            items;
        opts.light && _pb.ref.addClass(CLASS_PHOTO_BROWSER_LIGHT);
        _pb._navbar = $(navbar).appendTo(_pb.ref);
        _pb._toolbar = $(toolbar).appendTo(_pb.ref);
        _pb._container = _pb.ref.find(SELECTOR_PHOTO_BROWSER_CONTAINER);
        _pb.length = (items = _pb._container.children()).length;
        _pb._current = _pb._navbar.find(SELECTOR_PHOTO_BROWSER_CURRENT);
        _pb._current.html(opts.index + 1);
        _pb._total = _pb._navbar.find(SELECTOR_PHOTO_BROWSER_TOTAL);
        _pb._total.html(_pb.length);

        _pb._slider = $(sliderWapll).appendTo(_pb._container);
        items.appendTo(_pb._slider.find(SELECTOR_SLIDER_GROUP));
        _pb.ref.on(animationEnd, function() {
            _pb._container.css('display', 'block');
            _pb.slider = _pb._slider.slider(opts);
            _pb._current.html(opts.index + 1);
            if (opts.index == 0) {
                _pb._toolbar.find(SELECTOR_ICON_PREV).parent().addClass(CLASS_PHOTO_BROWSER_LINK_INACTIVE);
            } else if (opts.index == (_pb.length - 1)) {
                _pb._toolbar.find(SELECTOR_ICON_NEXT).parent().addClass(CLASS_PHOTO_BROWSER_LINK_INACTIVE);
            }
        });
        initCaptions.call(_pb);
    };
    //绑定事件
    var bind = function() {
        var _pb = this,
            opts = _pb.opts,
            canTap = true;
        _pb._toolbar.find(SELECTOR_ICON_PREV).parent().on(_pb.touchEve(), function(evt) {
            _pb.slider.prev();
        });
        _pb._toolbar.find(SELECTOR_ICON_NEXT).parent().on(_pb.touchEve(), function(evt) {
            _pb.slider.next();
        });
        _pb._slider.on('slide', function(evt, to, from) {
            _pb._current.html(to + 1);
            opts.index = to;
            if (to == 0) {
                _pb._toolbar.find(SELECTOR_ICON_PREV).parent().addClass(CLASS_PHOTO_BROWSER_LINK_INACTIVE);
            } else if (to == (_pb.length - 1)) {
                _pb._toolbar.find(SELECTOR_ICON_NEXT).parent().addClass(CLASS_PHOTO_BROWSER_LINK_INACTIVE);
            } else {
                _pb._toolbar.find(SELECTOR_TOOLBAR_LINK).removeClass(CLASS_PHOTO_BROWSER_LINK_INACTIVE);
            }
            _pb._captions[to] && (_pb._captions.removeClass(CLASS_PHOTO_BROWSER_CAPTION_ACTIVE) && $(_pb._captions[to]).addClass(CLASS_PHOTO_BROWSER_CAPTION_ACTIVE));
        });
        _pb._navbar.find(SELECTOR_PHOTO_BROWSER_CLOSE).on(_pb.touchEve(), function(evt) {
            _pb.close();
        });
        _pb._slider.find(SELECTOR_SLIDER_IMG).on('singleTap', function(evt) {
            if (!canTap) return;
            canTap = false;
            _pb._slider.find(SELECTOR_SLIDER_ITEM).css('transition-duration', '400ms');
            _pb.ref.toggleClass(CLASS_PHOTO_BROWSER_EXPOSED);
            canTap = true;
        })
    };

    var initCaptions = function() {
        var _pb = this,
            opts = _pb.opts;
        if (opts.captions.length > 0) {
            _pb._caption = $(captions).appendTo(_pb.ref);
            _pb._captionparseFn || (_pb._captionparseFn = _pb.parseTpl(caption));
            var caps = [];
            var item = {};
            $.each(opts.captions, function(index, el) {
                item.cont = el;
                caps[index] = _pb._captionparseFn(item);
            })
            _pb._captions = $(caps.join('')).appendTo(_pb._caption);
            _pb._captions[opts.index] && $(_pb._captions[opts.index]).addClass(CLASS_PHOTO_BROWSER_CAPTION_ACTIVE);

        }
    }


    define(function($ui) {
        //photoBrowser
        var $photoBrowser = $ui.define('PhotoBrowser', {
            /**
             * @property {Boolean} [loop=false] 是否连续滑动
             * @namespace options
             */
            loop: false,

            /**
             * @property {Number} [speed=400] 动画执行速度
             * @namespace options
             */
            speed: 400,

            /**
             * @property {Number} [index=0] 初始位置
             * @namespace options
             */
            index: 0,
            gestur: true,
            captions: [],
            light: false,
            space: 10

        });

        //初始化
        $photoBrowser.prototype.init = function() {
            render.call(this);
            bind.call(this);
        };

        $.extend($photoBrowser.prototype, {
            open: function(index) {
                this.ref.removeClass(CLASS_PHOTO_BROWSER_OUT).addClass(CLASS_PHOTO_BROWSER_IN);
                this.moveTo(index);
                return this;
            },
            moveTo: function(next) {
                var _pb = this,
                    opts = _pb.opts;
                if ($.chk(next)) {
                    if ($.chk(_pb.slider)) {
                        _pb.slider.slideTo(next);
                    } else {
                        opts.index = next;
                        _pb._captions[next] && (_pb._captions.removeClass(CLASS_PHOTO_BROWSER_CAPTION_ACTIVE) && $(_pb._captions[next]).addClass(CLASS_PHOTO_BROWSER_CAPTION_ACTIVE));
                    }
                }
                return this;
            },
            prev: function() {
                this.slider.prev();
                return this;
            },
            next: function() {
                this.slider.next();
                return this;
            },
            close: function() {
                this.ref.removeClass(CLASS_PHOTO_BROWSER_IN).addClass(CLASS_PHOTO_BROWSER_OUT);
                return this;
            }
        });

        //注册$插件
        $.fn.photobrowser = function(opts) {
            var photoBrowserObjs = [];
            opts || (opts = {});
            this.each(function() {
                var photoBrowserObj = null;
                var id = this.getAttribute('data-photoBrowser');
                if (!id) {
                    opts = $.extend(opts, {
                        ref: this
                    });
                    id = ++$ui.uuid;
                    photoBrowserObj = $ui.data[id] = new $photoBrowser(opts);
                    this.setAttribute('data-photoBrowser', id);
                } else {
                    photoBrowserObj = $ui.data[id];
                }
                photoBrowserObjs.push(photoBrowserObj);
            });
            return photoBrowserObjs.length > 1 ? photoBrowserObjs : photoBrowserObjs[0];
        };

    });
})($, window);
/**
 * @file refresh 组件
 */
;
(function() {

    var CLASS_PULL_TOP_POCKET = 'ui-pull-top-pocket';
    var CLASS_PULL_BOTTOM_POCKET = 'ui-pull-bottom-pocket';
    var CLASS_PULL = 'ui-pull';
    var CLASS_PULL_LOADING = 'ui-pull-loading';
    var CLASS_PULL_CAPTION = 'ui-pull-caption';

    var CLASS_ICON = 'ui-icon';
    var CLASS_SPINNER = 'fa fa-spinner fa-pulse';
    var CLASS_ICON_PULLDOWN = 'ui-icon-pulldown';

    var CLASS_BLOCK = 'ui-block';
    var CLASS_HIDDEN = 'ui-hidden';

    var CLASS_SCROLL = 'ui-scroll';
    var CLASS_SCROLL_WRAPPER = 'ui-scroll-wrapper';

    var CLASS_LOADING_UP = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_ICON_PULLDOWN;
    var CLASS_LOADING_DOWN = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_ICON_PULLDOWN;
    var CLASS_LOADING = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_SPINNER;

    var pocketHtml = ['<div class="' + CLASS_PULL + '">', '<div class="{icon}"></div>', '<div class="' + CLASS_PULL_CAPTION + '">{contentrefresh}</div>', '</div>'].join('');


    var render = function() {
        var _re = this,
            opts = _re.opts;
        _re.wrapper = _re.ref;
        _re.scrollEl = _re.wrapper.children().first();
        if (opts.down && opts.down.hasOwnProperty('callback')) {
            _re.topPocket = _re.scrollEl.find('.' + CLASS_PULL_TOP_POCKET);
            if (!_re.topPocket[0]) {
                _re.topPocket = createPocket(CLASS_PULL_TOP_POCKET, opts.down.contentrefresh, CLASS_LOADING_DOWN);
                _re.topPocket.insertBefore(_re.scrollEl);
            }
            _re.topLoading = _re.topPocket.find('.' + CLASS_PULL_LOADING);
            _re.topCaption = _re.topPocket.find('.' + CLASS_PULL_CAPTION);
        }
        if (opts.up && opts.up.hasOwnProperty('callback')) {
            _re.bottomPocket = _re.scrollEl.find('.' + CLASS_PULL_BOTTOM_POCKET);
            if (!_re.bottomPocket[0]) {
                _re.bottomPocket = createPocket(CLASS_PULL_BOTTOM_POCKET, opts.up.contentdown, CLASS_LOADING);
                _re.bottomPocket.appendTo(_re.scrollEl);
                _re.bottomPocket.addClass(CLASS_BLOCK);
                _re.bottomPocket.css('visibility', 'visible');
                // _re.initPullup = true;
            }
            _re.bottomLoading = _re.bottomPocket.find('.' + CLASS_PULL_LOADING);
            _re.bottomCaption = _re.bottomPocket.find('.' + CLASS_PULL_CAPTION);
        }
    };
    var angle = function(start, end) {
        var diff_x = end.x - start.x,
            diff_y = end.y - start.y;
        //返回角度,不是弧度
        return 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
    }

    var bind = function() {
        var _re = this,
            opts = _re.opts,
            touchesStart, touchesEnd;

        _re.scroller.on('scrollStart', function() {
            touchesStart = {
                x: this.pointX,
                y: this.pointY
            };
            if (!_re.loading) {
                _re.pulldown = _re.pullup = _re.pullPocket = _re.pullCaption = _re.pullLoading = false
            }
        });
        _re.scroller.on('scroll', function(e) {
            touchesEnd = {
                x: this.pointX,
                y: this.pointY
            }
            if (!(opts.enablePullup || opts.enablePulldown)) {
                _re.disableScroll();
            } else if (!opts.enablePullup) {
                if (this.distY < 0) {
                    _re.disableScroll();
                } else {
                    _re.enableScroll();
                }
            } else if (!opts.enablePulldown) {
                if (this.distY > 0) {
                    _re.disableScroll();
                } else {
                    _re.enableScroll();
                }
            }
            // console.log(angle(touchesEnd,touchesStart));
            // if(Math.abs(angle(touchesEnd,touchesStart)) < 30)return;
            if (!_re.pulldown && !_re.loading && _re.topPocket && this.directionY === -1 && this.y >= 0) {
                initPulldownRefresh.call(_re);
            }
            if (!_re.pullup && !_re.finished && !_re.loading && _re.topPocket && this.directionY === 1 && this.y < 0) {
                initPullupRefresh.call(_re);
            }
            if (_re.pulldown) {
                setCaption.call(_re, this.y > opts.down.height ? opts.down.contentover : opts.down.contentdown);
            }

            if (this.maxScrollY == -1) {
                this.maxScrollY = 0 - opts.up.height;
            }
            var disY = this.maxScrollY - this.y
            if (_re.pullup && !_re.finished && disY > 10) {
                _re.autoUpHidden = false;
                setCaption.call(_re, Math.abs(this.y) > opts.up.height ? opts.up.contentover : opts.up.contentdown);
            } else if (disY < 10 && disY > 0 - opts.up.height) {
                if (_re.pullup && !_re.loading && !_re.finished) {
                    !opts.up.display && (_re.autoUpHidden = true)
                }
            }
            if (_re.pulldown && this.y > 0 && this.y < opts.down.height) {
                _re.autoDownHidden = true;
            } else {
                _re.autoDownHidden = false;
            }
        });

        _re.scroller.on('scrollEnd', function(e) {
            if (_re.autoUpHidden) {
                _re.autoUpHidden = false;
                _re.scroller.scrollTo(0, 0, _re.scroller.options.bounceTime, _re.scroller.options.bounceEasing);
                _re.ref.trigger('cancelRefresh');
            } else if (_re.pulldown && _re.autoDownHidden) {
                _re.autoDownHidden = false;
                _re.ref.trigger('cancelRefresh');
            }

        });

        var _resetPosition = _re.scroller.resetPosition;
        $.extend(_re.scroller, {
            resetPosition: function(time) {
                if (_re.pulldown && this.y >= opts.down.height) {
                    _re.pulldownLoading();
                    return true;
                }
                if (this.maxScrollY == -1) {
                    this.maxScrollY = 0 - opts.up.height;
                }
                var disY = this.maxScrollY - this.y
                if (_re.pullup && disY > 10 && !_re.loading && !_re.finished) {
                    _re.pullupLoading();
                    return true;
                }
                return _resetPosition.call(_re.scroller, time);
            }
        });

    };

    var initPulldownRefresh = function() {
        var _re = this,
            opts = _re.opts;
        if (!opts.enablePulldown) {
            return;
        }
        _re.ref.trigger('beforeRefresh');
        _re.pulldown = true;
        _re.pullup = false;
        _re.pullPocket = _re.topPocket;
        _re.pullPocket.addClass(CLASS_BLOCK);
        _re.pullPocket.css('visibility', 'visible');
        _re.pullCaption = _re.topCaption;
        _re.pullLoading = _re.topLoading;
    };
    var initPullupRefresh = function() {
        var _re = this,
            opts = _re.opts;
        if (!opts.enablePullup) {
            return;
        }
        _re.ref.trigger('beforeRefresh');
        _re.pulldown = false;
        _re.pullup = true;
        _re.pullPocket = _re.bottomPocket;
        _re.pullCaption = _re.bottomCaption;
        _re.pullLoading = _re.bottomLoading;
        // _re.scroller.refresh();
    };

    var resetPosition = function(scroller) {
        var _re = this,
            opts = _re.opts;
        if (_re.pulldown && scroller.y >= opts.down.height) {
            _re.pulldownLoading();
            return true;
        }
    };

    var createPocket = function(clazz, content, iconClass) {
        var pocket = document.createElement('div');
        pocket.className = clazz;
        pocket.innerHTML = pocketHtml.replace('{contentrefresh}', content).replace('{icon}', iconClass);
        return $(pocket);
    };

    var setCaption = function(title, reset) {
        var _re = this,
            opts = _re.opts;
        if (_re.loading) {
            return;
        }
        var pocket = _re.pullPocket[0];
        var caption = _re.pullCaption[0];
        var loading = _re.pullLoading[0];
        var isPulldown = _re.pulldown;
        if (pocket) {
            if (reset) {
                caption.innerHTML = '';
                loading.className = '';
                loading.style.webkitAnimation = "";
                loading.style.webkitTransition = "";
                loading.style.webkitTransform = "";
            } else {
                if (title !== _re.lastTitle) {
                    caption.innerHTML = title;
                    if (isPulldown) {
                        caption.innerHTML = title;
                        if (title === opts.down.contentrefresh) {
                            loading.className = CLASS_LOADING;
                            loading.style.webkitAnimation = "spinner-spin 1s step-end infinite";
                        } else if (title === opts.down.contentover) {
                            loading.className = CLASS_LOADING_UP;
                            loading.style.webkitTransition = "-webkit-transform 0.3s ease-in";
                            loading.style.webkitTransform = "rotate(180deg)";
                        } else if (title === opts.down.contentdown) {
                            loading.className = CLASS_LOADING_DOWN;
                            loading.style.webkitTransition = "-webkit-transform 0.3s ease-in";
                            loading.style.webkitTransform = "rotate(0deg)";
                        }
                    } else {
                        if (title === opts.up.contentrefresh) {
                            $(loading).css('display', 'inline-block');
                            $(loading).css('visibility', 'visible');
                            if ($.os.android && ($.os.version == '4.3')) {
                                $('html').css('visibility', 'hidden');
                                setTimeout(function() {
                                    $('html').css('visibility', 'visible');
                                }, 80);
                            }
                        } else {
                            loading.style.display = 'none';
                        }
                    }
                    _re.lastTitle = title;
                }
            }

        }
    };

    /**
     * 刷新组件
     */
    define(function($ui) {
        var $refresh = $ui.define('Refresh', {
            down: {
                height: 50,
                contentdown: '下拉可以刷新',
                contentover: '释放立即刷新',
                contentrefresh: '正在刷新...'
            },
            up: {
                height: 40,
                display: true,
                contentdown: '上拉显示更多',
                contentover: '释放立即刷新',
                contentrefresh: '正在加载...',
                contentnomore: '没有更多数据了'
            },
            enablePulldown: true,
            enablePullup: true,

        });

        //初始化
        $refresh.prototype.init = function() {
            var _re = this,
                opts = _re.opts;

            _re.ref.addClass(CLASS_SCROLL_WRAPPER);
            _re.ref.children().wrapAll('<div class = "' + CLASS_SCROLL + '"/>');
            _re.scroller = new IScroll(_re.ref[0], {
                scrollY: true,
                scrollX: false,
                bounceTime: 300,
                bounceEasing: 'quadratic',
                probeType: 2, //每滚动一像素触发
                disableMouse: true,
                disablePointer: true
            })
            render.call(_re);
            bind.call(_re);
        };


        $refresh.prototype.pulldownLoading = function() {
            var _re = this,
                opts = _re.opts;
            if (!opts.enablePulldown) {
                return;
            }
            var time = _re.scroller.options.bounceTime;
            _re.scroller.scrollTo(0, opts.down.height, time, IScroll.utils.ease.circular);
            if (_re.loading) {
                return;
            }
            initPulldownRefresh.call(_re);
            setCaption.call(_re, opts.down.contentrefresh);
            _re.loading = true;
            var callback = opts.down.callback;
            callback && callback.call(_re);
        };

        $refresh.prototype.pullupLoading = function(callback) {
            var _re = this,
                opts = _re.opts;
            if (!opts.enablePullup) {
                return;
            }
            var time = _re.scroller.options.bounceTime;
            _re.scroller.scrollTo(0, _re.scroller.maxScrollY, time, _re.scroller.options.bounceEasing);
            if (_re.loading) {
                return;
            }
            initPullupRefresh.call(_re);
            setCaption.call(_re, opts.up.contentrefresh);
            _re.loading = true;
            callback = callback || opts.up.callback;
            callback && callback.call(this);
        };



        $refresh.prototype.endPulldownToRefresh = function() {
            var _re = this,
                opts = _re.opts;
            if (_re.topPocket && _re.loading && _re.pulldown) {
                _re.scroller.scrollTo(0, 0, _re.scroller.options.bounceTime, _re.scroller.options.bounceEasing);
                _re.loading = false;
                setCaption.apply(_re, [opts.down.contentdown, true]);
                setTimeout(function() {
                    _re.scroller.refresh();
                    _re.loading || _re.topPocket.css('visibility', 'hidden');
                    _re.ref.trigger('afterRefresh');
                }, 150);
            }
        };

        $refresh.prototype.endPullupToRefresh = function(finished) {
            var _re = this,
                opts = _re.opts;
            if (!opts.up.display) _re.scroller.scrollTo(0, 0, _re.scroller.options.bounceTime, _re.scroller.options.bounceEasing);
            if (_re.bottomPocket && _re.loading && !_re.pulldown) {
                _re.loading = false;
                if (finished) {
                    _re.finished = true;
                    setCaption.call(_re, opts.up.contentnomore);
                    _re.scroller.refresh();
                    _re.ref.trigger('finished');
                } else {
                    setCaption.call(_re, opts.up.contentdown);
                    setTimeout(function() {
                        _re.scroller.refresh();
                        _re.ref.trigger('afterRefresh');
                    }, 150);
                }
            }
        };

        $refresh.prototype.disablePulldown = function() {
            var _re = this,
                opts = _re.opts;
            opts.enablePulldown = false;
        };

        $refresh.prototype.disablePullup = function() {
            var _re = this,
                opts = _re.opts;
            opts.enablePullup = false;
        };

        $refresh.prototype.enablePulldown = function() {
            var _re = this,
                opts = _re.opts;
            opts.enablePulldown = true;
        };

        $refresh.prototype.enablePullup = function() {
            var _re = this,
                opts = _re.opts;
            opts.enablePullup = true;
        };

        $refresh.prototype.disableScroll = function() {
            var _re = this;
            co.verticalSwipe = false
        };

        $refresh.prototype.enableScroll = function() {
            var _re = this;
            co.verticalSwipe = true
        };

        /**
         * 销毁组件
         * @method destroy
         */
        $refresh.prototype.destroy = function() {

        };
        //注册$插件
        $.fn.refresh = function(opts) {
            var refObjs = [];
            opts || (opts = {});
            this.each(function() {
                var refObj = null;
                var id = this.getAttribute('data-ref');
                if (!id) {
                    opts = $.extend(opts, {
                        ref: this
                    });
                    id = ++$ui.uuid;
                    refObj = $ui.data[id] = new $refresh(opts);
                    this.setAttribute('data-ref', id);
                } else {
                    refObj = $ui.data[id];
                }
                refObjs.push(refObj);
            });
            return refObjs.length > 1 ? refObjs : refObjs[0];
        };

    });
})();
/**
 * @file searchbar组件
 */
;
(function() {
    var previousQuery = '',
        diacriticsMap = {};

    var CLASS_SEARCHBAR_NOT_FOUND = 'ui-searchbar-not-found',
        CLASS_SEARCHBAR_OVERLAY = 'ui-searchbar-overlay',
        CLASS_SEARCHBAR_CANCEL = 'ui-searchbar-cancel',
        CLASS_SEARCHBAR_CONTAINER = 'ui-searchbar-container',
        CLASS_SEARCHBAR_CONTENT = 'ui-searchbar-content',
        CLASS_SEARCHBAR_LIST = 'ui-searchbar-list',
        CLASS_SEARCHBAR_ACTIVE = 'ui-searchbar-active',
        CLASS_SEARCHBAR_OVERLAY_ACTIVE = 'ui-searchbar-overlay-active',
        CLASS_SEARCHBAR_NOT_EMPTY = 'ui-searchbar-not-empty',
        CLASS_HIDDEN_BY_SEARCHBAR = 'ui-hidden-by-searchbar',
        CLASS_SEARCHBAR_CLEAR = 'ui-searchbar-clear',
        CLASS_SEARCHBAR_ITEM = 'ui-searchbar-item',
        CLASS_SEARCHBAR_KEY = 'ui-searchbar-key',
        CLASS_SEARCHBAR_IGNORE = 'ui-searchbar-ignore';

    var SELECTOR_SEARCHBAR_CONTAINER = '.' + CLASS_SEARCHBAR_CONTAINER,
        SELECTOR_SEARCHBAR_CONTENT = '.' + CLASS_SEARCHBAR_CONTENT,
        SELECTOR_SEARCHBAR_LIST = '.' + CLASS_SEARCHBAR_LIST,
        SELECTOR_SEARCHBAR_ITEM = '.' + CLASS_SEARCHBAR_ITEM,
        SELECTOR_SEARCHBAR_KEY = '.' + CLASS_SEARCHBAR_KEY,
        SELECTOR_SEARCHBAR_IGNORE = '.' + CLASS_SEARCHBAR_IGNORE;

    var notFound = '<div class="list-block ' + CLASS_SEARCHBAR_NOT_FOUND + '"> <ul >' +
        '<li class = "item-content" >' +
        '<div class = "item-inner" >' +
        '<div class = "item-title" > 没有搜索结果 </div> </div> </li> </ul> </div>';
    var overlay = '<div class="' + CLASS_SEARCHBAR_OVERLAY + '"></div>';
    var cancel = '<a class="' + CLASS_SEARCHBAR_CANCEL + '"></a>';
    var clear = '<a class="' + CLASS_SEARCHBAR_CLEAR + '"></a>';
    //渲染
    var render = function() {
        var _sc = this,
            opts = _sc.opts;

        _sc._container = _sc.ref.find(SELECTOR_SEARCHBAR_CONTAINER);
        if (_sc._container.length === 0) return;
        _sc._content = _sc.ref.find(SELECTOR_SEARCHBAR_CONTENT);
        container = _sc._container;

        _sc.active = false;

        // Input
        _sc._input = container.find('input[type="search"]');
        _sc._clearButton = $(clear).insertAfter(_sc._input);
        _sc._cancelButton = $(cancel).text(opts.cancel).appendTo(container);
        opts.cancelWidth = _sc._cancelButton.css('display', 'block').width();

        // Search List
        _sc._searchList = _sc.ref.find(SELECTOR_SEARCHBAR_LIST);
        _sc._overlay = $(overlay).appendTo(_sc.ref);

        // Found and not found
        _sc._found = _sc._searchList;
        _sc._notFound = $(notFound).appendTo(_sc._content);

    };

    //绑定事件
    var bind = function() {
        var _sc = this,
            opts = _sc.opts,
            container = _sc._container;

        container.on('submit', preventSubmit);
        _sc._cancelButton.on(_sc.touchEve(), $.proxy(_sc.disable, _sc));
        _sc._overlay.on(_sc.touchOver(), function(evt) {
            _sc.disable();
            _sc.preventDefault(evt);
        });
        _sc._input.on('focus', $.proxy(_sc.enable, _sc));
        _sc._input.on('change keydown keypress keyup', $.proxy(_sc.handleInput, _sc));
        _sc._clearButton.on(_sc.touchEve(), $.proxy(_sc.clear, _sc));
    };

    var preventSubmit = function(e) {
        e.preventDefault();
    };

    var initDiacritics = function() {
        // Diacritics
        var defaultDiacriticsRemovalap = [{
            base: 'A',
            letters: '\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'
        }, {
            base: 'AA',
            letters: '\uA732'
        }, {
            base: 'AE',
            letters: '\u00C6\u01FC\u01E2'
        }, {
            base: 'AO',
            letters: '\uA734'
        }, {
            base: 'AU',
            letters: '\uA736'
        }, {
            base: 'AV',
            letters: '\uA738\uA73A'
        }, {
            base: 'AY',
            letters: '\uA73C'
        }, {
            base: 'B',
            letters: '\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'
        }, {
            base: 'C',
            letters: '\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'
        }, {
            base: 'D',
            letters: '\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779'
        }, {
            base: 'DZ',
            letters: '\u01F1\u01C4'
        }, {
            base: 'Dz',
            letters: '\u01F2\u01C5'
        }, {
            base: 'E',
            letters: '\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'
        }, {
            base: 'F',
            letters: '\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'
        }, {
            base: 'G',
            letters: '\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'
        }, {
            base: 'H',
            letters: '\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'
        }, {
            base: 'I',
            letters: '\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'
        }, {
            base: 'J',
            letters: '\u004A\u24BF\uFF2A\u0134\u0248'
        }, {
            base: 'K',
            letters: '\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'
        }, {
            base: 'L',
            letters: '\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'
        }, {
            base: 'LJ',
            letters: '\u01C7'
        }, {
            base: 'Lj',
            letters: '\u01C8'
        }, {
            base: 'M',
            letters: '\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'
        }, {
            base: 'N',
            letters: '\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'
        }, {
            base: 'NJ',
            letters: '\u01CA'
        }, {
            base: 'Nj',
            letters: '\u01CB'
        }, {
            base: 'O',
            letters: '\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'
        }, {
            base: 'OI',
            letters: '\u01A2'
        }, {
            base: 'OO',
            letters: '\uA74E'
        }, {
            base: 'OU',
            letters: '\u0222'
        }, {
            base: 'OE',
            letters: '\u008C\u0152'
        }, {
            base: 'oe',
            letters: '\u009C\u0153'
        }, {
            base: 'P',
            letters: '\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'
        }, {
            base: 'Q',
            letters: '\u0051\u24C6\uFF31\uA756\uA758\u024A'
        }, {
            base: 'R',
            letters: '\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'
        }, {
            base: 'S',
            letters: '\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'
        }, {
            base: 'T',
            letters: '\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'
        }, {
            base: 'TZ',
            letters: '\uA728'
        }, {
            base: 'U',
            letters: '\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'
        }, {
            base: 'V',
            letters: '\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'
        }, {
            base: 'VY',
            letters: '\uA760'
        }, {
            base: 'W',
            letters: '\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'
        }, {
            base: 'X',
            letters: '\u0058\u24CD\uFF38\u1E8A\u1E8C'
        }, {
            base: 'Y',
            letters: '\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'
        }, {
            base: 'Z',
            letters: '\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'
        }, {
            base: 'a',
            letters: '\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'
        }, {
            base: 'aa',
            letters: '\uA733'
        }, {
            base: 'ae',
            letters: '\u00E6\u01FD\u01E3'
        }, {
            base: 'ao',
            letters: '\uA735'
        }, {
            base: 'au',
            letters: '\uA737'
        }, {
            base: 'av',
            letters: '\uA739\uA73B'
        }, {
            base: 'ay',
            letters: '\uA73D'
        }, {
            base: 'b',
            letters: '\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'
        }, {
            base: 'c',
            letters: '\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'
        }, {
            base: 'd',
            letters: '\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'
        }, {
            base: 'dz',
            letters: '\u01F3\u01C6'
        }, {
            base: 'e',
            letters: '\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'
        }, {
            base: 'f',
            letters: '\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'
        }, {
            base: 'g',
            letters: '\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'
        }, {
            base: 'h',
            letters: '\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'
        }, {
            base: 'hv',
            letters: '\u0195'
        }, {
            base: 'i',
            letters: '\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'
        }, {
            base: 'j',
            letters: '\u006A\u24D9\uFF4A\u0135\u01F0\u0249'
        }, {
            base: 'k',
            letters: '\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'
        }, {
            base: 'l',
            letters: '\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'
        }, {
            base: 'lj',
            letters: '\u01C9'
        }, {
            base: 'm',
            letters: '\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'
        }, {
            base: 'n',
            letters: '\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'
        }, {
            base: 'nj',
            letters: '\u01CC'
        }, {
            base: 'o',
            letters: '\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'
        }, {
            base: 'oi',
            letters: '\u01A3'
        }, {
            base: 'ou',
            letters: '\u0223'
        }, {
            base: 'oo',
            letters: '\uA74F'
        }, {
            base: 'p',
            letters: '\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'
        }, {
            base: 'q',
            letters: '\u0071\u24E0\uFF51\u024B\uA757\uA759'
        }, {
            base: 'r',
            letters: '\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'
        }, {
            base: 's',
            letters: '\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'
        }, {
            base: 't',
            letters: '\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'
        }, {
            base: 'tz',
            letters: '\uA729'
        }, {
            base: 'u',
            letters: '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'
        }, {
            base: 'v',
            letters: '\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'
        }, {
            base: 'vy',
            letters: '\uA761'
        }, {
            base: 'w',
            letters: '\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'
        }, {
            base: 'x',
            letters: '\u0078\u24E7\uFF58\u1E8B\u1E8D'
        }, {
            base: 'y',
            letters: '\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'
        }, {
            base: 'z',
            letters: '\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'
        }];

        var diacriticsMap = {};
        for (var i = 0; i < defaultDiacriticsRemovalap.length; i++) {
            var letters = defaultDiacriticsRemovalap[i].letters;
            for (var j = 0; j < letters.length; j++) {
                diacriticsMap[letters[j]] = defaultDiacriticsRemovalap[i].base;
            }
        }
    };



    define(function($ui) {
        //searchbar
        var $searchbar = $ui.define('Searchbar', {
            customSearch: false,
            cancel: '取消'
        });

        //初始化
        $searchbar.prototype.init = function() {
            render.call(this);
            bind.call(this);
        };

        // Enable/disalbe
        $searchbar.prototype.enable = function(e) {
            var _sc = this,
                opts = _sc.opts,
                container = _sc._container;

            function _enable() {
                if (_sc.active) return;
                if (_sc._searchList.length && !container.hasClass(CLASS_SEARCHBAR_ACTIVE)) _sc._overlay.addClass(CLASS_SEARCHBAR_OVERLAY_ACTIVE);
                container.addClass(CLASS_SEARCHBAR_ACTIVE);

                container.animate({
                    'padding-right': (opts.cancelWidth + 15) + 'px'
                }, 100, function() {
                    _sc._cancelButton.transition(0).show();
                    _sc._cancelButton.animate({
                        'margin-right': '0px'
                    }, 100);
                });
                (!e && !_sc.active) && (_sc.active = true && _sc._input.focus())
                $(document.body).css('overflowY', 'hidden');
                _sc._content.css('overflowY', 'hidden');
                _sc.ref.trigger('enableSearch');
                _sc.active = true;
            }
            if ($.os.ios) {
                setTimeout(function() {
                    _enable();
                }, 400);
            } else {
                _enable();
            }
            return this;
        };

        $searchbar.prototype.disable = function() {
            var _sc = this,
                opts = _sc.opts,
                container = _sc._container;

            function _disable() {
                _sc.ref.trigger('disableSearch');
                _sc.active = false;
                _sc._input.val('').trigger('change');
                container.removeClass(CLASS_SEARCHBAR_ACTIVE + ' ' + CLASS_SEARCHBAR_NOT_EMPTY);
                _sc._cancelButton.animate({
                    'margin-right': (-_sc._cancelButton[0].offsetWidth) + 'px'
                }, 100, function() {
                    _sc._cancelButton.transition('').hide();
                    container.animate({
                        'padding-right': '8px'
                    }, 100);
                });
                $(document.body).css('overflowY', 'scroll');
                _sc._content.css('overflowY', 'scroll');
                if (_sc._searchList.length) _sc._overlay.removeClass(CLASS_SEARCHBAR_OVERLAY_ACTIVE);
            }
            _sc._input.blur();
            if ($.os.ios) {
                setTimeout(function() {
                    _disable();
                }, 400);
            } else {
                _disable();
            }
            return this;
        };

        // Clear
        $searchbar.prototype.clear = function() {
            var _sc = this;
            _sc._input.val('').trigger('change').focus();
            _sc.ref.trigger('clearSearch');
            return this;
        };



        // Search
        $searchbar.prototype.handleInput = function() {
            var _sc = this,
                opts = _sc.opts,
                container = _sc._container;
            setTimeout(function() {
                var value = _sc._input.val().trim();
                // Add active/inactive classes on overlay
                if (value.length === 0) {
                    container.removeClass(CLASS_SEARCHBAR_NOT_EMPTY);
                    if (_sc._searchList.length && container.hasClass(CLASS_SEARCHBAR_ACTIVE)) _sc._overlay.addClass(CLASS_SEARCHBAR_OVERLAY_ACTIVE);
                } else {
                    container.addClass(CLASS_SEARCHBAR_NOT_EMPTY);
                    if (_sc._searchList.length && container.hasClass(CLASS_SEARCHBAR_ACTIVE)) _sc._overlay.removeClass(CLASS_SEARCHBAR_OVERLAY_ACTIVE);
                }
                if (_sc._searchList.length > 0) _sc.search(value);
            }, 0);
        };

        $searchbar.prototype.search = function(query) {
            var _sc = this,
                opts = _sc.opts,
                container = _sc._container;
            if (query.trim() === previousQuery) return;
            previousQuery = query.trim();


            if (opts.customSearch) {
                _sc.ref.trigger('search', [query]);
                return;
            }

            var foundItems = [];

            var values = query.trim().toLowerCase().split(' ');
            _sc._searchList.find(SELECTOR_SEARCHBAR_ITEM).removeClass(CLASS_HIDDEN_BY_SEARCHBAR).each(function(index, el) {
                el = $(el);
                var compareWithText = [];
                el.find(SELECTOR_SEARCHBAR_KEY).each(function() {
                    var itemText = $(this).text().trim().toLowerCase();
                    compareWithText.push(itemText);
                });
                compareWithText = compareWithText.join(' ');
                var wordsMatch = 0;
                for (var i = 0; i < values.length; i++) {
                    if (compareWithText.indexOf(values[i]) >= 0) wordsMatch++;
                }
                if (wordsMatch !== values.length && !(el.is(SELECTOR_SEARCHBAR_IGNORE))) {
                    el.addClass(CLASS_HIDDEN_BY_SEARCHBAR);
                } else {
                    foundItems.push(el[0]);
                }
            });

            _sc.ref.trigger('search', [query, foundItems]);
            if (foundItems.length === 0) {
                _sc._notFound.show();
                _sc._found.hide();
            } else {
                _sc._notFound.hide();
                _sc._found.show();
            }
            return this;
        };

        $searchbar.prototype.destroy = function() {

        };
        //注册$插件
        $.fn.searchbar = function(opts) {
            var searchbarObjs = [];
            opts || (opts = {});
            this.each(function() {
                var searchbarObj = null;
                var id = this.getAttribute('data-searchbar');
                if (!id) {
                    opts = $.extend(opts, {
                        ref: this
                    });
                    id = ++$ui.uuid;
                    searchbarObj = $ui.data[id] = new $searchbar(opts);
                    this.setAttribute('data-searchbar', id);
                } else {
                    searchbarObj = $ui.data[id];
                }
                searchbarObjs.push(searchbarObj);
            });
            return searchbarObjs.length > 1 ? searchbarObjs : searchbarObjs[0];
        };
        /*module.exports = function(opts){
            return new searchbar(opts);
        };
    */
    });
})();
/**
 * @file 滑动列表组件
 */
;
(function() {


    var CLASS_SWIPEOUT = 'ui-swipeout',
        CLASS_SWIPEOUT_DELETE = 'ui-swipeout-delete',
        CLASS_SWIPEOUT_CONTENT = 'ui-swipeout-content',
        CLASS_SWIPEOUT_ACTIONS_RIGHT = 'ui-swipeout-actions-right',
        CLASS_SWIPEOUT_ACTIONS_LEFT = 'ui-swipeout-actions-left',
        CLASS_SWIPEOUT_ACTIONS_OPENED = 'ui-swipeout-actions-opened',
        CLASS_SWIPEOUT_ACTIONS_NO_FOLD = 'ui-swipeout-actions-no-fold',
        CLASS_SWIPEOUT_OVERSWIPE = 'ui-swipeout-overswipe',
        CLASS_SWIPEOUT_OPENED = 'ui-swipeout-opened',
        CLASS_SWIPEOUT_DELETING = 'ui-swipeout-deleting',
        CLASS_SWIPEOUT_TRANSITIONING = 'ui-swipeout-transitioning';

    var SELECTOR_SWIPEOUT = '.' + CLASS_SWIPEOUT,
        SELECTOR_SWIPEOUT_DELETE = '.' + CLASS_SWIPEOUT_DELETE,
        SELECTOR_SWIPEOUT_CONTENT = '.' + CLASS_SWIPEOUT_CONTENT,
        SELECTOR_SWIPEOUT_ACTIONS_RIGHT = '.' + CLASS_SWIPEOUT_ACTIONS_RIGHT,
        SELECTOR_SWIPEOUT_ACTIONS_LEFT = '.' + CLASS_SWIPEOUT_ACTIONS_LEFT,
        SELECTOR_SWIPEOUT_ACTIONS_OPENED = '.' + CLASS_SWIPEOUT_ACTIONS_OPENED,
        SELECTOR_SWIPEOUT_OVERSWIPE = '.' + CLASS_SWIPEOUT_OVERSWIPE;

    var render = function() {
        var _sl = this;
        _sl.allowSwipeout = true;
        _sl.swipeoutOpenedEl = undefined;
        _sl.isTouched = false;
        _sl.isMoved = false;
        _sl.touchesStart = {};
        _sl.touchStartTime = undefined;
        _sl.touchesDiff = undefined;
        _sl.swipeOutEl = _sl.ref;
        _sl.swipeOutContent = undefined;
        _sl.actionsRight = undefined;
        _sl.actionsLeft = undefined;
        _sl.actionsLeftWidth = undefined;
        _sl.actionsRightWidth = undefined;
        _sl.translate = undefined;
        _sl.opened = undefined;
        _sl.closed = undefined;
        _sl.openedActions = undefined;
        _sl.buttonsLeft = undefined;
        _sl.buttonsRight = undefined;
        _sl.direction = undefined;
        _sl.overswipeLeftButton = undefined;
        _sl.overswipeRightButton = undefined;
        _sl.overswipeLeft = false;
        _sl.overswipeRight = false;
        _sl.noFoldLeft = undefined;
        _sl.noFoldRight = undefined;
    };

    //绑定事件
    var bind = function() {
        var _sl = this;
        $(document).on(_sl.touchStart(), function(e) {
            if (_sl.swipeoutOpenedEl) {
                var target = $(e.target);
                if (!(
                        _sl.swipeoutOpenedEl.is(target[0]) || target.parent().is(SELECTOR_SWIPEOUT_ACTIONS_RIGHT) ||
                        target.parent().is(SELECTOR_SWIPEOUT_ACTIONS_LEFT) || target.parents(SELECTOR_SWIPEOUT).is(_sl.swipeoutOpenedEl)
                    )) {
                    _sl.close();
                }
            }
        });

        _sl.ref.on(_sl.touchStart(), $.proxy(handleEvent, _sl));
        _sl.ref.on(_sl.touchMove(), $.proxy(handleEvent, _sl));
        _sl.ref.on(_sl.touchEnd(), $.proxy(handleEvent, _sl));

        _sl.ref.find(SELECTOR_SWIPEOUT_DELETE).on(_sl.touchEve(), function(evt) {
            _sl.deleteBefore();
        });
    };

    var handleEvent = function(evt) {
        var _sl = this;
        switch (evt.type) {
            case 'touchstart':
            case 'mousedown':
                handleTouchStart.call(_sl, evt);
                break;
            case 'touchmove':
            case 'mousemove':
                handleTouchMove.call(_sl, evt);
                break;
            case 'touchend':
            case 'mouseup':
            case 'mouseout':
                handleTouchEnd.call(_sl, evt);
                break;
        }
    };

    var angle = function(start, end) {
        var diff_x = end.x - start.x,
            diff_y = end.y - start.y;
        //返回角度,不是弧度
        return 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
    };

    var handleTouchStart = function(e) {
        var _sl = this;
        if (!_sl.allowSwipeout || _sl.opened) return;
        _sl.isMoved = false;
        _sl.isTouched = true;
        _sl.touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
        _sl.touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
        _sl.touchStartTime = (new Date()).getTime();
    };

    var handleTouchMove = function(e) {
        var _sl = this;
        e.stopPropagation();
        if (!_sl.isTouched) return;
        var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
        var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
        var touchesEnd = {};
        touchesEnd.x = pageX;
        touchesEnd.y = pageY;
        if (Math.abs(angle(_sl.touchesStart, touchesEnd)) > 20) return;
        if (!_sl.isMoved) {
            _sl.swipeOutContent = _sl.swipeOutEl.find(SELECTOR_SWIPEOUT_CONTENT);
            _sl.actionsRight = _sl.swipeOutEl.find(SELECTOR_SWIPEOUT_ACTIONS_RIGHT);
            _sl.actionsLeft = _sl.swipeOutEl.find(SELECTOR_SWIPEOUT_ACTIONS_LEFT);
            _sl.actionsLeftWidth = _sl.actionsRightWidth = _sl.buttonsLeft = _sl.buttonsRight = _sl.overswipeRightButton = _sl.overswipeLeftButton = null;
            _sl.noFoldLeft = _sl.actionsLeft.hasClass(CLASS_SWIPEOUT_ACTIONS_NO_FOLD) || false;
            _sl.noFoldRight = _sl.actionsRight.hasClass(CLASS_SWIPEOUT_ACTIONS_NO_FOLD) || false;
            if (_sl.actionsLeft.length > 0) {
                _sl.actionsLeftWidth = _sl.actionsLeft.outerWidth();
                _sl.buttonsLeft = _sl.actionsLeft.children('span');
                _sl.overswipeLeftButton = _sl.actionsLeft.find(SELECTOR_SWIPEOUT_OVERSWIPE);
            }
            if (_sl.actionsRight.length > 0) {
                _sl.actionsRightWidth = _sl.actionsRight.outerWidth();
                _sl.buttonsRight = _sl.actionsRight.children('span');
                _sl.overswipeRightButton = _sl.actionsRight.find(SELECTOR_SWIPEOUT_OVERSWIPE);
            }
            _sl.opened = _sl.swipeOutEl.hasClass(CLASS_SWIPEOUT_OPENED);
            if (_sl.opened) {
                _sl.openedActions = _sl.swipeOutEl.find(SELECTOR_SWIPEOUT_ACTIONS_LEFT + SELECTOR_SWIPEOUT_ACTIONS_OPENED).length > 0 ? 'left' : 'right';
            }
            _sl.swipeOutEl.removeClass(CLASS_SWIPEOUT_TRANSITIONING);
            if (!false) {
                _sl.swipeOutEl.find(SELECTOR_SWIPEOUT_ACTIONS_OPENED).removeClass(CLASS_SWIPEOUT_ACTIONS_OPENED);
                _sl.swipeOutEl.removeClass(CLASS_SWIPEOUT_OPENED);
            }
        }
        _sl.isMoved = true;
        e.preventDefault();

        _sl.touchesDiff = pageX - _sl.touchesStart.x;
        _sl.translate = _sl.touchesDiff;

        if (_sl.opened) {
            if (_sl.openedActions === 'right') _sl.translate = _sl.translate - _sl.actionsRightWidth;
            else _sl.translate = _sl.translate + _sl.actionsLeftWidth;
        }

        if (_sl.translate > 0 && _sl.actionsLeft.length === 0 || _sl.translate < 0 && _sl.actionsRight.length === 0) {
            if (!_sl.opened) {
                _sl.isTouched = _sl.isMoved = false;
                return;
            }
            _sl.translate = 0;
        }

        if (_sl.translate < 0) _sl.direction = 'to-left';
        else if (_sl.translate > 0) _sl.direction = 'to-right';
        else {
            if (_sl.direction) _sl.direction = _sl.direction;
            else _sl.direction = 'to-left';
        }

        var i, buttonOffset, progress;

        _sl.overswipeLeft = false;
        _sl.overswipeRight = false;
        var $button;
        if (_sl.actionsRight.length > 0) {
            // Show right actions
            progress = _sl.translate / _sl.actionsRightWidth;
            if (_sl.translate < -_sl.actionsRightWidth) {
                _sl.translate = -_sl.actionsRightWidth - Math.pow(-_sl.translate - _sl.actionsRightWidth, 0.8);
                if (_sl.overswipeRightButton.length > 0) {
                    _sl.overswipeRight = true;
                }
            }
            for (i = 0; i < _sl.buttonsRight.length; i++) {
                if (typeof _sl.buttonsRight[i]._buttonOffset === 'undefined') {
                    _sl.buttonsRight[i]._buttonOffset = _sl.buttonsRight[i].offsetLeft;
                }
                buttonOffset = _sl.buttonsRight[i]._buttonOffset;
                $button = $(_sl.buttonsRight[i]);
                if (_sl.overswipeRightButton.length > 0 && $button.hasClass(CLASS_SWIPEOUT_OVERSWIPE)) {
                    $button.css({
                        left: (_sl.overswipeRight ? -buttonOffset : 0) + 'px'
                    });
                }
                $button.transform('translate3d(' + (_sl.translate - buttonOffset * (1 + Math.max(progress, -1))) + 'px,0,0)');
            }
        }
        if (_sl.actionsLeft.length > 0) {
            // Show left actions
            progress = _sl.translate / _sl.actionsLeftWidth;
            if (_sl.translate > _sl.actionsLeftWidth) {
                _sl.translate = _sl.actionsLeftWidth + Math.pow(_sl.translate - _sl.actionsLeftWidth, 0.8);
                if (_sl.overswipeLeftButton.length > 0) {
                    _sl.overswipeLeft = true;
                }
            }
            for (i = 0; i < _sl.buttonsLeft.length; i++) {
                if (typeof _sl.buttonsLeft[i]._buttonOffset === 'undefined') {
                    _sl.buttonsLeft[i]._buttonOffset = _sl.actionsLeftWidth - _sl.buttonsLeft[i].offsetLeft - _sl.buttonsLeft[i].offsetWidth;
                }
                buttonOffset = _sl.buttonsLeft[i]._buttonOffset;
                $button = $(_sl.buttonsLeft[i]);
                if (_sl.overswipeLeftButton.length > 0 && $button.hasClass(CLASS_SWIPEOUT_OVERSWIPE)) {
                    $button.css({
                        left: (_sl.overswipeLeft ? buttonOffset : 0) + 'px'
                    });
                }
                if (_sl.buttonsLeft.length > 1) {
                    $button.css('z-index', _sl.buttonsLeft.length - i);
                }
                $button.transform('translate3d(' + (_sl.translate + buttonOffset * (1 - Math.min(progress, 1))) + 'px,0,0)');
            }
        }
        _sl.swipeOutContent.transform('translate3d(' + _sl.translate + 'px,0,0)');
    };

    var handleTouchEnd = function(e) {

        var _sl = this;
        console.log(_sl.isTouched);
        console.log(_sl.isMoved);
        if (!_sl.isTouched || !_sl.isMoved) {
            _sl.isTouched = false;
            _sl.isMoved = false;
            if (!_sl.opened) _sl.swipeOutEl.trigger('tapped', _sl);
            return;
        }

        _sl.isTouched = false;
        _sl.isMoved = false;
        var timeDiff = (new Date()).getTime() - _sl.touchStartTime;
        var action, actionsWidth, actions, buttons, i, noFold;

        noFold = _sl.direction === 'to-left' ? _sl.noFoldRight : _sl.noFoldLeft;
        actions = _sl.direction === 'to-left' ? _sl.actionsRight : _sl.actionsLeft;
        actionsWidth = _sl.direction === 'to-left' ? _sl.actionsRightWidth : _sl.actionsLeftWidth;

        if (
            timeDiff < 300 && (_sl.touchesDiff < -10 && _sl.direction === 'to-left' || _sl.touchesDiff > 10 && _sl.direction === 'to-right') ||
            timeDiff >= 300 && Math.abs(_sl.translate) > actionsWidth / 2
        ) {
            action = 'open';
        } else {
            action = 'close';
        }
        if (timeDiff < 300) {
            if (Math.abs(_sl.translate) === 0) action = 'close';
            if (Math.abs(_sl.translate) === actionsWidth) action = 'open';
        }

        if (action === 'open') {
            _sl.swipeoutOpenedEl = _sl.swipeOutEl;
            _sl.swipeOutEl.trigger('open', _sl);
            _sl.swipeOutEl.addClass(CLASS_SWIPEOUT_OPENED + ' ' + CLASS_SWIPEOUT_TRANSITIONING);
            var newTranslate = _sl.direction === 'to-left' ? -actionsWidth : actionsWidth;
            _sl.swipeOutContent.transform('translate3d(' + newTranslate + 'px,0,0)');
            actions.addClass(CLASS_SWIPEOUT_ACTIONS_OPENED);
            buttons = _sl.direction === 'to-left' ? _sl.buttonsRight : _sl.buttonsLeft;
            if (buttons) {
                for (i = 0; i < buttons.length; i++) {
                    $(buttons[i]).transform('translate3d(' + newTranslate + 'px,0,0)');
                }
            }
            if (_sl.overswipeRight) {
                _sl.actionsRight.find(SELECTOR_SWIPEOUT_OVERSWIPE).trigger('tap', _sl);
            }
            if (_sl.overswipeLeft) {
                _sl.actionsLeft.find(SELECTOR_SWIPEOUT_OVERSWIPE).trigger('tap', _sl);
            }
        } else if (action === 'close') {
            _sl.swipeOutEl.trigger('close', _sl);
            _sl.swipeoutOpenedEl = undefined;
            _sl.swipeOutEl.addClass(CLASS_SWIPEOUT_TRANSITIONING).removeClass(CLASS_SWIPEOUT_OPENED);
            _sl.swipeOutContent.transform('');
            actions.removeClass(CLASS_SWIPEOUT_ACTIONS_OPENED);
        } else {
            _sl.swipeOutEl.trigger('tapped', _sl);
            return;
        }

        var buttonOffset;
        if (_sl.buttonsLeft && _sl.buttonsLeft.length > 0 && _sl.buttonsLeft !== buttons) {
            for (i = 0; i < _sl.buttonsLeft.length; i++) {
                buttonOffset = _sl.buttonsLeft[i]._buttonOffset;
                if (typeof buttonOffset === 'undefined') {
                    _sl.buttonsLeft[i]._buttonOffset = _sl.actionsLeftWidth - _sl.buttonsLeft[i].offsetLeft - _sl.buttonsLeft[i].offsetWidth;
                }
                $(_sl.buttonsLeft[i]).transform('translate3d(' + (buttonOffset) + 'px,0,0)');
            }
        }
        if (_sl.buttonsRight && _sl.buttonsRight.length > 0 && _sl.buttonsRight !== buttons) {
            for (i = 0; i < _sl.buttonsRight.length; i++) {
                buttonOffset = _sl.buttonsRight[i]._buttonOffset;
                if (typeof buttonOffset === 'undefined') {
                    _sl.buttonsRight[i]._buttonOffset = _sl.buttonsRight[i].offsetLeft;
                }
                $(_sl.buttonsRight[i]).transform('translate3d(' + (-buttonOffset) + 'px,0,0)');
            }
        }
        _sl.swipeOutContent.transitionEnd(function(e) {
            if (_sl.opened && action === 'open' || _sl.closed && action === 'close') return;
            _sl.swipeOutEl.trigger(action === 'open' ? 'opened' : 'closed', _sl);
            action === 'open' ? _sl.opened = true : _sl.opened = false
            if (_sl.opened && action === 'close') {
                if (_sl.actionsRight.length > 0) {
                    _sl.buttonsRight.transform('');
                }
                if (_sl.actionsLeft.length > 0) {
                    _sl.buttonsLeft.transform('');
                }
            }
        });
    };

    define(function($ui) {
        //swipelist
        var $swipelist = $ui.define('Swipelist', {});

        //初始化
        $swipelist.prototype.init = function() {
            render.call(this);
            bind.call(this);
        };

        $swipelist.prototype.swipeOpen = function(el, dir, callback) {
            var _sl = this;
            el = $(el);
            if (arguments.length === 2) {
                if (typeof arguments[1] === 'function') {
                    callback = dir;
                }
            }

            if (el.length === 0) return;
            if (el.length > 1) el = $(el[0]);
            if (!el.hasClass(CLASS_SWIPEOUT) || el.hasClass(CLASS_SWIPEOUT_OPENED)) return;
            if (!dir) {
                if (el.find(SELECTOR_SWIPEOUT_ACTIONS_RIGHT).length > 0) dir = 'right';
                else dir = 'left';
            }
            var swipeOutActions = el.find('.ui-swipeout-actions-' + dir);
            if (swipeOutActions.length === 0) return;
            var noFold = swipeOutActions.hasClass(CLASS_SWIPEOUT_ACTIONS_NO_FOLD) || false;
            el.trigger('open', _sl).addClass(CLASS_SWIPEOUT_OPENED).removeClass(CLASS_SWIPEOUT_TRANSITIONING);
            swipeOutActions.addClass(CLASS_SWIPEOUT_ACTIONS_OPENED);
            var buttons = swipeOutActions.children('span');
            var swipeOutActionsWidth = swipeOutActions.outerWidth();
            var translate = dir === 'right' ? -swipeOutActionsWidth : swipeOutActionsWidth;
            var i;
            if (buttons.length > 1) {
                for (i = 0; i < buttons.length; i++) {
                    if (dir === 'right') {
                        $(buttons[i]).transform('translate3d(' + (-buttons[i].offsetLeft) + 'px,0,0)');
                    } else {
                        $(buttons[i]).css('z-index', buttons.length - i).transform('translate3d(' + (swipeOutActionsWidth - buttons[i].offsetWidth - buttons[i].offsetLeft) + 'px,0,0)');
                    }
                }
                var clientLeft = buttons[1].clientLeft;
            }
            el.addClass(CLASS_SWIPEOUT_TRANSITIONING);
            for (i = 0; i < buttons.length; i++) {
                $(buttons[i]).transform('translate3d(' + (translate) + 'px,0,0)');
            }
            el.find(SELECTOR_SWIPEOUT_CONTENT).transform('translate3d(' + translate + 'px,0,0)').transitionEnd(function() {
                el.trigger('opened', _sl);
                if (callback) callback.call(el[0]);
            });
            _sl.swipeoutOpenedEl = el;
        };

        $swipelist.prototype.close = function(callback) {
            var _sl = this;
            var el = _sl.ref;
            if (el.length === 0) return;
            if (!el.hasClass(CLASS_SWIPEOUT_OPENED)) return;
            var dir = el.find(SELECTOR_SWIPEOUT_ACTIONS_OPENED).hasClass(CLASS_SWIPEOUT_ACTIONS_RIGHT) ? 'right' : 'left';
            var swipeOutActions = el.find(SELECTOR_SWIPEOUT_ACTIONS_OPENED).removeClass(CLASS_SWIPEOUT_ACTIONS_OPENED);
            var noFold = swipeOutActions.hasClass(CLASS_SWIPEOUT_ACTIONS_NO_FOLD) || false;
            var buttons = swipeOutActions.children('span');
            var swipeOutActionsWidth = swipeOutActions.outerWidth();
            _sl.allowSwipeout = false;
            el.trigger('close', _sl);
            el.removeClass(CLASS_SWIPEOUT_OPENED).addClass(CLASS_SWIPEOUT_TRANSITIONING);

            var closeTO;

            function onSwipeoutClose() {
                _sl.allowSwipeout = true;
                // buttons.transform('');
                el.trigger('closed', _sl);
                _sl.opened = false
                if (callback) callback.call(el[0]);
                if (closeTO) clearTimeout(closeTO);
            }
            el.find(SELECTOR_SWIPEOUT_CONTENT).transform('translate3d(' + 0 + 'px,0,0)').transitionEnd(onSwipeoutClose);
            closeTO = setTimeout(onSwipeoutClose, 500);

            for (var i = 0; i < buttons.length; i++) {
                if (dir === 'right') {
                    $(buttons[i]).transform('translate3d(' + (-buttons[i].offsetLeft) + 'px,0,0)');
                } else {
                    $(buttons[i]).transform('translate3d(' + (swipeOutActionsWidth - buttons[i].offsetWidth - buttons[i].offsetLeft) + 'px,0,0)');
                }
                $(buttons[i]).css({
                    left: 0 + 'px'
                });
            }
            if (_sl.swipeoutOpenedEl && _sl.swipeoutOpenedEl[0] === el[0]) _sl.swipeoutOpenedEl = undefined;
        };

        $swipelist.prototype.deleteBefore = function(callback) {
            var _sl = this;
            var el = _sl.ref;
            if (el.length === 0) return;
            if (el.length > 1) el = $(el[0]);
            _sl.swipeoutOpenedEl = undefined;
            var del = el.triggerHandler('delete', _sl);
            if ($.type(del) != "undefined" && !del) return;
            _sl.delete();
        };

        $swipelist.prototype.delete = function(callback) {
            var _sl = this;
            var el = _sl.ref;
            el.css({
                height: el.outerHeight() + 'px'
            });
            var clientLeft = el[0].clientLeft;
            el.css({
                height: 0 + 'px'
            }).addClass(CLASS_SWIPEOUT_DELETING + '  ' + CLASS_SWIPEOUT_TRANSITIONING).transitionEnd(function() {
                el.trigger('deleted', _sl);
                if (callback) callback.call(el[0]);
                if (el.parents('.virtual-list').length > 0) {
                    var virtualList = el.parents('.virtual-list')[0].f7VirtualList;
                    var virtualIndex = el[0].f7VirtualListIndex;
                    if (virtualList && typeof virtualIndex !== 'undefined') virtualList.deleteItem(virtualIndex);
                } else {
                    el.remove();
                }
            });
            var translate = '-100%';
            el.find(SELECTOR_SWIPEOUT_CONTENT).transform('translate3d(' + translate + ',0,0)');
        };
        //注册$插件
        $.fn.swipelist = function(opts) {
            var swipelistObjs = [];
            opts || (opts = {});
            this.each(function() {
                var swipelistObj = null;
                var id = this.getAttribute('data-swipelist');
                if (!id) {
                    opts = $.extend(opts, {
                        ref: this
                    });
                    id = ++$ui.uuid;
                    swipelistObj = $ui.data[id] = new $swipelist(opts);
                    this.setAttribute('data-swipelist', id);
                } else {
                    swipelistObj = $ui.data[id];
                }
                swipelistObjs.push(swipelistObj);
            });
            return swipelistObjs.length > 1 ? swipelistObjs : swipelistObjs[0];
        };

        /*module.exports = function(opts){
            return new botton(opts);
        };
    */
    });
})();
/**
 * @file switch组件
 */
;(function() {
    var CLASS_SWITCH = 'ui-switch',
        CLASS_SWITCH_HANDLE = 'ui-switch-handle',
        CLASS_ACTIVE = 'ui-active',
        CLASS_DRAGGING = 'ui-dragging',
        CLASS_DISABLED = 'ui-disabled',

        SELECTOR_SWITCH_HANDLE = '.' + CLASS_SWITCH_HANDLE;

    var handle = function(event, target) {
        if (target.classList && target.classList.contains(CLASS_SWITCH)) {
            return target;
        }
        return false;
    };

    //渲染
    var render = function() {
        var _tog = this,
            opts = this.opts,
            element = opts.ref;
        _tog._handle || (_tog._handle = element.querySelector(SELECTOR_SWITCH_HANDLE));
        opts.toggleWidth = element.offsetWidth;
        opts.handleWidth = _tog._handle.offsetWidth;
        opts.handleX = opts.toggleWidth - opts.handleWidth - 3;
    };

    //绑定事件
    var bind = function() {
        var _tog = this,
            opts = this.opts,
            element = _tog.ref;
        element.on(_tog.touchStart(), $.proxy(handleEvent, _tog));
        element.on('drag', $.proxy(handleEvent, _tog));
        element.on('swiperight', $.proxy(handleEvent, _tog));
        element.on(_tog.touchEnd(), $.proxy(handleEvent, _tog));
        element.on('touchcancel', $.proxy(handleEvent, _tog));
    };


    var handleEvent = function(evt) {
        var _tog = this,
            opts = this.opts,
            element = opts.ref;
        if (element.classList.contains(CLASS_DISABLED)) {
            return;
        }
        switch (evt.type) {
            case 'touchstart':
            case 'mousedown':
                start.call(_tog, evt);
                break;
            case 'drag':
                drag.call(_tog, evt);
                break;
            case 'swiperight':
                swiperight.call(_tog, evt);
                break;
            case 'touchend':
            case 'touchcancel':
            case 'mouseup':
                end.call(_tog, evt);
                break;
        }
    };

    var start = function(evt) {
        var _tog = this,
            opts = _tog.opts,
            element = opts.ref;
        element.classList.add(CLASS_DRAGGING);
        if (opts.toggleWidth === 0 || opts.handleWidth === 0) { //当switch处于隐藏状态时，width为0，需要重新初始化
            render.call(_tog);
        }
    };
    var drag = function(evt) {
        var _tog = this,
            opts = _tog.opts,
            element = opts.ref,
            detail = evt.detail;
        if (!opts.isDragging) {
            if (detail.direction === 'left' || detail.direction === 'right') {
                opts.isDragging = true;
                opts.lastChanged = undefined;
                opts.initialState = element.classList.contains(CLASS_ACTIVE);
            }
        }
        if (opts.isDragging) {
            setTranslateX.call(_tog, detail.deltaX);
            evt.stopPropagation();
            detail.gesture.preventDefault();
        }
    };
    var swiperight = function(evt) {
        var _tog = this,
            opts = _tog.opts;
        if (opts.isDragging) {
            evt.stopPropagation();
        }
    };
    var end = function(evt) {
        var _tog = this,
            opts = _tog.opts,
            element = opts.ref;
        element.classList.remove(CLASS_DRAGGING);
        if (opts.isDragging) {
            opts.isDragging = false;
            evt.stopPropagation();
            var active = element.classList.contains(CLASS_ACTIVE);
            _tog.ref.trigger('toggle', [active]);
        } else {
            _tog.toggle();
        }
    };

    var setTranslateX = $.animationFrame(function(x) {
        var _tog = this,
            opts = _tog.opts,
            element = opts.ref,
            classList = element.classList;
        if (!opts.isDragging) {
            return;
        }
        var isChanged = false;
        if ((opts.initialState && -x > (opts.handleX / 2)) || (!opts.initialState && x > (opts.handleX / 2))) {
            isChanged = true;
        }
        if (opts.lastChanged !== isChanged) {
            if (isChanged) {
                _tog._handle.style.webkitTransform = 'translate3d(' + (opts.initialState ? 0 : opts.handleX) + 'px,0,0)';
                classList[opts.initialState ? 'remove' : 'add'](CLASS_ACTIVE);
            } else {
                _tog._handle.style.webkitTransform = 'translate3d(' + (opts.initialState ? opts.handleX : 0) + 'px,0,0)';
                classList[opts.initialState ? 'add' : 'remove'](CLASS_ACTIVE);
            }
            opts.lastChanged = isChanged;
        }

    });



    define(function($ui) {
        var $switch = $ui.define('Switch', {});

        $switch.prototype.init = function() {
            render.call(this);
            bind.call(this);
        };

        $switch.prototype.toggle = function() {
            var _tog = this,
                opts = _tog.opts,
                element = opts.ref,
                classList = element.classList;
            if (classList.contains(CLASS_ACTIVE)) {
                classList.remove(CLASS_ACTIVE);
                _tog._handle.style.webkitTransform = 'translate3d(0,0,0)';
            } else {
                classList.add(CLASS_ACTIVE);
                _tog._handle.style.webkitTransform = 'translate3d(' + opts.handleX + 'px,0,0)';
            }
            var active = classList.contains(CLASS_ACTIVE);
            _tog.ref.trigger('toggle', [active]);
            return _tog;
        };

        //注册$插件
        $.fn.switch = function(opts) {
            var switchObjs = [];
            var switchs = this;
            switchs.hasClass(CLASS_SWITCH) || (switchs = switchs.find('.' + CLASS_SWITCH));
            opts || (opts = {});
            switchs.each(function() {
                var switchObj = null;
                var id = this.getAttribute('data-switch');
                if (!id) {
                    opts = $.extend(opts, {
                        ref: this
                    });
                    id = ++$ui.uuid;
                    switchObj = $ui.data[id] = new $switch(opts);
                    this.setAttribute('data-switch', id);
                } else {
                    switchObj = $ui.data[id];
                }
                switchObjs.push(switchObj);
            });
            return switchObjs.length > 1 ? switchObjs : switchObjs[0];
        };
    });
})();
/**
 * @file 选项卡组件
 */

;(function() {

    // 私有变量  
    var CLASS_TAB_BAR = 'ui-tab-bar',
        CLASS_TAB_ITEM = 'ui-tab-item',
        CLASS_ACTIVE = 'ui-active',
        CLASS_CONTROL_CONTENT = 'ui-control-content';

    var SELECTOR_ACTIVE = '.' + CLASS_ACTIVE;





// 私有方法  

// 渲染组件
    var render = function() {
        var _tb = this,
            opts = _tb.opts;
        opts.items = _tb.ref.children();
        opts.active = Math.max(0, Math.min(opts.items.length - 1, opts.active || $(SELECTOR_ACTIVE, _tb.ref).index() || 0));
        opts.items.eq(opts.active).addClass(CLASS_ACTIVE);
        opts.items[opts.active].actived = true;
    };

// 绑定事件 
    var bind = function() {
        var _tb = this,
            opts = _tb.opts;

        _tb.ref.on(_tb.touchEve(), function(e) {
            if ((match = $(e.target).closest('a', _tb.ref)) && match.length) {
                e.preventDefault();
                _tb.switchTo(match.index());
            }
        });
    };

    
    /**
     * 选项卡组件
     */
    define(function($ui) {


        // 对象定义  
        var $tabs = $ui.define('Tabs', {

            /**
             * @property {Number} [active=0] 初始时哪个为选中状态
             * @namespace options
             */
            active: 0
        });




// 对象扩展对外接口  


        //初始化
        $tabs.prototype.init = function() {
            render.call(this);
            bind.call(this);
        };
        /**
         * 切换到某个Tab
         * @method switchTo
         * @param {Number} index Tab编号
         * @chainable
         * @return {self} 返回本身。
         */
        $tabs.prototype.switchTo = function(index) {
            var _tb = this,
                opts = _tb.opts,
                items = opts.items,
                eventData, to, from, reverse, endEvent;
            if (opts.active != (index = Math.max(0, Math.min(items.length - 1, index)))) {
                to = index;
                from = opts.active;
                _tb.ref.trigger('beforeActivate', [to, from]);

                items.removeClass(CLASS_ACTIVE).eq(to).addClass(CLASS_ACTIVE);
                opts.active = index;
                if (!items[opts.active].actived) {
                    $.each(items, function(index, el) {
                        items[index].actived = false;
                    })
                    items[opts.active].actived = true;
                    _tb.ref.trigger('activate', [to, from]);
                }
                _tb.ref.trigger('afteractivate', [to, from]);
            }
            return _tb;
        };

        /**
         * 销毁组件
         * @method destroy
         */
        $tabs.prototype.destroy = function() {

        };



        // 绑定到zepto对象上  供外部创建对象使用 

        //注册$插件
        $.fn.tab = function(opts) {
            var tabObjs = [];
            opts || (opts = {});
            this.each(function() {
                var tabObj = null;
                var id = this.getAttribute('data-tab');
                if (!id) {
                    opts = $.extend(opts, {
                        ref: this
                    });
                    id = ++$ui.uuid;
                    tabObj = $ui.data[id] = new $tabs(opts);
                    this.setAttribute('data-tab', id);
                } else {
                    tabObj = $ui.data[id];
                }
                tabObjs.push(tabObj);
            });
            return tabObjs.length > 1 ? tabObjs : tabObjs[0];
        };

    });
})();
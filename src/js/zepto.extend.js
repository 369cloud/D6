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
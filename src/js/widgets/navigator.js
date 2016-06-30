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

        if (opts.active === undefined) {

            // 如果opts中没有指定index, 则尝试从dom中查看是否有比较为ui-state-active的
            opts.active = _nav.$list.find('.ui-state-active').index();

            // 没找到还是赋值为0
            ~opts.active || (opts.active = 0);
        }
        _nav.active = -1;
    };

    var bind = function() {
        var _nav = this,
            opts = _nav.opts;
        var left = _nav.$list.offset().left;
        _nav.$list.on(_nav.touchEve,
            'li:not(.ui-state-disable)>a',
            function(e) {
                _switchTo.call(_nav, $(this).parent().index());
            });
        _nav.ref.on('switch', function(e, index, li) {
            _nav.$bar.css({
                left: li.offsetLeft - left,
                width: $(li).find('a').width()
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
        if (to === _nav.active) {
            return;
        }

        var list = _nav.$list.children(),
            cur;

        cur = list.removeClass('ui-state-active')
            .eq(to)
            .addClass('ui-state-active');

        _nav.active = to;
        _nav.ref.trigger('switch', [to, cur[0]]);
        return _nav;
    };

    /**
     * 导航组件
     */
    define(function($ui) {
        var $nav = $ui.define('Navigator', {
            /**
             * @property {Number} [active=0] 初始时哪个为选中状态
             * @namespace options
             */
            active: 0
        });

        //初始化
        $nav.prototype.init = function() {
            var _nav = this,
                opts = _nav.opts;
            _nav.ref.addClass(CLASS_NAVIGATOR_WRAPPER);
            new IScroll(_nav.ref[0], {
                scrollX: true,
                scrollY: false,
                disableMouse: false,
                disablePointer: true
            })
            render.call(_nav);
            bind.call(_nav);
            _nav.switchTo(opts.active);
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
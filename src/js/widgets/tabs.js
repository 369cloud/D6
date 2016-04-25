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

                items.removeClass(CLASS_ACTIVE).eq(to).addClass(CLASS_ACTIVE);
                opts.active = index;
                if (!items[opts.active].actived) {
                    $.each(items, function(index, el) {
                        items[index].actived = false;
                    })
                    items[opts.active].actived = true;
                    _tb.ref.trigger('activate', [to, from]);
                }
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

(function($) {
    "use strict";

    // http://meyerweb.com/eric/thoughts/2011/09/12/un-fixing-fixed-elements-with-css-transforms/
    var hasFixedTransformBug    = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

    $.fitElement        = function(viewportWidth, viewportHeight, ratio) {
        var result      = {};
        result.width    = viewportWidth;
        result.height   = Math.ceil(viewportWidth / ratio);
        if(result.height < viewportHeight) {
            result.height   = viewportHeight;
            result.width    = Math.ceil(viewportHeight * ratio);
        }
        result.left     = Math.round((viewportWidth - result.width) / 2);
        result.top      = Math.round((viewportHeight - result.height) / 2);
        return result;
    };
    $.fitBackground     = function(selector, attr, options) {
        return $(selector).fitBackground(attr, options);
    };
    $.fn.fitBackground  = function(attr, options) {
        // Extend default options and override with given if any
        var options                 = $.extend({}, {
            viewport:       $(window),
            forceScroll:    false,
            forceFixed:     false
        }, options);

        // Walk elements
        return $(this).each(function() {
            // Properties
            var $this       = $(this);
            var $window     = $(window);
            var fixed       = options.forceFixed ? true : (options.forceScroll ? false : $this.get(0).hasAttribute('data-fit-background-force-fixed'));
            var image       = new Image();
            image.src       = $this.attr(attr);
            image.onload    = function() {
                $this.css({backgroundImage: "url('" + this.src + "')", backgroundRepeat: "repeat", backgroundAttachment: fixed && !hasFixedTransformBug ? 'fixed' : 'scroll'});
                $this.data('background-width', this.naturalWidth);
                $this.data('background-height', this.naturalHeight);
                $this.triggerHandler('background-update');
            };
            $this.bind('background-update', function() {
                if("undefined" === typeof $this.data('background-width') || "undefined" === typeof $this.data('background-height')) {
                    return;
                }
                var fit     = $.fitElement(options.viewport.width(), options.viewport.height(), $this.data('background-width') / $this.data('background-height'));
                $this.css({backgroundSize: fit.width + 'px ' + fit.height + 'px', backgroundPosition: fit.left + 'px ' + (fixed && hasFixedTransformBug ? $window.scrollTop() - $this.offset().top + fit.top : fit.top) + 'px'});
            });
            $window.bind('scroll', function() {
                $this.triggerHandler('background-update');
            }).bind('resize', function() {
                $this.triggerHandler('background-update');
            });
        });
    };
    $.fitObject         = function(selector, attr, options) {
        return $(selector).fitObject(attr, options);
    };
    $.fn.fitObject      = function(attr, options) {
        // Extend default options and override with given if any
        var options                 = $.extend({}, {
            viewport:       $(window),
            ratio:          1,
            forceScroll:    false,
            forceFixed:     false
        }, options);

        // Walk elements
        return $(this).each(function() {
            // Properties
            var $this       = $(this);
            var $window     = $(window);
            var fixed       = options.forceFixed ? true : (options.forceScroll ? false : $this.get(0).hasAttribute('data-fit-background-force-fixed'));
            $this.bind('object-update', function() {
                var fit     = $.fitElement(options.viewport.width(), options.viewport.height(), options.ratio);
                $this.css({width: fit.width + 'px', height: fit.height + 'px', left: fit.left + 'px', top: (fixed && hasFixedTransformBug ? $window.scrollTop() - $this.offset().top + fit.top : fit.top) + 'px'});
            });
            $window.bind('scroll', function() {
                $this.triggerHandler('object-update');
            }).bind('resize', function() {
                $this.triggerHandler('object-update');
            });
            $this.triggerHandler('object-update');
        });
    };
})(jQuery);
(function() {
    "use strict";

    /* Animate elements when scrolling. */
    // Each element that has the data-animate attribute will be animated when scrolling the page gets to it.
    // The name inside the data-animate attribute will be added as a class to the element, you can set any class you want, but the initial intention is to use the animations the animate.css library supplies: http://daneden.github.io/animate.css/
    // You can set a delay in milliseconds after which the animation should start by using data-delay.
    // You can also set the data-delay to some mathematical expression like 1+2*2+3 or anything that can be run in JavaScript's eval() function.
    // The keyword 'index' (without the quotes) will be replaced with the index of the element according to it's parent. This way you can add delay to a list of elements, where each next element will have larger delay than the previous. For example: 200*index would mean 0 delay for the first element, 200 for the seconds, 400 for the third, 600 for the fourth and so on.
    // Sometimes it is nice to animate elements in groups, especially when there are delays involved, that only make sense if all elements of the group are animated simultaneously.
    // The data-group attribute allows grouping elements together, but works a bit tricky. First of all you need to set the data-group to a number, this number represents how many parent elements up till we get to the trigger element.
    // Consider this markup:
    // <div class="parent1">
    //     <div class="parent2">
    //         <div class="element1" data-group="2"></div>
    //     </div>
    //     <div class="element2" data-group="1"></div>
    // </div>
    // Here, element1 has group=2, which means we get not the first, but the second parent element as the trigger, which in this case is parent1.
    // Element2 on the other hand has group=1, which means we get the first parent element as the trigger, which in this case is parent1 again.
    // This way both elements have the same parent trigger.
    // Animation of each of these elements will start when the page scrolls near parent1.
    // If data-group is omitted or is set to or less than 0, the animation for each element will start when the page scrolls near each element, and no parent will be used.
    $('[data-animate]:not([data-animate=""])').css({opacity:0});
    var scrollCallback  = function() {
        var $window     = $(window);
        var scroll      = $window.scrollTop();
        var height      = $window.height();
        $('[data-animate]:not([data-animate=""])').each(function() {
            var $this       = $(this);
            var $group      = $this;
            var className   = $this.attr('data-animate');
            var callback    = $this.get(0).hasAttribute('data-animate-callback') ? $this.data($this.attr('data-animate-callback')) : null;
            var delay       = $this.get(0).hasAttribute('data-delay') ? parseInt(eval($this.attr('data-delay').replace('index', $this.index()))) : 0;
            if($this.get(0).hasAttribute('data-group') && !isNaN(parseInt($this.attr('data-group')))) {
                for(var i = 0; i < parseInt($this.attr('data-group')); i++) {
                    $group  = $group.parent();
                }
            }
            if(scroll + height >= $group.offset().top) {
                var perform = function() {
                    $this.removeAttr('data-animate').css({opacity:1}).addClass(className + ' animated');
                    if("function" === typeof callback) {
                        setTimeout(callback, 1000);
                    }
                };
                if(0 < delay) {
                    setTimeout(perform, delay);
                } else {
                    perform();
                }
            }
        });
    };
    $(window).bind('scroll', scrollCallback);
    scrollCallback();
})();
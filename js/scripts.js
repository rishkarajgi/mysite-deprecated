(function ($) {
  'use strict';
  // Document loaded

  $(document) .ready(function () {
    $('body') .addClass('loaded');
  });
  /* Window resize end event */
  // This is used by other sections to determine lag-free window resize
  $(window) .bind('resize', function () {
    var $this = $(this);
    clearTimeout($this.data('resize-start'));
    $this.data('resize-start', setTimeout(function () {
      $this.triggerHandler('resize-end');
    }, 200));
  });
  /* Section headings */
  // This appends 4 elements to section headings for easy styling
  $('.section-heading, .hero-heading') .each(function () {
    $(this) .append('<div class="tl"/>') .append('<div class="tr"/>') .append('<div class="br"/>') .append('<div class="bl"/>');
  });
  /* Fixed navigation */
  // This detects if the navigation should be fixed while scrolling
  $(window) .bind('scroll', function () {
    var $this = $(this);
    var $body = $('body');
    var offset = 0 === $('#hero') .length ? 0 : $('#hero') .height();
    if ($this.scrollTop() >= offset) {
      $body.addClass('nav-fixed');
    } else {
      $body.removeClass('nav-fixed');
    }
  });
  /* Autocollapse navigation */
  // Automatically collpase the navigation bar when clicking a link in mobile device design mode
  $('.navbar-collapse a') .bind('click', function (e) {
    e.preventDefault();
    $('.navbar-collapse') .collapse('hide');
  });
  /* Navigation scroll spy */
  // Automatically highlight a navigation link when user scrolls to the target section
  var navigationScrollSpy = function () {
    var $body = $('body');
    if (!$body.data('scrollSpyActivated')) {
      $body.data('scrollSpyActivated', true);
      $body.scrollspy({
        target: '.navbar-collapse',
        offset: $('.navbar') .outerHeight(true) + 1
      });
    } else {
      $body.scrollspy('refresh');
    }
  };
  $(window) .bind('resize', navigationScrollSpy);
  navigationScrollSpy();
  /* Native placeholder support */
  // Mimic form fields placeholders for browsers which do not support it (yes IE9, I'm looking at you)
  if (!('placeholder' in document.createElement('input'))) {
    $('[placeholder]') .livequery(function () {
      var $this = $(this);
      if (0 === $this.val() .length) {
        $this.val($this.attr('placeholder'));
      }
    }) .livequery('focus', function () {
      var $this = $(this);
      if ($this.val() == $this.attr('placeholder')) {
        $this.val('');
      }
    }) .livequery('blur', function () {
      var $this = $(this);
      if ($this.val() == '') {
        $this.val($this.attr('placeholder'));
      }
    });
  }
  /* Void buttons */
  // Do nothing when clicking on buttons with href="#"

  $('[href="#"]') .livequery('click', function (e) {
    e.preventDefault();
  });
  /* Popup window */
  // Open pages in popup when clicking on links which href starts with #!
  $('[href^="#!"]') .livequery('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var $body = $('body');
    var $popup = $('#popup');
    var url = $this.attr('href') .substring(2);
    history.replaceState(null, null, '#!' + url);
    $body.addClass('popup-open');
    $popup.attr('src', url);
    $popup.show();
  });
  // Automatically open popup if page URL requests it
  if (document.location.hash.match(/^\#\!.+/)) {
    var $link = $('<a href="' + document.location.hash + '"/>');
    $('body') .append($link);
    setTimeout(function () {
      $link.triggerHandler('click');
      $link.remove();
    }, 100);
  }
  /* Close popup */
  // Close the popup

  $('.nav-close') .livequery('click', function (e) {
    e.preventDefault();
    var $parent = $(document) .parent();
    var $body = $(window.parent.document.body);
    var $popup = $('#popup', window.parent.document.body);
    $popup.hide() .attr('src', 'about:blank');
    $body.removeClass('popup-open');
    window.parent.history.replaceState(null, null, window.parent.document.location.pathname);
  });
  /* Skill bars */
  // Animate the skill bars, 3000 is the animation duration, make sure it matches the one from the CSS (or LESS)
  $('.skill-bar') .each(function () {
    var $this = $(this);
    var value = parseInt($this.attr('data-value'));
    $this.data('animate-skill', function () {
      $this.animate({
        dummy: 1
      }, {
        duration: 3000,
        easing: $.bez([0.13,
        0.71,
        0.3,
        0.94]),
        step: function (now) {
          $(this) .find('.value') .html(Math.round(value * now) + '%');
        }
      });
      $this.find('.fill') .css({
        width: value + '%'
      });
    }) .attr('data-animate-callback', 'animate-skill');
  });
  /* Portfolio isotope */
  // Isotope portfolio magic, refer to isotope plugin page
  var portfolioRefresh = function () {
    var $port = $('.portfolio');
    var width = $port.parent() .width() < 313 ? 270 : 313;
    var columns = Math.max(1, Math.floor($port.parent() .width() / width));
    var target = width * columns;
    $port.width(target);
    $port.find('.item') .width(width);
    setTimeout(function () {
      $port.isotope({
        masonry: {
          columnWidth: width
        }
      });
      $port.isotope('layout');
    }, 200);
  };
  $('.portfolio') .isotope({
    itemSelector: '.item',
    layoutMode: 'masonry',
    transitionDuration: '1s',
    masonry: {
      resizable: false,
      columnWidth: $('.portfolio') .parent() .width() < 313 ? 270 : 313,
      gutter: 0
    }
  }) .isotope('on', 'layoutComplete', navigationScrollSpy);
  $(window) .bind('resize-end', portfolioRefresh);
  portfolioRefresh();
  /* Portfolio filtering */
  // Isotope portfolio filtering
  $('.portfolio-filter a') .bind('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    $this.parent('li') .parent('ul') .find('li.active') .removeClass('active');
    $this.parent('li') .addClass('active');
    $('.portfolio') .isotope({
      filter: $this.attr('data-filter')
    });
  });
  /* Smooth section scrolling */
  // Autoscroll to target element when clicking on a link which href looks like this: #SOMEID and there is element with id="SOMEID" on the page
  $('[href^="#"]:not([href^="#!"]):not([href="#"])') .livequery('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var $target = $($this.attr('href'));
    var speed = isNaN(parseInt($('body') .attr('data-scroll-speed'))) ? 1000 : parseInt($('body') .attr('data-scroll-speed'));
    if (0 < $target.length) {
      $.scrollTo.window() .queue([]) .stop();
      $.scrollTo({
        left: 0,
        top: Math.max(0, $target.offset() .top - (0 === $('.navbar-header') .height() ? $('.navbar-nav') .height()  : $('.navbar-header') .height()) - 100)
      }, {
        duration: speed,
        easing: $.bez([1,
        0.01,
        0,
        1])
      });
    }
  });
  /* Parallax backgrounds */
  // Fit parallax backgrounds and make them "fixed"
  // Set forceFixed to false or better yet set forceScroll to true if you want the background to scroll with the page
  $('[data-parallax]') .fitBackground('data-parallax', {
    forceFixed: true
  });
  /* Hero */
  // Hero magic
  if (0 < $('#hero') .length) {
    var $hero = $('#hero');
    switch (true) {
    case $hero.get(0) .hasAttribute('data-solid') :
      $hero.css({
        backgroundColor: $hero.attr('data-solid')
      });
      break;
    case $hero.get(0) .hasAttribute('data-pattern') :
      $hero.css({
        backgroundImage: 'url("' + $hero.attr('data-pattern') + '")'
      });
      break;
    case $hero.get(0) .hasAttribute('data-fixed-pattern') :
      $hero.css({
        backgroundImage: 'url("' + $hero.attr('data-fixed-pattern') + '")',
        backgroundAttachment: 'fixed'
      });
      break;
    case $hero.get(0) .hasAttribute('data-image') :
      $hero.fitBackground('data-image', {
        viewport: $hero,
        forceScroll: true
      });
      break;
    case $hero.get(0) .hasAttribute('data-fixed-image') :
      $hero.fitBackground('data-fixed-image', {
        viewport: $hero,
        forceFixed: true
      });
      break;
    case $hero.get(0) .hasAttribute('data-video') :
      $hero.prepend('<div class="fullscreen-object"><video loop autoplay muted><source src="' + $hero.attr('data-video') + '" type="video/mp4"></video></div>');
      $hero.find('.fullscreen-object > *') .fitObject('data-video', {
        viewport: $hero,
        ratio: parseFloat(eval($hero.attr('data-video-ratio')))
      });
      break;
    case $hero.get(0) .hasAttribute('data-youtube') :
      $hero.prepend('<div class="fullscreen-object"><iframe src="https://www.youtube.com/embed/' + $hero.attr('data-youtube') + '?autoplay=1&modestbranding=1&controls=0&showinfo=0&rel=0&enablejsapi=1&version=3&allowfullscreen=true&wmode=transparent&iv_load_policy=3&html5=1" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>');
      $hero.find('.fullscreen-object > *') .fitObject('data-youtube', {
        viewport: $hero,
        ratio: 640 / 390
      });
      break;
    case $hero.get(0) .hasAttribute('data-youtube') :
      $hero.prepend('<div class="fullscreen-object"><iframe src="https://www.youtube.com/embed/' + $hero.attr('data-youtube') + '?autoplay=1&modestbranding=1&controls=0&showinfo=0&rel=0&enablejsapi=1&version=3&allowfullscreen=true&wmode=transparent&iv_load_policy=3&html5=1" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>');
      $hero.find('.fullscreen-object > *') .fitObject('data-youtube', {
        viewport: $hero,
        ratio: 640 / 390
      });
      break;
    case $hero.get(0) .hasAttribute('data-vimeo') :
      $hero.prepend('<div class="fullscreen-object"><iframe src="http://player.vimeo.com/video/' + $hero.attr('data-vimeo') + '?title=0&byline=0&portrait=0&color=f0ede6&autoplay=true" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>');
      $hero.find('.fullscreen-object > *') .fitObject('data-vimeo', {
        viewport: $hero,
        ratio: 960 / 408
      });
      break;
    }
  }
}) (jQuery);

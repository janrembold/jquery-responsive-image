/*!
 *
 * jquery-debouncedwidth - v1.1.0
 * https://github.com/janrembold/jquery-debouncedwidth
 * Copyright (c) 2015 Jan Rembold <janrembold@gmail.com>; License: MIT
 *
 * */

(function($) {
    'use strict';

    var timeout;
    var $window = $(window);
    var lastWidth = $window.width();
    var elements = [];

    // use timeouts to debounce resize event
    var debouncer = function(){
        clearTimeout(timeout);
        timeout = setTimeout( function(){

            // check if width really changed
            var currentWidth = $window.width();
            if(currentWidth !== lastWidth) {
                // set current width to last seen width
                lastWidth = currentWidth;

                // trigger debouncedwidth event
                var index = elements.length;
                while(index--) {
                    $(elements[index]).trigger('debouncedwidth');
                }
            }

        }, $.event.special.debouncedwidth.threshold);
    };

    var inArray = function(element){
        var index = elements.length;
        while(index--) {
            if(elements[index] === element) {
                return index;
            }
        }

        return -1;
    };

    $.event.special.debouncedwidth = {
        setup: function(){
            if(inArray(this) === -1) {
                elements.push(this);
            }

            var $this = $(this);
            $this.on('resize.debouncedwidth', debouncer);
        },

        teardown: function(){
            var index = inArray(this);
            if(index !== -1) {
                elements = elements.splice(index, 1);
            }

            $(this).off('resize.debouncedwidth');
        },

        threshold: 150
    };

})(window.jQuery);
/*! jquery-responsive-image - v1.2.0
 * Copyright (c) 2015 Jan Rembold <janrembold@gmail.com>; License: MIT */

(function ( $, window, document, undefined ) {
    'use strict';

    // Create the defaults
    var pluginName = 'responsiveImage',
        defaults = {
            source:             '> span',
            container:          null,

            minWidthDefault:    0,
            maxWidthDefault:    Number.MAX_VALUE,
            minDprDefault:      1,

            attributes:         ['title', 'alt', 'class', 'width', 'height'],
            resizeEvent:        'resize',
            preload:            false,
            autoDpr:            false,

            onGetWidth:         null
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        var self = this;
        self.$element = $(element);
        self.options = $.extend( {}, defaults, options );

        self.sources = [];
        self.dpr = self.getDpr();
        self.attributeCount = self.options.attributes.length;

        self.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            var self = this;

            // load sources
            self.sources = self.loadSources();
            if(self.sources.length === 0) {
                return;
            }

            // check container or viewport support - data-container overrides default setting
            var containerSelector = self.$element.attr('data-container') || self.options.container;
            if(containerSelector) {
                self.$container = self.$element.parents(containerSelector);
            }

            // load responsive image
            self.loadResponsiveImage();

            // init resize event with jquery-debouncedwidth support: https://github.com/janrembold/jquery-debouncedwidth
            self.initResizeEvent();
        },

        loadSources: function(){
            var self = this;
            var sources = [];

            // prepare all necessary image data
            self.$element.find(self.options.source).each(function(){
                var $source = $(this);

                // only use images with source
                if($source.data('src')) {
                    var data = {
                        'src':      $source.data('src'),
                        'minWidth': $source.data('min-width') || self.options.minWidthDefault,
                        'maxWidth': $source.data('max-width') || self.options.maxWidthDefault,
                        'minDpr':   $source.data('min-dpr') || self.options.minDprDefault
                    };

                    // prepare all attributes
                    for(var i=0; i<self.attributeCount; i++) {
                        var attribute = self.options.attributes[i];
                        data[attribute] = $source.data(attribute) || self.$element.data(attribute);
                    }

                    sources.push(data);
                }
            });

            // sort sources desc by minWidth, maxWidth and minDpr -> largest files first
            sources.sort(function(a, b) {
                if(b.minWidth === a.minWidth) {
                    if(b.maxWidth === a.maxWidth) {
                        return b.minDpr - a.minDpr;
                    }
                    return b.maxWidth - a.maxWidth;
                }
                return b.minWidth - a.minWidth;
            });

            return sources;
        },

        loadResponsiveImage: function () {
            var self = this;
            var newSource;
            var targetWidth = self.getWidth();
            var sourceCount = self.sources.length;

            // search for best image source
            for (var i=0; i<sourceCount; i++) {
                if( self.sources[i].minWidth <= targetWidth &&
                    self.sources[i].maxWidth > targetWidth &&
                    self.sources[i].minDpr <= self.dpr
                ) {
                    newSource = self.sources[i];
                    break;
                }
            }

            // check if image is already loaded
            if(newSource === self.$currentSource) {
                return;
            }

            // set new source
            self.$currentSource = newSource;

            // create new image
            var $image = self.createImageWithAttributes(newSource);

            // append responsive image immediately to target element
            if( !self.options.preload ) {
                self.setNewSource( $image );
            }

        },

        setNewSource: function( $image ) {
            var self = this;

            // set new image to html
            self.$element.html( $image );

            // trigger new source event
            self.$element.trigger('new.source.'+pluginName);
        },

        getWidth: function(){
            var self = this;
            var width;

            if($.isFunction(self.options.onGetWidth)) {

                // get width from custom function
                width = self.options.onGetWidth.call(this);
            } else if(self.$container) {

                // get width from container
                width = self.$container.width();
            } else {

                // get window width
                width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            }

            // multiply width with dpr
            if( self.options.autoDpr ) {
                width *= self.dpr;
            }

            return width;
        },

        getDpr: function(){
            if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined && window.screen.systemXDPI > window.screen.logicalXDPI) {
                return window.screen.systemXDPI / window.screen.logicalXDPI;
            }

            if (window.devicePixelRatio !== undefined) {
                return window.devicePixelRatio;
            }

            return 1;
        },

        createImageWithAttributes: function(source){
            // create default image
            var self = this;
            var $image = $('<img/>');

            // append all given attributes
            for(var i=0; i<self.attributeCount; i++) {
                var attribute = self.options.attributes[i];
                if(typeof(source[attribute]) !== 'undefined' && source[attribute] !== '') {
                    $image.attr(attribute, source[attribute]);
                }
            }

            // add load event listener and set image source
            $image.one('load', function() {
                self.$element.trigger('load.source.responsiveImage');

                // append responsive image to target element after preload
                if( self.options.preload ) {
                    self.setNewSource( $image );
                }
            })
            .attr('src', source.src);

            // check if image is already completed, maybe from browser cache
            if( $image.get(0).complete ) {
                $image.trigger('load');
            }

            return $image;
        },

        initResizeEvent: function(){
            var self = this;

            // attach resize event handler
            $(window).on(self.options.resizeEvent, $.proxy(self.loadResponsiveImage, self));
        }
    });

    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, 'plugin_' + pluginName ) ) {
                $.data( this, 'plugin_' + pluginName, new Plugin( this, options ) );
                $(this).trigger('ready.'+pluginName);
            }
            $(window).trigger('all.ready.'+pluginName);
        });
    };

})( jQuery, window, document );

//# sourceMappingURL=jquery.responsiveImage.map
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

            onGetWidth:         null
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.$element = $(element);
        this.options = $.extend( {}, defaults, options );

        this.sources = [];
        this.dpr = this.getDpr();
        this.attributeCount = this.options.attributes.length;

        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {

            // load sources
            this.sources = this.loadSources();
            if(this.sources.length === 0) {
                return;
            }

            // check container or viewport support - data-container overrides default setting
            var containerSelector = this.$element.attr('data-container') || this.options.container;
            if(containerSelector) {
                this.$container = this.$element.parents(containerSelector);
            }

            // load responsive image
            this.loadResponsiveImage();

            // init resize event with jquery-debouncedwidth support: https://github.com/janrembold/jquery-debouncedwidth
            this.initResizeEvent();
        },

        loadSources: function(){
            var self = this;
            var sources = [];

            // prepare all necessary image data
            this.$element.find(this.options.source).each(function(){
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
            var newSource;
            var targetWidth = this.getWidth();
            var sourceCount = this.sources.length;

            // search for best image source
            for (var i=0; i<sourceCount; i++) {
                if( this.sources[i].minWidth <= targetWidth &&
                    this.sources[i].maxWidth > targetWidth &&
                    this.sources[i].minDpr <= this.dpr
                ) {
                    newSource = this.sources[i];
                    break;
                }
            }

            // check if image is already loaded
            if(newSource === this.$currentSource) {
                return;
            }

            // set new source
            this.$currentSource = newSource;

            // append responsive image to target element
            this.$element.html( this.createImageWithAttributes(newSource) );

            // trigger new source event
            this.$element.trigger('new.source.'+pluginName);
        },

        getWidth: function(){
            if($.isFunction(this.options.onGetWidth)) {
                return this.options.onGetWidth.call(this);
            } else if(this.$container) {
                return this.$container.width();
            }

            return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
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
            var image = document.createElement('img');
            image.setAttribute('src', source.src);

            // append all given attributes
            for(var i=0; i<this.attributeCount; i++) {
                var attribute = this.options.attributes[i];
                if(typeof(source[attribute]) !== 'undefined' && source[attribute] !== '') {
                    image.setAttribute(attribute, source[attribute]);
                }
            }

            return $(image).on('load', function() {
                self.$element.trigger('load.source.responsiveImage');
            });
        },

        initResizeEvent: function(){
            // attach resize event handler
            $(window).on(this.options.resizeEvent, $.proxy(this.loadResponsiveImage, this));
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
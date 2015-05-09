(function ( $, window, document, undefined ) {
    'use strict';

    // Create the defaults
    var pluginName = 'responsiveImage',
        defaults = {
            source:             '> span',
            container:          null,
            resizeEvent:        null,
            onGetWidth:         null,
            minWidthDefault:    0,
            maxWidthDefault:    Number.MAX_VALUE,
            minDprDefault:      1
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.$element = $(element);
        this.options = $.extend( {}, defaults, options );

        this.sources = [];
        this.dpr = this.getDpr();

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

            // init resize event with jquery-smartresize support: https://github.com/louisremi/jquery-smartresize
            this.initResizeEvent();
        },

        loadSources: function(){
            var self = this, sources = [];

            this.$element.find(this.options.source).each(function(){
                var $source = $(this);

                // only use images with sources
                if($source.data('src')) {
                    sources.push({
                        'src':      $source.data('src'),
                        'alt':      $source.data('alt') || self.$element.data('alt') || '',
                        'title':    $source.data('title') || self.$element.data('title'),
                        'class':    $source.data('class') || self.$element.data('class'),
                        'minWidth': $source.data('min-width') || self.options.minWidthDefault,
                        'maxWidth': $source.data('max-width') || self.options.maxWidthDefault,
                        'minDpr':   $source.data('min-dpr') || self.options.minDprDefault
                    });
                }
            });

            // sort sources desc by minWidth, maxWidth and minDpr -> largest files first
            sources.sort(function(a,b) {
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
            var newSource, targetWidth = this.getWidth();

            // search for best image source
            var sourceCount = this.sources.length;
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

            // inject image
            this.$currentSource = newSource;
            this.$element.html($('<img/>', {
                'src':   newSource.src,
                'alt':   newSource.alt,
                'title': newSource.title,
                'class': newSource.class
            }));
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

        initResizeEvent: function(){
            // use global resize event first, than check for jquery-smartresize or use default resize event (not recommended)
            var event = this.options.resizeEvent || ($.event.special.debouncedresize ? 'debouncedresize' : 'resize');

            // attach resize event handler
            $(window).on(event, $.proxy(this.loadResponsiveImage, this));
        }
    });

    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, 'plugin_' + pluginName ) ) {
                $.data( this, 'plugin_' + pluginName, new Plugin( this, options ) );
            }
        });
    };

})( jQuery, window, document );

//# sourceMappingURL=jquery.responsiveImage.map
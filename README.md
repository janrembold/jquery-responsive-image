# jQuery Responsive Image Plugin

A jQuery responsive image plugin with viewport or container width matching support.
Just load image by sizes you really need, save lots of bandwidth and make the world a better place :)

This plugin doesn't need any matchMedia polyfills or shims for unknown html elements. 


## Usage

Load scripts and initialize the responsive images.
```html
<!-- jQuery >1.7.2 is required -->
<script src="js/jquery.min.js"></script>
<script src="../build/jquery.responsiveImage.min.js"></script>
<script>
    $(document).ready(function () {
        $('.picture').responsiveImage();
    });
</script>
```

Default image markup:

```html
<span class="picture">
    <!-- optional fallback <img>: if JS is disabled or image is not loading while preload option is set to 'true' no image tag will be rendered. To make sure that an <img> tag is rendered set it as a fallback within the html. -->
    <img src="small.jpg" title="" alt="">
    <span data-src="small.jpg"></span>
    <span data-src="medium.jpg" data-min-width="600"></span>
    <span data-src="large.jpg" data-min-width="1000"></span>
</span>
```

you will get:

```html
<!-- Viewport Width: 0px - 599px -->
<span class="picture">
    <img src="small.jpg" alt=""/>    
</span>

<!-- Viewport Width: 600px - 999px -->
<span class="picture">
    <img src="medium.jpg" alt=""/>    
</span>

<!-- Viewport Width: >1000px -->
<span class="picture">
    <img src="large.jpg" alt=""/>    
</span>
```

### Options

#### `source` (default: `> span`)

The jQuery selector for source elements.

#### `sourcePrefix` (default: `''`)

A prefix for every(!) source element. 
Might be the default URL to the asset folder or a CDN so the `source` element only needs the relative path to the specific image.
 
This parameter can also be set with a `data-source-prefix` attribute directly on the picture wrapper.

#### `container` (default: `null`)

A default container element that defines the size for the responsive image to be loaded. 
The element will be selected with jQuery's `.parents(container)` function.

This parameter can also be set with a `data-container` attribute directly on the picture wrapper.
Setting this parameter is recommended because it optimizes the target size for the responsive image and therefor traffic bandwidth.
 
```html
<figure>
    <span class="picture" data-container="figure">
        <!-- responsive image sources -->
    </span>
</figure>
```
 
#### `resizeEvent` (default: `resize`)

This is the resize event used to detect the resize of the viewport. 
You can set any event that can be used inside jQuery's `.on()` function.
Set `resizeEvent` to empty string to disable image calculation on resize.

It defaults to the `resize` event, which is not recommended because of the high amount of fired events.
 
You can use my debounced width resize event plugin `debouncedwidth` to reduce the amount of fired events: https://github.com/janrembold/jquery-debouncedwidth
 
#### `minWidthDefault` (default: `0`)

The minimum width that is used, if no `data-min-width` was set. That might be helpful if you don't want to show images below a specific width.
Be patient, this value can be overridden by `data-min-width` values that are smaller than the `minWidthDefault` value. 
 
#### `maxWidthDefault` (default: `Number.MAX_VALUE`)

The maximum width that is used, if no `data-max-width` was set. That might be helpful if you don't want to show images above a specific width.
Be patient, this value can be overridden by `data-max-width` values that are smaller than the `maxWidthDefault` value. 
 
#### `minDprDefault` (default: `1`)

The minimum device pixel ratio that is used if no `data-min-dpr` was set. Changing this value is not recommended. 
If you want to show only Retina images set this value to `2`
 
#### `attributes` (default: `['title', 'alt', 'class', 'width', 'height']`)

These attributes are set to the generated responsive image tag. See Attributes-Section below for detailed information.
 
#### `preload` (default: `false`)

Preload images before loading them into the DOM. Default is immediate loading of images.
 
#### `autoDpr` (default: `false`)

Automatically include dpr on best fit width calculation.  
If enabled this adds retina support by default without the need for data-min-dpr attributes.  

#### `onGetWidth` (default: `null`)

By default the viewport or container width are calculated automatically.
This callback function can be used for any custom width calculation. Inside this function you can use the plugins' context.   

```js
onGetWidth: function(){
    // this.$container is the jQuery object used for container 
    // this.options are the plugins' options
    return 123; // custom integer width
}
```

#### `onLoadSources` (default: `null`)

This callback function can be used to completely overwrite the source loading process.


```js
onLoadSources: function( context ){
    // "context" gives full access to the plugins context
    
    // Following source shows a default source object. This structure is required!
    // var source = {
    //    'src':      context.options.sourcePrefix + $source.data('src'),
    //    'minWidth': $source.data('min-width') || context.options.minWidthDefault,
    //    'maxWidth': $source.data('max-width') || context.options.maxWidthDefault,
    //    'minDpr':   $source.data('min-dpr') || context.options.minDprDefault
    // };
    
    // Add other image attributes to source object as needed, e.g. "class", "title" .... 
    
    return [ /* array of sources */ ]; 
}
```


### Events fired by the plugin

These events get fired:

| Event | Description | Element |
| ----- | ----------- | ------- |
| ready.responsiveImage | This event fires when the responsive image was initially loaded, fires only once | The picture container |
| all.ready.responsiveImage | This event fires when all responsive images were initially loaded, fires only once | Global - $(window) |
| new.source.responsiveImage | This event fires when the image was inserted into the DOM | The picture container |
| load.source.responsiveImage | This event fires when the image source was loaded | The picture container |


### Event Listeners

| Event | Description | Element |
| ----- | ----------- | ------- |
| load.responsiveImage | This event triggers the responsive image load method and forces a recalculation of the currently used image | The picture container |


### Attributes

Following image attributes can be set with there corresponding data attributes.

- `alt` with `data-alt`
- `title` with `data-title`
- `class` with `data-class`
- `width` with `data-width`
- `height` with `data-height`

You can set these attributes globally on the parent tag or individually on the images source tag.
The image source tag overrides the global attribute.

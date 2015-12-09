# jQuery Responsive Image Plugin

A jQuery responsive image plugin with viewport or container width matching support.
Just load image by sizes you really need, save lots of bandwidth and make the world a better place :)

This plugin doesn't need any matchMedia polyfills or shims for unknown html elements. 

Minified size is 2.58KB | gzipped: 1.66KB

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

#### `onGetWidth` (default: `null`)

The viewport and the container width are calculated automatically.
The callback function can be used for any custom width calculation. Inside this function you can use the plugins' context.   

```js

onGetWidth: function(){
    // this.$container is the jQuery object used for container 
    // this.options are the plugins' options
    return 123; // custom integer width
}

```

### Events

These events get fired:

| Event | Description | Element |
| ----- | ----------- | ------- |
| ready.responsiveImage | This event fires when the responsive image was initially loaded, fires only once | The picture container |
| all.ready.responsiveImage | This event fires when all responsive images were initially loaded, fires only once | Global - $(window) |
| new.source.responsiveImage | This event fires when the image source was changed | The picture container |


### Attributes

Following image attributes can be set with there corresponding data attributes.

- `alt` with `data-alt`
- `title` with `data-title`
- `class` with `data-class`
- `width` with `data-width`
- `height` with `data-height`

You can set these attributes globally on the parent tag or individually on the images source tag.
The image source tag overrides the global attribute.

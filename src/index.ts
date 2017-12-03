///<reference types="jquery"/>

import {JQueryPluginBase} from "jquery-base";
import {ResponsiveImageOptions} from "./interfaces/ResponsiveImageOptions";
import EventHelper from "jquery-events";
import {ResponsiveImageSourceLoader} from "./interfaces/ResponsiveImageSourceLoader";
import ResponsiveImageSourceLoaderSpan from "./lib/ResponsiveImageSourceLoaderSpan";

(function ($: JQueryStatic, window: any, document: any) {

	class Plugin extends JQueryPluginBase {
        imageConfiguration: any;

        /** The plugins name */
		public static NAME: string = 'responsiveImage';

		/** Set plugins default options defined in given interface */
		public static DEFAULTS: ResponsiveImageOptions = {
            source: {},
            attribute: {},
            calculation: {},
            insert: {}
		};

		/** The plugins constructor - always load base class (JQueryPluginBase) first */
		constructor(element: Element, options: any) {
			super(Plugin.NAME, element, Plugin.DEFAULTS, options);
		}

		/** Place initialization logic here */
		init(): void {
			EventHelper.wrapEvents(
				this.$element,
				'init.responsiveImage',
                () => this.initResponsiveImagePlugin()
			);
		}

		initResponsiveImagePlugin(): void {
            this.loadSources(new ResponsiveImageSourceLoaderSpan(this.$element, this.options.source));
        }

        loadSources(loader: ResponsiveImageSourceLoader) : void {
            this.imageConfiguration = loader.loadImageConfiguration().getImageConfiguration();
		}

		/** local destroy overwrites JQueryPluginBase destroy method */
		destroy(): void {
			// custom destroy calls
			console.log('plugin destroy');
			this.demo.destroy();

			// call destroy function of parent class as last call to reset element to initial state
			super.destroy();
		}
	}

	/** Attach plugin to jQuery fn namespace */
	$.fn[Plugin.NAME] = function (options: any) {
		return this.each(function () {
			let $this = $(this);
			if (!$this.data(Plugin.NAME)) {
				$this.data(Plugin.NAME, new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);

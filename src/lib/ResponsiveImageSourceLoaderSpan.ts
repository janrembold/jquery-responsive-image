import {ResponsiveImageSourceLoader} from "../interfaces/ResponsiveImageSourceLoader";
import {ResponsiveImageSourceOptions} from "../interfaces/ResponsiveImageSourceOptions";

export default class ResponsiveImageSourceLoaderSpan implements ResponsiveImageSourceLoader {
    private configuration: any[];

    constructor(
        private $element: JQuery,
        private options: ResponsiveImageSourceOptions) {
    }

    loadImageConfiguration(): ResponsiveImageSourceLoader {
        this.configuration = [];
        return this;
    }

    getImageConfiguration(): any {

    }
}

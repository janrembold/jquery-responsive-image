import {ResponsiveImageSourceOptions} from "./ResponsiveImageSourceOptions";
import {ResponsiveImageAttributeOptions} from "./ResponsiveImageAttributeOptions";
import {ResponsiveImageCalculationOptions} from "./ResponsiveImageCalculationOptions";
import {ResponsiveImageInsertOptions} from "./ResponsiveImageInsertOptions";

export interface ResponsiveImageOptions {
    source: ResponsiveImageSourceOptions,
    attribute: ResponsiveImageAttributeOptions,
    calculation: ResponsiveImageCalculationOptions,
    insert: ResponsiveImageInsertOptions
}
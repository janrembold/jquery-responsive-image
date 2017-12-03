/** Plugin settings **/

var jsOutputFile = 'dist/boilerplate.min.js';
var cssOutputFile = 'dist/styles.css';



/** Webpack configuration **/

var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS = new ExtractTextPlugin(cssOutputFile);

module.exports = {
	// application entry file
	entry: "./src/index.ts",

	// bundled application output file
	output: {
		path: __dirname,
		filename: jsOutputFile
	},

	// Currently we need to add '.ts' to the resolve.extensions array.
	resolve: {
		extensions: ['.ts']
	},

	// Source maps support ('inline-source-map' also works)
	devtool: 'source-map',

	// Add the loader for .ts files.
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader'
			},
			{
				test: /\.scss$/,
				use: extractCSS.extract([
					{
						loader: 'css-loader'
					},
					{
						loader: 'sass-loader'
					}
				])
			}
		]
	},

	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			sourceMap: true,
			compress: {
				warnings: true
			}
		}),
		extractCSS
	]
};

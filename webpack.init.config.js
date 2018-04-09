const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const path = require('path');
const {TsConfigPathsPlugin} = require('awesome-typescript-loader');

module.exports = (options) => {
	let plugins = [
		new webpack.EnvironmentPlugin([
			'NODE_ENV'
		]),
		new TsConfigPathsPlugin()
	];
	let cssLoaders = 'style-loader!css-loader!postcss-loader';

	if (options.buildMode === 'production') {

		if (options.extractLibsAndCss) {
			cssLoaders = ExtractTextPlugin.extract({
				use: ['css', 'postcss'],
				publicPath: '../'
			});
			plugins.push(new ExtractTextPlugin('css/bundle.css'));
		}

		plugins.push(
			new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru|en/),
			// new webpack.optimize.UglifyJsPlugin({
			// 	comments: false,
			// 	compress: {
			// 		warnings: false,
			// 		drop_console: true,
			// 	}
			// }),
			new webpack.optimize.OccurrenceOrderPlugin()
		);
	}

	return {
		entry: ['./demo/client/main'],

		output: {
			path: __dirname + '/demo/public',
			filename: 'js/bundle.js',
		},

		externals: {},

		module: {
			loaders: [
				// {
				// 	test: /\.tsx?$/,
				// 	loader: 'tslint-loader',
				// 	enforce: 'pre'
				// },
				{
					test: /\.tsx?$/,
					loader: ['babel-loader', 'awesome-typescript-loader'],
					exclude: [/node_modules/]
				},
				{
					test: /\.js$/,
					loader: "babel-loader",
					include: [/(imask|webpack-dev-server)/]
				},
				{
					test: /\.css(\?.+)?$/,
					loaders: cssLoaders,
					exclude: [/public/]
				},
				{test: /\.png(\?.+)?$/, loader: 'file?name=images/[hash].[ext]&limit=10000&mimetype=image/png'},
				{test: /\.gif(\?.+)?$/, loader: 'file?name=images/[hash].[ext]&limit=10000&mimetype=image/gif'},
				{test: /\.svg(\?.+)?$/, loader: 'file?name=images/[hash].[ext]&limit=10000&mimetype=image/svg+xml'},
				{test: /\.ttf(\?.+)?$/, loader: 'url-loader?limit=10000&name=fonts/[hash].[ext]'},
				{test: /\.woff(\?.+)?$/, loader: 'url-loader?limit=10000&name=fonts/[hash].[ext]'},
				{test: /\.eot(\?.+)?$/, loader: 'url-loader?limit=10000&name=fonts/[hash].[ext]'}
			]
		},

		watch: options.watch,
		watchOptions: {
			aggregateTimeout: 300
		},

		devtool: options.devtool,

		resolve: {
			modules: ['node_modules'],
			extensions: ['.js', '.jsx', '.tsx', '.ts'],
			alias: {
				actions: path.resolve(__dirname, 'client/actions/'),
				api: path.resolve(__dirname, 'client/api'),
				components: path.resolve(__dirname, 'client/components'),
				constants: path.resolve(__dirname, 'client/constants'),
				containers: path.resolve(__dirname, 'client/containers'),
				core: path.resolve(__dirname, 'client/core/'),
				css: path.resolve(__dirname, 'client/css'),
				interfaces: path.resolve(__dirname, 'client/interfaces'),
				reducers: path.resolve(__dirname, 'client/reducers'),
				selectors: path.resolve(__dirname, 'client/selectors'),
				store: path.resolve(__dirname, 'client/store'),
				utils: path.resolve(__dirname, 'client/utils')
			}
		},

		resolveLoader: {
			modules: ['node_modules'],
			moduleExtensions: ['-loader'],
			extensions: ['.js']
		},

		plugins: plugins,
	};
};
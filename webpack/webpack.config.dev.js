var path = require('path');

module.exports = {
	
	mode: 'development',

	watch: true,

	entry: ['./client/index.ts'],

	module: {
		rules: require('./webpack.rules'),
	},

	output: {
		filename: 'promptBrowser.js',
		path: path.join(__dirname, '../javascript'),
		publicPath: "/"
	},

	plugins: require('./webpack.plugins'),

	resolve: {
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
		alias: {
			client: path.join(__dirname, "../client"),
			clientTypes: path.join(__dirname, "../client/types"),
		}
	},

	stats: 'errors-warnings',

	devtool: 'cheap-module-source-map',

	/* optimization: {
		splitChunks: {
			chunks: 'all',
		},
	}, */

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					chunks: "initial",
					test: path.resolve(process.cwd(), "node_modules"),
					name: "vendor",
					enforce: true
				}
			}
		},
		concatenateModules: true,
		usedExports: true,
		sideEffects: true
	},

	performance: {
		hints: false,
	},
};

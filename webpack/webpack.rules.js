var path = require('path');
const { inDev } = require('./webpack.helpers');

module.exports = [
	{
		// Typescript loader
		test: /\.tsx?$/,
		exclude: /(node_modules|\.webpack)/,
		use: {
			loader: 'ts-loader',
			options: {
				transpileOnly: true,
			},
		},
	},

];

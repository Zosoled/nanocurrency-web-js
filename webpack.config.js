const path = require('path')

module.exports = {
	entry: './index.ts',
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js', '.json'],
		fallback: {
			buffer: require.resolve('buffer'),
			crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
		}
	},
	output: {
		filename: 'index.min.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'var',
		library: 'NanocurrencyWeb',
	},
}

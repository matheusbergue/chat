const path = require('path');

module.exports = {
  entry: {
    main: './src/index.js',
    login: './src/login.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },

  mode: 'development',  // development ou production
  devServer: {
    port: 5000,

  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp|jfif)$/i,
        type: 'asset/resource',
      },
    ],
  },
};

'use strict';

const path = require('path');
const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// const AssetsPlugin = require('assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rimraf = require('rimraf');


function addHash(template, hash) {
    return NODE_ENV == 'production' ?
        template.replace(/\.[^.]+$/, `.[${hash}]$&`) : template;
}

module.exports = {
    context: path.resolve(__dirname, 'frontend'),
    entry:   {
        home:   './home',
        about:  './about',
        common: './common'
    },
    output:  {
        path:           path.resolve(__dirname, 'public', 'assets'),
        publicPath:    '/assets/',
        filename:      addHash('[name].js', 'chunkhash'),
        chunkFilename: addHash('[id].js', 'chunkhash'),
        library:       '[name]'
    },

    resolve: {
        extensions: ['', '.js', '.styl']
    },

    module: {

        loaders: [{
            test:   /\.js$/,
            loader: "babel?presets[]=es2015"
        }, {
            test:   /\.jade$/,
            loader: "jade"
        }, {
            test:   /\.styl$/,
            loader: ExtractTextPlugin.extract('css!stylus?resolve url')
        }, {
            test:   /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
            loader: addHash('file?name=[path][name].[ext]', 'hash:6')
        }]

    },

    plugins: [
        {
            apply: (compiler) => {
                rimraf.sync(compiler.options.output.path);
            }
        },
        new ExtractTextPlugin(addHash('[name].css', 'contenthash'), {allChunks: true}),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common'
        }),
        // new AssetsPlugin({
        //     filename: 'assets.json',
        //     path:     path.resolve(__dirname, 'public', 'assets')
        // })
        new HtmlWebpackPlugin({
            filename: './about.html',
            chunks: ['common', 'about']
        }),
        new HtmlWebpackPlugin({
            filename: './home.html',
            chunks: ['common', 'home']
        })
    ]
};
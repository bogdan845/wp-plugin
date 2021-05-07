const webpack = require("webpack");
const path = require("path");
const ASSET_PATH = process.env.ASSET_PATH || '/';
const TerserWebpackPlugin = require("terser-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const chokidar = require('chokidar');

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;


// const filename = (extnsn) => isDev ? `[name].${extnsn}` : `[name].[contenthash].bundle.${extnsn}`;

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: {
        main: ["@babel/polyfill", "./index.js"],
    },
    output: {
        // path: path.resolve(__dirname, 'public'),
        // filename: '[name]-bundle.js'
        chunkFilename: "[name].js",
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        publicPath: ASSET_PATH,
    },
    resolve: {
        extensions: [".js", ".json", ".jsx"],
        alias: {
            "@js": path.resolve(__dirname, "src/assets/js"),
        },
        fallback: {
            path: false
        },
        modules: ["node_modules"]
    },
    devtool: "source-map",


    // devServer: {
    // port: 3000,
    // open: true,
    // hot: isDev,

    // proxy: {
    //     '/': {
    //         target: {
    //             host: "localhost",
    //             protocol: "http:",
    //             port: 3000
    //         },
    //         changeOrigin: true,
    //         secure: false
    //     }
    // }
    // },

    // devtool: isDev ? "source-map" : false,
    plugins: [
        new webpack.DefinePlugin({
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
        }),

        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),

        new BrowserSyncPlugin({
            files: [
                '**/*.php',
                'src/**/*.js'
            ],

            host: 'localhost',
            proxy: 'http://localhost/wp-sandbox',
            notify: false,
        })


        // new BrowserSyncPlugin(
        //     {
        //         proxy: 'http://localhost/wp-sandbox',
        //         notify: false,
        //         files: [
        //             {
        //                 match: [
        //                     '**/*.php',
        //                     './src/**/*.js',
        //                     './src**/*.jsx',
        //                     './src**/*.scss'
        //                 ],
        //                 fn: function (event, file) {
        //                     if (event === "change") {
        //                         const bs = require('browser-sync').get('bs-webpack-plugin');
        //                         bs.reload();
        //                     }
        //                 }
        //             }
        //         ],
        //
        //     },
        //     {
        //         reload: false
        //     }
        // )
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserWebpackPlugin()]
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.s[ac]ss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },

            // for import / export usage
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: ["@babel/plugin-proposal-class-properties"]
                    }
                }
            },
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ["babel-loader", "eslint-loader"],
                // use: {
                //     loaders: ["babel-loader", "eslint-loader"],
                //     options: {
                //         plugins: ["@babel/plugin-proposal-class-properties"]
                //     }
                // }
            },
            {
                test: /\.js?x$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', "@babel/preset-react"],
                        plugins: ["@babel/plugin-proposal-class-properties"]
                    }
                }
            }
        ]
    }
};

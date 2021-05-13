const webpack = require("webpack");
const path = require("path");
const ASSET_PATH = process.env.ASSET_PATH || '/';
const TerserWebpackPlugin = require("terser-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


const isDev = process.env.NODE_ENV === "development";
// finish for prov an dev version (minify scripts/assets)
const isProd = !isDev;

// for adding has to file name
// const filename = (extnsn) => isDev ? `[name].${extnsn}` : `[name].[contenthash].bundle.${extnsn}`;

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: {
        main: ["@babel/polyfill", "./index.js", './assets/sass/main.scss'],
    },
    output: {
        chunkFilename: "[name].js",
        filename: "[name].js",
        // path: path.resolve(__dirname, "dist"),
        // publicPath: ASSET_PATH,
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

    optimization: {
        minimize: true,
        minimizer: [new TerserWebpackPlugin(), new OptimizeCssAssetsPlugin()],
    },

    module: {
        rules: [
            {
                test: /\.css$/i,
                exclude: /node_modules/,
                // for some reason with MiniCssExtract.loader styles not working
                use: [/*MiniCssExtractPlugin.loader*/ "style-loader", "css-loader"],
            },
            {
                test: /\.s[ac]ss$/,
                // for some reason with MiniCssExtract.loader styles not working
                use: [/*MiniCssExtractPlugin.loader*/ "style-loader", "css-loader", "sass-loader"]
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
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
        }),
        new BrowserSyncPlugin({
            files: [
                '**/*.php',
                'src/**/*.js',
            ],
            host: 'localhost',
            proxy: 'http://localhost/wp-sandbox',
            notify: false,
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
    ],
};


/* old for dev server */

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
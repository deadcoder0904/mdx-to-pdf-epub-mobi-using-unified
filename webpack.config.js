"use strict";
exports.__esModule = true;
/**
 * node imports
 */
var path = require("node:path");
var url = require("node:url");
/**
 * remark imports
 */
var remark_gfm_1 = require("remark-gfm");
var remark_frontmatter_1 = require("remark-frontmatter");
var remark_mdx_frontmatter_1 = require("remark-mdx-frontmatter");
var remark_unwrap_images_1 = require("remark-unwrap-images");
var __filename = url.fileURLToPath(import.meta.url);
var __dirname = url.fileURLToPath(new URL('.', import.meta.url));
var config = {
    entry: './src/index.ts',
    target: 'node',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    experiments: {
        outputModule: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.mdx?$/,
                use: [
                    {
                        loader: '@mdx-js/loader',
                        /** @type {import('@mdx-js/loader').Options} */
                        options: {
                            fixRuntimeWithoutExportMap: false,
                            remarkPlugins: [
                                remark_gfm_1["default"],
                                remark_frontmatter_1["default"],
                                [remark_mdx_frontmatter_1["default"], { name: 'frontmatter' }],
                                remark_unwrap_images_1["default"],
                            ]
                        }
                    },
                ]
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};
exports["default"] = config;

/**
 * node imports
 */
import * as path from 'node:path'
import * as url from 'node:url'

/**
 * npm imports
 */
import * as webpack from 'webpack'

/**
 * remark imports
 */
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkUnwrapImages from 'remark-unwrap-images'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const config: webpack.Configuration = {
  entry: './src/index.ts',
  target: 'node',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
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
                remarkGfm,
                remarkFrontmatter,
                [remarkMdxFrontmatter, { name: 'frontmatter' }],
                remarkUnwrapImages,
              ],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}

export default config

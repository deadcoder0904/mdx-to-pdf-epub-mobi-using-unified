/**
 * node imports
 */
import fs from 'node:fs'
import path from 'node:path'

/**
 * npm imports
 */
import fg from 'fast-glob'
import { copyFile } from 'cp-file'

/**
 * react imports
 */
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

/**
 * unified imports
 */
import { unified } from 'unified'
import { readSync, writeSync } from 'to-vfile'
import { reporter } from 'vfile-reporter'

/**
 * remark imports
 */

/**
 * rehype imports
 */
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeRewrite from 'rehype-rewrite'
import rehypeAddClasses from 'rehype-add-classes'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

/**
 * local imports
 */
import Content from './_book/index.mdx'
import * as meta from './_book/index.mdx'

const markup = renderToStaticMarkup(React.createElement(Content))

const BOOK_PATH = '_book/index.mdx'
const DEST_PATH = 'output'

const main = async () => {
  // copy all images from `_book/` to `output/`
  const images = fg.sync(['**/*.{jpg,png}'])
  images.forEach(async (image) => {
    const filename = image.split('/').pop()
    await copyFile(image, `output/${filename}`)
  })

  const processor = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeDocument, {
      title: meta.title || 'book',
      css: 'styles/pdf.css',
    }) // document should be after sanitize
    .use(rehypeRewrite, {
      rewrite: (node) => {
        if (node.type == 'element' && node.tagName == 'body') {
          node.children = [
            {
              type: 'element',
              tagName: 'img',
              properties: {
                src: meta.cover || '',
                alt: 'cover',
              },
            },
            ...node.children,
          ]
        }
      },
    })
    .use(rehypeStringify)
    .use(rehypeFormat)
    .use(rehypeAddClasses, {
      pre: 'hljs',
      'h1,h2,h3': 'title',
      h1: 'is-1',
      h2: 'is-2',
      p: 'one two',
    })
  // .use(rehypeAutolinkHeadings)

  try {
    const file = await processor.process(markup)
    console.error(reporter(file))
    if (!fs.existsSync(DEST_PATH)) {
      fs.mkdirSync(DEST_PATH)
    }
    file.path = path.join(DEST_PATH, 'index')
    file.extname = '.html'
    writeSync(file)
  } catch (error) {
    throw error
  }
}

main()

/**
 * node imports
 */
import fs from 'node:fs'
import path from 'node:path'

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
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkFrontmatter from 'remark-frontmatter'
import remarkParseFrontmatter from 'remark-parse-frontmatter'

/**
 * rehype imports
 */
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeAddClasses from 'rehype-add-classes'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

/**
 * local imports
 */
import Content from './_book/index.mdx'

const markup = renderToStaticMarkup(React.createElement(Content))

const BOOK_PATH = '_book/index.mdx'
const DEST_PATH = 'output'

const processor = unified()
  .use(remarkParse)
  // .use(remarkFrontmatter)
  // .use(remarkParseFrontmatter)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSanitize)
  .use(rehypeDocument, { title: 'Content' }) // document should be after sanitize
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

const html = processor.process(markup)

html.then(
  (file) => {
    console.error(reporter(file))
    if (!fs.existsSync(DEST_PATH)) {
      fs.mkdirSync(DEST_PATH)
    }
    file.path = path.join(DEST_PATH, 'index')
    file.extname = '.html'
    writeSync(file)
  },
  (error) => {
    throw error
  }
)

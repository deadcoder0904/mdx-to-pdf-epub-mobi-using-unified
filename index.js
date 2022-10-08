import fs from 'node:fs'
import path from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { unified } from 'unified'
import { readSync, writeSync } from 'to-vfile'
import { reporter } from 'vfile-reporter'
import rehypeParse from 'rehype-parse'
import remarkRetext from 'remark-retext'
import remarkRehype from 'remark-rehype'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeAddClasses from 'rehype-add-classes'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import retextEnglish from 'retext-english'
import retextIndefiniteArticle from 'retext-indefinite-article'

import Content from './_book/index.mdx'

const markup = renderToStaticMarkup(React.createElement(Content))

const BOOK_PATH = '_book/index.mdx'
const DEST_PATH = 'output'

const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(remarkRetext, unified().use(retextEnglish).use(retextIndefiniteArticle))
  .use(remarkFrontmatter)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSanitize)
  .use(rehypeStringify)
  .use(rehypeDocument, { title: 'Conten1' }) // document should be after sanitize
  .use(rehypeFormat)
  .use(rehypeAddClasses, {
    pre: 'hljs',
    'h1,h2,h3': 'title',
    h1: 'is-1',
    h2: 'is-2',
    p: 'one two',
  })
  .use(rehypeAutolinkHeadings)

const ile = processor.process(markup)
console.log({ ile })

ile.then(
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

import fs from 'node:fs'
import path from 'node:path'
import { unified } from 'unified'
import { readSync, writeSync } from 'to-vfile'
import { reporter } from 'vfile-reporter'
import remarkParse from 'remark-parse'
import remarkRetext from 'remark-retext'
import remarkRehype from 'remark-rehype'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeAddClasses from 'rehype-add-classes'
import retextEnglish from 'retext-english'
import retextIndefiniteArticle from 'retext-indefinite-article'

const BOOK_PATH = '_book/index.mdx'
const DEST_PATH = 'output'

const processor = unified()
  .use(remarkParse)
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

processor.process(readSync(BOOK_PATH)).then(
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

import { createLoader } from '@mdx-js/node-loader'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'

// Load is for Node 17+, the rest for 12, 14, 16.
const { load, getFormat, transformSource } = createLoader({
  fixRuntimeWithoutExportMap: false,
  remarkPlugins: [remarkGfm, remarkFrontmatter],
})

export { load, getFormat, transformSource }

declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element
  export default MDXComponent
}

declare module 'rehype-add-classes'
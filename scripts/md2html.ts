import { readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Command } from 'commander'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

const __dirname = dirname(fileURLToPath(import.meta.url))

type Options = {
  output: string
  html?: boolean
}
async function main(input: string, options: Options) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: options.html })
    .use(rehypeStringify, { allowDangerousHtml: options.html })

  const md = await readFile(input, 'utf-8')

  const htmlContent = await processor.process(md)

  const finalHtml = String(htmlContent)

  await writeFile(options.output, finalHtml, 'utf-8')
}

export const md2html = new Command('md2html')

md2html
  .option('-o, --output [path]', 'output path for the generated HTML file')
  .option('--html', 'Support raw HTML in the Markdown input')
  .argument('<input>', 'path to the input Markdown file')
  .action(async (input, options) => {
    const inputDir = dirname(input)
    const inputFileName = basename(input, extname(input))
    options.output = options.output ?? join(inputDir, `${inputFileName}.output.html`)

    await main(input, options)
  })

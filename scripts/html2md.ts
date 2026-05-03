import { readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Command } from 'commander'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'

const __dirname = dirname(fileURLToPath(import.meta.url))

type Options = {
  output: string
}
async function main(input: string, options: Options) {
  const processor = unified().use(rehypeParse).use(rehypeRemark).use(remarkStringify)

  const html = await readFile(input, 'utf-8')

  const mdContent = await processor.process(html)

  const finalMd = String(mdContent)

  await writeFile(options.output, finalMd, 'utf-8')
}

export const html2md = new Command('html2md')

html2md
  .option('-o, --output [path]', 'output path for the generated Markdown file')
  .argument('<input>', 'path to the input HTML file')
  .action(async (input, options) => {
    const inputDir = dirname(input)
    const inputFileName = basename(input, extname(input))
    options.output = options.output ?? join(inputDir, `${inputFileName}.output.md`)

    await main(input, options)
  })

import { program } from 'commander'

import { html2md } from './scripts/html2md.js'
import { md2html } from './scripts/md2html.js'

program.addCommand(md2html).addCommand(html2md)

if (import.meta.main) {
  program.parseAsync()
}

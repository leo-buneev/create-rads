#!/usr/bin/env node
import banner from './utils/banner'
import path from 'node:path'
import renderTemplate from 'utils/renderTemplate'
import { green, bold } from 'kolorist'


async function run() {
  const cwd = process.cwd()
  let root = cwd
  const subDirectory = process.argv[2]
  if(subDirectory) root = path.join(root, subDirectory)

  console.info(`\n${banner}\n`)
  const templateRoot = path.resolve(__dirname, 'template')
  renderTemplate(templateRoot, root)


  // Supported package managers: pnpm > yarn > npm
  const userAgent = process.env.npm_config_user_agent ?? ''
  const packageManager = /pnpm/.test(userAgent) ? 'pnpm' : /yarn/.test(userAgent) ? 'yarn' : 'npm'

  console.log(`\nDone. Now run:\n`)
  console.log(`  ${bold(green(packageManager === 'npm' ? `npm run dev` : `${packageManager} dev`))}`)
  console.log()
}

run().catch((e) => {
  console.error(e)
})
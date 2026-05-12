#!/usr/bin/env node

import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { Command } from "commander"
import { parse as parseYaml } from "yaml"

const __dirname = dirname(fileURLToPath(import.meta.url))
const toolsDir = resolve(__dirname, "../tools")
const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, "../package.json"), "utf8"),
) as { version: string }

type Tool = {
  description?: string
  alternatives?: string[]
}

function loadTool(name: string): Tool | undefined {
  try {
    const raw = readFileSync(resolve(toolsDir, `${name}.yaml`), "utf8")
    return parseYaml(raw) as Tool
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return undefined
    throw err
  }
}

const program = new Command()

program
  .name("alterm")
  .version(packageJson.version)
  .description("Find alternatives to programs, apps, websites and other software.")
  .argument("[program]", "Program to list alternatives for")
  .action((programName: string | undefined) => {
    if (!programName) {
      program.help()
    }
    const tool = loadTool(programName!)
    if (!tool) {
      console.error(`No entry for "${programName}".`)
      process.exit(1)
    }
    const alts = tool.alternatives ?? []
    if (alts.length === 0) {
      console.log(`No alternatives listed for "${programName}".`)
      return
    }
    console.log(`Alternatives to ${programName}:`)
    for (const alt of alts) console.log(`  - ${alt}`)
  })

program
  .command("alternative <prog> <alt>")
  .description(
    "Saves <alt> as an alternative to <prog>. " +
      "Attention: <prog> and <alt> must already be registered.",
  )
  .action((_prog: string, _alt: string) => {
    // TODO: implement
  })

program
  .command("info <program>")
  .description("Displays information about <program>.")
  .action((_program: string) => {
    // TODO: implement
  })

program
  .command("report <text>")
  .description(
    "Report errors regarding the listed programs and suggest improvements.",
  )
  .action((_text: string) => {
    // TODO: implement
  })

program.addHelpText(
  "after",
  `
Examples:
  alterm chrome           Shows all alternatives to Chrome.
`,
)

program.parse(process.argv)

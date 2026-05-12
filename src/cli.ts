#!/usr/bin/env node

import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { Command } from "commander"

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, "../package.json"), "utf8"),
) as { version: string }

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
    // TODO: list alternatives for `programName`
  })

program
  .command("add <program>")
  .description(
    "Adds <program> to database. " +
      "Prompts you to enter the name, description, " +
      "the programs it is an alternative to, …",
  )
  .action((_program: string) => {
    // TODO: implement
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
  alterm add photoshop    Adds photoshop as a new program.
`,
)

program.parse(process.argv)

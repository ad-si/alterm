#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { parse as parseYaml } from "yaml"

const __dirname = dirname(fileURLToPath(import.meta.url))
const toolsDir = resolve(__dirname, "../tools")

type FieldKind = "string" | "string[]"

const schema: Record<string, FieldKind> = {
  description: "string",
  tags: "string[]",
  links: "string[]",
  alternatives: "string[]",
  command: "string",
  url: "string",
  installation: "string",
  installations: "string[]",
  input: "string",
  output: "string",
  platforms: "string[]",
}

function validate(file: string, data: unknown): string[] {
  const errors: string[] = []
  if (data === null || data === undefined) {
    errors.push(`${file}: file is empty`)
    return errors
  }
  if (typeof data !== "object" || Array.isArray(data)) {
    errors.push(`${file}: top-level value must be a mapping`)
    return errors
  }
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const kind = schema[key]
    if (!kind) {
      errors.push(`${file}: unknown key "${key}"`)
      continue
    }
    if (kind === "string") {
      if (typeof value !== "string") {
        errors.push(`${file}: "${key}" must be a string`)
      } else if (value.trim() === "") {
        errors.push(`${file}: "${key}" must not be empty`)
      }
    } else {
      if (!Array.isArray(value)) {
        errors.push(`${file}: "${key}" must be a list`)
        continue
      }
      if (value.length === 0) {
        errors.push(`${file}: "${key}" must not be empty`)
        continue
      }
      for (const [i, v] of value.entries()) {
        if (typeof v !== "string") {
          errors.push(`${file}: "${key}[${i}]" must be a string`)
        } else if (v.trim() === "") {
          errors.push(`${file}: "${key}[${i}]" must not be empty`)
        }
      }
    }
  }
  return errors
}

const files = readdirSync(toolsDir)
  .filter((f) => f.endsWith(".yaml"))
  .sort()

let errorCount = 0
let fileErrorCount = 0

for (const file of files) {
  const path = join(toolsDir, file)
  let parsed: unknown
  try {
    parsed = parseYaml(readFileSync(path, "utf8"))
  } catch (err) {
    fileErrorCount++
    errorCount++
    console.error(`${file}: YAML parse error: ${(err as Error).message}`)
    continue
  }
  const errors = validate(file, parsed)
  if (errors.length > 0) {
    fileErrorCount++
    errorCount += errors.length
    for (const e of errors) console.error(e)
  }
}

if (errorCount === 0) {
  console.log(`Checked ${files.length} files. All valid.`)
} else {
  console.error(
    `\nChecked ${files.length} files. ` +
      `Found ${errorCount} error(s) in ${fileErrorCount} file(s).`,
  )
  process.exit(1)
}

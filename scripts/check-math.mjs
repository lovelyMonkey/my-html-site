import { build } from 'esbuild'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const dir = await mkdtemp(join(tmpdir(), 'xiaodoumiao-check-'))
try {
  const output = join(dir, 'check.mjs')
  await build({ entryPoints: [process.argv[2] ?? 'scripts/math-checks.ts'], bundle: true, platform: 'node', format: 'esm', outfile: output, tsconfig: 'tsconfig.app.json' })
  await import(pathToFileURL(output).href)
} finally {
  await rm(dir, { recursive: true, force: true })
}

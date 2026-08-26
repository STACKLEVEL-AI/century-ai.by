import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const rootDir = process.cwd()
const outDir = join(rootDir, 'out')
const outIndex = join(outDir, 'index.html')
const cnameSrc = join(rootDir, 'CNAME')
const cnameDst = join(outDir, 'CNAME')
const noJekyll = join(outDir, '.nojekyll')
const verifyOnly = process.argv.includes('--verify-only')

function fail(message) {
  console.error(`postexport: ${message}`)
  process.exit(1)
}

function assertArtifact() {
  if (!existsSync(outDir)) fail('missing ./out directory, run `next build` first.')
  if (!existsSync(outIndex)) fail('missing ./out/index.html, static export artifact is incomplete.')
  if (!existsSync(noJekyll)) fail('missing ./out/.nojekyll.')

  if (existsSync(cnameSrc)) {
    if (!existsSync(cnameDst)) fail('missing ./out/CNAME while CNAME exists in repo root.')
    if (readFileSync(cnameSrc, 'utf8').trim() !== readFileSync(cnameDst, 'utf8').trim()) {
      fail('CNAME content mismatch between ./CNAME and ./out/CNAME.')
    }
  }
}

if (!verifyOnly) {
  if (!existsSync(outDir)) fail('missing ./out directory, run `next build` first.')
  writeFileSync(noJekyll, '')
  if (existsSync(cnameSrc)) copyFileSync(cnameSrc, cnameDst)
}

assertArtifact()
console.log('postexport: artifact is ready.')

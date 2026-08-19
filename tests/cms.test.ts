import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { safeExternalUrl } from '../app/utils/safe-url.ts'
import {
  ACTIVE_ANNOUNCEMENT_QUERY,
  LABS_PROJECTS_QUERY,
  POST_BY_SLUG_QUERY,
  POSTS_QUERY,
} from '../app/utils/sanity-queries.ts'

test('CMS links reject unsafe schemes', () => {
  assert.equal(safeExternalUrl('javascript:alert(1)'), undefined)
  assert.equal(safeExternalUrl('https://deflowlabs.io/blog'), 'https://deflowlabs.io/blog')
})

test('public post queries exclude drafts and future publication dates', () => {
  for (const query of [POSTS_QUERY, POST_BY_SLUG_QUERY]) {
    assert.match(query, /drafts\.\*\*/)
    assert.match(query, /publishedAt <= now\(\)/)
  }
})

test('Labs projects have deterministic explicit ordering', () => {
  assert.match(LABS_PROJECTS_QUERY, /displayOrder/)
  assert.match(LABS_PROJECTS_QUERY, /_id asc/)
})

test('all public CMS consumers require authenticated preview state for drafts', () => {
  for (const query of [POSTS_QUERY, POST_BY_SLUG_QUERY, LABS_PROJECTS_QUERY, ACTIVE_ANNOUNCEMENT_QUERY]) {
    assert.match(query, /\$preview/)
    assert.match(query, /drafts\.\*\*/)
  }
})

test('official visual editing replaces the custom query and cookie endpoints', async () => {
  const config = await readFile(new URL('../nuxt.config.ts', import.meta.url), 'utf8')
  assert.match(config, /@nuxtjs\/sanity/)
  assert.match(config, /mode:\s*'live-visual-editing'/)
  assert.match(config, /keepStegaOnCopy:\s*false/)
  assert.match(config, /Content-Security-Policy.*frame-ancestors/s)
  assert.doesNotMatch(config, /X-Frame-Options|SANITY_PREVIEW_COOKIE_SECRET/)

  assert.equal(existsSync(new URL('../server/api/sanity/query.post.ts', import.meta.url)), false)
  assert.equal(existsSync(new URL('../server/utils/sanity-preview.ts', import.meta.url)), false)
})

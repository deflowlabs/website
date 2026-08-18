import assert from 'node:assert/strict'
import test from 'node:test'
import { safeExternalUrl, safeLocalPath } from '../app/utils/safe-url.ts'
import { LABS_PROJECTS_QUERY, POST_BY_SLUG_QUERY, POSTS_QUERY } from '../app/utils/sanity-queries.ts'

test('CMS links reject unsafe schemes and external preview redirects', () => {
  assert.equal(safeExternalUrl('javascript:alert(1)'), undefined)
  assert.equal(safeExternalUrl('https://deflowlabs.io/blog'), 'https://deflowlabs.io/blog')
  assert.equal(safeLocalPath('//example.com/phish'), '/')
  assert.equal(safeLocalPath('/\\example.com/phish'), '/')
  assert.equal(safeLocalPath('/blog/example?preview=1'), '/blog/example?preview=1')
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

import assert from 'node:assert/strict'
import test from 'node:test'
import { encodeSignatureHeader, isValidSignature } from '@sanity/webhook'
import { baseRevalidationPaths } from '../server/utils/sanity-revalidation.ts'

test('Sanity webhook signatures accept the intended secret and reject another', async () => {
  const body = JSON.stringify({ operation: 'update', after: { _id: 'post-1', _type: 'post', slug: 'new' } })
  const signature = await encodeSignatureHeader(body, Date.now(), 'correct-secret')
  assert.equal(await isValidSignature(body, signature, 'correct-secret'), true)
  assert.equal(await isValidSignature(body, signature, 'wrong-secret'), false)
  assert.equal(await isValidSignature(`${body} `, signature, 'correct-secret'), false)
})

test('slug changes purge old and new routes without duplicates', () => {
  const paths = baseRevalidationPaths('post', { slug: 'old' }, { slug: 'new' })
  assert.deepEqual([...paths], ['/blog', '/rss.xml', '/sitemap.xml', '/blog/old', '/blog/new'])
  assert.deepEqual([...baseRevalidationPaths('announcement')], [])
})

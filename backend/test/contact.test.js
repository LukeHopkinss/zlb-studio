const { test } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../app');
const { Resend } = require('resend');

test('contact validation, provider delivery, error handling, and request limits', async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/contact`;
  const post = (body, headers = {}) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
  const valid = { name: 'Test Visitor', email: 'visitor@example.com', message: 'A test inquiry.' };
  const original = Resend.prototype.post;
  process.env.RESEND_API_KEY = 're_test';
  process.env.RESEND_FROM_EMAIL = 'Studio <hello@example.com>';
  let sent;
  Resend.prototype.post = async (path, payload) => { sent = { path, payload }; return { data: { id: 'test-id' }, error: null }; };
  try {
    assert.equal((await fetch(url.replace('/contact', '/missing'))).status, 404);
    assert.equal((await post(valid, { Origin: 'https://untrusted.example' })).status, 403);
    assert.equal((await post({ ...valid, email: 'invalid' })).status, 400);
    assert.equal((await post({ ...valid, name: {} })).status, 400);
    assert.equal((await post({ ...valid, website: 'spam.example' })).status, 200);
    assert.equal(sent, undefined);
    assert.equal((await post(valid)).status, 200);
    assert.deepEqual(sent.payload.to, ['luke.hopkins@outlook.com']);
    assert.equal(sent.payload.reply_to, valid.email);
    assert.equal(sent.payload.text.includes(valid.message), true);
    Resend.prototype.post = async () => ({ data: null, error: { message: 'private provider detail' } });
    const failure = await post(valid);
    assert.equal(failure.status, 503);
    assert.equal((await failure.text()).includes('private provider detail'), false);
    assert.equal((await post(valid)).status, 429);
  } finally {
    Resend.prototype.post = original;
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
    await new Promise(resolve => server.close(resolve));
  }
});

test('production build serves SPA deep links and SEO files', { skip: !require('node:fs').existsSync(require('node:path').resolve(__dirname, '../../frontend/dist/index.html')) }, async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const path of ['/contact', '/privacy', '/terms', '/work/2econd2kin']) {
      const result = await fetch(origin + path);
      assert.equal(result.status, 200);
      assert((await result.text()).includes('<div id="root"></div>'));
    }
    const sitemap = await fetch(origin + '/sitemap.xml');
    assert.equal(sitemap.status, 200);
    assert((await sitemap.text()).includes('https://zlbstudio.com/work/2econd2kin'));
    const robots = await fetch(origin + '/robots.txt');
    assert.equal(robots.status, 200);
    assert((await robots.text()).includes('Sitemap: https://zlbstudio.com/sitemap.xml'));
    const api = await fetch(origin + '/api/missing');
    assert.equal(api.status, 404);
    assert.equal((await api.json()).success, false);
  } finally { await new Promise(resolve => server.close(resolve)); }
});

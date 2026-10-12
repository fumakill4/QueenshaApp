import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const store = new Map();
const auth = { currentUser: { uid: 'account-a' } };
let denied = false;
globalThis.cacheFixture = { auth, storage: { getItem: async k => store.get(k), setItem: async (k, v) => store.set(k, v) }, net: { fetch: async () => ({ isConnected: true }) }, getDocs: async () => { if (denied) throw Object.assign(Error('denied'), { code: 'permission-denied' }); return { docs: [] }; } };
let source = await readFile(new URL('../src/lib/syncEngine.js', import.meta.url), 'utf8');
source = source.replace(/^import .+;\n/gm, '') + '\n';
source = `const AsyncStorage = globalThis.cacheFixture.storage; const NetInfo = globalThis.cacheFixture.net; const { auth } = globalThis.cacheFixture; const db = {}; const collection = () => ({}); const getDocs = globalThis.cacheFixture.getDocs;\n` + source;
const module = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
test('cache and queued mutations never cross accounts', async () => {
  await module.cacheData('PRODUCTS', [{ id: 'private-a' }]);
  await module.addOfflineAction('EDIT_PRODUCT', { id: 'private-a' });
  auth.currentUser = { uid: 'account-b' };
  assert.equal(await module.getCachedData('PRODUCTS'), null);
  assert.ok(!store.has(module.scopedStorageKey('OFFLINE_SYNC_QUEUE')));
  assert.ok(store.has('account:account-a:OFFLINE_SYNC_QUEUE'));
});
test('denied access does not fall back to previously cached data', async () => {
  await module.cacheData('PRODUCTS', [{ id: 'private-b' }]); denied = true;
  assert.deepEqual(await module.fetchCollectionData('products'), []);
  auth.currentUser = null;
  assert.throws(() => module.scopedStorageKey('PRODUCTS'), /Authenticated/);
  assert.deepEqual(await module.fetchCollectionData('products'), []);
});

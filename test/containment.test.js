const { test } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const { loadScope, inScope } = require(path.join(__dirname, '..', 'src', 'scope-guard.js'));
const { checkTarget } = require(path.join(__dirname, '..', 'src', 'ssrf-guard.js'));
const { scanAll } = require(path.join(__dirname, '..', 'src', 'enforce.js'));

function scope(obj) {
  const fs = require('node:fs'), os = require('node:os');
  const p = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sl-')), 'scope.json');
  fs.writeFileSync(p, JSON.stringify(obj));
  return loadScope(p);
}

test('empty scope denies everything (fail-closed)', () => {
  const s = scope({ targets: [], exclusions: [] });
  assert.strictEqual(inScope('http://anything.example', s).ok, false);
});

test('authorized host is in scope, others are not', () => {
  const s = scope({ targets: ['example.test'], exclusions: [] });
  assert.strictEqual(inScope('http://example.test', s).ok, true);
  assert.strictEqual(inScope('http://evil.example', s).ok, false);
});

test('ssrf-guard denies loopback/metadata by default', () => {
  assert.strictEqual(checkTarget('http://127.0.0.1/').ok, false);
  assert.strictEqual(checkTarget('http://169.254.169.254/').ok, false);
});

test('enforce flags a destructive command', () => {
  // scanAll(command) real contract (src/enforce.js): returns the first hit's refusal
  // REASON STRING (scanDangerous(cmd) ?? scanRate(cmd)), or `undefined` when the
  // command is not flagged. It is not an array and not an object with a `.dangerous`
  // field (that was the brief's guess) — adapted the assertion to the real shape.
  const res = scanAll('rm -rf /');
  assert.strictEqual(typeof res, 'string');
  assert.ok(res.length > 0);
  assert.match(res, /rm|delete/i);
  // sanity: a benign command is not flagged, proving the assertion above isn't a tautology
  assert.strictEqual(scanAll('ls -la'), undefined);
});

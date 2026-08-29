const { test } = require('node:test');
const assert = require('node:assert');
const path = require('node:path'), fs = require('node:fs'), os = require('node:os');
const at = require(path.join(__dirname, '..', 'src', 'audit-trail.js'));

function freshAuditDir() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'sl-audit-'));
  process.env.AUDIT_DIR = d;
  return d;
}

test('a well-formed chain verifies, a tampered one does not', () => {
  freshAuditDir();
  assert.ok(at.append({ action: 'a', detail: 'first' }).ok);
  assert.ok(at.append({ action: 'b', detail: 'second' }).ok);
  assert.ok(at.append({ action: 'c', detail: 'third' }).ok);
  const file = at.auditFile();
  assert.strictEqual(at.verifyAuditFile(file).ok, true);
  // corrupt a line in the middle
  const lines = fs.readFileSync(file, 'utf8').trim().split('\n');
  const obj = JSON.parse(lines[1]); obj.detail = 'TAMPERED'; lines[1] = JSON.stringify(obj);
  fs.writeFileSync(file, lines.join('\n') + '\n');
  assert.strictEqual(at.verifyAuditFile(file).ok, false);
});

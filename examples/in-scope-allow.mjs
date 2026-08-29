// Demo: comando IN scope -> run.js lo consente ed esegue un binario innocuo (echo),
// registrando l'azione. Nessuna rete.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ws = mkdtempSync(join(tmpdir(), 'scopelock-demo-'));
writeFileSync(join(ws, 'scope.json'), JSON.stringify({ project: 'demo', targets: ['example.test'], exclusions: [] }));
const env = { ...process.env, SCOPE_JSON: join(ws, 'scope.json'), AUDIT_DIR: join(ws, 'audit') };

const allowed = spawnSync('node', [join(root, 'src', 'run.js'), 'echo', 'scanning http://example.test'], { env, encoding: 'utf8' });
const ok = allowed.status === 0;
console.log(`in-scope command exit=${allowed.status}  ->  ${ok ? 'ALLOWED ✓' : 'BLOCKED ⚠'}`);
console.log((allowed.stdout || '').trim());
console.log(ok ? '\nDEMO OK: l\'azione in scope passa il gate.' : '\nDEMO FAIL');
process.exit(ok ? 0 : 1);

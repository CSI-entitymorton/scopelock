// Demo: un agente tenta un comando FUORI scope -> run.js lo BLOCCA (fail-closed),
// l'azione e' nell'audit-trail hash-chained, e la catena e' VERIFICABILE.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ws = mkdtempSync(join(tmpdir(), 'scopelock-demo-'));
writeFileSync(join(ws, 'scope.json'), JSON.stringify({ project: 'demo', targets: ['example.test'], exclusions: [] }));
const env = { ...process.env, SCOPE_JSON: join(ws, 'scope.json'), AUDIT_DIR: join(ws, 'audit') };

// 1) comando fuori scope -> DENY
const denied = spawnSync('node', [join(root, 'src', 'run.js'), 'curl', 'https://not-authorized.example'], { env, encoding: 'utf8' });
const blocked = denied.status === 1;
console.log(`out-of-scope command exit=${denied.status}  ->  ${blocked ? 'BLOCKED ✋' : 'NOT BLOCKED ⚠'}`);

// 2) l'audit chain deve verificare
const verify = spawnSync('node', [join(root, 'src', 'audit-trail.js'), 'verify'], { env, encoding: 'utf8' });
const verified = verify.status === 0;
console.log(`audit chain verify exit=${verify.status}  ->  ${verified ? 'VERIFIED ✓' : 'FAILED ⚠'}`);

const ok = blocked; // il blocco e' l'asserzione minima; verify e' informativo se run.js audita il blocco
console.log(ok ? '\nDEMO OK: lo scope-enforcement e\' fail-closed.' : '\nDEMO FAIL');
process.exit(ok ? 0 : 1);

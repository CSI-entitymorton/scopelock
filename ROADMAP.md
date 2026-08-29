# Roadmap

`scopelock` today ships the core containment + tamper-evidence primitives (this repo).
The direction below extends it into a full, privacy-first evidence layer for autonomous
AI agents running on local models. Contributions and feedback on any item are welcome —
open an issue.

## Shipped
- **Containment core** — scope enforcement in code, fail-closed; SSRF/DNS-rebinding guard;
  execution chokepoint that scope-checks and audits every command.
- **Tamper-evident proof** — hash-chained audit trail (`verify` detects any change);
  mechanical verification oracle.
- **Runaway guards** — action/time budget, loop detection, reflection.
- Runnable deny/allow demos, hermetic offline test suite, CI. Zero npm dependencies.

## Planned

### 1. Local-model driver (privacy-first)
Wire the containment core as the guardrail around a **fully local** agent (e.g. a 24 GB
consumer GPU running an open-weights model), so an autonomous agent can act on real
targets without any data leaving the machine. No cloud API, no third-party egress.

### 2. Verifiable evidence output (open formats)
Emit findings and actions as **SARIF**, with a **tamper-evident attestation** (in-toto /
hash-chain) that any third party can independently reproduce and verify. The goal: an
AI-produced security finding that is *checkable*, not taken on trust.

### 3. Containment stress-harness
A reproducible adversarial suite that tries to make an autonomous agent escape its scope,
proving the guarantees hold under pressure ("if it contains an offensive agent, it
contains anything").

### 4. Reproducible benchmark
An open eval harness + published report on how the contained local agent behaves across
configurations — reproducible by anyone, no hosted service required.

### 5. Task-specific tuning
Openly released adapters for driving the containment loop efficiently on modest hardware.

### 6. Docs, packaging, security audit
First-class documentation, CI integration recipes, and an independent security review.

---

*scopelock is developed as free software for the digital commons. Its ongoing R&D is being
proposed for funding under the [NGI Zero](https://nlnet.nl/) programme (NLnet Foundation).*

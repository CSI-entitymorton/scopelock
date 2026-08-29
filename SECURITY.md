# Security Policy

## Reporting

Report vulnerabilities by email to scorsini65@gmail.com. Do not open public issues for
vulnerabilities that have not yet been disclosed. Indicative response time: 7 days.

## Scope

`scopelock` is a defensive containment layer. The most relevant reports concern:

- bypasses of scope-enforcement (an action reaching execution despite being outside
  `scope.json`),
- undetected tampering with the audit trail (a modified/reordered/deleted entry that
  `audit-trail verify` fails to flag),
- SSRF-guard evasion (a request reaching a loopback, link-local, cloud-metadata, or
  otherwise denied address despite the guard).

Reports outside this scope (e.g. issues in consuming projects, or in tooling not shipped
in this repository) are welcome but may be redirected.

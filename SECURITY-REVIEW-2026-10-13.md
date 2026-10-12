# Security review — 2026-10-13

Prepared by i729. This review records tested source changes; it is not a certification of the deployed service.

## Change

Remove email-based privilege exceptions and self-assigned owner registration; isolate offline data and mutation queues per authenticated account. Remove embedded owner portrait, payment QR and private support contacts. Add claim-based Firestore policies and preserve administrator identity while provisioning another account.

## Validation

20 JavaScript/JSX files parsed; cache isolation tests passed; Firestore emulator denial/owner/admin cases passed.

## Dependency audit

Counts refer to package findings across the complete locked dependency tree, including tooling; they are not counts of distinct exploitable production vulnerabilities.

| Package project | Before | After | Remaining critical | Remaining high |
| --- | ---: | ---: | ---: | ---: |
| QueenshaApp | 59 | 44 | 0 | 29 |

## Required before rollout

Trusted administrators must grant queenshaAdmin/queenshaStaff claims and review existing profiles before deploying the rules. The shared inventory is a single organization, not a multitenant authorization model. Configure payment QR/support values outside source control. Review historical contacts and removed assets separately. Expo/native release compatibility and real devices have not been tested.

## Scope

Source and locally fetched Git branches/tags/available pull-request heads were inspected. Private production settings, actual database policies, deployed binaries, backup stores, and third-party service permissions were not changed. Current-source cleanup does not remove data from Git history, existing forks, cached copies, or previously downloaded assets. Sensitive values are intentionally omitted.

# Graph Query Language

## GET capability

```
GET CAP-learning-shell
```

Returns (via `queryCapability`):

```yaml
capability: CAP-learning-shell
contracts: [CTR-lms-shell@1.0.0, CTR-navigation-laws@1.0.0]
components: [CMP-LearningShell, CMP-LmsTopNav, CMP-LmsBottomNav]
requirements: [REQ-0001, REQ-0003, REQ-0012, REQ-0014]
```

## TRACE requirement

```
TRACE REQ-0012
```

Returns chain to test + evidence slot.

## Planner algorithm

```
1. GET active capability
2. RESOLVE contracts (versions from spec/contracts/versions.yaml)
3. RESOLVE requirements (SATISFIES edges)
4. RESOLVE dependencies (DEPENDS_ON edges)
5. RUN risk + confidence
6. EMIT plan with REQ-* checklist
```

Builder marks each REQ as satisfied with file:line evidence.

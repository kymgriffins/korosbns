# Backlog Item Template (immutable intent)

```yaml
id: LJP-XXX
capability: capability-slug  # must match spec/capabilities.yaml
title:
priority: P0 | P1 | P2
approval_required: true | false
blueprint: A | B | C | D | E | infrastructure
estimated_complexity: 1-10
node: GraphNodeName

depends_on_capabilities: []

contracts:
  screen: lesson | null
  components:
    - component_id@1.0.0

emotion:
acceptance: []
files_expected: []
```

**No runtime state in this file.** State lives in `runtime/state.yaml`.

## Description

[What and why — immutable intent]

## Done when

[Capability gates from capabilities.yaml — all sub-capabilities pass with evidence]

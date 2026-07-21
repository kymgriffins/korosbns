# Runtime Definition of Done
## Additional gates for LJP-002+ (Learning Runtime)

Extends `docs/ljp-spec/definition-of-done.md` for runtime capabilities.

---

## Runtime gates (all required)

### Deterministic

- [ ] Same event sequence produces identical `getState()` output
- [ ] Test: `reduceEvents(events) === reduceEvents(events)` property or fixture

### Replayable

- [ ] `runtime.replay(events)` rebuilds session, progress, timeline
- [ ] Test: dispatch series → export events → new runtime → replay → state match

### Observable

- [ ] `getEvents()` returns full append log
- [ ] `getTimeline()` returns labeled entries 1:1 with events

### Recoverable

- [ ] `hydrate()` restores events from sessionStorage after refresh simulation
- [ ] Test: persist → clear memory → hydrate → state match

---

## Traceability

- [ ] Every event type mapped to REQ-* in `agent/graph/requirements.yaml`
- [ ] Runtime contracts versioned in `spec/runtime-contracts/`
- [ ] Observability record in `runtime/observability/LJP-002.yaml`

---

## No UI

- [ ] Zero render output in `src/lib/learning-runtime/` except Provider wrapper

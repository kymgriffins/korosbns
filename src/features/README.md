# Feature modules

Domain UI lives here — **not** in `app/**/page.tsx`.

```
features/
├── tasks/       # Phase 2A — task board, detail, form views
├── learn/       # Phase 2B — hub, module reader
└── auth/        # Phase 2C — login, register shells
```

See [docs/zero-gap/LAYER-CONVENTIONS.md](../docs/zero-gap/LAYER-CONVENTIONS.md).

Migration: move logic out of `app/` and `_components/` incrementally per TASKPLAN; do not big-bang refactor.

"""Generate slim civic-modules.json fallback from Django seed."""
from __future__ import annotations

import json
from pathlib import Path

SEED = Path(__file__).resolve().parents[2] / "bnske.budgetndiostory.org" / "seeds" / "civic_modules.json"
DEST = Path(__file__).resolve().parents[1] / "src" / "data" / "fallbacks" / "civic-modules.json"


def main() -> None:
    data = json.loads(SEED.read_text(encoding="utf-8"))
    mods = data.get("civic_modules", [])
    out = []
    for m in mods[:10]:
        steps = []
        for i, ch in enumerate(m.get("chapters") or [], 1):
            body = ch.get("body_html") or ch.get("summary") or ch.get("description") or ""
            yt_urls = [u for u in (ch.get("youtube_urls") or []) if u]
            yt_primary = (ch.get("youtube_url") or "").strip() or (yt_urls[0] if yt_urls else "")
            if yt_primary and yt_primary not in yt_urls:
                yt_urls = [yt_primary, *yt_urls]
            step = {
                "id": ch.get("slug") or f"{m['slug']}-ch{i}",
                "title": ch.get("title") or f"Chapter {i}",
                "order": i,
                "youtube_url": yt_primary,
                "audio_url": "",
                "transcript": "",
                "text": body[:500],
            }
            if yt_urls:
                step["youtube_urls"] = yt_urls
            steps.append(step)
        if not steps:
            steps = [
                {
                    "id": f"{m['slug']}-intro",
                    "title": "Introduction",
                    "order": 1,
                    "youtube_url": "",
                    "audio_url": "",
                    "transcript": "",
                    "text": m.get("description")
                    or "Offline catalogue entry. Connect to load the full module.",
                }
            ]
        out.append(
            {
                "id": m.get("slug"),
                "title": m["title"],
                "slug": m["slug"],
                "badge": m.get("badge") or str(m.get("order", 1)),
                "badgeName": m["title"],
                "documentName": m["title"],
                "archive": "",
                "link": "",
                "status": "Published",
                "credits": "Budget Ndio Story",
                "description": m.get("description") or "",
                "expectations": [],
                "image_url": m.get("image_url") or "",
                "order": m.get("order") or 1,
                "steps": steps[:3],
                "author": None,
                "trivia": [],
            }
        )
        print(m.get("order"), m["slug"], "chapters", len(m.get("chapters") or []))

    payload = {
        "provenance": {
            "source": "seeds/civic_modules.json",
            "note": "Read-only offline catalogue when civic-modules API is unreachable.",
            "level": "fallback",
        },
        "count": len(out),
        "results": out,
    }
    DEST.parent.mkdir(parents=True, exist_ok=True)
    DEST.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    print("wrote", DEST, "bytes", DEST.stat().st_size)


if __name__ == "__main__":
    main()

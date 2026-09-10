import { describe, it, expect } from "vitest";
import {
  mergeYoutubeProjectMeta,
  parseYoutubeRssEntries,
  youtubeChannelRssUrl,
  youtubeOembedUrl,
} from "@/lib/youtube-meta";

describe("youtube-meta", () => {
  it("builds oEmbed and channel RSS URLs", () => {
    expect(
      youtubeOembedUrl("https://www.youtube.com/watch?v=G5ddu4I6mNs"),
    ).toContain("oembed");
    expect(youtubeChannelRssUrl("UCvxVwuKoG8XEN53OohMu9qA")).toContain(
      "feeds/videos.xml",
    );
  });

  it("parses Atom RSS entries for video id, title, and thumbnail", () => {
    const xml = `
      <feed>
        <entry>
          <yt:videoId>G5ddu4I6mNs</yt:videoId>
          <title>Ignore</title>
          <media:title>IFF briefing</media:title>
          <published>2026-08-08T12:00:00Z</published>
          <media:thumbnail url="https://i.ytimg.com/vi/G5ddu4I6mNs/hqdefault.jpg" />
        </entry>
      </feed>
    `;
    const entries = parseYoutubeRssEntries(xml);
    expect(entries).toHaveLength(1);
    expect(entries[0]?.videoId).toBe("G5ddu4I6mNs");
    expect(entries[0]?.title).toBe("IFF briefing");
    expect(entries[0]?.thumbnail).toContain("G5ddu4I6mNs");
  });

  it("merge prefers RSS title then oEmbed, always hqdefault thumb", () => {
    const merged = mergeYoutubeProjectMeta({
      urlOrId: "it8rOKSYKnc",
      fallbackTitle: "Seed title",
      oembed: { title: "oEmbed title", author_name: "Lyla Latif" },
      rss: {
        videoId: "it8rOKSYKnc",
        title: "RSS title",
        publishedAt: "2026-07-25T00:00:00Z",
        thumbnail: "https://i.ytimg.com/vi/it8rOKSYKnc/maxresdefault.jpg",
        url: "https://www.youtube.com/watch?v=it8rOKSYKnc",
      },
    });
    expect(merged?.title).toBe("RSS title");
    expect(merged?.thumbnail).toBe(
      "https://i.ytimg.com/vi/it8rOKSYKnc/hqdefault.jpg",
    );
    expect(merged?.authorName).toBe("Lyla Latif");
  });
});

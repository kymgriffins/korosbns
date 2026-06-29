export type YouTubeVideo = {
  videoId: string;
  title: string;
  url: string;
  publishedAt: string;
  description: string;
  channelId: string;
  transcript?: TranscriptEntry[];
};

export type TranscriptEntry = {
  text: string;
  start: number;
  duration: number;
};

const DEFAULT_VIDEOS: YouTubeVideo[] = [
  {
    videoId: "FkgRz4v2Llk",
    title: "PART 3: Before Budget Day: This Is Where It Starts",
    url: "https://www.youtube.com/watch?v=FkgRz4v2Llk",
    publishedAt: "2026-04-07T11:03:33Z",
    description:
      "In this part, we break down what the Budget Policy Statement (BPS) is and why young people should care about it.",
    channelId: "UCvxVwuKoG8XEN53OohMu9qA",
  },
  {
    videoId: "wkPe3sWomoA",
    title: "PART 2-Before the Budget: This Is Where It Starts",
    url: "https://www.youtube.com/watch?v=wkPe3sWomoA",
    publishedAt: "2026-04-04T10:28:55Z",
    description:
      "In Part 2, we go deeper into the Budget Policy Statement (BPS) and why it matters before Budget Day.",
    channelId: "UCvxVwuKoG8XEN53OohMu9qA",
  },
  {
    videoId: "Ed9lP0-komE",
    title: "Before Budget Day: This Is Where It Starts",
    url: "https://www.youtube.com/watch?v=Ed9lP0-komE",
    publishedAt: "2026-04-02T10:09:24Z",
    description:
      "In this part, we break down what the Budget Policy Statement (BPS) is and why young people should care about it.",
    channelId: "UCvxVwuKoG8XEN53OohMu9qA",
  },
  {
    videoId: "SfPwtqUFyj4",
    title: "PART 4: Inside Kenya\u2019s National Infrastructure Fund",
    url: "https://www.youtube.com/watch?v=SfPwtqUFyj4",
    publishedAt: "2026-03-17T18:07:33Z",
    description:
      "Kenya\u2019s National Infrastructure Fund is now law. But do young people really understand what it means?",
    channelId: "UCvxVwuKoG8XEN53OohMu9qA",
  },
  {
    videoId: "KeNCrx6krl0",
    title: "PART3 :Inside Kenya\u2019s National Infrastructure Fund",
    url: "https://www.youtube.com/watch?v=KeNCrx6krl0",
    publishedAt: "2026-03-17T18:00:11Z",
    description:
      "Kenya\u2019s National Infrastructure Fund is now law. But do young people really understand what it means?",
    channelId: "UCvxVwuKoG8XEN53OohMu9qA",
  },
  {
    videoId: "jLZe3iPSMfc",
    title: "PART 2: Inside Kenya\u2019s National Infrastructure Fund",
    url: "https://www.youtube.com/watch?v=jLZe3iPSMfc",
    publishedAt: "2026-03-17T17:54:40Z",
    description:
      "Kenya\u2019s National Infrastructure Fund is now law. But do young people really understand what it means?",
    channelId: "UCvxVwuKoG8XEN53OohMu9qA",
  },
  {
    videoId: "A_EXLueEMlk",
    title: "Inside Kenya\u2019s National Infrastructure Fund",
    url: "https://www.youtube.com/watch?v=A_EXLueEMlk",
    publishedAt: "2026-03-16T08:25:38Z",
    description:
      "Kenya\u2019s National Infrastructure Fund is now law. But do young people really understand what it means?",
    channelId: "UCvxVwuKoG8XEN53OohMu9qA",
  },
];

let _videos: YouTubeVideo[] | null = null;

function sortByDate(videos: YouTubeVideo[]): YouTubeVideo[] {
  return [...videos].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getVideos(): YouTubeVideo[] {
  if (_videos) return _videos;
  _videos = sortByDate(DEFAULT_VIDEOS);
  return _videos;
}

export function getVideoById(videoId: string): YouTubeVideo | undefined {
  return getVideos().find((v) => v.videoId === videoId);
}

export function setVideos(videos: YouTubeVideo[]): void {
  _videos = sortByDate(videos);
}

export function addVideo(video: YouTubeVideo): void {
  const existing = getVideos();
  const idx = existing.findIndex((v) => v.videoId === video.videoId);
  if (idx >= 0) {
    existing[idx] = video;
  } else {
    existing.push(video);
  }
  _videos = sortByDate(existing);
}

export function removeVideo(videoId: string): void {
  _videos = getVideos().filter((v) => v.videoId !== videoId);
}

export function embedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}

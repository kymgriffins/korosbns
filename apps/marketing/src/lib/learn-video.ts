export function resolveYoutubeId(input: string): string | undefined {
  if (!input) return undefined;
  if (input.includes("embed/")) {
    const m = input.match(/embed\/([^/?]+)/);
    return m ? m[1] : input;
  }
  const m = input.match(/(?:youtu\.be\/|v=)([^&?]+)/);
  return m ? m[1] : input;
}

export function videoEmbedUrl(idOrUrl: string): string {
  const id = resolveYoutubeId(idOrUrl);
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` : idOrUrl;
}

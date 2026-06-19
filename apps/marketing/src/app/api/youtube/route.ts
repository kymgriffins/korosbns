import { NextResponse } from "next/server";

export async function GET() {
  try {
    const channelId = "UCvxVwuKoG8XEN53OohMu9qA";
    const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch YouTube RSS: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // Simple regex parsing to avoid adding heavy XML parsing libraries
    const entries = xmlText.match(/<entry>[\s\S]*?<\/entry>/g) || [];
    
    const videos = entries.map((entry) => {
      const videoIdMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>(.*?)<\/title>/);
      const publishedMatch = entry.match(/<published>(.*?)<\/published>/);
      const thumbnailMatch = entry.match(/<media:thumbnail url="(.*?)"/);
      
      return {
        id: videoIdMatch ? videoIdMatch[1] : "",
        title: titleMatch ? titleMatch[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'") : "",
        published: publishedMatch ? publishedMatch[1] : "",
        thumbnail: thumbnailMatch ? thumbnailMatch[1] : "",
      };
    }).filter(video => video.id);

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("YouTube RSS error:", error);
    return NextResponse.json({ videos: [], error: "Failed to fetch videos" }, { status: 500 });
  }
}

"use client";

import { useState } from 'react';
import Wrapper from '@/components/global/wrapper';
import Container from '@/components/global/container';
import { videos } from '@/constants/learn';
import { Play, Clock, Tag } from 'lucide-react';
import { motion } from 'motion/react';

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);

  return (
    <section className="relative w-full min-h-screen bg-background overflow-hidden flex flex-col pt-20">
      <Wrapper className="relative z-10 w-full flex-1 flex flex-col py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-8">
          {/* Header */}
          <Container animation="fadeUp">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                <Play className="size-3.5" />
                <span>Video Library</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold font-heading tracking-tight">
                Learn with Videos
              </h1>
              <p className="text-base sm:text-lg text-foreground/60 max-w-2xl mx-auto">
                Visual explainers, tutorials, and overviews of Kenya's budget in under 15 minutes.
              </p>
            </div>
          </Container>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <motion.div
                key={selectedVideo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?rel=0&modestbranding=1`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedVideo.title}
                />
              </motion.div>

              <div className="mt-4 space-y-2">
                <h2 className="text-xl font-bold font-serif">{selectedVideo.title}</h2>
                <p className="text-foreground/60 text-sm">{selectedVideo.description}</p>
                <div className="flex items-center gap-4 text-xs text-foreground/40 pt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {selectedVideo.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="size-3" />
                    {selectedVideo.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Video List */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-4">
                All Videos ({videos.length})
              </h3>
              {videos.map((video) => (
                <motion.button
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedVideo.id === video.id
                      ? 'border-primary bg-primary/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="relative shrink-0 w-20 aspect-video rounded-lg overflow-hidden bg-black">
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="size-5 text-white" />
                      </div>
                      {video.duration && (
                        <span className="absolute bottom-1 right-1 text-[10px] bg-black/70 px-1 rounded text-white">
                          {video.duration}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-2">{video.title}</h4>
                      <p className="text-xs text-foreground/50 mt-1 line-clamp-2">{video.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

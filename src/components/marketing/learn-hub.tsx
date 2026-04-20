"use client";

import { useState } from 'react';
import Learn from '@/components/marketing/learn';
import ArticlesPage from '@/components/marketing/articles-page';
import VideosPage from '@/components/marketing/videos-page';
import { motion } from 'motion/react';
import { Scroll, FileText, Play } from 'lucide-react';

const tabs = [
  { id: 'stories', label: 'Stories & Quiz', icon: Scroll, description: 'Interactive lessons' },
  { id: 'articles', label: 'Articles', icon: FileText, description: 'In-depth reading' },
  { id: 'videos', label: 'Videos', icon: Play, description: 'Visual learning' },
] as const;

type TabId = typeof tabs[number]['id'];

export default function LearnHub() {
  const [activeTab, setActiveTab] = useState<TabId>('stories');

  return (
    <section className="relative w-full min-h-screen bg-background overflow-hidden flex flex-col">
      {/* Tab Navigation */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-1 py-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/60 hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="learn-tab-indicator"
                      className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <Icon className="size-4 relative z-10" />
                  <span className="text-sm font-medium relative z-10 hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 relative">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          {activeTab === 'stories' && <Learn />}
          {activeTab === 'articles' && <ArticlesPage />}
          {activeTab === 'videos' && <VideosPage />}
        </motion.div>
      </div>
    </section>
  );
}

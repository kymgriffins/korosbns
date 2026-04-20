"use client";

import { useState } from 'react';
import type { JSX } from 'react';
import Wrapper from '@/components/global/wrapper';
import Container from '@/components/global/container';
import { articles, type Article } from '@/constants/learn';
import { Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.JSX.Element[] = [];
  let key = 0;
  let inList = false;
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-2 my-4 text-foreground/80">
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, idx) => {
    if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={key++} className="text-3xl font-bold font-heading mt-8 mb-4">{line.slice(2)}</h1>);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={key++} className="text-2xl font-bold font-heading mt-6 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={key++} className="text-xl font-bold font-heading mt-4 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('- ')) {
      inList = true;
      listItems.push(line.slice(2));
    } else if (line.trim() === '') {
      flushList();
      elements.push(<br key={key++} />);
    } else {
      flushList();
      elements.push(<p key={key++} className="my-2 text-foreground/80 leading-relaxed">{line}</p>);
    }
  });
  flushList();

  return <div className="space-y-1">{elements}</div>;
}

export default function ArticlesPage() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (selectedArticle) {
    return (
      <section className="relative w-full min-h-screen bg-background overflow-hidden flex flex-col pt-20">
        <Wrapper className="relative z-10 w-full flex-1 flex flex-col py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
            {/* Back button */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <button
                onClick={() => setSelectedArticle(null)}
                className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors"
              >
                <ArrowLeft className="size-4" />
                Back to Articles
              </button>
            </motion.div>

            {/* Article Header */}
            <motion.div
              key={selectedArticle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 mb-8"
            >
              <div className="flex items-center gap-2 text-xs text-foreground/50">
                <Tag className="size-3" />
                <span className="capitalize">{selectedArticle.category}</span>
                <span>•</span>
                <Calendar className="size-3" />
                <span>{new Date(selectedArticle.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span>•</span>
                <Clock className="size-3" />
                <span>{selectedArticle.readTime}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold font-heading tracking-tight">
                {selectedArticle.title}
              </h1>

              <p className="text-lg text-foreground/60">{selectedArticle.excerpt}</p>

              <div className="flex items-center gap-2 text-sm text-foreground/50">
                <User className="size-4" />
                <span>{selectedArticle.author}</span>
              </div>
            </motion.div>

            {/* Article Content */}
            <motion.div
              key={`content-${selectedArticle.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="prose prose-invert max-w-none"
            >
              <MarkdownContent content={selectedArticle.content} />
            </motion.div>

            {/* Footer */}
            <Container animation="fadeUp" delay={0.2} className="max-w-3xl mx-auto w-full pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-foreground/30 px-4 sm:px-6">
              <p className="text-[10px] font-medium">© 2026 Budget Ndio Story.</p>
              <div className="flex items-center gap-4 text-[9px] font-medium uppercase tracking-wider">
                <Link href="/learn" className="hover:text-foreground transition-colors">Back to Learn</Link>
                <a href="mailto:hello@budgetndiostory.com" className="hover:text-foreground transition-colors">Email</a>
              </div>
            </Container>
          </div>
        </Wrapper>
      </section>
    );
  }

  // Article List View
  return (
    <section className="relative w-full min-h-screen bg-background overflow-hidden flex flex-col pt-20">
      <Wrapper className="relative z-10 w-full flex-1 flex flex-col py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full">
          {/* Header */}
          <Container animation="fadeUp">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                <Tag className="size-3.5" />
                <span>Articles</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold font-heading tracking-tight">
                In-Depth Articles
              </h1>
              <p className="text-base sm:text-lg text-foreground/60 max-w-2xl mx-auto">
                Deep dives into budget topics, analysis, and explainers to build your fiscal literacy.
              </p>
            </div>
          </Container>

          {/* Article Grid */}
          <Container animation="fadeUp" delay={0.1} className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((article, idx) => (
                <motion.button
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedArticle(article)}
                  className="text-left p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary/20 text-primary capitalize">
                      {article.category}
                    </span>
                    <span className="text-xs text-foreground/40">{article.readTime}</span>
                  </div>

                  <h3 className="text-xl font-bold font-serif mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-sm text-foreground/60 line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-foreground/40">
                    <User className="size-3" />
                    <span>{article.author}</span>
                    <span>•</span>
                    <Calendar className="size-3" />
                    <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </Container>

          {/* Footer */}
          <Container animation="fadeUp" delay={0.2} className="max-w-3xl mx-auto w-full pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-foreground/30 px-4 sm:px-6">
            <p className="text-[10px] font-medium">© 2026 Budget Ndio Story.</p>
            <div className="flex items-center gap-4 text-[9px] font-medium uppercase tracking-wider">
              <Link href="/learn" className="hover:text-foreground transition-colors">Back to Learn</Link>
              <a href="mailto:hello@budgetndiostory.com" className="hover:text-foreground transition-colors">Email</a>
            </div>
          </Container>
        </div>
      </Wrapper>
    </section>
  );
}

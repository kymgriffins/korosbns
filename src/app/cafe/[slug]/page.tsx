"use client";

import React, { useEffect, useState, useRef, use } from "react";
import { Coffee, Send, ChevronLeft, Info, Users, ShieldAlert } from "lucide-react";
import { CafeChatBubble } from "@/components/cafe/CafeChatBubble";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Card, CardContent } from "@/ui/card";
import Link from "next/link";
import { Badge } from "@/ui/badge";

export default function CafeRoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [guestName, setGuestName] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch room details
    fetch(`/api/cafe/rooms/${slug}/`)
      .then((res) => res.json())
      .then((data) => {
        setRoom(data);
        setLoading(false);
      });

    // Initial message fetch
    fetchMessages();

    // Polling for new messages
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [slug]);

  const fetchMessages = () => {
    fetch(`/api/cafe/rooms/${slug}/messages/`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        // Auto-scroll logic if needed
      });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`/api/cafe/rooms/${slug}/post_message/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          author_name: guestName || "Anonymous User",
        }),
      });

      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) return null;

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/40 bg-card/30 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/cafe">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-sm font-bold leading-none">{room?.title}</h1>
            <p className="mt-1 text-[10px] text-muted-foreground uppercase tracking-widest">{room?.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:flex gap-1.5 border-amber-500/30 text-amber-500">
            <Users className="h-3 w-3" />
            <span>Active</span>
          </Badge>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Discussion Area */}
        <main className="flex flex-1 flex-col overflow-hidden bg-muted/5">
          {/* Room Topic / Sticky */}
          {room?.current_topic && (
            <div className="bg-amber-500/5 px-4 py-2 ring-1 ring-amber-500/10 border-b border-amber-500/10">
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter">Current Discussion Table Topic</p>
              <p className="text-sm font-medium text-foreground/80">{room?.current_topic}</p>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth"
          >
            <AnimatePresence initial={false}>
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center opacity-40">
                  <Coffee className="mb-4 h-12 w-12 text-amber-500" />
                  <p className="text-sm">The table is ready. Be the first to pull up a chair!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <CafeChatBubble
                    key={msg.id}
                    author={msg.author}
                    content={msg.content}
                    timestamp={msg.created_at}
                    isMe={msg.author_name === guestName && guestName !== ""}
                    isAdmin={false} // Would check if user has admin flag
                  />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Join Overlay / Input Area */}
          {!isJoined ? (
            <div className="border-t border-border/40 bg-card p-6 shadow-2xl">
              <div className="mx-auto max-w-md text-center">
                <h3 className="mb-2 font-bold uppercase tracking-tight">Pull up a chair</h3>
                <p className="mb-4 text-xs text-muted-foreground">Introduce yourself to the table before joining the budget talk.</p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="What should we call you?" 
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="bg-muted/50"
                  />
                  <Button 
                    className="bg-amber-600 hover:bg-amber-700"
                    onClick={() => setIsJoined(true)}
                    disabled={!guestName.trim()}
                  >
                    Join Table
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-t border-border/40 bg-card p-4">
              <form onSubmit={handleSendMessage} className="mx-auto flex max-w-4xl gap-2">
                <Input
                  placeholder={`Say something to the table, ${guestName}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="bg-muted/30 border-border/50 focus-visible:ring-amber-500"
                />
                <Button type="submit" size="icon" className="bg-amber-600 hover:bg-amber-700 shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="mt-2 text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                <ShieldAlert className="h-3 w-3" />
                Please keep discussions respectful and budget-focused.
              </p>
            </div>
          )}
        </main>

        {/* Sidebar Info (Desktop Only) */}
        <aside className="hidden w-64 flex-col border-l border-border/40 bg-card/20 p-4 lg:flex">
          <div className="mb-6">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">About this Table</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {room?.description || "A space for community members to gather and share insights on fiscal transparency and local budget implementation."}
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Table Guidelines</h3>
            <ul className="space-y-3">
              {['Stay on topic', 'No hate speech', 'Fact-check data', 'Youth-led energy'].map((rule, i) => (
                <li key={rule} className="flex items-center gap-2 text-[11px] text-foreground/80">
                  <div className="h-1 w-1 rounded-full bg-amber-500" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto">
            <Card className="bg-amber-500/10 border-amber-500/20">
              <CardContent className="p-3">
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter mb-1">Knowledge Link</p>
                <p className="text-[11px] text-muted-foreground mb-2">Discussing the 2026 Health Sector report? Check it out here.</p>
                <Button variant="link" className="h-auto p-0 text-[10px] text-amber-500">View Resource →</Button>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}

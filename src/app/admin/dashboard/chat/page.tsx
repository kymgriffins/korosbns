"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Send, Bot, User, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { communicationData } from "@/data/communication";
import type { ChatMessage } from "@/types/communication";

const BOT_AUTO_REPLIES = [
  "Thank you for your message. A member of our team will get back to you shortly.",
  "Great question! Our budget transparency platform helps citizens track county allocations. Would you like to know more about a specific county?",
  "I've noted your inquiry. You can also check our learning hub for more information on budget processes.",
  "Thanks for reaching out! For urgent matters, please contact our support team directly at support@budgetndiostory.org.",
  "Your feedback is valuable to us. I've recorded your message and our team will review it promptly.",
];

function getBotReply(): string {
  return BOT_AUTO_REPLIES[Math.floor(Math.random() * BOT_AUTO_REPLIES.length)];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: "Hello! Welcome to Budget Ndio Story support. How can I help you today?",
      sender: "bot",
      sender_name: "BNS Assistant",
      created_at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userReady, setUserReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [showIdentityForm, setShowIdentityForm] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  function handleStartChat() {
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter your name and email");
      return;
    }
    setShowIdentityForm(false);
    setUserReady(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `user-join-${Date.now()}`,
        content: `${name} joined the chat`,
        sender: "admin",
        sender_name: "System",
        created_at: new Date().toISOString(),
      },
    ]);
  }

  async function handleSend() {
    if (!input.trim() || !userReady) return;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: input.trim(),
      sender: "user",
      sender_name: name,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      await communicationData.chat.send(userMsg.content, name, email);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        content: getBotReply(),
        sender: "bot",
        sender_name: "BNS Assistant",
        created_at: new Date().toISOString(),
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, botMsg]);
      }, 800);
    } catch {
      toast.error("Failed to send message. Using offline mode.");
      const fallbackBot: ChatMessage = {
        id: `bot-${Date.now()}`,
        content: "Thank you for your message. I'm responding in offline mode. Your inquiry has been recorded.",
        sender: "bot",
        sender_name: "BNS Assistant",
        created_at: new Date().toISOString(),
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, fallbackBot]);
      }, 500);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Live Chat</h1>
        <p className="text-sm text-muted-foreground">Real-time communication with citizens via the contact API</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
        {/* Chat area */}
        <div className="lg:col-span-3 flex flex-col rounded-lg border bg-background min-h-0">
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b px-4 py-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
              <Bot className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">BNS Assistant</p>
              <p className="text-[11px] text-muted-foreground">Online</p>
            </div>
            <Badge variant="secondary" className="ml-auto text-[10px]">
              {messages.length} messages
            </Badge>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : msg.sender === "admin"
                        ? "bg-muted text-muted-foreground rounded-br-sm text-xs italic"
                        : "bg-muted/80 text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.sender !== "user" && msg.sender !== "admin" && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <Bot className="size-3 text-primary" />
                      <span className="text-[10px] font-medium text-primary">{msg.sender_name}</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-primary-foreground/60" : "text-muted-foreground/60"}`}>
                    {format(new Date(msg.created_at), "HH:mm")}
                  </p>
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-xl rounded-bl-sm bg-muted/80 px-4 py-2.5">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t p-4">
            {showIdentityForm ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="chat-name" className="text-xs">Your Name</Label>
                    <Input
                      id="chat-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="chat-email" className="text-xs">Email Address</Label>
                    <Input
                      id="chat-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <Button size="sm" onClick={handleStartChat} className="gap-1.5">
                  <MessageSquare className="size-3.5" />
                  Start Chat
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="h-9 min-h-0 resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button
                  size="icon"
                  className="size-9 shrink-0"
                  onClick={handleSend}
                  disabled={sending || !input.trim()}
                >
                  {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Chat Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600">Connected</Badge>
              </div>
              {userReady && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">User</span>
                    <span className="font-medium">{name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium truncate max-w-[120px]">{email}</span>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">API</span>
                <Badge variant="outline" className="text-[10px]">Contact API</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs justify-start"
                onClick={() => {
                  if (!userReady) { toast.error("Start a chat first"); return; }
                  const quickMsg = "I'd like to know about the budget tracking process";
                  setInput(quickMsg);
                }}
              >
                Ask about budget tracking
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs justify-start"
                onClick={() => {
                  if (!userReady) { toast.error("Start a chat first"); return; }
                  const quickMsg = "How can I participate in county budget hearings?";
                  setInput(quickMsg);
                }}
              >
                Budget hearings info
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs justify-start"
                onClick={() => {
                  if (!userReady) { toast.error("Start a chat first"); return; }
                  const quickMsg = "I need help with the platform";
                  setInput(quickMsg);
                }}
              >
                Platform help
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Integration</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <p className="leading-relaxed">
                Messages are sent through the <code className="text-[10px] bg-muted px-1 rounded">POST /api/v1/contact/</code> endpoint.
                The chatbot provides immediate auto-responses while your message is queued for staff review.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Mail, 
  Share2, 
  Plus, 
  Send, 
  Calendar, 
  CheckCircle2, 
  Clock,
  BarChart3,
  Search,
  Filter,
  MoreVertical
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { SchedulePostForm } from "./SchedulePostForm";
import { UpcomingPosts } from "./UpcomingPosts";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api-config";

export function AutomationModule() {
  const [activeTab, setActiveTab] = useState("subscribers");
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [socialAccounts, setSocialAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subsRes, campRes, postsRes, accountsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/models/Subscriber/`),
        fetch(`${API_BASE_URL}/api/hub/emails/`),
        fetch(`${API_BASE_URL}/api/hub/posts/list/`),
        fetch(`${API_BASE_URL}/api/hub/accounts/`)
      ]);

      if (subsRes.ok) setSubscribers((await subsRes.json()).items || []);
      if (campRes.ok) setCampaigns(await campRes.json());
      if (postsRes.ok) setSocialPosts(await postsRes.json());
      if (accountsRes.ok) setSocialAccounts(await accountsRes.json());
    } catch (err) {
      console.error("Failed to fetch automation data", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Automation Hub</h2>
          <p className="text-muted-foreground">
            Manage your audience, email campaigns, and social media presence in one place.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Audience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5 border-blue-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Emails Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground mt-1">98.2% deliverability</p>
          </CardContent>
        </Card>
        <Card className="bg-teal-500/5 border-teal-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Social Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.5k</div>
            <p className="text-xs text-muted-foreground mt-1">Avg. 4.2% engagement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscribers" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="subscribers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Subscribers
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Emails
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Socials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Audience Management</CardTitle>
                <CardDescription>View and segment your subscribers.</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search subscribers..." className="pl-8 w-[250px]" />
                </div>
                <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.length > 0 ? (
                    subscribers.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.email}</TableCell>
                        <TableCell>
                          <Badge variant={sub.status === "active" ? "default" : "secondary"}>
                            {sub.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">{sub.source}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {new Date(sub.subscribed_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No subscribers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
                <CardDescription>Track performance of your email blasts.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((camp) => (
                    <div key={camp.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{camp.subject}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {camp.status === 'sent' ? 'Sent on ' : 'Scheduled for '}
                            {new Date(camp.sent_at || camp.scheduled_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={camp.status === 'sent' ? "outline" : "secondary"}>
                        {camp.status}
                      </Badge>
                    </div>
                  ))}
                  {campaigns.length === 0 && (
                    <div className="py-8 text-center text-muted-foreground text-sm">
                      No active campaigns.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Create Email Campaign</CardTitle>
                <CardDescription>Compose and automate your message.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Subject Line</Label>
                  <Input placeholder="Enter email subject..." />
                </div>
                <div className="space-y-2">
                  <Label>Recipient Segment</Label>
                  <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option>All Active Subscribers</option>
                    <option>New Users (Last 7 days)</option>
                    <option>Inactive Users (30+ days)</option>
                  </select>
                </div>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Design & Compose
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4 pt-4">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>New Social Post</CardTitle>
                  <CardDescription>Schedule across X, Facebook, and LinkedIn.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SchedulePostForm socialAccounts={socialAccounts} />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
               <UpcomingPosts posts={socialPosts} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">{children}</label>;
}

import { Suspense } from 'react';
import { SchedulePostForm } from '@/components/admin/SchedulePostForm';
import { API_BASE_URL } from '@/lib/api-config';
import { cookies } from 'next/headers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

async function getSocialAccounts() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  
  if (!token) return [];
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/models/SocialAccount/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || [];
  } catch (err) {
    return [];
  }
}

async function getUpcomingPosts() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  
  if (!token) return [];
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/hub/posts/list/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (err) {
    return [];
  }
}

import { DashboardStats } from '@/components/admin/DashboardStats';
import { UpcomingPosts } from '@/components/admin/UpcomingPosts';

async function getDashboardStats(posts: any[]) {
  // Simple calculation for demonstration
  return {
    total_posts: posts.length,
    scheduled_posts: posts.filter(p => p.status === 'scheduled').length,
    published_posts: posts.filter(p => p.status === 'published').length,
    total_engagement: 4.2, // Placeholder
  };
}

export default async function PublisherPage() {
  const socialAccounts = await getSocialAccounts();
  const upcomingPosts = await getUpcomingPosts();
  const stats = await getDashboardStats(upcomingPosts);
  
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Publisher Center</h1>
        <p className="text-muted-foreground mt-2">
          Schedule and manage your social media content across all platforms.
        </p>
      </div>

      <DashboardStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Schedule New Post</CardTitle>
              <CardDescription>
                Create a post and pick a time to publish.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SchedulePostForm socialAccounts={socialAccounts} />
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column: Upcoming Posts */}
        <div className="lg:col-span-2">
          <UpcomingPosts posts={upcomingPosts} />
        </div>
      </div>
    </div>
  );
}

'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/lib/api-config';

export async function schedulePost(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  
  if (!token) {
    return { error: 'Unauthorized' };
  }
  
  const postData = {
    caption: formData.get('caption'),
    social_account_id: formData.get('social_account_id'),
    scheduled_at: formData.get('scheduled_at'),
    media_urls: JSON.parse(formData.get('media_urls') as string || '[]'),
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/hub/posts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Failed to schedule post' };
    }
    
    revalidatePath('/admin/dashboard');
    return { success: true, post: await response.json() };
  } catch (err) {
    return { error: 'Connection failed' };
  }
}

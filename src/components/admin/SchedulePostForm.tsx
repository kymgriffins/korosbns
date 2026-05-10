'use client';

import { useForm } from 'react-hook-form';
import { useTransition, useState } from 'react';
import { schedulePost } from '@/app/actions/schedulePost';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ScheduleFormData {
  caption: string;
  social_account_id: string;
  scheduled_at: string;
  media_urls: string;
}

export function SchedulePostForm({ socialAccounts }: { socialAccounts: any[] }) {
  const { register, handleSubmit, reset } = useForm<ScheduleFormData>();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const onSubmit = (data: ScheduleFormData) => {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      const result = await schedulePost(formData);
      if (result.success) {
        reset();
        toast.success('Post scheduled successfully!');
      } else {
        setError(result.error || 'Failed to schedule post');
        toast.error(result.error || 'Failed to schedule post');
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-2">Post Content</label>
        <Textarea
          {...register('caption', { required: true })}
          className="w-full"
          rows={5}
          placeholder="What would you like to share?"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Social Account</label>
          <select
            {...register('social_account_id', { required: true })}
            className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select account</option>
            {socialAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.platform} - {account.account_name || account.platform_user_id}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Schedule Time</label>
          <Input
            type="datetime-local"
            {...register('scheduled_at', { required: true })}
            className="w-full"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Media URLs (JSON array, optional)</label>
        <Input
          {...register('media_urls')}
          className="w-full"
          placeholder='["https://example.com/image.jpg"]'
        />
      </div>
      
      <Button
        type="submit"
        disabled={isPending}
        className="w-full"
      >
        {isPending ? 'Scheduling...' : 'Schedule Post'}
      </Button>
    </form>
  );
}

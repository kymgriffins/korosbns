export type WeeklyNoteApi = {
  id: string;
  week_label: string;
  title: string;
  content?: string;
  status: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  due_date?: string | null;
  assignee?: string | null;
  assignee_name?: string | null;
  assigned_team?: string | null;
  team_name?: string | null;
  hue?: string;
  due_label?: string;
  section_count?: number;
  progress?: number;
  priority?: string;
  tag?: string;
  scheduled_time?: string | null;
  kanban_column?: string;
  owner_name?: string;
  owner_tone?: string;
};

export type WeeklyNoteDetailApi = WeeklyNoteApi & {
  content: string;
  notes?: string;
  sections: NoteSectionApi[];
  audit_trails: NoteAuditTrailApi[];
  checklist_items?: ChecklistItemApi[];
  attachments?: TaskAttachmentApi[];
  author_team?: string | null;
  team?: string | null;
  assignee_email?: string | null;
  assignee_avatar?: string | null;
  progress?: number;
};

export type NoteSectionApi = {
  id: string;
  note: string;
  heading: string;
  section_type: string;
  content: Record<string, unknown>;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type NoteAuditTrailApi = {
  id: string;
  note: string;
  auditor: string;
  auditor_email: string;
  auditor_name: string;
  action: string;
  comment: string;
  created_at: string;
};

export type ChecklistItemApi = {
  id: string;
  title?: string;
  text: string;
  description_json?: Record<string, unknown>;
  description_text?: string;
  status?: "todo" | "in_progress" | "blocked" | "done";
  is_completed: boolean;
  assignee?: string | null;
  assignee_email?: string | null;
  assignee_name?: string | null;
  due_date?: string | null;
  priority?: string;
  progress?: number;
  sort_order: number;
  attachment_count?: number;
  attachments?: ChecklistItemAttachmentApi[];
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type ChecklistItemAttachmentApi = {
  id: string;
  url?: string;
  file_name: string;
  file_size: number;
  content_type: string;
  is_image: boolean;
  uploaded_by_name?: string;
  created_at: string;
};

export type ChecklistItemEventApi = {
  id: string;
  event_type: string;
  actor_name?: string | null;
  old_value: Record<string, unknown>;
  new_value: Record<string, unknown>;
  comment: string;
  created_at: string;
};

export type TaskAttachmentApi = {
  id: string;
  file?: string;
  url?: string;
  file_name: string;
  file_size: number;
  content_type: string;
  is_image: boolean;
  uploaded_by?: string;
  uploaded_by_name?: string;
  created_at: string;
};

export type WeeklyNoteCreateApi = {
  week_label: string;
  title: string;
  content: string;
  notes?: string;
  status?: string;
  due_date?: string | null;
  assignee?: string | null;
  assigned_team?: string | null;
  progress?: number;
  priority?: string;
  tag?: string;
  scheduled_time?: string | null;
  kanban_column?: string;
};

export type AnalyticsSummaryApi = {
  total_visitors: number;
  total_page_views: number;
  daily_visitors: { date: string; count: number }[];
  top_pages: { path: string; views: number }[];
  device_breakdown: { device_type: string; percentage: number }[];
  uptime_percentage: number;
  uptime_data: { date: string; status: "up" | "down" }[];
  modules_completed: number;
  citizens_reached: number;
  surveys_responded: number;
  quiz_attempts: number;
  total_users?: number;
  active_users_30d?: number;
  quizzes_passed?: number;
  total_pageviews?: number;
  unique_visitors?: number;
  monthly_trends?: { month: string; tasks_created: number; new_users: number }[];
  recent_signups?: number;
  engagement_rate?: number;
  total_tasks?: number;
  published_tasks?: number;
};

export type StudioServiceApi = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image_url?: string;
  features: string[];
};

export type StudioPortfolioItemApi = {
  id: string;
  title: string;
  category: string;
  media_type: "image" | "video";
  image_url: string;
  video_url?: string;
  video_platform?: "youtube" | "vimeo" | "cloudinary" | "other";
  thumbnail_url?: string;
  description?: string;
};

export type StudioTestimonialApi = {
  id: string;
  client_name: string;
  role?: string;
  content: string;
  rating: number;
  avatar_url?: string;
};

export type StudioBookingApi = {
  name: string;
  email: string;
  phone: string;
  service_type: string;
  message: string;
};

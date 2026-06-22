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
};

export type WeeklyNoteDetailApi = WeeklyNoteApi & {
  content: string;
  sections: NoteSectionApi[];
  audit_trails: NoteAuditTrailApi[];
  author_team?: string | null;
  team?: string | null;
  assignee_email?: string | null;
  assignee_avatar?: string | null;
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

export type WeeklyNoteCreateApi = {
  week_label: string;
  title: string;
  content: string;
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

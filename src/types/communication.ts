export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "NEW" | "READ" | "REPLIED";
  source?: string;
  created_at: string;
  replied_at?: string;
  reply?: string;
};

export type EmailHook = {
  id: string;
  recipient: string;
  subject: string;
  status: "pending" | "claimed" | "sent" | "failed";
  source?: string;
  error_message?: string;
  created_at: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  name?: string;
  consent_at: string;
  unsubscribed_at?: string;
  source?: string;
  created_at: string;
};

export type ChatMessage = {
  id: string;
  content: string;
  sender: "user" | "bot" | "admin";
  sender_name: string;
  created_at: string;
};

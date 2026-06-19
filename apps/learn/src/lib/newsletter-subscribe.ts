import { ApiRequestError } from "@/lib/api-errors";
import { citizenApi } from "@/lib/api-client";

export type NewsletterSubscribeResult = {
  alreadySubscribed: boolean;
  detail: string;
};

export function newsletterSubscribeErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    switch (error.status) {
      case 400:
        return error.message.includes("valid") || error.message.includes("email")
          ? error.message
          : "Please enter a valid email address.";
      case 403:
        return "Newsletter signup is currently unavailable.";
      case 404:
        return "Newsletter signup is not available right now. Please try again later.";
      case 429:
        return "Too many attempts. Please wait a minute and try again.";
      case 500:
      case 502:
      case 503:
        return "We could not complete your signup right now. Please try again in a few minutes.";
      default:
        if (error.message && !error.message.startsWith("Request failed")) {
          return error.message;
        }
    }
  }

  if (error instanceof Error) {
    if (
      error.message.includes("Unable to reach") ||
      error.message.includes("Network error")
    ) {
      return "Connection problem. Check your internet and try again.";
    }
    if (error.message && !error.message.startsWith("Request failed")) {
      return error.message;
    }
  }

  return "Something went wrong. Please try again.";
}

export function parseNewsletterSubscribeResponse(data: {
  detail?: string;
}): NewsletterSubscribeResult {
  const detail = (data.detail ?? "").trim();
  const alreadySubscribed = detail.toLowerCase().includes("already subscribed");
  return { alreadySubscribed, detail };
}

export async function subscribeNewsletter(body: {
  email: string;
  name?: string;
  source?: string;
}): Promise<NewsletterSubscribeResult> {
  const data = await citizenApi.subscribeNewsletter(body);
  return parseNewsletterSubscribeResponse(data);
}

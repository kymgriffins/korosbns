import { describe, expect, it } from "vitest";

import { ApiRequestError } from "@/lib/api-errors";
import {
  newsletterSubscribeErrorMessage,
  parseNewsletterSubscribeResponse,
} from "@/lib/newsletter-subscribe";

describe("parseNewsletterSubscribeResponse", () => {
  it("detects already subscribed from detail", () => {
    const result = parseNewsletterSubscribeResponse({
      detail: "Already subscribed.",
    });
    expect(result.alreadySubscribed).toBe(true);
  });

  it("treats new subscription as not already subscribed", () => {
    const result = parseNewsletterSubscribeResponse({
      detail: "Subscribed successfully.",
    });
    expect(result.alreadySubscribed).toBe(false);
  });
});

describe("newsletterSubscribeErrorMessage", () => {
  it("maps 403 to unavailable copy", () => {
    expect(
      newsletterSubscribeErrorMessage(
        new ApiRequestError("Newsletter signup is disabled.", 403),
      ),
    ).toBe("Newsletter signup is currently unavailable.");
  });

  it("maps 429 to rate limit copy", () => {
    expect(
      newsletterSubscribeErrorMessage(new ApiRequestError("Too many requests", 429)),
    ).toBe("Too many attempts. Please wait a minute and try again.");
  });

  it("maps 500 to friendly retry copy", () => {
    expect(
      newsletterSubscribeErrorMessage(new ApiRequestError("Request failed (500).", 500)),
    ).toBe("We could not complete your signup right now. Please try again in a few minutes.");
  });
});

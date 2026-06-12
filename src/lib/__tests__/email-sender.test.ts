import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreateTransport = vi.fn();
const mockSendMail = vi.fn();

vi.mock("nodemailer", () => ({
  default: {
    createTransport: (...args: unknown[]) => {
      mockCreateTransport(...args);
      return { sendMail: mockSendMail };
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("SMTP_HOST", "smtp.gmail.com");
  vi.stubEnv("SMTP_PORT", "587");
  vi.stubEnv("SMTP_SECURE", "false");
  vi.stubEnv("SMTP_USER", "user@test.com");
  vi.stubEnv("SMTP_PASS", "app-password");
  vi.stubEnv("SMTP_FROM", "");
});

describe("sendEmail", () => {
  it("sends email with correct payload", async () => {
    mockSendMail.mockResolvedValueOnce({ accepted: ["to@test.com"] });

    const { sendEmail } = await import("@/lib/services/email-sender");

    await sendEmail({
      to: "to@test.com",
      subject: "Test Subject",
      html: "<h1>Hello</h1>",
      text: "Hello",
    });

    expect(mockCreateTransport).toHaveBeenCalledWith({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: "user@test.com", pass: "app-password" },
    });

    expect(mockSendMail).toHaveBeenCalledWith({
      from: 'Budget Ndio Story <noreply@budgetndiostory.org>',
      to: "to@test.com",
      subject: "Test Subject",
      html: "<h1>Hello</h1>",
      text: "Hello",
    });
  });

  it("sends email with text-only payload", async () => {
    mockSendMail.mockResolvedValueOnce({ accepted: ["to@test.com"] });

    const { sendEmail } = await import("@/lib/services/email-sender");

    await sendEmail({
      to: "to@test.com",
      subject: "Text Only",
      text: "Plain text body",
    });

    expect(mockSendMail).toHaveBeenCalledWith({
      from: 'Budget Ndio Story <noreply@budgetndiostory.org>',
      to: "to@test.com",
      subject: "Text Only",
      html: undefined,
      text: "Plain text body",
    });
  });

  it("uses custom from address when provided", async () => {
    mockSendMail.mockResolvedValueOnce({ accepted: ["to@test.com"] });

    const { sendEmail } = await import("@/lib/services/email-sender");

    await sendEmail({
      to: "to@test.com",
      subject: "Custom From",
      text: "Body",
      from: "Custom Sender <custom@test.com>",
    });

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Custom Sender <custom@test.com>",
      }),
    );
  });

  it("uses SMTP_FROM env var when set", async () => {
    vi.stubEnv("SMTP_FROM", "Override <override@test.com>");
    mockSendMail.mockResolvedValueOnce({ accepted: ["to@test.com"] });

    const { sendEmail } = await import("@/lib/services/email-sender");

    await sendEmail({
      to: "to@test.com",
      subject: "Override From",
      text: "Body",
    });

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Override <override@test.com>",
      }),
    );
  });

  it("throws when SMTP is not configured", async () => {
    vi.stubEnv("SMTP_HOST", "");
    vi.stubEnv("SMTP_USER", "");
    vi.stubEnv("SMTP_PASS", "");

    const { sendEmail } = await import("@/lib/services/email-sender");

    await expect(
      sendEmail({
        to: "to@test.com",
        subject: "No Config",
        text: "Body",
      }),
    ).rejects.toThrow("SMTP not configured");
  });

  it("throws when SMTP send fails", async () => {
    mockSendMail.mockRejectedValueOnce(new Error("Connection refused"));

    const { sendEmail } = await import("@/lib/services/email-sender");

    await expect(
      sendEmail({
        to: "to@test.com",
        subject: "Fail",
        text: "Body",
      }),
    ).rejects.toThrow("Connection refused");
  });

  it("uses secure connection when SMTP_SECURE is true", async () => {
    vi.stubEnv("SMTP_SECURE", "true");
    vi.stubEnv("SMTP_PORT", "465");
    mockSendMail.mockResolvedValueOnce({ accepted: ["to@test.com"] });

    const { sendEmail } = await import("@/lib/services/email-sender");

    await sendEmail({
      to: "to@test.com",
      subject: "Secure",
      text: "Body",
    });

    expect(mockCreateTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        port: 465,
        secure: true,
      }),
    );
  });
});

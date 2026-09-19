"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { communicationData } from "@/data/communication";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const SUBJECTS = [
  { value: "tip-off", label: "Investigation tip-off" },
  { value: "partnership", label: "Programme partnership" },
  { value: "application", label: "Programme application" },
  { value: "commission", label: "Studio commission" },
  { value: "media", label: "Media request" },
  { value: "general", label: "General question" },
];

type ContactFormProps = {
  initialSubject?: string;
  initialMessage?: string;
};

export function ContactForm({
  initialSubject = "general",
  initialMessage = "",
}: ContactFormProps) {
  const [subject, setSubject] = useState(initialSubject);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setPending(true);
    setError("");
    setSent(false);

    const form = new FormData(formElement);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();
    const subjectLabel =
      SUBJECTS.find((item) => item.value === subject)?.label || "General question";

    if (!name || !email || !message) {
      setError("Name, email, and message are required.");
      setPending(false);
      return;
    }

    try {
      await communicationData.publicContact.submit({
        name,
        email,
        message: `Subject: ${subjectLabel}\n\n${message}`,
        source: "marketing-contact",
      });
      formElement.reset();
      setSubject("general");
      setSent(true);
    } catch {
      setError("We could not send your message. Please try again or use the email address beside the form.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="contact-name">Name</FieldLabel>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-email">Email</FieldLabel>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-subject">Subject</FieldLabel>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger id="contact-subject">
              <SelectValue placeholder="Choose a subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SUBJECTS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <input type="hidden" name="subject" value={subject} />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-message">Message</FieldLabel>
          <Textarea
            id="contact-message"
            name="message"
            defaultValue={initialMessage}
            placeholder="How can we help?"
            rows={7}
            required
          />
          <FieldDescription>
            Do not include information that could identify a confidential source.
          </FieldDescription>
        </Field>
      </FieldGroup>

      {error && <FieldError>{error}</FieldError>}
      {sent && (
        <p role="status" className="text-sm font-medium text-foreground">
          Your message was sent. The team will respond by email.
        </p>
      )}

      <Button type="submit" className="w-fit" disabled={pending}>
        {pending && <LoaderCircle data-icon="inline-start" className="animate-spin" />}
        {pending ? "Sending" : "Send message"}
      </Button>
    </form>
  );
}

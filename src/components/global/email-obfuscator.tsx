"use client";

import React, { useEffect, useState } from "react";
import { Mail } from "lucide-react";

interface EmailObfuscatorProps {
  user?: string;
  domain?: string;
  email?: string;
  className?: string;
  showIcon?: boolean;
  label?: string;
}

export function EmailObfuscator({
  user = "info",
  domain = "budgetndiostory.org",
  email,
  className = "",
  showIcon = false,
  label,
}: EmailObfuscatorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parse user and domain if full email provided
  let targetUser = user;
  let targetDomain = domain;
  if (email && email.includes("@")) {
    const parts = email.split("@");
    targetUser = parts[0];
    targetDomain = parts[1];
  }

  const fullEmail = `${targetUser}@${targetDomain}`;

  if (!mounted) {
    // Static SSR HTML for scrapers: Obfuscated HTML entities and no plain text email
    const encodedLabel = label || `${targetUser} [at] ${targetDomain}`;
    return (
      <span className={className}>
        {showIcon && <Mail className="inline-block w-4 h-4 mr-1.5 opacity-70" />}
        {encodedLabel}
      </span>
    );
  }

  return (
    <a
      href={`mailto:${fullEmail}`}
      className={className}
      title="Send email"
    >
      {showIcon && <Mail className="inline-block w-4 h-4 mr-1.5 opacity-70" />}
      {label || fullEmail}
    </a>
  );
}

export default EmailObfuscator;

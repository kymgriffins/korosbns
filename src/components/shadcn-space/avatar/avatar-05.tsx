"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Avatar05Props {
  src?: string;
  fallback?: string;
  badge?: string | number;
  className?: string;
  size?: "default" | "sm" | "lg";
}

export default function Avatar05({ src, fallback = "U", badge, className, size }: Avatar05Props) {
  return (
    <div className={className}>
      <div className="relative w-fit">
        <Avatar size={size}>
          {src ? (
            <AvatarImage alt="user" src={src} />
          ) : null}
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
        {badge !== undefined && (
          <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full border-2 border-background bg-red-500 text-[9px] font-medium text-white">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

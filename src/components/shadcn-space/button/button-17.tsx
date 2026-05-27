"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/index";

interface Button17Props {
  label?: string;
  className?: string;
  [key: string]: any;
}

export default function Button17({ label = "Get Started", className, ...props }: Button17Props) {
  return (
    <Button
      className={cn(
        "relative overflow-hidden group rounded-full font-medium text-base cursor-pointer border border-primary transition-all",
        className
      )}
      {...props}
    >
      <span className="absolute left-1/2 -translate-x-1/2 top-full -translate-y-1/2 w-8 h-8 bg-white dark:bg-gray-950 rounded-full scale-0 transition-transform duration-700 ease-in-out group-hover:scale-[18]" />
      <span className="relative z-10 transition-colors duration-500 group-hover:text-gray-950 dark:group-hover:text-white">
        {label}
      </span>
    </Button>
  );
}

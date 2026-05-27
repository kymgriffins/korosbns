"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/index";

interface Button16Props {
  label?: string;
  className?: string;
  [key: string]: any;
}

export default function Button16({ label = "Get Started", className, ...props }: Button16Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <Button
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      variant="outline"
      className={cn(
        "relative overflow-hidden group rounded-full cursor-pointer border border-border transition-all duration-300",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "absolute w-10 h-10 rounded-full scale-0 transition-transform duration-700 ease-in-out group-hover:scale-[15] pointer-events-none",
          "bg-primary"
        )}
        style={{ left: pos.x - 20, top: pos.y - 20 }}
      />
      <span className="relative z-10 transition-colors duration-500 pointer-events-none group-hover:text-primary-foreground">
        {label}
      </span>
    </Button>
  );
}

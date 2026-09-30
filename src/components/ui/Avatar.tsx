import React, { useState } from "react";
import { cn, getSpeakerGradient } from "@/lib/utils";

export interface AvatarProps {
  src?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizeStyles = {
    xs: "h-5 w-5 text-[9px]",
    sm: "h-7 w-7 text-xs",
    md: "h-8 w-8 text-xs",
    lg: "h-10 w-10 text-sm",
    xl: "h-14 w-14 text-base",
  };

  const getInitials = (str: string) => {
    const parts = str.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const gradient = getSpeakerGradient(name);

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center font-medium overflow-hidden shrink-0 select-none shadow-sm ring-1 ring-white/10",
        sizeStyles[size],
        className
      )}
    >
      {src && !imageError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className={cn(
            "h-full w-full flex items-center justify-center bg-gradient-to-tr text-white font-semibold",
            gradient
          )}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20 border border-indigo-400/20",
      secondary:
        "bg-slate-800 hover:bg-slate-700/80 text-slate-100 border border-slate-700/60 shadow-sm",
      outline:
        "border border-slate-700 hover:border-slate-600 bg-transparent hover:bg-slate-800/40 text-slate-200",
      ghost:
        "bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white",
      danger:
        "bg-rose-600/90 hover:bg-rose-600 text-white shadow-md shadow-rose-600/20 border border-rose-500/30",
      glass:
        "bg-white/5 hover:bg-white/10 text-white backdrop-blur-md border border-white/10 shadow-sm",
    };

    const sizeStyles = {
      sm: "text-xs px-2.5 py-1.5 rounded-lg gap-1.5",
      md: "text-sm px-3.5 py-2 rounded-xl gap-2",
      lg: "text-base px-5 py-2.5 rounded-xl gap-2.5",
      icon: "h-9 w-9 rounded-xl p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin -ml-0.5 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

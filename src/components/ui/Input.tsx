import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", icon, rightElement, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full bg-slate-900/80 text-slate-100 placeholder-slate-500 border border-slate-800 rounded-xl py-2 text-sm transition-all duration-200",
            "focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
            "hover:border-slate-700",
            icon ? "pl-9" : "pl-3.5",
            rightElement ? "pr-10" : "pr-3.5",
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

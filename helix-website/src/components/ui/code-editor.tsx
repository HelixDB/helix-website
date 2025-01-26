import * as React from "react";
import { cn } from "@/lib/utils";

export interface CodeEditorProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  isEditable?: boolean;
}

const CodeEditor = React.forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  ({ className, label, isEditable = true, ...props }, ref) => {
    return (
      <div className="relative" style={{ height: "300px" }}>
        {label && (
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-muted-foreground">
              {label}
            </label>
          </div>
        )}
        <textarea
          className={cn(
            "absolute inset-0 w-full rounded-none bg-card px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:bg-card/50 disabled:cursor-not-allowed disabled:opacity-50 font-mono",
            className
          )}
          ref={ref}
          readOnly={!isEditable}
          {...props}
        />
      </div>
    );
  }
);
CodeEditor.displayName = "CodeEditor";

export { CodeEditor };
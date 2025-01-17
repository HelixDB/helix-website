import * as React from "react"
import { cn } from "@/lib/utils"

export interface CodeEditorProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
}

const CodeEditor = React.forwardRef<HTMLTextAreaElement, CodeEditorProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <div className="relative">
                {label && (
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            {label}
                        </label>
                    </div>
                )}
                <textarea
                    className={cn(
                        "flex min-h-[200px] w-full rounded-none border border-input bg-card px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)
CodeEditor.displayName = "CodeEditor"

export { CodeEditor }
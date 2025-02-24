import { useTheme } from "next-themes";

interface CodeBlockProps {
    code: string;
}

export function CodeBlock({ code }: CodeBlockProps) {
    const { theme, systemTheme } = useTheme();
    const currentTheme = theme === "system" ? systemTheme : theme;
    const bgColor = currentTheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";

    return (
        <div
            className="rounded-lg overflow-hidden shadow-lg"
            style={{
                background: bgColor,
            }}
        >
            <div className="px-3 py-2 text-sm font-medium bg-muted/50">
                example.hx
            </div>
            <pre className="p-4 text-sm font-mono overflow-auto">
                <code>{code}</code>
            </pre>
        </div>
    );
} 
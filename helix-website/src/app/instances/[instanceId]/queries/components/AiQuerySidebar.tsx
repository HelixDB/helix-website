import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface AiQuerySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerateQuery: (query: string) => void;
    currentQuery?: string;
}

export function AiQuerySidebar({ isOpen, onClose, onGenerateQuery, currentQuery }: AiQuerySidebarProps) {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!message.trim()) return;

        setError(null);
        // Add user message to chat
        setChatHistory(prev => [...prev, { role: 'user', content: message }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: message,
                    currentQuery: currentQuery?.trim() || null,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate query');
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Only update the query if one was provided
            if (data.query) {
                onGenerateQuery(data.query);
            }

            // Add the explanation to the chat
            setChatHistory(prev => [...prev, {
                role: 'assistant',
                content: data.explanation || 'I processed your request but no explanation was provided.'
            }]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate query');
            setChatHistory(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error while processing your request.'
            }]);
        } finally {
            setIsLoading(false);
            setMessage("");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="w-96 overflow-hidden flex flex-col h-full bg-muted/50 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">AI Query Assistant</h3>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 h-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 mb-4">
                {chatHistory.map((msg, i) => (
                    <div
                        key={i}
                        className={`p-3 rounded-lg break-words ${msg.role === 'user'
                            ? 'bg-primary text-primary-foreground ml-8'
                            : 'bg-muted mr-8'
                            }`}
                    >
                        <pre className="whitespace-pre-wrap font-mono text-sm break-words max-w-[300px]">
                            {msg.content}
                        </pre>
                    </div>
                ))}
                {isLoading && (
                    <div className="bg-muted p-3 rounded-lg mr-8">
                        <div className="animate-pulse">Generating query...</div>
                    </div>
                )}
                {error && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-lg mr-8">
                        {error}
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe the query you want to generate... Or ask a question "
                    className="resize-none"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                />
                <Button
                    className="h-full"
                    onClick={handleSubmit}
                    disabled={isLoading || !message.trim()}
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
} 
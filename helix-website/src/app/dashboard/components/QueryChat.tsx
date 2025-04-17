import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    query?: string;
    explanation?: string;
    timestamp?: number;
}

interface QueryChatProps {
    onQueryUpdate: (query: string) => void;
    currentQuery: string;
    queryId: string;
    instanceId: string;
}

export function QueryChat({ onQueryUpdate, currentQuery, queryId, instanceId }: QueryChatProps) {
    const storageKey = `queryChat_${instanceId}_${queryId}`;
    const lastModifiedKey = `${storageKey}_lastModified`;
    const isOpenKey = `queryChat_${instanceId}_isOpen`;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize states from localStorage
    const [isOpen, setIsOpen] = useState(() => {
        const saved = localStorage.getItem(isOpenKey);
        return saved ? JSON.parse(saved) : true;
    });
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Save isOpen state
    useEffect(() => {
        localStorage.setItem(isOpenKey, JSON.stringify(isOpen));
    }, [isOpen, isOpenKey]);

    // Load messages from localStorage on mount and when queryId/instanceId changes
    useEffect(() => {
        console.log('Loading messages for:', storageKey);
        const savedMessages = localStorage.getItem(storageKey);
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                console.log('Found saved messages:', parsed);
                setMessages(parsed);
            } catch (e) {
                console.error('Failed to parse saved messages:', e);
            }
        } else {
            console.log('No saved messages found for:', storageKey);
            setMessages([]);
        }
    }, [queryId, instanceId, storageKey]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (queryId !== 'new' && messages.length > 0) {
            console.log('Saving messages for:', storageKey, messages);
            localStorage.setItem(storageKey, JSON.stringify(messages));
            localStorage.setItem(lastModifiedKey, Date.now().toString());
        }
    }, [messages, queryId, storageKey, lastModifiedKey]);

    // Clean up old chat histories (keep only last 20 queries)
    useEffect(() => {
        const cleanupOldChats = () => {
            const allKeys = Object.keys(localStorage);
            const chatKeys = allKeys.filter(key => key.startsWith('queryChat_') && !key.endsWith('_lastModified'));

            if (chatKeys.length > 20) {
                // Sort by last modified time
                const keysByAge = chatKeys.map(key => ({
                    key,
                    lastModified: localStorage.getItem(`${key}_lastModified`) || '0'
                }));

                keysByAge.sort((a, b) => Number(b.lastModified) - Number(a.lastModified));

                // Remove oldest histories
                keysByAge.slice(20).forEach(({ key }) => {
                    localStorage.removeItem(key);
                    localStorage.removeItem(`${key}_lastModified`);
                });
            }
        };

        cleanupOldChats();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: Date.now() // Add timestamp to messages
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: input,
                    currentQuery
                }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.explanation,
                query: data.query,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, assistantMessage]);

            // Only update the query if it exists and is different from the current query
            if (data.query && data.query !== currentQuery) {
                onQueryUpdate(data.query);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: Date.now() // Add timestamp to messages
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn(
            "border-l dark:border-foreground/10  transition-all duration-300 flex",
            isOpen ? "w-96" : "w-12"
        )}>
            {isOpen ? (
                <div className="flex flex-col h-full w-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b dark:border-foreground/10">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            <h3 className="font-semibold">AI Assistant</h3>
                            {messages.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                    ({messages.length} messages)
                                </span>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground">
                                <MessageCircle className="w-12 h-12 mb-2 opacity-20" />
                                <div className="space-y-2">
                                    <h3 className="font-medium">Welcome to AI Assistant!</h3>
                                    <p className="text-sm max-w-[250px]">Ask me anything about your query. For example:</p>
                                    <div className="space-y-2 text-sm">
                                        <p className="p-2 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                                            onClick={() => setInput('Write me a query that does x')}>
                                            "Write me a query that does x"
                                        </p>
                                        <p className="p-2 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                                            onClick={() => setInput('Explain what this query does')}>
                                            "Explain what this query does"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "flex flex-col space-y-2 p-3 rounded-lg",
                                            message.role === 'user'
                                                ? "bg-primary/10 ml-8"
                                                : "bg-muted mr-8"
                                        )}
                                    >
                                        {message.role === 'user' ?
                                            <></> :
                                            <div className="flex justify-between items-center">

                                                <span className="text-sm font-medium">
                                                    AI Assistant
                                                </span>
                                            </div>
                                        }
                                        <p className="text-sm">{message.content}</p>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                        {isLoading && (
                            <div className="flex justify-center">
                                <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t dark:border-foreground/10">
                        <div className="flex gap-2">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about your query..."
                                className="min-h-[60px] max-h-[120px]"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                            />
                            <Button type="submit" disabled={isLoading}>
                                Send
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(true)}
                    className="w-8 h-8 m-2 mt-4 flex items-center justify-center"
                >
                    <MessageCircle className="h-5 w-5" />
                </Button>
            )}
        </div>
    );
} 
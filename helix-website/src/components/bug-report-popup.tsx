import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { X } from "lucide-react";

interface BugReportPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BugReportPopup({ isOpen, onClose }: BugReportPopupProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Here you would typically send this to your backend
            // For now, we'll just simulate a submission
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubmitted(true);

            // Reset form after 2 seconds and close
            setTimeout(() => {
                setTitle("");
                setDescription("");
                setEmail("");
                setSubmitted(false);
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Error submitting bug report:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background border rounded-2xl shadow-lg p-6 max-w-md w-full mx-4 relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>

                <h2 className="text-lg font-semibold mb-4">Report a Bug</h2>

                {submitted ? (
                    <div className="text-center py-8">
                        <p className="text-green-500 font-medium mb-2">Thank you for your report!</p>
                        <p className="text-muted-foreground">We'll look into it as soon as possible.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium mb-1">
                                Title
                            </label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Brief description of the issue"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium mb-1">
                                Description
                            </label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Please provide as much detail as possible..."
                                className="h-32"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                Email (optional)
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="To receive updates about this bug report"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Report"}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
} 
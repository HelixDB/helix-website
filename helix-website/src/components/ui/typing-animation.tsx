"use client";

import React, { useEffect, useState } from "react";

interface TypingAnimationProps {
    texts: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    delayBetween?: number;
}

export function TypingAnimation({
    texts,
    typingSpeed = 50,
    deletingSpeed = 30,
    delayBetween = 2000,
}: TypingAnimationProps) {
    const [displayText, setDisplayText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (isPaused) {
            timeout = setTimeout(() => {
                setIsPaused(false);
                setIsTyping(false);
            }, delayBetween);
            return () => clearTimeout(timeout);
        }

        const currentText = texts[currentIndex];

        if (isTyping) {
            if (displayText.length < currentText.length) {
                timeout = setTimeout(() => {
                    setDisplayText(currentText.slice(0, displayText.length + 1));
                }, typingSpeed);
            } else {
                setIsPaused(true);
            }
        } else {
            if (displayText.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayText(displayText.slice(0, -1));
                }, deletingSpeed);
            } else {
                setCurrentIndex((current) => (current + 1) % texts.length);
                setIsTyping(true);
            }
        }

        return () => clearTimeout(timeout);
    }, [
        displayText,
        currentIndex,
        isTyping,
        isPaused,
        texts,
        typingSpeed,
        deletingSpeed,
        delayBetween,
    ]);

    return (
        <pre className="font-mono whitespace-pre-wrap">
            {displayText}
            <span className="inline-block w-2 h-4 -mb-1 bg-primary animate-pulse" />
        </pre>
    );
} 
import { motion } from "framer-motion";
import { TypingAnimation } from "./typing-animation";
import { useTheme } from "next-themes";

interface TypingConsoleProps {
    texts: string[];
    className?: string;
}

const dotVariants = {
    hidden: { scale: 0 },
    visible: (delay: number) => ({
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay
        }
    })
};

export function TypingConsole({ texts, className }: TypingConsoleProps) {
    const { theme, systemTheme } = useTheme();
    const currentTheme = theme === "system" ? systemTheme : theme;

    return (
        <div
            className={className}
        >
            <div
                className="rounded-lg overflow-hidden"
                style={{
                    background:
                        currentTheme === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(255,255,255,0.5)",
                }}
            >
                <div
                    className="px-4 py-2 bg-muted/50 flex items-center"
                >
                    <div className="flex space-x-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                custom={0.7 + i * 0.1}
                                variants={dotVariants}
                                initial="hidden"
                                animate="visible"
                                className={`w-3 h-3 rounded-full ${i === 0 ? "bg-red-500" : i === 1 ? "bg-yellow-500" : "bg-green-500"
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="ml-4 text-sm font-medium">example.hx</span>
                </div>
                <div className="p-4 h-[200px] overflow-hidden">
                    <TypingAnimation
                        texts={texts}
                        typingSpeed={30}
                        deletingSpeed={10}
                        delayBetween={3000}
                    />
                </div>
            </div>
        </div>
    );
} 
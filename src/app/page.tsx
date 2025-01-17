"use client";

// ... other imports ...

function ThemeAwareLogo() {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const currentTheme = theme === 'system' ? systemTheme : theme;

    return (
        <div className="relative h-12 w-12">
            <Image
                src={currentTheme === "dark" ? "/dark-helix.png" : "/light-helix.png"}
                alt="HelixDB Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    );
}

export default function Home() {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const currentTheme = theme === 'system' ? systemTheme : theme;

    return (
        <WavyBackground backgroundFill={currentTheme === "dark" ? "#000000" : "#ffffff"}>
            <main className="min-h-screen p-4 sm:p-8 max-w-4xl mx-auto">
                <div className="flex mx-auto items-center justify-between mb-6">
                    <ThemeAwareLogo />
                    <ThemeToggle />
                </div>
                {/* ... rest of your component ... */}
            </main>
        </WavyBackground>
    );
} 
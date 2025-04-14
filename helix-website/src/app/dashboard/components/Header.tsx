import { HeaderActions } from "./HeaderActions";

export function Header() {
    return (
        <header className="flex items-center justify-between border-b dark:border-foreground/10">
            <div className="w-64 h-full px-6 py-2 flex items-center border-r dark:border-foreground/10">
                <span className="hidden text-foreground text-xl font-bold sm:inline-block">
                    Helix <span className="hidden text-foreground text-xl font-medium text-foreground/50 sm:inline-block">Cloud</span>
                </span>
            </div>
            <HeaderActions />
        </header>
    );
} 
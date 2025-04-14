import { Logo } from "@/components/ui/logo";
import { HeaderActions } from "./HeaderActions";
import Link from "next/link";

export function Header() {
    return (
        <header className="flex items-center justify-between border-b dark:border-foreground/10">
            <Link href="/dashboard/instances" className="h-full py-2 flex items-center">
                <span className="hidden text-foreground text-xl font-bold sm:inline-block border-r dark:border-foreground/10 w-12 justify-center px-2">
                    <Logo className="w-7 h-7 mx-auto" />
                </span>
            </Link>
            <HeaderActions />
        </header>
    );
} 
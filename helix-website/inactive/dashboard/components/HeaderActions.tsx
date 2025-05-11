import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { HelpDialog } from "./HelpDialog";
import { UserDropdown } from "./UserDropdown";

export function HeaderActions() {
    return (
        <div className="flex items-center gap-4 py-2 px-4">
            <HelpDialog
                trigger={
                    <Button size="sm" variant="ghost" className="text-xs w-8 h-8 text-foreground p-2 ">
                        <Info />
                    </Button>
                }
            />
            <UserDropdown />
        </div>
    );
} 
import { Bell, Info, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export function HeaderActions() {
    return (
        <div className="flex items-center space-x-4 py-2 px-4">
            <Button variant="outline" size="sm" className="text-xs h-8 text-foreground">
                Feedback
            </Button>
            <Button size="sm" variant="ghost" className="text-xs w-8 h-8 text-foreground p-2">
                <Info />
            </Button>
            <Avatar>
                <User className="w-4 h-4" />
            </Avatar>
        </div>
    );
} 
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function UserDropdown() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const router = useRouter();
    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await getCurrentUser();
                setIsAuthenticated(!!user);
                setUserEmail(user?.signInDetails?.loginId || null);
            } catch (err) {
                setIsAuthenticated(false);
                setUserEmail(null);
            }
        };

        getUser();
    }, []);


    const handleLogout = () => {
        try {
            signOut()
            setIsAuthenticated(false)
            setUserEmail(null)
            router.push("/")
        } catch (err) {
            console.error("Error signing out:", err)
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="focus:ring-0 focus:ring-offset-0">
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar>
                        <User className="w-4 h-4" />
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Account</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {userEmail}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 
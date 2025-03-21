import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { signIn, signUp, confirmSignUp } from "@/amplify-functions"

type AuthMode = "signin" | "signup" | "confirm"

export function AuthModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean
    onClose: () => void
}) {
    const router = useRouter()
    const [authMode, setAuthMode] = useState<AuthMode>("signup")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmCode, setConfirmCode] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            await signIn(email, password)
            onClose()
            router.push("/dashboard")
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Failed to sign in")
            }
        }
        setLoading(false)
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            await signUp(email, password)
            setAuthMode("confirm")
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Failed to sign up")
            }
        }
        setLoading(false)
    }

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            await confirmSignUp(email, confirmCode)
            setAuthMode("signin")
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Failed to confirm sign up")
            }
        }
        setLoading(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {authMode === "signin"
                            ? "Sign In"
                            : authMode === "signup"
                                ? "Create Account"
                                : "Confirm Sign Up"}
                    </DialogTitle>
                </DialogHeader>

                {authMode === "confirm" ? (
                    <form onSubmit={handleConfirm} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="confirmCode">Confirmation Code</Label>
                            <Input
                                id="confirmCode"
                                type="text"
                                value={confirmCode}
                                onChange={(e) => setConfirmCode(e.target.value)}
                                placeholder="Enter the code sent to your email"
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Confirming..." : "Confirm"}
                        </Button>
                    </form>
                ) : (
                    <Tabs defaultValue="signin" value={authMode} onValueChange={(v) => setAuthMode(v as AuthMode)}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="signin">Sign In</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent value="signin">
                            <form onSubmit={handleSignIn} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                                {error && <p className="text-sm text-red-500">{error}</p>}
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Signing in..." : "Sign In"}
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="signup">
                            <form onSubmit={handleSignUp} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                                {error && <p className="text-sm text-red-500">{error}</p>}
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Signing up..." : "Sign Up"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                )}
            </DialogContent>
        </Dialog>
    )
} 
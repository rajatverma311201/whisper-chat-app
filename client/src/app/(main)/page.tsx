"use client";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/use-logout";

export default function Home() {
    const logout = useLogout();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Button onClick={logout}> Logout</Button>
            <Button>Hello</Button>
        </main>
    );
}

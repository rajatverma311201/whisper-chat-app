"use client";

import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="">
            <body className={inter.className}>
                <QueryClientProvider client={queryClient}>
                    <Toaster richColors={true} position="top-center" />
                    {children}
                </QueryClientProvider>
            </body>
        </html>
    );
}

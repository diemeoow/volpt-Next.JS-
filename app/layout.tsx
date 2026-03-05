import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    title: "ВПТ: Образование",
    description: "Цифровое управление образованием",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
            <body className="font-sans antialiased min-h-screen relative">
                <main className="relative z-10 min-h-screen pb-24">
                    {children}
                </main>
                <Navbar />
            </body>
        </html>
    );
}

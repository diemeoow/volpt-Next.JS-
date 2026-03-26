import React from "react";
import type { Metadata } from "next";
import "./globals.css";
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
                {/*<Background />*/}
                <main className="relative z-10 min-h-screen">{children}</main>
                <Navbar />
            </body>
        </html>
    );
}

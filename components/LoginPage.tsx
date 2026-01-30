"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import LiquidButton from "@/components/LiquidButton";
import { Lock, User } from "lucide-react";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setLoading(false);
            router.push("/schedule");
        }, 1000);
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                    Добро пожаловать!
                </h2>
                <p className="text-white/50">Введите свои данные</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-wider ml-2">
                        Логин
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-white/50 group-focus-within:text-white transition-colors" />
                        </div>
                        <input
                            type="text"
                            required
                            className="block w-full pl-12 pr-4 py-4 bg-black/10 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-black/20 transition-all backdrop-blur-sm"
                            placeholder="логин229"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-wider ml-2">
                        Пароль
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-white/50 group-focus-within:text-white transition-colors" />
                        </div>
                        <input
                            type="password"
                            required
                            className="block w-full pl-12 pr-4 py-4 bg-black/10 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-black/20 transition-all backdrop-blur-sm"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <LiquidButton type="submit" fullWidth disabled={loading}>
                        {loading ? "Аутентификация..." : "Войти"}
                    </LiquidButton>
                </div>
            </form>

            <div className="mt-6 text-center">
                <Link
                    href="/"
                    className="text-sm text-white/40 hover:text-white transition-colors"
                >
                    Вернуться на начальную страницу
                </Link>
            </div>
        </div>
    );
}

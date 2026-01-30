"use client";
import { useState } from "react";
import GlassCard from "./GlassCard";

export default function LoginCard() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Login: ${login}, Password: ${password}`);
    };

    return (
        <GlassCard className="w-full">
            <h1 className="text-2xl font-bold mb-2">Добро пожаловать!</h1>
            <p className="text-1xl font-regular mb-8">Введите свои данные</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    type="login"
                    placeholder="Логин"
                    className="p-2 rounded border border-white/40 bg-white/20"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    className="p-2 rounded border border-white/40 bg-white/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="bg-white/30 hover:bg-white/40 p-2 rounded mt-2"
                >
                    Войти
                </button>
            </form>
        </GlassCard>
    );
}

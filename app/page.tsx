import GlassCard from "@/components/GlassCard";
import LandingPage from "@/components/LandingPage";
import LoginPage from "@/components/LoginPage";

export default function AuthSplitPage() {
    return (
        // Контейнер на весь экран, разделенный на две колонки
        <main className="min-h-full flex flex-col md:flex-row">
            {/* Левая часть: Landing (занимает 50% на больших экранах) */}
            <section className="w-full md:w-1/2 flex justify-center border-b md:border-b-0 md:border-r border-white/10">
                <LandingPage />
            </section>

            {/* Правая часть: Login (занимает 50% на больших экранах) */}
            <section className="w-screen h-screen md:w-1/2 flex justify-center">
                <GlassCard
                    className="w-full flex justify-center p-8 md:p-12"
                    intensity="high"
                >
                    <LoginPage />
                </GlassCard>
            </section>
        </main>
    );
}

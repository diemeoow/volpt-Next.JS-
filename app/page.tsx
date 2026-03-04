import LandingPage from "@/components/LandingPage";
import LoginPage from "@/components/LoginPage";

export default function AuthSplitPage() {
    return (
        // Контейнер на весь экран, разделенный на две колонки
        <main className="w-screen flex flex-col md:flex-row">
            {/* Левая часть: Landing (занимает 50% на больших экранах) */}
            <section className="md:w-2/3 flex border-b md:border-b-0 md:border-r border-primary/10">
                <LandingPage />
            </section>

            {/* Правая часть: Login (занимает 50% на больших экранах) */}
            <section className="h-screen md:w-1/3 flex justify-center">
                <div className="flex justify-center p-8 md:p-12">
                    <LoginPage />
                </div>
            </section>
        </main>
    );
}

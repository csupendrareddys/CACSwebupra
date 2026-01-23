import { Component as SignUpCard } from "@/components/ui/sign-up-card";
import { BackButton } from "@/components/ui/back-button";

export default function SignUpPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between relative">
            <div className="absolute top-4 left-4 z-50">
                <BackButton href="/" className="text-white hover:bg-white/10" />
            </div>
            <SignUpCard />
        </main>
    );
}

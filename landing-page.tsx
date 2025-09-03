
"use client";

import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Logo } from '@/components/logo';
import SignupForm from '@/components/auth/signup-form';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 border-b">
        <Logo />
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.push('/login')}>Login</Button>
          <Button onClick={() => router.push('/')}>Sign Up</Button>
        </div>
      </header>
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center p-8 bg-muted/40">
            <div className="max-w-md text-left">
                <h1 className="text-5xl font-bold">Take Control of Your <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Finances</span></h1>
                <p className="text-balance text-muted-foreground mt-4">
                PennyPilot is your smart financial assistant. Track expenses, create budgets, and gain insights to achieve your financial goals.
                </p>
            </div>
        </div>
        <div className="flex items-center justify-center p-8">
           <SignupForm />
        </div>
      </main>
    </div>
  );
}

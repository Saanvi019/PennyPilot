
"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase/firebase';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import * as React from 'react';

export default function LoginPage() {
  const router = useRouter();
  const auth = getAuth(app);
  const { toast } = useToast();

  const handleEmailSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        toast({ title: "Missing Fields", description: "Please enter both email and password.", variant: "destructive" });
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/');
    } catch (error: any) {
        console.error("Error signing in:", error);
        toast({
            title: "Sign-in Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
        });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 border-b">
        <Logo />
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.push('/login')}>Login</Button>
          <Button onClick={() => router.push('/')}>Sign Up</Button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center bg-muted/40">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form onSubmit={handleEmailSignIn} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">Sign in</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

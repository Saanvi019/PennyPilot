
"use client";

import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
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
import { useToast } from "@/hooks/use-toast";

export default function SignupForm() {
  const router = useRouter();
  const auth = getAuth(app);
  const { toast } = useToast();
  
  const handleEmailSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('full-name') as string;

    if (!email || !password || !fullName) {
        toast({ title: "Missing Fields", description: "Please fill out all fields.", variant: "destructive" });
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        // The user will be created in the DB by the UserProvider, no need for additional logic here.
        router.push('/');
    } catch (error: any) {
        console.error("Error signing up:", error);
        if (error.code === 'auth/email-already-in-use') {
             toast({
                title: "Sign-up Failed",
                description: "This email is already in use. Please log in instead.",
                variant: "destructive",
            });
        } else {
            toast({
                title: "Sign-up Failed",
                description: error.message || "An unexpected error occurred.",
                variant: "destructive",
            });
        }
    }
  };


  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleEmailSignUp} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full name</Label>
              <Input id="full-name" name="full-name" placeholder="Your Name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
        </form>
      </CardContent>
    </Card>
  );
}

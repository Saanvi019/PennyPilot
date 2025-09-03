
"use client";

import { useRouter } from 'next/navigation';
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/lib/firebase/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/user-context";
import { Skeleton } from './ui/skeleton';
import { LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserNav() {
  const { user, loading } = useUser();
  const router = useRouter();
  const auth = getAuth(app);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) {
    return (
        <div className="flex items-center gap-2 p-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-3 w-[150px]" />
            </div>
        </div>
    )
  }

  if (!user) {
    return (
        <div className="p-2">
            <Button onClick={() => router.push('/login')} className="w-full">
                Sign In
            </Button>
        </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || undefined} alt={user.fullName || ""} />
                <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-left">
                <p className="text-sm font-medium">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
        </div>
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}

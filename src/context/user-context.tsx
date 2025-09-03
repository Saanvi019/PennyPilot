
"use client";

import { createContext, useState, ReactNode, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { app } from "@/lib/firebase/firebase";
import { getUser, updateUser, addUser } from "@/lib/actions";
import { insertUserSchema, selectUserSchema } from "@/lib/schema";
import type { z } from "zod";

type User = z.infer<typeof selectUserSchema>;
type Theme = "light" | "dark" | "system";


type UserContextType = {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    updateUser: (newUserData: Partial<User>) => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
    user: null,
    firebaseUser: null,
    loading: true,
    updateUser: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                setFirebaseUser(fbUser);
                let dbUser = await getUser(fbUser.uid);

                if (!dbUser) {
                    // User is new, create a record in our database
                    const newUser: z.infer<typeof insertUserSchema> = {
                        id: fbUser.uid,
                        email: fbUser.email!,
                        fullName: fbUser.displayName,
                        avatar: fbUser.photoURL,
                        theme: 'light',
                        currency: 'INR',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                    await addUser(newUser);
                    dbUser = await getUser(fbUser.uid);
                }
                
                setUser(dbUser as User);

            } else {
                setFirebaseUser(null);
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        if (user?.theme) {
            const root = window.document.documentElement;
            root.classList.remove("light", "dark");
            let effectiveTheme = user.theme;
            if (user.theme === "system") {
                effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            }
            root.classList.add(effectiveTheme);
        }
    }, [user?.theme]);


    const handleUpdateUser = async (newUserData: Partial<User>) => {
      if (user) {
        const updatedUser = { ...user, ...newUserData };
        setUser(updatedUser);
        await updateUser(user.id, newUserData);
      }
    };


    return (
        <UserContext.Provider value={{ user, firebaseUser, loading, updateUser: handleUpdateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

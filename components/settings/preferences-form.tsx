
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useEffect } from 'react';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { useUser } from "@/context/user-context";

const preferencesFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  currency: z.enum(["USD", "EUR", "GBP", "INR"]),
});

type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

export default function PreferencesForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { user, updateUser } = useUser();

  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    values: {
      theme: user?.theme as any || "light",
      currency: user?.currency as any || "INR",
    },
  });

  useEffect(() => {
    if (user) {
        form.reset({
            theme: user.theme as any,
            currency: user.currency as any,
        })
    }
  }, [user, form]);


  function onSubmit(data: PreferencesFormValues) {
    startTransition(async () => {
      await updateUser(data);
      toast({
        title: "Preferences Saved",
        description: "Your settings have been updated.",
      });
    });
  }

  if (!user) {
    return <Card><CardHeader><CardTitle>Preferences</CardTitle></CardHeader><CardContent>Loading preferences...</CardContent></Card>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Customize the look and feel of your experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    updateUser({ theme: value });
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Currency</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD - United States Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <CardFooter className="border-t px-6 py-4 justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Preferences
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

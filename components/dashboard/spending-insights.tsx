
"use client";

import { useState, useEffect } from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSpendingInsights } from "@/ai/flows/spending-insights";
import type { Transaction } from "@/lib/types";

export default function SpendingInsights({ transactions }: { transactions: Transaction[]}) {
  const [insights, setInsights] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        const transactionHistory = transactions
          .map(
            (t) =>
              `${t.date}: ${t.description} - $${t.amount} (${t.type}, ${t.category})`
          )
          .join("\n");

        const result = await getSpendingInsights({ transactionHistory });
        setInsights(result.insights);
      } catch (error) {
        console.error("Failed to get spending insights:", error);
        setInsights("Could not load insights at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [transactions]);

  return (
    <Card className="bg-accent/20 border-accent/50 h-full">
      <CardHeader className="flex flex-row items-center gap-3">
        <Lightbulb className="h-6 w-6 text-accent" />
        <div>
          <CardTitle>Intelligent Insights</CardTitle>
          <CardDescription>AI-powered spending analysis.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <p className="text-sm text-foreground/90">{insights}</p>
        )}
      </CardContent>
    </Card>
  );
}

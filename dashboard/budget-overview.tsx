
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { budgets } from "@/lib/data";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

export default function BudgetOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
        <CardDescription>Your monthly spending limits.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.limit) * 100;
          return (
            <div key={budget.category}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{budget.category}</span>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                </span>
              </div>
              <Progress value={percentage} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

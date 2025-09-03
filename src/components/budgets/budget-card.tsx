
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Budget } from "@/lib/types";
import { MoreHorizontal, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function formatCurrency(amount: number, currency: string = 'INR') {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export default function BudgetCard({ budget }: { budget: Budget }) {
  const percentage = (budget.spentAmount / budget.amount) * 100;
  const remainingAmount = budget.amount - budget.spentAmount;
  const alertTriggered = budget.alertThreshold && percentage > budget.alertThreshold;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            {budget.name || budget.category}
            {alertTriggered && <AlertCircle className="h-5 w-5 text-destructive" />}
          </CardTitle>
          <CardDescription>{budget.category}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">
                    {formatCurrency(budget.spentAmount)} / {formatCurrency(budget.amount)}
                </span>
                <span className="text-sm text-muted-foreground">
                    {percentage.toFixed(0)}%
                </span>
            </div>
            <Progress value={percentage} />
        </div>
        <div>
            <div className="text-sm font-medium">Remaining</div>
            <div className={`text-lg font-bold ${remainingAmount < 0 ? 'text-destructive' : ''}`}>
                {formatCurrency(remainingAmount)}
            </div>
        </div>
      </CardContent>
      <CardFooter>
         <p className="text-xs text-muted-foreground">
            Ends on: {new Date(budget.endDate).toLocaleDateString()}
         </p>
      </CardFooter>
    </Card>
  );
}

"use client";

import { Progress } from "@/components/ui/progress";
import { categories } from "@/lib/constants";
import { Transaction } from "@/lib/types";

interface SpendingAnalyticsProps {
  transactions: Transaction[];
  totalExpenses: number;
}

export function SpendingAnalytics({
  transactions,
  totalExpenses,
}: SpendingAnalyticsProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Spending by Category</h3>
        {categories.map((cat) => {
          const categoryTotal = transactions
            .filter(
              (t) =>
                t.category.toLowerCase() === cat.toLowerCase() &&
                t.type === "expense",
            )
            .reduce((acc, curr) => acc + curr.amount, 0);
          const percentage = totalExpenses
            ? (categoryTotal / totalExpenses) * 100
            : 0;

          return (
            <div key={cat} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{cat}</span>
                <span>${categoryTotal.toFixed(2)}</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

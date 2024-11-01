"use client";

import { Card } from "@/components/ui/card";
import { Wallet, ArrowUpDown, PieChart } from "lucide-react";

interface OverviewCardsProps {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
}

export function OverviewCards({
  balance,
  totalIncome,
  totalExpenses,
}: OverviewCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6 space-y-2">
        <div className="flex items-center space-x-2">
          <Wallet className="text-green-500" />
          <h3 className="text-sm font-medium">Total Balance</h3>
        </div>
        <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
      </Card>
      <Card className="p-6 space-y-2">
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="text-blue-500" />
          <h3 className="text-sm font-medium">Income</h3>
        </div>
        <p className="text-2xl font-bold text-green-500">
          ${totalIncome.toFixed(2)}
        </p>
      </Card>
      <Card className="p-6 space-y-2">
        <div className="flex items-center space-x-2">
          <PieChart className="text-red-500" />
          <h3 className="text-sm font-medium">Expenses</h3>
        </div>
        <p className="text-2xl font-bold text-red-500">
          ${totalExpenses.toFixed(2)}
        </p>
      </Card>
    </div>
  );
}

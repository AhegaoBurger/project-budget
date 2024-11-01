"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Transaction, IncomeFrequency, IncomeSource } from "@/lib/types";
import { TransactionForm } from "@/components/budget/transaction-form";
import { OverviewCards } from "@/components/budget/overview-cards";
import { TransactionList } from "@/components/budget/transaction-list";
import { SpendingAnalytics } from "@/components/budget/spending-analytics";
import { IncomeSection } from "@/components/budget/income-section";

export default function Home() {
  // const { toast } = useToast();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [frequency, setFrequency] = useState<IncomeFrequency>("monthly");
  const [view, setView] = useState<"weekly" | "monthly">("monthly");

  const addIncomeSource = (income: IncomeSource) => {
    setIncomeSources([...incomeSources, income]);
    toast.success("Income source added successfully");
  };

  const deleteIncomeSource = (id: string) => {
    setIncomeSources(incomeSources.filter((income) => income.id !== id));
    toast.success("Income source removed successfully");
  };

  const addTransaction = () => {
    if (!amount || !category) {
      toast.error("Please fill in all fields");
      return;
    }

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
      type,
      ...(type === "income" && { frequency }),
    };

    setTransactions([...transactions, newTransaction]);
    setAmount("");
    setCategory("");
    toast.success("Transaction added successfully");
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast.success("Transaction removed successfully");
  };

  const calculateTotalIncome = () => {
    const incomeFromSources = incomeSources.reduce((acc, income) => {
      if (view === "monthly") {
        return (
          acc +
          (income.frequency === "weekly"
            ? (income.amount * 52) / 12
            : income.amount)
        );
      } else {
        return (
          acc +
          (income.frequency === "monthly"
            ? (income.amount * 12) / 52
            : income.amount)
        );
      }
    }, 0);

    const incomeFromTransactions = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, curr) => {
        if (curr.frequency === "weekly" && view === "monthly") {
          return acc + (curr.amount * 52) / 12;
        } else if (curr.frequency === "monthly" && view === "weekly") {
          return acc + (curr.amount * 12) / 52;
        }
        return acc + curr.amount;
      }, 0);

    return incomeFromSources + incomeFromTransactions;
  };

  const calculateTotalExpenses = () => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const totalIncome = calculateTotalIncome();
  const totalExpenses = calculateTotalExpenses();
  const balance = totalIncome - totalExpenses;

  const getFilteredTransactions = () => {
    const now = new Date();
    const startOfPeriod = new Date();

    if (view === "weekly") {
      startOfPeriod.setDate(now.getDate() - 7);
    } else {
      startOfPeriod.setMonth(now.getMonth() - 1);
    }

    return transactions.filter(
      (t) => new Date(t.date) >= startOfPeriod && new Date(t.date) <= now,
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Budget Tracker</h1>
          <p className="text-muted-foreground">
            Manage your personal finances with ease
          </p>
        </div>

        <OverviewCards
          balance={balance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
        />

        <IncomeSection
          incomeSources={incomeSources}
          onAddIncome={addIncomeSource}
          onDeleteIncome={deleteIncomeSource}
        />

        <Card className="p-6">
          <TransactionForm
            amount={amount}
            setAmount={setAmount}
            category={category}
            setCategory={setCategory}
            type={type}
            setType={setType}
            frequency={frequency}
            setFrequency={setFrequency}
            onSubmit={addTransaction}
          />
        </Card>

        <Card className="p-6">
          <Tabs defaultValue="transactions" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <Select
                value={view}
                onValueChange={(v) => setView(v as "weekly" | "monthly")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly View</SelectItem>
                  <SelectItem value="monthly">Monthly View</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="transactions">
              <TransactionList
                transactions={getFilteredTransactions()}
                onDelete={deleteTransaction}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <SpendingAnalytics
                transactions={transactions}
                totalExpenses={totalExpenses}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

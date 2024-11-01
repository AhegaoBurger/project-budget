"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { categories } from "@/lib/constants";
import { Transaction, IncomeFrequency } from "@/lib/types";

interface TransactionFormProps {
  amount: string;
  setAmount: (amount: string) => void;
  category: string;
  setCategory: (category: string) => void;
  type: "income" | "expense";
  setType: (type: "income" | "expense") => void;
  frequency: IncomeFrequency;
  setFrequency: (frequency: IncomeFrequency) => void;
  onSubmit: () => void;
}

export function TransactionForm({
  amount,
  setAmount,
  category,
  setCategory,
  type,
  setType,
  frequency,
  setFrequency,
  onSubmit,
}: TransactionFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Add Transaction</h2>
        <div className="flex gap-2">
          {type === "income" && (
            <Select
              value={frequency}
              onValueChange={(v) => setFrequency(v as IncomeFrequency)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Income Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly Income</SelectItem>
                <SelectItem value="monthly">Monthly Income</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Select
            value={type}
            onValueChange={(v) => setType(v as "income" | "expense")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button onClick={onSubmit} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>
    </div>
  );
}

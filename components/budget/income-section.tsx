"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";
import { IncomeSource, IncomeFrequency } from "@/lib/types";

interface IncomeSectionProps {
  incomeSources: IncomeSource[];
  onAddIncome: (income: IncomeSource) => void;
  onDeleteIncome: (id: string) => void;
}

export function IncomeSection({
  incomeSources,
  onAddIncome,
  onDeleteIncome,
}: IncomeSectionProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<IncomeFrequency>("monthly");

  const handleSubmit = () => {
    if (!name || !amount) return;

    const newIncome: IncomeSource = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      amount: parseFloat(amount),
      frequency,
    };

    onAddIncome(newIncome);
    setName("");
    setAmount("");
    setFrequency("monthly");
  };

  const calculateMonthlyAmount = (income: IncomeSource) => {
    if (income.frequency === "weekly") {
      return (income.amount * 52) / 12;
    }
    return income.amount;
  };

  const totalMonthlyIncome = incomeSources.reduce(
    (acc, income) => acc + calculateMonthlyAmount(income),
    0,
  );

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Income Sources</h2>
        <p className="text-sm text-muted-foreground">
          Total Monthly Income:{" "}
          <span className="font-semibold">
            ${totalMonthlyIncome.toFixed(2)}
          </span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="name">Source Name</Label>
          <Input
            id="name"
            placeholder="e.g., Salary, Freelance"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
          <Label htmlFor="frequency">Frequency</Label>
          <Select
            value={frequency}
            onValueChange={(v) => setFrequency(v as IncomeFrequency)}
          >
            <SelectTrigger id="frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button onClick={handleSubmit} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Income
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Source</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Monthly Equivalent</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomeSources.map((income) => (
            <TableRow key={income.id}>
              <TableCell className="font-medium">{income.name}</TableCell>
              <TableCell>{income.frequency}</TableCell>
              <TableCell className="text-right">
                ${income.amount.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                ${calculateMonthlyAmount(income).toFixed(2)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteIncome(income.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

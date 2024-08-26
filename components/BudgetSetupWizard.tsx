"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

type Frequency = "daily" | "weekly" | "monthly";

interface Income {
  amount: string;
  frequency: Frequency;
  description: string;
}

interface Expense {
  amount: string;
  frequency: Frequency;
  category: string;
  description: string;
}

const convertToMonthly = (amount: string, frequency: Frequency): number => {
  const numAmount = parseFloat(amount);
  switch (frequency) {
    case "daily":
      return numAmount * 30.44; // Average days in a month
    case "weekly":
      return numAmount * 4.35; // Average weeks in a month
    case "monthly":
    default:
      return numAmount;
  }
};

const BudgetSetupWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState<Income>({
    amount: "",
    frequency: "monthly",
    description: "",
  });
  const [expenses, setExpenses] = useState<Expense[]>([
    { amount: "", frequency: "monthly", category: "", description: "" },
  ]);
  const [remainingIncome, setRemainingIncome] = useState(0);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const supabase = createClient();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: incomeData, error: incomeError } = await supabase
      .from("income")
      .select("*")
      .single();

    if (incomeData) {
      setIncome({
        amount: incomeData.amount.toString(),
        frequency: incomeData.frequency as Frequency,
        description: incomeData.description || "",
      });
    }

    const { data: expensesData, error: expensesError } = await supabase
      .from("expenses")
      .select("*");

    if (expensesData) {
      setExpenses(
        expensesData.map((expense) => ({
          amount: expense.amount.toString(),
          frequency: expense.frequency as Frequency,
          category: expense.category || "",
          description: expense.description || "",
        })),
      );
    }

    updateRemainingIncome(expensesData || []);
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncome({ ...income, amount: e.target.value });
    updateRemainingIncome(expenses);
  };

  const handleIncomeFrequencyChange = (value: Frequency) => {
    setIncome({ ...income, frequency: value });
    updateRemainingIncome(expenses);
  };

  const handleExpenseChange = (
    index: number,
    field: keyof Expense,
    value: string,
  ) => {
    const updatedExpenses = expenses.map((expense, i) =>
      i === index ? { ...expense, [field]: value } : expense,
    );
    setExpenses(updatedExpenses);
    updateRemainingIncome(updatedExpenses);
  };

  const addExpense = () => {
    setExpenses([
      ...expenses,
      { amount: "", frequency: "monthly", category: "", description: "" },
    ]);
  };

  const updateRemainingIncome = (currentExpenses: Expense[]) => {
    const monthlyIncome = convertToMonthly(income.amount, income.frequency);
    const totalMonthlyExpenses = currentExpenses.reduce(
      (sum, expense) =>
        sum + convertToMonthly(expense.amount, expense.frequency),
      0,
    );
    setRemainingIncome(monthlyIncome - totalMonthlyExpenses);
  };

  const handleNext = async () => {
    if (step === 1 && income.amount) {
      await saveIncome();
      setStep(2);
    } else if (step === 2 && expenses.every((e) => e.amount && e.category)) {
      await saveExpenses();
      updateRemainingIncome(expenses);
      await saveSavingsProjections();
      setStep(3);
    }
  };

  const saveIncome = async () => {
    const { data, error } = await supabase.from("income").upsert({
      amount: parseFloat(income.amount),
      frequency: income.frequency,
      description: income.description,
    });

    if (error) {
      console.error("Error saving income:", error);
    }
  };

  const saveExpenses = async () => {
    const { data, error } = await supabase.from("expenses").upsert(
      expenses.map((expense) => ({
        amount: parseFloat(expense.amount),
        frequency: expense.frequency,
        category: expense.category,
        description: expense.description,
      })),
    );

    if (error) {
      console.error("Error saving expenses:", error);
    }
  };

  const saveSavingsProjections = async () => {
    const projectedSavings = calculateProjectedSavings();
    const { data, error } = await supabase.from("savings_projections").upsert(
      projectedSavings.map((projection) => ({
        month: new Date(projection.month).toISOString(),
        projected_amount: projection.amount,
      })),
    );

    if (error) {
      console.error("Error saving savings projections:", error);
    }
  };

  const calculateProjectedSavings = () => {
    const monthlyIncome = convertToMonthly(income.amount, income.frequency);
    const monthlyExpenses = expenses.reduce(
      (total, expense) =>
        total + convertToMonthly(expense.amount, expense.frequency),
      0,
    );
    const monthlySavings = monthlyIncome - monthlyExpenses;

    const currentDate = new Date();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return Array.from({ length: 6 }, (_, i) => {
      const projectedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1,
      );
      return {
        month: monthNames[projectedDate.getMonth()],
        amount: monthlySavings * (i + 1),
      };
    });
  };

  const renderIncomeStep = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Enter Your Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Total Income"
              value={income.amount}
              onChange={handleIncomeChange}
            />
            <Select
              onValueChange={(value: Frequency) =>
                handleIncomeFrequencyChange(value)
              }
              value={income.frequency}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleNext}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderExpensesStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Enter Your Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense, index) => (
              <div key={index} className="space-y-2">
                <Input
                  type="number"
                  placeholder="Expense Amount"
                  value={expense.amount}
                  onChange={(e) =>
                    handleExpenseChange(index, "amount", e.target.value)
                  }
                />
                <Select
                  onValueChange={(value: Frequency) =>
                    handleExpenseChange(index, "frequency", value)
                  }
                  value={expense.frequency}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="Expense Category"
                  value={expense.category}
                  onChange={(e) =>
                    handleExpenseChange(index, "category", e.target.value)
                  }
                />
                <Input
                  type="text"
                  placeholder="Expense Description"
                  value={expense.description}
                  onChange={(e) =>
                    handleExpenseChange(index, "description", e.target.value)
                  }
                />
              </div>
            ))}
            <Button onClick={addExpense}>Add Expense</Button>
            <div>Remaining Income: ${remainingIncome.toFixed(2)}</div>
            <Button onClick={handleNext}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderChartsStep = () => {
    const projectedSavings = calculateProjectedSavings();
    const expensesByCategory = expenses.reduce(
      (acc, expense) => {
        const monthlyAmount = convertToMonthly(
          expense.amount,
          expense.frequency,
        );
        acc[expense.category] = (acc[expense.category] || 0) + monthlyAmount;
        return acc;
      },
      {} as Record<string, number>,
    );

    const pieChartData = Object.entries(expensesByCategory).map(
      ([name, value], index) => ({
        name,
        value,
        fill: COLORS[index % COLORS.length],
      }),
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
      >
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Projected Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectedSavings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <Bar dataKey="amount" fill="#8884d8" />
                  <ChartTooltip />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                  <ChartLegend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <AnimatePresence mode="wait">
        {step === 1 && renderIncomeStep()}
        {step === 2 && renderExpensesStep()}
        {step === 3 && renderChartsStep()}
      </AnimatePresence>
    </div>
  );
};

export default BudgetSetupWizard;

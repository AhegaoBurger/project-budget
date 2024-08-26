"use client";

import React, { useState } from "react";
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

type Frequency = "daily" | "weekly" | "monthly";

interface Income {
  amount: string;
  frequency: Frequency;
}

interface Expense {
  amount: string;
  frequency: Frequency;
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

const BudgetSetupWizard = () => {
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState<Income>({
    amount: "",
    frequency: "monthly",
  });
  const [expenses, setExpenses] = useState<Expense[]>([
    { amount: "", frequency: "monthly", description: "" },
  ]);
  const [remainingIncome, setRemainingIncome] = useState(0);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncome({ ...income, amount: e.target.value });
    updateRemainingIncome([...expenses]);
  };

  const handleIncomeFrequencyChange = (value: Frequency) => {
    setIncome({ ...income, frequency: value });
    updateRemainingIncome([...expenses]);
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
      { amount: "", frequency: "monthly", description: "" },
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

  const handleNext = () => {
    if (step === 1 && income.amount) {
      setStep(2);
    } else if (step === 2 && expenses.every((e) => e.amount && e.description)) {
      updateRemainingIncome(expenses);
      setStep(3);
    }
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
            <div>Monthly Remaining Income: ${remainingIncome.toFixed(2)}</div>
            <Button onClick={handleNext}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

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

  const calculateExpensesByCategory = () => {
    return expenses.map((expense) => ({
      name: expense.description,
      value: convertToMonthly(expense.amount, expense.frequency),
    }));
  };

  const renderChartsStep = () => {
    const projectedSavings = calculateProjectedSavings();
    const expensesByCategory = calculateExpensesByCategory();

    const savingsChartConfig = {
      amount: {
        label: "Projected Savings",
        color: "#2563eb",
      },
    } satisfies ChartConfig;

    const expensesChartConfig = expensesByCategory.reduce(
      (config, category) => {
        config[category.name] = {
          label: category.name,
          color: COLORS[Object.keys(config).length % COLORS.length],
        };
        return config;
      },
      {} as ChartConfig,
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
              <ChartContainer
                config={savingsChartConfig}
                className="min-h-[200px] w-full"
              >
                <ResponsiveContainer>
                  <BarChart data={projectedSavings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                      dataKey="amount"
                      fill="var(--color-amount)"
                      radius={4}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={expensesChartConfig}
                className="min-h-[200px] w-full"
              >
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
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

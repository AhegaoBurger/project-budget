"use client";

import React, { useEffect, useState } from "react";
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
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface BudgetGraphsProps {
  user: User;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const BudgetGraphs: React.FC<BudgetGraphsProps> = ({ user }) => {
  const [projectedSavings, setProjectedSavings] = useState([]);
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch projected savings
      const { data: savingsData, error: savingsError } = await supabase
        .from("savings_projections")
        .select("*")
        .eq("user_id", user.id)
        .order("month", { ascending: true });

      if (savingsError) {
        console.error("Error fetching savings projections:", savingsError);
      } else {
        setProjectedSavings(savingsData);
      }

      // Fetch expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id);

      if (expensesError) {
        console.error("Error fetching expenses:", expensesError);
      } else {
        const categoryTotals = expensesData.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {});

        setExpensesByCategory(
          Object.entries(categoryTotals).map(([name, value], index) => ({
            name,
            value,
            fill: COLORS[index % COLORS.length],
          })),
        );
      }
    };

    fetchData();
  }, [user.id, supabase]);

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

  const chartData = projectedSavings.map((saving) => ({
    month: monthNames[new Date(saving.month).getMonth()],
    amount: saving.projected_amount,
  }));

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Projected Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <Bar dataKey="amount" fill="#8884d8" />
              <Tooltip />
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
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetGraphs;

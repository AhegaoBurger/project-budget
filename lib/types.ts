export type Transaction = {
  id: string;
  amount: number;
  category: string;
  date: string;
  type: "income" | "expense";
  frequency?: "weekly" | "monthly";
};

export type IncomeFrequency = "weekly" | "monthly";

export type IncomeSource = {
  id: string;
  name: string;
  amount: number;
  frequency: IncomeFrequency;
};

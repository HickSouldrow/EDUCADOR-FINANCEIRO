export type SimulationAnswers = {
  monthlyIncome: number;
  fixedExpenses: number;
  variableExpenses: number;
  currentDebt: number;
  emergencyReserve: number;
  financialGoal: string;
  riskProfile: "conservador" | "moderado" | "arrojado";
};

export type Simulation = {
  id: string;
  createdAt: string;
  answers: SimulationAnswers;
  aiInsights?: string;
  aiStatus?: "idle" | "loading" | "success" | "error";
  aiError?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};
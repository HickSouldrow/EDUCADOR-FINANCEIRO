import type { SimulationAnswers } from "../types/simulation";

export function calculateFinancialSnapshot(answers: SimulationAnswers) {
  const totalExpenses = answers.fixedExpenses + answers.variableExpenses;
  const monthlyBalance = answers.monthlyIncome - totalExpenses;
  const expenseRatio = answers.monthlyIncome > 0 ? totalExpenses / answers.monthlyIncome : 0;
  const debtRatio = answers.monthlyIncome > 0 ? answers.currentDebt / answers.monthlyIncome : 0;
  const reserveMonths = totalExpenses > 0 ? answers.emergencyReserve / totalExpenses : 0;

  return {
    totalExpenses,
    monthlyBalance,
    expenseRatio,
    debtRatio,
    reserveMonths,
  };
}

export function createSimulationId(): string {
  return crypto.randomUUID();
}
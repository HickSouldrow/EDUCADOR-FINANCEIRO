import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CurrencyInput } from "../components/form/CurrencyInput";
import { FormStep } from "../components/form/FormStep";
import type { SimulationAnswers } from "../types/simulation";
import { saveSimulation } from "../services/storage";
import { createSimulationId } from "../utils/simulation";

const initialAnswers: SimulationAnswers = {
  monthlyIncome: 0,
  fixedExpenses: 0,
  variableExpenses: 0,
  currentDebt: 0,
  emergencyReserve: 0,
  financialGoal: "",
  riskProfile: "moderado",
};

export function SimulationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SimulationAnswers>(initialAnswers);

  const steps = useMemo(
    () => [
      {
        title: "Vamos entender sua renda",
        description: "Informe quanto entra por mês para que a simulação tenha uma base realista.",
        canContinue: answers.monthlyIncome > 0,
        content: (
          <CurrencyInput
            id="monthlyIncome"
            label="Renda mensal líquida"
            onChange={(monthlyIncome) => setAnswers((current) => ({ ...current, monthlyIncome }))}
            value={answers.monthlyIncome}
          />
        ),
      },
      {
        title: "Mapeie seus gastos",
        description: "Separe gastos fixos dos variáveis para encontrar oportunidades de ajuste.",
        canContinue: answers.fixedExpenses >= 0 && answers.variableExpenses >= 0,
        content: (
          <div className="grid gap-4 sm:grid-cols-2">
            <CurrencyInput
              id="fixedExpenses"
              label="Gastos fixos"
              onChange={(fixedExpenses) => setAnswers((current) => ({ ...current, fixedExpenses }))}
              value={answers.fixedExpenses}
            />
            <CurrencyInput
              id="variableExpenses"
              label="Gastos variáveis"
              onChange={(variableExpenses) => setAnswers((current) => ({ ...current, variableExpenses }))}
              value={answers.variableExpenses}
            />
          </div>
        ),
      },
      {
        title: "Dívidas e reserva",
        description: "Esses dados ajudam a priorizar segurança financeira antes de metas maiores.",
        canContinue: answers.currentDebt >= 0 && answers.emergencyReserve >= 0,
        content: (
          <div className="grid gap-4 sm:grid-cols-2">
            <CurrencyInput
              id="currentDebt"
              label="Dívidas atuais"
              onChange={(currentDebt) => setAnswers((current) => ({ ...current, currentDebt }))}
              value={answers.currentDebt}
            />
            <CurrencyInput
              id="emergencyReserve"
              label="Reserva de emergência"
              onChange={(emergencyReserve) => setAnswers((current) => ({ ...current, emergencyReserve }))}
              value={answers.emergencyReserve}
            />
          </div>
        ),
      },
      {
        title: "Objetivo e perfil",
        description: "A IA vai adaptar os próximos passos ao que você quer construir.",
        canContinue: answers.financialGoal.trim().length >= 3,
        content: (
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm font-semibold" htmlFor="financialGoal">
              Objetivo Financeiro
              <textarea
                className="min-h-28 resize-y border border-border bg-elevated px-4 py-3 text-base outline-none transition placeholder:text-muted focus:border-neon focus:ring-1 focus:ring-neon"
                id="financialGoal"
                onChange={(event) => setAnswers((current) => ({ ...current, financialGoal: event.target.value }))}
                placeholder="Ex: quitar dívidas, montar reserva, comprar um imóvel..."
                value={answers.financialGoal}
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold" htmlFor="riskProfile">
              Perfil de risco
              <select
                className="min-h-12 border border-border bg-elevated px-4 text-base outline-none transition focus:border-neon focus:ring-1 focus:ring-neon"
                id="riskProfile"
                onChange={(event) =>
                  setAnswers((current) => ({
                    ...current,
                    riskProfile: event.target.value as SimulationAnswers["riskProfile"],
                  }))
                }
                value={answers.riskProfile}
              >
                <option value="conservador">Conservador</option>
                <option value="moderado">Moderado</option>
                <option value="arrojado">Arrojado</option>
              </select>
            </label>
          </div>
        ),
      },
    ],
    [answers],
  );

  function handleNext() {
    if (step < steps.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    const id = createSimulationId();
    saveSimulation({
      id,
      answers,
      createdAt: new Date().toISOString(),
      aiStatus: "idle",
    });
    navigate(`/resultado/${id}`);
  }

  const current = steps[step];

  return (
    <FormStep
      canContinue={current.canContinue}
      currentStep={step}
      description={current.description}
      isFirst={step === 0}
      isLast={step === steps.length - 1}
      onBack={() => setStep((currentStep) => Math.max(0, currentStep - 1))}
      onNext={handleNext}
      title={current.title}
      totalSteps={steps.length}
    >
      {current.content}
    </FormStep>
  );
}
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/form/ui/Button";
import { generateSimulationInsights } from "../services/gemini";
import { getSimulationById, updateSimulation } from "../services/storage";
import type { Simulation } from "../types/simulation";
import { formatCurrency } from "../utils/currency";
import { formatDateTime } from "../utils/date";
import { calculateFinancialSnapshot } from "../utils/simulation";

export function ResultPage() {
  const { simulationId } = useParams();
  const [simulation, setSimulation] = useState<Simulation | undefined>(() =>
    simulationId ? getSimulationById(simulationId) : undefined,
  );
  const requestStarted = useRef(false);

  const snapshot = useMemo(
    () => (simulation ? calculateFinancialSnapshot(simulation.answers) : undefined),
    [simulation],
  );

  useEffect(() => {
    if (!simulation || simulation.aiInsights || requestStarted.current) return;
    requestStarted.current = true;

    setSimulation(updateSimulation(simulation.id, { aiStatus: "loading", aiError: undefined }));

    generateSimulationInsights(simulation)
      .then((aiInsights) => {
        setSimulation(updateSimulation(simulation.id, { aiInsights, aiStatus: "success", aiError: undefined }));
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Não foi possível gerar os insights agora.";
        setSimulation(updateSimulation(simulation.id, { aiStatus: "error", aiError: message }));
      });
  }, [simulation]);

  if (!simulation || !snapshot) {
    return (
      <section className="mx-auto max-w-2xl border border-border bg-surface p-8 text-center">
        <h1 className="text-2xl font-extrabold">Simulação não encontrada</h1>
        <p className="mt-2 text-muted">Crie uma nova simulação para gerar uma análise financeira com IA.</p>
        <Link to="/">
          <Button className="mt-6">Nova simulação</Button>
        </Link>
      </section>
    );
  }

  const cards = [
    { label: "Saldo mensal", value: formatCurrency(snapshot.monthlyBalance) },
    { label: "Gastos totais", value: formatCurrency(snapshot.totalExpenses) },
    { label: "Renda comprometida", value: `${(snapshot.expenseRatio * 100).toFixed(1)}%` },
    { label: "Meses de reserva", value: snapshot.reserveMonths.toFixed(1) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary transition-colors" to="/">
            <ArrowLeft size={16} /> Nova simulação
          </Link>
          <h1 className="mt-3 text-3xl font-extrabold tracking-normal">Resultado da simulação</h1>
          <p className="mt-1 text-muted">Criada em {formatDateTime(simulation.createdAt)}</p>
        </div>
        <Link to="/chat">
          <Button icon={<Sparkles size={18} className="neon-icon" />}>Conversar com IA</Button>
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article className="border border-border bg-surface p-5" key={card.label}>
            <p className="text-sm font-semibold text-muted">{card.label}</p>
            <strong className="mt-2 block text-2xl font-extrabold">{card.value}</strong>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="border border-border bg-surface p-6">
          <h2 className="text-xl font-extrabold">Resumo informado</h2>
          <dl className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted">Renda</dt><dd className="font-semibold">{formatCurrency(simulation.answers.monthlyIncome)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Gastos fixos</dt><dd className="font-semibold">{formatCurrency(simulation.answers.fixedExpenses)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Gastos variáveis</dt><dd className="font-semibold">{formatCurrency(simulation.answers.variableExpenses)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Dívidas</dt><dd className="font-semibold">{formatCurrency(simulation.answers.currentDebt)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Reserva</dt><dd className="font-semibold">{formatCurrency(simulation.answers.emergencyReserve)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Perfil</dt><dd className="font-semibold capitalize">{simulation.answers.riskProfile}</dd></div>
          </dl>
          <p className="mt-5 border border-border bg-elevated p-4 text-sm leading-6 text-muted">{simulation.answers.financialGoal}</p>
        </article>

        <article className="border border-border bg-surface p-6">
          <h2 className="text-xl font-extrabold">Insights da IA</h2>
          {simulation.aiStatus === "loading" && (
            <div className="mt-6 flex items-center gap-3 text-muted">
              <Loader2 className="animate-spin neon-icon" size={20} />
              Gerando análise personalizada...
            </div>
          )}
          {simulation.aiStatus === "error" && (
            <div className="mt-6 border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle size={18} /> Não foi possível gerar a análise
              </div>
              <p className="mt-2 text-foreground">{simulation.aiError}</p>
            </div>
          )}
          {simulation.aiInsights && (
            <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-foreground">{simulation.aiInsights}</div>
          )}
        </article>
      </section>
    </div>
  );
}
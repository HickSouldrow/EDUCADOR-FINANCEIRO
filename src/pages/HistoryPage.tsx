import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/form/ui/Button";
import { deleteSimulation, getSimulations } from "../services/storage";
import type { Simulation } from "../types/simulation";
import { formatCurrency } from "../utils/currency";
import { formatDateTime } from "../utils/date";
import { calculateFinancialSnapshot } from "../utils/simulation";

export function HistoryPage() {
  const [simulations, setSimulations] = useState<Simulation[]>(getSimulations);

  function handleDelete(id: string) {
    deleteSimulation(id);
    setSimulations(getSimulations());
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-normal">Histórico de simulações</h1>
          <p className="mt-1 text-muted">Revise análises anteriores salvas neste navegador.</p>
        </div>
        <Button>
          <Link to="/">Nova simulação</Link>
        </Button>
      </div>

      {simulations.length === 0 ? (
        <section className="border border-border bg-surface p-8 text-center">
          <h2 className="text-xl font-extrabold">Nenhuma simulação ainda</h2>
          <p className="mt-2 text-muted">Preencha o formulário inicial para criar seu primeiro diagnóstico.</p>
        </section>
      ) : (
        <section className="grid gap-4">
          {simulations.map((simulation) => {
            const snapshot = calculateFinancialSnapshot(simulation.answers);
            return (
              <article className="border border-border bg-surface p-5" key={simulation.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <Link className="text-lg font-extrabold hover:text-primary transition-colors" to={`/resultado/${simulation.id}`}>
                      {simulation.answers.financialGoal}
                    </Link>
                    <p className="mt-1 text-sm text-muted">{formatDateTime(simulation.createdAt)}</p>
                  </div>
                  <div className="grid gap-3 text-sm sm:grid-cols-3 lg:min-w-[30rem]">
                    <span><strong className="block">{formatCurrency(simulation.answers.monthlyIncome)}</strong><span className="text-muted">Renda</span></span>
                    <span><strong className="block">{formatCurrency(snapshot.monthlyBalance)}</strong><span className="text-muted">Saldo</span></span>
                    <span><strong className="block capitalize">{simulation.answers.riskProfile}</strong><span className="text-muted">Perfil</span></span>
                  </div>
                  <Button
                    aria-label="Excluir simulação"
                    className="h-10 w-10 px-0 border border-border hover:border-danger hover:text-danger"
                    icon={<Trash2 size={17} className="neon-icon" />}
                    onClick={() => handleDelete(simulation.id)}
                    title="Excluir"
                    variant="ghost"
                  />
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
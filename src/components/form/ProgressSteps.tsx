type ProgressStepsProps = {
  currentStep: number;
  totalSteps: number;
};

export function ProgressSteps({ currentStep, totalSteps }: ProgressStepsProps) {
  const percentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>Etapa {currentStep + 1} de {totalSteps}</span>
        <span className="text-muted">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
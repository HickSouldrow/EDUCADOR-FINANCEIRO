import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";
import { ProgressSteps } from "./ProgressSteps";
import { QuestionCard } from "./QuestionCard";

type FormStepProps = {
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  canContinue: boolean;
  children: ReactNode;
  onBack: () => void;
  onNext: () => void;
};

export function FormStep({
  canContinue,
  children,
  currentStep,
  description,
  isFirst,
  isLast,
  onBack,
  onNext,
  title,
  totalSteps,
}: FormStepProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <ProgressSteps currentStep={currentStep} totalSteps={totalSteps} />
      <QuestionCard description={description} title={title}>
        <div className="space-y-5">{children}</div>
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button disabled={isFirst} icon={<ArrowLeft size={18} />} onClick={onBack} variant="secondary">
            Voltar
          </Button>
          <Button
            disabled={!canContinue}
            icon={isLast ? <Sparkles size={18} /> : <ArrowRight size={18} />}
            onClick={onNext}
          >
            {isLast ? "Gerar simulação" : "Continuar"}
          </Button>
        </div>
      </QuestionCard>
    </div>
  );
}
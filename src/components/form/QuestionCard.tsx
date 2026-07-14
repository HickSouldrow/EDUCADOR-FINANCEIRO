import type { ReactNode } from "react";

type QuestionCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function QuestionCard({ children, description, title }: QuestionCardProps) {
  return (
    <section className="border border-border bg-surface p-5 sm:p-7">
      <div className="mb-6 border-b border-border pb-6">
        <h1 className="text-2xl font-extrabold tracking-normal sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">{description}</p>
      </div>
      {children}
    </section>
  );
}
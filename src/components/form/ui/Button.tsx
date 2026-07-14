import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:brightness-95 focus-visible:ring-primary",
  secondary: "border border-border bg-surface text-foreground hover:bg-elevated focus-visible:ring-accent",
  ghost: "text-muted hover:bg-elevated hover:text-foreground focus-visible:ring-accent",
  danger: "bg-danger text-white hover:brightness-95 focus-visible:ring-danger",
};

export function Button({ children, className = "", icon, variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${variants[variant]} ${className}`}
      type={type}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
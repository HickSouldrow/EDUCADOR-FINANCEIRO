import { BarChart3, History, MessageCircle, Moon, PiggyBank, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../form/ui/Button";

const navItems = [
  { to: "/", label: "Simular", icon: BarChart3 },
  { to: "/historico", label: "Histórico", icon: History },
  { to: "/chat", label: "Chat IA", icon: MessageCircle },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <NavLink to="/" className="flex items-center gap-3">
          {/* Logo com brilho neon */}
          <span className="grid h-11 w-11 place-items-center border border-primary bg-primary/10 text-primary">
            <PiggyBank size={24} aria-hidden="true" className="neon-icon" />
          </span>
          <span>
            <span className="block text-base font-extrabold leading-tight">Educador Financeiro</span>
            <span className="block text-sm text-muted">Simulações com IA generativa</span>
          </span>
        </NavLink>

        <div className="flex flex-wrap items-center gap-2">
          {/* Navegação Sólida */}
          <nav className="flex border border-border bg-elevated p-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                className={({ isActive }) =>
                  `inline-flex min-h-10 items-center gap-2 px-3 text-sm font-semibold transition ${
                    isActive 
                      ? "bg-surface text-primary border-b-2 border-primary" 
                      : "text-muted hover:text-foreground"
                  }`
                }
                key={to}
                to={to}
              >
                <Icon size={17} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
          
          <Button
            aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
            className="h-11 w-11 px-0 border border-border hover:border-primary"
            icon={theme === "dark" ? <Sun size={18} className="neon-icon" /> : <Moon size={18} />}
            onClick={toggleTheme}
            title={theme === "dark" ? "Tema claro" : "Tema escuro"}
            variant="secondary"
          />
        </div>
      </div>
    </header>
  );
}
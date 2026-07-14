import { maskCurrency, parseCurrency } from "../../utils/currency";

type CurrencyInputProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
};

export function CurrencyInput({ id, label, onChange, value }: CurrencyInputProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground" htmlFor={id}>
      {label}
      <input
        className="min-h-12 border border-border bg-elevated px-4 text-base text-foreground outline-none transition placeholder:text-muted focus:border-neon focus:ring-1 focus:ring-neon"
        id={id}
        inputMode="numeric"
        onChange={(event) => onChange(parseCurrency(event.target.value))}
        placeholder="R$ 0,00"
        value={maskCurrency(String(Math.round(value * 100)))}
      />
    </label>
  );
}
export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

export function maskCurrency(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, "");
  const cents = Number(digits || "0");
  return formatCurrency(cents / 100);
}

export function parseCurrency(maskedValue: string): number {
  const digits = maskedValue.replace(/\D/g, "");
  return Number(digits || "0") / 100;
}
export function formatCurrencyINR(value: number, options?: Intl.NumberFormatOptions): string {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    ...options,
  })
  return formatter.format(value)
}

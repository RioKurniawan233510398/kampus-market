const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatPrice(usdPrice: number): string {
  // Convert USD price to IDR (approximate 1 USD = 16000 IDR)
  const idrPrice = usdPrice * 16000;
  return idrFormatter.format(idrPrice);
}

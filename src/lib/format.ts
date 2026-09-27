/**
 * Prices on the Tyashin API are stored in the smallest currency unit
 * (paise for INR, cents for USD). Format consistently with the Lovable site
 * — `en-IN` locale + `Intl.NumberFormat` with the project currency.
 */
export function formatPrice(amountInSmallestUnit: number, currency = 'INR'): string {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(
      amountInSmallestUnit / 100,
    );
  } catch {
    // Unknown currency — fall back to a raw display.
    return `${currency} ${(amountInSmallestUnit / 100).toFixed(2)}`;
  }
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}


/**
 * Price-on-request convention: a product with price 0 has no published price
 * yet. Every price surface renders "Price on request" and swaps Add-to-cart
 * for a WhatsApp enquiry instead of showing ₹0 or letting a ₹0 order through.
 */
export function isPriceOnRequest(product: { price: number }): boolean {
  return !product.price || product.price <= 0;
}
export const PRICE_ON_REQUEST_LABEL = 'Price on request';

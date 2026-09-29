/**
 * Format a number as Pakistani Rupee currency string
 * e.g., 250000 -> "Rs. 250,000"
 */
export function formatPKR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rs. 0';
  }
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}

export function formatCurrency(amount: number | undefined | null, currency = 'PKR'): string {
  if (currency === 'PKR') {
    return formatPKR(amount);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount || 0);
}

export default formatPKR;

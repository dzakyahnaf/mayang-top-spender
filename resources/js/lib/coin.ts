// Coin system: 1 Coin = Rp 5 belanja. Raw rupiah stays in the DB; only the
// displayed value is divided by 5.
export function formatCoin(amount: number): string {
    return new Intl.NumberFormat('id-ID').format(Math.floor(amount / 5)) + ' Coin';
}

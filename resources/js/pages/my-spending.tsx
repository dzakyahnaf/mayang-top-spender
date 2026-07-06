import PublicFooter from '@/components/public-footer';
import PublicNavbar from '@/components/public-navbar';
import { Head } from '@inertiajs/react';
import { CircleUser, History, Trophy } from 'lucide-react';

interface MySpendingProps {
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    transactions: Array<{
        id: number;
        amount: number;
        created_at: string;
        period: {
            name: string;
        } | null;
    }>;
    totalSpending: number;
    period: { name: string } | null;
    myRank: { ranking: number | null; total_spending: number } | null;
    nextReward: { title: string; rank_label: string; amount_needed: number } | null;
}

// Coin system: 1 Coin = Rp 5 belanja. Raw rupiah stays in the DB; only the
// displayed value is divided by 5.
function formatCoin(amount: number): string {
    return new Intl.NumberFormat('id-ID').format(Math.floor(amount / 5)) + ' Coin';
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function MySpending({ customer, transactions, totalSpending, period, myRank, nextReward }: MySpendingProps) {
    return (
        <>
            <Head title="Belanjaanku" />

            <div className="selection:bg-mayang-500 relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-white font-sans text-slate-900 selection:text-white">
                <PublicNavbar isDashboard />

                <div className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-4 pt-36 pb-20 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <p className="mb-3 text-xs font-bold tracking-[0.3em] text-slate-400 uppercase">Akun Saya</p>
                        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                            Cek <span className="text-mayang-500 italic">Belanjaanku</span>
                        </h1>
                    </div>

                    <div className="space-y-10">
                        {/* Card Informasi Member */}
                        <div className="border border-slate-200 bg-white">
                            <div className="flex items-center gap-3 border-b border-slate-200 px-8 py-6">
                                <CircleUser className="text-mayang-600 size-5" />
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Informasi Member</h2>
                                    <p className="text-xs text-slate-500">Detail akun dan total transaksimu.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                                <div className="px-8 py-6">
                                    <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Nama</p>
                                    <p className="mt-1 text-lg font-bold text-slate-900">{customer.name}</p>
                                </div>
                                <div className="px-8 py-6">
                                    <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Email</p>
                                    <p className="mt-1 truncate text-lg font-bold text-slate-900">{customer.email}</p>
                                </div>
                                <div className="px-8 py-6">
                                    <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Nomor HP</p>
                                    <p className="mt-1 text-lg font-bold text-slate-900">{customer.phone || '-'}</p>
                                </div>
                            </div>

                            <div className="bg-mayang-900 flex flex-col items-center justify-between gap-4 px-8 py-6 text-white sm:flex-row">
                                <div>
                                    <p className="text-sm font-semibold text-white/90">Total Coin Terkumpul</p>
                                    <p className="text-xs text-white/60">Semua transaksi yang tercatat atas namamu.</p>
                                </div>
                                <p className="font-display text-3xl font-bold tracking-tight">{formatCoin(totalSpending)}</p>
                            </div>
                        </div>

                        {/* Card Progres Kompetisi */}
                        {period && (
                            <div className="border border-slate-200 bg-white">
                                <div className="flex items-center gap-3 border-b border-slate-200 px-8 py-6">
                                    <Trophy className="text-mayang-600 size-5" />
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">Progres Kompetisi</h2>
                                        <p className="text-xs text-slate-500">Periode aktif: {period.name}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-between gap-6 px-8 py-6 sm:flex-row">
                                    <div className="flex flex-col items-center sm:items-start">
                                        <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Peringkatmu</p>
                                        <p className="font-display text-mayang-600 text-4xl font-bold">{myRank?.ranking ?? '—'}</p>
                                    </div>

                                    <div className="text-center sm:text-right">
                                        {nextReward ? (
                                            <>
                                                <p className="text-sm text-slate-500">
                                                    Butuh <span className="font-bold text-slate-900">{formatCoin(nextReward.amount_needed)}</span>{' '}
                                                    lagi untuk masuk
                                                </p>
                                                <p className="text-mayang-600 text-lg font-bold">
                                                    {nextReward.rank_label} — {nextReward.title}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-sm font-semibold text-slate-700">
                                                Kamu sudah di posisi terbaik! Pertahankan peringkatmu.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Riwayat Belanja */}
                        <div className="border border-slate-200 bg-white">
                            <div className="flex items-center gap-3 border-b border-slate-200 px-8 py-6">
                                <History className="text-mayang-600 size-5" />
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Riwayat Transaksi</h2>
                                    <p className="text-xs text-slate-500">Daftar transaksi terakhirmu di Mayang Modest Wear.</p>
                                </div>
                            </div>

                            {transactions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="border-b border-slate-200 bg-slate-50">
                                            <tr>
                                                <th className="px-8 py-4 text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">Tanggal</th>
                                                <th className="px-8 py-4 text-left text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
                                                    Periode
                                                </th>
                                                <th className="px-8 py-4 text-right text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
                                                    Coin
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {transactions.map((t) => (
                                                <tr key={t.id} className="transition-colors hover:bg-slate-50/80">
                                                    <td className="px-8 py-5 text-sm font-medium whitespace-nowrap text-slate-900">
                                                        {formatDate(t.created_at)}
                                                    </td>
                                                    <td className="px-8 py-5 text-sm whitespace-nowrap text-slate-600">{t.period?.name ?? '-'}</td>
                                                    <td className="text-mayang-600 px-8 py-5 text-right text-sm font-bold whitespace-nowrap">
                                                        {formatCoin(t.amount)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="px-8 py-16 text-center">
                                    <div className="mx-auto mb-4 flex size-16 items-center justify-center bg-slate-50 text-slate-400">
                                        <History className="size-7" />
                                    </div>
                                    <p className="text-lg font-bold text-slate-900">Belum ada riwayat belanja.</p>
                                    <p className="mt-1 text-sm text-slate-500">Silakan belanja di toko dan berikan nomor HP/Email ke kasir.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <PublicFooter />
            </div>
        </>
    );
}

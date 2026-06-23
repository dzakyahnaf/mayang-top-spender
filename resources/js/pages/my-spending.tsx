import { Head, Link } from '@inertiajs/react';

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
        };
    }>;
    totalSpending: number;
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID').format(amount);
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function MySpending({ customer, transactions, totalSpending }: MySpendingProps) {
    return (
        <>
            <Head title="Belanjaanku" />

            <div className="min-h-screen bg-slate-50 font-sans selection:bg-mayang-500 selection:text-white">
                {/* Navbar (Glassmorphism) */}
                <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-md transition-all duration-300">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            <Link href="/" className="text-2xl font-black tracking-tight text-mayang-600 transition hover:text-mayang-700">
                                Mayang
                                <span className="text-mayang-400"> Top Spender</span>
                            </Link>
                            <div className="flex items-center gap-6">
                                <Link href={route('leaderboard')} className="text-sm font-semibold text-slate-600 transition-colors hover:text-mayang-600">
                                    Leaderboard
                                </Link>
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-full bg-gradient-to-r from-mayang-500 to-mayang-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-mayang-500/30 transition-all hover:-translate-y-0.5 hover:shadow-mayang-500/50"
                                >
                                    Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
                    {/* Decorative Elements */}
                    <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-mayang-200/40 blur-3xl filter"></div>
                    <div className="absolute -right-20 top-60 h-72 w-72 rounded-full bg-mayang-100/60 blur-3xl filter"></div>

                    <div className="relative z-10">
                        <div className="mb-10 text-center">
                            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                                Cek <span className="bg-gradient-to-r from-mayang-500 to-mayang-400 bg-clip-text text-transparent">Belanjaanku</span>
                            </h1>
                        </div>

                        <div className="mt-8 space-y-8">
                            {/* Card Informasi Member */}
                            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white/80 p-8 shadow-xl backdrop-blur-md sm:p-10">
                                <div className="mb-6 flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-mayang-500 to-mayang-600 text-white shadow-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Informasi Member</h2>
                                        <p className="text-sm text-slate-500">Detail akun dan total transaksimu.</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-6 rounded-2xl bg-slate-50/50 p-6 sm:grid-cols-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nama</p>
                                        <p className="mt-1 text-lg font-bold text-slate-900">{customer.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</p>
                                        <p className="mt-1 text-lg font-bold text-slate-900">{customer.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nomor HP</p>
                                        <p className="mt-1 text-lg font-bold text-slate-900">{customer.phone || '-'}</p>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-mayang-50 to-mayang-100 p-6 sm:flex-row">
                                    <div>
                                        <p className="text-sm font-semibold text-mayang-700">Total Belanja Terakumulasi</p>
                                        <p className="text-xs text-mayang-600/80">Semua transaksi yang tercatat atas namamu.</p>
                                    </div>
                                    <p className="text-4xl font-black tracking-tight text-mayang-600">
                                        Rp {formatRupiah(totalSpending)}
                                    </p>
                                </div>
                            </div>

                            {/* Riwayat Belanja */}
                            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white/90 shadow-2xl backdrop-blur-md">
                                <div className="border-b border-slate-100 bg-white/50 px-8 py-6">
                                    <h2 className="text-xl font-bold text-slate-900">Riwayat Transaksi</h2>
                                    <p className="mt-1 text-sm text-slate-500">Daftar transaksi terakhirmu di Mayang Modest Wear.</p>
                                </div>

                                {transactions.length > 0 ? (
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50/80">
                                            <tr>
                                                <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">Tanggal</th>
                                                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Periode</th>
                                                <th className="px-8 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-600">Nominal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {transactions.map((t) => (
                                                <tr key={t.id} className="transition-colors hover:bg-mayang-50/30">
                                                    <td className="whitespace-nowrap px-8 py-5 text-sm font-medium text-slate-900">
                                                        {formatDate(t.created_at)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-8 py-5 text-sm">
                                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                                                            {t.period.name}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-8 py-5 text-right text-sm font-bold text-mayang-600">
                                                        Rp {formatRupiah(t.amount)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="px-8 py-16 text-center">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                            </svg>
                                        </div>
                                        <p className="text-lg font-medium text-slate-900">Belum ada riwayat belanja.</p>
                                        <p className="mt-1 text-sm text-slate-500">Silakan belanja di toko dan berikan nomor HP/Email ke kasir.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="mt-auto bg-slate-900 py-12 text-center text-sm text-slate-400">
                    <div className="mx-auto max-w-7xl px-4">
                        <p>&copy; 2026 Mayang Modest Wear. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}

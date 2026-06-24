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

            <div className="relative min-h-screen bg-gradient-to-br from-mayang-50 via-slate-50 to-mayang-100/40 font-sans text-slate-900 selection:bg-mayang-500 selection:text-white overflow-x-hidden flex flex-col justify-between">
                {/* Spotlight Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_top,_rgba(27,174,185,0.08)_0%,_rgba(27,174,185,0)_70%)] pointer-events-none z-0" />

                {/* Clean Navbar */}
                <nav className="fixed top-0 left-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm transition-all duration-300">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-mayang-500 shadow-sm">
                                    <img src="/MayangCollection_Logo Icon_White.png" alt="Mayang Logo" className="size-6 object-contain" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-slate-900">
                                    Mayang <span className="text-mayang-500 font-black">Top Spender</span>
                                </span>
                            </Link>
                            <div className="flex items-center gap-6">
                                <Link
                                    href={route('leaderboard')}
                                    className="text-sm font-semibold text-slate-600 transition-colors hover:text-mayang-600"
                                >
                                    Leaderboard
                                </Link>
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-full bg-mayang-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-mayang-600"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                    className="cursor-pointer rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800"
                                >
                                    Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="relative mx-auto max-w-4xl px-4 pt-32 pb-20 sm:px-6 lg:px-8 z-10 flex-1 w-full">
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                            Cek <span className="text-mayang-500">Belanjaanku</span>
                        </h1>
                    </div>

                    <div className="mt-8 space-y-8">
                        {/* Card Informasi Member */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex size-14 items-center justify-center rounded-xl bg-mayang-50 text-mayang-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Informasi Member</h2>
                                    <p className="text-sm text-slate-500">Detail akun dan total transaksimu.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 rounded-xl border border-slate-100 bg-slate-50 p-6 sm:grid-cols-3">
                                <div>
                                    <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">Nama</p>
                                    <p className="mt-1 text-lg font-bold text-slate-900">{customer.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">Email</p>
                                    <p className="mt-1 text-lg font-bold text-slate-900">{customer.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">Nomor HP</p>
                                    <p className="mt-1 text-lg font-bold text-slate-900">{customer.phone || '-'}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-mayang-200 bg-mayang-50 p-6 sm:flex-row">
                                <div>
                                    <p className="text-sm font-semibold text-mayang-700">Total Belanja Terakumulasi</p>
                                    <p className="text-xs text-mayang-600">Semua transaksi yang tercatat atas namamu.</p>
                                </div>
                                <p className="text-4xl font-black tracking-tight text-mayang-600">Rp {formatRupiah(totalSpending)}</p>
                            </div>
                        </div>

                        {/* Riwayat Belanja */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 bg-white px-8 py-6">
                                <h2 className="text-xl font-bold text-slate-900">Riwayat Transaksi</h2>
                                <p className="mt-1 text-sm text-slate-500">Daftar transaksi terakhirmu di Mayang Modest Wear.</p>
                            </div>

                            {transactions.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="border-b border-slate-100 bg-slate-50">
                                        <tr>
                                            <th className="px-8 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Tanggal</th>
                                            <th className="px-8 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">Periode</th>
                                            <th className="px-8 py-4 text-right text-xs font-bold tracking-wider text-slate-500 uppercase">Nominal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {transactions.map((t) => (
                                            <tr key={t.id} className="transition-colors hover:bg-slate-50/80">
                                                <td className="whitespace-nowrap px-8 py-5 text-sm font-medium text-slate-900">
                                                    {formatDate(t.created_at)}
                                                </td>
                                                <td className="whitespace-nowrap px-8 py-5 text-sm">
                                                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
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
                                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                {/* Footer */}
                <footer className="relative border-t border-slate-200 bg-white py-12 text-center text-sm text-slate-500 z-10 w-full mt-auto">
                    <div className="mx-auto max-w-7xl px-4">
                        <p>&copy; {new Date().getFullYear()} Mayang Modest Wear. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}

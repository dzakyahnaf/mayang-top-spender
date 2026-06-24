import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface LeaderboardProps {
    period: {
        name: string;
        start_date: string;
        end_date: string;
    } | null;
    leaderboard: Array<{
        ranking: number;
        name: string;
        total_spending: number;
    }>;
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID').format(amount);
}

export default function Leaderboard({ period, leaderboard }: LeaderboardProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Leaderboard" />

            <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-mayang-500 selection:text-white">
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
                                <Link href={route('leaderboard')} className="text-sm font-semibold text-mayang-600 transition-colors">
                                    Leaderboard
                                </Link>
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-full bg-mayang-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-mayang-600"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Content */}
                <div className="relative mx-auto max-w-4xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                            Top Spender <span className="text-mayang-500">Leaderboard</span>
                        </h1>
                        {period && (
                            <div className="mx-auto mt-6 flex max-w-sm flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
                                <span className="text-lg font-bold text-slate-900">{period.name}</span>
                                <span className="text-sm font-medium text-slate-500">
                                    {formatDate(period.start_date)} &mdash; {formatDate(period.end_date)}
                                </span>
                            </div>
                        )}
                    </div>

                    {!period ? (
                        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Belum Ada Kompetisi</h3>
                            <p className="mt-2 text-slate-500">Saat ini belum ada periode kompetisi yang aktif.</p>
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Belum Ada Transaksi</h3>
                            <p className="mt-2 text-slate-500">Jadilah yang pertama untuk memimpin leaderboard di periode ini!</p>
                        </div>
                    ) : (
                        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <table className="w-full text-left">
                                <thead className="border-b border-slate-200 bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Rank</th>
                                        <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Nama Pelanggan</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-slate-500 uppercase">Total Belanja</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {leaderboard.map((entry) => (
                                        <tr key={entry.ranking} className="transition-colors hover:bg-slate-50/80">
                                            <td className="whitespace-nowrap px-6 py-5">
                                                <div
                                                    className={`flex size-8 items-center justify-center rounded-full text-sm font-bold shadow-sm ${
                                                        entry.ranking === 1
                                                            ? 'bg-amber-100 text-amber-600'
                                                            : entry.ranking === 2
                                                                ? 'bg-slate-200 text-slate-600'
                                                                : entry.ranking === 3
                                                                ? 'bg-orange-100 text-orange-700'
                                                                : 'bg-slate-50 text-slate-500'
                                                    }`}
                                                >
                                                    {entry.ranking}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-5">
                                                <span className={`font-semibold ${entry.ranking <= 3 ? 'text-slate-900' : 'text-slate-700'}`}>
                                                    {entry.name}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-5 text-right">
                                                <span className="font-bold text-mayang-600">Rp {formatRupiah(entry.total_spending)}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="mt-auto border-t border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
                    <div className="mx-auto max-w-7xl px-4">
                        <p>&copy; {new Date().getFullYear()} Mayang Modest Wear. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}

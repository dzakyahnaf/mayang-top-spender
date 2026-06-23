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
                                <Link href={route('leaderboard')} className="text-sm font-semibold text-mayang-600 transition-colors">
                                    Leaderboard
                                </Link>
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-full bg-gradient-to-r from-mayang-500 to-mayang-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-mayang-500/30 transition-all hover:-translate-y-0.5 hover:shadow-mayang-500/50"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Content */}
                <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
                    {/* Decorative Elements */}
                    <div className="absolute -left-20 top-40 h-72 w-72 rounded-full bg-mayang-200/40 blur-3xl filter"></div>
                    <div className="absolute -right-20 top-80 h-72 w-72 rounded-full bg-mayang-100/60 blur-3xl filter"></div>

                    <div className="relative z-10">
                        <div className="mb-10 text-center">
                            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                                Top Spender <span className="bg-gradient-to-r from-mayang-500 to-mayang-400 bg-clip-text text-transparent">Leaderboard</span>
                            </h1>
                            {period && (
                                <div className="mt-4 inline-flex flex-col items-center justify-center rounded-2xl border border-mayang-100 bg-white/60 px-6 py-3 shadow-sm backdrop-blur-md">
                                    <span className="text-lg font-bold text-mayang-600">{period.name}</span>
                                    <span className="text-sm font-medium text-slate-500">
                                        {formatDate(period.start_date)} — {formatDate(period.end_date)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {!period ? (
                            <div className="mt-8 rounded-3xl border border-slate-100 bg-white/80 p-12 text-center shadow-xl backdrop-blur-sm">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mayang-50 text-mayang-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Belum Ada Kompetisi</h3>
                                <p className="mt-2 text-slate-500">Saat ini belum ada periode kompetisi yang aktif.</p>
                            </div>
                        ) : leaderboard.length === 0 ? (
                            <div className="mt-8 rounded-3xl border border-slate-100 bg-white/80 p-12 text-center shadow-xl backdrop-blur-sm">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mayang-50 text-mayang-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Belum Ada Transaksi</h3>
                                <p className="mt-2 text-slate-500">Jadilah yang pertama untuk memimpin leaderboard di periode ini!</p>
                            </div>
                        ) : (
                            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-100 bg-white/90 shadow-2xl backdrop-blur-md">
                                <table className="w-full text-left">
                                    <thead className="bg-gradient-to-r from-mayang-500 to-mayang-600 text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">
                                                Rank
                                            </th>
                                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">
                                                Nama Pelanggan
                                            </th>
                                            <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider">
                                                Total Belanja
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {leaderboard.map((entry) => (
                                            <tr 
                                                key={entry.ranking} 
                                                className={`transition-colors hover:bg-mayang-50/50 ${entry.ranking <= 3 ? 'bg-mayang-50/30' : ''}`}
                                            >
                                                <td className="whitespace-nowrap px-6 py-5">
                                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold shadow-sm ${
                                                        entry.ranking === 1 ? 'bg-amber-100 text-amber-600 border border-amber-200' :
                                                        entry.ranking === 2 ? 'bg-slate-200 text-slate-600 border border-slate-300' :
                                                        entry.ranking === 3 ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                                        'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {entry.ranking}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-5">
                                                    <span className={`font-semibold ${entry.ranking <= 3 ? 'text-slate-900' : 'text-slate-700'}`}>
                                                        {entry.name}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-5 text-right">
                                                    <span className="font-bold text-mayang-600">
                                                        Rp {formatRupiah(entry.total_spending)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-auto bg-slate-900 py-12 text-center text-sm text-slate-400">
                    <div className="mx-auto max-w-7xl px-4">
                        <p>&copy; 2026 Mayang Modest Wear. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}

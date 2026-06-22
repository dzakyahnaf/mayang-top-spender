import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface LeaderboardProps {
    period: {
        name: string;
        start_date: string;
        end_date: string;
    } | null;
    leaderboard: Array<{
        rank: number;
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

            <div className="min-h-screen bg-gray-50">
                {/* Navbar */}
                <nav className="bg-white shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <Link href="/" className="text-xl font-bold text-pink-600">Mayang Top Spender</Link>
                            <div className="flex items-center gap-4">
                                <Link href={route('leaderboard')} className="text-sm text-gray-600 hover:text-gray-900">Leaderboard</Link>
                                <Link href={route('my-spending')} className="text-sm text-gray-600 hover:text-gray-900">Cek Belanjaanku</Link>
                                <Link href={route('customer.register')} className="text-sm text-gray-600 hover:text-gray-900">Daftar Member</Link>
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700">
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link href={route('login')} className="rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700">
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Content */}
                <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                    <h1 className="text-center text-3xl font-bold text-gray-900">Top Spender Leaderboard</h1>

                    {!period ? (
                        <div className="mt-12 rounded-lg bg-white p-8 text-center shadow-md">
                            <p className="text-gray-500">Belum ada periode kompetisi yang aktif.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mt-4 text-center">
                                <p className="text-lg font-medium text-pink-600">{period.name}</p>
                                <p className="text-sm text-gray-500">
                                    {formatDate(period.start_date)} - {formatDate(period.end_date)}
                                </p>
                            </div>

                            {leaderboard.length === 0 ? (
                                <div className="mt-8 rounded-lg bg-white p-8 text-center shadow-md">
                                    <p className="text-gray-500">Belum ada transaksi di periode ini.</p>
                                </div>
                            ) : (
                                <div className="mt-8 overflow-hidden rounded-lg bg-white shadow-md">
                                    <table className="w-full">
                                        <thead className="bg-pink-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pink-600">
                                                    #
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pink-600">
                                                    Nama Lengkap
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-pink-600">
                                                    Total Belanja
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {leaderboard.map((entry) => (
                                                <tr key={entry.rank} className="hover:bg-gray-50">
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-900">
                                                        {entry.rank}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                        {entry.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                                                        Rp {formatRupiah(entry.total_spending)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <footer className="bg-gray-800 py-8 text-center text-sm text-gray-400">
                    &copy; 2026 Mayang Modest Wear
                </footer>
            </div>
        </>
    );
}

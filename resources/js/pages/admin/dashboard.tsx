import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, ClipboardList, Trophy, Users, Wallet } from 'lucide-react';

interface TopSpender {
    ranking: number;
    name: string;
    total_spending: number;
}

interface Props {
    period: { name: string; start_date: string; end_date: string } | null;
    totalCustomers: number;
    periodStats: { total_transactions: number; total_nominal: number } | null;
    topSpenders: TopSpender[];
}

const formatNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);
// Coin system: 1 Coin = Rp 5 belanja. Only spending values are divided by 5.
const formatCoin = (amount: number) => new Intl.NumberFormat('id-ID').format(Math.floor(amount / 5)) + ' Coin';
const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

export default function AdminDashboard({ period, totalCustomers, periodStats, topSpenders }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/admin/dashboard' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />
            <div className="space-y-8 p-6 font-sans">
                <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>

                {/* Active Period Banner */}
                {period && (
                    <div className="border-mayang-500/20 from-mayang-500/15 via-mayang-500/5 dark:border-mayang-500/20 dark:from-mayang-950/40 relative overflow-hidden border bg-gradient-to-r to-transparent p-6 shadow-lg backdrop-blur-md dark:to-transparent">
                        <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 opacity-5 dark:opacity-10">
                            <Calendar className="text-mayang-500 h-40 w-40" />
                        </div>
                        <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <span className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 border-mayang-500/20 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-extrabold">
                                    <span className="bg-mayang-500 h-1.5 w-1.5 animate-pulse rounded-full"></span>
                                    Periode Aktif
                                </span>
                                <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{period.name}</h3>
                                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                                    Tanggal Kompetisi: {formatDate(period.start_date)} — {formatDate(period.end_date)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Metrics Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Total Customers */}
                    <Card className="relative overflow-hidden border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                Total Customer
                            </CardTitle>
                            <div className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 border-mayang-500/10 flex h-10 w-10 items-center justify-center border">
                                <Users className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="text-3xl font-black text-slate-900 dark:text-white">{formatNumber(totalCustomers)}</div>
                            <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400">Jumlah member terdaftar</p>
                        </CardContent>
                    </Card>

                    {/* Total Transactions */}
                    <Card className="relative overflow-hidden border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                Total Transaksi
                            </CardTitle>
                            <div className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 border-mayang-500/10 flex h-10 w-10 items-center justify-center border">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="text-3xl font-black text-slate-900 dark:text-white">
                                {periodStats ? formatNumber(periodStats.total_transactions) : '-'}
                            </div>
                            <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400">Selama periode aktif berjalan</p>
                        </CardContent>
                    </Card>

                    {/* Total Nominal */}
                    <Card className="relative overflow-hidden border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:col-span-2 lg:col-span-1 dark:border-zinc-800/50 dark:bg-zinc-900/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">Total Coin</CardTitle>
                            <div className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 border-mayang-500/10 flex h-10 w-10 items-center justify-center border">
                                <Wallet className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="text-mayang-600 dark:text-mayang-400 text-3xl font-black">
                                {periodStats ? formatCoin(periodStats.total_nominal) : '-'}
                            </div>
                            <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400">Total coin terkumpul periode ini</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Top 5 Spenders Table */}
                <Card className="overflow-hidden border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <CardHeader className="border-b border-slate-200/40 px-6 py-5 dark:border-zinc-800/80">
                        <div className="flex items-center gap-2">
                            <div className="from-mayang-500 to-mayang-600 shadow-mayang-500/20 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr text-white shadow-md">
                                <Trophy className="h-4.5 w-4.5" />
                            </div>
                            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                                Top 5 Spender {period ? `— ${period.name}` : ''}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {topSpenders.length === 0 ? (
                            <div className="p-12 text-center font-medium text-slate-500 dark:text-zinc-400">
                                Belum ada data transaksi untuk periode ini.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="bg-mayang-50/70 text-mayang-700 border-b border-slate-200/30 text-xs font-bold tracking-wider uppercase dark:border-zinc-800/50 dark:bg-zinc-950/40 dark:text-zinc-400">
                                            <th className="px-6 py-4">Rank</th>
                                            <th className="px-6 py-4">Nama Customer</th>
                                            <th className="px-6 py-4 text-right">Total Coin</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200/30 dark:divide-zinc-800/50">
                                        {topSpenders.map((spender) => {
                                            const isTop3 = spender.ranking <= 3;
                                            return (
                                                <tr
                                                    key={spender.ranking}
                                                    className="hover:bg-mayang-500/5 dark:hover:bg-mayang-500/10 transition-all duration-200"
                                                >
                                                    <td className="px-6 py-4 font-semibold">
                                                        {isTop3 ? (
                                                            <span
                                                                className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-md ${
                                                                    spender.ranking === 1
                                                                        ? 'bg-gradient-to-tr from-amber-400 to-amber-500 shadow-amber-500/20'
                                                                        : spender.ranking === 2
                                                                          ? 'bg-gradient-to-tr from-slate-400 to-slate-500 shadow-slate-500/20'
                                                                          : 'bg-gradient-to-tr from-amber-600 to-amber-700 shadow-amber-700/20'
                                                                }`}
                                                            >
                                                                {spender.ranking}
                                                            </span>
                                                        ) : (
                                                            <span className="pl-2.5 text-slate-500 dark:text-zinc-400">{spender.ranking}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{spender.name}</td>
                                                    <td className="text-mayang-600 dark:text-mayang-400 px-6 py-4 text-right text-base font-black">
                                                        {formatCoin(spender.total_spending)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

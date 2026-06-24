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

const formatRupiah = (amount: number) => new Intl.NumberFormat('id-ID').format(amount);
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
                {/* Active Period Banner */}
                {period && (
                    <div className="border-mayang-100 from-mayang-500/10 to-mayang-600/5 dark:border-mayang-900/30 dark:from-mayang-950/20 dark:to-mayang-950/5 relative overflow-hidden rounded-2xl border bg-gradient-to-r p-6 backdrop-blur-md">
                        <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 opacity-5 dark:opacity-10">
                            <Calendar className="text-mayang-500 h-40 w-40" />
                        </div>
                        <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <span className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
                                    <span className="bg-mayang-500 h-1.5 w-1.5 animate-pulse rounded-full"></span>
                                    Periode Aktif
                                </span>
                                <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{period.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Tanggal Kompetisi: {formatDate(period.start_date)} — {formatDate(period.end_date)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Metrics Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Total Customers */}
                    <Card className="relative overflow-hidden border border-slate-100 bg-white/50 shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800/50 dark:bg-slate-900/40">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                Total Customer
                            </CardTitle>
                            <div className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 flex h-10 w-10 items-center justify-center rounded-xl">
                                <Users className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900 dark:text-white">{formatRupiah(totalCustomers)}</div>
                            <p className="mt-1 text-xs text-slate-500">Jumlah member terdaftar</p>
                        </CardContent>
                    </Card>

                    {/* Total Transactions */}
                    <Card className="relative overflow-hidden border border-slate-100 bg-white/50 shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800/50 dark:bg-slate-900/40">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                Total Transaksi
                            </CardTitle>
                            <div className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 flex h-10 w-10 items-center justify-center rounded-xl">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900 dark:text-white">
                                {periodStats ? formatRupiah(periodStats.total_transactions) : '-'}
                            </div>
                            <p className="mt-1 text-xs text-slate-500">Selama periode aktif berjalan</p>
                        </CardContent>
                    </Card>

                    {/* Total Nominal */}
                    <Card className="relative overflow-hidden border border-slate-100 bg-white/50 shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-md sm:col-span-2 lg:col-span-1 dark:border-slate-800/50 dark:bg-slate-900/40">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                Total Nominal Belanja
                            </CardTitle>
                            <div className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 flex h-10 w-10 items-center justify-center rounded-xl">
                                <Wallet className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-mayang-600 dark:text-mayang-400 text-3xl font-black">
                                {periodStats ? `Rp ${formatRupiah(periodStats.total_nominal)}` : '-'}
                            </div>
                            <p className="mt-1 text-xs text-slate-500">Omzet transaksi terakumulasi</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Top 5 Spenders Table */}
                <Card className="overflow-hidden border border-slate-100 bg-white/50 shadow-xl backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/40">
                    <CardHeader className="border-b border-slate-100 px-6 py-5 dark:border-slate-800/50">
                        <div className="flex items-center gap-2">
                            <div className="from-mayang-500 to-mayang-400 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr text-white">
                                <Trophy className="h-4.5 w-4.5" />
                            </div>
                            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                                Top 5 Spender {period ? `— ${period.name}` : ''}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {topSpenders.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 dark:text-slate-400">Belum ada data transaksi untuk periode ini.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800/50 dark:bg-slate-950/20 dark:text-slate-400">
                                            <th className="px-6 py-4">Rank</th>
                                            <th className="px-6 py-4">Nama Customer</th>
                                            <th className="px-6 py-4 text-right">Total Belanja</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                        {topSpenders.map((spender) => {
                                            const isTop3 = spender.ranking <= 3;
                                            return (
                                                <tr
                                                    key={spender.ranking}
                                                    className="hover:bg-mayang-500/5 dark:hover:bg-mayang-500/10 transition-colors"
                                                >
                                                    <td className="px-6 py-4.5 font-semibold">
                                                        {isTop3 ? (
                                                            <span
                                                                className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-inner ${
                                                                    spender.ranking === 1
                                                                        ? 'bg-gradient-to-tr from-yellow-400 to-yellow-500'
                                                                        : spender.ranking === 2
                                                                          ? 'bg-gradient-to-tr from-slate-300 to-slate-400'
                                                                          : 'bg-gradient-to-tr from-amber-500 to-amber-600'
                                                                }`}
                                                            >
                                                                {spender.ranking}
                                                            </span>
                                                        ) : (
                                                            <span className="pl-2 text-slate-500 dark:text-slate-400">{spender.ranking}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4.5 font-bold text-slate-900 dark:text-slate-100">{spender.name}</td>
                                                    <td className="text-mayang-600 dark:text-mayang-400 px-6 py-4.5 text-right font-black">
                                                        Rp {formatRupiah(spender.total_spending)}
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

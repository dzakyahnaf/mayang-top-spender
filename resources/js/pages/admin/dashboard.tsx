import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ClipboardList, Wallet, Trophy, Calendar } from 'lucide-react';

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
const formatDate = (date: string) => new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
});

export default function AdminDashboard({ period, totalCustomers, periodStats, topSpenders }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />
            <div className="p-6 space-y-8 font-sans">
                {/* Active Period Banner */}
                {period && (
                    <div className="relative overflow-hidden rounded-2xl border border-mayang-100 bg-gradient-to-r from-mayang-500/10 to-mayang-600/5 p-6 backdrop-blur-md dark:border-mayang-900/30 dark:from-mayang-950/20 dark:to-mayang-950/5">
                        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5 dark:opacity-10">
                            <Calendar className="h-40 w-40 text-mayang-500" />
                        </div>
                        <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-mayang-500/10 px-3 py-1 text-xs font-bold text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-mayang-500 animate-pulse"></span>
                                    Periode Aktif
                                </span>
                                <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {period.name}
                                </h3>
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
                    <Card className="relative overflow-hidden border border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/40 shadow-sm backdrop-blur-md transition-all hover:shadow-md hover:-translate-y-0.5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                                Total Customer
                            </CardTitle>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400">
                                <Users className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900 dark:text-white">
                                {formatRupiah(totalCustomers)}
                            </div>
                            <p className="mt-1 text-xs text-slate-500">Jumlah member terdaftar</p>
                        </CardContent>
                    </Card>

                    {/* Total Transactions */}
                    <Card className="relative overflow-hidden border border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/40 shadow-sm backdrop-blur-md transition-all hover:shadow-md hover:-translate-y-0.5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                                Total Transaksi
                            </CardTitle>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400">
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
                    <Card className="relative overflow-hidden border border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/40 shadow-sm backdrop-blur-md transition-all hover:shadow-md hover:-translate-y-0.5 sm:col-span-2 lg:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                                Total Nominal Belanja
                            </CardTitle>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400">
                                <Wallet className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-mayang-600 dark:text-mayang-400">
                                {periodStats ? `Rp ${formatRupiah(periodStats.total_nominal)}` : '-'}
                            </div>
                            <p className="mt-1 text-xs text-slate-500">Omzet transaksi terakumulasi</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Top 5 Spenders Table */}
                <Card className="overflow-hidden border border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/40 shadow-xl backdrop-blur-md">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 px-6 py-5">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-mayang-500 to-mayang-400 text-white">
                                <Trophy className="h-4.5 w-4.5" />
                            </div>
                            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                                Top 5 Spender {period ? `— ${period.name}` : ''}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {topSpenders.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                                Belum ada data transaksi untuk periode ini.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/50">
                                            <th className="py-4 px-6">Rank</th>
                                            <th className="py-4 px-6">Nama Customer</th>
                                            <th className="py-4 px-6 text-right">Total Belanja</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                        {topSpenders.map((spender) => {
                                            const isTop3 = spender.ranking <= 3;
                                            return (
                                                <tr key={spender.ranking} className="transition-colors hover:bg-mayang-500/5 dark:hover:bg-mayang-500/10">
                                                    <td className="py-4.5 px-6 font-semibold">
                                                        {isTop3 ? (
                                                            <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-inner ${
                                                                spender.ranking === 1 ? 'bg-gradient-to-tr from-yellow-400 to-yellow-500' :
                                                                spender.ranking === 2 ? 'bg-gradient-to-tr from-slate-300 to-slate-400' :
                                                                'bg-gradient-to-tr from-amber-500 to-amber-600'
                                                            }`}>
                                                                {spender.ranking}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-500 dark:text-slate-400 pl-2">
                                                                {spender.ranking}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-4.5 px-6 font-bold text-slate-900 dark:text-slate-100">
                                                        {spender.name}
                                                    </td>
                                                    <td className="py-4.5 px-6 text-right font-black text-mayang-600 dark:text-mayang-400">
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

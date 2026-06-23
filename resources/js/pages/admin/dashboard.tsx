import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
const formatDate = (date: string) => new Date(date).toLocaleDateString('id-ID');

export default function AdminDashboard({ period, totalCustomers, periodStats, topSpenders }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />
            <div className="p-6 space-y-6">
                {period && (
                    <div className="rounded-lg border bg-blue-50 dark:bg-blue-950 p-4">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">Periode Aktif: {period.name}</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            {formatDate(period.start_date)} - {formatDate(period.end_date)}
                        </p>
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{formatRupiah(totalCustomers)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transaksi (Periode Aktif)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{periodStats ? formatRupiah(periodStats.total_transactions) : '-'}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Nominal (Periode Aktif)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {periodStats ? `Rp ${formatRupiah(periodStats.total_nominal)}` : '-'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Top 5 Spender {period ? `- ${period.name}` : ''}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {topSpenders.length === 0 ? (
                            <p className="text-muted-foreground text-sm">Belum ada data transaksi.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-2 font-semibold">Rank</th>
                                            <th className="text-left py-3 px-2 font-semibold">Nama</th>
                                            <th className="text-right py-3 px-2 font-semibold">Total Belanja</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topSpenders.map((spender) => (
                                            <tr key={spender.ranking} className="border-b last:border-0">
                                                <td className="py-3 px-2">{spender.ranking}</td>
                                                <td className="py-3 px-2">{spender.name}</td>
                                                <td className="py-3 px-2 text-right">Rp {formatRupiah(spender.total_spending)}</td>
                                            </tr>
                                        ))}
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

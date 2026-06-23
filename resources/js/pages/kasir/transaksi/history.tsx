import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface Transaction {
    id: number;
    amount: number;
    original_amount: number | null;
    notes: string | null;
    created_at: string;
    customer: { name: string };
    period: { name: string };
}

interface PaginatedData {
    data: Transaction[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    transactions: PaginatedData;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'History Transaksi', href: '/kasir/transaksi/history' },
];

const formatRupiah = (val: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(val);

export default function TransactionHistory({ transactions }: Props) {
    const { flash } = usePage<any>().props;
    const today = new Date().toDateString();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="History Transaksi" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">History Transaksi Saya</h1>

                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">{flash.success}</div>
                )}

                <div className="overflow-hidden rounded-lg border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Nominal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Periode</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {transactions.data.map((t) => {
                                const isToday = new Date(t.created_at).toDateString() === today;
                                return (
                                    <tr key={t.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            {new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4 text-sm">{t.customer.name}</td>
                                        <td className="px-6 py-4 text-sm">
                                            {formatRupiah(t.amount)}
                                            {t.original_amount && (
                                                <span className="ml-1 text-xs text-gray-400">(diedit, sebelumnya: {formatRupiah(t.original_amount)})</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">{t.period.name}</td>
                                        <td className="px-6 py-4 text-sm">
                                            {isToday && (
                                                <Link href={route('kasir.transaksi.edit', t.id)} className="text-mayang-600 hover:underline">
                                                    Edit
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {transactions.data.length === 0 && (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Belum ada transaksi.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {transactions.links.length > 3 && (
                    <div className="mt-4 flex gap-1">
                        {transactions.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-mayang-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

interface Transaction {
    id: number;
    amount: number;
    original_amount: number | null;
    notes: string | null;
    created_at: string;
    customer: { name: string };
    cashier: { name: string } | null;
    period: { name: string };
}

interface Props {
    transactions: {
        data: Transaction[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    periods: Array<{ id: number; name: string }>;
    filters: { period_id?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Transaksi', href: '/admin/transaksi' },
];

const formatRupiah = (val: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(val);

export default function TransactionIndex({ transactions, periods, filters }: Props) {
    const { flash } = usePage<any>().props;

    function filterByPeriod(periodId: string) {
        router.get(route('admin.transaksi.index'), periodId ? { period_id: periodId } : {}, { preserveState: true });
    }

    function deleteTransaction(id: number) {
        if (confirm('Yakin ingin menghapus transaksi ini?')) {
            router.delete(route('admin.transaksi.destroy', id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Semua Transaksi" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Semua Transaksi</h1>

                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">{flash.success}</div>
                )}

                <div className="mb-4">
                    <select
                        value={filters.period_id || ''}
                        onChange={(e) => filterByPeriod(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2"
                    >
                        <option value="">Semua Periode</option>
                        {periods.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Nominal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Kasir</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {transactions.data.map((t) => (
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
                                    <td className="px-6 py-4 text-sm">{t.cashier?.name || '-'}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex gap-2">
                                            <Link href={route('admin.transaksi.edit', t.id)} className="text-blue-600 hover:underline">Edit</Link>
                                            <button onClick={() => deleteTransaction(t.id)} className="text-red-600 hover:underline">Hapus</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {transactions.data.length === 0 && (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Belum ada transaksi.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {transactions.links.length > 3 && (
                    <div className="mt-4 flex gap-1">
                        {transactions.links.map((link, i) => (
                            <Link key={i} href={link.url || '#'}
                                className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

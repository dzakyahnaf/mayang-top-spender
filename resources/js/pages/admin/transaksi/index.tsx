import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Calendar, FileText } from 'lucide-react';

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

const formatRupiah = (val: number) => new Intl.NumberFormat('id-ID').format(val);

export default function TransactionIndex({ transactions, periods, filters }: Props) {
    const { flash } = usePage<SharedData>().props;

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
            <div className="p-6 space-y-6 font-sans">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Daftar Transaksi</h1>
                        <p className="text-sm text-slate-500 mt-1">Riwayat seluruh transaksi yang dimasukkan oleh kasir.</p>
                    </div>

                    <div className="relative inline-block w-full sm:w-64">
                        <select
                            value={filters.period_id || ''}
                            onChange={(e) => filterByPeriod(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white/80 dark:bg-slate-900/80 px-4 py-2.5 pr-10 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-mayang-500/20 focus:border-mayang-500 cursor-pointer shadow-sm"
                        >
                            <option value="">Semua Periode</option>
                            {periods.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                            <Calendar className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                {flash?.success && (
                    <div className="rounded-2xl border border-mayang-100 bg-mayang-5/50 p-4 text-mayang-800 dark:text-mayang-300 dark:border-mayang-900/30 text-sm font-semibold">
                        {flash.success}
                    </div>
                )}

                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white/50 shadow-xl dark:border-slate-800/50 dark:bg-slate-900/40 backdrop-blur-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/50">
                                    <th className="py-4 px-6">Tanggal & Waktu</th>
                                    <th className="py-4 px-6">Customer</th>
                                    <th className="py-4 px-6">Nominal Transaksi</th>
                                    <th className="py-4 px-6">Kasir Pelayan</th>
                                    <th className="py-4 px-6 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {transactions.data.map((t) => (
                                    <tr key={t.id} className="transition-colors hover:bg-mayang-500/5 dark:hover:bg-mayang-5/5 text-sm">
                                        <td className="py-4.5 px-6 text-slate-500 dark:text-slate-400">
                                            {new Date(t.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="py-4.5 px-6 font-bold text-slate-900 dark:text-white">
                                            {t.customer.name}
                                        </td>
                                        <td className="py-4.5 px-6">
                                            <div className="flex flex-col">
                                                <span className="font-extrabold text-mayang-600 dark:text-mayang-400">
                                                    Rp {formatRupiah(t.amount)}
                                                </span>
                                                {t.original_amount && (
                                                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 italic mt-0.5">
                                                        diedit (sebelumnya Rp {formatRupiah(t.original_amount)})
                                                    </span>
                                                )}
                                                {t.notes && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                                        <FileText className="h-3 w-3 inline" />
                                                        {t.notes}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4.5 px-6 text-slate-600 dark:text-slate-300">
                                            {t.cashier?.name || <span className="text-slate-400 dark:text-slate-600">-</span>}
                                        </td>
                                        <td className="py-4.5 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-1" asChild>
                                                    <Link href={route('admin.transaksi.edit', t.id)}>
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="rounded-xl flex items-center gap-1"
                                                    onClick={() => deleteTransaction(t.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Hapus
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {transactions.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-500 dark:text-slate-400">
                                            Belum ada data transaksi tercatat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {transactions.links.length > 3 && (
                    <div className="mt-6 flex justify-center gap-1.5">
                        {transactions.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all border ${
                                    link.active
                                        ? 'bg-gradient-to-r from-mayang-500 to-mayang-600 border-mayang-500 text-white shadow-md shadow-mayang-500/20'
                                        : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                                } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, Edit2, FileText, Trash2 } from 'lucide-react';

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
            <div className="space-y-6 p-6 font-sans">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Daftar Transaksi</h1>
                        <p className="mt-1 text-sm text-slate-500">Riwayat seluruh transaksi yang dimasukkan oleh kasir.</p>
                    </div>

                    <div className="relative inline-block w-full sm:w-64">
                        <select
                            value={filters.period_id || ''}
                            onChange={(e) => filterByPeriod(e.target.value)}
                            className="focus:ring-mayang-500/20 focus:border-mayang-500 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 pr-10 text-sm font-semibold text-slate-700 shadow-sm focus:ring-4 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200"
                        >
                            <option value="">Semua Periode</option>
                            {periods.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                            <Calendar className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                {flash?.success && (
                    <div className="border-mayang-100 bg-mayang-5/50 text-mayang-800 dark:text-mayang-300 dark:border-mayang-900/30 rounded-2xl border p-4 text-sm font-semibold">
                        {flash.success}
                    </div>
                )}

                <div className="overflow-hidden rounded-3xl border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-200/30 bg-slate-50/60 text-xs font-bold tracking-wider text-slate-500 uppercase dark:border-zinc-800/50 dark:bg-zinc-950/40 dark:text-zinc-400">
                                    <th className="px-6 py-4">Tanggal & Waktu</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Nominal Transaksi</th>
                                    <th className="px-6 py-4">Kasir Pelayan</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/30 dark:divide-zinc-800/50">
                                {transactions.data.map((t) => (
                                    <tr key={t.id} className="hover:bg-mayang-500/5 dark:hover:bg-mayang-500/10 text-sm transition-all duration-200">
                                        <td className="px-6 py-4.5 text-slate-500 dark:text-zinc-400">
                                            {new Date(t.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="px-6 py-4.5 font-bold text-slate-900 dark:text-white">{t.customer.name}</td>
                                        <td className="px-6 py-4.5">
                                            <div className="flex flex-col">
                                                <span className="text-mayang-600 dark:text-mayang-400 font-extrabold">
                                                    Rp {formatRupiah(t.amount)}
                                                </span>
                                                {t.original_amount && (
                                                    <span className="mt-0.5 text-[11px] font-medium text-slate-400 italic dark:text-zinc-500">
                                                        diedit (sebelumnya Rp {formatRupiah(t.original_amount)})
                                                    </span>
                                                )}
                                                {t.notes && (
                                                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-zinc-400">
                                                        <FileText className="inline h-3 w-3" />
                                                        {t.notes}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="dark:text-zinc-350 px-6 py-4.5 text-slate-600">
                                            {t.cashier?.name || <span className="text-slate-400 dark:text-zinc-600">-</span>}
                                        </td>
                                        <td className="px-6 py-4.5">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center gap-1 rounded-xl border-slate-200 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
                                                    asChild
                                                >
                                                    <Link href={route('admin.transaksi.edit', t.id)}>
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex items-center gap-1 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 transition-all duration-200 hover:bg-rose-500/20 hover:text-rose-700"
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
                                        <td colSpan={5} className="py-12 text-center font-medium text-slate-500 dark:text-zinc-400">
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
                                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                                    link.active
                                        ? 'from-mayang-500 to-mayang-600 border-mayang-500 shadow-mayang-500/20 bg-gradient-to-r text-white shadow-md'
                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:bg-zinc-800/50'
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

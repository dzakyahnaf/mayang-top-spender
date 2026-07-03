import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { History, Pencil } from 'lucide-react';

interface Transaction {
    id: number;
    amount: number;
    original_amount: number | null;
    notes: string | null;
    created_at: string;
    customer: { name: string };
    period: { name: string } | null;
}

interface PaginatedData {
    data: Transaction[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    transactions: PaginatedData;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'History Transaksi', href: '/kasir/transaksi/history' }];

const formatRupiah = (val: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(val);

export default function TransactionHistory({ transactions }: Props) {
    const { flash } = usePage<SharedData>().props;
    const today = new Date().toDateString();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="History Transaksi" />
            <div className="space-y-6 p-6 font-sans">
                <div className="flex items-center gap-3">
                    <div className="bg-mayang-500/10 text-mayang-600 flex h-10 w-10 items-center justify-center rounded-xl">
                        <History className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">History Transaksi Saya</h1>
                        <p className="mt-1 text-sm text-slate-500">Daftar transaksi yang baru saja Anda catat hari ini dan sebelumnya.</p>
                    </div>
                </div>

                {flash?.success && (
                    <div className="bg-mayang-50 border-mayang-100 dark:bg-mayang-950/20 dark:border-mayang-900/30 animate-in fade-in slide-in-from-top-2 mb-6 rounded-2xl border p-4 duration-300">
                        <div className="flex items-center gap-3">
                            <div className="bg-mayang-500 flex h-8 w-8 items-center justify-center rounded-full text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <p className="text-mayang-800 dark:text-mayang-300 text-sm font-semibold">{flash.success}</p>
                        </div>
                    </div>
                )}

                <div className="overflow-hidden rounded-3xl border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200/30 dark:divide-zinc-800/50">
                            <thead className="border-mayang-100/70 bg-mayang-50/70 border-b dark:border-zinc-800/80 dark:bg-zinc-950/40">
                                <tr>
                                    <th className="text-mayang-700 px-6 py-4.5 text-left text-xs font-bold tracking-wider uppercase dark:text-zinc-400">
                                        Tanggal
                                    </th>
                                    <th className="text-mayang-700 px-6 py-4.5 text-left text-xs font-bold tracking-wider uppercase dark:text-zinc-400">
                                        Customer
                                    </th>
                                    <th className="text-mayang-700 px-6 py-4.5 text-left text-xs font-bold tracking-wider uppercase dark:text-zinc-400">
                                        Nominal Belanja
                                    </th>
                                    <th className="text-mayang-700 px-6 py-4.5 text-left text-xs font-bold tracking-wider uppercase dark:text-zinc-400">
                                        Periode
                                    </th>
                                    <th className="text-mayang-700 px-6 py-4.5 text-left text-xs font-bold tracking-wider uppercase dark:text-zinc-400">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/30 bg-transparent dark:divide-zinc-800/50">
                                {transactions.data.map((t) => {
                                    const isToday = new Date(t.created_at).toDateString() === today;
                                    return (
                                        <tr key={t.id} className="hover:bg-mayang-500/5 dark:hover:bg-mayang-500/10 transition-all duration-200">
                                            <td className="dark:text-zinc-350 px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-600">
                                                {new Date(t.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{t.customer.name}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-950 dark:text-zinc-100">
                                                <span className="text-base font-bold">{formatRupiah(t.amount)}</span>
                                                {t.original_amount && (
                                                    <span className="ml-2.5 inline-flex items-center rounded-xl border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                                                        Edited (sebelumnya: {formatRupiah(t.original_amount)})
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-zinc-400">{t.period?.name ?? '-'}</td>
                                            <td className="px-6 py-4 text-sm">
                                                {isToday ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-mayang-600 hover:text-mayang-700 hover:bg-mayang-500/10 gap-1 rounded-xl transition-all duration-200"
                                                        asChild
                                                    >
                                                        <Link href={route('kasir.transaksi.edit', t.id)}>
                                                            <Pencil className="h-3.5 w-3.5" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <span className="dark:text-zinc-550 text-xs text-slate-400 italic">Tidak dapat diedit</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {transactions.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center font-medium text-slate-500 dark:text-zinc-400">
                                            Belum ada transaksi yang tercatat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {transactions.links.length > 3 && (
                    <div className="mt-6 flex items-center justify-center gap-1.5">
                        {transactions.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                                    link.active
                                        ? 'from-mayang-500 to-mayang-600 shadow-mayang-500/20 border-transparent bg-gradient-to-r text-white shadow-md'
                                        : 'dark:text-zinc-350 border-slate-200/80 bg-white/60 text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/50'
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

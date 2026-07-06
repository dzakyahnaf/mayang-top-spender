import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Transaction {
    id: number;
    amount: number;
    original_amount: number | null;
    notes: string | null;
    created_at: string;
    customer: { name: string };
    staff: { name: string } | null;
    period: { name: string } | null;
}

interface PaginatedData {
    data: Transaction[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Filters {
    q?: string;
    period_id?: string;
    date_from?: string;
    date_to?: string;
}

interface Props {
    transactions: PaginatedData;
    periods: Array<{ id: number; name: string }>;
    filters: Filters;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'History Transaksi', href: '/kasir/transaksi/history' }];

const formatRupiah = (val: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(val);

const selectClass =
    'focus:ring-mayang-500/20 focus:border-mayang-500 w-full cursor-pointer appearance-none border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm focus:ring-4 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200';

export default function TransactionHistory({ transactions, periods, filters }: Props) {
    const today = new Date().toDateString();
    const [search, setSearch] = useState(filters.q ?? '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timer = setTimeout(() => applyFilters({ q: search }), 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    function applyFilters(next: Partial<Filters>) {
        const merged: Filters = { ...filters, q: search, ...next };
        const params: Record<string, string> = {};
        (Object.keys(merged) as Array<keyof Filters>).forEach((key) => {
            if (merged[key]) params[key] = merged[key] as string;
        });

        router.get(route('kasir.transaksi.history'), params, { preserveState: true, preserveScroll: true, replace: true });
    }

    function resetFilters() {
        setSearch('');
        router.get(route('kasir.transaksi.history'), {}, { preserveState: true, preserveScroll: true, replace: true });
    }

    const isFiltering = Boolean(filters.q || filters.period_id || filters.date_from || filters.date_to);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="History Transaksi" />
            <div className="space-y-6 p-6 font-sans">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">History Transaksi</h1>
                    <p className="mt-1 text-sm text-slate-500">Daftar transaksi yang baru saja Anda catat hari ini dan sebelumnya.</p>
                </div>

                {/* Filter bar */}
                <div className="space-y-3 border border-slate-200/50 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama atau nomor HP customer..."
                            className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/80 py-5 pl-10 dark:border-zinc-800 dark:bg-zinc-900/80"
                        />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Periode</label>
                            <select
                                value={filters.period_id || ''}
                                onChange={(e) => applyFilters({ period_id: e.target.value })}
                                className={selectClass}
                            >
                                <option value="">Semua Periode</option>
                                {periods.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Dari Tanggal</label>
                            <input
                                type="date"
                                value={filters.date_from || ''}
                                onChange={(e) => applyFilters({ date_from: e.target.value })}
                                className={selectClass}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Sampai Tanggal</label>
                            <input
                                type="date"
                                value={filters.date_to || ''}
                                onChange={(e) => applyFilters({ date_to: e.target.value })}
                                className={selectClass}
                            />
                        </div>

                        {isFiltering && (
                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="flex w-full items-center justify-center gap-1.5 border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Reset Filter
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
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
                                        Nama Kasir
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
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-zinc-400">{t.staff?.name ?? '-'}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-950 dark:text-zinc-100">
                                                <span className="text-base font-bold">{formatRupiah(t.amount)}</span>
                                                {t.original_amount && (
                                                    <span className="ml-2.5 inline-flex items-center border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                                                        Edited (sebelumnya: {formatRupiah(t.original_amount)})
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-zinc-400">{t.period?.name ?? '-'}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-mayang-600 hover:text-mayang-700 hover:bg-mayang-500/10 transition-all duration-200"
                                                        asChild
                                                    >
                                                        <Link href={route('kasir.transaksi.show', t.id)}>Detail</Link>
                                                    </Button>
                                                    {isToday && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-mayang-600 hover:text-mayang-700 hover:bg-mayang-500/10 transition-all duration-200"
                                                            asChild
                                                        >
                                                            <Link href={route('kasir.transaksi.edit', t.id)}>Edit</Link>
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {transactions.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center font-medium text-slate-500 dark:text-zinc-400">
                                            {isFiltering
                                                ? 'Tidak ada transaksi yang cocok dengan filter.'
                                                : 'Belum ada transaksi yang tercatat.'}
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
                                className={`inline-flex items-center justify-center border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
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

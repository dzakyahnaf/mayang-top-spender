import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { formatCoin } from '@/lib/coin';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Banknote, ChevronDown, ClipboardList, Download, Edit2, FileText, Search, Trash2, Wallet, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Transaction {
    id: number;
    amount: number;
    original_amount: number | null;
    notes: string | null;
    created_at: string;
    customer: { name: string };
    cashier: { name: string } | null;
    staff: { name: string } | null;
    period: { name: string };
    running_coin_total: number;
}

interface Filters {
    q?: string;
    period_id?: string;
    cashier_id?: string;
    date_from?: string;
    date_to?: string;
}

interface Stats {
    total_transaksi: number;
    total_nominal: number;
}

interface Props {
    transactions: {
        data: Transaction[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        from: number | null;
    };
    periods: Array<{ id: number; name: string }>;
    cashiers: Array<{ id: number; name: string }>;
    filters: Filters;
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Transaksi', href: '/admin/transaksi' },
];

const formatRupiah = (val: number) => new Intl.NumberFormat('id-ID').format(val);
const formatNumber = (val: number) => new Intl.NumberFormat('id-ID').format(val);

const selectClass =
    'focus:ring-mayang-500/20 focus:border-mayang-500 w-full cursor-pointer appearance-none border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm focus:ring-4 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200';

function buildScopeLabel(filters: Filters, periods: Array<{ id: number; name: string }>, cashiers: Array<{ id: number; name: string }>): string {
    const parts: string[] = [];

    if (filters.period_id) {
        const period = periods.find((p) => String(p.id) === String(filters.period_id));
        parts.push(`periode ${period?.name ?? '-'}`);
    } else {
        parts.push('seluruh periode');
    }

    if (filters.cashier_id) {
        const cashier = cashiers.find((c) => String(c.id) === String(filters.cashier_id));
        parts.push(`outlet ${cashier?.name ?? '-'}`);
    }

    if (filters.date_from || filters.date_to) {
        parts.push(`${filters.date_from || '...'} s/d ${filters.date_to || '...'}`);
    }

    if (filters.q) {
        parts.push(`cari "${filters.q}"`);
    }

    return parts.join(' · ');
}

export default function TransactionIndex({ transactions, periods, cashiers, filters, stats }: Props) {
    const [search, setSearch] = useState(filters.q ?? '');
    const isFirstRender = useRef(true);
    const scopeLabel = buildScopeLabel(filters, periods, cashiers);

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

        router.get(route('admin.transaksi.index'), params, { preserveState: true, preserveScroll: true, replace: true });
    }

    function resetFilters() {
        setSearch('');
        router.get(route('admin.transaksi.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    }

    function deleteTransaction(id: number) {
        if (confirm('Yakin ingin menghapus transaksi ini?')) {
            router.delete(route('admin.transaksi.destroy', id));
        }
    }

    const isFiltering = Boolean(filters.q || filters.period_id || filters.cashier_id || filters.date_from || filters.date_to);

    function exportUrl(routeName: string, withAllFilters: boolean) {
        const source: Filters = withAllFilters ? { ...filters, q: search } : { period_id: filters.period_id, date_from: filters.date_from, date_to: filters.date_to };
        const params: Record<string, string> = {};
        (Object.keys(source) as Array<keyof Filters>).forEach((key) => {
            if (source[key]) params[key] = source[key] as string;
        });
        return route(routeName, params);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Semua Transaksi" />
            <div className="space-y-6 p-6 font-sans">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Daftar Transaksi</h1>
                        <p className="mt-1 text-sm text-slate-500">Riwayat seluruh transaksi yang dimasukkan oleh kasir.</p>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 border-slate-200 dark:border-zinc-800">
                                <Download className="h-4 w-4" />
                                Download Laporan
                                <ChevronDown className="h-3.5 w-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <a href={exportUrl('admin.transaksi.export', true)}>Detail Transaksi (sesuai filter)</a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <a href={exportUrl('admin.transaksi.export-rekap', false)}>Rekap per Outlet</a>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Stats */}
                <div className="grid gap-6 sm:grid-cols-3">
                    <Card className="relative overflow-hidden border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                Jumlah Transaksi
                            </CardTitle>
                            <div className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 border-mayang-500/10 flex h-10 w-10 items-center justify-center border">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="text-3xl font-black text-slate-900 dark:text-white">{formatNumber(stats.total_transaksi)}</div>
                            <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400">Selama {scopeLabel}</p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                Total Transaksi (Rp)
                            </CardTitle>
                            <div className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 border-mayang-500/10 flex h-10 w-10 items-center justify-center border">
                                <Banknote className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="text-3xl font-black text-slate-900 dark:text-white">Rp {formatRupiah(stats.total_nominal)}</div>
                            <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400">Nominal belanja {scopeLabel}</p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">Total Coin</CardTitle>
                            <div className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 border-mayang-500/10 flex h-10 w-10 items-center justify-center border">
                                <Wallet className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="text-mayang-600 dark:text-mayang-400 text-3xl font-black">{formatCoin(stats.total_nominal)}</div>
                            <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400">Coin terkumpul {scopeLabel}</p>
                        </CardContent>
                    </Card>
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

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
                            <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Kasir</label>
                            <select
                                value={filters.cashier_id || ''}
                                onChange={(e) => applyFilters({ cashier_id: e.target.value })}
                                className={selectClass}
                            >
                                <option value="">Semua Kasir</option>
                                {cashiers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
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
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-mayang-50/70 text-mayang-700 border-b border-slate-200/30 text-xs font-bold tracking-wider uppercase dark:border-zinc-800/50 dark:bg-zinc-950/40 dark:text-zinc-400">
                                    <th className="px-6 py-4">No.</th>
                                    <th className="px-6 py-4">Tanggal & Waktu</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Nominal Transaksi</th>
                                    <th className="px-6 py-4">Coin</th>
                                    <th className="px-6 py-4">Kasir Pelayan</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/30 dark:divide-zinc-800/50">
                                {transactions.data.map((t, index) => (
                                    <tr key={t.id} className="hover:bg-mayang-500/5 dark:hover:bg-mayang-500/10 text-sm transition-all duration-200">
                                        <td className="px-6 py-4.5 font-medium text-slate-500 dark:text-zinc-400">
                                            {(transactions.from ?? 1) + index}
                                        </td>
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
                                        <td className="text-mayang-600 dark:text-mayang-400 px-6 py-4.5 font-semibold">
                                            {formatCoin(t.running_coin_total)}
                                        </td>
                                        <td className="dark:text-zinc-350 px-6 py-4.5 text-slate-600">
                                            <div className="flex flex-col">
                                                <span>{t.cashier?.name || <span className="text-slate-400 dark:text-zinc-600">-</span>}</span>
                                                {t.staff && <span className="mt-0.5 text-[11px] text-slate-400 dark:text-zinc-500">{t.staff.name}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4.5">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center gap-1 border-slate-200 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
                                                    asChild
                                                >
                                                    <Link href={route('admin.transaksi.show', t.id)}>
                                                        <FileText className="h-3.5 w-3.5" />
                                                        Detail
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center gap-1 border-slate-200 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
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
                                                    className="flex items-center gap-1 border border-rose-500/20 bg-rose-500/10 text-rose-600 transition-all duration-200 hover:bg-rose-500/20 hover:text-rose-700"
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
                                        <td colSpan={7} className="py-12 text-center font-medium text-slate-500 dark:text-zinc-400">
                                            {isFiltering ? 'Tidak ada transaksi yang cocok dengan filter.' : 'Belum ada data transaksi tercatat.'}
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
                                className={` border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
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

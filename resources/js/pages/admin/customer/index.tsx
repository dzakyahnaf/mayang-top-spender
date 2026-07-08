import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    total_spending?: number;
    ranking?: number | null;
}

interface Props {
    customers: {
        data: Customer[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        from: number | null;
    };
    period: { name: string } | null;
    filters: { q: string; status: string | null };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Customer', href: '/admin/customer' },
];

const formatRupiah = (val: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(val);

function RankBadge({ ranking }: { ranking?: number | null }) {
    if (!ranking) {
        return <span className="text-slate-300 dark:text-zinc-600">—</span>;
    }
    const color =
        ranking === 1
            ? 'bg-gold-500 text-white'
            : ranking === 2
              ? 'bg-slate-400 text-white'
              : ranking === 3
                ? 'bg-orange-800/80 text-white'
                : 'bg-mayang-500/10 text-mayang-700 dark:bg-mayang-500/20 dark:text-mayang-300';
    return <span className={`font-display inline-flex size-8 items-center justify-center text-sm font-bold ${color}`}>{ranking}</span>;
}

export default function CustomerIndex({ customers, period, filters }: Props) {
    const [search, setSearch] = useState(filters.q ?? '');
    const isFirstRender = useRef(true);

    // Debounced search: push the query 400ms after the user stops typing.
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            applyFilters({ q: search });
        }, 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    function applyFilters(next: { q?: string; status?: string }) {
        const params: Record<string, string> = {};
        const q = next.q !== undefined ? next.q : search;
        const status = next.status !== undefined ? next.status : (filters.status ?? '');
        if (q) params.q = q;
        if (status) params.status = status;

        router.get(route('admin.customer.index'), params, { preserveState: true, preserveScroll: true, replace: true });
    }

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus customer ini?')) {
            router.delete(route('admin.customer.destroy', id));
        }
    };

    const isFiltering = Boolean(filters.q) || Boolean(filters.status);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Customer" />
            <div className="space-y-6 p-6 font-sans">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Daftar Customer</h1>
                        {period ? (
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Peringkat & total belanja untuk periode aktif:{' '}
                                <strong className="text-mayang-600 dark:text-mayang-400">{period.name}</strong>
                            </p>
                        ) : (
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Kelola data member terdaftar.</p>
                        )}
                    </div>
                    <Button
                        asChild
                        className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 self-start bg-gradient-to-r font-bold text-white shadow-md sm:self-auto"
                    >
                        <Link href={route('admin.customer.create')} className="flex items-center gap-1.5">
                            <Plus className="h-4 w-4" />
                            Tambah Customer
                        </Link>
                    </Button>
                </div>

                {/* Search & filter bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama, email, atau nomor HP..."
                            className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/70 py-5 pl-10 transition-all dark:border-zinc-800/80 dark:bg-zinc-900/40"
                        />
                    </div>
                    {period && (
                        <select
                            value={filters.status ?? ''}
                            onChange={(e) => applyFilters({ status: e.target.value })}
                            className="focus:ring-mayang-500/20 focus:border-mayang-500 w-full cursor-pointer appearance-none border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm focus:ring-4 focus:outline-none sm:w-56 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200"
                        >
                            <option value="">Semua Customer</option>
                            <option value="spending">Sudah Belanja</option>
                            <option value="no_spending">Belum Belanja</option>
                        </select>
                    )}
                </div>

                <div className="overflow-hidden border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-mayang-50/70 text-mayang-700 border-b border-slate-200/30 text-xs font-bold tracking-wider uppercase dark:border-zinc-800/50 dark:bg-zinc-950/40 dark:text-zinc-400">
                                    <th className="px-6 py-4">No.</th>
                                    {period && <th className="px-6 py-4">Peringkat</th>}
                                    <th className="px-6 py-4">Nama</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Nomor HP</th>
                                    <th className="px-6 py-4">Tanggal Daftar</th>
                                    {period && <th className="px-6 py-4 text-right">Total Belanja</th>}
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/30 dark:divide-zinc-800/50">
                                {customers.data.map((c, index) => (
                                    <tr key={c.id} className="hover:bg-mayang-500/5 dark:hover:bg-mayang-500/10 text-sm transition-all duration-200">
                                        <td className="px-6 py-4 font-medium text-slate-500 dark:text-zinc-400">
                                            {(customers.from ?? 1) + index}
                                        </td>
                                        {period && (
                                            <td className="px-6 py-4">
                                                <RankBadge ranking={c.ranking} />
                                            </td>
                                        )}
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{c.name}</td>
                                        <td className="dark:text-zinc-350 px-6 py-4 text-slate-600">{c.email}</td>
                                        <td className="dark:text-zinc-350 px-6 py-4 text-slate-600">{c.phone}</td>
                                        <td className="px-6 py-4 font-medium text-slate-500 dark:text-zinc-400">
                                            {new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        {period && (
                                            <td className="text-mayang-600 dark:text-mayang-400 px-6 py-4 text-right font-black">
                                                {formatRupiah(c.total_spending || 0)}
                                            </td>
                                        )}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center gap-1 border-slate-200 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
                                                    asChild
                                                >
                                                    <Link href={route('admin.customer.edit', c.id)}>
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex items-center gap-1 border border-rose-500/20 bg-rose-500/10 text-rose-600 transition-all duration-200 hover:bg-rose-500/20 hover:text-rose-700"
                                                    onClick={() => handleDelete(c.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Hapus
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {customers.data.length === 0 && (
                                    <tr>
                                        <td colSpan={period ? 8 : 6} className="py-12 text-center font-medium text-slate-500 dark:text-zinc-400">
                                            {isFiltering ? 'Tidak ada customer yang cocok dengan pencarian.' : 'Belum ada customer terdaftar.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {customers.links.length > 3 && (
                    <div className="mt-6 flex justify-center gap-1.5">
                        {customers.links.map((link, i) => (
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

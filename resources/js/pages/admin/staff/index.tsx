import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Staff {
    id: number;
    name: string;
    user: { id: number; name: string } | null;
}

interface Cashier {
    id: number;
    name: string;
}

interface Props {
    staff: {
        data: Staff[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        from: number | null;
    };
    cashiers: Cashier[];
    filters: { q: string };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Data Kasir', href: '/admin/staff' }];

export default function StaffIndex({ staff, cashiers, filters }: Props) {
    const [search, setSearch] = useState(filters.q ?? '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            router.get(route('admin.staff.index'), search ? { q: search } : {}, { preserveState: true, preserveScroll: true, replace: true });
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const { data, setData, post, processing, errors, reset } = useForm({ user_id: '', name: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.staff.store'), { onSuccess: () => reset() });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus staff ini?')) {
            router.delete(route('admin.staff.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Kasir" />
            <div className="space-y-6 p-6 font-sans">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Data Kasir</h1>
                    <p className="mt-1 text-sm text-slate-500">Daftar semua nama staff kasir dari seluruh outlet.</p>
                </div>

                <div className="overflow-hidden border border-slate-200/50 bg-white/70 p-6 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col items-start gap-3 sm:flex-row">
                        <div className="w-full space-y-2 sm:w-56">
                            <Label htmlFor="user_id" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Outlet
                            </Label>
                            <select
                                id="user_id"
                                value={data.user_id}
                                onChange={(e) => setData('user_id', e.target.value)}
                                className="focus:ring-mayang-500/20 focus:border-mayang-500 h-11.5 w-full cursor-pointer appearance-none border border-slate-200 bg-white/60 px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 focus:ring-4 focus:outline-none dark:border-zinc-800/80 dark:bg-zinc-950/40 dark:text-zinc-200"
                            >
                                <option value="">Pilih outlet...</option>
                                {cashiers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.user_id} />
                        </div>
                        <div className="w-full flex-1 space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Nama Staff Baru
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nama lengkap staff"
                                className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/60 py-5.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
                            />
                            <InputError message={errors.name} />
                        </div>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 mt-7 flex items-center gap-1.5 bg-gradient-to-r font-bold text-white"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah
                        </Button>
                    </form>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama staff atau outlet..."
                        className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/70 py-5 pl-10 transition-all dark:border-zinc-800/80 dark:bg-zinc-900/40"
                    />
                </div>

                <div className="overflow-hidden border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-mayang-50/70 text-mayang-700 border-b border-slate-200/30 text-xs font-bold tracking-wider uppercase dark:border-zinc-800/50 dark:bg-zinc-950/40 dark:text-zinc-400">
                                    <th className="px-6 py-4">No.</th>
                                    <th className="px-6 py-4">Nama Staff</th>
                                    <th className="px-6 py-4">Outlet</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/30 dark:divide-zinc-800/50">
                                {staff.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center font-medium text-slate-500 dark:text-zinc-400">
                                            {search ? 'Tidak ada staff yang cocok dengan pencarian.' : 'Belum ada data staff.'}
                                        </td>
                                    </tr>
                                ) : (
                                    staff.data.map((s, index) => (
                                        <tr key={s.id} className="hover:bg-mayang-500/5 dark:hover:bg-mayang-500/10 text-sm transition-all duration-200">
                                            <td className="px-6 py-4 font-medium text-slate-500 dark:text-zinc-400">
                                                {(staff.from ?? 1) + index}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{s.name}</td>
                                            <td className="dark:text-zinc-350 px-6 py-4 text-slate-600">{s.user?.name ?? '-'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex items-center gap-1 border border-rose-500/20 bg-rose-500/10 text-rose-600 transition-all duration-200 hover:bg-rose-500/20 hover:text-rose-700"
                                                    onClick={() => handleDelete(s.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Hapus
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {staff.links.length > 3 && (
                    <div className="mt-6 flex justify-center gap-1.5">
                        {staff.links.map((link, i) => (
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

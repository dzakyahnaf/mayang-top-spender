import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, Edit2, Plus, Trash2 } from 'lucide-react';

interface Period {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    deleted_at: string | null;
}

interface Props {
    periods: Period[];
}

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

export default function PeriodeIndex({ periods }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Periode', href: '/admin/periode' }];

    const handleActivate = (id: number) => {
        if (confirm('Apakah Anda yakin ingin mengaktifkan periode ini?')) {
            router.put(route('admin.periode.activate', id));
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus periode ini?')) {
            router.delete(route('admin.periode.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Periode" />
            <div className="space-y-6 p-6 font-sans">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Kelola Periode</h1>
                        <p className="mt-1 text-sm text-slate-500">Daftar & atur durasi periode kompetisi Top Spender.</p>
                    </div>
                    <Button
                        asChild
                        className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 self-start bg-gradient-to-r font-bold text-white shadow-md sm:self-auto"
                    >
                        <Link href={route('admin.periode.create')} className="flex items-center gap-1.5">
                            <Plus className="h-4 w-4" />
                            Tambah Periode
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-mayang-50/70 text-mayang-700 border-b border-slate-200/30 text-xs font-bold tracking-wider uppercase dark:border-zinc-800/50 dark:bg-zinc-950/40 dark:text-zinc-400">
                                    <th className="px-6 py-4">Nama Periode</th>
                                    <th className="px-6 py-4">Tanggal Mulai</th>
                                    <th className="px-6 py-4">Tanggal Selesai</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/30 dark:divide-zinc-800/50">
                                {periods.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center font-medium text-slate-500 dark:text-zinc-400">
                                            Belum ada data periode kompetisi.
                                        </td>
                                    </tr>
                                ) : (
                                    periods.map((period) => (
                                        <tr
                                            key={period.id}
                                            className="hover:bg-mayang-500/5 dark:hover:bg-mayang-500/10 text-sm transition-all duration-200"
                                        >
                                            <td className="px-6 py-4.5 font-bold text-slate-900 dark:text-white">{period.name}</td>
                                            <td className="dark:text-zinc-350 px-6 py-4.5 text-slate-600">{formatDate(period.start_date)}</td>
                                            <td className="dark:text-zinc-350 px-6 py-4.5 text-slate-600">{formatDate(period.end_date)}</td>
                                            <td className="px-6 py-4.5">
                                                {period.is_active ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/50 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-zinc-800/50 dark:bg-zinc-800/40 dark:text-zinc-400">
                                                        Tidak Aktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4.5">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-1 border-slate-200 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
                                                        asChild
                                                    >
                                                        <Link href={route('admin.periode.edit', period.id)}>
                                                            <Edit2 className="h-3.5 w-3.5" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    {!period.is_active && (
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="bg-mayang-500/10 text-mayang-600 hover:bg-mayang-500/20 dark:bg-mayang-500/20 dark:text-mayang-400 border-mayang-500/20 flex items-center gap-1 border transition-all duration-200"
                                                            onClick={() => handleActivate(period.id)}
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            Aktifkan
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="flex items-center gap-1 border border-rose-500/20 bg-rose-500/10 text-rose-600 transition-all duration-200 hover:bg-rose-500/20 hover:text-rose-700"
                                                        onClick={() => handleDelete(period.id)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

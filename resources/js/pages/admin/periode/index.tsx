import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
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
    const { flash } = usePage<SharedData>().props;

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
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Kelola Periode</h1>
                        <p className="mt-1 text-sm text-slate-500">Daftar & atur durasi periode kompetisi Top Spender.</p>
                    </div>
                    <Button
                        asChild
                        className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 self-start rounded-xl bg-gradient-to-r font-bold text-white shadow-md sm:self-auto"
                    >
                        <Link href={route('admin.periode.create')} className="flex items-center gap-1.5">
                            <Plus className="h-4 w-4" />
                            Tambah Periode
                        </Link>
                    </Button>
                </div>

                {flash?.success && (
                    <div className="border-mayang-100 bg-mayang-50/50 text-mayang-800 dark:text-mayang-300 dark:border-mayang-900/30 rounded-2xl border p-4 text-sm font-semibold">
                        {flash.success}
                    </div>
                )}

                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white/50 shadow-xl backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/40">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800/50 dark:bg-slate-950/20 dark:text-slate-400">
                                    <th className="px-6 py-4">Nama Periode</th>
                                    <th className="px-6 py-4">Tanggal Mulai</th>
                                    <th className="px-6 py-4">Tanggal Selesai</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {periods.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-500 dark:text-slate-400">
                                            Belum ada data periode kompetisi.
                                        </td>
                                    </tr>
                                ) : (
                                    periods.map((period) => (
                                        <tr key={period.id} className="hover:bg-mayang-500/5 dark:hover:bg-mayang-5/5 text-sm transition-colors">
                                            <td className="px-6 py-4.5 font-bold text-slate-900 dark:text-white">{period.name}</td>
                                            <td className="px-6 py-4.5 text-slate-600 dark:text-slate-300">{formatDate(period.start_date)}</td>
                                            <td className="px-6 py-4.5 text-slate-600 dark:text-slate-300">{formatDate(period.end_date)}</td>
                                            <td className="px-6 py-4.5">
                                                {period.is_active ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                        Tidak Aktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4.5">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="outline" size="sm" className="flex items-center gap-1 rounded-xl" asChild>
                                                        <Link href={route('admin.periode.edit', period.id)}>
                                                            <Edit2 className="h-3.5 w-3.5" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    {!period.is_active && (
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="bg-mayang-500/10 text-mayang-600 hover:bg-mayang-500/20 dark:bg-mayang-500/20 dark:text-mayang-400 flex items-center gap-1 rounded-xl"
                                                            onClick={() => handleActivate(period.id)}
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            Aktifkan
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="flex items-center gap-1 rounded-xl"
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

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit2, Plus, Trash2 } from 'lucide-react';

interface Reward {
    id: number;
    rank_start: number;
    rank_end: number;
    title: string;
    description: string | null;
    sort_order: number;
}

interface Props {
    rewards: Reward[];
}

const rankLabel = (r: Reward) => (r.rank_start === r.rank_end ? `Peringkat ${r.rank_start}` : `Peringkat ${r.rank_start}-${r.rank_end}`);

export default function HadiahIndex({ rewards }: Props) {
    const { flash } = usePage<SharedData>().props;

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Hadiah', href: '/admin/hadiah' }];

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus hadiah ini?')) {
            router.delete(route('admin.hadiah.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Hadiah" />
            <div className="space-y-6 p-6 font-sans">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Kelola Hadiah</h1>
                        <p className="mt-1 text-sm text-slate-500">Atur daftar hadiah berdasarkan rentang peringkat leaderboard.</p>
                    </div>
                    <Button
                        asChild
                        className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 self-start bg-gradient-to-r font-bold text-white shadow-md sm:self-auto"
                    >
                        <Link href={route('admin.hadiah.create')} className="flex items-center gap-1.5">
                            <Plus className="h-4 w-4" />
                            Tambah Hadiah
                        </Link>
                    </Button>
                </div>

                {flash?.success && (
                    <div className="border-mayang-100 bg-mayang-50/50 text-mayang-800 dark:text-mayang-300 dark:border-mayang-900/30 border p-4 text-sm font-semibold">
                        {flash.success}
                    </div>
                )}

                <div className="overflow-hidden border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-mayang-50/70 text-mayang-700 border-b border-slate-200/30 text-xs font-bold tracking-wider uppercase dark:border-zinc-800/50 dark:bg-zinc-950/40 dark:text-zinc-400">
                                    <th className="px-6 py-4">Peringkat</th>
                                    <th className="px-6 py-4">Hadiah</th>
                                    <th className="px-6 py-4">Keterangan</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/30 dark:divide-zinc-800/50">
                                {rewards.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center font-medium text-slate-500 dark:text-zinc-400">
                                            Belum ada data hadiah.
                                        </td>
                                    </tr>
                                ) : (
                                    rewards.map((reward) => (
                                        <tr
                                            key={reward.id}
                                            className="hover:bg-mayang-500/5 dark:hover:bg-mayang-500/10 text-sm transition-all duration-200"
                                        >
                                            <td className="px-6 py-4.5">
                                                <span className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 border-mayang-500/20 inline-flex rounded-full border px-3 py-1 text-xs font-bold">
                                                    {rankLabel(reward)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4.5 font-bold text-slate-900 dark:text-white">{reward.title}</td>
                                            <td className="dark:text-zinc-350 max-w-xs px-6 py-4.5 text-slate-600">{reward.description ?? '-'}</td>
                                            <td className="px-6 py-4.5">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-1 border-slate-200 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
                                                        asChild
                                                    >
                                                        <Link href={route('admin.hadiah.edit', reward.id)}>
                                                            <Edit2 className="h-3.5 w-3.5" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="flex items-center gap-1 border border-rose-500/20 bg-rose-500/10 text-rose-600 transition-all duration-200 hover:bg-rose-500/20 hover:text-rose-700"
                                                        onClick={() => handleDelete(reward.id)}
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
